import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Plus, Search, Tag, Edit3, Trash2, Eye, X, Volume2, Mic, CheckCircle2, AlertTriangle
} from 'lucide-react';

const initialQuestions: any[] = [
  {
    id: '1',
    code: 'Q001',
    content: 'She ______ to school every morning at 7 AM.',
    type: 'Trắc nghiệm',
    difficulty: 'KNOWLEDGE',
    options: ['go', 'goes', 'is going', 'went'],
    correctAnswer: 'B. goes',
    kcTag: 'Grammar.PresentSimple',
    unitId: 1,
    explanation: 'Chủ ngữ "She" đi với động từ thêm -s/-es ở thì Hiện tại đơn.',
  },
  {
    id: '2',
    code: 'Q002',
    content: 'Học sinh nghe file Audio và điền từ thích hợp vào chỗ trống:\n"Nam usually gets up at 6 AM. He has [1]______ with his family and then walks to [2]______."',
    type: 'Nghe - Điền từ',
    difficulty: 'COMPREHENSION',
    audioUrl: 'listening_unit1_fill.mp3',
    correctAnswer: '[1] breakfast, [2] school',
    kcTag: 'Listening.FillInBlanks',
    unitId: 1,
    explanation: 'Trong bài nghe: "Nam has breakfast with his family and walks to school".',
  },
  {
    id: '3',
    code: 'Q003',
    content: 'Nghe đoạn hội thoại và chọn đáp án đúng: Where is Tom going this weekend?',
    type: 'Nghe - Trắc nghiệm',
    difficulty: 'COMPREHENSION',
    audioUrl: 'listening_unit2_mc.mp3',
    options: ['A. Zoo', 'B. Cinema', 'C. Supermarket', 'D. Library'],
    correctAnswer: 'B. Cinema',
    kcTag: 'Listening.MultipleChoice',
    unitId: 2,
    explanation: 'Trong bài nghe Tom nói: "I am going to the cinema with my friends on Saturday."',
  },
  {
    id: '4',
    code: 'Q004',
    content: 'Nghe đoạn băng và xác định câu sau Đúng hay Sai: "Mai usually plays badminton on Sundays."',
    type: 'Nghe - Đúng/Sai',
    difficulty: 'KNOWLEDGE',
    audioUrl: 'listening_unit3_tf.mp3',
    options: ['True (Đúng)', 'False (Sai)'],
    correctAnswer: 'True (Đúng)',
    kcTag: 'Listening.TrueFalse',
    unitId: 3,
    explanation: 'Bài nghe xác nhận Mai chơi cầu lông vào mỗi Chủ nhật.',
  },
  {
    id: '5',
    code: 'Q005',
    content: 'Học sinh đọc đoạn văn sau vào mic: "My new school is big and has a large playground."',
    type: 'Nói (Audio)',
    difficulty: 'APPLICATION',
    correctAnswer: 'Đạt chuẩn phát âm AI (>= 85%)',
    audioUrl: 'sample_speaking_unit1.mp3',
    kcTag: 'Speaking.Pronunciation',
    unitId: 1,
    explanation: 'Hệ thống AI sẽ phân tích âm /s/ và /dʒ/ trong từ "school" và "playground".',
  },
  {
    id: '6',
    code: 'Q006',
    content: 'Trường THCS Hà Nội là trường học lâu đời nhất Việt Nam. Đúng hay Sai?',
    type: 'Đúng / Sai',
    difficulty: 'KNOWLEDGE',
    options: ['True (Đúng)', 'False (Sai)'],
    correctAnswer: 'False (Sai)',
    kcTag: 'Reading.GeneralKnowledge',
    unitId: 4,
    explanation: 'Quốc Tử Giám mới là trường đại học đầu tiên.',
  },
  {
    id: '7',
    code: 'Q007',
    content: 'My best friend has long black ______ and big brown eyes.',
    type: 'Điền từ',
    difficulty: 'HIGH_APPLICATION',
    correctAnswer: 'hair',
    kcTag: 'Vocabulary.Appearance',
    unitId: 3,
    explanation: 'Từ ghép miêu tả ngoại hình "long black hair" (mái tóc đen dài).',
  },
];

export const QuestionListPage: React.FC = () => {
  const [questions, setQuestions] = useState<any[]>(initialQuestions);
  const [selectedUnit, setSelectedUnit] = useState<number | undefined>(undefined);
  const [search, setSearch] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('ALL');

  // State Modals
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const [detailQuestion, setDetailQuestion] = useState<any>(null);
  const [deletingQuestion, setDeletingQuestion] = useState<any>(null);

  // State Form Soạn/Sửa câu hỏi
  const [formType, setFormType] = useState<string>('Trắc nghiệm');
  const [formDifficulty, setFormDifficulty] = useState<string>('KNOWLEDGE');
  const [formUnitId, setFormUnitId] = useState<number>(1);
  const [formContent, setFormContent] = useState<string>('');
  const [formKcTag, setFormKcTag] = useState<string>('');
  const [formExplanation, setFormExplanation] = useState<string>('');
  const [formAudioUrl, setFormAudioUrl] = useState<string>('');

  // Form state Trắc nghiệm
  const [mcOptions, setMcOptions] = useState<string[]>(['', '', '', '']);
  const [mcCorrectIdx, setMcCorrectIdx] = useState<number>(0);

  // Form state Đúng / Sai
  const [tfAnswer, setTfAnswer] = useState<string>('True (Đúng)');

  // Form state Điền từ / Audio / Nghe
  const [singleAnswer, setSingleAnswer] = useState<string>('');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => setToastMessage(msg);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Helper render nhãn Độ khó theo chuẩn GD&ĐT
  const renderDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'KNOWLEDGE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200">Nhận biết</span>;
      case 'COMPREHENSION':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200">Thông hiểu</span>;
      case 'APPLICATION':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200">Vận dụng</span>;
      case 'HIGH_APPLICATION':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold text-purple-700 bg-purple-50 border border-purple-200">Vận dụng cao</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold text-slate-700 bg-slate-100 border border-slate-200">Nhận biết</span>;
    }
  };

  // Mở modal thêm mới
  const handleOpenAddModal = () => {
    setEditingQuestion(null);
    setFormType('Trắc nghiệm');
    setFormDifficulty('KNOWLEDGE');
    setFormUnitId(selectedUnit || 1);
    setFormContent('');
    setFormKcTag('');
    setFormExplanation('');
    setFormAudioUrl('');
    setMcOptions(['', '', '', '']);
    setMcCorrectIdx(0);
    setTfAnswer('True (Đúng)');
    setSingleAnswer('');
    setShowAddModal(true);
  };

  // Mở modal Chỉnh sửa câu hỏi
  const handleOpenEditModal = (q: any) => {
    setEditingQuestion(q);
    setFormType(q.type);
    setFormDifficulty(q.difficulty || 'KNOWLEDGE');
    setFormUnitId(q.unitId || 1);
    setFormContent(q.content);
    setFormKcTag(q.kcTag);
    setFormExplanation(q.explanation || '');
    setFormAudioUrl(q.audioUrl || '');

    if (q.type === 'Trắc nghiệm' || q.type === 'Nghe - Trắc nghiệm') {
      const opts = q.options && q.options.length === 4 ? [...q.options] : ['', '', '', ''];
      setMcOptions(opts);
      const correctChar = q.correctAnswer ? q.correctAnswer.charAt(0) : 'A';
      const idxMap: any = { A: 0, B: 1, C: 2, D: 3 };
      setMcCorrectIdx(idxMap[correctChar] ?? 0);
    } else if (q.type === 'Đúng / Sai' || q.type === 'Nghe - Đúng/Sai') {
      setTfAnswer(q.correctAnswer || 'True (Đúng)');
    } else {
      setSingleAnswer(q.correctAnswer || '');
    }

    setShowAddModal(true);
  };

  // Lưu tạo mới hoặc cập nhật câu hỏi
  const handleSaveQuestion = () => {
    if (!formContent) return;

    let finalCorrectAnswer = '';
    let finalOptions: string[] | undefined = undefined;

    if (formType === 'Trắc nghiệm' || formType === 'Nghe - Trắc nghiệm') {
      const labels = ['A', 'B', 'C', 'D'];
      finalCorrectAnswer = `${labels[mcCorrectIdx]}. ${mcOptions[mcCorrectIdx] || ''}`;
      finalOptions = mcOptions;
    } else if (formType === 'Đúng / Sai' || formType === 'Nghe - Đúng/Sai') {
      finalCorrectAnswer = tfAnswer;
      finalOptions = ['True (Đúng)', 'False (Sai)'];
    } else {
      finalCorrectAnswer = singleAnswer;
    }

    if (editingQuestion) {
      setQuestions((prev: any[]) =>
        prev.map((q: any) =>
          q.id === editingQuestion.id
            ? {
              ...q,
              content: formContent,
              difficulty: formDifficulty,
              unitId: formUnitId,
              options: finalOptions,
              correctAnswer: finalCorrectAnswer,
              kcTag: formKcTag || 'Grammar.General',
              explanation: formExplanation,
              audioUrl: formAudioUrl,
            }
            : q
        )
      );
      showToast(`Đã cập nhật câu hỏi mã "${editingQuestion.code}" thành công!`);
    } else {
      const newQ = {
        id: `q-${Date.now()}`,
        code: `Q00${questions.length + 1}`,
        content: formContent,
        type: formType,
        difficulty: formDifficulty,
        unitId: formUnitId,
        options: finalOptions,
        correctAnswer: finalCorrectAnswer,
        kcTag: formKcTag || 'Grammar.General',
        explanation: formExplanation,
        audioUrl: formAudioUrl,
      };
      setQuestions((prev: any[]) => [newQ, ...prev]);
      showToast(`Đã thêm câu hỏi mã "${newQ.code}" thành công!`);
    }

    setShowAddModal(false);
  };

  // Xác nhận xóa câu hỏi
  const handleConfirmDelete = () => {
    if (!deletingQuestion) return;
    setQuestions((prev: any[]) => prev.filter((q: any) => q.id !== deletingQuestion.id));
    showToast(`Đã xóa câu hỏi mã "${deletingQuestion.code}"!`);
    setDeletingQuestion(null);
  };

  // Lọc danh sách câu hỏi theo Search, Unit & Tab
  const filteredQuestions = questions.filter((q: any) => {
    const matchesSearch =
      q.content.toLowerCase().includes(search.toLowerCase()) ||
      q.code.toLowerCase().includes(search.toLowerCase()) ||
      q.kcTag.toLowerCase().includes(search.toLowerCase());

    const matchesUnit = selectedUnit ? q.unitId === selectedUnit : true;

    const matchesTab =
      activeTab === 'ALL'
        ? true
        : activeTab === 'MULTIPLE_CHOICE'
          ? q.type === 'Trắc nghiệm'
          : activeTab === 'FILL_IN'
            ? q.type === 'Điền từ'
            : activeTab === 'TRUE_FALSE'
              ? q.type === 'Đúng / Sai'
              : activeTab === 'SPEAKING'
                ? q.type === 'Nói (Audio)'
                : activeTab === 'LISTEN_FILL'
                  ? q.type === 'Nghe - Điền từ'
                  : activeTab === 'LISTEN_MC'
                    ? q.type === 'Nghe - Trắc nghiệm'
                    : activeTab === 'LISTEN_TF'
                      ? q.type === 'Nghe - Đúng/Sai'
                      : true;

    return matchesSearch && matchesUnit && matchesTab;
  });

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Ngân hàng câu hỏi</h1>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors shadow-sm whitespace-nowrap"
        >
          <Plus className="w-4 h-4 stroke-[2]" />
          <span>Soạn câu hỏi mới</span>
        </button>
      </div>

      {/* Main Table Container */}
      <div className="bg-white border border-slate-200/80 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">

        {/* Filter Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 stroke-[1.5]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm câu hỏi theo nội dung, mã ID, KC Tag..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-400 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedUnit || ''}
              onChange={(e) => setSelectedUnit(e.target.value ? Number(e.target.value) : undefined)}
              className="text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md px-3 py-1.5 focus:outline-none focus:border-slate-400 shadow-sm cursor-pointer"
            >
              <option value="">Tất cả các Unit (1 - 12)</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Unit {i + 1}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tab Phân loại dạng câu hỏi */}
        <div className="px-4 pt-3 pb-0 border-b border-slate-100 bg-slate-50/50 overflow-x-auto">
          <div className="flex items-center gap-1 min-w-max text-xs font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-3 py-2 border-b-2 transition-all ${activeTab === 'ALL'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
                }`}
            >
              Tất cả ({questions.length})
            </button>
            <button
              onClick={() => setActiveTab('MULTIPLE_CHOICE')}
              className={`px-3 py-2 border-b-2 transition-all ${activeTab === 'MULTIPLE_CHOICE'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
                }`}
            >
              Trắc nghiệm ({questions.filter((q: any) => q.type === 'Trắc nghiệm').length})
            </button>
            <button
              onClick={() => setActiveTab('FILL_IN')}
              className={`px-3 py-2 border-b-2 transition-all ${activeTab === 'FILL_IN'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
                }`}
            >
              Điền từ ({questions.filter((q: any) => q.type === 'Điền từ').length})
            </button>
            <button
              onClick={() => setActiveTab('TRUE_FALSE')}
              className={`px-3 py-2 border-b-2 transition-all ${activeTab === 'TRUE_FALSE'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
                }`}
            >
              Đúng / Sai ({questions.filter((q: any) => q.type === 'Đúng / Sai').length})
            </button>
            <button
              onClick={() => setActiveTab('SPEAKING')}
              className={`px-3 py-2 border-b-2 transition-all ${activeTab === 'SPEAKING'
                ? 'border-blue-600 text-blue-700 font-semibold'
                : 'border-transparent hover:text-slate-900'
                }`}
            >
              Phát âm & Nói ({questions.filter((q: any) => q.type === 'Nói (Audio)').length})
            </button>
            <button
              onClick={() => setActiveTab('LISTEN_FILL')}
              className={`px-3 py-2 border-b-2 transition-all ${activeTab === 'LISTEN_FILL'
                ? 'border-purple-600 text-purple-700 font-semibold'
                : 'border-transparent hover:text-slate-900'
                }`}
            >
              Nghe - Điền từ ({questions.filter((q: any) => q.type === 'Nghe - Điền từ').length})
            </button>
            <button
              onClick={() => setActiveTab('LISTEN_MC')}
              className={`px-3 py-2 border-b-2 transition-all ${activeTab === 'LISTEN_MC'
                ? 'border-purple-600 text-purple-700 font-semibold'
                : 'border-transparent hover:text-slate-900'
                }`}
            >
              Nghe - Trắc nghiệm ({questions.filter((q: any) => q.type === 'Nghe - Trắc nghiệm').length})
            </button>
            <button
              onClick={() => setActiveTab('LISTEN_TF')}
              className={`px-3 py-2 border-b-2 transition-all ${activeTab === 'LISTEN_TF'
                ? 'border-purple-600 text-purple-700 font-semibold'
                : 'border-transparent hover:text-slate-900'
                }`}
            >
              Nghe - Đúng/Sai ({questions.filter((q: any) => q.type === 'Nghe - Đúng/Sai').length})
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                <th className="py-3 px-4 w-20">Mã ID</th>
                <th className="py-3 px-4 min-w-[250px]">Nội dung câu hỏi</th>
                <th className="py-3 px-4 w-20">Unit</th>
                <th className="py-3 px-4 w-36">Dạng câu</th>
                <th className="py-3 px-4 w-28">Độ khó</th>
                <th className="py-3 px-4 min-w-[150px]">Đáp án chuẩn</th>
                <th className="py-3 px-4 min-w-[160px]">Thẻ kiến thức (KC Tag)</th>
                <th className="py-3 px-4 text-right pr-6 w-28">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredQuestions.map((q: any) => (
                <tr key={q.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 font-medium whitespace-nowrap">
                    {q.code}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-900">
                    <div className="line-clamp-2 leading-relaxed whitespace-pre-line">{q.content}</div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap font-semibold text-slate-700">
                    Unit {q.unitId || 1}
                  </td>

                  {/* CHỈ SỬA CỘT DẠNG CÂU VỀ BADGE TỐI GIẢN NHƯ ẢNH MẪU */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-50 text-slate-700 border border-slate-200">
                      {q.type}
                    </span>
                  </td>

                  {/* GIỮ NGUYÊN MÀU ĐỘ KHÓ GD&ĐT */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {renderDifficultyBadge(q.difficulty)}
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-slate-800 whitespace-nowrap">
                    {q.correctAnswer}
                  </td>

                  {/* GIỮ NGUYÊN MÀU XANH CỦA THẺ KC TAG */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/50">
                      <Tag className="w-3 h-3 text-blue-500" />
                      {q.kcTag}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right pr-6 whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5 justify-end">
                      <button
                        onClick={() => setDetailQuestion(q)}
                        className="w-7 h-7 inline-flex items-center justify-center text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-all shadow-sm"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-3.5 h-3.5 stroke-[1.5]" />
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(q)}
                        className="w-7 h-7 inline-flex items-center justify-center text-slate-500 hover:text-blue-600 bg-white border border-slate-200 rounded hover:bg-blue-50 transition-all shadow-sm"
                        title="Chỉnh sửa câu hỏi"
                      >
                        <Edit3 className="w-3.5 h-3.5 stroke-[1.5]" />
                      </button>
                      <button
                        onClick={() => setDeletingQuestion(q)}
                        className="w-7 h-7 inline-flex items-center justify-center text-slate-500 hover:text-red-600 bg-white border border-slate-200 rounded hover:bg-red-50 transition-all shadow-sm"
                        title="Xóa"
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

      {/* MODAL 1: SOẠN MỚI / CHỈNH SỬA CÂU HỎI */}
      {showAddModal && createPortal(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in fade-in duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-semibold text-slate-900">
                {editingQuestion ? `Chỉnh sửa câu hỏi (${editingQuestion.code})` : 'Soạn câu hỏi mới'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700 p-1 rounded-md">
                <X className="w-4 h-4 stroke-[1.5]" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">

              {/* Cấu hình 3 cột: Dạng câu - Độ khó chuẩn GD&ĐT - CHỌN UNIT */}
              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Loại dạng câu hỏi
                  </label>
                  <select
                    disabled={!!editingQuestion}
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:border-slate-400 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed"
                  >
                    <option value="Trắc nghiệm">Trắc nghiệm</option>
                    <option value="Điền từ">Điền từ</option>
                    <option value="Đúng / Sai">Đúng / Sai</option>
                    <option value="Nói (Audio)">Nói (Phát âm AI)</option>
                    <option value="Nghe - Điền từ">Nghe - Điền từ</option>
                    <option value="Nghe - Trắc nghiệm">Nghe - Trắc nghiệm</option>
                    <option value="Nghe - Đúng/Sai">Nghe - Đúng/Sai</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Độ khó (GD&ĐT)</label>
                  <select
                    value={formDifficulty}
                    onChange={(e) => setFormDifficulty(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:border-slate-400"
                  >
                    <option value="KNOWLEDGE">Nhận biết</option>
                    <option value="COMPREHENSION">Thông hiểu</option>
                    <option value="APPLICATION">Vận dụng</option>
                    <option value="HIGH_APPLICATION">Vận dụng cao</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Thuộc Unit</label>
                  <select
                    value={formUnitId}
                    onChange={(e) => setFormUnitId(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-slate-900 font-medium focus:outline-none focus:border-slate-400"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Unit {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* TẢI FILE AUDIO NẾU LÀ CÁC DẠNG BÀI NGHE HOẶC NÓI */}
              {(formType.startsWith('Nghe') || formType === 'Nói (Audio)') && (
                <div className="p-3 bg-purple-50/60 border border-purple-200/80 rounded-lg space-y-1.5">
                  <label className="block text-purple-900 font-semibold flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-purple-600" />
                    <span>Đường dẫn file Audio bài nghe/mẫu (.mp3)</span>
                  </label>
                  <input
                    type="text"
                    value={formAudioUrl}
                    onChange={(e) => setFormAudioUrl(e.target.value)}
                    placeholder="Ví dụ: listening_unit1_track.mp3"
                    className="w-full px-3 py-1.5 bg-white border border-purple-200 rounded text-xs focus:outline-none focus:border-purple-400 font-mono"
                  />
                </div>
              )}

              {/* Nội dung đề bài */}
              <div>
                <label className="block text-slate-700 font-medium mb-1">Nội dung câu hỏi</label>
                <textarea
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder={
                    formType === 'Nghe - Điền từ'
                      ? 'Nhập đoạn văn có đánh dấu các vị trí [1]___ [2]___...'
                      : 'Nhập nội dung đề bài câu hỏi...'
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md h-20 focus:outline-none focus:bg-white focus:border-slate-400 transition-all"
                />
              </div>

              {/* DẠNG FORM ĐỘNG */}
              {(formType === 'Trắc nghiệm' || formType === 'Nghe - Trắc nghiệm') && (
                <div className="space-y-2 p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                  <label className="block text-slate-700 font-semibold mb-1">
                    Nhập 4 lựa chọn và tích chọn đáp án đúng:
                  </label>
                  {['A', 'B', 'C', 'D'].map((label, idx) => (
                    <div key={label} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="mcCorrect"
                        checked={mcCorrectIdx === idx}
                        onChange={() => setMcCorrectIdx(idx)}
                        className="w-4 h-4 text-blue-600 cursor-pointer"
                        title={`Chọn ${label} làm đáp án đúng`}
                      />
                      <span className="font-bold text-slate-700 w-4">{label}.</span>
                      <input
                        type="text"
                        value={mcOptions[idx] || ''}
                        onChange={(e) => {
                          const next = [...mcOptions];
                          next[idx] = e.target.value;
                          setMcOptions(next);
                        }}
                        placeholder={`Nhập đáp án ${label}...`}
                        className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded text-xs focus:outline-none focus:border-slate-400"
                      />
                    </div>
                  ))}
                </div>
              )}

              {(formType === 'Đúng / Sai' || formType === 'Nghe - Đúng/Sai') && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 space-y-2">
                  <label className="block text-slate-700 font-semibold">Chọn đáp án đúng chuẩn:</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-800">
                      <input
                        type="radio"
                        name="tfAnswer"
                        value="True (Đúng)"
                        checked={tfAnswer === 'True (Đúng)'}
                        onChange={(e) => setTfAnswer(e.target.value)}
                        className="w-4 h-4 text-emerald-600"
                      />
                      True (Đúng)
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-800">
                      <input
                        type="radio"
                        name="tfAnswer"
                        value="False (Sai)"
                        checked={tfAnswer === 'False (Sai)'}
                        onChange={(e) => setTfAnswer(e.target.value)}
                        className="w-4 h-4 text-red-600"
                      />
                      False (Sai)
                    </label>
                  </div>
                </div>
              )}

              {(formType === 'Điền từ' || formType === 'Nghe - Điền từ') && (
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    {formType === 'Nghe - Điền từ' ? 'Các từ cần điền theo vị trí [1], [2]...' : 'Từ/Cụm từ đáp án đúng'}
                  </label>
                  <input
                    type="text"
                    value={singleAnswer}
                    onChange={(e) => setSingleAnswer(e.target.value)}
                    placeholder={formType === 'Nghe - Điền từ' ? 'Ví dụ: [1] breakfast, [2] school' : 'Ví dụ: hair'}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-400 font-medium"
                  />
                </div>
              )}

              {formType === 'Nói (Audio)' && (
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Tiêu chí chấm điểm phát âm AI</label>
                  <input
                    type="text"
                    value={singleAnswer}
                    onChange={(e) => setSingleAnswer(e.target.value)}
                    placeholder="Ví dụ: Đạt chuẩn phát âm AI (>= 85%)"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-400 font-medium"
                  />
                </div>
              )}

              {/* Thẻ KC Tag */}
              <div>
                <label className="block text-slate-700 font-medium mb-1">Thẻ kiến thức (KC Tag)</label>
                <input
                  type="text"
                  value={formKcTag}
                  onChange={(e) => setFormKcTag(e.target.value)}
                  placeholder="Ví dụ: Listening.FillInBlanks hoặc Grammar.PresentSimple"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-400 transition-all font-mono"
                />
              </div>

              {/* Lời giải thích */}
              <div>
                <label className="block text-slate-700 font-medium mb-1">Lời giải thích chi tiết</label>
                <textarea
                  value={formExplanation}
                  onChange={(e) => setFormExplanation(e.target.value)}
                  placeholder="Giải thích chi tiết đáp án..."
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md h-16 focus:outline-none focus:bg-white focus:border-slate-400 transition-all"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md transition-colors font-medium"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleSaveQuestion}
                className="px-3.5 py-1.5 text-xs bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors font-medium shadow-sm"
              >
                {editingQuestion ? 'Cập nhật câu hỏi' : 'Lưu câu hỏi'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL 2: XEM CHI TIẾT CÂU HỎI */}
      {detailQuestion && createPortal(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {detailQuestion.code}
                </span>
                <span className="text-xs font-medium text-slate-600">Chi tiết câu hỏi</span>
              </div>
              <button onClick={() => setDetailQuestion(null)} className="text-slate-400 hover:text-slate-700 p-1 rounded-md">
                <X className="w-4 h-4 stroke-[1.5]" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Dạng bài:</span>
                  <strong className="text-slate-900">{detailQuestion.type}</strong>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Độ khó:</span>
                  {renderDifficultyBadge(detailQuestion.difficulty)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Phạm vi:</span>
                  <strong className="text-blue-700">Unit {detailQuestion.unitId || 1}</strong>
                </div>
              </div>

              <div>
                <span className="text-slate-500 block mb-1">Nội dung đề bài:</span>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-900 font-medium leading-relaxed whitespace-pre-line">
                  {detailQuestion.content}
                </div>
              </div>

              {(detailQuestion.type === 'Nói (Audio)' || detailQuestion.type.startsWith('Nghe')) && (
                <div className="p-3 bg-purple-50/70 border border-purple-200/80 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2 text-purple-900 font-medium">
                    {detailQuestion.type === 'Nói (Audio)' ? <Mic className="w-4 h-4 text-blue-600" /> : <Volume2 className="w-4 h-4 text-purple-600" />}
                    <span>File âm thanh bài nghe ({detailQuestion.audioUrl || 'audio_sample.mp3'})</span>
                  </div>
                  <button className="px-2.5 py-1 bg-white text-purple-700 border border-purple-200 rounded hover:bg-purple-100 text-[11px] font-semibold">
                    ► Nghe bài
                  </button>
                </div>
              )}

              {detailQuestion.options && (
                <div>
                  <span className="text-slate-500 block mb-1">Các lựa chọn:</span>
                  <div className="grid grid-cols-2 gap-2">
                    {detailQuestion.options.map((opt: string, idx: number) => (
                      <div
                        key={idx}
                        className={`p-2 rounded border text-xs font-medium ${detailQuestion.correctAnswer.includes(opt.slice(0, 1)) || detailQuestion.correctAnswer.includes(opt)
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                          : 'bg-white border-slate-200 text-slate-700'
                          }`}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 bg-emerald-50/60 border border-emerald-200/80 rounded-lg">
                  <span className="text-emerald-700 block text-[11px] font-medium mb-0.5">Đáp án đúng chuẩn:</span>
                  <span className="font-semibold text-emerald-900 text-sm">{detailQuestion.correctAnswer}</span>
                </div>
                <div className="p-2.5 bg-blue-50/60 border border-blue-200/80 rounded-lg">
                  <span className="text-blue-700 block text-[11px] font-medium mb-0.5">Thẻ KC Tag:</span>
                  <span className="font-mono font-semibold text-blue-900 text-xs">{detailQuestion.kcTag}</span>
                </div>
              </div>

              <div className="pt-1">
                <span className="text-slate-500 block mb-1">Lời giải thích chi tiết:</span>
                <p className="text-slate-600 italic bg-slate-50 p-2.5 rounded border border-slate-100 text-[11px] leading-relaxed">
                  "{detailQuestion.explanation}"
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setDetailQuestion(null)}
                className="px-4 py-1.5 text-xs bg-slate-900 text-white font-medium rounded-md hover:bg-slate-800 transition-colors shadow-sm"
              >
                Đóng cửa sổ
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL 3: XÁC NHẬN XÓA CÂU HỎI */}
      {deletingQuestion && createPortal(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Xác nhận xóa câu hỏi</h3>
                <p className="text-xs text-slate-500 mt-0.5">Hành động này không thể hoàn tác.</p>
              </div>
            </div>

            <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
              Bạn có chắc chắn muốn xóa câu hỏi mã <strong className="text-slate-900">{deletingQuestion.code}</strong> khỏi ngân hàng dữ liệu?
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setDeletingQuestion(null)}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md transition-colors font-medium"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-3.5 py-1.5 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium shadow-sm"
              >
                Xóa câu hỏi
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};