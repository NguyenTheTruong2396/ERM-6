import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Sparkles, ShieldCheck, BookOpen, BrainCircuit,
    Trophy, Flame, ChevronRight, Award, Zap, Sun, Moon, CheckCircle2
} from 'lucide-react';

export const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    // MẶC ĐỊNH LÀ GIAO DIỆN SÁNG (LIGHT MODE)
    const [theme, setTheme] = useState<'dark' | 'light'>('light');
    const isDark = theme === 'dark';

    return (
        /* THÊM overflow-y-auto và h-screen ĐỂ BẬT THANH CUỘN CHO TOÀN TRANG */
        <div className={`h-screen w-full overflow-y-auto overflow-x-hidden transition-colors duration-300 font-sans flex flex-col justify-between relative ${isDark ? 'bg-[#0a1128] text-white' : 'bg-white text-slate-900'
            }`}>

            {/* 1. LỚP NỀN NĂNG ĐỘNG */}
            <div
                className={`absolute inset-0 bg-cover bg-center transition-opacity duration-300 scale-110 filter blur-3xl pointer-events-none ${isDark ? 'opacity-30' : 'opacity-10'}`}
                style={{ backgroundImage: `url('/logo.png')` }}
            />

            {/* 2. HEADER TOP BAR (Nền trắng tràn mép 100%, nội dung căn giữa lề cũ) */}
            <header className={`sticky top-0 z-50 w-full border-b transition-colors duration-300 backdrop-blur-md ${isDark ? 'border-cyan-500/20 bg-[#0a1128]/90' : 'border-slate-200 bg-white/90'
                }`}>
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

                    {/* Logo bên trái */}
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-11 h-11 rounded-2xl bg-sky-500/10 p-1 border border-cyan-400/40 shadow-md active:scale-95 transition-transform">
                            <img src="/logo.png" alt="ERM 6" className="w-full h-full object-contain rounded-xl" />
                        </div>
                        <span className="font-black text-2xl tracking-wider">
                            ERM <span className="text-cyan-500">6</span>
                        </span>
                    </div>

                    {/* Nút bấm ĐĂNG NHẬP / ĐĂNG KÝ bên phải */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/login')}
                            className={`px-5 py-2.5 font-bold text-xs rounded-xl border-2 transition-all active:scale-95 uppercase tracking-wider ${isDark
                                    ? 'bg-[#0b1736]/90 border-cyan-400/40 text-cyan-300 hover:text-white'
                                    : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                                }`}
                        >
                            Đăng nhập
                        </button>

                        <button
                            onClick={() => navigate('/register')}
                            className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-white font-black text-xs rounded-xl border-b-4 border-sky-700 transition-all active:translate-y-0.5 shadow-lg shadow-sky-500/20 uppercase tracking-wider"
                        >
                            Đăng ký
                        </button>
                    </div>

                </div>
            </header>

            {/* 3. HERO SECTION (ẢNH 3 DUOLINGO: ROBOT + ITEM FLOATING BAN ĐẦU) */}
            <section className="relative z-10 max-w-6xl mx-auto px-6 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                {/* Cột Trái: Chú Robot ERM 6 & Các phần thưởng icon bay xung quanh */}
                <div className="lg:col-span-6 flex justify-center relative">

                    {/* Item floating bay 1 */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                        className="absolute -top-4 left-4 sm:left-10 bg-amber-400 text-slate-950 p-3 rounded-2xl shadow-xl flex items-center gap-2 font-black text-xs border-2 border-amber-300 z-20"
                    >
                        <Trophy className="w-5 h-5 text-slate-950" />
                        <span>Chuỗi Streak Giảng Dạy</span>
                    </motion.div>

                    {/* Item floating bay 2 */}
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 0.5 }}
                        className="absolute top-1/2 -right-2 sm:-right-6 bg-cyan-400 text-slate-950 p-3 rounded-2xl shadow-xl flex items-center gap-2 font-black text-xs border-2 border-cyan-300 z-20"
                    >
                        <Zap className="w-5 h-5 text-slate-950" />
                        <span>AI Chuẩn GDPT Tiếng Anh 6</span>
                    </motion.div>

                    {/* Item floating bay 3 */}
                    <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 1 }}
                        className="absolute -bottom-4 left-8 bg-rose-500 text-white p-2.5 rounded-2xl shadow-xl flex items-center gap-2 font-bold text-xs border-2 border-rose-400 z-20"
                    >
                        <Flame className="w-4 h-4 text-amber-300" />
                        <span>Lộ trình thông minh</span>
                    </motion.div>

                    {/* Logo chính */}
                    <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-tr from-cyan-400/20 via-sky-500/20 to-blue-600/20 p-6 flex items-center justify-center border-4 border-cyan-400/40 shadow-2xl">
                        <img
                            src="/logo.png"
                            alt="ERM 6 Robot"
                            className="w-full h-full object-contain drop-shadow-xl"
                        />
                    </div>
                </div>

                {/* Cột Phải: Tiêu đề & Nút bấm chính */}
                <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">

                    <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-700 px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>Cổng Giảng Dạy & Quản Lý Lớp Học Tiếng Anh 6</span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight text-sky-500">
                        Học & Giảng dạy Tiếng Anh 6 cùng <span className="text-blue-600">ERM 6</span>
                    </h1>

                    <p className={`text-base leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        Giải pháp trợ lý AI toàn diện giúp giáo viên theo dõi tiến độ, phát hiện lỗ hổng kiến thức và tối ưu hóa bài giảng theo chương trình mới.
                    </p>

                    <div className="w-full max-w-sm space-y-3 pt-2">
                        <button
                            onClick={() => navigate('/register')}
                            className="w-full py-4 px-6 bg-sky-500 hover:bg-sky-400 text-white font-black text-sm rounded-2xl border-b-4 border-sky-700 transition-all active:translate-y-1 shadow-xl shadow-sky-500/30 uppercase tracking-wider flex items-center justify-center gap-2"
                        >
                            <span>Đăng ký ngay</span>
                            <ChevronRight className="w-5 h-5 stroke-[3]" />
                        </button>

                        <button
                            onClick={() => navigate('/login')}
                            className={`w-full py-3.5 px-6 font-black text-xs rounded-2xl border-2 border-b-4 transition-all active:translate-y-1 uppercase tracking-wider ${isDark
                                ? 'bg-[#0b1736]/90 border-cyan-400/30 text-cyan-300 hover:text-white'
                                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                                }`}
                        >
                            Tôi đã có tài khoản Giáo viên
                        </button>
                    </div>

                </div>

            </section>

            {/* 4. MỤC 1: AI PHÂN TÍCH HỌC SINH */}
            <section className={`py-16 sm:py-24 px-6 border-t transition-colors duration-300 ${isDark ? 'border-slate-800 bg-[#0a1128]' : 'border-slate-100 bg-slate-50/60'
                }`}>
                <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                    <div className="lg:col-span-6 space-y-5 text-center lg:text-left">
                        <h2 className="text-3xl sm:text-5xl font-black text-sky-500 leading-tight">
                            AI Phân tích học sinh thông minh, chính xác
                        </h2>
                        <p className={`text-base sm:text-lg leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                            Tự động cảnh báo lỗ hổng kiến thức ngữ pháp và kỹ năng nghe nói của từng học sinh trong lớp. Các thuật toán AI theo dõi sát sao tiến độ để giúp giáo viên can thiệp kịp thời.
                        </p>
                        <ul className="space-y-2.5 pt-2 text-sm font-semibold inline-block text-left">
                            <li className="flex items-center gap-2 text-sky-600">
                                <CheckCircle2 className="w-5 h-5 text-sky-500 flex-shrink-0" />
                                <span>Phát hiện lỗ hổng từ vựng & ngữ pháp Unit</span>
                            </li>
                            <li className="flex items-center gap-2 text-sky-600">
                                <CheckCircle2 className="w-5 h-5 text-sky-500 flex-shrink-0" />
                                <span>Đánh giá kỹ năng phát âm qua nhận diện giọng nói</span>
                            </li>
                        </ul>
                    </div>

                    <div className="lg:col-span-6 flex justify-center">
                        <motion.div
                            whileInView={{ y: [15, 0], opacity: [0, 1] }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="relative w-full max-w-md p-8 bg-white border-4 border-sky-400 rounded-3xl shadow-2xl space-y-4"
                        >
                            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                                <div className="w-14 h-14 rounded-2xl bg-cyan-100 text-cyan-600 flex items-center justify-center font-bold">
                                    <BrainCircuit className="w-8 h-8" />
                                </div>
                                <div>
                                    <h4 className="font-extrabold text-slate-950 text-lg">Báo cáo Lỗ hổng AI</h4>
                                    <p className="text-xs text-slate-500">Cập nhật theo thời gian thực</p>
                                </div>
                            </div>
                            <div className="space-y-2.5">
                                <div className="p-3 bg-sky-50 rounded-xl flex justify-between items-center text-xs font-bold text-sky-900">
                                    <span>Unit 1: My New School (Grammar)</span>
                                    <span className="text-rose-500 font-extrabold">Cần ôn lại</span>
                                </div>
                                <div className="p-3 bg-emerald-50 rounded-xl flex justify-between items-center text-xs font-bold text-emerald-900">
                                    <span>Present Simple Tense</span>
                                    <span className="text-emerald-600 font-extrabold">Đạt 92%</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </section>

            {/* 5. MỤC 2: CHUẨN SGK TIẾNG ANH 6 */}
            <section className={`py-16 sm:py-24 px-6 border-t transition-colors duration-300 ${isDark ? 'border-slate-800 bg-[#0d1635]' : 'border-slate-100 bg-white'
                }`}>
                <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                    <div className="lg:col-span-6 flex justify-center order-2 lg:order-1">
                        <motion.div
                            whileInView={{ scale: [0.9, 1], opacity: [0, 1] }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="relative w-full max-w-md p-8 bg-sky-500 text-white rounded-3xl shadow-2xl space-y-4 border-4 border-sky-600"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-white/20 text-white flex items-center justify-center font-bold mb-2">
                                <BookOpen className="w-9 h-9" />
                            </div>
                            <h3 className="text-2xl font-black">Khung chương trình chuẩn Bộ GD&ĐT</h3>
                            <p className="text-xs text-sky-100 leading-relaxed">
                                Kho bài tập và giáo án được cấu trúc hóa bám sát chương trình GDPT Tiếng Anh 6 Tập 1 & Tập 2 chuẩn bộ sách mới nhất.
                            </p>
                        </motion.div>
                    </div>

                    <div className="lg:col-span-6 space-y-5 text-center lg:text-left order-1 lg:order-2">
                        <h2 className="text-3xl sm:text-5xl font-black text-sky-500 leading-tight">
                            Bám sát chương trình SGK Tiếng Anh 6
                        </h2>
                        <p className={`text-base sm:text-lg leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                            Chúng tôi kết hợp các phương pháp giảng dạy khoa học với nội dung học thú vị để tạo nên các bài giảng hữu ích giúp học sinh luyện tập nghe, nói, đọc và viết chuẩn xác.
                        </p>
                    </div>

                </div>
            </section>

            {/* 6. MỤC 3: BÁO CÁO TRỰC QUAN & ĐỘNG LỰC */}
            <section className={`py-16 sm:py-24 px-6 border-t transition-colors duration-300 ${isDark ? 'border-slate-800 bg-[#0a1128]' : 'border-slate-100 bg-slate-50/60'
                }`}>
                <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                    <div className="lg:col-span-6 space-y-5 text-center lg:text-left">
                        <h2 className="text-3xl sm:text-5xl font-black text-sky-500 leading-tight">
                            Tiếp thêm động lực giảng dạy & học tập
                        </h2>
                        <p className={`text-base sm:text-lg leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                            Ứng dụng giúp người học dễ dàng xây dựng thói quen học tập qua những tính năng mô phỏng trò chơi, các thử thách vui vẻ và báo cáo trực quan cho giáo viên chỉ với một cú nhấp chuột.
                        </p>
                        <div className="pt-2">
                            <button
                                onClick={() => navigate('/register')}
                                className="py-3.5 px-8 bg-sky-500 hover:bg-sky-400 text-white font-black text-sm rounded-xl border-b-4 border-sky-700 transition-all active:translate-y-0.5 shadow-lg shadow-sky-500/20 uppercase tracking-wider"
                            >
                                Bắt đầu trải nghiệm
                            </button>
                        </div>
                    </div>

                    <div className="lg:col-span-6 flex justify-center">
                        <motion.div
                            whileInView={{ y: [-15, 0], opacity: [0, 1] }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="relative w-full max-w-md p-8 bg-white border-4 border-amber-400 rounded-3xl shadow-2xl text-center space-y-4"
                        >
                            <div className="w-20 h-20 mx-auto rounded-full bg-amber-100 text-amber-500 flex items-center justify-center font-bold">
                                <Award className="w-10 h-10" />
                            </div>
                            <h4 className="font-black text-slate-950 text-xl">Báo cáo trực quan xuất ngay</h4>
                            <p className="text-xs text-slate-500">Xuất báo cáo tiến độ giảng dạy & bảng điểm dễ dàng</p>
                        </motion.div>
                    </div>

                </div>
            </section>

            {/* 7. FOOTER THÔNG TIN DƯỚI CÙNG */}
            <footer className={`relative z-10 py-8 px-6 border-t text-center text-xs transition-colors duration-300 ${isDark ? 'border-cyan-500/20 text-slate-400 bg-slate-950' : 'border-slate-200 text-slate-500 bg-white'
                }`}>
                <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-sky-500" />
                        <span>Hệ thống Bảo mật Cổng Giáo Viên ERM 6</span>
                    </div>
                    <p>© 2026 ERM 6 EdTech. Tất cả quyền được bảo lưu.</p>
                </div>
            </footer>

            {/* NÚT TRƯỢT SWITCH THEME TỐI / SÁNG NẰM Ở GÓC DƯỚI BÊN PHẢI */}
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