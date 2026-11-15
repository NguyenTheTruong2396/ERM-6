import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Plus, Search, Eye, Edit3, Trash2, Phone, X, AlertTriangle, CheckCircle2
} from 'lucide-react';

// 1. Dữ liệu mẫu tĩnh cho Danh sách Phụ huynh (Ghép nối qua SĐT & SMS OTP)
const initialParents = [
  {
    id: 'p1',
    code: 'PH001',
    name: 'Nguyễn Văn Hùng',
    email: 'hung.nv@gmail.com',
    phone: '0908 123 456',
    studentName: 'Nguyễn Văn An (6A1)',
    isLinked: true,
    createdAt: '2026-10-12',
  },
  {
    id: 'p2',
    code: 'PH002',
    name: 'Phan Thị Mai',
    email: 'mai.pt@gmail.com',
    phone: '0912 345 678',
    studentName: 'Trần Minh Hòa (6A1)',
    isLinked: true,
    createdAt: '2026-10-15',
  },
  {
    id: 'p3',
    code: 'PH003',
    name: 'Lê Hoàng Nam',
    email: 'nam.lh@gmail.com',
    phone: '0988 765 432',
    studentName: 'Chưa liên kết',
    isLinked: false,
    createdAt: '2026-10-20',
  },
  {
    id: 'p4',
    code: 'PH004',
    name: 'Vũ Thị Ngọc',
    email: 'ngoc.vt@gmail.com',
    phone: '0977 888 999',
    studentName: 'Vũ Bảo Lâm (6A3)',
    isLinked: true,
    createdAt: '2026-11-01',
  },
  {
    id: 'p5',
    code: 'PH005',
    name: 'Trần Đình Trọng',
    email: 'trong.td@gmail.com',
    phone: '0933 111 222',
    studentName: 'Chưa liên kết',
    isLinked: false,
    createdAt: '2026-11-02',
  },
];

export const ParentListPage: React.FC = () => {
  const [parents, setParents] = useState(initialParents);
  const [search, setSearch] = useState('');
  const [linkFilter, setLinkFilter] = useState<'ALL' | 'LINKED' | 'UNLINKED'>('ALL');

  // State Modals
  const [selectedParent, setSelectedParent] = useState<typeof initialParents[0] | null>(null);
  const [editingParent, setEditingParent] = useState<typeof initialParents[0] | null>(null);
  const [deletingParent, setDeletingParent] = useState<typeof initialParents[0] | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // State Form Thêm Phụ huynh mới
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newStudentName, setNewStudentName] = useState('');

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

  // Hàm xác nhận xóa Phụ huynh
  const handleConfirmDelete = () => {
    if (!deletingParent) return;

    setParents((prev) => prev.filter((p) => p.id !== deletingParent.id));
    showToast(`Đã xóa tài khoản phụ huynh "${deletingParent.name}" thành công!`);
    setDeletingParent(null);
  };

  // Hàm tạo Phụ huynh mới
  const handleCreateParent = () => {
    if (!newName || !newPhone) return;

    const isHasStudent = Boolean(newStudentName.trim());
    const newParentObj = {
      id: `p-${Date.now()}`,
      code: `PH00${parents.length + 1}`,
      name: newName,
      email: newEmail || 'Chưa cập nhật',
      phone: newPhone,
      studentName: isHasStudent ? newStudentName : 'Chưa liên kết',
      isLinked: isHasStudent,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setParents((prev) => [newParentObj, ...prev]);
    setShowAddModal(false);
    showToast(`Đã thêm phụ huynh "${newName}" thành công!`);
    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setNewStudentName('');
  };

  // Hàm cập nhật thông tin Phụ huynh
  const handleUpdateParent = () => {
    if (!editingParent) return;

    const isHasStudent = editingParent.studentName.trim() !== '' && editingParent.studentName !== 'Chưa liên kết';
    const updated = {
      ...editingParent,
      isLinked: isHasStudent,
    };

    setParents((prev) =>
      prev.map((p) => (p.id === editingParent.id ? updated : p))
    );
    showToast(`Đã cập nhật thông tin phụ huynh "${editingParent.name}" thành công!`);
    setEditingParent(null);
  };

  // Lọc danh sách phụ huynh theo Tên/SĐT và Trạng thái Liên kết
  const filtered = parents.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.phone && p.phone.includes(search)) ||
      p.code.toLowerCase().includes(search.toLowerCase());

    const matchesLink =
      linkFilter === 'ALL'
        ? true
        : linkFilter === 'LINKED'
          ? p.isLinked
          : !p.isLinked;

    return matchesSearch && matchesLink;
  });

  return (
    <div className="space-y-6">

      {/* Page Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Phụ huynh</h1>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors shadow-sm whitespace-nowrap"
        >
          <Plus className="w-4 h-4 stroke-[2]" />
          <span>Thêm phụ huynh</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="text-xs font-medium text-slate-500">Tổng phụ huynh</div>
          <div className="text-xl sm:text-2xl font-semibold text-slate-900 mt-1 tracking-tight">
            {parents.length}
          </div>
        </div>
        <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="text-xs font-medium text-slate-500">Đã ghép nối con</div>
          <div className="text-xl sm:text-2xl font-semibold text-slate-900 mt-1 tracking-tight">
            {parents.filter(p => p.isLinked).length}
          </div>
        </div>
        <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="text-xs font-medium text-slate-500">Chưa liên kết con</div>
          <div className="text-xl sm:text-2xl font-semibold text-amber-600 mt-1 tracking-tight">
            {parents.filter(p => !p.isLinked).length}
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
              placeholder="Tìm phụ huynh, SĐT, mã ID..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-400 transition-all"
            />
          </div>

          {/* Dropdown Lọc Đã liên kết / Chưa liên kết */}
          <div className="w-full sm:w-auto">
            <select
              value={linkFilter}
              onChange={(e) => setLinkFilter(e.target.value as 'ALL' | 'LINKED' | 'UNLINKED')}
              className="w-full sm:w-auto text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md px-3 py-1.5 focus:outline-none focus:border-slate-400 shadow-sm cursor-pointer"
            >
              <option value="ALL">Liên kết: Tất cả phụ huynh</option>
              <option value="LINKED">Liên kết: Đã liên kết tài khoản con</option>
              <option value="UNLINKED">Liên kết: Chưa liên kết tài khoản con</option>
            </select>
          </div>

        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                <th className="py-3 px-4 w-20">Mã ID</th>
                <th className="py-3 px-4 min-w-[180px]">Phụ huynh</th>
                <th className="py-3 px-4 min-w-[170px]">Số điện thoại (SMS OTP)</th>
                <th className="py-3 px-4 min-w-[180px]">Học sinh liên kết</th>
                <th className="py-3 px-4 w-32">Ngày liên kết</th>
                <th className="py-3 px-4 text-right pr-6 w-28">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.map((parent) => (
                <tr key={parent.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 font-medium whitespace-nowrap">
                    {parent.code}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-medium text-slate-900">
                      {parent.name}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">{parent.email}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-700 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" /> {parent.phone}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {parent.isLinked ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
                        {parent.studentName}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-500 border border-slate-200">
                        Chưa liên kết
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono whitespace-nowrap">{parent.createdAt}</td>

                  {/* Icon Thao tác */}
                  <td className="py-3.5 px-4 text-right pr-6 whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5 justify-end">

                      {/* Nút Xem chi tiết */}
                      <button
                        onClick={() => setSelectedParent(parent)}
                        className="w-7 h-7 inline-flex items-center justify-center text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-100 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-3.5 h-3.5 stroke-[1.5]" />
                      </button>

                      {/* Nút Chỉnh sửa */}
                      <button
                        onClick={() => setEditingParent(parent)}
                        className="w-7 h-7 inline-flex items-center justify-center text-slate-500 bg-white border border-slate-200 rounded hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
                        title="Chỉnh sửa thông tin"
                      >
                        <Edit3 className="w-3.5 h-3.5 stroke-[1.5]" />
                      </button>

                      {/* Nút Xóa Phụ huynh */}
                      <button
                        onClick={() => setDeletingParent(parent)}
                        className="w-7 h-7 inline-flex items-center justify-center text-slate-500 bg-white border border-slate-200 rounded hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all shadow-sm"
                        title="Xóa phụ huynh"
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

      {/* MODAL 1: Thêm Phụ huynh mới */}
      {showAddModal && createPortal(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-semibold text-slate-900">Thêm Phụ huynh mới</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700 p-1 rounded-md">
                <X className="w-4 h-4 stroke-[1.5]" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Họ và tên Phụ huynh</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn Hùng"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Số điện thoại (Nhận OTP)</label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="0908 123 456"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Email liên hệ (Tùy chọn)</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="hung.nv@gmail.com"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Học sinh liên kết (Tùy chọn)</label>
                <input
                  type="text"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn An (6A1)"
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
                onClick={handleCreateParent}
                className="px-3.5 py-1.5 text-xs bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors font-medium shadow-sm"
              >
                Lưu phụ huynh
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL 2: Xem chi tiết Phụ huynh */}
      {selectedParent && createPortal(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-semibold text-slate-900">Chi tiết Phụ huynh</h3>
              <button onClick={() => setSelectedParent(null)} className="text-slate-400 hover:text-slate-700 p-1 rounded-md">
                <X className="w-4 h-4 stroke-[1.5]" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="font-semibold text-slate-900 text-sm">{selectedParent.name}</div>
                <div className="text-slate-500 font-mono text-[11px] mt-0.5">{selectedParent.email}</div>
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Mã phụ huynh:</span>
                  <span className="font-mono font-medium text-slate-900">{selectedParent.code}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">SĐT nhận OTP:</span>
                  <span className="font-mono text-slate-800 font-semibold">{selectedParent.phone}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Con đang học:</span>
                  <span className={`font-semibold ${selectedParent.isLinked ? 'text-amber-700' : 'text-slate-400'}`}>
                    {selectedParent.studentName}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Ngày liên kết:</span>
                  <span className="font-mono text-slate-600">{selectedParent.createdAt}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedParent(null)}
                className="px-3.5 py-1.5 text-xs bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors font-medium shadow-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL 3: Chỉnh sửa thông tin Phụ huynh */}
      {editingParent && createPortal(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-semibold text-slate-900">Chỉnh sửa thông tin Phụ huynh</h3>
              <button onClick={() => setEditingParent(null)} className="text-slate-400 hover:text-slate-700 p-1 rounded-md">
                <X className="w-4 h-4 stroke-[1.5]" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Họ và tên Phụ huynh</label>
                <input
                  type="text"
                  value={editingParent.name}
                  onChange={(e) => setEditingParent({ ...editingParent, name: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Số điện thoại (Nhận OTP)</label>
                <input
                  type="text"
                  value={editingParent.phone}
                  onChange={(e) => setEditingParent({ ...editingParent, phone: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Email liên hệ</label>
                <input
                  type="email"
                  value={editingParent.email}
                  onChange={(e) => setEditingParent({ ...editingParent, email: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Học sinh liên kết (Để trống nếu chưa liên kết)</label>
                <input
                  type="text"
                  value={editingParent.studentName === 'Chưa liên kết' ? '' : editingParent.studentName}
                  onChange={(e) => setEditingParent({ ...editingParent, studentName: e.target.value })}
                  placeholder="Ví dụ: Nguyễn Văn An (6A1)"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-400 transition-all"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setEditingParent(null)}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdateParent}
                className="px-3.5 py-1.5 text-xs bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors font-medium shadow-sm"
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL 4: Modal Xác nhận Xóa Phụ huynh */}
      {deletingParent && createPortal(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Xác nhận xóa phụ huynh</h3>
                <p className="text-xs text-slate-500 mt-0.5">Hành động này không thể hoàn tác.</p>
              </div>
            </div>

            <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
              Bạn có chắc chắn muốn xóa phụ huynh <strong className="text-slate-900">{deletingParent.name}</strong> ({deletingParent.code})?
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setDeletingParent(null)}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md transition-colors font-medium"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-3.5 py-1.5 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium shadow-sm"
              >
                Xóa phụ huynh
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};