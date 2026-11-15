import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle2, X, Sun, Moon } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }
    setSuccess(true);
    setTimeout(() => {
      navigate('/login');
    }, 1500);
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

      {/* KHUNG ĐĂNG KÝ CHÍNH GIỮA */}
      <div className={`relative z-10 w-full max-w-sm space-y-5 backdrop-blur-md p-6 sm:p-8 rounded-3xl border transition-all duration-300 my-6 ${isDark
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
          <h2 className={`text-xl font-black text-center tracking-wide pt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Đăng ký tài khoản giáo viên
          </h2>
        </div>

        {/* Thông báo đăng ký thành công */}
        {success && (
          <div className="p-3 bg-emerald-500/20 border border-emerald-400/40 rounded-xl flex items-center gap-2 text-xs text-emerald-700 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>Đăng ký thành công! Đang chuyển hướng về trang Đăng nhập...</span>
          </div>
        )}

        {/* Form Đăng ký */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Ô nhập Họ và tên */}
          <div>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Họ và tên giáo viên"
              className={`w-full px-4 py-3 border rounded-xl text-sm transition-all font-medium focus:outline-none focus:ring-1 ${isDark
                  ? 'bg-[#0b1736]/90 border-blue-400/30 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-cyan-400'
                  : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500'
                }`}
            />
          </div>

          {/* Ô nhập Email */}
          <div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email công vụ hoặc cá nhân"
              className={`w-full px-4 py-3 border rounded-xl text-sm transition-all font-medium focus:outline-none focus:ring-1 ${isDark
                  ? 'bg-[#0b1736]/90 border-blue-400/30 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-cyan-400'
                  : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500'
                }`}
            />
          </div>

          {/* Ô nhập Số điện thoại */}
          <div>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Số điện thoại liên hệ"
              className={`w-full px-4 py-3 border rounded-xl text-sm transition-all font-medium focus:outline-none focus:ring-1 ${isDark
                  ? 'bg-[#0b1736]/90 border-blue-400/30 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-cyan-400'
                  : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500'
                }`}
            />
          </div>

          {/* Ô nhập Mật khẩu + Con mắt */}
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

          {/* Ô nhập Xác nhận mật khẩu + Con mắt */}
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Xác nhận mật khẩu"
              className={`w-full pl-4 pr-11 py-3 border rounded-xl text-sm transition-all font-medium focus:outline-none focus:ring-1 ${isDark
                  ? 'bg-[#0b1736]/90 border-blue-400/30 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-cyan-400'
                  : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500'
                }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors ${isDark ? 'text-cyan-300/70 hover:text-cyan-300' : 'text-slate-400 hover:text-slate-700'
                }`}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4 stroke-[1.5]" /> : <Eye className="w-4 h-4 stroke-[1.5]" />}
            </button>
          </div>

          {/* NÚT ĐĂNG KÝ: ĐỔI MÀU CHỮ VÀ NỀN THEO THEME */}
          <button
            type="submit"
            className={`w-full py-3 px-4 font-black text-sm rounded-xl transition-all uppercase tracking-wider active:scale-[0.98] ${isDark
                ? 'bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/25'
                : 'bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-500 hover:from-blue-700 hover:to-sky-500 text-white shadow-lg shadow-blue-500/30'
              }`}
          >
            Đăng ký
          </button>
        </form>

        {/* Dòng chữ: Đã có tài khoản ? Đăng nhập ngay */}
        <div className={`pt-2 text-center text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          <span>Đã có tài khoản ? </span>
          <Link to="/login" className={`font-bold hover:underline ml-1 ${isDark ? 'text-cyan-300 hover:text-white' : 'text-blue-600'}`}>
            Đăng nhập ngay
          </Link>
        </div>

      </div>

      {/* NÚT TRƯỢT ICON CHUYỂN ĐỔI THEME TỐI / SÁNG NẰM Ở GÓC DƯỚI BÊN PHẢI */}
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