import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white/50 py-4 px-4 sm:px-8 text-xs text-slate-400">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
        <div>
          © 2026 Đề án chuyên ngành - Nhóm 04
        </div>
      </div>
    </footer>
  );
};

