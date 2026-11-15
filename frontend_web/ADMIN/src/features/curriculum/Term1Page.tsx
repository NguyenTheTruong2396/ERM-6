import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Trash2, X, AlertTriangle, CheckCircle2, Edit3, Volume2, Image as ImageIcon } from 'lucide-react';



export const Term1Page: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'INTRO' | 'UNITS' | 'OUTRO'>('UNITS');

  const [introPages, setIntroPages] = useState<LessonPage[]>(initialIntroPages);
  const [outroPages, setOutroPages] = useState<LessonPage[]>(initialOutroPages);
  const [units, setUnits] = useState<UnitItem[]>(initialUnits);

  const [selectedUnitId, setSelectedUnitId] = useState<string>(initialUnits[0].id);
  const [selectedLessonId, setSelectedLessonId] = useState<string>(initialUnits[0].lessons[0]?.id || '');
  const [rightTab, setRightTab] = useState<'LESSON_CONTENT' | 'ANSWERS_TRANSLATION'>('LESSON_CONTENT');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => setToastMessage(msg);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Modal States
  const [modalType, setModalType] = useState<'PAGE_INTRO' | 'PAGE_OUTRO' | 'UNIT' | 'LESSON' | 'SECTION' | 'QUESTION_BUILDER' | 'LESSON_PAGE' | 'ANSWER_PAGE' | null>(null);
  const [editingSection, setEditingSection] = useState<SectionItem | null>(null);

  // Inputs
  const [inputTitle, setInputTitle] = useState('');
  const [inputImageUrl, setInputImageUrl] = useState('');
  const [selectType, setSelectType] = useState<SectionItem['type']>('TRUE_FALSE');
  const [audioUrlInput, setAudioUrlInput] = useState('');
  const [sectionImageUrlInput, setSectionImageUrlInput] = useState('');
  const [wordBoxInput, setWordBoxInput] = useState('');
  const [translationText, setTranslationText] = useState('');

  // Form Thêm Câu Hỏi Mới
  const [tempQuestions, setTempQuestions] = useState<QuestionItem[]>([]);
  const [newQText, setNewQText] = useState('');
  const [newQCorrect, setNewQCorrect] = useState('True');
  const [newOptA, setNewOptA] = useState('');
  const [newOptB, setNewOptB] = useState('');
  const [newOptC, setNewOptC] = useState('');
  const [newOptD, setNewOptD] = useState('');
  const [newMatchTarget, setNewMatchTarget] = useState('');

  // Delete State
  const [deletingItem, setDeletingItem] = useState<{ id: string; type: string; name: string } | null>(null);

  const currentUnit = units.find(u => u.id === selectedUnitId) || units[0];
  const currentLesson = currentUnit?.lessons?.find(l => l.id === selectedLessonId) || currentUnit?.lessons?.[0];

  useEffect(() => {
    if (currentLesson?.translationNotes) {
      setTranslationText(currentLesson.translationNotes);
    } else {
      setTranslationText('');
    }
  }, [selectedLessonId]);

  // Mở modal Soạn thảo danh sách câu hỏi
  const handleOpenQuestionBuilder = (sec: SectionItem) => {
    setEditingSection(sec);
    setTempQuestions(sec.questions || []);
    setAudioUrlInput(sec.fileUrl || '');
    setSectionImageUrlInput(sec.imageUrl || '');
    setWordBoxInput(sec.wordBox || '');
    setNewQText('');
    setNewQCorrect(sec.type === 'TRUE_FALSE' ? 'True' : '');
    setNewOptA(''); setNewOptB(''); setNewOptC(''); setNewOptD('');
    setNewMatchTarget('');
    setModalType('QUESTION_BUILDER');
  };

  // Thêm 1 câu hỏi mới vào danh sách
  const handleAddQuestion = () => {
    if (!newQText.trim()) return;

    let optionsArr: string[] | undefined = undefined;
    if (editingSection?.type === 'MULTIPLE_CHOICE') {
      optionsArr = [newOptA.trim(), newOptB.trim(), newOptC.trim(), newOptD.trim()].filter(Boolean);
    }

    const newQ: QuestionItem = {
      id: `q_${Date.now()}`,
      questionNumber: tempQuestions.length + 1,
      questionText: newQText.trim(),
      options: optionsArr,
      correctAnswer: newQCorrect.trim(),
      matchingTarget: editingSection?.type === 'MATCHING' ? newMatchTarget.trim() : undefined
    };

    setTempQuestions(prev => [...prev, newQ]);
    setNewQText('');
    setNewOptA(''); setNewOptB(''); setNewOptC(''); setNewOptD('');
    setNewMatchTarget('');
  };

  const handleUpdateQuestionInTable = (qId: string, field: keyof QuestionItem, value: any) => {
    setTempQuestions(prev => prev.map(q => q.id === qId ? { ...q, [field]: value } : q));
  };

  const handleRemoveQuestion = (qId: string) => {
    setTempQuestions(prev => prev.filter(q => q.id !== qId).map((q, idx) => ({ ...q, questionNumber: idx + 1 })));
  };

  const handleSaveQuestionBuilder = () => {
    if (!editingSection) return;

    setUnits(prev => prev.map(u => u.id === selectedUnitId ? {
      ...u, lessons: u.lessons.map(l => l.id === selectedLessonId ? {
        ...l, sections: l.sections.map(s => s.id === editingSection.id ? {
          ...s,
          fileUrl: audioUrlInput,
          imageUrl: sectionImageUrlInput,
          wordBox: wordBoxInput,
          questions: tempQuestions
        } : s)
      } : l)
    } : u));

    showToast(`Đã lưu danh sách câu hỏi!`);
    setModalType(null);
    setEditingSection(null);
  };

  const handleCreateSection = () => {
    if (!inputTitle.trim()) return;

    const newSec: SectionItem = {
      id: `s_${Date.now()}`,
      name: inputTitle.trim(),
      type: selectType,
      fileUrl: audioUrlInput.trim() || undefined,
      imageUrl: sectionImageUrlInput.trim() || undefined,
      wordBox: wordBoxInput.trim() || undefined,
      questions: []
    };

    setUnits(prev => prev.map(u => u.id === selectedUnitId ? {
      ...u, lessons: u.lessons.map(l => l.id === selectedLessonId ? { ...l, sections: [...l.sections, newSec] } : l)
    } : u));

    showToast(`Đã tạo mục "${inputTitle}"!`);
    setModalType(null);
    setInputTitle('');
    setAudioUrlInput('');
    setSectionImageUrlInput('');
    setWordBoxInput('');
  };

  const handleSaveModal = () => {
    if (!inputTitle.trim()) return;

    if (modalType === 'PAGE_INTRO') {
      setIntroPages(prev => [...prev, { id: `ip_${Date.now()}`, name: inputTitle, imageUrl: inputImageUrl }]);
      showToast(`Đã thêm trang mở đầu!`);
    } else if (modalType === 'PAGE_OUTRO') {
      setOutroPages(prev => [...prev, { id: `op_${Date.now()}`, name: inputTitle, imageUrl: inputImageUrl }]);
      showToast(`Đã thêm trang kết thúc!`);
    } else if (modalType === 'UNIT') {
      const newUnit: UnitItem = { id: `u_${Date.now()}`, title: inputTitle.trim(), description: 'Danh mục', lessons: [] };
      setUnits(prev => [...prev, newUnit]);
      setSelectedUnitId(newUnit.id);
      showToast(`Đã tạo mục "${newUnit.title}"!`);
    } else if (modalType === 'LESSON') {
      const newLesson: LessonItem = { id: `l_${Date.now()}`, title: inputTitle, pages: [], sections: [], answerPages: [] };
      setUnits(prev => prev.map(u => u.id === selectedUnitId ? { ...u, lessons: [...u.lessons, newLesson] } : u));
      setSelectedLessonId(newLesson.id);
      showToast(`Đã tạo bài học "${inputTitle}"!`);
    } else if (modalType === 'LESSON_PAGE') {
      const newPage: LessonPage = { id: `p_${Date.now()}`, name: inputTitle, imageUrl: inputImageUrl };
      setUnits(prev => prev.map(u => u.id === selectedUnitId ? {
        ...u, lessons: u.lessons.map(l => l.id === selectedLessonId ? { ...l, pages: [...l.pages, newPage] } : l)
      } : u));
      showToast(`Đã thêm trang ảnh bài học!`);
    } else if (modalType === 'ANSWER_PAGE') {
      const newPage: LessonPage = { id: `ap_${Date.now()}`, name: inputTitle, imageUrl: inputImageUrl };
      setUnits(prev => prev.map(u => u.id === selectedUnitId ? {
        ...u, lessons: u.lessons.map(l => l.id === selectedLessonId ? { ...l, answerPages: [...(l.answerPages || []), newPage] } : l)
      } : u));
      showToast(`Đã thêm trang ảnh đáp án!`);
    }

    setModalType(null);
    setInputTitle('');
    setInputImageUrl('');
  };

  const handleConfirmDelete = () => {
    if (!deletingItem) return;
    const { id, type, name } = deletingItem;

    if (type === 'PAGE_INTRO') setIntroPages(prev => prev.filter(p => p.id !== id));
    else if (type === 'PAGE_OUTRO') setOutroPages(prev => prev.filter(p => p.id !== id));
    else if (type === 'UNIT') {
      const filtered = units.filter(u => u.id !== id);
      setUnits(filtered);
      if (filtered.length > 0) setSelectedUnitId(filtered[0].id);
    } else if (type === 'LESSON') {
      setUnits(prev => prev.map(u => u.id === selectedUnitId ? { ...u, lessons: u.lessons.filter(l => l.id !== id) } : u));
    } else if (type === 'SECTION') {
      setUnits(prev => prev.map(u => u.id === selectedUnitId ? {
        ...u, lessons: u.lessons.map(l => l.id === selectedLessonId ? { ...l, sections: l.sections.filter(s => s.id !== id) } : l)
      } : u));
    } else if (type === 'ANSWER_PAGE') {
      setUnits(prev => prev.map(u => u.id === selectedUnitId ? {
        ...u, lessons: u.lessons.map(l => l.id === selectedLessonId ? { ...l, answerPages: l.answerPages.filter(a => a.id !== id) } : l)
      } : u));
    }

    showToast(`Đã xóa "${name}" thành công!`);
    setDeletingItem(null);
  };

  return (
    <div className="space-y-5 p-4 bg-slate-50 min-h-screen text-xs">

      {/* Header & Top Tab Switcher */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Quản Lý Nội Dung SGK Tiếng Anh 6 - Tập 1</h1>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-lg gap-1 border border-slate-200">
          <button onClick={() => setActiveTab('INTRO')} className={`px-4 py-2 rounded-md font-bold ${activeTab === 'INTRO' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}>Mở Đầu</button>
          <button onClick={() => setActiveTab('UNITS')} className={`px-4 py-2 rounded-md font-bold ${activeTab === 'UNITS' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}>Các Unit Học Chính</button>
          <button onClick={() => setActiveTab('OUTRO')} className={`px-4 py-2 rounded-md font-bold ${activeTab === 'OUTRO' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}>Kết Thúc</button>
        </div>
      </div>

      {/* TAB 1: MỞ ĐẦU */}
      {activeTab === 'INTRO' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
          <div className="flex justify-between items-center border-b pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Các Trang Ảnh Mở Đầu</h2>
            </div>
            <button
              onClick={() => { setInputTitle(''); setInputImageUrl(''); setModalType('PAGE_INTRO'); }}
              className="px-3.5 py-2 bg-slate-900 text-white text-xs font-semibold rounded-md hover:bg-slate-800 flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Thêm Trang Mở Đầu
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            {introPages.map((page, idx) => (
              <div key={page.id} className="border border-slate-200 rounded-lg p-3 bg-slate-50 space-y-2 flex flex-col justify-between hover:border-blue-300 transition-all">
                <div>
                  <div className="aspect-[3/4] bg-slate-200 rounded-md overflow-hidden flex items-center justify-center border text-slate-400 font-mono mb-2">
                    {page.imageUrl ? (
                      <img src={page.imageUrl} alt={page.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>[ Trang Ảnh {idx + 1} ]</span>
                    )}
                  </div>
                  <h4 className="font-bold text-slate-800 line-clamp-2">{page.name}</h4>
                </div>
                <div className="flex justify-end pt-2 border-t border-slate-200">
                  <button onClick={() => setDeletingItem({ id: page.id, type: 'PAGE_INTRO', name: page.name })} className="p-1 hover:bg-red-50 rounded text-red-600">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: CÁC UNIT HỌC CHÍNH */}
      {activeTab === 'UNITS' && (
        <div className="grid grid-cols-12 gap-4 min-h-[600px]">

          {/* CỘT 1: Danh mục / Unit */}
          <div className="col-span-12 md:col-span-3 bg-white border border-slate-200 rounded-xl p-3 space-y-2 shadow-sm">
            <div className="flex justify-between items-center px-1 pb-2 border-b">
              <span className="font-bold text-slate-400 uppercase">1. Danh Mục / Unit</span>
              <button onClick={() => { setInputTitle(''); setModalType('UNIT'); }} className="text-blue-600 font-bold flex items-center gap-0.5"><Plus className="w-3.5 h-3.5" /> Tạo Mục</button>
            </div>
            <div className="space-y-1.5">
              {units.map((u) => (
                <div key={u.id} onClick={() => { setSelectedUnitId(u.id); if (u.lessons.length > 0) setSelectedLessonId(u.lessons[0].id); }} className={`p-3 rounded-lg cursor-pointer border flex justify-between items-center ${selectedUnitId === u.id ? 'bg-slate-900 text-white font-semibold' : 'bg-white text-slate-700'}`}>
                  <div>
                    <div className="font-bold text-sm">{u.title}</div>
                    <div className={`text-[11px] mt-0.5 ${selectedUnitId === u.id ? 'text-slate-300' : 'text-slate-500'}`}>{u.lessons.length} bài học</div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setDeletingItem({ id: u.id, type: 'UNIT', name: u.title }); }} className="p-1 text-slate-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              ))}
            </div>
          </div>

          {/* CỘT 2: Bài học */}
          <div className="col-span-12 md:col-span-4 lg:col-span-3 bg-white border border-slate-200 rounded-xl p-3 space-y-2 shadow-sm">
            <div className="flex justify-between items-center px-1 pb-2 border-b">
              <span className="font-bold text-slate-400 uppercase truncate">2. Bài học ({currentUnit?.title})</span>
              <button onClick={() => { setInputTitle(''); setModalType('LESSON'); }} className="text-blue-600 font-bold flex items-center gap-0.5"><Plus className="w-3.5 h-3.5" /> Tạo Bài</button>
            </div>
            <div className="space-y-1.5">
              {currentUnit?.lessons?.map((l) => (
                <div key={l.id} onClick={() => setSelectedLessonId(l.id)} className={`p-3 rounded-lg cursor-pointer border flex justify-between items-center ${selectedLessonId === l.id ? 'bg-blue-50 border-blue-400 text-blue-950 font-semibold' : 'bg-white text-slate-700'}`}>
                  <div className="font-bold text-xs">{l.title}</div>
                  <button onClick={(e) => { e.stopPropagation(); setDeletingItem({ id: l.id, type: 'LESSON', name: l.title }); }} className="p-1 text-slate-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              ))}
            </div>
          </div>

          {/* CỘT 3: KHUNG NỘI DUNG CHÍNH */}
          <div className="col-span-12 md:col-span-5 lg:col-span-6 bg-white border border-slate-200 rounded-xl p-4 space-y-4 shadow-sm flex flex-col">
            {currentLesson ? (
              <>
                <div className="border-b pb-3 space-y-3">
                  <div>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono font-bold">{currentUnit.title}</span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{currentLesson.title}</h3>
                  </div>

                  <div className="flex bg-slate-100 p-1 rounded-lg gap-1 border border-slate-200">
                    <button onClick={() => setRightTab('LESSON_CONTENT')} className={`flex-1 py-1.5 rounded-md font-bold ${rightTab === 'LESSON_CONTENT' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}>Nội dung Bài Học</button>
                    <button onClick={() => setRightTab('ANSWERS_TRANSLATION')} className={`flex-1 py-1.5 rounded-md font-bold ${rightTab === 'ANSWERS_TRANSLATION' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}>Đáp Án & Bản Dịch</button>
                  </div>
                </div>

                {/* TAB NỘI DUNG BÀI HỌC */}
                {rightTab === 'LESSON_CONTENT' && (
                  <div className="space-y-4 flex-1">

                    {/* Trang ảnh SGK */}
                    <div className="space-y-2 border p-3 rounded-lg bg-slate-50">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-700">Trang Ảnh Thuộc Bài Học</span>
                        <button onClick={() => { setInputTitle(''); setInputImageUrl(''); setModalType('LESSON_PAGE'); }} className="px-2.5 py-1 bg-white border border-slate-300 text-slate-700 rounded hover:bg-slate-100 font-medium">+ Upload Trang Ảnh</button>
                      </div>
                      <div className="flex gap-2 overflow-x-auto py-1">
                        {currentLesson.pages.map((pg) => (
                          <div key={pg.id} className="bg-white border rounded p-2 text-center min-w-[120px] relative group">
                            <div className="h-16 bg-slate-100 rounded border flex items-center justify-center text-[10px] text-slate-400 font-mono mb-1">{pg.name}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* DANH SÁCH MỤC BÀI HỌC */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Các Mục Bài Học & Bài Tập</h4>
                          <p className="text-slate-500 text-[11px]">Gắn File MP3, Ảnh minh họa và Soạn câu hỏi tương tác</p>
                        </div>
                        <button
                          onClick={() => {
                            setInputTitle('');
                            setSelectType('TRUE_FALSE');
                            setAudioUrlInput('');
                            setSectionImageUrlInput('');
                            setWordBoxInput('');
                            setModalType('SECTION');
                          }}
                          className="px-3 py-1.5 bg-slate-900 text-white rounded font-semibold hover:bg-slate-800 flex items-center gap-1 shadow-sm"
                        >
                          <Plus className="w-3.5 h-3.5" /> Thêm Mục Bài Học
                        </button>
                      </div>

                      <div className="space-y-3">
                        {currentLesson.sections.map((sec) => (
                          <div key={sec.id} className="p-3.5 border border-slate-200 rounded-lg bg-white space-y-2.5 hover:border-slate-300 transition-all shadow-sm">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-sm text-slate-900">{sec.name}</span>
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-slate-100 text-slate-800">{sec.type}</span>
                                <button onClick={() => setDeletingItem({ id: sec.id, type: 'SECTION', name: sec.name })} className="text-slate-400 hover:text-red-600 p-1 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 text-[11px]">
                              {sec.fileUrl && (
                                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded font-mono">
                                  <Volume2 className="w-3 h-3 text-amber-600" /> {sec.fileUrl}
                                </span>
                              )}
                              {sec.imageUrl && (
                                <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded font-mono">
                                  <ImageIcon className="w-3 h-3 text-blue-600" /> [Có ảnh minh họa]
                                </span>
                              )}
                              {sec.wordBox && (
                                <span className="bg-sky-50 text-sky-900 border border-sky-200 px-2 py-0.5 rounded font-mono">
                                  Word Box: [{sec.wordBox}]
                                </span>
                              )}
                            </div>

                            <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded border border-slate-200 text-xs">
                              <div className="text-slate-700 font-medium">
                                Danh sách: <strong>{sec.questions?.length || 0}</strong> câu hỏi & đáp án
                              </div>
                              <button
                                onClick={() => handleOpenQuestionBuilder(sec)}
                                className="px-3 py-1 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Soạn danh sách câu hỏi</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

                {/* TAB ĐÁP ÁN & BẢN DỊCH */}
                {rightTab === 'ANSWERS_TRANSLATION' && (
                  <div className="space-y-4 flex-1">

                    <div className="space-y-2 border p-3 rounded-lg bg-emerald-50/50 border-emerald-200">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                          <ImageIcon className="w-4 h-4 text-emerald-600" /> Trang Ảnh Sách Giải / Đáp Án Đính Kèm
                        </span>
                        <button
                          onClick={() => { setInputTitle(''); setInputImageUrl(''); setModalType('ANSWER_PAGE'); }}
                          className="px-2.5 py-1 bg-white border border-emerald-300 text-emerald-800 rounded hover:bg-emerald-100 font-medium shadow-sm"
                        >
                          + Upload Ảnh Đáp Án
                        </button>
                      </div>

                      <div className="flex gap-2 overflow-x-auto py-1">
                        {currentLesson.answerPages?.map((apg) => (
                          <div key={apg.id} className="bg-white border border-emerald-200 rounded p-2 text-center min-w-[130px] shadow-sm relative group">
                            <div className="h-20 bg-slate-100 rounded border flex items-center justify-center text-[10px] text-slate-400 font-mono mb-1 overflow-hidden">
                              {apg.imageUrl ? <img src={apg.imageUrl} alt={apg.name} className="w-full h-full object-cover" /> : '[ Ảnh Đáp Án ]'}
                            </div>
                            <div className="font-bold text-[11px] text-slate-800 truncate">{apg.name}</div>
                            <button onClick={() => setDeletingItem({ id: apg.id, type: 'ANSWER_PAGE', name: apg.name })} className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        {(!currentLesson.answerPages || currentLesson.answerPages.length === 0) && (
                          <div className="text-slate-400 italic py-2">Chưa có ảnh đáp án nào. Bấm nút "+" để thêm.</div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 border p-3 rounded-lg bg-slate-50">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-800">Bản Dịch Bài Học & Ghi Chú Giải Thích</span>
                      </div>
                      <textarea
                        rows={8}
                        value={translationText}
                        onChange={(e) => setTranslationText(e.target.value)}
                        placeholder="Soạn thảo lời dịch tiếng Việt hoặc hướng dẫn giải chi tiết tại đây..."
                        className="w-full p-3 bg-white border rounded text-xs leading-relaxed focus:outline-none focus:border-blue-400 text-slate-800"
                      />
                    </div>

                  </div>
                )}
              </>
            ) : (
              <div className="p-8 text-center text-slate-400">Vui lòng chọn một bài học.</div>
            )}
          </div>

        </div>
      )}

      {/* TAB 3: KẾT THÚC */}
      {activeTab === 'OUTRO' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
          <div className="flex justify-between items-center border-b pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Các Trang Ảnh Kết Thúc</h2>
            </div>
            <button
              onClick={() => { setInputTitle(''); setInputImageUrl(''); setModalType('PAGE_OUTRO'); }}
              className="px-3.5 py-2 bg-slate-900 text-white text-xs font-semibold rounded-md hover:bg-slate-800 flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Thêm Trang Kết Thúc
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            {outroPages.map((page, idx) => (
              <div key={page.id} className="border border-slate-200 rounded-lg p-3 bg-slate-50 space-y-2 flex flex-col justify-between hover:border-blue-300 transition-all">
                <div>
                  <div className="aspect-[3/4] bg-slate-200 rounded-md overflow-hidden flex items-center justify-center border text-slate-400 font-mono mb-2">
                    {page.imageUrl ? (
                      <img src={page.imageUrl} alt={page.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>[ Trang Ảnh {idx + 1} ]</span>
                    )}
                  </div>
                  <h4 className="font-bold text-slate-800 line-clamp-2">{page.name}</h4>
                </div>
                <div className="flex justify-end pt-2 border-t border-slate-200">
                  <button onClick={() => setDeletingItem({ id: page.id, type: 'PAGE_OUTRO', name: page.name })} className="p-1 hover:bg-red-50 rounded text-red-600">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toastMessage && createPortal(
        <div className="fixed bottom-5 right-5 z-[10000] flex items-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-lg shadow-xl text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>,
        document.body
      )}

      {/* MODAL 1: SOẠN CÂU HỎI */}
      {modalType === 'QUESTION_BUILDER' && editingSection && createPortal(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in fade-in max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b pb-3 flex-shrink-0">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Soạn Danh Sách Câu Hỏi ({tempQuestions.length} câu)</h3>
                <p className="text-xs text-slate-500">Mục: <strong>{editingSection.name}</strong> ({editingSection.type})</p>
              </div>
              <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-slate-700"><X className="w-4 h-4" /></button>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto pr-1">

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">File MP3 bài nghe (nếu có):</label>
                  <input
                    type="text"
                    value={audioUrlInput}
                    onChange={(e) => setAudioUrlInput(e.target.value)}
                    placeholder="track_02.mp3"
                    className="w-full px-2.5 py-1.5 bg-white border rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">URL Ảnh minh họa (nếu có):</label>
                  <input
                    type="text"
                    value={sectionImageUrlInput}
                    onChange={(e) => setSectionImageUrlInput(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-2.5 py-1.5 bg-white border rounded"
                  />
                </div>
              </div>

              {['FILL_BLANK', 'LISTEN_FILL'].includes(editingSection.type) && (
                <div className="p-3 bg-sky-50/70 border border-sky-200 rounded-lg space-y-1">
                  <label className="block font-semibold text-sky-900 text-xs">Khung từ vựng gợi ý (Word Box):</label>
                  <input
                    type="text"
                    value={wordBoxInput}
                    onChange={(e) => setWordBoxInput(e.target.value)}
                    placeholder="Cách nhau bởi dấu phẩy: go, subjects, has, wear..."
                    className="w-full px-3 py-1.5 bg-white border border-sky-300 rounded text-xs font-mono"
                  />
                </div>
              )}

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
                <div className="font-semibold text-slate-800 text-xs">Thêm câu hỏi số {tempQuestions.length + 1}:</div>
                <input
                  type="text"
                  value={newQText}
                  onChange={(e) => setNewQText(e.target.value)}
                  placeholder="Nhập nội dung vế câu hỏi / đề bài..."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded text-xs focus:outline-none focus:border-slate-400"
                />

                {editingSection.type === 'MULTIPLE_CHOICE' && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" value={newOptA} onChange={(e) => setNewOptA(e.target.value)} placeholder="Đáp án A..." className="px-2.5 py-1 bg-white border rounded" />
                      <input type="text" value={newOptB} onChange={(e) => setNewOptB(e.target.value)} placeholder="Đáp án B..." className="px-2.5 py-1 bg-white border rounded" />
                      <input type="text" value={newOptC} onChange={(e) => setNewOptC(e.target.value)} placeholder="Đáp án C..." className="px-2.5 py-1 bg-white border rounded" />
                      <input type="text" value={newOptD} onChange={(e) => setNewOptD(e.target.value)} placeholder="Đáp án D..." className="px-2.5 py-1 bg-white border rounded" />
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="font-semibold text-slate-700">Chọn đáp án đúng:</span>
                      <input type="text" value={newQCorrect} onChange={(e) => setNewQCorrect(e.target.value)} placeholder="Nhập chữ/từ đáp án đúng..." className="flex-1 px-2.5 py-1 bg-white border rounded font-semibold text-emerald-800" />
                    </div>
                  </div>
                )}

                {editingSection.type === 'MATCHING' && (
                  <div className="flex gap-2 items-center">
                    <span className="font-semibold text-slate-700">Nối với Vế B tương ứng:</span>
                    <input type="text" value={newMatchTarget} onChange={(e) => setNewMatchTarget(e.target.value)} placeholder="Vế B nối với vế A..." className="flex-1 px-2.5 py-1 bg-white border rounded" />
                  </div>
                )}

                {editingSection.type === 'TRUE_FALSE' && (
                  <div className="flex gap-2 items-center">
                    <span className="font-semibold text-slate-700">Đáp án chuẩn:</span>
                    <select value={newQCorrect} onChange={(e) => setNewQCorrect(e.target.value)} className="px-3 py-1 bg-white border rounded font-bold">
                      <option value="True">True (Đúng)</option>
                      <option value="False">False (Sai)</option>
                    </select>
                  </div>
                )}

                {['FILL_BLANK', 'LISTEN_FILL', 'WRITING', 'LISTEN_SPEAK'].includes(editingSection.type) && (
                  <div className="flex gap-2 items-center">
                    <span className="font-semibold text-slate-700">Từ đáp án chuẩn:</span>
                    <input type="text" value={newQCorrect} onChange={(e) => setNewQCorrect(e.target.value)} placeholder="Nhập đáp án chuẩn..." className="flex-1 px-2.5 py-1 bg-white border rounded font-mono font-bold text-emerald-800" />
                  </div>
                )}

                <div className="flex justify-end pt-1">
                  <button type="button" onClick={handleAddQuestion} className="px-4 py-1.5 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800 flex items-center gap-1 shadow-sm">
                    <Plus className="w-3.5 h-3.5" /> Thêm câu này
                  </button>
                </div>
              </div>

              {/* BẢNG DANH SÁCH CÂU HỎI (ĐÃ SỬA CỘT ĐÁP ÁN THÀNH SELECT CHUẨN CHO TRUE/FALSE VÀ TEXT CHO CÁC LOẠI KHÁC) */}
              <div className="space-y-2">
                <div className="font-semibold text-slate-800 text-xs">Danh sách câu hỏi bài tập hiện tại:</div>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                        <th className="p-2.5 w-12 text-center">STT</th>
                        <th className="p-2.5">Nội dung câu hỏi</th>
                        <th className="p-2.5 w-44">Đáp án chuẩn</th>
                        <th className="p-2.5 w-10 text-center">Xóa</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {tempQuestions.map((q) => (
                        <tr key={q.id} className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold text-center text-slate-600">{q.questionNumber}.</td>
                          <td className="p-2.5">
                            <input
                              type="text"
                              value={q.questionText}
                              onChange={(e) => handleUpdateQuestionInTable(q.id, 'questionText', e.target.value)}
                              className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 px-1 py-1 text-xs text-slate-900 font-medium"
                            />
                          </td>
                          <td className="p-2.5">
                            {editingSection.type === 'TRUE_FALSE' ? (
                              <select
                                value={q.correctAnswer}
                                onChange={(e) => handleUpdateQuestionInTable(q.id, 'correctAnswer', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-semibold text-slate-800"
                              >
                                <option value="True">True</option>
                                <option value="False">False</option>
                              </select>
                            ) : (
                              <input
                                type="text"
                                value={q.correctAnswer}
                                onChange={(e) => handleUpdateQuestionInTable(q.id, 'correctAnswer', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-mono font-semibold text-emerald-800"
                              />
                            )}
                          </td>
                          <td className="p-2.5 text-center">
                            <button onClick={() => handleRemoveQuestion(q.id)} className="text-slate-400 hover:text-red-600 p-1">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {tempQuestions.length === 0 && (
                    <div className="p-6 text-center text-slate-400 italic">Chưa có câu hỏi nào.</div>
                  )}
                </div>
              </div>

            </div>

            <div className="flex justify-end gap-2 pt-3 border-t flex-shrink-0">
              <button onClick={() => setModalType(null)} className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md">Hủy bỏ</button>
              <button type="button" onClick={handleSaveQuestionBuilder} className="px-4 py-1.5 text-xs bg-slate-900 text-white rounded-md font-semibold hover:bg-slate-800 shadow-sm">
                Lưu Danh Sách
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL 2: TẠO MỤC BÀI TẬP HOẶC TRANG SÁCH */}
      {['SECTION', 'PAGE_INTRO', 'PAGE_OUTRO', 'UNIT', 'LESSON', 'LESSON_PAGE', 'ANSWER_PAGE'].includes(modalType || '') && createPortal(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-semibold text-slate-900">
                {modalType === 'SECTION' && 'Tạo Mục Bài Tập Mới'}
                {modalType === 'PAGE_INTRO' && 'Thêm Trang Mở Đầu Mới'}
                {modalType === 'PAGE_OUTRO' && 'Thêm Trang Kết Thúc Mới'}
                {modalType === 'ANSWER_PAGE' && 'Upload Trang Ảnh Đáp Án Mới'}
                {modalType === 'UNIT' && 'Tạo Danh Mục / Unit Mới'}
                {modalType === 'LESSON' && 'Tạo Bài Học Mới'}
                {modalType === 'LESSON_PAGE' && 'Upload Trang Ảnh SGK'}
              </h3>
              <button onClick={() => setModalType(null)} className="text-slate-400"><X className="w-4 h-4" /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Tên / Tiêu đề:</label>
                <input
                  type="text"
                  value={inputTitle}
                  onChange={(e) => setInputTitle(e.target.value)}
                  placeholder="Nhập tên tiêu đề..."
                  className="w-full px-3 py-1.5 bg-slate-50 border rounded text-slate-900 font-semibold focus:outline-none"
                  autoFocus
                />
              </div>

              {['PAGE_INTRO', 'PAGE_OUTRO', 'LESSON_PAGE', 'ANSWER_PAGE'].includes(modalType || '') && (
                <div>
                  <label className="block text-slate-700 font-medium mb-1">URL Đường dẫn ảnh (Tùy chọn):</label>
                  <input
                    type="text"
                    value={inputImageUrl}
                    onChange={(e) => setInputImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-1.5 bg-slate-50 border rounded text-slate-800 text-xs focus:outline-none"
                  />
                </div>
              )}

              {modalType === 'SECTION' && (
                <>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Loại bài tập tương tác:</label>
                    <select
                      value={selectType}
                      onChange={(e) => setSelectType(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 bg-white border rounded text-slate-900 font-medium focus:outline-none"
                    >
                      <option value="TRUE_FALSE">1. Bài tập True / False (Đúng / Sai)</option>
                      <option value="FILL_BLANK">2. Bài tập Điền từ vào chỗ trống</option>
                      <option value="LISTEN_FILL">3. Bài tập Vừa nghe vừa điền từ</option>
                      <option value="MULTIPLE_CHOICE">4. Bài tập Trắc nghiệm (A, B, C, D)</option>
                      <option value="MATCHING">5. Bài tập Nối vế A với vế B</option>
                      <option value="LISTEN_SPEAK">6. Bài tập Nghe & Nói (Phát âm / Ghi âm)</option>
                      <option value="WRITING">7. Bài tập Viết / Tự luận ngắn</option>
                      <option value="AUDIO_ONLY">8. Chỉ phát File Nghe MP3</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">File MP3 bài nghe (Tùy chọn):</label>
                    <input
                      type="text"
                      value={audioUrlInput}
                      onChange={(e) => setAudioUrlInput(e.target.value)}
                      placeholder="Ví dụ: track_03.mp3"
                      className="w-full px-3 py-1.5 bg-slate-50 border rounded font-mono"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button onClick={() => setModalType(null)} className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md">Hủy bỏ</button>
              <button onClick={modalType === 'SECTION' ? handleCreateSection : handleSaveModal} className="px-3.5 py-1.5 text-xs bg-slate-900 text-white rounded-md font-medium">Lưu lại</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL XÁC NHẬN XÓA */}
      {deletingItem && createPortal(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0"><AlertTriangle className="w-5 h-5" /></div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Xác nhận xóa danh mục</h3>
                <p className="text-xs text-slate-500">Hành động này không thể hoàn tác.</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t">
              <button onClick={() => setDeletingItem(null)} className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md">Hủy</button>
              <button onClick={handleConfirmDelete} className="px-3.5 py-1.5 text-xs bg-red-600 text-white rounded-md font-medium">Xóa ngay</button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};