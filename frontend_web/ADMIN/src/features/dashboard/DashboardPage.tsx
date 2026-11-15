import React from 'react';
import { Users, GraduationCap, BookOpen, FileCheck, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Dashboard Tổng quan</h1>
        </div>
        <div className="text-xs text-slate-400">
          Cập nhật: {new Date().toLocaleDateString('vi-VN')}
        </div>
      </div>

      {/* Metrics Row (4 Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Tổng học sinh</span>
            <Users className="w-4 h-4 stroke-[1.5]" />
          </div>
          <div className="text-xl sm:text-2xl font-semibold text-slate-900 mt-2 tracking-tight">1,180</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Giáo viên phụ trách</span>
            <GraduationCap className="w-4 h-4 stroke-[1.5]" />
          </div>
          <div className="text-xl sm:text-2xl font-semibold text-slate-900 mt-2 tracking-tight">36</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Số Unit SGK 6</span>
            <BookOpen className="w-4 h-4 stroke-[1.5]" />
          </div>
          <div className="text-xl sm:text-2xl font-semibold text-slate-900 mt-2 tracking-tight">12 / 12</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Đề kiểm tra sẵn sàng</span>
            <FileCheck className="w-4 h-4 stroke-[1.5]" />
          </div>
          <div className="text-xl sm:text-2xl font-semibold text-slate-900 mt-2 tracking-tight">48 đề</div>
        </div>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Progress Overview */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-lg p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Tiến độ hoàn thành 12 Unit SGK toàn trường</h3>
            </div>
            <Link to="/admin/curriculum" className="text-xs text-slate-600 hover:text-slate-900 font-medium inline-flex items-center gap-1">
              Xem chi tiết <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {[
              { unit: 'Unit 1: My New School', percent: 92, students: 1085 },
              { unit: 'Unit 2: My House', percent: 84, students: 991 },
              { unit: 'Unit 3: My Friends', percent: 76, students: 896 },
              { unit: 'Unit 4: My Neighbourhood', percent: 65, students: 767 },
              { unit: 'Unit 5: Natural Wonders of Viet Nam', percent: 48, students: 566 },
            ].map(item => (
              <div key={item.unit} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-700">{item.unit}</span>
                  <span className="text-slate-500">{item.students} HS ({item.percent}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-slate-900 h-2 rounded-full" style={{ width: `${item.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions & AI Status */}
        <div className="bg-white border border-slate-200/80 rounded-lg p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Tác vụ nhanh</h3>
            <div className="space-y-2 text-xs">
              <Link to="/admin/users/students" className="block p-3 rounded-lg border border-slate-200/80 hover:bg-slate-50 transition-colors">
                <div className="font-semibold text-slate-800">Nhập học sinh từ Excel</div>
                <div className="text-slate-400 mt-0.5">Thêm học sinh khối 6 hàng loạt</div>
              </Link>
              <Link to="/admin/exams" className="block p-3 rounded-lg border border-slate-200/80 hover:bg-slate-50 transition-colors">
                <div className="font-semibold text-slate-800">Sinh đề thi tự động</div>
                <div className="text-slate-400 mt-0.5">Tạo đề Unit Test theo ma trận tỷ lệ</div>
              </Link>
              <Link to="/admin/questions" className="block p-3 rounded-lg border border-slate-200/80 hover:bg-slate-50 transition-colors">
                <div className="font-semibold text-slate-800">Soạn câu hỏi mới</div>
                <div className="text-slate-400 mt-0.5">Gắn thẻ kiến thức (KC Tag)</div>
              </Link>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Động cơ AI Knowledge Tracing
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Thuật toán Rule-based đang tự động phân tích điểm yếu học sinh và cập nhật độ thành thạo theo từng Unit.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};

