import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
    Search, Eye, Trash2, CheckCircle2, XCircle, Clock,
    X, Award, FileText, Check, AlertTriangle
} from 'lucide-react';

// Dữ liệu mẫu bảng exam_history + kết nối student (users) & exam
const initialExamHistory = [
    {
        id: 'eh-101',
        studentCode: 'HS6001',
        studentName: 'Nguyễn Văn Bình',
        studentEmail: 'binh.nv6001@student.edu.vn',
        studentClass: '6A1',
        examTitle: 'Đề thi Giữa kỳ 1 - Tiếng Anh 6 (Tập 1)',
        score: 8.5,
        totalQuestions: 20,
        correctAnswers: 17,
        durationSeconds: 1250, // 20 phút 50 giây
        submittedAt: '2026-11-05 14:30',
        details: [
            { questionNo: 1, type: 'VOCAB', studentAnswer: 'A', correctAnswer: 'A', isCorrect: true, score: 0.5 },
            { questionNo: 2, type: 'GRAMMAR', studentAnswer: 'C', correctAnswer: 'C', isCorrect: true, score: 0.5 },
            { questionNo: 3, type: 'READING', studentAnswer: 'B', correctAnswer: 'D', isCorrect: false, score: 0 },
            { questionNo: 4, type: 'VOCAB', studentAnswer: 'A', correctAnswer: 'A', isCorrect: true, score: 0.5 },
        ]
    },
    {
        id: 'eh-102',
        studentCode: 'HS6002',
        studentName: 'Trần Thị Ngọc',
        studentEmail: 'ngoc.tt6002@student.edu.vn',
        studentClass: '6A2',
        examTitle: 'Bài Ôn tập Unit 1: My New School',
        score: 9.5,
        totalQuestions: 10,
        correctAnswers: 9,
        durationSeconds: 540, // 9 phút
        submittedAt: '2026-11-06 09:15',
        details: [
            { questionNo: 1, type: 'VOCAB', studentAnswer: 'B', correctAnswer: 'B', isCorrect: true, score: 1.0 },
            { questionNo: 2, type: 'GRAMMAR', studentAnswer: 'A', correctAnswer: 'A', isCorrect: true, score: 1.0 },
        ]
    },
    {
        id: 'eh-103',
        studentCode: 'HS6003',
        studentName: 'Lê Hoàng Anh',
        studentEmail: 'anh.lh6003@student.edu.vn',
        studentClass: '6A1',
        examTitle: 'Đề thi Cuối kỳ 1 - Tiếng Anh 6',
        score: 4.0,
        totalQuestions: 20,
        correctAnswers: 8,
        durationSeconds: 2100, // 35 phút
        submittedAt: '2026-11-04 16:45',
        details: [
            { questionNo: 1, type: 'GRAMMAR', studentAnswer: 'D', correctAnswer: 'B', isCorrect: false, score: 0 },
            { questionNo: 2, type: 'VOCAB', studentAnswer: 'C', correctAnswer: 'C', isCorrect: true, score: 0.5 },
        ]
    },
    {
        id: 'eh-104',
        studentCode: 'HS6004',
        studentName: 'Phạm Minh Quân',
        studentEmail: 'quan.pm6004@student.edu.vn',
        studentClass: '6A3',
        examTitle: 'Bài Kiểm tra 15 phút - Unit 3: My Friends',
        score: 7.0,
        totalQuestions: 10,
        correctAnswers: 7,
        durationSeconds: 780, // 13 phút
        submittedAt: '2026-11-06 10:20',
        details: []
    },
];

export const ExamHistoryPage: React.FC = () => {
    const [historyList, setHistoryList] = useState<any[]>(initialExamHistory);
    const [search, setSearch] = useState<string>('');
    const [scoreFilter, setScoreFilter] = useState<string>('ALL');

    // Modals
    const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
    const [deletingRecord, setDeletingRecord] = useState<any | null>(null);

    // Toast notification
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    // Hàm chuyển đổi giây sang phút/giây
    const formatDuration = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m} phút ${s > 0 ? `${s}s` : ''}`;
    };

    // Xác nhận Xóa Lịch sử làm bài
    const handleConfirmDelete = () => {
        if (!deletingRecord) return;
        setHistoryList((prev) => prev.filter((item) => item.id !== deletingRecord.id));
        showToast(`Đã xóa lượt làm bài thi của học sinh "${deletingRecord.studentName}" thành công!`);
        setDeletingRecord(null);
    };

    // Bộ lọc dữ liệu
    const filteredHistory = historyList.filter((item) => {
        const q = search.toLowerCase().trim();
        const matchesSearch =
            item.studentName.toLowerCase().includes(q) ||
            item.studentCode.toLowerCase().includes(q) ||
            item.studentEmail.toLowerCase().includes(q) ||
            item.examTitle.toLowerCase().includes(q);

        let matchesScore = true;
        if (scoreFilter === 'EXCELLENT') matchesScore = item.score >= 8.0;
        else if (scoreFilter === 'GOOD') matchesScore = item.score >= 6.5 && item.score < 8.0;
        else if (scoreFilter === 'AVERAGE') matchesScore = item.score >= 5.0 && item.score < 6.5;
        else if (scoreFilter === 'FAILED') matchesScore = item.score < 5.0;

        return matchesSearch && matchesScore;
    });

    // Tính toán chỉ số thống kê
    const totalExams = historyList.length;
    const avgScore = totalExams > 0 ? (historyList.reduce((acc, curr) => acc + curr.score, 0) / totalExams).toFixed(1) : '0';
    const passedCount = historyList.filter((i) => i.score >= 5.0).length;
    const passRate = totalExams > 0 ? Math.round((passedCount / totalExams) * 100) : 0;

    return (
        <div className="space-y-6 w-full">

            {/* Header Trang */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
                        Lịch sử Thi & Tiến trình Làm bài
                    </h1>
                </div>
            </div>

            {/* Thẻ Thống Kê Nhanh */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center justify-between">
                    <div>
                        <span className="text-xs font-medium text-slate-500">Điểm trung bình</span>
                        <div className="text-2xl font-bold text-slate-900 mt-1">{avgScore} <span className="text-xs font-normal text-slate-400">/ 10</span></div>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Award className="w-5 h-5 stroke-[1.5]" />
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center justify-between">
                    <div>
                        <span className="text-xs font-medium text-slate-500">Tổng lượt bài thi</span>
                        <div className="text-2xl font-bold text-slate-900 mt-1">{totalExams}</div>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                        <FileText className="w-5 h-5 stroke-[1.5]" />
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center justify-between">
                    <div>
                        <span className="text-xs font-medium text-slate-500">Tỷ lệ Đạt (≥ 5.0)</span>
                        <div className="text-2xl font-bold text-emerald-600 mt-1">{passRate}%</div>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 stroke-[1.5]" />
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center justify-between">
                    <div>
                        <span className="text-xs font-medium text-slate-500">Lượt thi yếu (&lt; 5.0)</span>
                        <div className="text-2xl font-bold text-red-600 mt-1">{historyList.filter((i) => i.score < 5.0).length}</div>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                        <XCircle className="w-5 h-5 stroke-[1.5]" />
                    </div>
                </div>
            </div>

            {/* Bảng Danh sách Lịch sử Làm bài */}
            <div className="bg-white border border-slate-200/80 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">

                {/* Thanh Lọc & Tìm kiếm */}
                <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="relative w-full sm:w-96">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 stroke-[1.5]" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Tìm theo Tên HS, Email, Mã HS hoặc Tên đề thi..."
                            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-400"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <select
                            value={scoreFilter}
                            onChange={(e) => setScoreFilter(e.target.value)}
                            className="text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md px-3 py-1.5 focus:outline-none shadow-sm cursor-pointer"
                        >
                            <option value="ALL">Tất cả khoảng điểm</option>
                            <option value="EXCELLENT">Giỏi (8.0 - 10.0)</option>
                            <option value="GOOD">Khá (6.5 - 7.9)</option>
                            <option value="AVERAGE">Trung bình (5.0 - 6.4)</option>
                            <option value="FAILED">Yếu / Chưa đạt (&lt; 5.0)</option>
                        </select>
                    </div>
                </div>

                {/* Bảng Dữ liệu */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[850px]">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                                <th className="py-3 px-4 min-w-[220px]">Học sinh (Student)</th>
                                <th className="py-3 px-4 min-w-[240px]">Tên bài thi / Đề kiểm tra</th>
                                <th className="py-3 px-4 w-28 text-center">Điểm số</th>
                                <th className="py-3 px-4 w-32">Số câu đúng</th>
                                <th className="py-3 px-4 w-32">Thời gian làm</th>
                                <th className="py-3 px-4 w-36">Thời gian nộp</th>
                                <th className="py-3 px-4 text-right pr-6 w-28">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                            {filteredHistory.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-10 text-slate-400">
                                        Không tìm thấy dữ liệu lịch sử thi phù hợp.
                                    </td>
                                </tr>
                            ) : (
                                filteredHistory.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">

                                        {/* Học sinh */}
                                        <td className="py-3.5 px-4 font-medium text-slate-900">
                                            <div className="font-semibold text-slate-900 flex items-center gap-2">
                                                <span>{item.studentName}</span>
                                                <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded font-normal">
                                                    {item.studentCode}
                                                </span>
                                            </div>
                                            <div className="text-[11px] text-slate-400 font-normal mt-0.5">
                                                Email: <span className="text-slate-600 font-mono">{item.studentEmail}</span> • Lớp: <span className="font-semibold text-blue-600">{item.studentClass}</span>
                                            </div>
                                        </td>

                                        {/* Tên Bài thi */}
                                        <td className="py-3.5 px-4 font-medium text-slate-800">
                                            <div className="line-clamp-1">{item.examTitle}</div>
                                        </td>

                                        {/* Điểm số */}
                                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${item.score >= 8.0
                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                : item.score >= 5.0
                                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                                    : 'bg-red-50 text-red-700 border border-red-200'
                                                }`}>
                                                {item.score.toFixed(1)} / 10
                                            </span>
                                        </td>

                                        {/* Số câu đúng */}
                                        <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap font-medium">
                                            <span className="text-emerald-600 font-semibold">{item.correctAnswers}</span> / {item.totalQuestions} câu
                                        </td>

                                        {/* Thời gian làm */}
                                        <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                                            <div className="flex items-center gap-1.5 font-mono">
                                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                <span>{formatDuration(item.durationSeconds)}</span>
                                            </div>
                                        </td>

                                        {/* Thời gian nộp bài */}
                                        <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                                            {item.submittedAt}
                                        </td>

                                        {/* Thao tác */}
                                        <td className="py-3.5 px-4 text-right pr-6 whitespace-nowrap">
                                            <div className="inline-flex items-center gap-1.5 justify-end">
                                                <button
                                                    onClick={() => setSelectedRecord(item)}
                                                    className="w-7 h-7 inline-flex items-center justify-center text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-100 hover:text-slate-900 transition-all shadow-sm"
                                                    title="Xem chi tiết bài làm"
                                                >
                                                    <Eye className="w-3.5 h-3.5 stroke-[1.5]" />
                                                </button>
                                                <button
                                                    onClick={() => setDeletingRecord(item)}
                                                    className="w-7 h-7 inline-flex items-center justify-center text-slate-500 bg-white border border-slate-200 rounded hover:bg-red-50 hover:text-red-600 transition-all shadow-sm"
                                                    title="Xóa lượt thi"
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

            {/* MODAL XEM CHI TIẾT BÀI LÀM */}
            {selectedRecord && createPortal(
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[9999] flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in fade-in duration-150">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div>
                                <h3 className="text-sm font-semibold text-slate-900">Chi tiết Bài Làm Học Sinh</h3>
                                <p className="text-xs text-slate-500 font-mono mt-0.5">{selectedRecord.studentName} - {selectedRecord.studentCode}</p>
                            </div>
                            <button onClick={() => setSelectedRecord(null)} className="text-slate-400 hover:text-slate-700 p-1 rounded-md">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-3 text-xs">
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center justify-between">
                                <div>
                                    <div className="font-semibold text-slate-900">{selectedRecord.examTitle}</div>
                                    <div className="text-[11px] text-slate-500 mt-1">
                                        Nộp bài lúc: <span className="font-mono">{selectedRecord.submittedAt}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-bold text-emerald-600">{selectedRecord.score.toFixed(1)} điểm</div>
                                    <div className="text-[10px] text-slate-400 font-mono">{formatDuration(selectedRecord.durationSeconds)}</div>
                                </div>
                            </div>

                            <div className="font-semibold text-slate-800 pt-1">Bảng đáp án chi tiết từng câu:</div>

                            {selectedRecord.details && selectedRecord.details.length > 0 ? (
                                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                                    {selectedRecord.details.map((q: any) => (
                                        <div key={q.questionNo} className="p-2.5 rounded-md border border-slate-100 bg-white flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-slate-700">Câu {q.questionNo}:</span>
                                                <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{q.type}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="text-[11px]">
                                                    Chọn: <strong className={q.isCorrect ? 'text-emerald-600' : 'text-red-600'}>{q.studentAnswer}</strong>
                                                    {!q.isCorrect && <span className="text-slate-400 ml-1">(Đúng: {q.correctAnswer})</span>}
                                                </div>
                                                {q.isCorrect ? (
                                                    <Check className="w-4 h-4 text-emerald-500 stroke-[2.5]" />
                                                ) : (
                                                    <X className="w-4 h-4 text-red-500 stroke-[2.5]" />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                                    Không có dữ liệu chi tiết từng câu hỏi cho lượt làm này.
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end pt-3 border-t border-slate-100">
                            <button
                                onClick={() => setSelectedRecord(null)}
                                className="px-4 py-1.5 text-xs bg-slate-900 text-white rounded-md hover:bg-slate-800 font-medium"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* MODAL XÁC NHẬN XÓA LƯỢT THI */}
            {deletingRecord && createPortal(
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[9999] flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-sm w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in fade-in duration-150">
                        <div className="flex items-center gap-3 text-red-600">
                            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                                <AlertTriangle className="w-5 h-5 stroke-[1.5]" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-slate-900">Xác nhận xóa lượt thi</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Kết quả thi này sẽ bị gỡ bỏ khỏi hệ thống.</p>
                            </div>
                        </div>

                        <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1">
                            <div>Học sinh: <strong className="text-slate-900">{deletingRecord.studentName}</strong></div>
                            <div>Đề thi: <strong className="text-slate-900">{deletingRecord.examTitle}</strong></div>
                            <div>Điểm số: <strong className="text-emerald-600">{deletingRecord.score.toFixed(1)} điểm</strong></div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                            <button
                                onClick={() => setDeletingRecord(null)}
                                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md font-medium"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="px-3.5 py-1.5 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
                            >
                                Xóa lượt thi
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

        </div>
    );
};