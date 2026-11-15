import React from 'react';
import { motion } from 'framer-motion';
import {
  Users, School, CheckCircle2, Award, AlertTriangle,
  ChevronRight, BarChart2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TeacherDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  // 1. CÁC THẺ THỐNG KÊ (ĐÃ BỎ CHÚ THÍCH NHỎ)
  const overviewStats = [
    {
      title: 'Số lớp phụ trách',
      value: '3 Lớp',
      icon: School,
      color: 'text-sky-600',
      bgColor: 'bg-sky-50 border-sky-200/80',
    },
    {
      title: 'Tổng học sinh quản lý',
      value: '90 HS',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 border-blue-200/80',
    },
    {
      title: 'Tỷ lệ nộp bài trung bình',
      value: '94%',
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 border-emerald-200/80',
    },
    {
      title: 'Điểm trung bình các lớp',
      value: '7.8 / 10',
      icon: Award,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50 border-amber-200/80',
    },
  ];

  // 2. PHỔ ĐIỂM HỌC SINH (GIỎI, KHÁ, TB, YẾU)
  const gradeDistribution = [
    { label: 'Giỏi (8.0 - 10)', count: 38, percentage: 42, color: 'bg-emerald-500' },
    { label: 'Khá (6.5 - 7.9)', count: 34, percentage: 38, color: 'bg-sky-500' },
    { label: 'Trung bình (5.0 - 6.4)', count: 12, percentage: 13, color: 'bg-amber-500' },
    { label: 'Yếu (< 5.0)', count: 6, percentage: 7, color: 'bg-rose-500' },
  ];

  // 3. TOP LỖ HỔNG KIẾN THỨC PHỔ BIẾN NHẤT CẢ LỚP
  const topKnowledgeGaps = [
    {
      id: 1,
      unit: 'Unit 3: My Friends',
      gap: 'Thì Hiện tại tiếp diễn (Present Continuous)',
      affectedCount: 24,
      affectedRate: '26.6%',
      level: 'Cao',
    },
    {
      id: 2,
      unit: 'Unit 2: My House',
      gap: 'Từ vựng chỉ Đồ dùng gia đình & Giới từ chỉ vị trí',
      affectedCount: 14,
      affectedRate: '15.5%',
      level: 'Trung bình',
    },
    {
      id: 3,
      unit: 'Unit 1: My New School',
      gap: 'Âm /s/ và /z/ trong quy tắc phát âm đuôi -s/-es',
      affectedCount: 10,
      affectedRate: '11.1%',
      level: 'Thấp',
    },
  ];

  // 4. DANH SÁCH LỚP HỌC PHỤ TRÁCH QUẢN LÝ (CHỈ ĐỂ SĨ SỐ VÀ ĐIỂM TỔNG)
  const classList = [
    { name: 'Lớp 6A1', total: 30, avgScore: 8.2 },
    { name: 'Lớp 6A2', total: 30, avgScore: 7.6 },
    { name: 'Lớp 6A3', total: 30, avgScore: 7.4 },
  ];

  return (
    <div className="space-y-8 font-sans pb-10 select-none">

      {/* TIÊU ĐỀ TRANG */}
      <div className="pb-2">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Dashboard Tổng quan
        </h1>
      </div>

      {/* 1. THẺ THỐNG KÊ LỚP QUẢN LÝ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {overviewStats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.05 }}
            className={`p-6 rounded-2xl border ${stat.bgColor} bg-white shadow-xs space-y-3`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">{stat.title}</span>
              <div className={`p-2.5 rounded-xl ${stat.bgColor} ${stat.color}`}>
                <stat.icon className="w-5 h-5 stroke-[2]" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 2. KHU VỰC TIẾN ĐỘ HỌC TẬP & PHỔ ĐIỂM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* PHỔ ĐIỂM PHÂN BỔ CẢ LỚP (GIỎI, KHÁ, TB, YẾU) - 7 CỘT */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-2">
            <div className="flex items-center gap-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Thống kê điểm các lớp</h3>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {gradeDistribution.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700">{item.label}</span>
                  <span className="text-slate-900">{item.count} học sinh ({item.percentage}%)</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    className={`h-full rounded-full ${item.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CÁC LỚP PHỤ TRÁCH - 5 CỘT */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2">
            <h3 className="font-extrabold text-slate-900 text-base">Lớp học phụ trách</h3>
            <button
              onClick={() => navigate('/teacher/classes')}
              className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
            >
              <span>Chi tiết</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {classList.map((cls, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-between text-xs">
                <div className="space-y-1">
                  <span className="font-extrabold text-slate-900 text-sm block">{cls.name}</span>
                  <span className="text-slate-500 font-medium block">Sĩ số: {cls.total} HS</span>
                </div>
                <div className="text-right">
                  <span className="font-black text-sky-600 text-base block">{cls.avgScore} đ</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 3. BÁO CÁO PHÂN TÍCH LỖ HỔNG KIẾN THỨC CẢ LỚP */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-2xl">
              <AlertTriangle className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Lỗ hổng Kiến thức Phổ biến</h3>
            </div>
          </div>

          <button
            onClick={() => navigate('/teacher/knowledge-gaps')}
            className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 hidden sm:flex"
          >
            <span>Xem chi tiết lỗ hổng</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-semibold">
            <thead>
              <tr className="text-slate-400">
                <th className="pb-3 font-bold">Chương học (Unit)</th>
                <th className="pb-3 font-bold">Lỗ hổng kiến thức</th>
                <th className="pb-3 font-bold">Số HS vướng phải</th>
                <th className="pb-3 font-bold">Mức độ cảnh báo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {topKnowledgeGaps.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 font-bold text-slate-900">{item.unit}</td>
                  <td className="py-3.5 text-slate-600 font-medium">{item.gap}</td>
                  <td className="py-3.5 font-bold text-slate-900">
                    {item.affectedCount} HS <span className="text-slate-400 font-normal">({item.affectedRate})</span>
                  </td>
                  <td className="py-3.5">
                    <span className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold ${item.level === 'Cao'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                      : item.level === 'Trung bình'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                        : 'bg-slate-100 text-slate-600'
                      }`}>
                      {item.level}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};