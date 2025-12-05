import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, FileText, Settings, X, HelpCircle, User } from 'lucide-react';
import { db } from '../services/mockDb';
import { UserProfile, SiteConfig } from '../types';
import { Logo } from './Logo';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);

  useEffect(() => {
    db.getUserProfile().then(setUser);
    db.getSiteConfig().then(setSiteConfig);
  }, []);

  const navItems = [
    { icon: LayoutDashboard, label: 'داشبورد', path: '/dashboard' },
    { icon: Package, label: 'محصولات و ایجنت', path: '/products' },
    { icon: FileText, label: 'کمپین محتوا', path: '/content' },
    { icon: Settings, label: 'تنظیمات و اتصال', path: '/settings' },
    { icon: HelpCircle, label: 'راهنما', path: '/help' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden ${isOpen ? 'block' : 'hidden'}`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Sidebar Container */}
      <div className={`fixed inset-y-0 right-0 z-30 w-64 overflow-y-auto transition-transform duration-300 transform bg-gray-900 dark:bg-gray-950 text-white lg:translate-x-0 lg:static lg:inset-0 ${isOpen ? 'translate-x-0' : 'translate-x-full'} border-l border-gray-800 dark:border-gray-900 shadow-xl`}>
        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-800 dark:border-gray-900">
          <div className="flex items-center gap-3">
            <Logo className="w-9 h-9" url={siteConfig?.logoUrl} />
            <span className="font-bold text-xl tracking-tight text-white">ایجنت فا</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="mt-6 px-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white dark:hover:bg-gray-900'
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              <item.icon className="w-5 h-5 ms-3" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-800 dark:border-gray-900 bg-gray-900 dark:bg-gray-950">
          <NavLink to="/profile" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 dark:hover:bg-gray-900 rounded-lg transition-colors group">
              <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold overflow-hidden border-2 border-indigo-400 group-hover:border-indigo-300 transition-colors">
                {user?.avatarUrl ? <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover"/> : <User size={20}/>}
              </div>
              <div className="text-right flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">{user?.name || 'کاربر'}</p>
                  <p className="text-gray-500 text-xs truncate group-hover:text-gray-400">{user?.role || 'ادمین'}</p>
              </div>
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default Sidebar;