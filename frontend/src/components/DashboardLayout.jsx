import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-slate-50 flex overflow-x-hidden">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 w-full overflow-x-hidden lg:pl-64">
        {/* Top Navbar */}
        <Navbar onOpenSidebar={() => setSidebarOpen(true)} />

        {/* Page Outlet */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fadeIn">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
