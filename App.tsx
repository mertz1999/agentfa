import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Content from './pages/Content';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Help from './pages/Help';
import { db } from './services/mockDb';

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Initialize Theme
    const initTheme = async () => {
      const user = await db.getUserProfile();
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
      const theme = savedTheme || user.themePreference || 'light';
      
      setIsDarkMode(theme === 'dark');
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    initTheme();
  }, []);

  const toggleTheme = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    const themeStr = newMode ? 'dark' : 'light';
    localStorage.setItem('theme', themeStr);
    
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Persist to DB
    const user = await db.getUserProfile();
    await db.updateUserProfile({ ...user, themePreference: themeStr });
  };

  return (
    <Router>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden font-sans transition-colors duration-200" dir="rtl">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
          
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6 text-gray-900 dark:text-gray-100">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/content" element={<Content />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/help" element={<Help />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;