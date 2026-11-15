import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Search, Filter, Eye, X, Terminal } from 'lucide-react';

// Dữ liệu mẫu chuẩn hóa theo Schema DB (Đã định dạng Thời gian: HH:mm:ss DD/MM/YYYY)
const mockAuditLogs = [
  {
    id: 'log-101',
    user_id: 'usr-001',
    user_name: 'Nguyễn Thanh Ngân',
    action: 'UPDATE_LESSON',
    entity: 'lessons',
    entity_id: 'les-u1-02',
    details: 'Cập nhật từ vựng và ngữ pháp Unit 1: My New School (Tiếng Anh 6)',
    ip_address: '192.168.1.15',
    status: 'SUCCESS',
    created_at: '14:30:22 05/11/2026',
  },
  {
    id: 'log-102',
    user_id: 'usr-002',
    user_name: 'Huỳnh Đặng Đại Hiếu',
    action: 'IMPORT_STUDENTS',
    entity: 'classrooms',
    entity_id: 'c1',
    details: 'Import thành công danh sách 45 học sinh vào Lớp 6A1 từ file danh_sach_6A1.xlsx',
    ip_address: '192.168.1.20',
    status: 'SUCCESS',
    created_at: '11:15:04 05/11/2026',
  },
  {
    id: 'log-103',
    user_id: 'usr-003',
    user_name: 'Nguyễn Thế Trường',
    action: 'CREATE_EXAM',
    entity: 'exams',
    entity_id: 'ex-2026-09',
    details: 'Tạo đề thi Ma trận 15 phút Unit 1 - Khởi tạo 10 câu hỏi ngẫu nhiên',
    ip_address: '113.161.45.88',
    status: 'SUCCESS',
    created_at: '16:45:12 04/11/2026',
  },
  {
    id: 'log-104',
    user_id: 'sys-ai',
    user_name: 'Hệ thống AI Security',
    action: 'LOGIN_FAILED',
    entity: 'users',
    entity_id: 'usr-unknown',
    details: 'Phát hiện 5 lần nhập sai mật khẩu liên tiếp từ địa chỉ IP bên ngoài',
    ip_address: '14.232.110.12',
    status: 'WARNING',
    created_at: '09:10:55 04/11/2026',
  },
  {
    id: 'log-105',
    user_id: 'usr-001',
    user_name: 'Nguyễn Thanh Ngân',
    action: 'DELETE_QUESTION',
    entity: 'questions',
    entity_id: 'Q009',
    details: 'Xóa câu hỏi mã Q009 thuộc Thẻ kiến thức Grammar.PastSimple',
    ip_address: '192.168.1.15',
    status: 'FAILED',
    created_at: '18:20:01 03/11/2026',
  },
];

export const AuditLogPage: React.FC = () => {
  const [logs] = useState<any[]>(mockAuditLogs);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedLog, setSelectedLog] = useState<any>(null);

  // Render Trạng thái Log bằng Text đơn thuần (Đã bỏ Icon)
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return <span className="text-emerald-600 font-semibold">Thành công</span>;
      case 'WARNING':
        return <span className="text-amber-600 font-semibold">Cảnh báo</span>;
      case 'FAILED':
        return <span className="text-red-600 font-semibold">Thất bại</span>;
      default:
        return <span className="text-slate-500 font-medium">{status}</span>;
    }
  };

  // Lọc dữ liệu nhật ký
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.user_name.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.ip_address.includes(search);

    const matchesStatus = statusFilter === 'ALL' ? true : log.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Nhật ký hoạt động hệ thống
          </h1>
        </div>
        <div className="text-xs text-slate-400 self-start sm:self-auto">
          Lưu trữ tự động 90 ngày gần nhất
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white border border-slate-200/80 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">

        {/* Filter Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 stroke-[1.5]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo người thực hiện, hành động, IP..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-400 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md px-3 py-1.5 focus:outline-none focus:border-slate-400 shadow-sm cursor-pointer"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="SUCCESS">Thành công</option>
              <option value="WARNING">Cảnh báo</option>
              <option value="FAILED">Thất bại</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                <th className="py-3 px-4 w-44">Thời gian</th>
                <th className="py-3 px-4 min-w-[160px]">Người thực hiện</th>
                <th className="py-3 px-4 w-36">Mã hành động</th>
                <th className="py-3 px-4 w-32">Đối tượng</th>
                <th className="py-3 px-4 min-w-[220px]">Chi tiết hoạt động</th>
                <th className="py-3 px-4 w-32">IP Address</th>
                <th className="py-3 px-4 w-28">Trạng thái</th>
                <th className="py-3 px-4 text-right pr-6 w-20">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredLogs.map((log: any) => (
                <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                    {log.created_at}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-semibold text-slate-900">{log.user_name}</div>
                    <div className="text-[10px] font-mono text-slate-400">{log.user_id}</div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-mono text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap font-mono text-slate-600">
                    {log.entity}
                  </td>
                  <td className="py-3.5 px-4 text-slate-800">
                    <div className="line-clamp-1">{log.details}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                    {log.ip_address}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {renderStatusBadge(log.status)}
                  </td>
                  <td className="py-3.5 px-4 text-right pr-6 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="w-7 h-7 inline-flex items-center justify-center text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-all shadow-sm"
                      title="Xem thông số Log"
                    >
                      <Eye className="w-3.5 h-3.5 stroke-[1.5]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL XEM CHI TIẾT DỮ LIỆU LOG */}
      {selectedLog && createPortal(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-slate-600" />
                <h3 className="text-sm font-semibold text-slate-900">Chi tiết Record Audit Log</h3>
              </div>
              <button onClick={() => setSelectedLog(null)} className="text-slate-400 hover:text-slate-700 p-1 rounded-md">
                <X className="w-4 h-4 stroke-[1.5]" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[11px]">Log ID:</span>
                  <code className="font-mono text-slate-800 font-semibold">{selectedLog.id}</code>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Thời gian:</span>
                  <span className="font-mono text-slate-800 font-medium">{selectedLog.created_at}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500 block mb-0.5">Người thực hiện:</span>
                  <div className="font-semibold text-slate-900">{selectedLog.user_name}</div>
                  <div className="font-mono text-[11px] text-slate-400">{selectedLog.user_id}</div>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">Địa chỉ IP:</span>
                  <div className="font-mono text-slate-800 font-medium">{selectedLog.ip_address}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500 block mb-0.5">Mã hành động:</span>
                  <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {selectedLog.action}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">Đối tượng:</span>
                  <span className="font-mono text-slate-700">{selectedLog.entity} ({selectedLog.entity_id})</span>
                </div>
              </div>

              <div>
                <span className="text-slate-500 block mb-1">Mô tả thông số chi tiết:</span>
                <div className="p-3 bg-slate-900 text-slate-100 font-mono text-[11px] rounded-lg leading-relaxed whitespace-pre-wrap">
                  {selectedLog.details}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-1.5 text-xs bg-slate-900 text-white font-medium rounded-md hover:bg-slate-800 transition-colors shadow-sm"
              >
                Đóng cửa sổ
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};