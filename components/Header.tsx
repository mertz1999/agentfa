import React, { useEffect, useState } from 'react';
import { Menu, Bell, Moon, Sun } from 'lucide-react';
import { Logo } from './Logo';
import { db } from '../services/mockDb';
import { SiteConfig } from '../types';

interface HeaderProps {
  toggleSidebar: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isDarkMode, toggleTheme }) => {
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);

  useEffect(() => {
    db.getSiteConfig().then(setSiteConfig);
  }, []);

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button onClick={toggleSidebar} className="text-gray-500 dark:text-gray-400 focus:outline-none lg:hidden hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors">
          <Menu size={24} />
        </button>
        {/* Mobile Branding */}
        <div className="flex items-center gap-2 lg:hidden">
             <Logo className="w-8 h-8" url={siteConfig?.logoUrl} />
             <span className="font-bold text-lg text-gray-800 dark:text-white">ایجنت فا</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-700 dark:text-gray-400 dark:hover:text-yellow-400 transition-all"
          title={isDarkMode ? 'حالت روز' : 'حالت شب'}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-300 relative transition-all">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-800"></span>
        </button>
        
        <div className="hidden sm:flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 font-mono" dir="ltr">v2.1.0</span>
        </div>
      </div>
    </header>
  );
};

export default Header;