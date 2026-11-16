import React from 'react';
import { UserCheck, X, Sparkles } from 'lucide-react';

interface UserDetailModalProps {
  user: any;
  onClose: () => void;
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({ user, onClose }) => {
  if (!user) return null;

  const words = user.name ? user.name.split(' ') : [];
  const initials = words.length >= 2
    ? (words[words.length - 2][0] + words[words.length - 1][0]).toUpperCase()
    : (user.name ? user.name.slice(0, 2).toUpperCase() : 'HS');

  return (
    <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in duration-150">

        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-slate-900 stroke-[1.5]" />
            <h3 className="text-sm font-semibold text-slate-900 tracking-tight">Hồ sơ chi tiết học sinh</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors">
            <X className="w-4 h-4 stroke-[1.5]" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-800 font-bold text-sm flex items-center justify-center border border-slate-200">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-semibold text-slate-900">{user.name}</h4>
                <span className="font-mono text-xs text-slate-400 font-medium">{user.code}</span>
              </div>
              <div className="text-xs text-slate-400">{user.email}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50/60 rounded-lg border border-slate-100">
              <span className="text-slate-400 block mb-0.5">Lớp học</span>
              <span className="font-semibold text-slate-800 text-sm">{user.className || 'Chưa xếp lớp'}</span>
            </div>
            <div className="p-3 bg-slate-50/60 rounded-lg border border-slate-100">
              <span className="text-slate-400 block mb-0.5">Tiến độ SGK</span>
              <span className="font-semibold text-slate-800 text-sm">
                {user.progress ? `${user.progress.completedUnits}/12 Unit (${user.progress.percentage}%)` : '8/12 Unit (67%)'}
              </span>
            </div>
            <div className="col-span-2 p-3 bg-slate-50/60 rounded-lg border border-slate-100">
              <span className="text-slate-400 block mb-0.5">Phụ huynh liên kết</span>
              <span className="font-medium text-slate-800">{user.parentName || 'Chưa liên kết'}</span>
            </div>
          </div>

          {/* AI Knowledge Tracing Insight */}
          <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 text-xs text-slate-600">
            <div className="font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 stroke-[1.5]" />
              Phân tích năng lực (AI Knowledge Tracing)
            </div>
            <p className="text-[11px] leading-relaxed text-slate-600">
              Nắm vững 95% lý thuyết Thì Hiện tại Đơn, kỹ năng Nghe đạt 8.5/10. Cần luyện thêm phát âm đuôi <i>-s/-es</i> tại Unit 2.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors shadow-sm"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};