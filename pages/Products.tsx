
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../services/mockDb';
import { processProductCommand, generateProductSEO } from '../services/geminiService';
import { Product, ChatMessage } from '../types';
import { Send, Bot, User, Loader2, Search, Filter, Plus, X, Wand2, Globe } from 'lucide-react';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'assistant',
      text: "سلام! من دستیار هوشمند شما هستم. می‌تونید از من بخواید قیمت‌ها رو تغییر بدم، موجودی رو چک کنم یا دسته‌بندی محصولات رو اصلاح کنم.",
      timestamp: Date.now()
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // New Product Modal State
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    stock: 0,
    categories: [] as string[],
    image: 'https://picsum.photos/200/200',
    description: '',
    shortDescription: '',
    tags: [] as string[]
  });
  const [tempCategory, setTempCategory] = useState('');
  const [isGeneratingSEO, setIsGeneratingSEO] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    // Debounced search
    const timer = setTimeout(() => {
      db.getProducts(searchTerm).then(setProducts);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchProducts = async () => {
    const data = await db.getProducts(searchTerm);
    setProducts(data);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: chatInput,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsProcessing(true);

    try {
      const result = await processProductCommand(userMsg.text, products);

      if (result.operations.length > 0) {
        for (const op of result.operations) {
          await db.updateProduct(op.productId, op.updates);
        }
        await fetchProducts();
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: result.message,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, aiMsg]);

    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'system',
        text: "خطا در پردازش درخواست. لطفا دوباره تلاش کنید.",
        timestamp: Date.now()
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateSEO = async () => {
    if (!newProduct.name) return;
    setIsGeneratingSEO(true);
    // Join categories for context if multiple
    const catContext = newProduct.categories.join(', ') || tempCategory;
    const seo = await generateProductSEO(newProduct.name, catContext, newProduct.price);
    setNewProduct(prev => ({
      ...prev,
      description: seo.description,
      shortDescription: seo.shortDescription,
      tags: seo.tags,
      categories: seo.categories.length > 0 ? seo.categories : prev.categories
    }));
    setIsGeneratingSEO(false);
  };

  const handleCreateProduct = async () => {
    setIsCreating(true);
    // If temp category has text but not added, add it
    const finalCategories = [...newProduct.categories];
    if (tempCategory.trim() && !finalCategories.includes(tempCategory.trim())) {
        finalCategories.push(tempCategory.trim());
    }

    const p: Product = {
      id: Date.now().toString(),
      sku: `SKU-${Math.floor(Math.random() * 1000)}`,
      isActive: true,
      ...newProduct,
      categories: finalCategories
    };
    
    // This will trigger the mock backend to also push to WooCommerce if connected
    await db.addProduct(p);
    
    await fetchProducts();
    setIsCreating(false);
    setShowModal(false);
    setNewProduct({ name: '', price: 0, stock: 0, categories: [], image: 'https://picsum.photos/200/200', description: '', shortDescription: '', tags: [] });
    setTempCategory('');
  };

  const addCategory = () => {
      if(tempCategory.trim() && !newProduct.categories.includes(tempCategory.trim())){
          setNewProduct({...newProduct, categories: [...newProduct.categories, tempCategory.trim()]});
          setTempCategory('');
      }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-8rem)] gap-6 relative">
      
      {/* Product List Section */}
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">موجودی انبار ({products.length})</h2>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowModal(true)}
              className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm flex items-center gap-2 hover:bg-indigo-700 transition"
            >
              <Plus size={16} /> محصول جدید
            </button>
            <div className="relative">
                <input 
                    type="text" 
                    placeholder="جستجو در محصولات..." 
                    className="pl-8 pr-4 py-2 border rounded-lg text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search size={16} className="absolute left-2 top-2.5 text-gray-400" />
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 bg-white dark:bg-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map(product => (
              <div key={product.id} className={`border border-gray-100 dark:border-gray-700 rounded-lg p-3 hover:shadow-md transition-shadow flex gap-3 ${!product.isActive ? 'opacity-60 bg-gray-50 dark:bg-gray-900' : 'dark:bg-gray-750'}`}>
                <div className="relative">
                    <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded-md bg-gray-100 dark:bg-gray-700" />
                    {product.externalId && (
                        <div className="absolute top-0 right-0 bg-white dark:bg-gray-800 rounded-bl-md p-0.5" title="سینک شده با ووکامرس">
                            <Globe size={12} className="text-purple-500"/>
                        </div>
                    )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white truncate">{product.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{product.sku}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-2">
                      {product.categories.map(c => (
                          <span key={c} className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">{c}</span>
                      ))}
                  </div>

                  <div className="flex justify-between items-end">
                    <div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 block">قیمت</span>
                        <span className="font-bold text-gray-900 dark:text-gray-100">{product.price.toLocaleString()}</span>
                    </div>
                    <div className="text-left">
                        <span className="text-xs text-gray-500 dark:text-gray-400 block">موجودی</span>
                        <span className={`font-medium ${product.stock < 10 ? 'text-red-500' : 'text-green-600 dark:text-green-400'}`}>
                            {product.stock} عدد
                        </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Agent Section */}
      <div className="w-full lg:w-96 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-indigo-600 text-white flex items-center gap-2">
          <Bot size={20} />
          <h2 className="font-semibold">دستیار هوشمند</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-lg p-3 text-sm ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : msg.role === 'system'
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                  : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100 rounded-tr-none shadow-sm'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 rounded-tr-none shadow-sm">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-300 text-sm">
                    <Loader2 className="animate-spin w-4 h-4" />
                    <span>در حال پردازش دستور...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="دستور متنی (فارسی)..."
              className="flex-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isProcessing}
            />
            <button 
              type="submit" 
              className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              disabled={isProcessing}
            >
              <Send size={18} className="transform rotate-180" />
            </button>
          </form>
        </div>
      </div>

      {/* New Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">افزودن محصول جدید</h3>
              <button onClick={() => setShowModal(false)}><X size={24} className="text-gray-400 hover:text-red-500" /></button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">نام محصول</label>
                  <input type="text" className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-2 text-sm" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">دسته‌بندی‌ها</label>
                  <div className="flex gap-2">
                    <input 
                        type="text" 
                        className="flex-1 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-2 text-sm" 
                        value={tempCategory} 
                        onChange={e => setTempCategory(e.target.value)} 
                        onKeyDown={e => e.key === 'Enter' && addCategory()}
                        placeholder="افزودن دسته..." 
                    />
                    <button onClick={addCategory} className="px-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 rounded-lg text-lg">+</button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                      {newProduct.categories.map(cat => (
                          <span key={cat} className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs rounded-md flex items-center gap-1">
                              {cat}
                              <button onClick={() => setNewProduct({...newProduct, categories: newProduct.categories.filter(c => c !== cat)})}><X size={12}/></button>
                          </span>
                      ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">قیمت (تومان)</label>
                  <input type="number" className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-2 text-sm" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">موجودی</label>
                  <input type="number" className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-2 text-sm" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: Number(e.target.value)})} />
                </div>
              </div>

              {/* AI Section */}
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-100 dark:border-indigo-800">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-indigo-900 dark:text-indigo-300 flex items-center gap-2"><Wand2 size={18}/> سئو و محتوا (AI)</h4>
                  <button 
                    onClick={handleGenerateSEO}
                    disabled={isGeneratingSEO || !newProduct.name}
                    className="px-3 py-1.5 bg-indigo-600 text-white text-xs rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-1 transition"
                  >
                    {isGeneratingSEO ? <Loader2 className="animate-spin w-3 h-3" /> : null}
                    {isGeneratingSEO ? 'در حال تولید...' : 'تولید خودکار'}
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-indigo-800 dark:text-indigo-300 mb-1">توضیح کوتاه</label>
                    <input type="text" className="w-full border border-indigo-200 dark:border-indigo-800 dark:bg-gray-800 dark:text-white rounded-md p-2 text-sm" value={newProduct.shortDescription} onChange={e => setNewProduct({...newProduct, shortDescription: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-indigo-800 dark:text-indigo-300 mb-1">تگ‌ها (با کاما جدا کنید)</label>
                    <input type="text" className="w-full border border-indigo-200 dark:border-indigo-800 dark:bg-gray-800 dark:text-white rounded-md p-2 text-sm" value={newProduct.tags.join(', ')} onChange={e => setNewProduct({...newProduct, tags: e.target.value.split(',').map(t => t.trim())})} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-indigo-800 dark:text-indigo-300 mb-1">توضیحات کامل (HTML/Text)</label>
                    <textarea className="w-full border border-indigo-200 dark:border-indigo-800 dark:bg-gray-800 dark:text-white rounded-md p-2 text-sm h-24" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})}></textarea>
                  </div>
                </div>
              </div>

            </div>

            <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-800 rounded-b-xl">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm transition">انصراف</button>
              <button 
                onClick={handleCreateProduct} 
                disabled={isCreating}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 font-medium transition shadow-lg shadow-indigo-500/20 flex items-center gap-2"
              >
                  {isCreating && <Loader2 className="animate-spin w-4 h-4"/>}
                  ذخیره و ارسال به ووکامرس
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Products;
