import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Calendar, FileText, LayoutDashboard, Pill } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function BottomNav() {
  const location = useLocation();
  const { role } = useAuth();

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Pharmacy', path: '/pharmacist', icon: Pill, highlight: true },
    { label: 'Bookings', path: '/appointments', icon: Calendar },
    { label: 'Records', path: '/records', icon: FileText },
    { 
      label: role === 'pharmacist' ? 'Command' : role === 'doctor' ? 'Clinical' : 'Dashboard', 
      path: '/dashboard', 
      icon: LayoutDashboard 
    },
  ];

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800/80 px-2 py-1.5 flex justify-around items-center shadow-lg transition-colors"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;

        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer select-none ${
              isActive 
                ? 'text-emerald-600 dark:text-emerald-400 font-black' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'
            }`}
          >
            <div className="relative">
              <Icon size={20} className={`transition-transform ${isActive ? 'scale-110 text-emerald-600 dark:text-emerald-400' : ''}`} />
              {item.highlight && !isActive && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
              )}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[62px]">
              {item.label}
            </span>
          </NavLink>
        );
      })}
    </nav>
  );
}
