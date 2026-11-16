import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Plus, Search, Eye, Edit3, Trash2, Phone, X, AlertTriangle, CheckCircle2
} from 'lucide-react';

// 1. Dữ liệu mẫu tĩnh cho Danh sách Giáo viên Tiếng Anh 6
const initialTeachers = [
  {
    id: 't1',
    code: 'GV001',
    name: 'ThS. Nguyễn Mạnh Hùng',
    email: 'hung.nm@hutech.edu.vn',
    subject: 'Ngữ pháp & Luyện viết',
    assignedClasses: ['6A1', '6A3'],
    phone: '0903 123 456',
    createdAt: '2026-05-10',
  },
  {
    id: 't2',
    code: 'GV002',
    name: 'Cô Trần Thị Hương',
    email: 'huong.tt@hutech.edu.vn',
    subject: 'Từ vựng & Kỹ năng Đọc',
    assignedClasses: ['6A2'],
    phone: '0918 234 567',
    createdAt: '2026-05-15',
  },
  {
    id: 't3',
    code: 'GV003',
    name: 'Thầy Lê Văn Nam',
    email: 'nam.lv@hutech.edu.vn',
    subject: 'Giao tiếp & Luyện phát âm AI',
    assignedClasses: ['6A4', '6A5'],
    phone: '0989 345 678',
    createdAt: '2026-06-01',
  },
  {
    id: 't4',
    code: 'GV004',
    name: 'TS. Nguyễn Hà Giang',
    email: 'giang.nh@hutech.edu.vn',
    subject: 'Tổng quan SGK Tiếng Anh 6',
    assignedClasses: ['6A1', '6A2', '6A6'],
    phone: '0977 456 789',
    createdAt: '2026-06-10',
  },
  {
    id: 't5',
    code: 'GV005',
    name: 'ThS. Hoàng Trọng Nghĩa',
    email: 'nghia.ht@hutech.edu.vn',
    subject: 'Phương pháp Giảng dạy AI',
    assignedClasses: [],
    phone: '0938 999 888',
    createdAt: '2026-07-01',
  },
  {
    id: 't6',
    code: 'GV006',
    name: 'Cô Phạm Kim Ngân',
    email: 'ngan.pk@hutech.edu.vn',
    subject: 'Luyện nghe & Phản xạ',
    assignedClasses: [],
    phone: '0912 666 777',
    createdAt: '2026-07-15',
  },
];

export const TeacherListPage: React.FC = () => {
  const [teachers, setTeachers] = useState(initialTeachers);
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState<'ALL' | 'ASSIGNED' | 'UNASSIGNED'>('ALL');

  // State Modals
  const [selectedTeacher, setSelectedTeacher] = useState<typeof initialTeachers[0] | null>(null);
  const [editingTeacher, setEditingTeacher] = useState<typeof initialTeachers[0] | null>(null);
  const [deletingTeacher, setDeletingTeacher] = useState<typeof initialTeachers[0] | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // State Form Thêm mới Giáo viên
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newSubject, setNewSubject] = useState('Ngữ pháp & Luyện viết');
  const [newPhone, setNewPhone] = useState('');
  const [newClassesInput, setNewClassesInput] = useState('6A1, 6A2');

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

  // Hàm xác nhận xóa Giáo viên
  const handleConfirmDelete = () => {
    if (!deletingTeacher) return;

    setTeachers((prev) => prev.filter((t) => t.id !== deletingTeacher.id));
    showToast(`Đã xóa giáo viên "${deletingTeacher.name}" thành công!`);
    setDeletingTeacher(null);
  };

  // Hàm tạo Giáo viên mới
  const handleCreateTeacher = () => {
    if (!newName || !newEmail) return;

    const assignedClassesArray = newClassesInput
      .split(',')
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    const newTeacherObj = {
      id: `t-${Date.now()}`,
      code: `GV00${teachers.length + 1}`,
      name: newName,
      email: newEmail,
      subject: newSubject,
      assignedClasses: assignedClassesArray,
      phone: newPhone || 'Chưa cập nhật',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setTeachers((prev) => [newTeacherObj, ...prev]);
    setShowAddModal(false);
    showToast(`Đã thêm giáo viên "${newName}" thành công!`);
    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setNewClassesInput('6A1, 6A2');
  };

  // Hàm cập nhật thông tin Giáo viên
  const handleUpdateTeacher = () => {
    if (!editingTeacher) return;

    setTeachers((prev) =>
      prev.map((t) => (t.id === editingTeacher.id ? editingTeacher : t))
    );
    showToast(`Đã cập nhật thông tin giáo viên "${editingTeacher.name}" thành công!`);
    setEditingTeacher(null);
  };

  // Lọc danh sách giáo viên theo Tìm kiếm & Dropdown Phân công lớp
  const filteredTeachers = teachers.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase()) ||
      t.code.toLowerCase().includes(search.toLowerCase());

    const matchesClass =
      classFilter === 'ALL'
        ? true
        : classFilter === 'ASSIGNED'
          ? t.assignedClasses.length > 0
          : t.assignedClasses.length === 0;

    return matchesSearch && matchesClass;
  });

  return (
    <div className="space-y-6">

      {/* Page Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Giáo viên</h1>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors shadow-sm whitespace-nowrap"
        >
          <Plus className="w-4 h-4 stroke-[2]" />
          <span>Thêm giáo viên</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="text-xs font-medium text-slate-500">Tổng số giáo viên</div>
          <div className="text-xl sm:text-2xl font-semibold text-slate-900 mt-1 tracking-tight">
            {teachers.length}
          </div>
        </div>
        <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="text-xs font-medium text-slate-500">Đã phân công lớp</div>
          <div className="text-xl sm:text-2xl font-semibold text-slate-900 mt-1 tracking-tight">
            {teachers.filter(t => t.assignedClasses.length > 0).length}
          </div>
        </div>
        <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="text-xs font-medium text-slate-500">Chưa phân công lớp</div>
          <div className="text-xl sm:text-2xl font-semibold text-amber-600 mt-1 tracking-tight">
            {teachers.filter(t => t.assignedClasses.length === 0).length}
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-slate-200/80 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">

        {/* Filter Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 stroke-[1.5]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm giáo viên theo tên, email, mã ID..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-400 transition-all"
            />
          </div>

          {/* Dropdown Lọc Đã xếp lớp / Chưa xếp lớp */}
          <div className="w-full sm:w-auto">
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value as 'ALL' | 'ASSIGNED' | 'UNASSIGNED')}
              className="w-full sm:w-auto text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md px-3 py-1.5 focus:outline-none focus:border-slate-400 shadow-sm cursor-pointer"
            >
              <option value="ALL">Phân công: Tất cả giáo viên</option>
              <option value="ASSIGNED">Phân công: Đã xếp lớp giảng dạy</option>
              <option value="UNASSIGNED">Phân công: Chưa xếp lớp giảng dạy</option>
            </select>
          </div>

        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                <th className="py-3 px-4 w-20">Mã ID</th>
                <th className="py-3 px-4 min-w-[180px]">Giáo viên</th>
                <th className="py-3 px-4 min-w-[170px]">Chuyên đề phụ trách</th>
                <th className="py-3 px-4 min-w-[160px]">Lớp đang giảng dạy</th>
                <th className="py-3 px-4 min-w-[130px]">Liên hệ</th>
                <th className="py-3 px-4 text-right pr-6 w-28">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredTeachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 font-medium whitespace-nowrap">
                    {teacher.code}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-medium text-slate-900">
                      {teacher.name}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">{teacher.email}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">{teacher.subject}</td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {teacher.assignedClasses && teacher.assignedClasses.length > 0 ? (
                      <div className="flex gap-1 flex-wrap">
                        {teacher.assignedClasses.map((c) => (
                          <span
                            key={c}
                            className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60 whitespace-nowrap"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-500 border border-slate-200">
                        Chưa xếp lớp
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 font-mono">
                      <Phone className="w-3 h-3 text-slate-400 flex-shrink-0" /> {teacher.phone}
                    </div>
                  </td>

                  {/* Icon Thao tác */}
                  <td className="py-3.5 px-4 text-right pr-6 whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5 justify-end">

                      {/* Nút Xem chi tiết */}
                      <button
                        onClick={() => setSelectedTeacher(teacher)}
                        className="w-7 h-7 inline-flex items-center justify-center text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-100 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-3.5 h-3.5 stroke-[1.5]" />
                      </button>

                      {/* Nút Chỉnh sửa */}
                      <button
                        onClick={() => setEditingTeacher(teacher)}
                        className="w-7 h-7 inline-flex items-center justify-center text-slate-500 bg-white border border-slate-200 rounded hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
                        title="Chỉnh sửa thông tin"
                      >
                        <Edit3 className="w-3.5 h-3.5 stroke-[1.5]" />
                      </button>

                      {/* Nút Xóa */}
                      <button
                        onClick={() => setDeletingTeacher(teacher)}
                        className="w-7 h-7 inline-flex items-center justify-center text-slate-500 bg-white border border-slate-200 rounded hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all shadow-sm"
                        title="Xóa giáo viên"
                      >
                        <Trash2 className="w-3.5 h-3.5 stroke-[1.5]" />
                      </button>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

      {/* MODAL 1: Thêm Giáo viên mới */}
      {showAddModal && createPortal(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-semibold text-slate-900">Thêm Giáo viên mới</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700 p-1 rounded-md">
                <X className="w-4 h-4 stroke-[1.5]" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Họ và tên Giáo viên</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ví dụ: ThS. Nguyễn Văn A"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Email trường</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="a.nv@hutech.edu.vn"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Chuyên đề phụ trách</label>
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="Ngữ pháp & Luyện viết"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Số điện thoại</label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="0903 123 456"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Phân công các lớp (Để trống nếu chưa xếp lớp)</label>
                <input
                  type="text"
                  value={newClassesInput}
                  onChange={(e) => setNewClassesInput(e.target.value)}
                  placeholder="6A1, 6A2, 6A3"
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
                onClick={handleCreateTeacher}
                className="px-3.5 py-1.5 text-xs bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors font-medium shadow-sm"
              >
                Lưu giáo viên
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL 2: Xem chi tiết Giáo viên */}
      {selectedTeacher && createPortal(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-semibold text-slate-900">Chi tiết Giáo viên</h3>
              <button onClick={() => setSelectedTeacher(null)} className="text-slate-400 hover:text-slate-700 p-1 rounded-md">
                <X className="w-4 h-4 stroke-[1.5]" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="font-semibold text-slate-900 text-sm">{selectedTeacher.name}</div>
                <div className="text-slate-500 font-mono text-[11px] mt-0.5">{selectedTeacher.email}</div>
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Mã giáo viên:</span>
                  <span className="font-mono font-medium text-slate-900">{selectedTeacher.code}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Chuyên đề phụ trách:</span>
                  <span className="font-semibold text-slate-900">{selectedTeacher.subject}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 items-center">
                  <span className="text-slate-500">Lớp phụ trách:</span>
                  {selectedTeacher.assignedClasses && selectedTeacher.assignedClasses.length > 0 ? (
                    <div className="flex gap-1 flex-wrap">
                      {selectedTeacher.assignedClasses.map((c) => (
                        <span key={c} className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
                          {c}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-slate-400">Chưa xếp lớp</span>
                  )}
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Số điện thoại:</span>
                  <span className="font-mono text-slate-800">{selectedTeacher.phone}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Ngày thêm:</span>
                  <span className="font-mono text-slate-600">{selectedTeacher.createdAt}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedTeacher(null)}
                className="px-3.5 py-1.5 text-xs bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors font-medium shadow-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL 3: Chỉnh sửa thông tin Giáo viên */}
      {editingTeacher && createPortal(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-semibold text-slate-900">Chỉnh sửa thông tin Giáo viên</h3>
              <button onClick={() => setEditingTeacher(null)} className="text-slate-400 hover:text-slate-700 p-1 rounded-md">
                <X className="w-4 h-4 stroke-[1.5]" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Họ và tên Giáo viên</label>
                <input
                  type="text"
                  value={editingTeacher.name}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, name: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Email trường</label>
                <input
                  type="email"
                  value={editingTeacher.email}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, email: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Chuyên đề phụ trách</label>
                <input
                  type="text"
                  value={editingTeacher.subject}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, subject: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Số điện thoại</label>
                <input
                  type="text"
                  value={editingTeacher.phone}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, phone: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-400 transition-all"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setEditingTeacher(null)}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdateTeacher}
                className="px-3.5 py-1.5 text-xs bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors font-medium shadow-sm"
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL 4: Modal Xác nhận Xóa Giáo viên */}
      {deletingTeacher && createPortal(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Xác nhận xóa giáo viên</h3>
                <p className="text-xs text-slate-500 mt-0.5">Hành động này không thể hoàn tác.</p>
              </div>
            </div>

            <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
              Bạn có chắc chắn muốn xóa tài khoản giáo viên <strong className="text-slate-900">{deletingTeacher.name}</strong> ({deletingTeacher.code})?
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setDeletingTeacher(null)}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md transition-colors font-medium"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-3.5 py-1.5 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium shadow-sm"
              >
                Xóa giáo viên
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};