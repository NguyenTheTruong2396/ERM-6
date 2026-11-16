import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Shield, Key, Eye, Edit3, Trash2, X, AlertTriangle, CheckCircle2 } from 'lucide-react';

// 1. Dữ liệu mẫu tĩnh cho Quản trị viên
const initialAdmins = [
  {
    id: 'adm-1',
    code: 'ADM001',
    name: 'Nguyễn Thanh Ngân',
    email: 'nganok321@gmail.com',
    roleLevel: 'Super Administrator',
    status: 'ACTIVE',
    createdAt: '2026-05-10',
  },
  {
    id: 'adm-2',
    code: 'ADM002',
    name: 'Huỳnh Đặng Đại Hiếu',
    email: 'hieu.hdd@hutech.edu.vn',
    roleLevel: 'Super Administrator',
    status: 'ACTIVE',
    createdAt: '2026-05-12',
  },
  {
    id: 'adm-3',
    code: 'ADM003',
    name: 'Nguyễn Thế Trường',
    email: 'truong.nt@hutech.edu.vn',
    roleLevel: 'System Administrator',
    status: 'ACTIVE',
    createdAt: '2026-06-01',
  },
];

export const AdminListPage: React.FC = () => {
  const [admins, setAdmins] = useState(initialAdmins);
  const [selectedAdmin, setSelectedAdmin] = useState<typeof initialAdmins[0] | null>(null);
  const [editingAdmin, setEditingAdmin] = useState<typeof initialAdmins[0] | null>(null);
  const [changePassAdmin, setChangePassAdmin] = useState<typeof initialAdmins[0] | null>(null);
  const [deletingAdmin, setDeletingAdmin] = useState<typeof initialAdmins[0] | null>(null);

  // State Modal Thêm mới
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRoleLevel, setNewRoleLevel] = useState('System Administrator');

  // State Đổi mật khẩu
  const [newPasswordUpdate, setNewPasswordUpdate] = useState('');

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

  // Hàm thêm Admin mới
  const handleCreateAdmin = () => {
    if (!newName || !newEmail || !newPassword) return;

    const newAdminObj = {
      id: `adm-${Date.now()}`,
      code: `ADM00${admins.length + 1}`,
      name: newName,
      email: newEmail,
      roleLevel: newRoleLevel,
      status: 'ACTIVE',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setAdmins((prev) => [newAdminObj, ...prev]);
    setShowAddModal(false);
    setNewName('');
    setNewEmail('');
    setNewPassword('');
    setNewRoleLevel('System Administrator');
    showToast(`Đã thêm quản trị viên "${newName}" thành công!`);
  };

  // Hàm cập nhật chỉnh sửa thông tin
  const handleUpdateAdmin = () => {
    if (!editingAdmin) return;
    setAdmins((prev) =>
      prev.map((item) => (item.id === editingAdmin.id ? editingAdmin : item))
    );
    showToast(`Đã cập nhật thông tin tài khoản "${editingAdmin.name}" thành công!`);
    setEditingAdmin(null);
  };

  // Hàm đổi mật khẩu
  const handleChangePassword = () => {
    if (!newPasswordUpdate || !changePassAdmin) return;
    showToast(`Đã đổi mật khẩu cho tài khoản "${changePassAdmin.name}" thành công!`);
    setChangePassAdmin(null);
    setNewPasswordUpdate('');
  };

  // Hàm xác nhận xóa Admin
  const ConfirmDeleteAdmin = () => {
    if (!deletingAdmin) return;
    setAdmins((prev) => prev.filter((a) => a.id !== deletingAdmin.id));
    showToast(`Đã xóa tài khoản Quản trị viên "${deletingAdmin.name}" thành công!`);
    setDeletingAdmin(null);
  };

  return (
    <div className="space-y-6">
      {/* Header & Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Quản trị viên</h1>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors shadow-sm whitespace-nowrap"
        >
          <Plus className="w-4 h-4 stroke-[2]" />
          <span>Thêm quản trị viên</span>
        </button>
      </div>

      {/* Main Table Container */}
      <div className="bg-white border border-slate-200/80 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-slate-900 stroke-[1.5]" />
            <span className="font-medium text-slate-900 whitespace-nowrap">
              Danh sách tài khoản quản trị hệ thống ({admins.length})
            </span>
          </div>
        </div>

        {/* Bảng cuộn mượt responsive với độ rộng tối thiểu 800px */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                <th className="py-3 px-4 w-24">Mã ID</th>
                <th className="py-3 px-4 min-w-[180px]">Tài khoản (Họ tên)</th>
                <th className="py-3 px-4 min-w-[200px]">Email</th>
                <th className="py-3 px-4 min-w-[170px]">Cấp độ quyền</th>
                <th className="py-3 px-4 w-32">Trạng thái</th>
                <th className="py-3 px-4 text-right pr-6 w-36">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 font-medium whitespace-nowrap">
                    {admin.code}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                    {admin.name}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600 whitespace-nowrap">
                    {admin.email}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border whitespace-nowrap ${admin.roleLevel === 'Super Administrator'
                        ? 'bg-purple-50 text-purple-700 border-purple-200/60'
                        : 'bg-blue-50 text-blue-700 border-blue-200/60'
                        }`}
                    >
                      {admin.roleLevel}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 text-slate-600 font-medium whitespace-nowrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0"></span>
                      Hoạt động
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right pr-6 whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5 justify-end">
                      <button
                        onClick={() => setSelectedAdmin(admin)}
                        className="w-7 h-7 inline-flex items-center justify-center text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors shadow-sm"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-3.5 h-3.5 stroke-[1.5]" />
                      </button>

                      <button
                        onClick={() => setEditingAdmin(admin)}
                        className="w-7 h-7 inline-flex items-center justify-center text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors shadow-sm"
                        title="Chỉnh sửa thông tin"
                      >
                        <Edit3 className="w-3.5 h-3.5 stroke-[1.5]" />
                      </button>

                      <button
                        onClick={() => setChangePassAdmin(admin)}
                        className="w-7 h-7 inline-flex items-center justify-center text-slate-500 hover:text-amber-600 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors shadow-sm"
                        title="Cấp lại mật khẩu"
                      >
                        <Key className="w-3.5 h-3.5 stroke-[1.5]" />
                      </button>

                      <button
                        onClick={() => setDeletingAdmin(admin)}
                        className="w-7 h-7 inline-flex items-center justify-center text-slate-500 hover:text-red-600 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors shadow-sm"
                        title="Xóa tài khoản"
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

      {/* MODAL 1: Thêm Quản trị viên mới */}
      {showAddModal && createPortal(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-semibold text-slate-900">Thêm Quản trị viên mới</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700 p-1 rounded-md">
                <X className="w-4 h-4 stroke-[1.5]" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Họ và tên Quản trị viên</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn A"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Địa chỉ Email (Tài khoản đăng nhập)</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="admin@eng6.edu.vn"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Mật khẩu khởi tạo</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Cấp độ phân quyền</label>
                <select
                  value={newRoleLevel}
                  onChange={(e) => setNewRoleLevel(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-md text-slate-700 focus:outline-none focus:border-slate-400 shadow-sm"
                >
                  <option value="System Administrator">System Administrator (Quản trị hệ thống)</option>
                  <option value="Super Administrator">Super Administrator (Toàn quyền)</option>
                </select>
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
                onClick={handleCreateAdmin}
                className="px-3.5 py-1.5 text-xs bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors font-medium shadow-sm"
              >
                Lưu tài khoản
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL 2: Chỉnh sửa Quản trị viên */}
      {editingAdmin && createPortal(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-semibold text-slate-900">Chỉnh sửa thông tin Quản trị viên</h3>
              <button onClick={() => setEditingAdmin(null)} className="text-slate-400 hover:text-slate-700 p-1 rounded-md">
                <X className="w-4 h-4 stroke-[1.5]" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Họ và tên Quản trị viên</label>
                <input
                  type="text"
                  value={editingAdmin.name}
                  onChange={(e) => setEditingAdmin({ ...editingAdmin, name: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Địa chỉ Email</label>
                <input
                  type="email"
                  value={editingAdmin.email}
                  onChange={(e) => setEditingAdmin({ ...editingAdmin, email: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Cấp độ phân quyền</label>
                <select
                  value={editingAdmin.roleLevel}
                  onChange={(e) => setEditingAdmin({ ...editingAdmin, roleLevel: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-md text-slate-700 focus:outline-none focus:border-slate-400 shadow-sm"
                >
                  <option value="System Administrator">System Administrator (Quản trị hệ thống)</option>
                  <option value="Super Administrator">Super Administrator (Toàn quyền)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setEditingAdmin(null)}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdateAdmin}
                className="px-3.5 py-1.5 text-xs bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors font-medium shadow-sm"
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL 3: Đổi/Cấp lại mật khẩu */}
      {changePassAdmin && createPortal(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-semibold text-slate-900">Đổi mật khẩu tài khoản</h3>
              <button onClick={() => setChangePassAdmin(null)} className="text-slate-400 hover:text-slate-700 p-1 rounded-md">
                <X className="w-4 h-4 stroke-[1.5]" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-500">
                Đổi mật khẩu mới cho Quản trị viên <strong className="text-slate-900">{changePassAdmin.name}</strong> ({changePassAdmin.email})
              </p>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Mật khẩu mới</label>
                <input
                  type="password"
                  value={newPasswordUpdate}
                  onChange={(e) => setNewPasswordUpdate(e.target.value)}
                  placeholder="Nhập mật khẩu mới..."
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-400 transition-all"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setChangePassAdmin(null)}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleChangePassword}
                className="px-3.5 py-1.5 text-xs bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors font-medium shadow-sm"
              >
                Lưu mật khẩu
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL 4: Xem chi tiết Quản trị viên */}
      {selectedAdmin && createPortal(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-semibold text-slate-900">Chi tiết Quản trị viên</h3>
              <button onClick={() => setSelectedAdmin(null)} className="text-slate-400 hover:text-slate-700 p-1 rounded-md">
                <X className="w-4 h-4 stroke-[1.5]" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Mã Admin:</span>
                <span className="font-mono font-medium text-slate-900">{selectedAdmin.code}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Họ tên:</span>
                <span className="font-semibold text-slate-900">{selectedAdmin.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Email:</span>
                <span className="font-mono text-slate-700">{selectedAdmin.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Cấp độ quyền:</span>
                <span className={`font-semibold ${selectedAdmin.roleLevel === 'Super Administrator' ? 'text-purple-700' : 'text-blue-700'}`}>
                  {selectedAdmin.roleLevel}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Ngày khởi tạo:</span>
                <span className="font-mono text-slate-600">{selectedAdmin.createdAt}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedAdmin(null)}
                className="px-3.5 py-1.5 text-xs bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors font-medium shadow-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL 5: Modal Xác nhận xóa Admin (Thay thế alert/confirm mặc định) */}
      {deletingAdmin && createPortal(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Xác nhận xóa tài khoản</h3>
                <p className="text-xs text-slate-500 mt-0.5">Hành động này không thể hoàn tác.</p>
              </div>
            </div>

            <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
              Bạn có chắc chắn muốn xóa tài khoản Admin <strong className="text-slate-900">{deletingAdmin.name}</strong> ({deletingAdmin.email})?
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setDeletingAdmin(null)}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md transition-colors font-medium"
              >
                Hủy bỏ
              </button>
              <button
                onClick={ConfirmDeleteAdmin}
                className="px-3.5 py-1.5 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium shadow-sm"
              >
                Xóa tài khoản
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};