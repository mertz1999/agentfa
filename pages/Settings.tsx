import React, { useState, useEffect } from 'react';
import { db } from '../services/mockDb';
import { SiteConfig } from '../types';
import { Save, Check, RefreshCw, Smartphone, Globe, ShoppingCart, Loader2, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { Logo } from '../components/Logo';

const Settings: React.FC = () => {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [telegramStatus, setTelegramStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle');
  
  // WooCommerce States
  const [wooStatus, setWooStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle');
  const [syncProductStatus, setSyncProductStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [syncOrderStatus, setSyncOrderStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');

  useEffect(() => {
    db.getSiteConfig().then(setConfig);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;
    setIsSaving(true);
    await db.updateSiteConfig(config);
    setTimeout(() => setIsSaving(false), 800);
  };

  const testTelegramConnection = () => {
    if (!config?.telegramBotToken) return;
    setTelegramStatus('checking');
    setTimeout(() => setTelegramStatus('success'), 1500); 
  };

  const testWooConnection = async () => {
      if(!config?.woocommerce?.baseUrl) return;
      setWooStatus('checking');
      try {
          await db.updateSiteConfig(config); // Save keys first
          await db.testWooConnection();
          setWooStatus('success');
      } catch (e) {
          setWooStatus('error');
      }
  };

  const syncWooProducts = async () => {
      if(wooStatus !== 'success' && !config?.woocommerce?.isConnected) {
          alert("ابتدا اتصال ووکامرس را برقرار کنید.");
          return;
      }
      setSyncProductStatus('syncing');
      await db.syncWooProducts();
      setSyncProductStatus('success');
      // Update local lastSync time
      db.getSiteConfig().then(c => setConfig(prev => prev ? {...prev, woocommerce: c.woocommerce} : null));
  };

  const syncWooOrders = async () => {
      if(wooStatus !== 'success' && !config?.woocommerce?.isConnected) {
        alert("ابتدا اتصال ووکامرس را برقرار کنید.");
        return;
      }
      setSyncOrderStatus('syncing');
      await db.syncWooOrders();
      setSyncOrderStatus('success');
  };

  if (!config) return <div className="p-8 text-center dark:text-gray-300">در حال بارگذاری...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">تنظیمات و اتصالات</h1>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* General Site Info */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Globe size={20} className="text-indigo-500" /> مشخصات سایت و برندینگ
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">نام فروشگاه</label>
                    <input 
                        type="text" 
                        value={config.name} 
                        onChange={e => setConfig({...config, name: e.target.value})}
                        className="w-full border dark:border-gray-600 rounded-lg p-2.5 bg-gray-50 dark:bg-gray-700 dark:text-white focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">آدرس سایت (URL)</label>
                    <input 
                        type="text" 
                        value={config.url} 
                        onChange={e => setConfig({...config, url: e.target.value})}
                        className="w-full border dark:border-gray-600 rounded-lg p-2.5 bg-gray-50 dark:bg-gray-700 dark:text-white focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none transition ltr text-left"
                        dir="ltr"
                    />
                </div>
            </div>

            {/* Logo Settings */}
            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">لوگوی اپلیکیشن (URL)</label>
                <div className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-600 relative overflow-hidden">
                         <div className="absolute inset-0 flex items-center justify-center">
                            <Logo className="w-10 h-10" url={config.logoUrl} />
                         </div>
                    </div>
                    <div className="flex-1">
                        <div className="relative">
                            <input 
                                type="text" 
                                value={config.logoUrl || ''} 
                                onChange={e => setConfig({...config, logoUrl: e.target.value})}
                                placeholder="https://example.com/logo.png"
                                className="w-full border dark:border-gray-600 rounded-lg pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-gray-700 dark:text-white focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm"
                                dir="ltr"
                            />
                            <ImageIcon size={18} className="absolute left-3 top-3 text-gray-400" />
                        </div>
                        <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">لینک تصویر لوگو (فرمت PNG یا SVG). در صورت خالی بودن، از لوگوی پیش‌فرض ایجنت فا استفاده می‌شود.</p>
                    </div>
                </div>
            </div>
        </div>

        {/* WooCommerce Integration */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 border-l-4 border-l-purple-500">
            <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                    <ShoppingCart size={20} className="text-purple-600" /> اتصال به ووکامرس (WooCommerce)
                </h2>
                {config.woocommerce?.isConnected && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold flex items-center gap-1">
                        <Check size={12}/> متصل
                    </span>
                )}
            </div>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                برای همگام‌سازی محصولات و سفارش‌ها، اطلاعات API ووکامرس را وارد کنید. (مسیر: ووکامرس {'>'} پیکربندی {'>'} پیشرفته {'>'} REST API)
            </p>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">آدرس سایت ووکامرس (Base URL)</label>
                    <input 
                        type="text" 
                        value={config.woocommerce?.baseUrl || ''} 
                        onChange={e => setConfig({
                            ...config, 
                            woocommerce: { ...config.woocommerce!, baseUrl: e.target.value }
                        })}
                        placeholder="https://myshop.com"
                        className="w-full border dark:border-gray-600 rounded-lg p-2.5 bg-gray-50 dark:bg-gray-700 dark:text-white focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-purple-500 outline-none transition"
                        dir="ltr"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">کلید مصرف‌کننده (Consumer Key)</label>
                        <input 
                            type="password" 
                            value={config.woocommerce?.consumerKey || ''} 
                            onChange={e => setConfig({
                                ...config, 
                                woocommerce: { ...config.woocommerce!, consumerKey: e.target.value }
                            })}
                            className="w-full border dark:border-gray-600 rounded-lg p-2.5 bg-gray-50 dark:bg-gray-700 dark:text-white focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-purple-500 outline-none transition"
                            dir="ltr"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">رمز مصرف‌کننده (Consumer Secret)</label>
                        <input 
                            type="password" 
                            value={config.woocommerce?.consumerSecret || ''} 
                            onChange={e => setConfig({
                                ...config, 
                                woocommerce: { ...config.woocommerce!, consumerSecret: e.target.value }
                            })}
                            className="w-full border dark:border-gray-600 rounded-lg p-2.5 bg-gray-50 dark:bg-gray-700 dark:text-white focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-purple-500 outline-none transition"
                            dir="ltr"
                        />
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                    <button 
                        type="button" 
                        onClick={testWooConnection}
                        disabled={!config.woocommerce?.baseUrl}
                        className="px-4 py-2 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-lg font-medium hover:bg-purple-200 dark:hover:bg-purple-900/60 transition disabled:opacity-50 flex items-center gap-2"
                    >
                        {wooStatus === 'checking' ? <Loader2 className="animate-spin w-4 h-4"/> : null}
                        تست اتصال ووکامرس
                    </button>
                    
                    {config.woocommerce?.isConnected && (
                        <>
                            <button 
                                type="button" 
                                onClick={syncWooProducts}
                                className="px-4 py-2 bg-white border border-gray-300 dark:bg-gray-700 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition flex items-center gap-2"
                            >
                                {syncProductStatus === 'syncing' ? <Loader2 className="animate-spin w-4 h-4"/> : <RefreshCw className="w-4 h-4"/>}
                                همگام‌سازی محصولات
                            </button>
                            <button 
                                type="button" 
                                onClick={syncWooOrders}
                                className="px-4 py-2 bg-white border border-gray-300 dark:bg-gray-700 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition flex items-center gap-2"
                            >
                                {syncOrderStatus === 'syncing' ? <Loader2 className="animate-spin w-4 h-4"/> : <RefreshCw className="w-4 h-4"/>}
                                همگام‌سازی سفارش‌ها
                            </button>
                        </>
                    )}
                </div>

                {wooStatus === 'success' && <p className="text-green-600 dark:text-green-400 text-sm flex items-center gap-1"><Check size={14}/> اتصال ووکامرس با موفقیت برقرار شد.</p>}
                {wooStatus === 'error' && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle size={14}/> خطا در اتصال. لطفا آدرس و کلیدها را بررسی کنید.</p>}
                
                {config.woocommerce?.lastSync && (
                    <p className="text-xs text-gray-400 mt-2">
                        آخرین همگام‌سازی: {new Date(config.woocommerce.lastSync).toLocaleString('fa-IR')}
                    </p>
                )}
            </div>
        </div>

        {/* Telegram Integration */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Smartphone size={20} className="text-blue-500" /> اتصال به تلگرام
            </h2>
            <div className="flex gap-4 items-end">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">توکن ربات تلگرام</label>
                    <input 
                        type="password" 
                        value={config.telegramBotToken} 
                        onChange={e => setConfig({...config, telegramBotToken: e.target.value})}
                        className="w-full border dark:border-gray-600 rounded-lg p-2.5 bg-gray-50 dark:bg-gray-700 dark:text-white focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition"
                        dir="ltr"
                    />
                </div>
                <button 
                    type="button" 
                    onClick={testTelegramConnection}
                    disabled={!config.telegramBotToken}
                    className="px-4 py-2.5 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 rounded-lg font-medium hover:bg-blue-100 dark:hover:bg-blue-900/60 transition disabled:opacity-50"
                >
                    {telegramStatus === 'checking' ? '...' : 'تست اتصال'}
                </button>
            </div>
            {telegramStatus === 'success' && <p className="text-green-600 dark:text-green-400 text-sm mt-2 flex items-center gap-1"><Check size={14}/> اتصال تلگرام موفقیت‌آمیز بود.</p>}
        </div>

        <div className="flex justify-end pt-4">
            <button 
                type="submit" 
                disabled={isSaving}
                className="flex items-center gap-2 px-8 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/30 disabled:opacity-70"
            >
                {isSaving ? <Loader2 className="animate-spin w-5 h-5"/> : <Save size={20} />}
                {isSaving ? 'در حال ذخیره...' : 'ذخیره تنظیمات'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;