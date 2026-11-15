import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users, BookOpen, Award, ArrowRight, ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export const MyClassListPage: React.FC = () => {
  const classes = [
    {
      id: 'c1',
      code: '6A1',
      name: 'Lớp 6A1',
      academicYear: '2026 - 2027',
      studentCount: 30,
      averageScore: 8.1,
      submissionRate: 97.8,
      distribution: { excellent: 14, good: 11, average: 4, weak: 1 },
      currentUnit: 'Unit 4: My Neighbourhood',
    },
    {
      id: 'c2',
      code: '6A2',
      name: 'Lớp 6A2',
      academicYear: '2026 - 2027',
      studentCount: 30,
      averageScore: 7.5,
      submissionRate: 91.1,
      distribution: { excellent: 10, good: 12, average: 6, weak: 2 },
      currentUnit: 'Unit 4: My Neighbourhood',
    },
    {
      id: 'c3',
      code: '6A3',
      name: 'Lớp 6A3',
      academicYear: '2026 - 2027',
      studentCount: 30,
      averageScore: 7.4,
      submissionRate: 88.5,
      distribution: { excellent: 8, good: 13, average: 7, weak: 2 },
      currentUnit: 'Unit 3: My Friends',
    },
  ];

  return (
    <div className="space-y-8 font-sans pb-10 select-none">

      {/* Tiêu đề trang (Sạch sẽ, không hiệu ứng, không dòng phụ, không gạch ngang) */}
      <div className="pb-2">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Lớp học phụ trách
        </h1>
      </div>

      {/* Grid thẻ các Lớp học */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls, idx) => (
          <motion.div
            key={cls.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            whileHover={{ y: -6 }}
            className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs hover:shadow-xl hover:border-sky-200 transition-all duration-300 flex flex-col justify-between space-y-6 group"
          >
            {/* Header Card: Tên lớp & ĐTB */}
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-xl font-black text-slate-900 group-hover:text-sky-600 transition-colors">
                    {cls.name}
                  </h2>
                  <span className="text-[11px] font-extrabold bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-lg">
                    {cls.academicYear}
                  </span>
                </div>

                {/* Thẻ ĐTB nổi bật */}
                <div className="bg-sky-50 border border-sky-100 px-3.5 py-1.5 rounded-2xl text-right">
                  <div className="text-[10px] font-black text-sky-600 uppercase tracking-wider">ĐTB Lớp</div>
                  <div className="text-xl font-black text-sky-700 leading-tight">
                    {cls.averageScore} <span className="text-xs font-bold text-sky-400">/10</span>
                  </div>
                </div>
              </div>

              {/* Thông số gọn 3 cột */}
              <div className="grid grid-cols-3 gap-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                <div className="space-y-0.5">
                  <div className="text-slate-400 flex items-center gap-1 text-[11px] font-semibold">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>Sĩ số</span>
                  </div>
                  <div className="font-black text-slate-900 text-sm">{cls.studentCount} HS</div>
                </div>

                <div className="space-y-0.5 border-x border-slate-200/60 px-2">
                  <div className="text-slate-400 flex items-center gap-1 text-[11px] font-semibold">
                    <Award className="w-3.5 h-3.5 text-slate-400" />
                    <span>Nộp bài</span>
                  </div>
                  <div className="font-black text-slate-900 text-sm">{cls.submissionRate}%</div>
                </div>

                <div className="space-y-0.5 pl-1">
                  <div className="text-slate-400 flex items-center gap-1 text-[11px] font-semibold">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    <span>Đang học</span>
                  </div>
                  <div className="font-black text-slate-900 text-sm truncate">Unit 4</div>
                </div>
              </div>

              {/* Phân bổ học lực */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700">Phân bổ học lực</span>
                </div>

                {/* Thẻ đếm số học sinh ghi đầy đủ tên học lực */}
                <div className="grid grid-cols-4 gap-1.5 text-[11px] font-bold">
                  <span className="text-center py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100/80">
                    Giỏi: {cls.distribution.excellent}
                  </span>
                  <span className="text-center py-1.5 rounded-xl bg-sky-50 text-sky-700 border border-sky-100/80">
                    Khá: {cls.distribution.good}
                  </span>
                  <span className="text-center py-1.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-100/80">
                    TB: {cls.distribution.average}
                  </span>
                  <span className="text-center py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-100/80">
                    Yếu: {cls.distribution.weak}
                  </span>
                </div>

                {/* Thanh tiến độ đa màu có hiệu ứng tự dãn */}
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex gap-0.5 p-0.5 border border-slate-200/50">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(cls.distribution.excellent / cls.studentCount) * 100}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.1 + 0.2 }}
                    className="bg-emerald-500 h-full rounded-l-full"
                    title={`Giỏi: ${cls.distribution.excellent} HS`}
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(cls.distribution.good / cls.studentCount) * 100}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.1 + 0.3 }}
                    className="bg-sky-500 h-full"
                    title={`Khá: ${cls.distribution.good} HS`}
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(cls.distribution.average / cls.studentCount) * 100}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.1 + 0.4 }}
                    className="bg-amber-500 h-full"
                    title={`Trung bình: ${cls.distribution.average} HS`}
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(cls.distribution.weak / cls.studentCount) * 100}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.1 + 0.5 }}
                    className="bg-rose-500 h-full rounded-r-full"
                    title={`Yếu: ${cls.distribution.weak} HS`}
                  />
                </div>
              </div>
            </div>

            {/* Footer Nút Thao Tác */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
              <Link
                to="/teacher/knowledge-gaps"
                className="text-slate-500 hover:text-sky-600 transition-colors flex items-center gap-1 group/link"
              >
                <span>Phân tích lỗi</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
              </Link>

              <Link
                to="/teacher/students"
                className="inline-flex items-center gap-2 px-4 py-2.5 font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-all shadow-xs hover:shadow-md group/btn"
              >
                <span>Danh sách học sinh</span>
                <ArrowRight className="w-4 h-4 stroke-[2] transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </div>

          </motion.div>
        ))}
      </div>

    </div>
  );
};