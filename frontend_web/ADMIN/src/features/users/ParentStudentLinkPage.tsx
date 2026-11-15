import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
    Plus, Search, Link2, Unlink, CheckCircle2, XCircle, Clock,
    X, Trash2, Check, UserCheck
} from 'lucide-react';

// Dữ liệu mẫu Phụ huynh & Học sinh
const mockParents = [
    { id: 'p1', name: 'Nguyễn Văn An', phone: '0901234567', email: 'an.nguyen@gmail.com' },
    { id: 'p2', name: 'Trần Thị Mai', phone: '0912345678', email: 'mai.tran@gmail.com' },
    { id: 'p3', name: 'Lê Hoàng Nam', phone: '0987654321', email: 'nam.le@gmail.com' },
    { id: 'p4', name: 'Phạm Văn Hùng', phone: '0933445566', email: 'hung.pv@gmail.com' },
];

const mockStudents = [
    { id: 's1', name: 'Nguyễn Văn Bình', class: '6A1', code: 'HS6001', email: 'binh.nv6001@student.edu.vn' },
    { id: 's2', name: 'Trần Thị Ngọc', class: '6A2', code: 'HS6002', email: 'ngoc.tt6002@student.edu.vn' },
    { id: 's3', name: 'Lê Hoàng Anh', class: '6A1', code: 'HS6003', email: 'anh.lh6003@student.edu.vn' },
    { id: 's4', name: 'Phạm Minh Quân', class: '6A3', code: 'HS6004', email: 'quan.pm6004@student.edu.vn' },
    { id: 's5', name: 'Hoàng Quốc Việt', class: '6A2', code: 'HS6005', email: 'viet.hq6005@student.edu.vn' },
];

const initialLinks = [
    {
        id: 'link-1',
        parentId: 'p1',
        parentName: 'Nguyễn Văn An',
        parentPhone: '0901234567',
        parentEmail: 'an.nguyen@gmail.com',
        studentId: 's1',
        studentName: 'Nguyễn Văn Bình',
        studentClass: '6A1',
        studentCode: 'HS6001',
        studentEmail: 'binh.nv6001@student.edu.vn',
        status: 'APPROVED',
        createdAt: '2026-10-15',
    },
    {
        id: 'link-2',
        parentId: 'p2',
        parentName: 'Trần Thị Mai',
        parentPhone: '0912345678',
        parentEmail: 'mai.tran@gmail.com',
        studentId: 's2',
        studentName: 'Trần Thị Ngọc',
        studentClass: '6A2',
        studentCode: 'HS6002',
        studentEmail: 'ngoc.tt6002@student.edu.vn',
        status: 'PENDING',
        createdAt: '2026-11-02',
    },
];

export const ParentStudentLinkPage: React.FC = () => {
    const [links, setLinks] = useState<any[]>(initialLinks);
    const [search, setSearch] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');

    // Modals & States
    const [showAddModal, setShowAddModal] = useState<boolean>(false);
    const [deletingLink, setDeletingLink] = useState<any | null>(null);

    // States chọn Phụ huynh & Học sinh dạng Ô nhập tìm kiếm (Combobox)
    const [selectedParent, setSelectedParent] = useState<any | null>(null);
    const [parentSearchQuery, setParentSearchQuery] = useState<string>('');
    const [showParentDropdown, setShowParentDropdown] = useState<boolean>(false);

    const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
    const [studentSearchQuery, setStudentSearchQuery] = useState<string>('');
    const [showStudentDropdown, setShowStudentDropdown] = useState<boolean>(false);

    // Toast
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    // Mở Modal tạo ghép nối mới
    const handleOpenAddModal = () => {
        setSelectedParent(null);
        setParentSearchQuery('');
        setSelectedStudent(null);
        setStudentSearchQuery('');
        setShowAddModal(true);
    };

    // Phê duyệt / Từ chối nhanh
    const handleUpdateStatus = (linkId: string, newStatus: 'APPROVED' | 'REJECTED') => {
        setLinks((prev) =>
            prev.map((l) => (l.id === linkId ? { ...l, status: newStatus } : l))
        );
        showToast(
            newStatus === 'APPROVED'
                ? 'Đã phê duyệt liên kết Phụ huynh - Học sinh!'
                : 'Đã từ chối yêu cầu liên kết!'
        );
    };

    // Tạo liên kết mới
    const handleCreateLink = () => {
        if (!selectedParent || !selectedStudent) {
            showToast('Vui lòng chọn đầy đủ Phụ huynh và Học sinh!');
            return;
        }

        const exists = links.some(
            (l) => l.parentId === selectedParent.id && l.studentId === selectedStudent.id
        );
        if (exists) {
            showToast('Liên kết giữa Phụ huynh và Học sinh này đã tồn tại!');
            return;
        }

        const newLink = {
            id: `link-${Date.now()}`,
            parentId: selectedParent.id,
            parentName: selectedParent.name,
            parentPhone: selectedParent.phone,
            parentEmail: selectedParent.email,
            studentId: selectedStudent.id,
            studentName: selectedStudent.name,
            studentClass: selectedStudent.class,
            studentCode: selectedStudent.code,
            studentEmail: selectedStudent.email,
            status: 'APPROVED',
            createdAt: new Date().toISOString().split('T')[0],
        };

        setLinks((prev) => [newLink, ...prev]);
        setShowAddModal(false);
        showToast(`Đã liên kết "${selectedParent.name}" với học sinh "${selectedStudent.name}"!`);
    };

    // Xóa liên kết
    const handleConfirmDelete = () => {
        if (!deletingLink) return;
        setLinks((prev) => prev.filter((l) => l.id !== deletingLink.id));
        showToast('Đã xóa liên kết ghép nối thành công!');
        setDeletingLink(null);
    };

    // Lọc danh sách ghép nối chính
    const filteredLinks = links.filter((l) => {
        const query = search.toLowerCase().trim();
        const matchesSearch =
            l.parentName.toLowerCase().includes(query) ||
            l.parentPhone.includes(query) ||
            (l.parentEmail && l.parentEmail.toLowerCase().includes(query)) ||
            l.studentName.toLowerCase().includes(query) ||
            (l.studentEmail && l.studentEmail.toLowerCase().includes(query)) ||
            l.studentCode.toLowerCase().includes(query);

        const matchesStatus = statusFilter === 'ALL' ? true : l.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Lọc Phụ huynh trong Modal khi người dùng gõ từ khóa
    const filteredParentsInModal = mockParents.filter((p) => {
        const q = parentSearchQuery.toLowerCase();
        return (
            p.name.toLowerCase().includes(q) ||
            p.phone.includes(q) ||
            p.email.toLowerCase().includes(q)
        );
    });

    // Lọc Học sinh trong Modal khi người dùng gõ từ khóa
    const filteredStudentsInModal = mockStudents.filter((s) => {
        const q = studentSearchQuery.toLowerCase();
        return (
            s.name.toLowerCase().includes(q) ||
            s.code.toLowerCase().includes(q) ||
            s.email.toLowerCase().includes(q)
        );
    });

    const countApproved = links.filter((l) => l.status === 'APPROVED').length;
    const countPending = links.filter((l) => l.status === 'PENDING').length;

    return (
        <div className="space-y-6 w-full">

            {/* Header Trang */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
                        Quản lý Ghép nối Phụ huynh - Học sinh
                    </h1>
                </div>
                <button
                    onClick={handleOpenAddModal}
                    className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors shadow-sm whitespace-nowrap"
                >
                    <Plus className="w-4 h-4 stroke-[2]" />
                    <span>Tạo liên kết mới</span>
                </button>
            </div>

            {/* Thẻ Thống kê Nhanh */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center justify-between">
                    <div>
                        <span className="text-xs font-medium text-slate-500">Tổng liên kết</span>
                        <div className="text-2xl font-bold text-slate-900 mt-1">{links.length}</div>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Link2 className="w-5 h-5 stroke-[1.5]" />
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center justify-between">
                    <div>
                        <span className="text-xs font-medium text-slate-500">Đã phê duyệt</span>
                        <div className="text-2xl font-bold text-emerald-600 mt-1">{countApproved}</div>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <UserCheck className="w-5 h-5 stroke-[1.5]" />
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center justify-between">
                    <div>
                        <span className="text-xs font-medium text-slate-500">Yêu cầu chờ duyệt</span>
                        <div className="text-2xl font-bold text-amber-600 mt-1">{countPending}</div>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                        <Clock className="w-5 h-5 stroke-[1.5]" />
                    </div>
                </div>
            </div>

            {/* Bảng Danh sách Ghép nối */}
            <div className="bg-white border border-slate-200/80 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">

                <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="relative w-full sm:w-96">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 stroke-[1.5]" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Tìm theo Tên/Email/SĐT Phụ huynh hoặc Tên/Email/Mã HS..."
                            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-400"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md px-3 py-1.5 focus:outline-none shadow-sm cursor-pointer"
                        >
                            <option value="ALL">Tất cả trạng thái</option>
                            <option value="APPROVED">Đã duyệt (Approved)</option>
                            <option value="PENDING">Chờ duyệt (Pending)</option>
                            <option value="REJECTED">Đã từ chối (Rejected)</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[850px]">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                                <th className="py-3 px-4 min-w-[240px]">Phụ huynh (Parent)</th>
                                <th className="py-3 px-4 w-12 text-center"></th>
                                <th className="py-3 px-4 min-w-[260px]">Học sinh (Student)</th>
                                <th className="py-3 px-4 w-28">Ngày tạo</th>
                                <th className="py-3 px-4 w-32">Trạng thái</th>
                                <th className="py-3 px-4 text-right pr-6 w-32">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                            {filteredLinks.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-10 text-slate-400">
                                        Không tìm thấy dữ liệu ghép nối phù hợp.
                                    </td>
                                </tr>
                            ) : (
                                filteredLinks.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="py-3.5 px-4 font-medium text-slate-900">
                                            <div className="font-semibold text-slate-900">{item.parentName}</div>
                                            <div className="text-[11px] text-slate-400 font-normal">
                                                SĐT: {item.parentPhone} • Email: <span className="text-slate-600 font-mono">{item.parentEmail}</span>
                                            </div>
                                        </td>

                                        <td className="py-3.5 px-4 text-center">
                                            <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                                                <Link2 className="w-3.5 h-3.5" />
                                            </div>
                                        </td>

                                        <td className="py-3.5 px-4 font-medium text-slate-900">
                                            <div className="font-semibold text-slate-900 flex items-center gap-2">
                                                <span>{item.studentName}</span>
                                                <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded font-normal">
                                                    {item.studentCode}
                                                </span>
                                            </div>
                                            <div className="text-[11px] text-slate-400 font-normal mt-0.5">
                                                Email: <span className="text-blue-600 font-mono">{item.studentEmail}</span> • Lớp: <span className="font-semibold text-slate-700">{item.studentClass}</span>
                                            </div>
                                        </td>

                                        <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                                            {item.createdAt}
                                        </td>

                                        <td className="py-3.5 px-4 whitespace-nowrap">
                                            {item.status === 'APPROVED' && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                    <CheckCircle2 className="w-3 h-3" /> Đã phê duyệt
                                                </span>
                                            )}
                                            {item.status === 'PENDING' && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                                    <Clock className="w-3 h-3" /> Chờ xác nhận
                                                </span>
                                            )}
                                            {item.status === 'REJECTED' && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                                                    <XCircle className="w-3 h-3" /> Từ chối
                                                </span>
                                            )}
                                        </td>

                                        <td className="py-3.5 px-4 text-right pr-6 whitespace-nowrap">
                                            <div className="inline-flex items-center gap-1.5 justify-end">
                                                {item.status === 'PENDING' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleUpdateStatus(item.id, 'APPROVED')}
                                                            className="w-7 h-7 inline-flex items-center justify-center text-emerald-600 bg-emerald-50 border border-emerald-200 rounded hover:bg-emerald-100 transition-all"
                                                            title="Duyệt ghép nối"
                                                        >
                                                            <Check className="w-3.5 h-3.5 stroke-[2]" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateStatus(item.id, 'REJECTED')}
                                                            className="w-7 h-7 inline-flex items-center justify-center text-amber-600 bg-amber-50 border border-amber-200 rounded hover:bg-amber-100 transition-all"
                                                            title="Từ chối"
                                                        >
                                                            <X className="w-3.5 h-3.5 stroke-[2]" />
                                                        </button>
                                                    </>
                                                )}

                                                <button
                                                    onClick={() => setDeletingLink(item)}
                                                    className="w-7 h-7 inline-flex items-center justify-center text-slate-500 hover:text-red-600 bg-white border border-slate-200 rounded hover:bg-red-50 transition-all shadow-sm"
                                                    title="Hủy / Xóa ghép nối"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5 stroke-[1.5]" />
                                                </button>
                                            </div>
                                        </td>

                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* TOAST NOTIFICATION */}
            {toastMessage && createPortal(
                <div className="fixed bottom-5 right-5 z-[10000] flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white rounded-lg shadow-xl text-xs font-medium animate-in fade-in slide-in-from-bottom-3 duration-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 stroke-[2]" />
                    <span>{toastMessage}</span>
                </div>,
                document.body
            )}

            {/* MODAL TẠO LIÊN KẾT MỚI VỚI Ô NHẬP TÌM KIẾM CỰC NHANH */}
            {showAddModal && createPortal(
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[9999] flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in fade-in duration-150 overflow-visible">

                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-sm font-semibold text-slate-900">Tạo Ghép Nối Phụ Huynh - Học Sinh</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700 p-1 rounded-md">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-4 text-xs">

                            {/* 1. Ô NHẬP TÌM KIẾM PHỤ HUYNH */}
                            <div className="relative">
                                <label className="block text-slate-700 font-medium mb-1">Tìm & Chọn Phụ huynh *</label>
                                <div className="relative">
                                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        placeholder="Gõ tên, SĐT hoặc Email phụ huynh..."
                                        value={selectedParent ? `${selectedParent.name} (${selectedParent.phone})` : parentSearchQuery}
                                        onChange={(e) => {
                                            setSelectedParent(null);
                                            setParentSearchQuery(e.target.value);
                                            setShowParentDropdown(true);
                                        }}
                                        onFocus={() => setShowParentDropdown(true)}
                                        className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-400 font-medium"
                                    />
                                    {selectedParent && (
                                        <button
                                            onClick={() => {
                                                setSelectedParent(null);
                                                setParentSearchQuery('');
                                            }}
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>

                                {/* Dropdown danh sách lọc Phụ huynh */}
                                {showParentDropdown && !selectedParent && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-48 overflow-y-auto z-[10001] divide-y divide-slate-100">
                                        {filteredParentsInModal.length === 0 ? (
                                            <div className="p-3 text-center text-slate-400">Không tìm thấy phụ huynh nào</div>
                                        ) : (
                                            filteredParentsInModal.map((p) => (
                                                <div
                                                    key={p.id}
                                                    onClick={() => {
                                                        setSelectedParent(p);
                                                        setShowParentDropdown(false);
                                                    }}
                                                    className="p-2.5 hover:bg-slate-50 cursor-pointer transition-colors"
                                                >
                                                    <div className="font-semibold text-slate-900">{p.name}</div>
                                                    <div className="text-[11px] text-slate-500">
                                                        SĐT: {p.phone} • Email: {p.email}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Icon liên kết */}
                            <div className="flex justify-center">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border">
                                    <Link2 className="w-4 h-4" />
                                </div>
                            </div>

                            {/* 2. Ô NHẬP TÌM KIẾM HỌC SINH */}
                            <div className="relative">
                                <label className="block text-slate-700 font-medium mb-1">Tìm & Chọn Học sinh *</label>
                                <div className="relative">
                                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        placeholder="Gõ tên, Email hoặc Mã học sinh..."
                                        value={selectedStudent ? `${selectedStudent.name} - ${selectedStudent.code} (${selectedStudent.email})` : studentSearchQuery}
                                        onChange={(e) => {
                                            setSelectedStudent(null);
                                            setStudentSearchQuery(e.target.value);
                                            setShowStudentDropdown(true);
                                        }}
                                        onFocus={() => setShowStudentDropdown(true)}
                                        className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-400 font-medium"
                                    />
                                    {selectedStudent && (
                                        <button
                                            onClick={() => {
                                                setSelectedStudent(null);
                                                setStudentSearchQuery('');
                                            }}
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>

                                {/* Dropdown danh sách lọc Học sinh */}
                                {showStudentDropdown && !selectedStudent && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-48 overflow-y-auto z-[10001] divide-y divide-slate-100">
                                        {filteredStudentsInModal.length === 0 ? (
                                            <div className="p-3 text-center text-slate-400">Không tìm thấy học sinh nào</div>
                                        ) : (
                                            filteredStudentsInModal.map((s) => (
                                                <div
                                                    key={s.id}
                                                    onClick={() => {
                                                        setSelectedStudent(s);
                                                        setShowStudentDropdown(false);
                                                    }}
                                                    className="p-2.5 hover:bg-slate-50 cursor-pointer transition-colors"
                                                >
                                                    <div className="font-semibold text-slate-900 flex items-center gap-2">
                                                        <span>{s.name}</span>
                                                        <span className="font-mono text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded">
                                                            {s.code}
                                                        </span>
                                                    </div>
                                                    <div className="text-[11px] text-slate-500">
                                                        Email: {s.email} • Lớp: {s.class}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>

                        </div>

                        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => setShowAddModal(false)}
                                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md font-medium"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                type="button"
                                onClick={handleCreateLink}
                                className="px-4 py-1.5 text-xs bg-slate-900 text-white rounded-md hover:bg-slate-800 font-semibold"
                            >
                                Xác nhận ghép nối
                            </button>
                        </div>

                    </div>
                </div>,
                document.body
            )}

            {/* MODAL XÁC NHẬN HỦY LIÊN KẾT */}
            {deletingLink && createPortal(
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[9999] flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-sm w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in fade-in duration-150">
                        <div className="flex items-center gap-3 text-red-600">
                            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                                <Unlink className="w-5 h-5 stroke-[1.5]" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-slate-900">Xác nhận hủy liên kết</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Phụ huynh sẽ không thể xem tiến trình của học sinh này nữa.</p>
                            </div>
                        </div>

                        <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1">
                            <div>Phụ huynh: <strong className="text-slate-900">{deletingLink.parentName}</strong> ({deletingLink.parentPhone})</div>
                            <div>Học sinh: <strong className="text-slate-900">{deletingLink.studentName}</strong> ({deletingLink.studentEmail})</div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                            <button
                                onClick={() => setDeletingLink(null)}
                                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md font-medium"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="px-3.5 py-1.5 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
                            >
                                Xóa ghép nối
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

        </div>
    );
};