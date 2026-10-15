import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import AiAssistant from '../AiAssistant';
import BottomNav from '../BottomNav';
import InstallAppBanner from './InstallAppBanner';

export default function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors selection:bg-blue-500 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
      />

      {/* Main Content Area */}
      <div 
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          isCollapsed ? 'lg:ml-20' : 'lg:ml-72'
        }`}
      >
        {/* Top Navbar Header */}
        <TopNavbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Dynamic Page Routed Body */}
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 flex flex-col">
          {children}
        </main>
      </div>

      {/* Mobile Sticky Bottom Navigation */}
      <BottomNav />

      {/* Mobile PWA Install Prompt Banner */}
      <InstallAppBanner />

      {/* Floating Clinical AI Assistant Widget */}
      <AiAssistant />
    </div>
  );
}
