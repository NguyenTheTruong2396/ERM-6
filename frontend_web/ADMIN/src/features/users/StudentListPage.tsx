import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  FileSpreadsheet, Plus, Search, Eye, Edit3, Lock, Unlock, Trash2, X, Upload, AlertTriangle, CheckCircle2
} from 'lucide-react';

// 1. Dữ liệu mẫu tĩnh cho Danh sách Học sinh Tiếng Anh 6
const initialStudents = Array.from({ length: 25 }, (_, i) => ({
  id: `s${i + 1}`,
  code: `HS${(i + 1).toString().padStart(3, '0')}`,
  name: i % 2 === 0 ? `Nguyễn Văn An ${i + 1}` : `Trần Thị Mai ${i + 1}`,
  email: `student${i + 1}@student.hutech.edu.vn`,
  className: i % 4 === 0 ? 'Chưa xếp lớp' : `Lớp 6A${(i % 3) + 1}`,
  classId: i % 4 === 0 ? null : `c${(i % 3) + 1}`,
  progress: i % 4 === 0 ? null : {
    completedUnits: Math.min(12, i + 2),
    totalUnits: 12,
    percentage: Math.round((Math.min(12, i + 2) / 12) * 100)
  },
  parentName: i % 4 === 0 ? 'Chưa liên kết' : `Nguyễn Văn Trường (0908 123 ${100 + i})`,
  status: i % 5 === 0 ? 'LOCKED' : 'ACTIVE',
  createdAt: `2026-09-0${(i % 8) + 1}`,
}));

export const StudentListPage: React.FC = () => {
  const [students, setStudents] = useState(initialStudents);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'LOCKED'>('ALL');
  const [classFilter, setClassFilter] = useState<'ALL' | 'UNASSIGNED'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // State Modal
  const [selectedStudent, setSelectedStudent] = useState<typeof initialStudents[0] | null>(null);
  const [editingStudent, setEditingStudent] = useState<typeof initialStudents[0] | null>(null);
  const [lockingStudent, setLockingStudent] = useState<typeof initialStudents[0] | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<typeof initialStudents[0] | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // State Form Thêm học sinh
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newClass, setNewClass] = useState('Lớp 6A1');
  const [newParent, setNewParent] = useState('');

  // State Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Hàm xác nhận Khóa / Mở khóa tài khoản
  const handleConfirmToggleLock = () => {
    if (!lockingStudent) return;

    const nextStatus = lockingStudent.status === 'ACTIVE' ? 'LOCKED' : 'ACTIVE';
    setStudents((prev) =>
      prev.map((s) => (s.id === lockingStudent.id ? { ...s, status: nextStatus } : s))
    );

    const actionText = nextStatus === 'LOCKED' ? 'khóa' : 'mở khóa';
    showToast(`Đã ${actionText} tài khoản học sinh "${lockingStudent.name}" thành công!`);
    setLockingStudent(null);
  };

  // Hàm xác nhận xóa Học sinh
  const handleConfirmDelete = () => {
    if (!deletingStudent) return;

    setStudents((prev) => prev.filter((s) => s.id !== deletingStudent.id));
    showToast(`Đã xóa học sinh "${deletingStudent.name}" thành công!`);
    setDeletingStudent(null);
  };

  // Hàm tạo học sinh mới
  const handleCreateStudent = () => {
    if (!newName || !newEmail) return;

    const newStudentObj = {
      id: `s-${Date.now()}`,
      code: `HS${(students.length + 1).toString().padStart(3, '0')}`,
      name: newName,
      email: newEmail,
      className: newClass,
      classId: newClass === 'Chưa xếp lớp' ? null : newClass === 'Lớp 6A1' ? 'c1' : newClass === 'Lớp 6A2' ? 'c2' : 'c3',
      progress: { completedUnits: 0, totalUnits: 12, percentage: 0 },
      parentName: newParent || 'Chưa liên kết',
      status: 'ACTIVE',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setStudents((prev) => [newStudentObj, ...prev]);
    setShowAddModal(false);
    showToast(`Đã thêm học sinh "${newName}" thành công!`);
    setNewName('');
    setNewEmail('');
    setNewParent('');
  };

  // Hàm cập nhật thông tin học sinh
  const handleUpdateStudent = () => {
    if (!editingStudent) return;

    setStudents((prev) =>
      prev.map((s) => (s.id === editingStudent.id ? editingStudent : s))
    );
    showToast(`Đã cập nhật thông tin học sinh "${editingStudent.name}" thành công!`);
    setEditingStudent(null);
  };

  // Lọc dữ liệu học sinh
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' ? true : s.status === statusFilter;

    const matchesClass =
      classFilter === 'ALL' ? true : s.classId === null;

    return matchesSearch && matchesStatus && matchesClass;
  });

  // Phân trang 10 dòng/trang
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">

      {/* Page Title & Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Học sinh</h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowImportModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm whitespace-nowrap"
          >
            <FileSpreadsheet className="w-4 h-4 text-slate-500 stroke-[1.5]" />
            <span>Nhập từ Excel</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4 stroke-[2]" />
            <span>Thêm học sinh</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="text-xs font-medium text-slate-500">Tổng học sinh lớp 6</div>
          <div className="text-xl sm:text-2xl font-semibold text-slate-900 mt-1 tracking-tight">1,180</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="text-xs font-medium text-slate-500">Đang hoạt động</div>
          <div className="text-xl sm:text-2xl font-semibold text-slate-900 mt-1 tracking-tight">1,164</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="text-xs font-medium text-slate-500">Đã vào lớp</div>
          <div className="text-xl sm:text-2xl font-semibold text-slate-900 mt-1 tracking-tight">1,152</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="text-xs font-medium text-slate-500">Chưa xếp lớp</div>
          <div className="text-xl sm:text-2xl font-semibold text-slate-900 mt-1 tracking-tight">28</div>
        </div>
      </div>

      {/* Table Card Container */}
      <div className="bg-white border border-slate-200/80 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">

        {/* Filter Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">

          <div className="inline-flex p-1 bg-slate-100 rounded-md text-xs font-medium text-slate-600 self-start">
            <button
              onClick={() => { setStatusFilter('ALL'); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded transition-all ${statusFilter === 'ALL' ? 'bg-white text-slate-900 font-semibold shadow-sm' : 'hover:text-slate-900'}`}
            >
              Tất cả ({students.length})
            </button>
            <button
              onClick={() => { setStatusFilter('ACTIVE'); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded transition-all ${statusFilter === 'ACTIVE' ? 'bg-white text-slate-900 font-semibold shadow-sm' : 'hover:text-slate-900'}`}
            >
              Hoạt động ({students.filter(s => s.status === 'ACTIVE').length})
            </button>
            <button
              onClick={() => { setStatusFilter('LOCKED'); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded transition-all ${statusFilter === 'LOCKED' ? 'bg-white text-slate-900 font-semibold shadow-sm' : 'hover:text-slate-900'}`}
            >
              Đã khóa ({students.filter(s => s.status === 'LOCKED').length})
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 w-full lg:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 stroke-[1.5]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Tìm học sinh, email, mã ID..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-400 transition-all"
              />
            </div>

            {/* Class Filter Dropdown */}
            <div className="w-full sm:w-auto">
              <select
                value={classFilter}
                onChange={(e) => { setClassFilter(e.target.value as 'ALL' | 'UNASSIGNED'); setCurrentPage(1); }}
                className="w-full sm:w-auto text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md px-3 py-1.5 focus:outline-none focus:border-slate-400 shadow-sm cursor-pointer"
              >
                <option value="ALL">Lớp: Tất cả các lớp</option>
                <option value="UNASSIGNED">Lớp: Chưa xếp lớp</option>
              </select>
            </div>
          </div>

        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[880px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                <th className="py-3 px-4 w-20">Mã ID</th>
                <th className="py-3 px-4 min-w-[200px]">Học sinh</th>
                <th className="py-3 px-4 w-32">Lớp</th>
                <th className="py-3 px-4 min-w-[170px]">Tiến độ 12 Unit</th>
                <th className="py-3 px-4 min-w-[220px]">Phụ huynh liên kết</th>
                <th className="py-3 px-4 w-32">Trạng thái</th>
                <th className="py-3 px-4 w-32">Ngày tham gia</th>
                <th className="py-3 px-4 text-right pr-6 w-36">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {paginatedStudents.map((student) => {
                const words = student.name.trim().split(' ');
                const initials = words.length >= 2
                  ? (words[words.length - 2][0] + words[words.length - 1][0]).toUpperCase()
                  : student.name.slice(0, 2).toUpperCase();

                return (
                  <tr key={student.id} className="hover:bg-slate-50/60 transition-colors group">
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 font-medium whitespace-nowrap">
                      {student.code}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px] flex items-center justify-center border border-slate-200 flex-shrink-0">
                          {initials}
                        </div>
                        <div>
                          <div className={`font-medium ${student.status === 'LOCKED' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                            {student.name}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700 whitespace-nowrap">
                      {student.className || 'Chưa xếp lớp'}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {student.progress ? (
                        <div className="w-28">
                          <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                            <span>{student.progress.completedUnits} / {student.progress.totalUnits} Unit</span>
                            <span className="font-medium text-slate-900">{student.progress.percentage}%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-slate-900 h-1.5 rounded-full" style={{ width: `${student.progress.percentage}%` }}></div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {student.parentName}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {student.status === 'ACTIVE' ? (
                        <span className="inline-flex items-center gap-1.5 text-slate-600 font-medium whitespace-nowrap">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0"></span>
                          Hoạt động
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-slate-400 font-medium whitespace-nowrap">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0"></span>
                          Đã khóa
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono whitespace-nowrap">{student.createdAt}</td>

                    {/* Icon Thao tác với hiệu ứng Hover Nền & Đổi màu Ổ khóa chuẩn */}
                    <td className="py-3.5 px-4 text-right pr-6 whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 justify-end">

                        {/* Nút Xem chi tiết */}
                        <button
                          onClick={() => setSelectedStudent(student)}
                          className="w-7 h-7 inline-flex items-center justify-center text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-100 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-3.5 h-3.5 stroke-[1.5]" />
                        </button>

                        {/* Nút Chỉnh sửa */}
                        <button
                          onClick={() => setEditingStudent(student)}
                          className="w-7 h-7 inline-flex items-center justify-center text-slate-500 bg-white border border-slate-200 rounded hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
                          title="Chỉnh sửa"
                        >
                          <Edit3 className="w-3.5 h-3.5 stroke-[1.5]" />
                        </button>

                        {/* Nút Khóa / Mở khóa (Đang hoạt động => Ổ mở + Nền xanh | Đang khóa => Ổ đóng + Nền đỏ) */}
                        <button
                          onClick={() => setLockingStudent(student)}
                          className={`w-7 h-7 inline-flex items-center justify-center border rounded transition-all shadow-sm ${student.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200/80 hover:bg-emerald-100 hover:border-emerald-300'
                            : 'bg-red-50 text-red-600 border-red-200/80 hover:bg-red-100 hover:border-red-300'
                            }`}
                          title={student.status === 'ACTIVE' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                        >
                          {student.status === 'ACTIVE' ? (
                            <Unlock className="w-3.5 h-3.5 stroke-[1.75]" />
                          ) : (
                            <Lock className="w-3.5 h-3.5 stroke-[1.75]" />
                          )}
                        </button>

                        {/* Nút Xóa */}
                        <button
                          onClick={() => setDeletingStudent(student)}
                          className="w-7 h-7 inline-flex items-center justify-center text-slate-500 bg-white border border-slate-200 rounded hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all shadow-sm"
                          title="Xóa học sinh"
                        >
                          <Trash2 className="w-3.5 h-3.5 stroke-[1.5]" />
                        </button>

                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Thanh chuyển trang (Phân trang 1 đến 10) */}
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="w-full sm:w-auto text-center sm:text-left">
            Hiển thị <span className="font-semibold text-slate-900">{filteredStudents.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> đến <span className="font-semibold text-slate-900">{Math.min(currentPage * itemsPerPage, filteredStudents.length)}</span> của <span className="font-semibold text-slate-900">{filteredStudents.length}</span> học sinh
          </div>

          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`px-2.5 py-1.5 border border-slate-200 rounded text-xs font-medium transition-colors ${currentPage === 1 ? 'text-slate-300 cursor-not-allowed bg-slate-50' : 'text-slate-700 hover:bg-slate-50'
                }`}
            >
              Trước
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1.5 border rounded font-medium text-xs transition-all ${currentPage === page
                  ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`px-2.5 py-1.5 border border-slate-200 rounded text-xs font-medium transition-colors ${currentPage === totalPages ? 'text-slate-300 cursor-not-allowed bg-slate-50' : 'text-slate-700 hover:bg-slate-50'
                }`}
            >
              Sau
            </button>
          </div>

          <div className="flex sm:hidden items-center justify-between w-full pt-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-slate-200 rounded text-slate-600 disabled:opacity-40 text-xs font-medium"
            >
              ← Trước
            </button>
            <span className="text-xs font-medium text-slate-700">Trang <span className="font-semibold text-slate-900">{currentPage}</span> / {totalPages}</span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border border-slate-200 rounded text-slate-600 disabled:opacity-40 text-xs font-medium"
            >
              Sau →
            </button>
          </div>
        </div>

      </div>

      {/* TOAST NOTIFICATION */}
      {toastMessage && createPortal(
        <div className="fixed bottom-5 right-5 z-[10000] flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white rounded-lg shadow-xl text-xs font-medium animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 stroke-[2]" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>,
        document.body
      )}

      {/* MODAL 1: Thêm học sinh mới */}
      {showAddModal && createPortal(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-semibold text-slate-900">Thêm học sinh mới</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700 p-1 rounded-md">
                <X className="w-4 h-4 stroke-[1.5]" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Họ và tên học sinh</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn An"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Email học sinh</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="an.nv@student.hutech.edu.vn"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Xếp vào lớp học</label>
                <select
                  value={newClass}
                  onChange={(e) => setNewClass(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-md text-slate-700 focus:outline-none focus:border-slate-400 shadow-sm"
                >
                  <option value="Chưa xếp lớp">Chưa xếp lớp</option>
                  <option value="Lớp 6A1">Lớp 6A1</option>
                  <option value="Lớp 6A2">Lớp 6A2</option>
                  <option value="Lớp 6A3">Lớp 6A3</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Phụ huynh liên kết (Tùy chọn)</label>
                <input
                  type="text"
                  value={newParent}
                  onChange={(e) => setNewParent(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn Trường (0908 123 456)"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-400 transition-all"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md transition-colors font-medium"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleCreateStudent}
                className="px-3.5 py-1.5 text-xs bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors font-medium shadow-sm"
              >
                Lưu học sinh
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL 2: Nhập danh sách từ Excel */}
      {showImportModal && createPortal(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-semibold text-slate-900">Nhập danh sách học sinh từ Excel</h3>
              <button onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-slate-700 p-1 rounded-md">
                <X className="w-4 h-4 stroke-[1.5]" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 border-2 border-dashed border-slate-200 rounded-lg text-center bg-slate-50 hover:bg-slate-100/50 transition-colors cursor-pointer space-y-2">
                <Upload className="w-6 h-6 text-slate-400 mx-auto stroke-[1.5]" />
                <div className="font-medium text-slate-700">Tải lên file Excel danh sách học sinh</div>
                <div className="text-[11px] text-slate-400">Hỗ trợ định dạng .xlsx, .xls (Tối đa 10MB)</div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  showToast('Đã tải lên và nhập danh sách học sinh từ Excel thành công!');
                  setShowImportModal(false);
                }}
                className="px-3.5 py-1.5 text-xs bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors font-medium shadow-sm"
              >
                Tiến hành Import
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL 3: Xem chi tiết Học sinh */}
      {selectedStudent && createPortal(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-semibold text-slate-900">Chi tiết Học sinh</h3>
              <button onClick={() => setSelectedStudent(null)} className="text-slate-400 hover:text-slate-700 p-1 rounded-md">
                <X className="w-4 h-4 stroke-[1.5]" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                  {selectedStudent.code}
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-sm">{selectedStudent.name}</div>
                  <div className="text-slate-500 font-mono text-[11px]">{selectedStudent.email}</div>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Lớp đang học:</span>
                  <span className="font-semibold text-slate-900">{selectedStudent.className || 'Chưa xếp lớp'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Tiến độ bài học:</span>
                  <span className="font-semibold text-slate-900">
                    {selectedStudent.progress ? `${selectedStudent.progress.completedUnits}/12 Unit (${selectedStudent.progress.percentage}%)` : 'Chưa tham gia'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Phụ huynh:</span>
                  <span className="font-medium text-slate-800">{selectedStudent.parentName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Trạng thái:</span>
                  <span className={`font-semibold ${selectedStudent.status === 'ACTIVE' ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {selectedStudent.status === 'ACTIVE' ? 'Đang hoạt động' : 'Tài khoản bị khóa'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Ngày tạo:</span>
                  <span className="font-mono text-slate-600">{selectedStudent.createdAt}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-3.5 py-1.5 text-xs bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors font-medium shadow-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL 4: Chỉnh sửa thông tin học sinh */}
      {editingStudent && createPortal(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-semibold text-slate-900">Chỉnh sửa thông tin học sinh</h3>
              <button onClick={() => setEditingStudent(null)} className="text-slate-400 hover:text-slate-700 p-1 rounded-md">
                <X className="w-4 h-4 stroke-[1.5]" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Họ và tên học sinh</label>
                <input
                  type="text"
                  value={editingStudent.name}
                  onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Email học sinh</label>
                <input
                  type="email"
                  value={editingStudent.email}
                  onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Lớp học</label>
                <select
                  value={editingStudent.className || 'Chưa xếp lớp'}
                  onChange={(e) => setEditingStudent({
                    ...editingStudent,
                    className: e.target.value,
                    classId: e.target.value === 'Chưa xếp lớp' ? null : editingStudent.classId || 'c1'
                  })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-md text-slate-700 focus:outline-none focus:border-slate-400 shadow-sm"
                >
                  <option value="Chưa xếp lớp">Chưa xếp lớp</option>
                  <option value="Lớp 6A1">Lớp 6A1</option>
                  <option value="Lớp 6A2">Lớp 6A2</option>
                  <option value="Lớp 6A3">Lớp 6A3</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Phụ huynh liên kết</label>
                <input
                  type="text"
                  value={editingStudent.parentName}
                  onChange={(e) => setEditingStudent({ ...editingStudent, parentName: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-400 transition-all"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setEditingStudent(null)}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdateStudent}
                className="px-3.5 py-1.5 text-xs bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors font-medium shadow-sm"
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL 5: Modal Xác nhận Khóa / Mở khóa tài khoản */}
      {lockingStudent && createPortal(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Xác nhận {lockingStudent.status === 'ACTIVE' ? 'khóa' : 'mở khóa'} tài khoản
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Thay đổi trạng thái truy cập của học sinh.</p>
              </div>
            </div>

            <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
              {lockingStudent.status === 'ACTIVE' ? (
                <span>
                  Bạn có chắc chắn muốn khóa tài khoản học sinh <strong className="text-slate-900">{lockingStudent.name}</strong> ({lockingStudent.code})?
                </span>
              ) : (
                <span>
                  Bạn có chắc chắn muốn mở khóa tài khoản học sinh <strong className="text-slate-900">{lockingStudent.name}</strong> ({lockingStudent.code})?
                </span>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setLockingStudent(null)}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md transition-colors font-medium"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmToggleLock}
                className={`px-3.5 py-1.5 text-xs text-white rounded-md transition-colors font-medium shadow-sm ${lockingStudent.status === 'ACTIVE'
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
              >
                {lockingStudent.status === 'ACTIVE' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL 6: Modal Xác nhận Xóa học sinh */}
      {deletingStudent && createPortal(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Xác nhận xóa học sinh</h3>
                <p className="text-xs text-slate-500 mt-0.5">Hành động này không thể hoàn tác.</p>
              </div>
            </div>

            <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
              Bạn có chắc chắn muốn xóa học sinh <strong className="text-slate-900">{deletingStudent.name}</strong> ({deletingStudent.code})?
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setDeletingStudent(null)}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md transition-colors font-medium"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-3.5 py-1.5 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium shadow-sm"
              >
                Xóa học sinh
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};