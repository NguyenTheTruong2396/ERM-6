import React, { useState } from 'react';
import { Menu, Bell, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  onToggleMobile: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobile }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-20 bg-white border-b border-slate-200/80 flex items-center justify-between px-6 sm:px-10 flex-shrink-0 font-sans relative z-30 select-none">

      {/* Bên trái: Nút Hamburger Mobile & Tiêu đề cổng */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleMobile}
          className="p-2 -ml-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 md:hidden transition-colors"
          title="Mở menu"
        >
          <Menu className="w-6 h-6 stroke-[2]" />
        </button>

        <div className="flex flex-col">
          <span className="text-base font-extrabold text-slate-900 tracking-tight">
            English Road Map 6
          </span>
        </div>
      </div>

      {/* Bên phải: Chỉ giữ lại chuông thông báo */}
      <div className="flex items-center">
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2.5 rounded-xl transition-all ${showNotifications ? 'bg-sky-50 text-sky-600' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
            title="Thông báo lớp học"
          >
            <Bell className="w-5 h-5 stroke-[2]" />
            {/* Chấm đỏ báo tin mới */}
            <span className="flex h-2.5 w-2.5 absolute top-2 right-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500 ring-2 ring-white"></span>
            </span>
          </button>

          {/* Menu Thông báo nảy ra mượt mượt */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-4 space-y-3 z-50"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-extrabold text-sm text-slate-900">Thông báo mới</span>
                  <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md">2 chưa đọc</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-sky-50/60 border border-sky-100 flex gap-3">
                    <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-900">Em Trần Văn A vừa nộp bài</p>
                      <p className="text-slate-500 text-[11px]">Unit 2: My House • 5 phút trước</p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-100 flex gap-3">
                    <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-900">Cảnh báo lỗ hổng Ngữ pháp</p>
                      <p className="text-slate-500 text-[11px]">Lớp 6A1 có 8 học sinh chưa đạt Unit 1</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};