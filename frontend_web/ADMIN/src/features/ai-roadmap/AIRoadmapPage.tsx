import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
    Search, CheckCircle2, RotateCw, Eye, X, Filter, UserCheck, RefreshCw
} from 'lucide-react';

// 1. Dữ liệu Học sinh giả lập
const mockStudents = [
    { id: 's1', name: 'Nguyễn Văn Bình', code: 'HS6001', class: '6A1', teacher: 'ThS. Nguyễn Mạnh Hùng', parent: 'Nguyễn Văn Hùng', email: 'binh.nv6001@student.edu.vn' },
    { id: 's2', name: 'Trần Thị Ngọc', code: 'HS6002', class: '6A2', teacher: 'Cô Trần Thị Hương', parent: 'Phan Thị Mai', email: 'ngoc.tt6002@student.edu.vn' },
    { id: 's3', name: 'Lê Hoàng Anh', code: 'HS6003', class: '6A1', teacher: 'ThS. Nguyễn Mạnh Hùng', parent: 'Lê Hoàng Nam', email: 'anh.lh6003@student.edu.vn' },
    { id: 's4', name: 'Vũ Bảo Lâm', code: 'HS6004', class: '6A3', teacher: 'Thầy Lê Văn Nam', parent: 'Vũ Thị Ngọc', email: 'lam.vb6004@student.edu.vn' },
];

// 2. Lộ trình AI mẫu đầy đủ 6 kỹ năng (Giá trị skill dùng chuẩn Tiếng Anh)
const initialRoadmaps: Record<string, any> = {
    s1: {
        overallProgress: 45,
        foundationalGaps: 4,
        advancedGaps: 2,
        estimatedTime: '65 phút',
        roadmapTree: [
            {
                step: 1,
                id: 'kc-01',
                title: 'Từ vựng: Đồ dùng học tập & Các môn học',
                skill: 'Vocabulary',
                level: 'FOUNDATION',
                unit: 'Unit 1: My New School',
                priorityOrder: 1,
                status: 'COMPLETED',
                aiAnalysis: 'Nền tảng từ vựng gốc. Bắt buộc học thuộc trước khi luyện kỹ năng Nghe và Đọc hiểu.',
                estimatedMinutes: 8,
            },
            {
                step: 2,
                id: 'kc-02',
                title: 'Ngữ pháp: Thì Hiện tại đơn với Động từ "To Be" & Động từ thường',
                skill: 'Grammar',
                level: 'FOUNDATION',
                unit: 'Unit 1: My New School',
                priorityOrder: 2,
                status: 'IN_PROGRESS',
                aiAnalysis: 'Cấu trúc câu gốc. Cần nắm vững quy tắc chia động từ s/es trước khi đặt câu Viết và Phản xạ Nói.',
                estimatedMinutes: 12,
            },
            {
                step: 3,
                id: 'kc-03',
                title: 'Nghe: Nhận biết âm /s/ và /z/ trong thông tin bài nói ngắn',
                skill: 'Listening',
                level: 'FOUNDATION',
                unit: 'Unit 1: My New School',
                priorityOrder: 3,
                status: 'RECOMMENDED',
                aiAnalysis: 'Luyện nghe phản xạ từ vựng trường học. Học sinh thường phát âm thiếu âm đuôi dẫn đến nghe sai.',
                estimatedMinutes: 10,
            },
            {
                step: 4,
                id: 'kc-04',
                title: 'Đọc hiểu: Quét thông tin chính (Scanning) trong đoạn văn ngắn',
                skill: 'Reading',
                level: 'FOUNDATION',
                unit: 'Unit 2: My House',
                priorityOrder: 4,
                status: 'RECOMMENDED',
                aiAnalysis: 'Kỹ thuật đọc lướt tìm từ khóa về các phòng và đồ đạc trong nhà.',
                estimatedMinutes: 10,
            },
            {
                step: 5,
                id: 'kc-05',
                title: 'Nói: Giới thiệu bản thân và ngôi trường mới',
                skill: 'Speaking',
                level: 'INTERMEDIATE',
                unit: 'Unit 1: My New School',
                priorityOrder: 5,
                status: 'RECOMMENDED',
                aiAnalysis: 'Ứng dụng từ vựng + ngữ pháp đã học ở bước 1 & 2 để thực hành phát âm phản xạ nói theo mẫu câu.',
                estimatedMinutes: 10,
            },
            {
                step: 6,
                id: 'kc-06',
                title: 'Viết: Viết đoạn văn ngắn (40-50 từ) mô tả ngôi nhà mơ ước',
                skill: 'Writing',
                level: 'ADVANCED',
                unit: 'Unit 2: My House',
                priorityOrder: 6,
                status: 'RECOMMENDED',
                aiAnalysis: 'Tổng hợp từ vựng, giới từ chỉ vị trí và liên từ (and, but) để hoàn thành đoạn văn viết hoàn chỉnh.',
                estimatedMinutes: 15,
            },
        ],
    },
};

export const AIRoadmapPage: React.FC = () => {
    const [selectedStudentId, setSelectedStudentId] = useState<string>('s1');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const [showFilterModal, setShowFilterModal] = useState<boolean>(false);

    // Bộ lọc nâng cao
    const [selectedClass, setSelectedClass] = useState<string>('ALL');
    const [selectedTeacher, setSelectedTeacher] = useState<string>('ALL');
    const [selectedParent, setSelectedParent] = useState<string>('ALL');
    const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>('ALL');

    const [roadmapData, setRoadmapData] = useState<any>(initialRoadmaps['s1']);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);

    // Modal Chi tiết
    const [selectedNode, setSelectedNode] = useState<any | null>(null);

    // Toast
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const currentStudent = mockStudents.find((s) => s.id === selectedStudentId) || mockStudents[0];

    // Trích xuất danh sách duy nhất cho bộ lọc
    const uniqueClasses = useMemo(() => Array.from(new Set(mockStudents.map((s) => s.class))), []);
    const uniqueTeachers = useMemo(() => Array.from(new Set(mockStudents.map((s) => s.teacher))), []);
    const uniqueParents = useMemo(() => Array.from(new Set(mockStudents.map((s) => s.parent))), []);

    const activeFilterCount = (selectedClass !== 'ALL' ? 1 : 0) + (selectedTeacher !== 'ALL' ? 1 : 0) + (selectedParent !== 'ALL' ? 1 : 0);

    // Thuật toán Lọc Học sinh
    const filteredStudents = useMemo(() => {
        return mockStudents.filter((s) => {
            const matchesClass = selectedClass === 'ALL' || s.class === selectedClass;
            const matchesTeacher = selectedTeacher === 'ALL' || s.teacher === selectedTeacher;
            const matchesParent = selectedParent === 'ALL' || s.parent === selectedParent;

            const q = searchQuery.toLowerCase().trim();
            const matchesSearch =
                q === '' ||
                s.name.toLowerCase().includes(q) ||
                s.code.toLowerCase().includes(q) ||
                s.email.toLowerCase().includes(q);

            return matchesClass && matchesTeacher && matchesParent && matchesSearch;
        });
    }, [selectedClass, selectedTeacher, selectedParent, searchQuery]);

    // Lọc lộ trình theo Kỹ năng
    const displayedRoadmapTree = useMemo(() => {
        if (!roadmapData.roadmapTree) return [];
        if (selectedSkillFilter === 'ALL') return roadmapData.roadmapTree;
        return roadmapData.roadmapTree.filter((item: any) => item.skill === selectedSkillFilter);
    }, [roadmapData, selectedSkillFilter]);

    const handleSelectStudent = (student: any) => {
        setSelectedStudentId(student.id);
        setShowDropdown(false);
        setShowFilterModal(false);
        setSearchQuery('');
        setRoadmapData(initialRoadmaps[student.id] || {
            overallProgress: 0,
            foundationalGaps: 0,
            advancedGaps: 0,
            estimatedTime: '0 phút',
            roadmapTree: [],
        });
    };

    const handleResetFilters = () => {
        setSelectedClass('ALL');
        setSelectedTeacher('ALL');
        setSelectedParent('ALL');
        setSearchQuery('');
    };

    const handleRegenerateRoadmap = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
            showToast(`Đã tái tạo lộ trình học bù cho ${currentStudent.name}!`);
        }, 1200);
    };

    // Helper hiển thị nhãn kỹ năng BẰNG TIẾNG ANH THUẦN
    const renderSkillBadge = (skill: string) => {
        switch (skill) {
            case 'Vocabulary':
                return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">Vocabulary</span>;
            case 'Grammar':
                return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">Grammar</span>;
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

            {/* Header Trang */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
                        Lộ trình Học bù AI
                    </h1>
                </div>

                <button
                    onClick={handleRegenerateRoadmap}
                    disabled={isGenerating}
                    className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors shadow-sm whitespace-nowrap disabled:opacity-50"
                >
                    <RotateCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                    <span>{isGenerating ? 'Đang cập nhật...' : 'Tái tạo lộ trình'}</span>
                </button>
            </div>

            {/* CHỌN & LỌC HỌC SINH */}
            <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-3">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                    {/* Thông tin Học sinh đang chọn */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-sm flex-shrink-0">
                            {currentStudent.name.charAt(0)}
                        </div>
                        <div>
                            <div className="text-xs text-slate-400">Đang xem lộ trình của học sinh:</div>
                            <div className="text-sm font-semibold text-slate-900 flex items-center gap-2 flex-wrap">
                                <span>{currentStudent.name}</span>
                                <span className="font-mono text-xs text-slate-500 font-normal">
                                    ({currentStudent.code} • Lớp {currentStudent.class} • GV: {currentStudent.teacher})
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Ô Tìm kiếm & Nút Lọc */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">

                        <div className="relative w-full sm:w-64">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Tìm học sinh theo tên, mã..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setShowDropdown(true);
                                }}
                                onFocus={() => setShowDropdown(true)}
                                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-400 font-medium"
                            />

                            {showDropdown && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-y-auto z-[100] divide-y divide-slate-100">
                                    <div className="p-2 bg-slate-50 text-[10px] text-slate-500 font-semibold uppercase flex justify-between items-center">
                                        <span>Kết quả tìm kiếm ({filteredStudents.length})</span>
                                        <button onClick={() => setShowDropdown(false)} className="text-slate-400 hover:text-slate-600">
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>

                                    {filteredStudents.length === 0 ? (
                                        <div className="p-3 text-center text-xs text-slate-400">Không tìm thấy học sinh phù hợp</div>
                                    ) : (
                                        filteredStudents.slice(0, 10).map((s) => (
                                            <div
                                                key={s.id}
                                                onClick={() => handleSelectStudent(s)}
                                                className="p-2.5 hover:bg-slate-50 cursor-pointer text-xs transition-colors flex items-center justify-between"
                                            >
                                                <div>
                                                    <div className="font-semibold text-slate-900">{s.name} <span className="font-mono text-slate-400">({s.code})</span></div>
                                                    <div className="text-[11px] text-slate-500">Lớp {s.class} • GV: {s.teacher}</div>
                                                </div>
                                                {s.id === selectedStudentId && <UserCheck className="w-4 h-4 text-emerald-600" />}
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setShowFilterModal(true)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-all whitespace-nowrap ${activeFilterCount > 0
                                ? 'bg-blue-50 text-blue-700 border-blue-200 font-semibold'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                                }`}
                        >
                            <Filter className="w-3.5 h-3.5" />
                            <span>Bộ lọc</span>
                            {activeFilterCount > 0 && (
                                <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                                    {activeFilterCount}
                                </span>
                            )}
                        </button>

                    </div>

                </div>

                {activeFilterCount > 0 && (
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100 flex-wrap text-xs">
                        <span className="text-slate-400 text-[11px]">Đang lọc theo:</span>
                        {selectedClass !== 'ALL' && <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-medium">Lớp: {selectedClass}</span>}
                        {selectedTeacher !== 'ALL' && <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-medium">GV: {selectedTeacher}</span>}
                        {selectedParent !== 'ALL' && <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-medium">PH: {selectedParent}</span>}
                        <button onClick={handleResetFilters} className="text-[11px] text-red-600 hover:underline font-medium ml-1">Xóa bộ lọc</button>
                    </div>
                )}

            </div>

            {/* Metrics Tổng quan */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                    <span className="text-xs font-medium text-slate-500">Ưu tiên 1: Nền tảng gốc (Grammar / Vocabulary)</span>
                    <div className="text-xl font-bold text-amber-600 mt-1">
                        {roadmapData.foundationalGaps} Nội dung cần học bù
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                    <span className="text-xs font-medium text-slate-500">Ưu tiên 2: Kỹ năng Thực hành (Listening / Speaking / Reading / Writing)</span>
                    <div className="text-xl font-bold text-slate-800 mt-1">
                        {roadmapData.advancedGaps} Bài tập phản xạ
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                    <span className="text-xs font-medium text-slate-500">Tổng thời gian bù dự kiến</span>
                    <div className="text-xl font-bold text-slate-900 mt-1">
                        {roadmapData.estimatedTime}
                    </div>
                </div>
            </div>

            {/* DANH SÁCH THỨ TỰ ƯU TIÊN HỌC BÙ 6 KỸ NĂNG */}
            <div className="bg-white border border-slate-200/80 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">

                {/* Thanh lọc theo Kỹ năng (NÚT BẰNG TIẾNG ANH THUẦN) */}
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                        Chuỗi thứ tự ưu tiên học bù (6 Kỹ năng)
                    </h2>

                    <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                            onClick={() => setSelectedSkillFilter('ALL')}
                            className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${selectedSkillFilter === 'ALL' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                                }`}
                        >
                            Tất cả
                        </button>
                        <button
                            onClick={() => setSelectedSkillFilter('Grammar')}
                            className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${selectedSkillFilter === 'Grammar' ? 'bg-blue-700 text-white' : 'bg-white text-blue-700 border border-slate-200 hover:bg-blue-50'
                                }`}
                        >
                            Grammar
                        </button>
                        <button
                            onClick={() => setSelectedSkillFilter('Vocabulary')}
                            className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${selectedSkillFilter === 'Vocabulary' ? 'bg-purple-700 text-white' : 'bg-white text-purple-700 border border-slate-200 hover:bg-purple-50'
                                }`}
                        >
                            Vocabulary
                        </button>
                        <button
                            onClick={() => setSelectedSkillFilter('Listening')}
                            className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${selectedSkillFilter === 'Listening' ? 'bg-emerald-700 text-white' : 'bg-white text-emerald-700 border border-slate-200 hover:bg-emerald-50'
                                }`}
                        >
                            Listening
                        </button>
                        <button
                            onClick={() => setSelectedSkillFilter('Speaking')}
                            className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${selectedSkillFilter === 'Speaking' ? 'bg-amber-700 text-white' : 'bg-white text-amber-700 border border-slate-200 hover:bg-amber-50'
                                }`}
                        >
                            Speaking
                        </button>
                        <button
                            onClick={() => setSelectedSkillFilter('Reading')}
                            className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${selectedSkillFilter === 'Reading' ? 'bg-teal-700 text-white' : 'bg-white text-teal-700 border border-slate-200 hover:bg-teal-50'
                                }`}
                        >
                            Reading
                        </button>
                        <button
                            onClick={() => setSelectedSkillFilter('Writing')}
                            className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${selectedSkillFilter === 'Writing' ? 'bg-rose-700 text-white' : 'bg-white text-rose-700 border border-slate-200 hover:bg-rose-50'
                                }`}
                        >
                            Writing
                        </button>
                    </div>
                </div>

                {/* Danh sách bài học bù */}
                <div className="p-4 space-y-3">
                    {displayedRoadmapTree.length === 0 ? (
                        <div className="text-center py-10 text-slate-400 text-xs">
                            Không có bài học bù nào thuộc kỹ năng đã chọn.
                        </div>
                    ) : (
                        displayedRoadmapTree.map((node: any) => {
                            const isFoundation = node.level === 'FOUNDATION';
                            const isAdvanced = node.level === 'ADVANCED';

                            return (
                                <div
                                    key={node.id}
                                    className={`p-4 rounded-lg border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isFoundation
                                        ? 'bg-amber-50/40 border-amber-200/80'
                                        : isAdvanced
                                            ? 'bg-purple-50/30 border-purple-200/80'
                                            : 'bg-white border-slate-200'
                                        }`}
                                >

                                    {/* Khối Thông tin */}
                                    <div className="flex items-start gap-3.5">
                                        <div className={`w-8 h-8 rounded-md flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm ${isFoundation
                                            ? 'bg-amber-600 text-white'
                                            : isAdvanced
                                                ? 'bg-purple-700 text-white'
                                                : 'bg-slate-800 text-white'
                                            }`}>
                                            #{node.priorityOrder}
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 flex-wrap">

                                                {/* Nhãn Kỹ năng Tiếng Anh */}
                                                {renderSkillBadge(node.skill)}

                                                {isFoundation ? (
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300/60 uppercase">
                                                        ★ Nền tảng gốc
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300/60 uppercase">
                                                        ● Thực hành mở rộng
                                                    </span>
                                                )}

                                                <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                                                    {node.unit}
                                                </span>
                                            </div>

                                            <h3 className="text-sm font-semibold text-slate-900">
                                                {node.title}
                                            </h3>

                                            <p className="text-xs text-slate-600 pt-0.5">
                                                Phân tích ưu tiên: <strong>{node.aiAnalysis}</strong>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Trạng thái & Thao tác */}
                                    <div className="flex items-center gap-3 sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200/60">
                                        <div className="text-right text-xs">
                                            <div className="text-slate-500 font-mono text-[11px]">
                                                Thời lượng: <strong>{node.estimatedMinutes} phút</strong>
                                            </div>
                                        </div>

                                        {node.status === 'COMPLETED' && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Đã hoàn thành
                                            </span>
                                        )}

                                        {node.status === 'IN_PROGRESS' && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                                                Đang tập trung học
                                            </span>
                                        )}

                                        {node.status === 'RECOMMENDED' && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                                                Sẵn sàng học tiếp
                                            </span>
                                        )}

                                        <button
                                            onClick={() => setSelectedNode(node)}
                                            className="p-1.5 text-slate-500 hover:text-slate-900 rounded-md bg-white border border-slate-200 hover:border-slate-300 shadow-sm transition-all"
                                            title="Xem chi tiết"
                                        >
                                            <Eye className="w-4 h-4 stroke-[1.5]" />
                                        </button>
                                    </div>

                                </div>
                            );
                        })
                    )}
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

            {/* MODAL 1: BỘ LỌC NÂNG CAO */}
            {showFilterModal && createPortal(
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[9999] flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in fade-in duration-150">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-slate-700" />
                                <h3 className="text-sm font-semibold text-slate-900">Lọc danh sách Học sinh</h3>
                            </div>
                            <button onClick={() => setShowFilterModal(false)} className="text-slate-400 hover:text-slate-700 p-1 rounded-md">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-3 text-xs">
                            <div>
                                <label className="block text-slate-700 font-medium mb-1">Lớp học</label>
                                <select
                                    value={selectedClass}
                                    onChange={(e) => setSelectedClass(e.target.value)}
                                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md p-2 focus:outline-none focus:bg-white focus:border-slate-400"
                                >
                                    <option value="ALL">Tất cả các Lớp ({uniqueClasses.length} lớp)</option>
                                    {uniqueClasses.map((c) => (
                                        <option key={c} value={c}>Lớp {c}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-slate-700 font-medium mb-1">Giáo viên phụ trách</label>
                                <select
                                    value={selectedTeacher}
                                    onChange={(e) => setSelectedTeacher(e.target.value)}
                                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md p-2 focus:outline-none focus:bg-white focus:border-slate-400"
                                >
                                    <option value="ALL">Tất cả Giáo viên ({uniqueTeachers.length} giáo viên)</option>
                                    {uniqueTeachers.map((t) => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-slate-700 font-medium mb-1">Phụ huynh liên kết</label>
                                <select
                                    value={selectedParent}
                                    onChange={(e) => setSelectedParent(e.target.value)}
                                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md p-2 focus:outline-none focus:bg-white focus:border-slate-400"
                                >
                                    <option value="ALL">Tất cả Phụ huynh ({uniqueParents.length} phụ huynh)</option>
                                    {uniqueParents.map((p) => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="p-2.5 bg-slate-50 rounded-md border border-slate-100 flex items-center justify-between text-slate-600">
                                <span>Số lượng tìm thấy:</span>
                                <strong className="text-slate-900 font-semibold">{filteredStudents.length} học sinh</strong>
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                            <button
                                onClick={handleResetFilters}
                                className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 font-medium"
                            >
                                <RefreshCw className="w-3.5 h-3.5" /> Reset bộ lọc
                            </button>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowFilterModal(false)}
                                    className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md font-medium"
                                >
                                    Đóng
                                </button>
                                <button
                                    onClick={() => setShowFilterModal(false)}
                                    className="px-3.5 py-1.5 text-xs bg-slate-900 text-white rounded-md hover:bg-slate-800 font-medium"
                                >
                                    Áp dụng bộ lọc
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* MODAL 2: CHI TIẾT BÀI HỌC BÙ */}
            {selectedNode && createPortal(
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[9999] flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in fade-in duration-150">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div>
                                <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-semibold border border-amber-200">
                                    Thứ tự ưu tiên #{selectedNode.priorityOrder}
                                </span>
                                <h3 className="text-sm font-semibold text-slate-900 mt-1">{selectedNode.title}</h3>
                            </div>
                            <button onClick={() => setSelectedNode(null)} className="text-slate-400 hover:text-slate-700 p-1 rounded-md">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-3 text-xs text-slate-600">
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1.5">
                                <div className="flex items-center gap-2">
                                    <span>Kỹ năng phụ trách:</span>
                                    {renderSkillBadge(selectedNode.skill)}
                                </div>
                                <div>Bài học trong SGK: <strong className="text-blue-600">{selectedNode.unit}</strong></div>
                                <div>Thời lượng ôn tập bù: <span className="font-mono font-semibold">{selectedNode.estimatedMinutes} phút</span></div>
                            </div>

                            <div className="font-semibold text-slate-900 pt-1">Lý do ưu tiên xếp trước:</div>
                            <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                                {selectedNode.aiAnalysis}
                            </p>
                        </div>

                        <div className="flex justify-end pt-3 border-t border-slate-100">
                            <button
                                onClick={() => setSelectedNode(null)}
                                className="px-4 py-1.5 text-xs bg-slate-900 text-white rounded-md hover:bg-slate-800 font-medium"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

        </div>
    );
};