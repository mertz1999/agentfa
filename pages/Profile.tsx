import React, { useState, useEffect } from 'react';
import { db } from '../services/mockDb';
import { UserProfile } from '../types';
import { User, Mail, Briefcase, FileText, Camera } from 'lucide-react';

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    db.getUserProfile().then(setProfile);
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (profile) {
      await db.updateUserProfile(profile);
      alert('پروفایل به‌روزرسانی شد');
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto py-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">پروفایل کاربری</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Banner/Header */}
        <div className="h-32 bg-indigo-600 dark:bg-indigo-800"></div>
        
        <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-12 mb-6">
                <div className="relative">
                    <img 
                        src={profile.avatarUrl} 
                        alt="Profile" 
                        className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 bg-white object-cover"
                    />
                    <button className="absolute bottom-0 right-0 p-1.5 bg-gray-800 text-white rounded-full hover:bg-gray-700 border-2 border-white dark:border-gray-800">
                        <Camera size={14} />
                    </button>
                </div>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <User size={16} className="text-gray-400" /> نام کامل
                        </label>
                        <input 
                            type="text" 
                            value={profile.name} 
                            onChange={e => setProfile({...profile, name: e.target.value})}
                            className="w-full border dark:border-gray-600 rounded-lg p-2.5 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <Mail size={16} className="text-gray-400" /> ایمیل
                        </label>
                        <input 
                            type="email" 
                            value={profile.email} 
                            disabled
                            className="w-full border dark:border-gray-600 rounded-lg p-2.5 bg-gray-50 dark:bg-gray-900 text-gray-500"
                        />
                    </div>
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <Briefcase size={16} className="text-gray-400" /> نقش سازمانی
                        </label>
                        <input 
                            type="text" 
                            value={profile.role} 
                            onChange={e => setProfile({...profile, role: e.target.value})}
                            className="w-full border dark:border-gray-600 rounded-lg p-2.5 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                </div>

                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <FileText size={16} className="text-gray-400" /> بیوگرافی کوتاه
                    </label>
                    <textarea 
                        rows={4}
                        value={profile.bio} 
                        onChange={e => setProfile({...profile, bio: e.target.value})}
                        className="w-full border dark:border-gray-600 rounded-lg p-2.5 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                    ></textarea>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                    <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">
                        ذخیره تغییرات
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;