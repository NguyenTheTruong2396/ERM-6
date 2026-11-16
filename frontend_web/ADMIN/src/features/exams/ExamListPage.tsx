import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Plus, Search, Clock, CheckCircle2, X, Eye, Trash2, AlertTriangle, Edit3
} from 'lucide-react';

// Ngân hàng câu hỏi mẫu tích hợp nhãn Kỹ năng (Listening, Speaking, Reading, Writing)
const mockBankQuestions: any[] = [
  { id: 'q1', code: 'Q001', content: 'She ______ to school every morning at 7 AM.', type: 'Trắc nghiệm', skill: 'Reading', difficulty: 'EASY', unitId: 1 },
  { id: 'q2', code: 'Q002', content: 'Học sinh nghe file Audio và điền từ thích hợp: "Nam gets up at 6 AM. He has [1]______..."', type: 'Nghe - Điền từ', skill: 'Listening', difficulty: 'MEDIUM', unitId: 1 },
  { id: 'q3', code: 'Q003', content: 'Nghe đoạn hội thoại và chọn đáp án đúng: Where is Tom going this weekend?', type: 'Nghe - Trắc nghiệm', skill: 'Listening', difficulty: 'MEDIUM', unitId: 2 },
  { id: 'q4', code: 'Q004', content: 'Học sinh đọc đoạn văn sau vào mic: "My new school is big and has a large playground."', type: 'Nói (Audio)', skill: 'Speaking', difficulty: 'HARD', unitId: 1 },
  { id: 'q5', code: 'Q005', content: 'Trường THCS Hà Nội là trường học lâu đời nhất Việt Nam. Đúng hay Sai?', type: 'Đúng / Sai', skill: 'Reading', difficulty: 'EASY', unitId: 4 },
  { id: 'q6', code: 'Q006', content: 'My best friend has long black ______ and big brown eyes.', type: 'Điền từ', skill: 'Writing', difficulty: 'EASY', unitId: 3 },
  { id: 'q7', code: 'Q007', content: 'We ______ learning English right now.', type: 'Trắc nghiệm', skill: 'Reading', difficulty: 'EASY', unitId: 2 },
  { id: 'q8', code: 'Q008', content: 'Listen and complete: "There are [1]______ books on the table."', type: 'Nghe - Điền từ', skill: 'Listening', difficulty: 'HARD', unitId: 3 },
  { id: 'q9', code: 'Q009', content: 'Viết lại câu sau dùng từ gợi ý: "Nam / like / play / badminton / afternoon."', type: 'Điền từ', skill: 'Writing', difficulty: 'HARD', unitId: 2 },
  { id: 'q10', code: 'Q010', content: 'Đọc và phát âm chuẩn từ sau: "International School"', type: 'Nói (Audio)', skill: 'Speaking', difficulty: 'EASY', unitId: 1 },
];

const initialExams: any[] = [
  {
    id: '1',
    code: 'EX001',
    title: 'Bài kiểm tra 15 phút - Unit 1: My New School',
    type: '15 phút',
    duration: 15,
    passScore: 5.0,
    maxAttempts: 1,
    totalQuestions: 10,
    status: 'ACTIVE',
    createdAt: '2026-11-01',
    mode: 'MATRIX',
    shuffleQuestions: true,
    shuffleOptions: true,
    showResultsImmediately: true,
    units: [1],
    selectedQuestionTypes: ['Trắc nghiệm', 'Nghe - Điền từ'],
    matrixRatio: { easy: 50, medium: 30, hard: 20 },
    selectedQuestionIds: ['q1', 'q2', 'q4', 'q6'],
  },
  {
    id: '2',
    code: 'EX002',
    title: 'Bài kiểm tra 1 Tiết - Unit 1 & Unit 2',
    type: '1 tiết',
    duration: 45,
    passScore: 5.0,
    maxAttempts: 2,
    totalQuestions: 30,
    status: 'ACTIVE',
    createdAt: '2026-11-03',
    mode: 'MANUAL',
    shuffleQuestions: true,
    shuffleOptions: false,
    showResultsImmediately: false,
    units: [1, 2],
    selectedQuestionTypes: ['Trắc nghiệm', 'Điền từ'],
    matrixRatio: { easy: 40, medium: 40, hard: 20 },
    selectedQuestionIds: ['q1', 'q6', 'q7', 'q9'],
  },
];

export const ExamListPage: React.FC = () => {
  const [exams, setExams] = useState<any[]>(initialExams);
  const [search, setSearch] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('ALL');

  // State Modals & Chỉnh sửa
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingExamId, setEditingExamId] = useState<string | null>(null);
  const [detailExam, setDetailExam] = useState<any>(null);
  const [deletingExam, setDeletingExam] = useState<any>(null);

  // State Form Tạo / Cấu hình Đề thi mới
  const [createMode, setCreateMode] = useState<'MATRIX' | 'MANUAL'>('MATRIX');
  const [formTitle, setFormTitle] = useState<string>('');
  const [formType, setFormType] = useState<string>('15 phút');
  const [formDuration, setFormDuration] = useState<number>(15);
  const [formPassScore, setFormPassScore] = useState<number>(5.0);
  const [formMaxAttempts, setFormMaxAttempts] = useState<number>(1);
  const [formTotalQuestions, setFormTotalQuestions] = useState<number>(10);

  // Dynamic Settings
  const [shuffleQuestions] = useState<boolean>(true);
  const [shuffleOptions] = useState<boolean>(true);
  const [showResultsImmediately] = useState<boolean>(true);

  // Dynamic Matrix & Phạm vi
  const [ratioEasy, setRatioEasy] = useState<number>(50);
  const [ratioMedium, setRatioMedium] = useState<number>(30);
  const [ratioHard, setRatioHard] = useState<number>(20);
  const [selectedUnits, setSelectedUnits] = useState<number[]>([1]);

  // Các dạng câu hỏi mong muốn (Ma trận)
  const availableTypes = ['Trắc nghiệm', 'Điền từ', 'Đúng / Sai', 'Nói (Audio)', 'Nghe - Điền từ', 'Nghe - Trắc nghiệm', 'Nghe - Đúng/Sai'];
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['Trắc nghiệm', 'Điền từ', 'Nghe - Điền từ']);

  // Bộ lọc bên cột trái (Tạo thủ công)
  const [manualTypeFilter, setManualTypeFilter] = useState<string>('ALL');
  const [manualDifficultyFilter, setManualDifficultyFilter] = useState<string>('ALL');
  const [manualUnitFilter, setManualUnitFilter] = useState<string>('ALL');

  // Danh sách ID câu hỏi hiển thị CỘT BÊN PHẢI (Preview)
  const [generatedQuestionIds, setGeneratedQuestionIds] = useState<string[]>(['q1', 'q2', 'q4', 'q6']);
  const [previewTabSkill, setPreviewTabSkill] = useState<string>('ALL');

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => setToastMessage(msg);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Toggle chọn Unit
  const toggleUnitSelection = (unitNum: number) => {
    if (selectedUnits.includes(unitNum)) {
      if (selectedUnits.length > 1) setSelectedUnits(selectedUnits.filter((u) => u !== unitNum));
    } else {
      setSelectedUnits([...selectedUnits, unitNum]);
    }
  };

  // Toggle chọn Dạng câu hỏi
  const toggleTypeSelection = (typeName: string) => {
    if (selectedTypes.includes(typeName)) {
      if (selectedTypes.length > 1) setSelectedTypes(selectedTypes.filter((t) => t !== typeName));
    } else {
      setSelectedTypes([...selectedTypes, typeName]);
    }
  };

  // Toggle chọn/bỏ chọn câu hỏi thủ công
  const toggleQuestionSelection = (qId: string) => {
    if (generatedQuestionIds.includes(qId)) {
      setGeneratedQuestionIds(generatedQuestionIds.filter((id) => id !== qId));
    } else {
      setGeneratedQuestionIds([...generatedQuestionIds, qId]);
    }
  };

  // Xóa trực tiếp 1 câu khỏi Preview
  const handleRemoveQuestionFromPreview = (qId: string) => {
    setGeneratedQuestionIds(generatedQuestionIds.filter((id) => id !== qId));
    showToast('Đã xóa câu hỏi khỏi danh sách đề thi');
  };

  // Bấm nút "Sinh & Xem trước đề thi" ở chế độ MA TRẬN TỰ ĐỘNG (LẤY THEO SỐ CÂU HỎI ĐÃ NHẬP)
  const handleGenerateMatrixQuestions = () => {
    const matched = mockBankQuestions.filter((q) => {
      const matchUnit = selectedUnits.includes(q.unitId);
      const matchType = selectedTypes.includes(q.type);
      return matchUnit && matchType;
    });

    const pool = matched.length > 0 ? matched : mockBankQuestions;
    const countToTake = Math.min(formTotalQuestions, pool.length);
    const idsToSet = pool.slice(0, countToTake).map((q) => q.id);

    setGeneratedQuestionIds(idsToSet);
    showToast(`Đã bốc tự động ${idsToSet.length} câu hỏi theo cấu hình ma trận!`);
  };

  // Mở modal Tạo đề mới
  const handleOpenAddModal = () => {
    setEditingExamId(null);
    setFormTitle('');
    setFormDuration(15);
    setFormTotalQuestions(10);
    setGeneratedQuestionIds(['q1', 'q2', 'q4', 'q6']);
    setShowAddModal(true);
  };

  // Mở modal Chỉnh sửa đề thi hiện có
  const handleOpenEditModal = (exam: any) => {
    setEditingExamId(exam.id);
    setCreateMode(exam.mode || 'MATRIX');
    setFormTitle(exam.title);
    setFormType(exam.type);
    setFormDuration(exam.duration);
    setFormPassScore(exam.passScore || 5.0);
    setFormMaxAttempts(exam.maxAttempts || 1);
    setFormTotalQuestions(exam.totalQuestions || 10);
    setSelectedUnits(exam.units || [1]);
    setGeneratedQuestionIds(exam.selectedQuestionIds || ['q1', 'q2']);
    setShowAddModal(true);
  };

  // Tạo mới hoặc Lưu cập nhật bài thi
  const handleCreateOrUpdateExam = () => {
    if (!formTitle) return;

    if (editingExamId) {
      setExams((prev: any[]) =>
        prev.map((e: any) =>
          e.id === editingExamId
            ? {
              ...e,
              title: formTitle,
              type: formType,
              duration: formDuration,
              passScore: formPassScore,
              maxAttempts: formMaxAttempts,
              totalQuestions: generatedQuestionIds.length,
              mode: createMode,
              units: selectedUnits,
              selectedQuestionTypes: selectedTypes,
              matrixRatio: { easy: ratioEasy, medium: ratioMedium, hard: ratioHard },
              selectedQuestionIds: generatedQuestionIds,
            }
            : e
        )
      );
      showToast(`Đã cập nhật bài thi "${formTitle}" thành công!`);
    } else {
      const newExam = {
        id: `ex-${Date.now()}`,
        code: `EX00${exams.length + 1}`,
        title: formTitle,
        type: formType,
        duration: formDuration,
        passScore: formPassScore,
        maxAttempts: formMaxAttempts,
        totalQuestions: generatedQuestionIds.length,
        status: 'ACTIVE',
        createdAt: new Date().toISOString().split('T')[0],
        mode: createMode,
        shuffleQuestions,
        shuffleOptions,
        showResultsImmediately,
        units: selectedUnits,
        selectedQuestionTypes: selectedTypes,
        matrixRatio: { easy: ratioEasy, medium: ratioMedium, hard: ratioHard },
        selectedQuestionIds: generatedQuestionIds,
      };

      setExams((prev: any[]) => [newExam, ...prev]);
      showToast(`Đã khởi tạo đề thi "${formTitle}" thành công!`);
    }

    setShowAddModal(false);
  };

  // Đổi trạng thái
  const toggleExamStatus = (examId: string) => {
    setExams((prev: any[]) =>
      prev.map((e: any) => {
        if (e.id === examId) {
          const nextStatus = e.status === 'ACTIVE' ? 'DRAFT' : 'ACTIVE';
          showToast(`Đã chuyển đề sang trạng thái ${nextStatus === 'ACTIVE' ? 'Xuất bản' : 'Nháp'}`);
          return { ...e, status: nextStatus };
        }
        return e;
      })
    );
  };

  // Xóa đề thi
  const handleConfirmDelete = () => {
    if (!deletingExam) return;
    setExams((prev: any[]) => prev.filter((e: any) => e.id !== deletingExam.id));
    showToast(`Đã xóa đề thi "${deletingExam.title}"!`);
    setDeletingExam(null);
  };

  // Filter đề thi ở trang chính
  const filteredExams = exams.filter((e: any) => {
    const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase()) || e.code.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'ALL' ? true : e.type === filterType;
    return matchesSearch && matchesType;
  });

  // Filter ngân hàng câu hỏi ở CỘT TRÁI (Tạo thủ công)
  const manualFilteredBankQuestions = mockBankQuestions.filter((q: any) => {
    const matchesType = manualTypeFilter === 'ALL' ? true : q.type === manualTypeFilter;
    const matchesDifficulty = manualDifficultyFilter === 'ALL' ? true : q.difficulty === manualDifficultyFilter;
    const matchesUnit = manualUnitFilter === 'ALL' ? true : q.unitId === Number(manualUnitFilter);
    return matchesType && matchesDifficulty && matchesUnit;
  });

  // Danh sách các câu hỏi hiển thị ở CỘT PHẢI (Preview) theo Tab kỹ năng
  const previewQuestions = mockBankQuestions.filter((q) => {
    const isSelected = generatedQuestionIds.includes(q.id);
    if (!isSelected) return false;
    if (previewTabSkill === 'ALL') return true;
    return q.skill === previewTabSkill;
  });

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Quản lý đề thi & Ma trận đề
          </h1>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors shadow-sm whitespace-nowrap"
        >
          <Plus className="w-4 h-4 stroke-[2]" />
          <span>Tạo đề thi mới</span>
        </button>
      </div>

      {/* Bảng Đề Thi Trang Chính */}
      <div className="bg-white border border-slate-200/80 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">

        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 stroke-[1.5]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên đề thi, mã ID..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-400 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md px-3 py-1.5 focus:outline-none focus:border-slate-400 shadow-sm cursor-pointer"
            >
              <option value="ALL">Tất cả loại đề</option>
              <option value="15 phút">15 phút</option>
              <option value="1 tiết">1 tiết</option>
              <option value="Giữa kỳ">Giữa kỳ</option>
              <option value="Cuối kỳ">Cuối kỳ</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                <th className="py-3 px-4 w-20">Mã ID</th>
                <th className="py-3 px-4 min-w-[260px]">Tên bài kiểm tra</th>
                <th className="py-3 px-4 w-32">Phương thức</th>
                <th className="py-3 px-4 w-24">Loại đề</th>
                <th className="py-3 px-4 w-28">Thời gian</th>
                <th className="py-3 px-4 w-24">Số câu</th>
                <th className="py-3 px-4 w-28">Trạng thái</th>
                <th className="py-3 px-4 text-right pr-6 w-32">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredExams.map((exam: any) => (
                <tr key={exam.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 font-medium whitespace-nowrap">
                    {exam.code}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    <div>{exam.title}</div>
                    <div className="text-[11px] text-slate-400 font-normal mt-0.5">
                      Phạm vi: Unit {exam.units ? exam.units.join(', ') : '1'}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {exam.mode === 'MATRIX' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        Ma trận tự động
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        Thủ công ({exam.selectedQuestionIds ? exam.selectedQuestionIds.length : 0} câu)
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {exam.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium whitespace-nowrap">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {exam.duration} phút
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium whitespace-nowrap">
                    {exam.totalQuestions} câu
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleExamStatus(exam.id)}
                      className="cursor-pointer"
                      title="Bấm để đổi trạng thái"
                    >
                      {exam.status === 'ACTIVE' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Xuất bản
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                          Nháp
                        </span>
                      )}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right pr-6 whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5 justify-end">
                      <button
                        onClick={() => setDetailExam(exam)}
                        className="w-7 h-7 inline-flex items-center justify-center text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-all shadow-sm"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-3.5 h-3.5 stroke-[1.5]" />
                      </button>

                      <button
                        onClick={() => handleOpenEditModal(exam)}
                        className="w-7 h-7 inline-flex items-center justify-center text-slate-500 hover:text-blue-600 bg-white border border-slate-200 rounded hover:bg-blue-50 transition-all shadow-sm"
                        title="Chỉnh sửa cấu hình & câu hỏi đề thi"
                      >
                        <Edit3 className="w-3.5 h-3.5 stroke-[1.5]" />
                      </button>

                      <button
                        onClick={() => setDeletingExam(exam)}
                        className="w-7 h-7 inline-flex items-center justify-center text-slate-500 hover:text-red-600 bg-white border border-slate-200 rounded hover:bg-red-50 transition-all shadow-sm"
                        title="Xóa đề thi"
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

      {/* MODAL GIAO DIỆN SPLIT-VIEW 2 CỘT */}
      {showAddModal && createPortal(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-6xl w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in fade-in duration-150 max-h-[92vh] overflow-y-auto">

            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  {editingExamId ? 'Chỉnh Sửa Đề Thi & Xem Trước Câu Hỏi' : 'Tạo Đề Thi & Xem Trước Câu Hỏi'}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Cấu hình thông số bên trái và xem danh sách câu hỏi phân loại theo Listening, Speaking, Reading, Writing bên phải</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700 p-1 rounded-md">
                <X className="w-4 h-4 stroke-[1.5]" />
              </button>
            </div>

            {/* LAYOUT 2 CỘT MAIN CONTENT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 text-xs">

              {/* CỘT TRÁI (5 CỘT GRID): THÔNG TIN CẤU HÌNH & BỘ LỌC */}
              <div className="lg:col-span-5 space-y-4 pr-1 border-r-0 lg:border-r border-slate-100">

                {/* 1. Chọn Phương thức tạo đề */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1.5">Phương thức tạo đề thi</label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setCreateMode('MATRIX')}
                      className={`p-2.5 rounded-lg border text-left transition-all ${createMode === 'MATRIX'
                        ? 'bg-blue-50/70 border-blue-500 text-blue-900 ring-1 ring-blue-500 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                      <div className="text-xs text-slate-900">Ma trận tự động</div>
                      <div className="text-[10px] text-slate-500 font-normal">Tự bốc câu hỏi</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCreateMode('MANUAL')}
                      className={`p-2.5 rounded-lg border text-left transition-all ${createMode === 'MANUAL'
                        ? 'bg-blue-50/70 border-blue-500 text-blue-900 ring-1 ring-blue-500 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                      <div className="text-xs text-slate-900">Tạo Thủ công</div>
                      <div className="text-[10px] text-slate-500 font-normal">Tự chọn từng câu</div>
                    </button>
                  </div>
                </div>

                {/* 2. Thông tin cơ bản đề thi */}
                <div className="space-y-2.5">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Tên bài kiểm tra *</label>
                    <input
                      type="text"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="Ví dụ: Kiểm tra 15 phút - Unit 1: My New School"
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-400 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Loại đề thi</label>
                      <select
                        value={formType}
                        onChange={(e) => setFormType(e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-md text-slate-900 focus:outline-none"
                      >
                        <option value="15 phút">15 phút</option>
                        <option value="1 tiết">1 tiết</option>
                        <option value="Giữa kỳ">Giữa kỳ</option>
                        <option value="Cuối kỳ">Cuối kỳ</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Thời gian (Phút)</label>
                      <input
                        type="number"
                        value={formDuration}
                        onChange={(e) => setFormDuration(Number(e.target.value))}
                        className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-md focus:outline-none"
                      />
                    </div>

                    {/* CHO PHÉP NHẬP / CHỈNH SỬA SỐ CÂU HỎI KHI TẠO ĐỀ TỰ ĐỘNG */}
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Số câu hỏi</label>
                      <input
                        type="number"
                        readOnly={createMode === 'MANUAL'}
                        value={createMode === 'MANUAL' ? generatedQuestionIds.length : formTotalQuestions}
                        onChange={(e) => setFormTotalQuestions(Number(e.target.value))}
                        className={`w-full px-2 py-1.5 border rounded-md font-bold text-center ${createMode === 'MANUAL' ? 'bg-slate-100 text-blue-700' : 'bg-white border-blue-300 text-slate-900'
                          }`}
                      />
                    </div>
                  </div>
                </div>

                {/* ================= CHẾ ĐỘ 1: MA TRẬN TỰ ĐỘNG ================= */}
                {createMode === 'MATRIX' && (
                  <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-lg space-y-3">
                    <div className="font-semibold text-blue-900">
                      Cấu hình Sinh đề Ma trận
                    </div>

                    {/* Dạng câu hỏi */}
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Dạng câu hỏi mong muốn:</label>
                      <div className="flex flex-wrap gap-1">
                        {availableTypes.map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => toggleTypeSelection(t)}
                            className={`px-2 py-0.5 rounded text-[11px] font-medium border transition-all ${selectedTypes.includes(t)
                              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                              }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Tỷ lệ độ khó */}
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-slate-600 mb-0.5">Dễ (%)</label>
                        <input
                          type="number"
                          value={ratioEasy}
                          onChange={(e) => setRatioEasy(Number(e.target.value))}
                          className="w-full px-2 py-1 bg-white border border-blue-200 rounded text-center font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 mb-0.5">T.Bình (%)</label>
                        <input
                          type="number"
                          value={ratioMedium}
                          onChange={(e) => setRatioMedium(Number(e.target.value))}
                          className="w-full px-2 py-1 bg-white border border-blue-200 rounded text-center font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 mb-0.5">Khó (%)</label>
                        <input
                          type="number"
                          value={ratioHard}
                          onChange={(e) => setRatioHard(Number(e.target.value))}
                          className="w-full px-2 py-1 bg-white border border-blue-200 rounded text-center font-medium"
                        />
                      </div>
                    </div>

                    {/* Phạm vi Unit */}
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Phạm vi các Unit:</label>
                      <div className="flex flex-wrap gap-1">
                        {Array.from({ length: 6 }, (_, i) => i + 1).map((u) => (
                          <button
                            key={u}
                            type="button"
                            onClick={() => toggleUnitSelection(u)}
                            className={`px-2 py-0.5 rounded text-[11px] font-medium border transition-all ${selectedUnits.includes(u)
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-slate-600 border-slate-200'
                              }`}
                          >
                            Unit {u}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* NÚT TẠO ĐỀ THI SẠCH KHÔNG ICON */}
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={handleGenerateMatrixQuestions}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold text-xs transition-colors shadow-sm"
                      >
                        Sinh & Xem trước đề thi
                      </button>
                    </div>

                  </div>
                )}

                {/* ================= CHẾ ĐỘ 2: CHỌN CÂU HỎI THỦ CÔNG ================= */}
                {createMode === 'MANUAL' && (
                  <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg space-y-2.5">
                    <div className="font-semibold text-slate-900">
                      Ngân hàng câu hỏi (Tích chọn)
                    </div>

                    {/* Thanh lọc bên cột trái */}
                    <div className="grid grid-cols-3 gap-1.5">
                      <select
                        value={manualTypeFilter}
                        onChange={(e) => setManualTypeFilter(e.target.value)}
                        className="px-1.5 py-1 bg-white border border-slate-200 rounded text-[11px]"
                      >
                        <option value="ALL">Dạng câu</option>
                        {availableTypes.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>

                      <select
                        value={manualDifficultyFilter}
                        onChange={(e) => setManualDifficultyFilter(e.target.value)}
                        className="px-1.5 py-1 bg-white border border-slate-200 rounded text-[11px]"
                      >
                        <option value="ALL">Độ khó</option>
                        <option value="EASY">Dễ</option>
                        <option value="MEDIUM">T.Bình</option>
                        <option value="HARD">Khó</option>
                      </select>

                      <select
                        value={manualUnitFilter}
                        onChange={(e) => setManualUnitFilter(e.target.value)}
                        className="px-1.5 py-1 bg-white border border-slate-200 rounded text-[11px]"
                      >
                        <option value="ALL">Unit</option>
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>Unit {i + 1}</option>
                        ))}
                      </select>
                    </div>

                    {/* Danh sách tích chọn thủ công */}
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {manualFilteredBankQuestions.map((q: any) => {
                        const isSelected = generatedQuestionIds.includes(q.id);
                        return (
                          <div
                            key={q.id}
                            onClick={() => toggleQuestionSelection(q.id)}
                            className={`p-2 rounded border cursor-pointer transition-all flex items-start gap-2 ${isSelected
                              ? 'bg-blue-50/80 border-blue-300 text-slate-900'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/60'
                              }`}
                          >
                            <input
                              type="checkbox"
                              readOnly
                              checked={isSelected}
                              className="mt-0.5 rounded text-blue-600"
                            />
                            <div className="flex-1 text-[11px]">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <span className="font-mono font-bold text-slate-500">{q.code}</span>
                                <span className="bg-slate-100 text-slate-600 px-1 rounded text-[9px]">{q.type}</span>
                                <span className="text-blue-600 font-semibold text-[9px]">U{q.unitId}</span>
                              </div>
                              <div className="line-clamp-1 text-slate-900 font-medium">{q.content}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Quy chế làm bài */}
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg space-y-2">
                  <div className="font-semibold text-slate-900">Cấu hình Quy chế</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-700 text-[11px] mb-0.5">Điểm đạt (Pass)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={formPassScore}
                        onChange={(e) => setFormPassScore(Number(e.target.value))}
                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded font-medium text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 text-[11px] mb-0.5">Lần làm tối đa</label>
                      <select
                        value={formMaxAttempts}
                        onChange={(e) => setFormMaxAttempts(Number(e.target.value))}
                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                      >
                        <option value={1}>1 lần</option>
                        <option value={2}>2 lần</option>
                        <option value={999}>Vô hạn</option>
                      </select>
                    </div>
                  </div>
                </div>

              </div>

              {/* CỘT PHẢI: XEM TRƯỚC VỚI CÁC TAB TIẾNG ANH (LISTENING, SPEAKING, READING, WRITING) */}
              <div className="lg:col-span-7 space-y-3 bg-slate-50/60 p-4 rounded-xl border border-slate-200/80 flex flex-col justify-between">

                <div>
                  {/* Header Cột Phải */}
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-slate-900 text-sm">Xem trước câu hỏi đề thi</h4>
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold">
                        {generatedQuestionIds.length} câu
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setCreateMode('MANUAL')}
                      className="px-2.5 py-1 text-[11px] font-medium bg-white border border-slate-300 text-slate-700 rounded hover:bg-slate-50 transition-colors shadow-sm"
                    >
                      Chỉnh sửa câu hỏi trong đề
                    </button>
                  </div>

                  {/* TAB PHÂN LOẠI KỸ NĂNG TIẾNG ANH (KHÔNG CÓ CHỮ SKILL DƯ THỪA) */}
                  <div className="flex items-center gap-1.5 pt-3 pb-2 overflow-x-auto">
                    <button
                      type="button"
                      onClick={() => setPreviewTabSkill('ALL')}
                      className={`px-3 py-1 rounded-md font-semibold text-xs transition-all ${previewTabSkill === 'ALL'
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                    >
                      Tất cả ({generatedQuestionIds.length})
                    </button>

                    <button
                      type="button"
                      onClick={() => setPreviewTabSkill('Listening')}
                      className={`px-3 py-1 rounded-md font-semibold text-xs transition-all ${previewTabSkill === 'Listening'
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-white text-purple-700 border border-purple-200 hover:bg-purple-50'
                        }`}
                    >
                      Listening ({mockBankQuestions.filter((q) => generatedQuestionIds.includes(q.id) && q.skill === 'Listening').length})
                    </button>

                    <button
                      type="button"
                      onClick={() => setPreviewTabSkill('Speaking')}
                      className={`px-3 py-1 rounded-md font-semibold text-xs transition-all ${previewTabSkill === 'Speaking'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50'
                        }`}
                    >
                      Speaking ({mockBankQuestions.filter((q) => generatedQuestionIds.includes(q.id) && q.skill === 'Speaking').length})
                    </button>

                    <button
                      type="button"
                      onClick={() => setPreviewTabSkill('Reading')}
                      className={`px-3 py-1 rounded-md font-semibold text-xs transition-all ${previewTabSkill === 'Reading'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50'
                        }`}
                    >
                      Reading ({mockBankQuestions.filter((q) => generatedQuestionIds.includes(q.id) && q.skill === 'Reading').length})
                    </button>

                    <button
                      type="button"
                      onClick={() => setPreviewTabSkill('Writing')}
                      className={`px-3 py-1 rounded-md font-semibold text-xs transition-all ${previewTabSkill === 'Writing'
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'bg-white text-amber-700 border border-amber-200 hover:bg-amber-50'
                        }`}
                    >
                      Writing ({mockBankQuestions.filter((q) => generatedQuestionIds.includes(q.id) && q.skill === 'Writing').length})
                    </button>
                  </div>

                  {/* DANH SÁCH CÂU HỎI XEM TRƯỚC */}
                  <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1 pt-1">
                    {previewQuestions.length === 0 ? (
                      <div className="text-center py-12 bg-white rounded-lg border border-dashed border-slate-200 text-slate-400">
                        Chưa có câu hỏi nào thuộc kỹ năng này trong đề thi.
                      </div>
                    ) : (
                      previewQuestions.map((q, idx) => (
                        <div key={q.id} className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm space-y-1.5 relative group">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center">
                                {idx + 1}
                              </span>
                              <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                                {q.code}
                              </span>

                              {/* THẺ KỸ NĂNG CHỈ CÓ TÊN TIẾNG ANH (Listening, Speaking, Reading, Writing) */}
                              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${q.skill === 'Listening' ? 'bg-purple-100 text-purple-800' :
                                q.skill === 'Speaking' ? 'bg-blue-100 text-blue-800' :
                                  q.skill === 'Reading' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                {q.skill}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-slate-500 font-medium bg-slate-50 px-2 py-0.5 rounded border">
                                Unit {q.unitId} • {q.difficulty}
                              </span>

                              <button
                                type="button"
                                onClick={() => handleRemoveQuestionFromPreview(q.id)}
                                className="text-slate-400 hover:text-red-600 p-0.5 rounded"
                                title="Xóa khỏi đề thi"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="text-slate-900 font-medium text-xs leading-relaxed pl-7">
                            {q.content}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Bottom Footer Modal */}
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-200/80">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-md transition-colors"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateOrUpdateExam}
                    className="px-5 py-2 text-xs font-semibold bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors shadow-sm"
                  >
                    {editingExamId ? 'Lưu cập nhật đề thi' : `Hoàn tất & Lưu đề thi (${generatedQuestionIds.length} câu)`}
                  </button>
                </div>

              </div>

            </div>

          </div>
        </div>,
        document.body
      )}

      {/* MODAL XEM CHI TIẾT ĐỀ THI */}
      {detailExam && createPortal(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {detailExam.code}
                </span>
                <h3 className="text-sm font-semibold text-slate-900">Chi tiết cấu hình bài thi</h3>
              </div>
              <button onClick={() => setDetailExam(null)} className="text-slate-400 hover:text-slate-700 p-1 rounded-md">
                <X className="w-4 h-4 stroke-[1.5]" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1">
                <div className="font-semibold text-slate-900 text-sm">{detailExam.title}</div>
                <div className="text-slate-500">Loại bài: <strong>{detailExam.type}</strong> • Thời gian: <strong>{detailExam.duration} phút</strong></div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-blue-50 border border-blue-100 rounded">
                  <span className="text-blue-700 block text-[10px]">Thời gian</span>
                  <strong className="text-blue-900">{detailExam.duration} Phút</strong>
                </div>
                <div className="p-2 bg-emerald-50 border border-emerald-100 rounded">
                  <span className="text-emerald-700 block text-[10px]">Điểm đạt</span>
                  <strong className="text-emerald-900">{detailExam.passScore || 5.0} / 10</strong>
                </div>
                <div className="p-2 bg-purple-50 border border-purple-100 rounded">
                  <span className="text-purple-700 block text-[10px]">Lần làm</span>
                  <strong className="text-purple-900">{detailExam.maxAttempts || 1} lần</strong>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setDetailExam(null)}
                className="px-4 py-1.5 text-xs bg-slate-900 text-white font-medium rounded-md"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL XÁC NHẬN XÓA ĐỀ THI */}
      {deletingExam && createPortal(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Xác nhận xóa đề thi</h3>
                <p className="text-xs text-slate-500 mt-0.5">Hành động này không thể hoàn tác.</p>
              </div>
            </div>

            <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
              Bạn có chắc chắn muốn xóa bài kiểm tra <strong className="text-slate-900">{deletingExam.title}</strong>?
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setDeletingExam(null)}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md font-medium"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-3.5 py-1.5 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
              >
                Xóa đề thi
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};