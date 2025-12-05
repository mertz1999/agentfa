import React, { useEffect, useState } from 'react';
import { db } from '../services/mockDb';
import { DashboardData } from '../types';
import { DollarSign, Package, FileText, ShoppingCart, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [reportPeriod, setReportPeriod] = useState<'weekly' | 'monthly'>('weekly');

  useEffect(() => {
    db.getDashboardData().then(setData);
  }, []);

  if (!data) return <div className="p-10 text-center text-gray-500 dark:text-gray-400">در حال بارگذاری اطلاعات...</div>;

  const metrics = reportPeriod === 'weekly' ? data.weekly : data.monthly;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">داشبورد «ایجنت فا»</h1>
        <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
            <button 
                onClick={() => setReportPeriod('weekly')}
                className={`px-4 py-1 text-sm rounded-md transition-all ${reportPeriod === 'weekly' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200 font-bold' : 'text-gray-500 dark:text-gray-400'}`}
            >
                هفتگی
            </button>
            <button 
                onClick={() => setReportPeriod('monthly')}
                className={`px-4 py-1 text-sm rounded-md transition-all ${reportPeriod === 'monthly' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200 font-bold' : 'text-gray-500 dark:text-gray-400'}`}
            >
                ماهانه
            </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">درآمد ({reportPeriod === 'weekly' ? '۷ روز' : '۳۰ روز'})</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white" dir="ltr">{metrics.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400">
                <DollarSign size={24} />
            </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">سفارشات موفق</p>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.successCount}</span>
                </div>
            </div>
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-full text-indigo-600 dark:text-indigo-400">
                <ShoppingCart size={24} />
            </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">سفارشات ناموفق</p>
                <p className="text-2xl font-bold text-red-500">{metrics.failedCount}</p>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-full text-red-500">
                <AlertTriangle size={24} />
            </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">میانگین ارزش سبد</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white" dir="ltr">{Math.round(metrics.avgOrderValue).toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
                <TrendingUp size={24} />
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Products */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <Package className="text-indigo-500" size={20}/> محصولات پرفروش
                </h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-right">
                    <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                        <tr>
                            <th className="px-6 py-3">نام محصول</th>
                            <th className="px-6 py-3">تعداد فروش</th>
                            <th className="px-6 py-3">درآمد حاصله</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {data.topProducts.length > 0 ? data.topProducts.map((p, i) => (
                            <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="px-6 py-3 font-medium text-gray-800 dark:text-gray-200">{p.name}</td>
                                <td className="px-6 py-3 text-gray-600 dark:text-gray-400">{p.sold}</td>
                                <td className="px-6 py-3 text-gray-600 dark:text-gray-400" dir="ltr">{p.revenue.toLocaleString()}</td>
                            </tr>
                        )) : (
                            <tr><td colSpan={3} className="px-6 py-4 text-center text-gray-400">داده‌ای یافت نشد</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
          </div>

          {/* Marketing Insight */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl shadow-lg p-6 text-white flex flex-col justify-between">
              <div>
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <Lightbulb className="text-yellow-300" /> پیشنهاد هوشمند
                  </h3>
                  <p className="leading-relaxed opacity-90 text-sm">
                      {data.marketingInsight}
                  </p>
              </div>
              <button className="mt-6 bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg text-sm font-medium transition backdrop-blur-sm">
                  ایجاد کمپین جدید
              </button>
          </div>
      </div>
    </div>
  );
};

export default Dashboard;