import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Plus, Users, UserCheck, Trash2, X, AlertTriangle, CheckCircle2, UserPlus, FileSpreadsheet, Calendar
} from 'lucide-react';

// Dữ liệu mẫu tĩnh Danh sách Giáo viên
const initialTeachers = [
  { id: 't1', name: 'ThS. Nguyễn Mạnh Hùng' },
  { id: 't2', name: 'Cô Trần Thị Hương' },
  { id: 't3', name: 'Thầy Lê Văn Nam' },
  { id: 't4', name: 'TS. Nguyễn Hà Giang' },
  { id: 't5', name: 'ThS. Hoàng Trọng Nghĩa' },
];

// Dữ liệu mẫu Lớp học Tiếng Anh 6 chuẩn DB
const initialClassrooms = [
  {
    id: 'c1',
    name: '6A1',
    school_year: '2026-2027',
    teacher_id: 't1',
    created_at: '2026-09-01T08:00:00Z',
    students: [
      { id: 's1', code: 'HS001', name: 'Nguyễn Văn An', email: 'an.nv@student.hutech.edu.vn' },
      { id: 's2', code: 'HS002', name: 'Trần Thị Mai', email: 'mai.tt@student.hutech.edu.vn' },
      { id: 's3', code: 'HS003', name: 'Lê Hoàng Nam', email: 'nam.lh@student.hutech.edu.vn' },
    ],
  },
  {
    id: 'c2',
    name: '6A2',
    school_year: '2026-2027',
    teacher_id: 't2',
    created_at: '2026-09-01T08:30:00Z',
    students: [
      { id: 's4', code: 'HS004', name: 'Phạm Bảo Lâm', email: 'lam.pb@student.hutech.edu.vn' },
      { id: 's5', code: 'HS005', name: 'Vũ Ngọc Anh', email: 'anh.vn@student.hutech.edu.vn' },
    ],
  },
  {
    id: 'c3',
    name: '6A3',
    school_year: '2026-2027',
    teacher_id: 't3',
    created_at: '2026-09-02T09:00:00Z',
    students: [
      { id: 's6', code: 'HS006', name: 'Đặng Quốc Huy', email: 'huy.dq@student.hutech.edu.vn' },
    ],
  },
  {
    id: 'c4',
    name: '6A4',
    school_year: '2026-2027',
    teacher_id: null,
    created_at: '2026-09-03T10:00:00Z',
    students: [],
  },
];

export const ClassListPage: React.FC = () => {
  const [classrooms, setClassrooms] = useState<any[]>(initialClassrooms);
  const [teachers] = useState<any[]>(initialTeachers);

  // State Bộ lọc Năm học bên ngoài
  const [selectedSchoolYearFilter, setSelectedSchoolYearFilter] = useState<string>('2026-2027');

  // State Modals
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [deletingClass, setDeletingClass] = useState<any>(null);

  // State Form Thêm Lớp Học Mới
  const [formName, setFormName] = useState<string>('');
  const [formSchoolYear, setFormSchoolYear] = useState<string>('2026-2027'); // Tự nhập tay năm học
  const [formTeacherId, setFormTeacherId] = useState<string>('');
  const [addStudentMethod, setAddStudentMethod] = useState<'MANUAL' | 'EXCEL'>('MANUAL');
  const [manualStudentName, setManualStudentName] = useState<string>('');
  const [manualStudentEmail, setManualStudentEmail] = useState<string>('');
  const [tempStudents, setTempStudents] = useState<any[]>([]);

  // State Thêm HS trực tiếp vào lớp đang xem chi tiết
  const [inDetailAddName, setInDetailAddName] = useState<string>('');
  const [inDetailAddEmail, setInDetailAddEmail] = useState<string>('');
  const [showInDetailAddForm, setShowInDetailAddForm] = useState<boolean>(false);

  // State Đổi GVCN trong modal chi tiết
  const [isEditingTeacherInDetail, setIsEditingTeacherInDetail] = useState<boolean>(false);
  const [selectedTeacherIdInDetail, setSelectedTeacherIdInDetail] = useState<string>('');

  // State Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Helper lấy tên GVCN theo teacher_id
  const getTeacherName = (teacherId: string | null) => {
    if (!teacherId) return null;
    const teacher = teachers.find((t) => t.id === teacherId);
    return teacher ? teacher.name : null;
  };

  // Thêm học sinh tạm thời vào form Tạo Lớp
  const handleAddTempStudent = () => {
    if (!manualStudentName) return;
    setTempStudents((prev: any[]) => [
      ...prev,
      {
        name: manualStudentName,
        email: manualStudentEmail || `${manualStudentName.toLowerCase().replace(/\s+/g, '')}@student.hutech.edu.vn`,
      },
    ]);
    setManualStudentName('');
    setManualStudentEmail('');
  };

  // Tạo Lớp Học Mới
  const handleCreateClass = () => {
    if (!formName) return;

    const newClassroomObj = {
      id: `c-${Date.now()}`,
      name: formName,
      school_year: formSchoolYear.trim() || '2026-2027',
      teacher_id: formTeacherId || null,
      created_at: new Date().toISOString(),
      students: tempStudents.map((s: any, idx: number) => ({
        id: `s-${Date.now()}-${idx}`,
        code: `HS${(idx + 100).toString()}`,
        name: s.name,
        email: s.email,
      })),
    };

    setClassrooms((prev: any[]) => [newClassroomObj, ...prev]);
    setShowAddModal(false);
    showToast(`Đã tạo lớp "${formName}" (${formSchoolYear}) thành công!`);

    // Reset Form
    setFormName('');
    setFormSchoolYear('2026-2027');
    setFormTeacherId('');
    setTempStudents([]);
  };

  // Đổi GVCN trực tiếp từ Modal Chi Tiết
  const handleSaveTeacherInDetail = () => {
    if (!selectedClass) return;

    const newTeacherId = selectedTeacherIdInDetail || null;
    setClassrooms((prev: any[]) =>
      prev.map((c: any) => (c.id === selectedClass.id ? { ...c, teacher_id: newTeacherId } : c))
    );
    setSelectedClass({ ...selectedClass, teacher_id: newTeacherId });
    setIsEditingTeacherInDetail(false);
    showToast(`Đã cập nhật Giáo viên chủ nhiệm thành công!`);
  };

  // Thêm HS trực tiếp khi đang Xem Chi Tiết Lớp
  const handleAddStudentToCurrentClass = () => {
    if (!selectedClass || !inDetailAddName) return;

    const newStudent = {
      id: `s-${Date.now()}`,
      code: `HS${Math.floor(100 + Math.random() * 900)}`,
      name: inDetailAddName,
      email: inDetailAddEmail || `${inDetailAddName.toLowerCase().replace(/\s+/g, '')}@student.hutech.edu.vn`,
    };

    const updatedStudents = [...selectedClass.students, newStudent];

    setClassrooms((prev: any[]) =>
      prev.map((c: any) => (c.id === selectedClass.id ? { ...c, students: updatedStudents } : c))
    );
    setSelectedClass({ ...selectedClass, students: updatedStudents });
    showToast(`Đã thêm học sinh "${inDetailAddName}" vào lớp!`);
    setInDetailAddName('');
    setInDetailAddEmail('');
    setShowInDetailAddForm(false);
  };

  // Xóa HS khỏi Lớp đang xem
  const handleRemoveStudentFromClass = (studentId: string, studentName: string) => {
    if (!selectedClass) return;

    const updatedStudents = selectedClass.students.filter((s: any) => s.id !== studentId);

    setClassrooms((prev: any[]) =>
      prev.map((c: any) => (c.id === selectedClass.id ? { ...c, students: updatedStudents } : c))
    );
    setSelectedClass({ ...selectedClass, students: updatedStudents });
    showToast(`Đã xóa học sinh "${studentName}" khỏi lớp!`);
  };

  // Xóa Lớp học
  const handleConfirmDeleteClass = () => {
    if (!deletingClass) return;
    setClassrooms((prev: any[]) => prev.filter((c: any) => c.id !== deletingClass.id));
    showToast(`Đã xóa lớp "${deletingClass.name}" thành công!`);
    setDeletingClass(null);
  };

  // Lọc danh sách lớp học theo Năm học
  const filteredClassrooms = classrooms.filter((c: any) => {
    return selectedSchoolYearFilter ? c.school_year === selectedSchoolYearFilter : true;
  });

  return (
    <div className="space-y-6">

      {/* Page Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Quản lý Lớp học Tiếng Anh 6
          </h1>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors shadow-sm whitespace-nowrap"
        >
          <Plus className="w-4 h-4 stroke-[2]" />
          <span>Tạo lớp học mới</span>
        </button>
      </div>

      {/* Thanh bộ lọc Năm học ở ngoài (Giữ nguyên gọn gàng) */}
      <div className="bg-white border border-slate-200/80 rounded-lg p-3.5 shadow-sm flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span className="font-medium text-slate-700">Năm học:</span>
          <select
            value={selectedSchoolYearFilter}
            onChange={(e) => setSelectedSchoolYearFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 font-semibold focus:outline-none focus:border-slate-400"
          >
            <option value="2026-2027">2026 - 2027</option>
          </select>
        </div>

        <div className="text-slate-500 text-[11px]">
          Tổng số: <strong>{filteredClassrooms.length}</strong> lớp học
        </div>
      </div>

      {/* Grid danh sách card Lớp học */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredClassrooms.map((c: any) => {
          const teacherName = getTeacherName(c.teacher_id);
          return (
            <div
              key={c.id}
              className="bg-white border border-slate-200/80 rounded-lg p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4 hover:shadow-md transition-all group relative"
            >
              {/* Header Card */}
              <div className="flex items-center justify-between">
                <span
                  onClick={() => {
                    setSelectedClass(c);
                    setIsEditingTeacherInDetail(false);
                  }}
                  className="font-bold text-base text-slate-900 hover:text-blue-600 cursor-pointer transition-colors"
                >
                  Lớp {c.name}
                </span>
                <span className="text-[11px] font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {c.school_year}
                </span>
              </div>

              {/* Thông tin Sĩ số & GVCN */}
              <div
                onClick={() => {
                  setSelectedClass(c);
                  setIsEditingTeacherInDetail(false);
                }}
                className="space-y-2 text-xs text-slate-600 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>
                    Sĩ số: <strong className="text-slate-900">{c.students ? c.students.length : 0}</strong> học sinh
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <UserCheck className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate">
                    GVCN:{' '}
                    <strong className={teacherName ? 'text-slate-900' : 'text-amber-600 italic'}>
                      {teacherName || 'Chưa phân công'}
                    </strong>
                  </span>
                </div>
              </div>

              {/* Actions Footer Card */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => {
                    setSelectedClass(c);
                    setIsEditingTeacherInDetail(false);
                  }}
                  className="text-slate-700 hover:text-slate-900 font-medium hover:underline -ml-1 py-0.5 px-1"
                >
                  Xem chi tiết
                </button>
                <button
                  onClick={() => setDeletingClass(c)}
                  className="text-red-600 hover:text-red-700 font-semibold hover:bg-red-50 px-2 py-0.5 rounded transition-colors"
                >
                  Xóa lớp
                </button>
              </div>
            </div>
          );
        })}
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

      {/* MODAL 1: TẠO LỚP HỌC MỚI (NĂM HỌC ĐÃ CHUYỂN SANG 1 Ô NHẬP TAY) */}
      {showAddModal && createPortal(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in fade-in duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-semibold text-slate-900">Tạo Lớp Học Mới</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700 p-1 rounded-md">
                <X className="w-4 h-4 stroke-[1.5]" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Tên lớp</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="6A5"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-400 font-semibold"
                  />
                </div>

                {/* Ô NĂM HỌC CHỈ TỰ NHẬP TAY */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Năm học</label>
                  <input
                    type="text"
                    value={formSchoolYear}
                    onChange={(e) => setFormSchoolYear(e.target.value)}
                    placeholder="2026-2027"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-400 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Gắn Giáo viên chủ nhiệm</label>
                <select
                  value={formTeacherId}
                  onChange={(e) => setFormTeacherId(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-md text-slate-700 focus:outline-none focus:border-slate-400 shadow-sm"
                >
                  <option value="">-- Chọn Giáo viên chủ nhiệm (Có thể chọn sau) --</option>
                  {teachers.map((t: any) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <label className="block text-slate-700 font-medium mb-2">Thêm học sinh ban đầu vào lớp</label>
                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setAddStudentMethod('MANUAL')}
                    className={`flex-1 py-1.5 px-3 rounded text-xs font-medium border transition-all ${addStudentMethod === 'MANUAL'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                  >
                    Thêm từng học sinh
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddStudentMethod('EXCEL')}
                    className={`flex-1 py-1.5 px-3 rounded text-xs font-medium border transition-all ${addStudentMethod === 'EXCEL'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                  >
                    Import từ File Excel
                  </button>
                </div>

                {addStudentMethod === 'MANUAL' ? (
                  <div className="space-y-3 bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={manualStudentName}
                        onChange={(e) => setManualStudentName(e.target.value)}
                        placeholder="Họ và tên HS..."
                        className="px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs focus:outline-none focus:border-slate-400"
                      />
                      <input
                        type="email"
                        value={manualStudentEmail}
                        onChange={(e) => setManualStudentEmail(e.target.value)}
                        placeholder="Email học sinh (Tùy chọn)..."
                        className="px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs focus:outline-none focus:border-slate-400"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddTempStudent}
                      className="w-full py-1.5 text-xs font-medium bg-slate-200 hover:bg-slate-300 text-slate-800 rounded transition-colors inline-flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm vào danh sách tạm</span>
                    </button>

                    {tempStudents.length > 0 && (
                      <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                        <div className="text-[11px] font-semibold text-slate-500 mb-1">
                          Đã thêm ({tempStudents.length} học sinh):
                        </div>
                        {tempStudents.map((s: any, i: number) => (
                          <div key={i} className="flex justify-between items-center text-[11px] bg-white p-1.5 rounded border border-slate-200">
                            <span className="font-medium text-slate-800">{s.name}</span>
                            <span className="text-slate-400 font-mono">{s.email}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 border-2 border-dashed border-slate-200 rounded-lg text-center bg-slate-50 hover:bg-slate-100/50 transition-colors cursor-pointer space-y-2">
                    <FileSpreadsheet className="w-6 h-6 text-slate-400 mx-auto stroke-[1.5]" />
                    <div className="font-medium text-slate-700 text-xs">Tải lên file Excel danh sách học sinh</div>
                    <div className="text-[11px] text-slate-400">Hỗ trợ định dạng .xlsx, .xls</div>
                  </div>
                )}
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
                onClick={handleCreateClass}
                className="px-3.5 py-1.5 text-xs bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors font-medium shadow-sm"
              >
                Tạo lớp học
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL 2: XEM CHI TIẾT LỚP HỌC */}
      {selectedClass && createPortal(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 space-y-5 border border-slate-200 shadow-2xl animate-in fade-in duration-150 max-h-[90vh] flex flex-col">

            <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-slate-900">Lớp {selectedClass.name}</h3>
                  <span className="text-xs bg-slate-100 font-mono text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                    Năm học: {selectedClass.school_year}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  ID: <code className="font-mono text-[11px]">{selectedClass.id}</code> | Ngày tạo: {new Date(selectedClass.created_at).toLocaleDateString('vi-VN')}
                </p>
              </div>
              <button onClick={() => setSelectedClass(null)} className="text-slate-400 hover:text-slate-700 p-1 rounded-md">
                <X className="w-4 h-4 stroke-[1.5]" />
              </button>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100 space-y-3 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-xs">
                  <UserCheck className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  <div>
                    <span className="text-slate-500">Giáo viên chủ nhiệm:</span>{' '}
                    <strong className={selectedClass.teacher_id ? 'text-slate-900' : 'text-amber-600 italic'}>
                      {getTeacherName(selectedClass.teacher_id) || 'Chưa phân công'}
                    </strong>
                  </div>
                </div>

                {!isEditingTeacherInDetail && (
                  <button
                    onClick={() => {
                      setSelectedTeacherIdInDetail(selectedClass.teacher_id || '');
                      setIsEditingTeacherInDetail(true);
                    }}
                    className="px-2.5 py-1 text-xs font-medium bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 rounded transition-colors shadow-sm"
                  >
                    Đổi GVCN
                  </button>
                )}
              </div>

              {isEditingTeacherInDetail && (
                <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60 animate-in fade-in duration-150">
                  <select
                    value={selectedTeacherIdInDetail}
                    onChange={(e) => setSelectedTeacherIdInDetail(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:border-slate-400 shadow-sm"
                  >
                    <option value="">-- Chưa phân công --</option>
                    {teachers.map((t: any) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleSaveTeacherInDetail}
                    className="px-3 py-1.5 text-xs bg-slate-900 text-white font-medium rounded hover:bg-slate-800 transition-colors shadow-sm"
                  >
                    Lưu
                  </button>
                  <button
                    onClick={() => setIsEditingTeacherInDetail(false)}
                    className="px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-200/60 rounded"
                  >
                    Hủy
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between flex-shrink-0">
              <div className="text-xs font-semibold text-slate-900">
                Danh sách Học sinh ({selectedClass.students ? selectedClass.students.length : 0} học sinh)
              </div>
              <button
                onClick={() => setShowInDetailAddForm(!showInDetailAddForm)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-900 text-white rounded hover:bg-slate-800 transition-colors shadow-sm"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{showInDetailAddForm ? 'Đóng form thêm' : 'Thêm học sinh vào lớp'}</span>
              </button>
            </div>

            {showInDetailAddForm && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs flex-shrink-0 animate-in fade-in duration-150">
                <div className="font-semibold text-slate-800">Thêm học sinh mới vào Lớp {selectedClass.name}</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={inDetailAddName}
                    onChange={(e) => setInDetailAddName(e.target.value)}
                    placeholder="Họ và tên học sinh *"
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded text-xs focus:outline-none focus:border-slate-400"
                  />
                  <input
                    type="email"
                    value={inDetailAddEmail}
                    onChange={(e) => setInDetailAddEmail(e.target.value)}
                    placeholder="Email học sinh (Tùy chọn)"
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded text-xs focus:outline-none focus:border-slate-400"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => setShowInDetailAddForm(false)}
                    className="px-3 py-1 text-xs text-slate-600 hover:bg-slate-200/60 rounded"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleAddStudentToCurrentClass}
                    className="px-3 py-1 text-xs bg-slate-900 text-white font-medium rounded hover:bg-slate-800 transition-colors shadow-sm"
                  >
                    Xác nhận thêm
                  </button>
                </div>
              </div>
            )}

            <div className="overflow-y-auto border border-slate-200 rounded-lg flex-1 min-h-[180px]">
              {selectedClass.students && selectedClass.students.length > 0 ? (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider sticky top-0">
                      <th className="py-2.5 px-3.5 w-16">STT</th>
                      <th className="py-2.5 px-3.5 w-24">Mã ID</th>
                      <th className="py-2.5 px-3.5">Họ và tên</th>
                      <th className="py-2.5 px-3.5">Email học sinh</th>
                      <th className="py-2.5 px-3.5 text-right pr-4">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedClass.students.map((s: any, index: number) => (
                      <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-2.5 px-3.5 font-mono text-slate-400">{index + 1}</td>
                        <td className="py-2.5 px-3.5 font-mono text-slate-500 font-medium">{s.code}</td>
                        <td className="py-2.5 px-3.5 font-medium text-slate-900">{s.name}</td>
                        <td className="py-2.5 px-3.5 text-slate-500 font-mono">{s.email}</td>
                        <td className="py-2.5 px-3.5 text-right pr-4">
                          <button
                            onClick={() => handleRemoveStudentFromClass(s.id, s.name)}
                            className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                            title="Xóa khỏi lớp"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Lớp chưa có học sinh nào. Bấm nút <strong>"Thêm học sinh vào lớp"</strong> ở trên để bổ sung.
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100 flex-shrink-0">
              <button
                onClick={() => setSelectedClass(null)}
                className="px-4 py-1.5 text-xs bg-slate-900 text-white font-medium rounded-md hover:bg-slate-800 transition-colors shadow-sm"
              >
                Đóng cửa sổ
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL 3: XÁC NHẬN XÓA LỚP HỌC */}
      {deletingClass && createPortal(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Xác nhận xóa lớp học</h3>
                <p className="text-xs text-slate-500 mt-0.5">Hành động này không thể hoàn tác.</p>
              </div>
            </div>

            <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1">
              <div>Bạn có chắc chắn muốn xóa <strong>Lớp {deletingClass.name}</strong> không?</div>
              <div className="text-[11px] text-slate-400 font-mono">
                Năm học: {deletingClass.school_year}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setDeletingClass(null)}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md transition-colors font-medium"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmDeleteClass}
                className="px-3.5 py-1.5 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium shadow-sm"
              >
                Xóa lớp học
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};