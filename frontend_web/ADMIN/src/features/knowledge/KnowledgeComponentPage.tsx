import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
    Plus, Search, Eye, Edit3, Trash2, BrainCircuit, X,
    AlertTriangle, CheckCircle2
} from 'lucide-react';

// 1. Dữ liệu mẫu thực thể knowledge_components kết nối với unit
const initialKCs = [
    {
        id: 'kc-01',
        unitId: 'u1',
        unitName: 'Unit 1: My New School',
        code: 'KC_GRAM_01',
        name: 'Thì Hiện tại đơn với Động từ "To Be"',
        category: 'Grammar',
        description: 'Nắm vững cách chia động từ am/is/are ở dạng khẳng định, phủ định và nghi vấn.',
        aiTrained: true,
    },
    {
        id: 'kc-02',
        unitId: 'u1',
        unitName: 'Unit 1: My New School',
        code: 'KC_VOCAB_01',
        name: 'Từ vựng Đồ dùng học tập & Các môn học',
        category: 'Vocabulary',
        description: 'Vốn từ vựng về calculator, rubber, compass, Physics, IT,...',
        aiTrained: true,
    },
    {
        id: 'kc-03',
        unitId: 'u1',
        unitName: 'Unit 1: My New School',
        code: 'KC_LISTEN_01',
        name: 'Nhận biết âm đuôi /s/ và /z/ trong từ vựng',
        category: 'Listening',
        description: 'Kỹ năng nghe phân biệt âm đuôi của danh từ số nhiều và động từ ngôi thứ 3 số ít.',
        aiTrained: true,
    },
    {
        id: 'kc-04',
        unitId: 'u2',
        unitName: 'Unit 2: My House',
        code: 'KC_GRAM_02',
        name: 'Giới từ chỉ vị trí (in, on, at, under, behind, next to)',
        category: 'Grammar',
        description: 'Sử dụng đúng giới từ để miêu tả vị trí đồ vật trong các phòng.',
        aiTrained: false,
    },
    {
        id: 'kc-05',
        unitId: 'u2',
        unitName: 'Unit 2: My House',
        code: 'KC_WRITE_01',
        name: 'Viết đoạn văn ngắn (40-50 từ) mô tả ngôi nhà',
        category: 'Writing',
        description: 'Kết hợp từ vựng loại phòng, giới từ và thì Hiện tại đơn để hoàn thành đoạn văn.',
        aiTrained: false,
    },
];

export const KnowledgeComponentPage: React.FC = () => {
    const [kcList, setKcList] = useState(initialKCs);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('ALL');
    const [isTrainingAI, setIsTrainingAI] = useState(false);

    // State Modals
    const [selectedKC, setSelectedKC] = useState<typeof initialKCs[0] | null>(null);
    const [editingKC, setEditingKC] = useState<typeof initialKCs[0] | null>(null);
    const [deletingKC, setDeletingKC] = useState<typeof initialKCs[0] | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);

    // State Form Thêm mới KC
    const [newCode, setNewCode] = useState('');
    const [newName, setNewName] = useState('');
    const [newCategory, setNewCategory] = useState('Grammar');
    const [newUnitName, setNewUnitName] = useState('Unit 1: My New School');
    const [newDescription, setNewDescription] = useState('');

    // Toast
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    // Huấn luyện lại AI Engine
    const handleTrainAI = () => {
        setIsTrainingAI(true);
        setTimeout(() => {
            setKcList((prev) => prev.map((item) => ({ ...item, aiTrained: true })));
            setIsTrainingAI(false);
            showToast('Đã huấn luyện thành công AI Engine với dữ liệu Lệnh huấn luyện mới nhất!');
        }, 1500);
    };

    // Thêm mới Lệnh huấn luyện
    const handleCreateKC = () => {
        if (!newCode || !newName) return;

        const newObj = {
            id: `kc-${Date.now()}`,
            unitId: 'u1',
            unitName: newUnitName,
            code: newCode,
            name: newName,
            category: newCategory,
            description: newDescription || 'Chưa có mô tả chi tiết',
            aiTrained: false,
        };

        setKcList((prev) => [newObj, ...prev]);
        setShowAddModal(false);
        showToast(`Đã thêm lệnh huấn luyện "${newName}" thành công!`);
        setNewCode('');
        setNewName('');
        setNewDescription('');
    };

    // Cập nhật KC
    const handleUpdateKC = () => {
        if (!editingKC) return;
        setKcList((prev) => prev.map((k) => (k.id === editingKC.id ? editingKC : k)));
        showToast(`Đã cập nhật lệnh huấn luyện "${editingKC.name}"!`);
        setEditingKC(null);
    };

    // Xóa KC
    const handleConfirmDelete = () => {
        if (!deletingKC) return;
        setKcList((prev) => prev.filter((k) => k.id !== deletingKC.id));
        showToast(`Đã xóa lệnh huấn luyện "${deletingKC.name}"!`);
        setDeletingKC(null);
    };

    // Lọc dữ liệu
    const filteredKCs = useMemo(() => {
        return kcList.filter((k) => {
            const matchesCategory = categoryFilter === 'ALL' || k.category === categoryFilter;
            const q = search.toLowerCase().trim();
            const matchesSearch =
                q === '' ||
                k.name.toLowerCase().includes(q) ||
                k.code.toLowerCase().includes(q) ||
                k.unitName.toLowerCase().includes(q);

            return matchesCategory && matchesSearch;
        });
    }, [kcList, categoryFilter, search]);

    // Helper render Badge Category bằng Tiếng Anh
    const renderCategoryBadge = (cat: string) => {
        switch (cat) {
            case 'Grammar':
                return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">Grammar</span>;
            case 'Vocabulary':
                return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">Vocabulary</span>;
            case 'Listening':
                return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Listening</span>;
            case 'Speaking':
                return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">Speaking</span>;
            case 'Reading':
                return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">Reading</span>;
            case 'Writing':
                return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">Writing</span>;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6 w-full">

            {/* Page Title & Action */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
                        Lệnh Huấn luyện
                    </h1>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleTrainAI}
                        disabled={isTrainingAI}
                        className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-md hover:bg-purple-100 transition-colors shadow-sm whitespace-nowrap disabled:opacity-50"
                    >
                        <BrainCircuit className={`w-4 h-4 ${isTrainingAI ? 'animate-spin' : ''}`} />
                        <span>{isTrainingAI ? 'Đang huấn luyện AI...' : 'Huấn luyện AI Engine'}</span>
                    </button>

                    <button
                        onClick={() => setShowAddModal(true)}
                        className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors shadow-sm whitespace-nowrap"
                    >
                        <Plus className="w-4 h-4 stroke-[2]" />
                        <span>Thêm lệnh huấn luyện</span>
                    </button>
                </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                    <div className="text-xs font-medium text-slate-500">Tổng số Lệnh huấn luyện</div>
                    <div className="text-2xl font-semibold text-slate-900 mt-1">{kcList.length}</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                    <div className="text-xs font-medium text-slate-500">Grammar & Vocabulary</div>
                    <div className="text-2xl font-semibold text-blue-600 mt-1">
                        {kcList.filter((k) => k.category === 'Grammar' || k.category === 'Vocabulary').length}
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                    <div className="text-xs font-medium text-slate-500">Listening / Speaking / Reading / Writing</div>
                    <div className="text-2xl font-semibold text-emerald-600 mt-1">
                        {kcList.filter((k) => k.category !== 'Grammar' && k.category !== 'Vocabulary').length}
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                    <div className="text-xs font-medium text-slate-500">Đã cập nhật vào AI</div>
                    <div className="text-2xl font-semibold text-purple-700 mt-1">
                        {kcList.filter((k) => k.aiTrained).length} / {kcList.length}
                    </div>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white border border-slate-200/80 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">

                {/* Filter Bar */}
                <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">

                    <div className="relative w-full sm:w-80">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Tìm theo Mã KC, Tên lệnh huấn luyện, Unit..."
                            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-400"
                        />
                    </div>

                    <div className="w-full sm:w-auto">
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="w-full sm:w-auto text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md px-3 py-1.5 focus:outline-none focus:border-slate-400 shadow-sm cursor-pointer"
                        >
                            <option value="ALL">Tất cả</option>
                            <option value="Grammar">Grammar</option>
                            <option value="Vocabulary">Vocabulary</option>
                            <option value="Listening">Listening</option>
                            <option value="Speaking">Speaking</option>
                            <option value="Reading">Reading</option>
                            <option value="Writing">Writing</option>
                        </select>
                    </div>

                </div>

                {/* Table Data */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[750px]">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                                <th className="py-3 px-4 w-28">MÃ KC</th>
                                <th className="py-3 px-4 min-w-[200px]">LỆNH HUẤN LUYỆN</th>
                                <th className="py-3 px-4 w-40">PHÂN LOẠI</th>
                                <th className="py-3 px-4 min-w-[160px]">BÀI HỌC</th>
                                <th className="py-3 px-4 w-32 text-center">TRẠNG THÁI AI</th>
                                <th className="py-3 px-4 text-right pr-6 w-28">THAO TÁC</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                            {filteredKCs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-10 text-slate-400">
                                        Không tìm thấy lệnh huấn luyện phù hợp.
                                    </td>
                                </tr>
                            ) : (
                                filteredKCs.map((kc) => (
                                    <tr key={kc.id} className="hover:bg-slate-50/60 transition-colors">

                                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600 font-semibold whitespace-nowrap">
                                            {kc.code}
                                        </td>

                                        <td className="py-3.5 px-4">
                                            <div className="font-semibold text-slate-900">{kc.name}</div>
                                            <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{kc.description}</div>
                                        </td>

                                        <td className="py-3.5 px-4 whitespace-nowrap">
                                            {renderCategoryBadge(kc.category)}
                                        </td>

                                        <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap font-medium">
                                            {kc.unitName}
                                        </td>

                                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                            {kc.aiTrained ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                                                    <CheckCircle2 className="w-3 h-3 text-purple-600" /> Đã cập nhật
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                                    Chờ huấn luyện
                                                </span>
                                            )}
                                        </td>

                                        <td className="py-3.5 px-4 text-right pr-6 whitespace-nowrap">
                                            <div className="inline-flex items-center gap-1.5 justify-end">
                                                <button
                                                    onClick={() => setSelectedKC(kc)}
                                                    className="w-7 h-7 inline-flex items-center justify-center text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-100 hover:text-slate-900 transition-all shadow-sm"
                                                    title="Xem chi tiết"
                                                >
                                                    <Eye className="w-3.5 h-3.5 stroke-[1.5]" />
                                                </button>
                                                <button
                                                    onClick={() => setEditingKC(kc)}
                                                    className="w-7 h-7 inline-flex items-center justify-center text-slate-500 bg-white border border-slate-200 rounded hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm"
                                                    title="Chỉnh sửa"
                                                >
                                                    <Edit3 className="w-3.5 h-3.5 stroke-[1.5]" />
                                                </button>
                                                <button
                                                    onClick={() => setDeletingKC(kc)}
                                                    className="w-7 h-7 inline-flex items-center justify-center text-slate-500 bg-white border border-slate-200 rounded hover:bg-red-50 hover:text-red-600 transition-all shadow-sm"
                                                    title="Xóa"
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

            {/* MODAL 1: THÊM MỚI KC */}
            {showAddModal && createPortal(
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[9999] flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in fade-in duration-150">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-sm font-semibold text-slate-900">Thêm Lệnh huấn luyện mới</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700 p-1 rounded-md">
                                <X className="w-4 h-4 stroke-[1.5]" />
                            </button>
                        </div>

                        <div className="space-y-3 text-xs">
                            <div>
                                <label className="block text-slate-700 font-medium mb-1">Mã KC</label>
                                <input
                                    type="text"
                                    value={newCode}
                                    onChange={(e) => setNewCode(e.target.value)}
                                    placeholder="Ví dụ: KC_GRAM_03"
                                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md font-mono text-slate-900 focus:outline-none focus:bg-white focus:border-slate-400"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 font-medium mb-1">Lệnh huấn luyện</label>
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="Ví dụ: Thì Hiện tại tiếp diễn"
                                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-400"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 font-medium mb-1">Phân loại</label>
                                <select
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-400 cursor-pointer"
                                >
                                    <option value="Grammar">Grammar</option>
                                    <option value="Vocabulary">Vocabulary</option>
                                    <option value="Listening">Listening</option>
                                    <option value="Speaking">Speaking</option>
                                    <option value="Reading">Reading</option>
                                    <option value="Writing">Writing</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-slate-700 font-medium mb-1">Thuộc Bài học</label>
                                <input
                                    type="text"
                                    value={newUnitName}
                                    onChange={(e) => setNewUnitName(e.target.value)}
                                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-400"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 font-medium mb-1">Mô tả chi tiết</label>
                                <textarea
                                    rows={3}
                                    value={newDescription}
                                    onChange={(e) => setNewDescription(e.target.value)}
                                    placeholder="Mô tả nội dung kiến thức cốt lõi..."
                                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-400"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md font-medium"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={handleCreateKC}
                                className="px-3.5 py-1.5 text-xs bg-slate-900 text-white rounded-md hover:bg-slate-800 font-medium"
                            >
                                Lưu Lệnh huấn luyện
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* MODAL 2: XEM CHI TIẾT KC */}
            {selectedKC && createPortal(
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[9999] flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-sm w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in fade-in duration-150">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-sm font-semibold text-slate-900">Chi tiết Lệnh huấn luyện</h3>
                            <button onClick={() => setSelectedKC(null)} className="text-slate-400 hover:text-slate-700 p-1 rounded-md">
                                <X className="w-4 h-4 stroke-[1.5]" />
                            </button>
                        </div>

                        <div className="space-y-3 text-xs">
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <div className="font-semibold text-slate-900 text-sm">{selectedKC.name}</div>
                                <div className="text-slate-500 font-mono text-[11px] mt-0.5">{selectedKC.code}</div>
                            </div>

                            <div className="space-y-2 pt-1">
                                <div className="flex justify-between py-1 border-b border-slate-100">
                                    <span className="text-slate-500">Phân loại:</span>
                                    {renderCategoryBadge(selectedKC.category)}
                                </div>
                                <div className="flex justify-between py-1 border-b border-slate-100">
                                    <span className="text-slate-500">Thuộc Bài học:</span>
                                    <span className="font-semibold text-slate-900">{selectedKC.unitName}</span>
                                </div>
                                <div>
                                    <span className="text-slate-500 block mb-1">Mô tả chi tiết:</span>
                                    <div className="bg-slate-50 p-2.5 rounded border border-slate-100 text-slate-700">
                                        {selectedKC.description}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-2 border-t border-slate-100">
                            <button
                                onClick={() => setSelectedKC(null)}
                                className="px-3.5 py-1.5 text-xs bg-slate-900 text-white rounded-md hover:bg-slate-800 font-medium shadow-sm"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* MODAL CHỈNH SỬA KC */}
            {editingKC && createPortal(
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[9999] flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in fade-in duration-150">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-sm font-semibold text-slate-900">Chỉnh sửa Lệnh huấn luyện</h3>
                            <button onClick={() => setEditingKC(null)} className="text-slate-400 hover:text-slate-700 p-1 rounded-md">
                                <X className="w-4 h-4 stroke-[1.5]" />
                            </button>
                        </div>
                        <div className="space-y-3 text-xs">
                            <div>
                                <label className="block text-slate-700 font-medium mb-1">Tên Lệnh</label>
                                <input
                                    type="text"
                                    value={editingKC.name}
                                    onChange={(e) => setEditingKC({ ...editingKC, name: e.target.value })}
                                    className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-xs focus:outline-none focus:border-slate-400"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-700 font-medium mb-1">Mô tả</label>
                                <textarea
                                    value={editingKC.description}
                                    onChange={(e) => setEditingKC({ ...editingKC, description: e.target.value })}
                                    className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-xs h-20 focus:outline-none focus:border-slate-400"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                            <button
                                onClick={() => setEditingKC(null)}
                                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md font-medium"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleUpdateKC}
                                className="px-3.5 py-1.5 text-xs bg-slate-900 text-white rounded-md hover:bg-slate-800 font-medium"
                            >
                                Lưu thay đổi
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* MODAL 3: XÁC NHẬN XÓA KC */}
            {deletingKC && createPortal(
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[9999] flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-sm w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in fade-in duration-150">
                        <div className="flex items-center gap-3 text-red-600">
                            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                                <AlertTriangle className="w-5 h-5 stroke-[1.5]" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-slate-900">Xác nhận xóa Lệnh huấn luyện</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Hành động này không thể hoàn tác.</p>
                            </div>
                        </div>

                        <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                            Bạn có chắc chắn muốn xóa lệnh huấn luyện <strong className="text-slate-900">{deletingKC.name}</strong> ({deletingKC.code})?
                        </div>

                        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                            <button
                                onClick={() => setDeletingKC(null)}
                                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md font-medium"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="px-3.5 py-1.5 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
                            >
                                Xóa lệnh huấn luyện
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

        </div>
    );
};