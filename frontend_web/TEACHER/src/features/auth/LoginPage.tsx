import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, X, Sun, Moon } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/teacher/dashboard');
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    alert('Vui lòng nhập Email để nhận link khôi phục mật khẩu.');
  };

  const isDark = theme === 'dark';

  return (
    <div className={`relative min-h-screen w-full flex items-center justify-center p-4 transition-colors duration-300 font-sans overflow-hidden ${isDark ? 'bg-[#0a1128]' : 'bg-slate-100'}`}>

      {/* NÚT DẤU X Ở GÓC TRÁI MÀN HÌNH ĐỂ TRỞ VỀ TRANG CHÍNH */}
      <button
        type="button"
        onClick={() => navigate('/')}
        title="Quay lại trang chính"
        className={`absolute top-6 left-6 z-20 p-2.5 rounded-full border transition-all duration-200 backdrop-blur-sm group ${isDark
            ? 'bg-blue-950/40 border-cyan-400/20 text-cyan-300/60 hover:text-white hover:bg-blue-900/60 hover:border-cyan-400/50'
            : 'bg-white/80 border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-white'
          }`}
      >
        <X className="w-5 h-5 stroke-[2] group-hover:scale-110 transition-transform" />
      </button>

      {/* LỚP NỀN: LOGO PHÓNG TO VÀ LÀM MỜ */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-300 scale-110 filter blur-2xl ${isDark ? 'opacity-40' : 'opacity-20'}`}
        style={{ backgroundImage: `url('/logo.png')` }}
      />
      <div className={`absolute inset-0 transition-colors duration-300 ${isDark ? 'bg-gradient-to-b from-[#0a1128]/80 via-[#0f2353]/85 to-[#0a1128]/95' : 'bg-gradient-to-b from-sky-50/70 via-blue-100/60 to-slate-100/90'}`} />

      {/* KHUNG ĐĂNG NHẬP CHÍNH GIỮA */}
      <div className={`relative z-10 w-full max-w-sm space-y-5 backdrop-blur-md p-6 sm:p-8 rounded-3xl border transition-all duration-300 ${isDark
          ? 'bg-[#132247]/80 border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)]'
          : 'bg-white/90 border-blue-200 shadow-[0_10px_40px_rgba(14,165,233,0.15)]'
        }`}>

        {/* LOGO HIỂN THỊ CHÍNH GIỮA KHUNG */}
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className={`w-20 h-20 rounded-2xl p-1.5 border shadow-lg ${isDark
              ? 'bg-blue-950/60 border-cyan-400/40 shadow-cyan-500/20'
              : 'bg-blue-50 border-blue-200 shadow-blue-300/30'
            }`}>
            <img
              src="/logo.png"
              alt="Logo ERM 6"
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
          <h2 className={`text-2xl font-black text-center tracking-wide pt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Đăng nhập
          </h2>
        </div>

        {/* Form Đăng nhập */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Ô nhập Email hoặc Tên đăng nhập */}
          <div>
            <input
              type="text"
              required
              value={identity}
              onChange={(e) => setIdentity(e.target.value)}
              placeholder="Email hoặc tên đăng nhập"
              className={`w-full px-4 py-3 border rounded-xl text-sm transition-all font-medium focus:outline-none focus:ring-1 ${isDark
                  ? 'bg-[#0b1736]/90 border-blue-400/30 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-cyan-400'
                  : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500'
                }`}
            />
          </div>

          {/* Ô nhập Mật khẩu & Con mắt & Nút Quên mật khẩu */}
          <div className="space-y-1.5">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mật khẩu"
                className={`w-full pl-4 pr-11 py-3 border rounded-xl text-sm transition-all font-medium focus:outline-none focus:ring-1 ${isDark
                    ? 'bg-[#0b1736]/90 border-blue-400/30 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-cyan-400'
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500'
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors ${isDark ? 'text-cyan-300/70 hover:text-cyan-300' : 'text-slate-400 hover:text-slate-700'
                  }`}
              >
                {showPassword ? <EyeOff className="w-4 h-4 stroke-[1.5]" /> : <Eye className="w-4 h-4 stroke-[1.5]" />}
              </button>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleForgotPassword}
                className={`text-xs font-medium transition-colors ${isDark ? 'text-cyan-200/80 hover:text-white' : 'text-blue-600 hover:text-blue-800'
                  }`}
              >
                Quên mật khẩu?
              </button>
            </div>
          </div>

          {/* NÚT ĐĂNG NHẬP: ĐỔI MÀU CHỮ VÀ NỀN THEO THEME */}
          <button
            type="submit"
            className={`w-full py-3 px-4 font-black text-sm rounded-xl transition-all uppercase tracking-wider active:scale-[0.98] ${isDark
                ? 'bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/25'
                : 'bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-500 hover:from-blue-700 hover:to-sky-500 text-white shadow-lg shadow-blue-500/30'
              }`}
          >
            Đăng nhập
          </button>
        </form>

        {/* Dải phân cách HOẶC */}
        <div className="relative flex items-center justify-center my-3">
          <div className={`w-full border-t ${isDark ? 'border-blue-400/20' : 'border-slate-200'}`} />
          <span className={`absolute px-3 text-[11px] font-bold uppercase tracking-widest ${isDark ? 'bg-[#132247] text-cyan-300/80' : 'bg-white text-slate-400'
            }`}>
            Hoặc
          </span>
        </div>

        {/* Nút Đăng nhập bằng Google */}
        <button
          type="button"
          onClick={() => navigate('/teacher/dashboard')}
          className={`w-full flex items-center justify-center gap-3 py-3 px-4 border rounded-xl text-xs font-bold transition-all uppercase tracking-wider shadow-sm ${isDark
              ? 'bg-[#0b1736]/90 hover:bg-[#162a5c] border-cyan-400/30 text-cyan-300 hover:text-white'
              : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700'
            }`}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z" />
            <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
            <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12.5s.7 2.8 1.9 5.2l3.7-2.9z" />
            <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 17C3.7 20.7 7.5 24 12 24z" />
          </svg>
          <span>Đăng nhập bằng Google</span>
        </button>

        {/* Dòng chữ: Bạn chưa có tài khoản ? Đăng ký ngay */}
        <div className={`pt-2 text-center text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          <span>Bạn chưa có tài khoản ? </span>
          <Link to="/register" className={`font-bold hover:underline ml-1 ${isDark ? 'text-cyan-300 hover:text-white' : 'text-blue-600'}`}>
            Đăng ký ngay
          </Link>
        </div>

      </div>

      {/* NÚT TRƯỢT ICON CHUYỂN DỔI THEME TỐI / SÁNG NẰM Ở GÓC DƯỚI BÊN PHẢI */}
      <button
        type="button"
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        title={isDark ? "Chuyển sang Giao diện Sáng" : "Chuyển sang Giao diện Tối"}
        className={`fixed bottom-6 right-6 z-30 w-14 h-8 flex items-center rounded-full p-1 border shadow-lg transition-colors duration-300 backdrop-blur-md ${isDark
            ? 'bg-blue-950/80 border-cyan-400/40'
            : 'bg-slate-200 border-slate-300'
          }`}
      >
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center shadow-md transform transition-transform duration-300 ${isDark
              ? 'translate-x-6 bg-cyan-400 text-slate-950'
              : 'translate-x-0 bg-white text-indigo-600'
            }`}
        >
          {isDark ? (
            <Sun className="w-3.5 h-3.5 fill-current" />
          ) : (
            <Moon className="w-3.5 h-3.5 fill-current" />
          )}
        </div>
      </button>

    </div>
  );
};