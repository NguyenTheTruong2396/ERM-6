import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="pt-8 pb-4 border-t border-slate-200/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 mt-8">
      <div className="flex items-center gap-2">
        <span>© 2026 Đồ án Chuyên ngành - Nhóm 04</span>
      </div>

      <div className="flex items-center gap-4 text-slate-500 text-xs">
        <a href="#help" className="hover:text-slate-900 transition-colors">Tài liệu HDSD</a>
        <a href="#support" className="hover:text-slate-900 transition-colors">Hỗ trợ kỹ thuật</a>
      </div>
    </footer>
  );
};

