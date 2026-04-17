import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-3">
      <span className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${!isDark ? 'text-accent-blue' : 'text-slate-500'}`}>Sand</span>
      <button 
        onClick={toggleTheme}
        className="relative w-12 h-24 bg-accent-blue rounded-full p-1.5 flex flex-col justify-between items-center transition-all duration-300 shadow-xl shadow-black/20 overflow-hidden hover:scale-105"
        aria-label="Toggle Theme"
      >
        <div 
          className={`absolute left-1.5 w-9 h-9 bg-ink rounded-full transition-transform duration-300 ease-in-out ${isDark ? 'translate-y-12' : 'translate-y-0'}`}
          style={{ transitionTimingFunction: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' }}
        />
        <div className="relative z-10 w-9 h-9 flex items-center justify-center">
          <Sun size={20} className={`transition-colors duration-300 ${isDark ? 'text-paper' : 'text-ink'}`} />
        </div>
        <div className="relative z-10 w-9 h-9 flex items-center justify-center">
          <Moon size={20} className={`transition-colors duration-300 ${isDark ? 'text-ink' : 'text-paper'}`} />
        </div>
      </button>
      <span className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${isDark ? 'text-slate-700' : 'text-slate-400'}`}>Night</span>
    </div>
  );
}
