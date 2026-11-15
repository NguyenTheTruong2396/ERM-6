import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LandingPage } from '../features/landing/LandingPage';
import { TeacherLayout } from '../layouts/TeacherLayout/TeacherLayout';
import { TeacherDashboardPage } from '../features/dashboard/TeacherDashboardPage';
import { MyClassListPage } from '../features/classes/MyClassListPage';
import { ClassStudentListPage } from '../features/students/ClassStudentListPage';
import { KnowledgeGapsPage } from '../features/knowledge-gaps/KnowledgeGapsPage';
import { AdaptiveRoadmapTrackerPage } from '../features/ai-tracking/AdaptiveRoadmapTrackerPage';
import { StudentRoadmapDetailPage } from '../features/ai-tracking/StudentRoadmapDetailPage';
import { TeacherProfilePage } from '../features/profile/TeacherProfilePage';
import { LoginPage } from '../features/auth/LoginPage';
import { RegisterPage } from '../features/auth/RegisterPage';

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }}
    transition={{ duration: 0.25, ease: 'easeOut' }}
    className="w-full min-h-screen"
  >
    {children}
  </motion.div>
);

export const AppRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><LandingPage /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
        <Route path="/register" element={<PageWrapper><RegisterPage /></PageWrapper>} />

        <Route path="/teacher" element={<TeacherLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<TeacherDashboardPage />} />
          <Route path="classes" element={<MyClassListPage />} />
          <Route path="students" element={<ClassStudentListPage />} />
          <Route path="knowledge-gaps" element={<KnowledgeGapsPage />} />
          <Route path="ai-tracking" element={<AdaptiveRoadmapTrackerPage />} />
          <Route path="ai-tracking/:studentId" element={<StudentRoadmapDetailPage />} />
          <Route path="profile" element={<TeacherProfilePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};