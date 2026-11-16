import React from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle2, XCircle, Clock, Award, Tag } from 'lucide-react';
import { StudentSubmission } from '../../../types/teacher.types';
import { motion, AnimatePresence } from 'framer-motion';

interface ExamSubmissionModalProps {
  submission: StudentSubmission | null;
  studentName: string;
  onClose: () => void;
}

export const ExamSubmissionModal: React.FC<ExamSubmissionModalProps> = ({
  submission,
  studentName,
  onClose,
}) => {
  if (!submission) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[9999] flex items-center justify-center p-4 font-sans select-none"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-slate-200/90 shadow-2xl overflow-hidden"
        >
          {/* Modal Header */}
          <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 flex-shrink-0 bg-white">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-extrabold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-lg border border-sky-100">
                  {submission.examCode}
                </span>
                <span className="text-[11px] font-bold text-slate-400">
                  • Nộp lúc {submission.submittedAt}
                </span>
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight leading-snug">
                {submission.examTitle}
              </h2>
              <div className="text-xs font-medium text-slate-500">
                Học sinh thực hiện: <strong className="font-bold text-slate-900">{studentName}</strong>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 inline-flex items-center justify-center text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors flex-shrink-0"
              title="Đóng"
            >
              <X className="w-5 h-5 stroke-[2]" />
            </button>
          </div>

          {/* Quick Exam Score Summary */}
          <div className="p-5 bg-slate-50/70 border-b border-slate-100 grid grid-cols-3 gap-3 text-xs flex-shrink-0">
            <div className="bg-sky-50/80 p-3.5 rounded-2xl border border-sky-100">
              <span className="text-sky-600 font-bold text-[11px] flex items-center gap-1.5 mb-1">
                <Award className="w-3.5 h-3.5" />
                <span>Điểm số</span>
              </span>
              <div className="text-xl font-black text-sky-700">
                {submission.score} <span className="text-xs font-semibold text-sky-400">/ 10</span>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80">
              <span className="text-slate-400 font-bold text-[11px] flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Số câu đúng</span>
              </span>
              <div className="text-xl font-black text-emerald-600">
                {submission.correctAnswers} <span className="text-xs font-semibold text-slate-400">/ {submission.totalQuestions} câu</span>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80">
              <span className="text-slate-400 font-bold text-[11px] flex items-center gap-1.5 mb-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Thời gian làm</span>
              </span>
              <div className="text-xl font-black text-slate-900">
                {submission.durationMinutes} <span className="text-xs font-semibold text-slate-400">phút</span>
              </div>
            </div>
          </div>

          {/* Question Details List (Scrollable) */}
          <div className="p-6 overflow-y-auto space-y-4 flex-1">
            <div className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Chi tiết câu hỏi & Đáp án ({submission.details.length} câu hiển thị)
            </div>

            <div className="space-y-3">
              {submission.details.map((item) => (
                <div
                  key={item.no}
                  className={`p-4 rounded-2xl border text-xs space-y-3 transition-colors ${item.isCorrect
                      ? 'border-slate-200/80 bg-white'
                      : 'border-rose-200 bg-rose-50/40'
                    }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span
                        className={`w-6 h-6 rounded-lg font-extrabold flex items-center justify-center text-[11px] flex-shrink-0 mt-0.5 ${item.isCorrect
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-rose-100 text-rose-700'
                          }`}
                      >
                        #{item.no}
                      </span>
                      <span className="font-bold text-slate-900 leading-relaxed text-[13px]">
                        {item.question}
                      </span>
                    </div>

                    {item.isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60 flex-shrink-0 whitespace-nowrap">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Đúng (+1.0đ)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200/60 flex-shrink-0 whitespace-nowrap">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Sai (0đ)</span>
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs p-3 rounded-xl bg-slate-50/80 border border-slate-100">
                    <div>
                      <span className="text-slate-400 font-medium">Học sinh chọn: </span>
                      <strong
                        className={
                          item.isCorrect
                            ? 'text-emerald-700 font-extrabold'
                            : 'text-rose-600 font-extrabold'
                        }
                      >
                        {item.studentAnswer}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium">Đáp án chuẩn: </span>
                      <strong className="text-slate-900 font-extrabold">
                        {item.correctAnswer}
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-0.5">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-lg border border-sky-100">
                      <Tag className="w-3 h-3 text-sky-600" />
                      <span>{item.kcTag}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-4 px-6 border-t border-slate-100 flex items-center justify-end flex-shrink-0 bg-slate-50/60">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-200/90 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-2xs"
            >
              Đóng bài làm
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};