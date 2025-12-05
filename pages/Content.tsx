import React, { useState, useEffect, useRef } from 'react';
import { db } from '../services/mockDb';
import { generateSEOContent, regenerateArticleTitle } from '../services/geminiService';
import { Article } from '../types';
import { Sparkles, CheckCircle, Clock, FileText, Loader, Search, XCircle, Send, Save, RefreshCw, PenTool } from 'lucide-react';

const Content: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Active Article State
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  
  // Local Editing State
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  
  // Loading states for regeneration
  const [isRegeneratingTitle, setIsRegeneratingTitle] = useState(false);
  const [isRegeneratingBody, setIsRegeneratingBody] = useState(false);

  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
        db.getArticles(searchTerm).then(setArticles);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Sync edit state when selection changes
  useEffect(() => {
    if (selectedArticle) {
      setEditTitle(selectedArticle.title);
      setEditContent(selectedArticle.content);
      // Scroll to editor if status is draft
      if (selectedArticle.status === 'draft' || selectedArticle.status === 'generating') {
        setTimeout(() => editorRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }
  }, [selectedArticle]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsGenerating(true);
    
    const tempId = Date.now().toString();
    const tempArticle: Article = {
        id: tempId,
        title: `در حال تولید: ${topic}...`,
        keyword: topic,
        status: 'generating',
        content: '',
        createdAt: new Date().toISOString()
    };
    
    setArticles(prev => [tempArticle, ...prev]);
    setSelectedArticle(tempArticle);

    try {
      const result = await generateSEOContent(topic);
      
      const newArticle: Article = {
        id: tempId,
        title: result.title,
        keyword: topic,
        status: 'draft',
        content: result.content,
        createdAt: new Date().toISOString()
      };

      await db.createArticle(newArticle);
      setArticles(prev => prev.map(a => a.id === tempId ? newArticle : a));
      setSelectedArticle(newArticle); 
      setTopic('');
    } catch (error) {
      console.error("Generation failed");
      setArticles(prev => prev.filter(a => a.id !== tempId));
      setSelectedArticle(null);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!selectedArticle) return;
    const updated = { 
        ...selectedArticle, 
        title: editTitle, 
        content: editContent 
    };
    await db.updateArticle(selectedArticle.id, { title: editTitle, content: editContent });
    setArticles(prev => prev.map(a => a.id === selectedArticle.id ? updated : a));
    setSelectedArticle(updated);
    alert('پیش‌نویس ذخیره شد');
  };

  const handlePublish = async () => {
    if (!selectedArticle) return;
    const updated = {
        ...selectedArticle,
        title: editTitle,
        content: editContent,
        status: 'published' as const
    };
    await db.updateArticle(selectedArticle.id, updated);
    setArticles(prev => prev.map(a => a.id === selectedArticle.id ? updated : a));
    setSelectedArticle(updated);
    alert('مقاله با موفقیت منتشر شد');
  };

  const handleReject = async () => {
    if (!selectedArticle) return;
    await db.updateArticleStatus(selectedArticle.id, 'rejected');
    setArticles(prev => prev.map(a => a.id === selectedArticle.id ? {...a, status: 'rejected'} : a));
    setSelectedArticle(prev => prev ? {...prev, status: 'rejected'} : null);
  };

  const handleRegenerateTitle = async () => {
    if (!selectedArticle) return;
    setIsRegeneratingTitle(true);
    const newTitle = await regenerateArticleTitle(selectedArticle.keyword, editTitle);
    setEditTitle(newTitle);
    setIsRegeneratingTitle(false);
  };

  const handleRegenerateBody = async () => {
    if (!selectedArticle) return;
    setIsRegeneratingBody(true);
    const result = await generateSEOContent(selectedArticle.keyword);
    setEditContent(result.content);
    setIsRegeneratingBody(false);
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-8rem)] gap-6">
      
      {/* Sidebar List (25%) */}
      <div className="w-full lg:w-1/4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-3">کمپین محتوا</h2>
            <form onSubmit={handleGenerate} className="space-y-2 mb-3">
                <input 
                    type="text" 
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="موضوع مقاله جدید..."
                    disabled={isGenerating}
                />
                <button 
                    type="submit"
                    disabled={isGenerating}
                    className="w-full bg-indigo-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                >
                    {isGenerating ? <Loader className="animate-spin w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                    {isGenerating ? '...' : 'تولید کن'}
                </button>
            </form>
            <div className="relative">
                <input 
                    type="text" 
                    placeholder="جستجو..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-2 py-1.5 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-xs"
                />
                <Search size={14} className="absolute left-2 top-2 text-gray-400" />
            </div>
        </div>

        <div className="flex-1 overflow-y-auto">
            {articles.map(article => (
                <div 
                    key={article.id}
                    onClick={() => article.status !== 'generating' && setSelectedArticle(article)}
                    className={`p-3 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition ${selectedArticle?.id === article.id ? 'bg-indigo-50 dark:bg-indigo-900/30 border-r-4 border-r-indigo-600' : ''}`}
                >
                    <div className="flex justify-between items-center mb-1">
                         <span className={`text-xs font-medium truncate ${article.status === 'rejected' ? 'line-through text-gray-400' : 'text-gray-800 dark:text-gray-200'}`}>
                             {article.title}
                         </span>
                         {article.status === 'generating' && <Loader className="w-3 h-3 animate-spin text-indigo-500"/>}
                         {article.status === 'published' && <CheckCircle className="w-3 h-3 text-green-500"/>}
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400">
                        <span>{new Date(article.createdAt).toLocaleDateString('fa-IR')}</span>
                        <span className={`${article.status === 'draft' ? 'text-yellow-600' : ''}`}>
                            {article.status === 'draft' ? 'پیش‌نویس' : article.status}
                        </span>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Editor & Actions (75%) */}
      <div className="flex-1 flex gap-4 overflow-hidden" ref={editorRef}>
          {selectedArticle ? (
             <>
                {/* Main Editor */}
                <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
                         <div className="flex items-center gap-2">
                             <span className={`w-2 h-2 rounded-full ${
                                 selectedArticle.status === 'published' ? 'bg-green-500' : 
                                 selectedArticle.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
                             }`}></span>
                             <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                 {selectedArticle.status === 'draft' ? 'پیش‌نویس (قابل ویرایش)' : 
                                  selectedArticle.status === 'published' ? 'منتشر شده' : 'رد شده'}
                             </span>
                         </div>
                         <div className="flex gap-2">
                            <button onClick={handleSaveDraft} className="px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-1 transition">
                                <Save size={16} /> ذخیره پیش‌نویس
                            </button>
                            {selectedArticle.status !== 'published' && (
                                <button onClick={handlePublish} className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1 transition shadow-sm">
                                    <Send size={16} /> انتشار در سایت
                                </button>
                            )}
                         </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {/* Title Editor */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">عنوان مقاله</label>
                            <input 
                                type="text" 
                                value={editTitle} 
                                onChange={e => setEditTitle(e.target.value)}
                                className="w-full text-2xl font-bold text-gray-900 dark:text-white bg-transparent border-b border-transparent hover:border-gray-200 focus:border-indigo-500 focus:outline-none pb-2 transition"
                            />
                        </div>

                        {/* Body Editor */}
                        <div className="h-full">
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">متن مقاله (Markdown)</label>
                            <textarea 
                                value={editContent}
                                onChange={e => setEditContent(e.target.value)}
                                className="w-full h-[calc(100%-2rem)] bg-transparent resize-none text-gray-700 dark:text-gray-300 leading-8 focus:outline-none font-sans"
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* AI Tools Panel */}
                <div className="w-64 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 p-4 flex flex-col gap-4">
                    <h3 className="font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2 text-sm">
                        <Sparkles size={16} className="text-indigo-500"/> ابزارهای هوشمند
                    </h3>
                    
                    <div className="space-y-3">
                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">بازنویسی عنوان</p>
                            <button 
                                onClick={handleRegenerateTitle}
                                disabled={isRegeneratingTitle}
                                className="w-full text-xs py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900/50 flex items-center justify-center gap-1 transition"
                            >
                                {isRegeneratingTitle ? <Loader className="w-3 h-3 animate-spin"/> : <RefreshCw className="w-3 h-3"/>} پیشنهاد جدید
                            </button>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">بازنویسی کل متن</p>
                            <button 
                                onClick={handleRegenerateBody}
                                disabled={isRegeneratingBody}
                                className="w-full text-xs py-1.5 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded hover:bg-purple-100 dark:hover:bg-purple-900/50 flex items-center justify-center gap-1 transition"
                            >
                                {isRegeneratingBody ? <Loader className="w-3 h-3 animate-spin"/> : <PenTool className="w-3 h-3"/>} تولید مجدد
                            </button>
                        </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button 
                            onClick={handleReject}
                            className="w-full py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg flex items-center justify-center gap-1 transition"
                        >
                            <XCircle size={16}/> رد کردن مقاله
                        </button>
                    </div>
                </div>
             </> 
          ) : (
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center text-gray-400">
                <FileText className="w-16 h-16 mb-4 opacity-20" />
                <p>برای ویرایش یا مشاهده، یک مقاله را انتخاب کنید.</p>
            </div>
          )}
      </div>

    </div>
  );
};

export default Content;