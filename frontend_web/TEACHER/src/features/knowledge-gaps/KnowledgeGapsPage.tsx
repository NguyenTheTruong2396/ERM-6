import React, { useState } from 'react';
import { Search, Tag, Download } from 'lucide-react';
import { KnowledgeGapItem } from '../../types/teacher.types';
import { motion } from 'framer-motion';

interface ExtendedKnowledgeGapItem extends KnowledgeGapItem {
  classId: string;
  className: string;
}

export const KnowledgeGapsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [classFilter, setClassFilter] = useState('ALL');
  const [unitFilter, setUnitFilter] = useState('ALL');

  // Dữ liệu mẫu các lỗ hổng kiến thức gắn với từng lớp (6A1, 6A2, 6A3)
  const mockGaps: ExtendedKnowledgeGapItem[] = [
    {
      id: 'gap-1',
      kcCode: 'KC-GR-04',
      kcName: 'So sánh hơn của tính từ ngắn/dài (Comparative Adjectives)',
      category: 'Grammar',
      classId: 'c1',
      className: 'Lớp 6A1',
      unit: 4,
      affectedStudentCount: 11,
      totalStudents: 30,
      failRate: 36.7,
      recommendation: '',
    },
    {
      id: 'gap-2',
      kcCode: 'KC-PH-03',
      kcName: 'Phát âm cặp phụ âm /p/ và /b/ (Consonant contrasts)',
      category: 'Pronunciation',
      classId: 'c2',
      className: 'Lớp 6A2',
      unit: 3,
      affectedStudentCount: 12,
      totalStudents: 30,
      failRate: 40.0,
      recommendation: '',
    },
    {
      id: 'gap-3',
      kcCode: 'KC-LS-02',
      kcName: 'Giới từ chỉ vị trí trong không gian phòng ở (in front of / next to)',
      category: 'Listening',
      classId: 'c1',
      className: 'Lớp 6A1',
      unit: 2,
      affectedStudentCount: 8,
      totalStudents: 30,
      failRate: 26.7,
      recommendation: '',
    },
    {
      id: 'gap-4',
      kcCode: 'KC-GR-01',
      kcName: 'Thì hiện tại đơn với ngôi thứ 3 số ít (He/She/It + V-s/es)',
      category: 'Grammar',
      classId: 'c3',
      className: 'Lớp 6A3',
      unit: 1,
      affectedStudentCount: 10,
      totalStudents: 30,
      failRate: 33.3,
      recommendation: '',
    },
    {
      id: 'gap-5',
      kcCode: 'KC-VC-03',
      kcName: 'Từ vựng tính từ miêu tả tính cách bạn bè (patient, curious, active)',
      category: 'Vocabulary',
      classId: 'c2',
      className: 'Lớp 6A2',
      unit: 3,
      affectedStudentCount: 7,
      totalStudents: 30,
      failRate: 23.3,
      recommendation: '',
    },
    {
      id: 'gap-6',
      kcCode: 'KC-GR-02',
      kcName: 'Cấu trúc miêu tả There is / There are và danh từ số nhiều',
      category: 'Grammar',
      classId: 'c3',
      className: 'Lớp 6A3',
      unit: 2,
      affectedStudentCount: 9,
      totalStudents: 30,
      failRate: 30.0,
      recommendation: '',
    },
  ];

  // Lọc theo Lớp & Unit trước để đếm số lượng chính xác trên các Tab kỹ năng
  const baseFiltered = mockGaps.filter((g) => {
    const matchClass = classFilter === 'ALL' || g.classId === classFilter;
    const matchUnit = unitFilter === 'ALL' || g.unit === Number(unitFilter);
    return matchClass && matchUnit;
  });

  const filteredGaps = baseFiltered.filter((g) => {
    const matchSearch =
      g.kcName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.kcCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = categoryFilter === 'ALL' || g.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const selectedClassName =
    classFilter === 'ALL'
      ? 'Tất cả các lớp (6A1, 6A2, 6A3)'
      : classFilter === 'c1'
        ? 'Lớp 6A1'
        : classFilter === 'c2'
          ? 'Lớp 6A2'
          : 'Lớp 6A3';

  return (
    <div className="space-y-8 font-sans pb-10 select-none">
      {/* Tiêu đề trang + Nhãn lớp đang xem */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Phân tích lỗ hổng kiến thức
        </h1>
        <span className="inline-flex items-center px-3.5 py-1.5 rounded-xl text-xs font-extrabold bg-sky-50 text-sky-700 border border-sky-200/70 self-start sm:self-auto">
          Phạm vi: {selectedClassName}
        </span>
      </div>

      {/* Table Container */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-white border border-slate-200/90 rounded-3xl shadow-xs overflow-hidden"
      >
        {/* Filter bar */}
        <div className="p-5 border-b border-slate-100 flex flex-col 2xl:flex-row 2xl:items-center 2xl:justify-between gap-4">
          <div className="inline-flex flex-wrap p-1.5 bg-slate-100 rounded-2xl text-xs font-bold text-slate-600 self-start">
            <button
              onClick={() => setCategoryFilter('ALL')}
              className={`px-3.5 py-2 rounded-xl transition-all ${categoryFilter === 'ALL'
                  ? 'bg-white text-sky-600 font-extrabold shadow-xs'
                  : 'hover:text-slate-900'
                }`}
            >
              Tất cả ({baseFiltered.length})
            </button>
            <button
              onClick={() => setCategoryFilter('Grammar')}
              className={`px-3.5 py-2 rounded-xl transition-all ${categoryFilter === 'Grammar'
                  ? 'bg-white text-amber-600 font-extrabold shadow-xs'
                  : 'hover:text-slate-900'
                }`}
            >
              Ngữ pháp ({baseFiltered.filter((g) => g.category === 'Grammar').length})
            </button>
            <button
              onClick={() => setCategoryFilter('Pronunciation')}
              className={`px-3.5 py-2 rounded-xl transition-all ${categoryFilter === 'Pronunciation'
                  ? 'bg-white text-sky-600 font-extrabold shadow-xs'
                  : 'hover:text-slate-900'
                }`}
            >
              Phát âm ({baseFiltered.filter((g) => g.category === 'Pronunciation').length})
            </button>
            <button
              onClick={() => setCategoryFilter('Listening')}
              className={`px-3.5 py-2 rounded-xl transition-all ${categoryFilter === 'Listening'
                  ? 'bg-white text-indigo-600 font-extrabold shadow-xs'
                  : 'hover:text-slate-900'
                }`}
            >
              Kỹ năng Nghe ({baseFiltered.filter((g) => g.category === 'Listening').length})
            </button>
            <button
              onClick={() => setCategoryFilter('Vocabulary')}
              className={`px-3.5 py-2 rounded-xl transition-all ${categoryFilter === 'Vocabulary'
                  ? 'bg-white text-emerald-600 font-extrabold shadow-xs'
                  : 'hover:text-slate-900'
                }`}
            >
              Từ vựng ({baseFiltered.filter((g) => g.category === 'Vocabulary').length})
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center flex-wrap gap-2.5 w-full 2xl:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-56">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 stroke-[2]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm chuyên đề, mã KC..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-sky-500 transition-all"
              />
            </div>

            {/* Class Filter Dropdown */}
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

            {/* Unit Filter + Export */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <select
                value={unitFilter}
                onChange={(e) => setUnitFilter(e.target.value)}
                className="w-full sm:w-auto text-xs font-bold text-slate-700 bg-white border border-slate-200/80 rounded-xl px-3.5 py-2 focus:outline-none focus:border-sky-500 shadow-2xs"
              >
                <option value="ALL">Tất cả Unit</option>
                <option value="1">Unit 1: My New School</option>
                <option value="2">Unit 2: My House</option>
                <option value="3">Unit 3: My Friends</option>
                <option value="4">Unit 4: My Neighbourhood</option>
              </select>

              <button
                className="p-2 text-slate-600 hover:text-sky-600 border border-slate-200/80 rounded-xl hover:bg-sky-50 hover:border-sky-200 transition-all flex-shrink-0 shadow-2xs"
                title="Xuất báo cáo PDF/Excel"
              >
                <Download className="w-4 h-4 stroke-[2]" />
              </button>
            </div>
          </div>
        </div>

        {/* Data Table (Đã bỏ cột Gợi ý sư phạm) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 whitespace-nowrap">
                <th className="py-3.5 px-5 w-36">Mã KC</th>
                <th className="py-3.5 px-4 w-28">Lớp</th>
                <th className="py-3.5 px-4">Thành phần kiến thức (Lỗ hổng)</th>
                <th className="py-3.5 px-4 w-36">Phân loại</th>
                <th className="py-3.5 px-4 w-28">Chương học</th>
                <th className="py-3.5 px-5 w-48">Tỷ lệ học sinh sai</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredGaps.map((gap, idx) => (
                <tr key={gap.id} className="hover:bg-sky-50/30 transition-colors group">
                  <td className="py-4 px-5 font-mono text-[11px] font-bold text-slate-600 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/60">
                      <Tag className="w-3 h-3 text-slate-400" />
                      {gap.kcCode}
                    </span>
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-slate-100 text-slate-800 border border-slate-200/70">
                      {gap.className}
                    </span>
                  </td>

                  <td className="py-4 px-4 font-bold text-slate-900 group-hover:text-sky-600 transition-colors leading-relaxed">
                    {gap.kcName}
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap">
                    {gap.category === 'Grammar' && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200/60">
                        Ngữ pháp
                      </span>
                    )}
                    {gap.category === 'Pronunciation' && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-sky-50 text-sky-700 border border-sky-200/60">
                        Phát âm
                      </span>
                    )}
                    {gap.category === 'Listening' && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                        Kỹ năng Nghe
                      </span>
                    )}
                    {gap.category === 'Vocabulary' && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        Từ vựng
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-4 text-slate-700 font-bold whitespace-nowrap">
                    Unit {gap.unit}
                  </td>

                  <td className="py-4 px-5 whitespace-nowrap">
                    <div className="w-40">
                      <div className="flex justify-between text-[11px] mb-1.5">
                        <span className="font-bold text-rose-600">
                          {gap.affectedStudentCount}/{gap.totalStudents} HS
                        </span>
                        <span className="font-black text-slate-900">{gap.failRate}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${gap.failRate}%` }}
                          transition={{ duration: 0.7, delay: idx * 0.08 }}
                          className="bg-rose-500 h-full rounded-full"
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredGaps.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400 font-semibold">
                    Không tìm thấy chuyên đề lỗ hổng kiến thức nào phù hợp với bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info note */}
        <div className="p-5 border-t border-slate-100 text-xs font-medium text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/40">
          <span>
            Dữ liệu lỗ hổng kiến thức được tổng hợp tự động từ quá trình tự học và kết quả các bài Review định kỳ.
          </span>
          <span className="font-extrabold text-slate-800 whitespace-nowrap">
            Tổng cộng: {filteredGaps.length} chuyên đề cần củng cố
          </span>
        </div>
      </motion.div>
    </div>
  );
};