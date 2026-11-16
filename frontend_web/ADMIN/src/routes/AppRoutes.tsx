import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '../layouts/AdminLayout/AdminLayout';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { StudentListPage } from '../features/users/StudentListPage';
import { TeacherListPage } from '../features/users/TeacherListPage';
import { ParentListPage } from '../features/users/ParentListPage';
import { AdminListPage } from '../features/users/AdminListPage';
import { ParentStudentLinkPage } from '../features/users/ParentStudentLinkPage';
import { ClassListPage } from '../features/classes/ClassListPage';
import { Term1Page } from '../features/curriculum/Term1Page';
import { Term2Page } from '../features/curriculum/Term2Page';
import { QuestionListPage } from '../features/question-bank/QuestionListPage';
import { ExamListPage } from '../features/exams/ExamListPage';
import { SettingListPage } from '../features/settings/SettingListPage';
import { AuditLogPage } from '../features/audit-logs/AuditLogPage';
import { ExamHistoryPage } from '../features/ai-roadmap/ExamHistoryPage';
import { AIRoadmapPage } from '../features/ai-roadmap/AIRoadmapPage';
import { KnowledgeComponentPage } from '../features/knowledge/KnowledgeComponentPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/users/students" replace />} />
      <Route path="/admin" element={<Navigate to="/admin/users/students" replace />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<DashboardPage />} />

        {/* Nhóm Người dùng */}
        <Route path="users/students" element={<StudentListPage />} />
        <Route path="users/teachers" element={<TeacherListPage />} />
        <Route path="users/parents" element={<ParentListPage />} />
        <Route path="users/admins" element={<AdminListPage />} />
        <Route path="users/parent-student-link" element={<ParentStudentLinkPage />} />

        {/* Lớp học */}
        <Route path="classes" element={<ClassListPage />} />

        {/* SGK Tiếng Anh 6: 2 Tập riêng biệt */}
        <Route path="curriculum" element={<Navigate to="/admin/curriculum/term-1" replace />} />
        <Route path="curriculum/term-1" element={<Term1Page />} />
        <Route path="curriculum/term-2" element={<Term2Page />} />

        {/* Bản đồ Tri thức KC (Khối AI) */}
        <Route path="knowledge-components" element={<KnowledgeComponentPage />} />
        {/* Ngân hàng câu hỏi & Đề thi */}
        <Route path="questions" element={<QuestionListPage />} />
        <Route path="exams" element={<ExamListPage />} />

        {/* Khối AI & Lộ trình */}
        <Route path="ai-roadmap" element={<Navigate to="/admin/ai-roadmap/students" replace />} />
        <Route path="ai-roadmap/students" element={<AIRoadmapPage />} />
        <Route path="ai-roadmap/exam-history" element={<ExamHistoryPage />} />

        {/* Hệ thống */}
        <Route path="settings" element={<SettingListPage />} />
        <Route path="audit-logs" element={<AuditLogPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/admin/users/students" replace />} />
    </Routes>
  );
};