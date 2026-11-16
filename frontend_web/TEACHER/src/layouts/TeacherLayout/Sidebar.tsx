import React, { useState, useEffect } from 'react';
import {
  LayoutGrid, GraduationCap, Users, AlertTriangle,
  Compass, X, LogOut
} from 'lucide-react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

interface TeacherProfileData {
  name: string;
  email: string;
  avatarUrl: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const navigate = useNavigate();

  const loadProfile = (): TeacherProfileData => {
    try {
      const raw = localStorage.getItem('erm6_teacher_profile');
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          name: parsed.name || 'Thầy A',
          email: parsed.email || 'a@gmail.com',
          avatarUrl: parsed.avatarUrl || '',
        };
      }
    } catch {
      // ignore
    }
    return { name: 'Thầy A', email: 'a@gmail.com', avatarUrl: '' };
  };

  const [teacherProfile, setTeacherProfile] = useState<TeacherProfileData>(loadProfile);

  useEffect(() => {
    const handleProfileUpdate = () => {
      setTeacherProfile(loadProfile());
    };
    window.addEventListener('teacherProfileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('teacherProfileUpdated', handleProfileUpdate);
  }, []);

  const handleLogout = () => {
    navigate('/login');
  };

  const initials = teacherProfile.name.trim().slice(0, 1).toUpperCase() || 'A';

  return (
    <>
      {/* Overlay Mobile */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-30 md:hidden"
        />
      )}

      <aside className={`
        fixed md:static inset-y-0 left-0 w-72 bg-white border-r border-slate-200/80 flex flex-col justify-between z-40 
        transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-out flex-shrink-0 font-sans select-none
      `}>
        <div className="flex-1 flex flex-col min-h-0">

          {/* Logo & Brand */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100 flex-shrink-0">
            <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => navigate('/')}>
              <img
                src="/logo.png"
                alt="ERM 6 Logo"
                className="w-10 h-10 object-contain rounded-xl shadow-xs"
              />
              <div className="flex flex-col">
                <span className="font-extrabold text-slate-900 text-base tracking-tight leading-snug">English 6 Teacher</span>
                <span className="text-xs text-sky-600 font-bold tracking-wider">CỔNG GIÁO VIÊN</span>
              </div>
            </div>

            <button
              onClick={onCloseMobile}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl md:hidden transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-7">

            {/* TỔNG QUAN */}
            <div className="space-y-1.5">
              <div className="px-3 mb-2 text-xs font-bold text-slate-400 tracking-wider">
                TỔNG QUAN
              </div>

              <NavLink
                to="/teacher/dashboard"
                onClick={onCloseMobile}
                className={({ isActive }) => `
                  relative flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-bold transition-all duration-200
                  ${isActive ? 'text-sky-600' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}
                `}
              >
                {({ isActive }) => (
                  <>
                    <LayoutGrid className={`w-5 h-5 z-10 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                    <span className="z-10">Tổng quan</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute inset-0 bg-sky-50 border border-sky-200/80 rounded-xl z-0 shadow-xs"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            </div>

            {/* GIẢNG DẠY & LỚP HỌC */}
            <div className="space-y-1.5">
              <div className="px-3 mb-2 text-xs font-bold text-slate-400 tracking-wider">
                GIẢNG DẠY & LỚP HỌC
              </div>

              <NavLink
                to="/teacher/classes"
                onClick={onCloseMobile}
                className={({ isActive }) => `
                  relative flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-bold transition-all duration-200
                  ${isActive ? 'text-sky-600' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}
                `}
              >
                {({ isActive }) => (
                  <>
                    <GraduationCap className={`w-5 h-5 z-10 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                    <span className="z-10">Lớp học phụ trách</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute inset-0 bg-sky-50 border border-sky-200/80 rounded-xl z-0 shadow-xs"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>

              <NavLink
                to="/teacher/students"
                onClick={onCloseMobile}
                className={({ isActive }) => `
                  relative flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-bold transition-all duration-200
                  ${isActive ? 'text-sky-600' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}
                `}
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3.5 z-10">
                      <Users className={`w-5 h-5 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                      <span>Học sinh</span>
                    </div>
                    <span className={`z-10 text-xs px-2.5 py-0.5 rounded-lg font-bold ${isActive ? 'bg-sky-200/70 text-sky-900' : 'bg-slate-100 text-slate-500'}`}>
                      90 HS
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute inset-0 bg-sky-50 border border-sky-200/80 rounded-xl z-0 shadow-xs"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            </div>

            {/* PHÂN TÍCH & HỖ TRỢ AI */}
            <div className="space-y-1.5">
              <div className="px-3 mb-2 text-xs font-bold text-slate-400 tracking-wider">
                PHÂN TÍCH & HỖ TRỢ AI
              </div>

              <NavLink
                to="/teacher/knowledge-gaps"
                onClick={onCloseMobile}
                className={({ isActive }) => `
                  relative flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-bold transition-all duration-200
                  ${isActive ? 'text-sky-600' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}
                `}
              >
                {({ isActive }) => (
                  <>
                    <AlertTriangle className={`w-5 h-5 z-10 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                    <span className="z-10">Phân tích lỗ hổng lớp</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute inset-0 bg-sky-50 border border-sky-200/80 rounded-xl z-0 shadow-xs"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>

              <NavLink
                to="/teacher/ai-tracking"
                onClick={onCloseMobile}
                className={({ isActive }) => `
                  relative flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-bold transition-all duration-200
                  ${isActive ? 'text-sky-600' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}
                `}
              >
                {({ isActive }) => (
                  <>
                    <Compass className={`w-5 h-5 z-10 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                    <span className="z-10">Lộ trình cá nhân hóa</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute inset-0 bg-sky-50 border border-sky-200/80 rounded-xl z-0 shadow-xs"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            </div>

          </nav>

          {/* User Profile Footer */}
          <div className="p-4 border-t border-slate-100 flex-shrink-0 bg-white">
            <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:border-sky-200 transition-colors">
              <Link
                to="/teacher/profile"
                onClick={onCloseMobile}
                title="Chỉnh sửa thông tin cá nhân"
                className="flex items-center gap-3 min-w-0 flex-1 group"
              >
                <div className="w-9 h-9 rounded-xl bg-sky-600 text-white font-extrabold text-sm flex items-center justify-center shadow-xs flex-shrink-0 overflow-hidden">
                  {teacherProfile.avatarUrl ? (
                    <img
                      src={teacherProfile.avatarUrl}
                      alt={teacherProfile.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-sm font-bold text-slate-900 leading-tight truncate group-hover:text-sky-600 transition-colors">
                    {teacherProfile.name}
                  </span>
                  <span className="text-xs text-slate-500 font-medium truncate">
                    {teacherProfile.email}
                  </span>
                </div>
              </Link>

              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors flex-shrink-0"
                title="Đăng xuất"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </aside>
    </>
  );
};