import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, User, Phone, BookOpen, Eye } from 'lucide-react';
import { TeacherStudent, StudentSubmission } from '../../../types/teacher.types';
import { ExamSubmissionModal } from './ExamSubmissionModal';
import { motion, AnimatePresence } from 'framer-motion';

interface StudentDetailModalProps {
  student: TeacherStudent | null;
  onClose: () => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({ student, onClose }) => {
  const [selectedSubmission, setSelectedSubmission] = useState<StudentSubmission | null>(null);

  if (!student) return null;

  const words = student.name.trim().split(' ');
  const initials =
    words.length >= 2
      ? (words[words.length - 2][0] + words[words.length - 1][0]).toUpperCase()
      : student.name.slice(0, 2).toUpperCase();

  // Mock lịch sử nộp bài kiểm tra của học sinh này
  const mockSubmissions: StudentSubmission[] = [
    {
      id: 'sub-1',
      examCode: 'TEST-U1',
      examTitle: 'Bài kiểm tra 15 phút - Unit 1: My New School',
      unit: 1,
      score: 8.5,
      totalQuestions: 10,
      correctAnswers: 9,
      durationMinutes: 12,
      submittedAt: '02/10/2026 14:20',
      evaluatedSkill: 'Ngữ pháp thì hiện tại đơn & Từ vựng đồ dùng học tập',
      details: [
        { no: 1, question: 'She ______ to school every morning at 7 AM.', studentAnswer: 'goes', correctAnswer: 'goes', isCorrect: true, kcTag: 'Grammar.PresentSimple' },
        { no: 2, question: 'I have a new ______ to carry my books.', studentAnswer: 'school bag', correctAnswer: 'school bag', isCorrect: true, kcTag: 'Vocab.SchoolItems' },
        { no: 3, question: 'Do you ______ your homework after dinner?', studentAnswer: 'do', correctAnswer: 'do', isCorrect: true, kcTag: 'Grammar.PresentSimple' },
        { no: 4, question: 'Pronunciation: Which word has the sound /aʊ/?', studentAnswer: 'about', correctAnswer: 'about', isCorrect: true, kcTag: 'Phonics.Diphthong' },
        { no: 5, question: 'Look! The students ______ football in the schoolyard.', studentAnswer: 'play', correctAnswer: 'are playing', isCorrect: false, kcTag: 'Grammar.PresentContinuous' },
      ],
    },
    {
      id: 'sub-2',
      examCode: 'TEST-U2',
      examTitle: 'Bài kiểm tra 15 phút - Unit 2: My House',
      unit: 2,
      score: 7.0,
      totalQuestions: 10,
      correctAnswers: 7,
      durationMinutes: 14,
      submittedAt: '18/10/2026 09:45',
      evaluatedSkill: 'Giới từ chỉ vị trí & Từ vựng các phòng trong nhà',
      details: [
        { no: 1, question: 'There is a sofa ______ the living room.', studentAnswer: 'in', correctAnswer: 'in', isCorrect: true, kcTag: 'Grammar.Preposition' },
        { no: 2, question: 'The cat is sleeping ______ the table.', studentAnswer: 'under', correctAnswer: 'under', isCorrect: true, kcTag: 'Grammar.Preposition' },
        { no: 3, question: 'My house has ______ rooms: a living room, two bedrooms, and a kitchen.', studentAnswer: 'four', correctAnswer: 'four', isCorrect: true, kcTag: 'Vocab.Rooms' },
        { no: 4, question: 'Where is the dog? - It is ______ the door.', studentAnswer: 'behind', correctAnswer: 'behind', isCorrect: true, kcTag: 'Grammar.Preposition' },
        { no: 5, question: 'There ______ two lamps on the bedside table.', studentAnswer: 'is', correctAnswer: 'are', isCorrect: false, kcTag: 'Grammar.ThereIsAre' },
      ],
    },
    {
      id: 'sub-3',
      examCode: 'TEST-U3',
      examTitle: 'Bài kiểm tra 1 Tiết - Giữa Học Kỳ 1 (Unit 1, 2, 3)',
      unit: 3,
      score: 8.0,
      totalQuestions: 20,
      correctAnswers: 16,
      durationMinutes: 40,
      submittedAt: '03/11/2026 10:15',
      evaluatedSkill: 'Tổng hợp Kiến thức Học kỳ 1',
      details: [
        { no: 1, question: 'My best friend has big brown eyes and ______ hair.', studentAnswer: 'long black', correctAnswer: 'long black', isCorrect: true, kcTag: 'Vocab.Appearance' },
        { no: 2, question: 'Listen and choose: Who is calling?', studentAnswer: 'Nam', correctAnswer: 'Nam', isCorrect: true, kcTag: 'Listening.Dialog' },
        { no: 3, question: 'Pronunciation: Sound /p/ vs /b/', studentAnswer: 'pig', correctAnswer: 'pig', isCorrect: true, kcTag: 'Phonics.Consonants' },
      ],
    },
  ];

  return createPortal(
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[9998] flex items-center justify-center p-4 font-sans select-none"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col border border-slate-200/90 shadow-2xl overflow-hidden"
          >

            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between flex-shrink-0 bg-white">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-700 font-black text-sm flex items-center justify-center border border-sky-100">
                  {initials}
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">{student.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {student.code}
                    </span>
                    <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">
                      {student.className}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-9 h-9 inline-flex items-center justify-center text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
                title="Đóng"
              >
                <X className="w-5 h-5 stroke-[2]" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">

              {/* Quick Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-sky-50/60 p-3.5 rounded-2xl border border-sky-100">
                  <span className="text-sky-600 font-bold text-[11px] block mb-1">Điểm trung bình</span>
                  <span className="text-xl font-black text-sky-700">{student.avgScore} <span className="text-xs font-semibold text-sky-400">/ 10</span></span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <span className="text-slate-400 font-bold text-[11px] block mb-1">Tiến độ chương trình</span>
                  <span className="text-xl font-black text-slate-900">{student.completedUnits} <span className="text-xs font-semibold text-slate-400">/ {student.totalUnits} Unit</span></span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <span className="text-slate-400 font-bold text-[11px] block mb-1">Bài đã hoàn thành</span>
                  <span className="text-xl font-black text-slate-900">{student.completedTests} <span className="text-xs font-semibold text-slate-400">/ {student.totalTests} đề</span></span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex flex-col justify-between">
                  <span className="text-slate-400 font-bold text-[11px] block">Xếp loại học lực</span>
                  <div>
                    {student.learningStatus === 'EXCELLENT' && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        Giỏi
                      </span>
                    )}
                    {student.learningStatus === 'GOOD' && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-extrabold bg-sky-50 text-sky-700 border border-sky-200/60">
                        Khá
                      </span>
                    )}
                    {student.learningStatus === 'AVERAGE' && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-extrabold bg-amber-50 text-amber-700 border border-amber-200/60">
                        Trung bình
                      </span>
                    )}
                    {student.learningStatus === 'WEAK' && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-extrabold bg-rose-50 text-rose-700 border border-rose-200/60">
                        Cần bồi dưỡng
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Thông tin phụ huynh liên kết */}
              <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/70 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="font-bold text-slate-800 flex items-center gap-2">
                  <div className="p-1.5 bg-white rounded-lg border border-slate-200/80 text-slate-500">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <span>Phụ huynh: <strong className="text-slate-900">{student.parentName}</strong></span>
                </div>
                <div className="text-slate-500 font-medium flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>SĐT liên hệ: <strong className="text-slate-800 font-mono">{student.parentPhone}</strong></span>
                </div>
              </div>

              {/* Lịch sử nộp bài kiểm tra */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-sky-600" />
                    <span>Lịch sử bài kiểm tra ({mockSubmissions.length} bài)</span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400">Chọn biểu tượng xem để kiểm tra từng câu</span>
                </div>

                <div className="border border-slate-200/80 rounded-2xl overflow-hidden overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[680px]">
                    <thead>
                      <tr className="bg-slate-50/80 text-slate-400 font-extrabold uppercase tracking-wider text-[11px] border-b border-slate-100 whitespace-nowrap">
                        <th className="py-3 px-4">Mã đề</th>
                        <th className="py-3 px-4">Tên bài kiểm tra</th>
                        <th className="py-3 px-4">Điểm số</th>
                        <th className="py-3 px-4">Số câu đúng</th>
                        <th className="py-3 px-4">Thời gian nộp</th>
                        <th className="py-3 px-4 text-right">Chi tiết</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {mockSubmissions.map((sub) => (
                        <tr key={sub.id} className="hover:bg-sky-50/30 transition-colors group">
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-500 whitespace-nowrap">{sub.examCode}</td>
                          <td className="py-3.5 px-4 font-bold text-slate-900 group-hover:text-sky-600 transition-colors">{sub.examTitle}</td>
                          <td className="py-3.5 px-4 font-black text-sky-600 text-sm whitespace-nowrap">{sub.score} <span className="text-[11px] font-semibold text-slate-400">/10</span></td>
                          <td className="py-3.5 px-4 text-emerald-600 font-bold whitespace-nowrap">{sub.correctAnswers}/{sub.totalQuestions} câu</td>
                          <td className="py-3.5 px-4 text-slate-400 font-medium whitespace-nowrap">{sub.submittedAt}</td>
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <button
                              onClick={() => setSelectedSubmission(sub)}
                              className="w-8 h-8 inline-flex items-center justify-center text-slate-500 hover:text-sky-600 bg-white border border-slate-200 rounded-xl hover:bg-sky-50 hover:border-sky-200 transition-all shadow-2xs"
                              title="Xem chi tiết từng câu làm đúng / sai"
                            >
                              <Eye className="w-4 h-4 stroke-[2]" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 px-6 border-t border-slate-100 flex justify-end bg-slate-50/60 flex-shrink-0">
              <button
                onClick={onClose}
                className="px-5 py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-200/90 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-2xs"
              >
                Đóng hồ sơ
              </button>
            </div>

          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Popup xem bài làm chi tiết */}
      <ExamSubmissionModal
        submission={selectedSubmission}
        studentName={student.name}
        onClose={() => setSelectedSubmission(null)}
      />
    </>,
    document.body
  );
};