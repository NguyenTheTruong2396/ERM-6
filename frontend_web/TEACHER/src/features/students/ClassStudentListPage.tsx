import React, { useState } from 'react';
import { Search, Eye, Download, Compass } from 'lucide-react';
import { TeacherStudent } from '../../types/teacher.types';
import { StudentDetailModal } from './components/StudentDetailModal';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const ClassStudentListPage: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState<TeacherStudent | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('ALL');
  const [gradeFilter, setGradeFilter] = useState<'ALL' | 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'WEAK'>('ALL');

  // Dữ liệu mẫu học sinh 3 lớp 6A1, 6A2 và 6A3
  const mockStudents: TeacherStudent[] = [
    {
      id: 'hs-1',
      code: 'HS-6001',
      name: 'Nguyễn Linh Đan',
      email: 'dan.nguyen@eng6.edu.vn',
      classId: 'c1',
      className: 'Lớp 6A1',
      parentName: 'Nguyễn Văn Tuấn',
      parentPhone: '0912 345 678',
      avgScore: 9.2,
      completedTests: 5,
      totalTests: 5,
      learningStatus: 'EXCELLENT',
      completedUnits: 12,
      totalUnits: 12,
    },
    {
      id: 'hs-2',
      code: 'HS-6002',
      name: 'Vũ Minh Khang',
      email: 'khang.vu@eng6.edu.vn',
      classId: 'c1',
      className: 'Lớp 6A1',
      parentName: 'Vũ Hải Đăng',
      parentPhone: '0988 123 456',
      avgScore: 8.5,
      completedTests: 3,
      totalTests: 5,
      learningStatus: 'EXCELLENT',
      completedUnits: 6,
      totalUnits: 12,
    },
    {
      id: 'hs-3',
      code: 'HS-6003',
      name: 'Trần Phương Thảo',
      email: 'thao.tran@eng6.edu.vn',
      classId: 'c1',
      className: 'Lớp 6A1',
      parentName: 'Phạm Bích Ngọc',
      parentPhone: '0903 789 012',
      avgScore: 7.8,
      completedTests: 2,
      totalTests: 5,
      learningStatus: 'GOOD',
      completedUnits: 4,
      totalUnits: 12,
    },
    {
      id: 'hs-4',
      code: 'HS-6004',
      name: 'Lê Hoàng Duy',
      email: 'duy.le@eng6.edu.vn',
      classId: 'c2',
      className: 'Lớp 6A2',
      parentName: 'Lê Thanh Tùng',
      parentPhone: '0934 567 890',
      avgScore: 6.8,
      completedTests: 1,
      totalTests: 5,
      learningStatus: 'AVERAGE',
      completedUnits: 2,
      totalUnits: 12,
    },
    {
      id: 'hs-5',
      code: 'HS-6005',
      name: 'Hoàng Quốc Bảo',
      email: 'bao.hoang@eng6.edu.vn',
      classId: 'c2',
      className: 'Lớp 6A2',
      parentName: 'Hoàng Văn Nam',
      parentPhone: '0977 890 123',
      avgScore: 6.2,
      completedTests: 1,
      totalTests: 5,
      learningStatus: 'WEAK',
      completedUnits: 3,
      totalUnits: 12,
    },
    {
      id: 'hs-6',
      code: 'HS-6006',
      name: 'Đặng Mai Chi',
      email: 'chi.dang@eng6.edu.vn',
      classId: 'c3',
      className: 'Lớp 6A3',
      parentName: 'Đặng Đình Trọng',
      parentPhone: '0966 234 567',
      avgScore: 7.5,
      completedTests: 2,
      totalTests: 5,
      learningStatus: 'GOOD',
      completedUnits: 5,
      totalUnits: 12,
    },
  ];

  // Lọc dữ liệu
  const filteredStudents = mockStudents.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchClass = classFilter === 'ALL' || s.classId === classFilter;
    const matchGrade = gradeFilter === 'ALL' || s.learningStatus === gradeFilter;
    return matchSearch && matchClass && matchGrade;
  });

  return (
    <div className="space-y-8 font-sans pb-10 select-none">
      {/* Tiêu đề trang */}
      <div className="pb-2">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Học sinh & Lịch sử làm bài
        </h1>
      </div>

      {/* Table Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-white border border-slate-200/90 rounded-3xl shadow-xs overflow-hidden"
      >
        {/* Filter Bar */}
        <div className="p-5 border-b border-slate-100 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          {/* Segmented Tabs Học lực */}
          <div className="inline-flex flex-wrap p-1.5 bg-slate-100 rounded-2xl text-xs font-bold text-slate-600 self-start">
            <button
              onClick={() => setGradeFilter('ALL')}
              className={`px-3.5 py-2 rounded-xl transition-all ${gradeFilter === 'ALL'
                  ? 'bg-white text-sky-600 font-extrabold shadow-xs'
                  : 'hover:text-slate-900'
                }`}
            >
              Tất cả (90)
            </button>
            <button
              onClick={() => setGradeFilter('EXCELLENT')}
              className={`px-3.5 py-2 rounded-xl transition-all ${gradeFilter === 'EXCELLENT'
                  ? 'bg-white text-emerald-600 font-extrabold shadow-xs'
                  : 'hover:text-slate-900'
                }`}
            >
              Giỏi (32)
            </button>
            <button
              onClick={() => setGradeFilter('GOOD')}
              className={`px-3.5 py-2 rounded-xl transition-all ${gradeFilter === 'GOOD'
                  ? 'bg-white text-sky-600 font-extrabold shadow-xs'
                  : 'hover:text-slate-900'
                }`}
            >
              Khá (36)
            </button>
            <button
              onClick={() => setGradeFilter('AVERAGE')}
              className={`px-3.5 py-2 rounded-xl transition-all ${gradeFilter === 'AVERAGE'
                  ? 'bg-white text-amber-600 font-extrabold shadow-xs'
                  : 'hover:text-slate-900'
                }`}
            >
              Trung bình (17)
            </button>
            <button
              onClick={() => setGradeFilter('WEAK')}
              className={`px-3.5 py-2 rounded-xl transition-all ${gradeFilter === 'WEAK'
                  ? 'bg-white text-rose-600 font-extrabold shadow-xs'
                  : 'hover:text-rose-600'
                }`}
            >
              Cần bồi dưỡng (5)
            </button>
          </div>

          {/* Search bar & Class filter */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full xl:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 stroke-[2]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm tên, mã ID, email..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-sky-500 transition-all"
              />
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="w-full sm:w-auto text-xs font-bold text-slate-700 bg-white border border-slate-200/80 rounded-xl px-3.5 py-2 focus:outline-none focus:border-sky-500 shadow-2xs"
              >
                <option value="ALL">Lớp: Tất cả các lớp</option>
                <option value="c1">Lớp 6A1 (30 HS)</option>
                <option value="c2">Lớp 6A2 (30 HS)</option>
                <option value="c3">Lớp 6A3 (30 HS)</option>
              </select>

              <button
                className="p-2 text-slate-600 hover:text-sky-600 border border-slate-200/80 rounded-xl hover:bg-sky-50 hover:border-sky-200 transition-all flex-shrink-0 shadow-2xs"
                title="Xuất danh sách Excel"
              >
                <Download className="w-4 h-4 stroke-[2]" />
              </button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[780px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-5 w-24">Mã ID</th>
                <th className="py-3.5 px-4">Học sinh</th>
                <th className="py-3.5 px-4">Lớp</th>
                <th className="py-3.5 px-4">Điểm trung bình</th>
                <th className="py-3.5 px-4">Bài Review / Test</th>
                <th className="py-3.5 px-4">Tiến độ Unit</th>
                <th className="py-3.5 px-4">Học lực</th>
                <th className="py-3.5 px-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredStudents.map((student) => {
                const words = student.name.trim().split(' ');
                const initials =
                  words.length >= 2
                    ? (words[words.length - 2][0] + words[words.length - 1][0]).toUpperCase()
                    : student.name.slice(0, 2).toUpperCase();

                return (
                  <tr key={student.id} className="hover:bg-sky-50/30 transition-colors group">
                    {/* Cột 1: Mã ID */}
                    <td className="py-4 px-5 font-mono text-[11px] text-slate-500 font-bold">
                      {student.code}
                    </td>

                    {/* Cột 2: Học sinh */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-700 font-black text-xs flex items-center justify-center border border-sky-200/70 flex-shrink-0">
                          {initials}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-sky-600 transition-colors text-[13px]">
                            {student.name}
                          </div>
                          <div className="text-[11px] font-medium text-slate-400 mt-0.5">
                            {student.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Cột 3: Lớp */}
                    <td className="py-4 px-4 font-bold text-slate-700">
                      {student.className}
                    </td>

                    {/* Cột 4: Điểm trung bình */}
                    <td className="py-4 px-4">
                      <span className="font-black text-sky-600 text-sm">{student.avgScore}</span>
                      <span className="text-slate-400 text-[11px] font-semibold"> / 10</span>
                    </td>

                    {/* Cột 5: Số bài Review / Test */}
                    <td className="py-4 px-4 text-slate-700 font-bold">
                      {student.completedTests} / {student.totalTests} bài
                    </td>

                    {/* Cột 6: Tiến độ Unit */}
                    <td className="py-4 px-4">
                      <div className="w-28">
                        <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1.5">
                          <span>{student.completedUnits}/12 Unit</span>
                          <span className="font-extrabold text-slate-900">
                            {Math.round((student.completedUnits / 12) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-sky-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${(student.completedUnits / 12) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Cột 7: Học lực */}
                    <td className="py-4 px-4">
                      {student.learningStatus === 'EXCELLENT' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          Giỏi
                        </span>
                      )}
                      {student.learningStatus === 'GOOD' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-sky-50 text-sky-700 border border-sky-200/60">
                          Khá
                        </span>
                      )}
                      {student.learningStatus === 'AVERAGE' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200/60">
                          Trung bình
                        </span>
                      )}
                      {student.learningStatus === 'WEAK' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200/60">
                          Cần bồi dưỡng
                        </span>
                      )}
                    </td>

                    {/* Cột 8: Nút Icon Thao tác */}
                    <td className="py-4 px-5 text-right">
                      <div className="inline-flex items-center gap-2 justify-end">
                        <button
                          onClick={() => setSelectedStudent(student)}
                          className="w-8 h-8 inline-flex items-center justify-center text-slate-500 hover:text-sky-600 bg-white border border-slate-200 rounded-xl hover:bg-sky-50 hover:border-sky-200 transition-all shadow-2xs"
                          title="Xem chi tiết hồ sơ & lịch sử bài làm"
                        >
                          <Eye className="w-4 h-4 stroke-[2]" />
                        </button>
                        <Link
                          to={`/teacher/ai-tracking/${student.id}`}
                          className="w-8 h-8 inline-flex items-center justify-center text-slate-500 hover:text-sky-600 bg-white border border-slate-200 rounded-xl hover:bg-sky-50 hover:border-sky-200 transition-all shadow-2xs"
                          title="Xem lộ trình cá nhân hóa"
                        >
                          <Compass className="w-4 h-4 stroke-[2]" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400 font-semibold">
                    Không tìm thấy học sinh nào phù hợp với bộ lọc hiện tại.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Thanh phân trang Responsive */}
        <div className="p-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-medium text-slate-500">
          <div className="w-full sm:w-auto text-center sm:text-left">
            Hiển thị <span className="font-extrabold text-slate-900">1 - {filteredStudents.length}</span> trong tổng số{' '}
            <span className="font-extrabold text-slate-900">90</span> học sinh
          </div>

          <div className="hidden sm:flex items-center gap-1.5 font-bold">
            <button
              className="px-3 py-1.5 border border-slate-200 rounded-xl text-slate-400 cursor-not-allowed"
              disabled
            >
              Trước
            </button>
            <button className="px-3.5 py-1.5 bg-sky-600 text-white rounded-xl shadow-xs">
              1
            </button>
            <button className="px-3.5 py-1.5 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors">
              2
            </button>
            <button className="px-3.5 py-1.5 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors">
              3
            </button>
            <button className="px-3.5 py-1.5 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors">
              Sau
            </button>
          </div>

          <div className="flex sm:hidden items-center justify-between w-full pt-1 font-bold">
            <button
              className="px-3.5 py-1.5 border border-slate-200 rounded-xl text-slate-400 cursor-not-allowed"
              disabled
            >
              ← Trước
            </button>
            <span className="text-slate-700">
              Trang <span className="font-extrabold text-slate-900">1</span> / 3
            </span>
            <button className="px-3.5 py-1.5 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50">
              Sau →
            </button>
          </div>
        </div>
      </motion.div>

      {/* Modal xem chi tiết hồ sơ & bài làm học sinh */}
      <StudentDetailModal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />
    </div>
  );
};