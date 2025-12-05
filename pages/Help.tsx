import React from 'react';
import { HelpCircle, MessageCircle, PenTool, Database, FileEdit } from 'lucide-react';

const Help: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">مرکز راهنمای «ایجنت فا»</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">دستیار هوشمند شما برای مدیریت فروشگاه و محتوا</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
                <FileEdit size={20} />
            </div>
            <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-2">تولید و ویرایش محتوا</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                1. در بخش «کمپین محتوا»، موضوع خود را وارد کنید تا هوش مصنوعی مقاله را تولید کند.<br/>
                2. مقاله به صورت کامل نمایش داده می‌شود. می‌توانید عنوان و متن را در لحظه ویرایش کنید.<br/>
                3. از دکمه‌های "بازنویسی" برای تغییر بخش‌های خاص توسط AI استفاده کنید.<br/>
                4. پس از تایید نهایی، دکمه "افزودن به سایت" را بزنید.
            </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
                <Database size={20} />
            </div>
            <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-2">مدیریت محصولات و دسته‌بندی</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                در صفحه محصولات، می‌توانید به چت هوشمند دستور دهید:<br/>
                <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-1 rounded">"دسته‌بندی تمام کفش‌ها را به پوشاک ورزشی تغییر بده"</span><br/>
                ایجنت فا تغییرات را اعمال کرده و به شما گزارش می‌دهد.
            </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <h2 className="font-bold text-lg text-gray-800 dark:text-white">سوالات متداول</h2>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
            <details className="group p-6">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-gray-800 dark:text-gray-200">
                    <span>آیا می‌توانم مقالات را قبل از انتشار تغییر دهم؟</span>
                    <span className="transition group-open:rotate-180">
                        <HelpCircle size={16} />
                    </span>
                </summary>
                <div className="text-gray-600 dark:text-gray-400 mt-3 text-sm leading-relaxed">
                    بله، در نسخه جدید «ایجنت فا»، یک ویرایشگر کامل وجود دارد که می‌توانید متن، عنوان و کلمات کلیدی را قبل از انتشار نهایی تغییر دهید یا بازنویسی کنید.
                </div>
            </details>
            <details className="group p-6">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-gray-800 dark:text-gray-200">
                    <span>چگونه ربات تلگرام را متصل کنم؟</span>
                    <span className="transition group-open:rotate-180">
                        <HelpCircle size={16} />
                    </span>
                </summary>
                <div className="text-gray-600 dark:text-gray-400 mt-3 text-sm leading-relaxed">
                    به بخش تنظیمات بروید، توکن ربات خود را از BotFather دریافت کرده و در فیلد مربوطه وارد کنید. سپس دکمه تست اتصال را بزنید.
                </div>
            </details>
        </div>
      </div>
    </div>
  );
};

export default Help;