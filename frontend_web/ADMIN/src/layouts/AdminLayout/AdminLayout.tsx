import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Footer } from './Footer';

export const AdminLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#FAFAFA] text-slate-800 antialiased font-sans overflow-hidden">
      {/* Sidebar điều hướng */}
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />

      {/* Khung nội dung chính */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Thanh Header */}
        <Header onToggleMobile={() => setMobileOpen(prev => !prev)} />

        {/* Thân trang có thể cuộn */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
          <div>
            <Outlet />
          </div>
          {/* Chân trang Footer */}
          <Footer />
        </main>
      </div>
    </div>
  );
};

