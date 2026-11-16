import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye } from 'lucide-react';
import { PersonalizedRoadmapItem } from '../../types/teacher.types';
import { motion } from 'framer-motion';

interface ExtendedRoadmapItem extends PersonalizedRoadmapItem {
  completedUnits: number;
  totalUnits: number;
}

export const AdaptiveRoadmapTrackerPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'NEED_SUPPORT' | 'MASTERED'>('ALL');

  const mockRoadmaps: ExtendedRoadmapItem[] = [
    {
      studentId: 'hs-5',
      studentCode: 'HS-6005',
      studentName: 'Hoàng Quốc Bảo',
      className: 'Lớp 6A2',
      completedUnits: 2,
      totalUnits: 12,
      masteryPercentage: 58,
      weakTopicCount: 3,
      suggestedPlaylist: [
        { unit: 4, topic: 'So sánh hơn tính từ đuôi -y', skill: 'Ngữ pháp', priority: 'HIGH', status: 'IN_PROGRESS' },
        { unit: 3, topic: 'Phân biệt phát âm âm /p/ và /b/', skill: 'Phát âm', priority: 'HIGH', status: 'PENDING' },
        { unit: 2, topic: 'Giới từ chỉ nơi chốn trong nhà', skill: 'Nghe', priority: 'MEDIUM', status: 'COMPLETED' },
      ],
    },
    {
      studentId: 'hs-4',
      studentCode: 'HS-6004',
      studentName: 'Lê Hoàng Duy',
      className: 'Lớp 6A2',
      completedUnits: 2,
      totalUnits: 12,
      masteryPercentage: 68,
      weakTopicCount: 2,
      suggestedPlaylist: [
        { unit: 4, topic: 'Quy tắc gấp đôi phụ âm khi thêm -er', skill: 'Ngữ pháp', priority: 'HIGH', status: 'IN_PROGRESS' },
        { unit: 1, topic: 'Động từ thường thì hiện tại đơn', skill: 'Ngữ pháp', priority: 'MEDIUM', status: 'COMPLETED' },
      ],
    },
    {
      studentId: 'hs-6',
      studentCode: 'HS-6006',
      studentName: 'Đặng Mai Chi',
      className: 'Lớp 6A3',
      completedUnits: 3,
      totalUnits: 12,
      masteryPercentage: 75,
      weakTopicCount: 1,
      suggestedPlaylist: [
        { unit: 2, topic: 'Cấu trúc There is / There are', skill: 'Ngữ pháp', priority: 'MEDIUM', status: 'IN_PROGRESS' },
      ],
    },
    {
      studentId: 'hs-3',
      studentCode: 'HS-6003',
      studentName: 'Trần Phương Thảo',
      className: 'Lớp 6A1',
      completedUnits: 3,
      totalUnits: 12,
      masteryPercentage: 82,
      weakTopicCount: 1,
      suggestedPlaylist: [
        { unit: 3, topic: 'Phát âm đuôi bật hơi /p/', skill: 'Phát âm', priority: 'MEDIUM', status: 'IN_PROGRESS' },
      ],
    },
    {
      studentId: 'hs-2',
      studentCode: 'HS-6002',
      studentName: 'Vũ Minh Khang',
      className: 'Lớp 6A1',
      completedUnits: 4,
      totalUnits: 12,
      masteryPercentage: 91,
      weakTopicCount: 0,
      suggestedPlaylist: [],
    },
    {
      studentId: 'hs-1',
      studentCode: 'HS-6001',
      studentName: 'Nguyễn Linh Đan',
      className: 'Lớp 6A1',
      completedUnits: 4,
      totalUnits: 12,
      masteryPercentage: 96,
      weakTopicCount: 0,
      suggestedPlaylist: [],
    },
  ];

  const classFiltered = mockRoadmaps.filter((item) => {
    return classFilter === 'ALL' || item.className.includes(classFilter);
  });

  const filteredRoadmaps = classFiltered.filter((item) => {
    const matchSearch =
      item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.studentCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'NEED_SUPPORT' && item.weakTopicCount > 0) ||
      (statusFilter === 'MASTERED' && item.weakTopicCount === 0);
    return matchSearch && matchStatus;
  });

  const selectedClassName =
    classFilter === 'ALL'
      ? 'Tất cả các lớp (6A1, 6A2, 6A3)'
      : `Lớp ${classFilter}`;

  return (
    <div className="space-y-8 font-sans pb-10 select-none">

      {/* Tiêu đề trang + Nhãn lớp đang xem */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Lộ trình cá nhân hóa
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
        <div className="p-5 border-b border-slate-100 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">

          <div className="inline-flex flex-wrap p-1.5 bg-slate-100 rounded-2xl text-xs font-bold text-slate-600 self-start">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3.5 py-2 rounded-xl transition-all ${statusFilter === 'ALL'
                  ? 'bg-white text-sky-600 font-extrabold shadow-xs'
                  : 'hover:text-slate-900'
                }`}
            >
              Tất cả ({classFiltered.length})
            </button>
            <button
              onClick={() => setStatusFilter('NEED_SUPPORT')}
              className={`px-3.5 py-2 rounded-xl transition-all ${statusFilter === 'NEED_SUPPORT'
                  ? 'bg-white text-amber-600 font-extrabold shadow-xs'
                  : 'hover:text-slate-900'
                }`}
            >
              Cần bù lỗ hổng ({classFiltered.filter((i) => i.weakTopicCount > 0).length})
            </button>
            <button
              onClick={() => setStatusFilter('MASTERED')}
              className={`px-3.5 py-2 rounded-xl transition-all ${statusFilter === 'MASTERED'
                  ? 'bg-white text-emerald-600 font-extrabold shadow-xs'
                  : 'hover:text-slate-900'
                }`}
            >
              Chuẩn kiến thức ({classFiltered.filter((i) => i.weakTopicCount === 0).length})
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full xl:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 stroke-[2]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm tên học sinh, mã ID..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-sky-500 transition-all"
              />
            </div>

            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="w-full sm:w-auto text-xs font-bold text-slate-700 bg-white border border-slate-200/80 rounded-xl px-3.5 py-2 focus:outline-none focus:border-sky-500 shadow-2xs"
            >
              <option value="ALL">Lớp: Tất cả các lớp</option>
              <option value="6A1">Lớp 6A1 (30 HS)</option>
              <option value="6A2">Lớp 6A2 (30 HS)</option>
              <option value="6A3">Lớp 6A3 (30 HS)</option>
            </select>
          </div>

        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1020px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 whitespace-nowrap">
                <th className="py-3.5 px-5 w-24">Mã ID</th>
                <th className="py-3.5 px-4">Học sinh</th>
                <th className="py-3.5 px-4">Lớp</th>
                <th className="py-3.5 px-4">Tiến độ tự học</th>
                <th className="py-3.5 px-4">Độ thành thạo</th>
                <th className="py-3.5 px-4">Playlist bài học bổ trợ đề xuất</th>
                <th className="py-3.5 px-4">Trạng thái</th>
                <th className="py-3.5 px-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredRoadmaps.map((item, idx) => {
                const words = item.studentName.trim().split(' ');
                const initials =
                  words.length >= 2
                    ? (words[words.length - 2][0] + words[words.length - 1][0]).toUpperCase()
                    : item.studentName.slice(0, 2).toUpperCase();

                const unitPercent = Math.round((item.completedUnits / item.totalUnits) * 100);

                return (
                  <tr key={item.studentId} className="hover:bg-sky-50/30 transition-colors group">
                    {/* Cột 1: Mã ID */}
                    <td className="py-4 px-5 font-mono text-[11px] text-slate-500 font-bold whitespace-nowrap">
                      {item.studentCode}
                    </td>

                    {/* Cột 2: Học sinh */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <Link to={`/teacher/ai-tracking/${item.studentId}`} className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 font-extrabold text-xs flex items-center justify-center border border-sky-200/70 flex-shrink-0">
                          {initials}
                        </div>
                        <span className="font-bold text-slate-900 group-hover:text-sky-600 transition-colors text-[13px]">
                          {item.studentName}
                        </span>
                      </Link>
                    </td>

                    {/* Cột 3: Lớp */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-slate-100 text-slate-800 border border-slate-200/70">
                        {item.className}
                      </span>
                    </td>

                    {/* Cột 4: Tiến độ tự học Unit */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="w-28">
                        <div className="flex justify-between text-[11px] mb-1.5">
                          <span className="font-bold text-slate-700">
                            Unit {item.completedUnits}/{item.totalUnits}
                          </span>
                          <span className="font-extrabold text-slate-900">{unitPercent}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${unitPercent}%` }}
                            transition={{ duration: 0.7, delay: idx * 0.08 }}
                            className="bg-sky-600 h-full rounded-full"
                          />
                        </div>
                      </div>
                    </td>

                    {/* Cột 5: Độ thành thạo */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="w-32">
                        <div className="flex justify-between text-[11px] mb-1.5">
                          <span className="text-slate-400 font-semibold">Đạt chuẩn:</span>
                          <span className="font-black text-slate-900">{item.masteryPercentage}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.masteryPercentage}%` }}
                            transition={{ duration: 0.7, delay: idx * 0.08 }}
                            className={`h-full rounded-full ${item.masteryPercentage >= 80
                                ? 'bg-emerald-500'
                                : item.masteryPercentage >= 65
                                  ? 'bg-sky-500'
                                  : 'bg-rose-500'
                              }`}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Cột 6: Playlist gợi ý */}
                    <td className="py-4 px-4">
                      {item.suggestedPlaylist.length === 0 ? (
                        <span className="text-emerald-600 font-bold text-xs">
                          Đã nắm vững toàn bộ kiến thức hiện tại
                        </span>
                      ) : (
                        <div className="space-y-2">
                          {item.suggestedPlaylist.map((pl, pIdx) => (
                            <div
                              key={pIdx}
                              className="flex items-center flex-wrap gap-2.5 text-xs bg-slate-50/90 px-3 py-1.5 rounded-xl border border-slate-200/60"
                            >
                              <span
                                className={`w-2 h-2 rounded-full flex-shrink-0 ${pl.status === 'COMPLETED'
                                    ? 'bg-emerald-500'
                                    : pl.status === 'IN_PROGRESS'
                                      ? 'bg-sky-500'
                                      : 'bg-slate-300'
                                  }`}
                              />
                              <span className="font-bold text-slate-800">
                                Unit {pl.unit}: {pl.topic}
                              </span>
                              <span className="text-[11px] font-medium text-slate-400">
                                ({pl.skill})
                              </span>
                              {pl.priority === 'HIGH' && (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200/60">
                                  Ưu tiên cao
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* Cột 7: Trạng thái */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {item.weakTopicCount === 0 ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          Chuẩn kiến thức
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200/60">
                          Cần bù {item.weakTopicCount} lỗ hổng
                        </span>
                      )}
                    </td>

                    {/* Cột 8: Nút xem chi tiết */}
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <Link
                        to={`/teacher/ai-tracking/${item.studentId}`}
                        className="w-8 h-8 inline-flex items-center justify-center text-slate-500 hover:text-sky-600 bg-white border border-slate-200 rounded-xl hover:bg-sky-50 hover:border-sky-200 transition-all shadow-2xs"
                        title="Xem chi tiết lộ trình học tập"
                      >
                        <Eye className="w-4 h-4 stroke-[2]" />
                      </Link>
                    </td>
                  </tr>
                );
              })}

              {filteredRoadmaps.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400 font-semibold">
                    Không tìm thấy lộ trình học sinh nào phù hợp với bộ lọc hiện tại.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer note */}
        <div className="p-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-medium text-slate-500 bg-slate-50/40">
          <span>
            Khi học sinh hoàn thành bài tập bù đắp đạt chuẩn, hệ thống tự động cập nhật mức độ thành thạo và xóa điểm yếu khỏi lộ trình.
          </span>
          <span className="font-extrabold text-slate-800 whitespace-nowrap">
            Hiển thị {filteredRoadmaps.length} học sinh
          </span>
        </div>

      </motion.div>

    </div>
  );
};