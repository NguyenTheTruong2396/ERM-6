import React from 'react';
import { Menu, Bell } from 'lucide-react';

interface HeaderProps {
  onToggleMobile: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobile }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200/80 flex items-center justify-between px-4 sm:px-8 flex-shrink-0">
      {/* Mobile Hamburger Button */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onToggleMobile} 
          className="p-2 -ml-2 text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-100 md:hidden transition-colors"
          title="Mở menu"
        >
          <Menu className="w-5 h-5 stroke-[1.5]" />
        </button>
        <div className="text-xs font-medium text-slate-500 hidden sm:block">
          Cổng quản trị Tiếng Anh 6
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-3">
        {/* Chuông thông báo hiệu ứng radar màu xanh lá nhấp nháy */}
        <button 
          className="relative p-2 text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-50 transition-colors" 
          title="Có thông báo mới"
        >
          <Bell className="w-4 h-4 stroke-[1.5]" />
          <span className="flex h-2.5 w-2.5 absolute top-1.5 right-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 ring-2 ring-white"></span>
          </span>
        </button>
        
        <div className="h-4 w-px bg-slate-200"></div>
        
        <div className="flex items-center gap-2 pl-1 cursor-pointer">
          <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-semibold text-xs flex items-center justify-center border border-slate-200">
            AD
          </div>
          <span className="text-xs font-medium text-slate-800 hidden md:inline">Admin</span>
        </div>
      </div>
    </header>
  );
};

