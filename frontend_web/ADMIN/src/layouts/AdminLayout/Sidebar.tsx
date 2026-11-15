import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutGrid, Users, GraduationCap, BookOpen, HelpCircle,
  FileCheck, Settings, Activity, ChevronDown, X, MoreHorizontal,
  Network, Compass, Link2
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const location = useLocation();

  // Xử lý trạng thái mở rộng của các menu con
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    users: location.pathname.startsWith('/admin/users'),
    curriculum: location.pathname.startsWith('/admin/curriculum'),
    aiRoadmap: location.pathname.startsWith('/admin/ai-roadmap'),
  });

  useEffect(() => {
    const currentPath = location.pathname;
    setOpenMenus((prev) => ({
      ...prev,
      users: currentPath.startsWith('/admin/users') ? true : prev.users,
      curriculum: currentPath.startsWith('/admin/curriculum') ? true : prev.curriculum,
      aiRoadmap: currentPath.startsWith('/admin/ai-roadmap') ? true : prev.aiRoadmap,
    }));
  }, [location.pathname]);

  const toggleSubmenu = (key: string) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isParentActive = (prefix: string) => location.pathname.startsWith(prefix);

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/40 z-30 md:hidden"
        />
      )}

      <aside className={`
        fixed md:static inset-y-0 left-0 w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between z-40 
        transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-200 ease-in-out flex-shrink-0
      `}>
        <div className="flex-1 flex flex-col min-h-0">

          {/* Logo & Brand */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 flex-shrink-0">
            <div className="flex items-center space-x-3">
              <img
                src="/logo.png"
                alt="Logo ERM 6"
                className="w-8 h-8 rounded-lg object-cover shadow-sm"
              />
              <div>
                <div className="font-semibold text-slate-900 text-sm tracking-tight">ERM-6 Admin</div>
                <div className="text-[11px] text-slate-400 font-medium tracking-wide">CỔNG QUẢN TRỊ</div>
              </div>
            </div>
            <button onClick={onCloseMobile} className="p-1 text-slate-400 hover:text-slate-700 md:hidden">
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-5">

            {/* TỔNG QUAN */}
            <div>
              <div className="px-3 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Tổng quan</div>
              <NavLink
                to="/admin/dashboard"
                onClick={onCloseMobile}
                className={({ isActive }) => `
                  flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-md transition-all
                  ${isActive
                    ? 'bg-slate-900 text-white font-semibold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}
                `}
              >
                <LayoutGrid className="w-4 h-4 stroke-[1.5]" />
                <span>Tổng quan</span>
              </NavLink>
            </div>

            {/* ĐÀO TẠO & DỮ LIỆU */}
            <div>
              <div className="px-3 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Đào tạo & Dữ liệu</div>
              <div className="space-y-1">

                {/* 1. Quản lý Người dùng (Khớp users, role, parent_student_link) */}
                <div>
                  <button
                    onClick={() => toggleSubmenu('users')}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors ${isParentActive('/admin/users')
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Users className={`w-4 h-4 stroke-[1.5] ${isParentActive('/admin/users') ? 'text-slate-900' : 'text-slate-400'}`} />
                      <span>Quản lý Người dùng</span>
                    </span>
                    <ChevronDown className={`w-4 h-4 stroke-[1.5] transition-transform duration-200 ${openMenus.users ? 'rotate-180' : ''
                      } ${isParentActive('/admin/users') ? 'text-slate-900' : 'text-slate-400'}`} />
                  </button>

                  {openMenus.users && (
                    <div className="ml-4 pl-3 border-l border-slate-200/80 space-y-1 mt-1">
                      <NavLink
                        to="/admin/users/admins"
                        onClick={onCloseMobile}
                        className={({ isActive }) => `
                          block px-2.5 py-1.5 text-xs font-medium rounded-md transition-all
                          ${isActive ? 'bg-slate-900 text-white font-semibold shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}
                        `}
                      >
                        Quản trị viên
                      </NavLink>
                      <NavLink
                        to="/admin/users/students"
                        onClick={onCloseMobile}
                        className={({ isActive }) => `
                          flex items-center justify-between px-2.5 py-1.5 text-xs font-medium rounded-md transition-all
                          ${isActive ? 'bg-slate-900 text-white font-semibold shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}
                        `}
                      >
                        <span>Học sinh</span>
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span>+12</span>
                        </span>
                      </NavLink>
                      <NavLink
                        to="/admin/users/teachers"
                        onClick={onCloseMobile}
                        className={({ isActive }) => `
                          block px-2.5 py-1.5 text-xs font-medium rounded-md transition-all
                          ${isActive ? 'bg-slate-900 text-white font-semibold shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}
                        `}
                      >
                        Giáo viên
                      </NavLink>
                      <NavLink
                        to="/admin/users/parents"
                        onClick={onCloseMobile}
                        className={({ isActive }) => `
                          block px-2.5 py-1.5 text-xs font-medium rounded-md transition-all
                          ${isActive ? 'bg-slate-900 text-white font-semibold shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}
                        `}
                      >
                        Phụ huynh
                      </NavLink>

                      {/* Bổ sung: Liên kết Ghép nối Phụ huynh - Học sinh (parent_student_link) */}
                      <NavLink
                        to="/admin/users/parent-student-link"
                        onClick={onCloseMobile}
                        className={({ isActive }) => `
                          flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-all
                          ${isActive ? 'bg-slate-900 text-white font-semibold shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}
                        `}
                      >
                        <Link2 className="w-3.5 h-3.5" />
                        <span>Liên kết Phụ huynh - HS</span>
                      </NavLink>
                    </div>
                  )}
                </div>

                {/* 2. Lớp học & Phân công (Khớp classrooms) */}
                <NavLink
                  to="/admin/classes"
                  onClick={onCloseMobile}
                  className={({ isActive }) => `
                    flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-md transition-all
                    ${isActive
                      ? 'bg-slate-900 text-white font-semibold shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}
                  `}
                >
                  <GraduationCap className="w-4 h-4 stroke-[1.5]" />
                  <span>Lớp học & Phân công</span>
                </NavLink>

                {/* 3. Nội dung SGK Tiếng Anh 6 (Khớp units, lessons, vocab, grammar, answer_book) */}
                <div>
                  <button
                    onClick={() => toggleSubmenu('curriculum')}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors ${isParentActive('/admin/curriculum')
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <BookOpen className={`w-4 h-4 stroke-[1.5] ${isParentActive('/admin/curriculum') ? 'text-slate-900' : 'text-slate-400'}`} />
                      <span>Nội dung SGK 6</span>
                    </span>
                    <ChevronDown className={`w-4 h-4 stroke-[1.5] transition-transform duration-200 ${openMenus.curriculum ? 'rotate-180' : ''
                      } ${isParentActive('/admin/curriculum') ? 'text-slate-900' : 'text-slate-400'}`} />
                  </button>

                  {openMenus.curriculum && (
                    <div className="ml-4 pl-3 border-l border-slate-200/80 space-y-1 mt-1">
                      <NavLink
                        to="/admin/curriculum/term-1"
                        onClick={onCloseMobile}
                        className={({ isActive }) => `
                          block px-2.5 py-1.5 text-xs font-medium rounded-md transition-all
                          ${isActive ? 'bg-slate-900 text-white font-semibold shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}
                        `}
                      >
                        SGK Tiếng Anh 6 - Tập 1 (Unit 1 - 6)
                      </NavLink>
                      <NavLink
                        to="/admin/curriculum/term-2"
                        onClick={onCloseMobile}
                        className={({ isActive }) => `
                          block px-2.5 py-1.5 text-xs font-medium rounded-md transition-all
                          ${isActive ? 'bg-slate-900 text-white font-semibold shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}
                        `}
                      >
                        SGK Tiếng Anh 6 - Tập 2 (Unit 7 - 12)
                      </NavLink>
                    </div>
                  )}
                </div>

                {/* 4. Bổ sung: Bản đồ Tri thức (Khớp knowledge_components) */}
                <NavLink
                  to="/admin/knowledge-components"
                  onClick={onCloseMobile}
                  className={({ isActive }) => `
                    flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-md transition-all
                    ${isActive
                      ? 'bg-slate-900 text-white font-semibold shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}
                  `}
                >
                  <Network className="w-4 h-4 stroke-[1.5]" />
                  <span>Huấn luyện AI</span>
                </NavLink>

                {/* 5. Ngân hàng câu hỏi (Khớp question_bank, question_options) */}
                <NavLink
                  to="/admin/questions"
                  onClick={onCloseMobile}
                  className={({ isActive }) => `
                    flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-md transition-all
                    ${isActive
                      ? 'bg-slate-900 text-white font-semibold shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}
                  `}
                >
                  <HelpCircle className="w-4 h-4 stroke-[1.5]" />
                  <span>Ngân hàng câu hỏi</span>
                </NavLink>

                {/* 6. Đề kiểm tra & Ma trận (Khớp exam, exam_questions) */}
                <NavLink
                  to="/admin/exams"
                  onClick={onCloseMobile}
                  className={({ isActive }) => `
                    flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-md transition-all
                    ${isActive
                      ? 'bg-slate-900 text-white font-semibold shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}
                  `}
                >
                  <FileCheck className="w-4 h-4 stroke-[1.5]" />
                  <span>Đề kiểm tra & Cấu hình</span>
                </NavLink>

                {/* 7. Bổ sung: Lộ trình AI & Tiến trình (Khớp roadmap, learning_history, exam_history) */}
                <div>
                  <button
                    onClick={() => toggleSubmenu('aiRoadmap')}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors ${isParentActive('/admin/ai-roadmap')
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Compass className={`w-4 h-4 stroke-[1.5] ${isParentActive('/admin/ai-roadmap') ? 'text-slate-900' : 'text-slate-400'}`} />
                      <span>Khối AI & Lộ trình</span>
                    </span>
                    <ChevronDown className={`w-4 h-4 stroke-[1.5] transition-transform duration-200 ${openMenus.aiRoadmap ? 'rotate-180' : ''
                      } ${isParentActive('/admin/ai-roadmap') ? 'text-slate-900' : 'text-slate-400'}`} />
                  </button>

                  {openMenus.aiRoadmap && (
                    <div className="ml-4 pl-3 border-l border-slate-200/80 space-y-1 mt-1">
                      <NavLink
                        to="/admin/ai-roadmap/students"
                        onClick={onCloseMobile}
                        className={({ isActive }) => `
                          block px-2.5 py-1.5 text-xs font-medium rounded-md transition-all
                          ${isActive ? 'bg-slate-900 text-white font-semibold shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}
                        `}
                      >
                        Lộ trình AI
                      </NavLink>
                      <NavLink
                        to="/admin/ai-roadmap/exam-history"
                        onClick={onCloseMobile}
                        className={({ isActive }) => `
                          flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-all
                          ${isActive ? 'bg-slate-900 text-white font-semibold shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}
                        `}
                      >
                        Lịch sử Thi & Tiến trình
                      </NavLink>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* HỆ THỐNG */}
            <div>
              <div className="px-3 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Hệ thống</div>
              <div className="space-y-1">
                {/* Cài đặt Hệ thống (Khớp setting) */}
                <NavLink
                  to="/admin/settings"
                  onClick={onCloseMobile}
                  className={({ isActive }) => `
                    flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-md transition-all
                    ${isActive
                      ? 'bg-slate-900 text-white font-semibold shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}
                  `}
                >
                  <Settings className="w-4 h-4 stroke-[1.5]" />
                  <span>Cài đặt hệ thống</span>
                </NavLink>

                {/* Nhật ký hệ thống */}
                <NavLink
                  to="/admin/audit-logs"
                  onClick={onCloseMobile}
                  className={({ isActive }) => `
                    flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-md transition-all
                    ${isActive
                      ? 'bg-slate-900 text-white font-semibold shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}
                  `}
                >
                  <Activity className="w-4 h-4 stroke-[1.5]" />
                  <span>Nhật ký</span>
                </NavLink>
              </div>
            </div>

          </nav>

          {/* User Profile Footer */}
          <div className="p-4 border-t border-slate-100 flex-shrink-0">
            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-medium text-xs flex items-center justify-center border border-slate-200">
                  AD
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold text-slate-900">Quản trị viên</div>
                </div>
              </div>
              <MoreHorizontal className="w-4 h-4 text-slate-400 stroke-[1.5]" />
            </div>
          </div>

        </div>
      </aside>
    </>
  );
};