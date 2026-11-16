import React, { useState, useRef } from 'react';
import {
    Camera,
    User,
    Mail,
    Phone,
    Lock,
    CheckCircle2,
    Eye,
    EyeOff,
    Save,
    ShieldCheck,
    BadgeCheck,
    GraduationCap,
    Users,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const TeacherProfilePage: React.FC = () => {
    const savedProfile = (() => {
        try {
            const raw = localStorage.getItem('erm6_teacher_profile');
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    })();

    const [name, setName] = useState<string>(savedProfile?.name || 'Thầy A');
    const [email, setEmail] = useState<string>(savedProfile?.email || 'a@gmail.com');
    const [phone, setPhone] = useState<string>(savedProfile?.phone || '0901 234 567');
    const [avatarUrl, setAvatarUrl] = useState<string>(savedProfile?.avatarUrl || '');

    // State đổi mật khẩu
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPasswords, setShowPasswords] = useState(false);

    // Thông báo trạng thái
    const [infoSuccess, setInfoSuccess] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState<{
        type: 'success' | 'error';
        text: string;
    } | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                setAvatarUrl(reader.result);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleSaveInfo = (e: React.FormEvent) => {
        e.preventDefault();
        const updated = {
            name: name.trim() || 'Thầy A',
            email: email.trim(),
            phone: phone.trim(),
            avatarUrl,
        };
        localStorage.setItem('erm6_teacher_profile', JSON.stringify(updated));
        window.dispatchEvent(new Event('teacherProfileUpdated'));
        setInfoSuccess(true);
        setTimeout(() => setInfoSuccess(false), 3000);
    };

    const handleChangePassword = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'Vui lòng nhập đầy đủ các trường mật khẩu.' });
            return;
        }
        if (newPassword.length < 6) {
            setPasswordMessage({ type: 'error', text: 'Mật khẩu mới phải có ít nhất 6 ký tự.' });
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'Xác nhận mật khẩu mới chưa khớp.' });
            return;
        }
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordMessage({ type: 'success', text: 'Đã cập nhật mật khẩu thành công!' });
        setTimeout(() => setPasswordMessage(null), 3500);
    };

    const initials = name.trim().slice(0, 1).toUpperCase() || 'A';

    return (
        <div className="space-y-8 font-sans pb-10 select-none w-full">
            {/* Tiêu đề trang */}
            <div className="pb-1">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Hồ sơ cá nhân giáo viên
                </h1>
            </div>

            {/* Bố cục 12 cột */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* Cột trái (4 cols): Thẻ hồ sơ xếp khít gọn gàng, không còn khoảng trắng giữa */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="lg:col-span-4 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs flex flex-col space-y-5"
                >
                    {/* Phần trên: Avatar + Tên + Nút tải ảnh */}
                    <div className="flex flex-col items-center text-center space-y-3.5">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-3xl bg-sky-600 text-white font-black text-3xl flex items-center justify-center overflow-hidden shadow-sm border-4 border-sky-50">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                                ) : (
                                    initials
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute -bottom-1.5 -right-1.5 w-8 h-8 rounded-xl bg-slate-900 text-white hover:bg-sky-600 flex items-center justify-center shadow-md transition-colors cursor-pointer"
                                title="Thay đổi ảnh đại diện"
                            >
                                <Camera className="w-3.5 h-3.5" />
                            </button>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="hidden"
                            />
                        </div>

                        <div className="space-y-0.5">
                            <div className="inline-flex items-center gap-1.5 justify-center">
                                <h2 className="text-base font-black text-slate-900">{name}</h2>
                                <BadgeCheck className="w-4 h-4 text-sky-600" />
                            </div>
                            <p className="text-xs font-medium text-slate-500">{email}</p>
                        </div>

                        <div className="w-full flex flex-col gap-1.5 pt-1">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full py-2.5 px-4 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-extrabold transition-colors cursor-pointer"
                            >
                                Tải ảnh đại diện mới
                            </button>
                            {avatarUrl && (
                                <button
                                    type="button"
                                    onClick={() => setAvatarUrl('')}
                                    className="w-full py-1 px-4 rounded-xl text-slate-400 hover:text-rose-600 text-[11px] font-bold transition-colors cursor-pointer"
                                >
                                    Gỡ ảnh hiện tại
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Phần dưới: Chi tiết thông tin giảng dạy */}
                    <div className="border-t border-slate-100 pt-4 space-y-2.5 text-xs">
                        <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                            Thông tin giảng dạy
                        </div>

                        <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-slate-50/80 border border-slate-100">
                            <span className="inline-flex items-center gap-2 font-semibold text-slate-500">
                                <User className="w-3.5 h-3.5 text-slate-400" /> Mã giáo viên
                            </span>
                            <span className="font-mono font-extrabold text-slate-900">GV-ENG06</span>
                        </div>

                        <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-slate-50/80 border border-slate-100">
                            <span className="inline-flex items-center gap-2 font-semibold text-slate-500">
                                <Phone className="w-3.5 h-3.5 text-slate-400" /> Số điện thoại
                            </span>
                            <span className="font-extrabold text-slate-900">{phone || 'Chưa cập nhật'}</span>
                        </div>

                        <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-slate-50/80 border border-slate-100">
                            <span className="inline-flex items-center gap-2 font-semibold text-slate-500">
                                <GraduationCap className="w-3.5 h-3.5 text-slate-400" /> Lớp phụ trách
                            </span>
                            <span className="font-extrabold text-sky-700">6A1, 6A2, 6A3</span>
                        </div>

                        <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-slate-50/80 border border-slate-100">
                            <span className="inline-flex items-center gap-2 font-semibold text-slate-500">
                                <Users className="w-3.5 h-3.5 text-slate-400" /> Tổng sĩ số
                            </span>
                            <span className="font-extrabold text-slate-900">90 học sinh</span>
                        </div>

                        <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
                            <span className="font-semibold text-emerald-700">Trạng thái</span>
                            <span className="inline-flex items-center gap-1.5 font-extrabold text-emerald-700">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Đang hoạt động
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Cột phải (8 cols): Form thông tin cơ bản & Đổi mật khẩu */}
                <div className="lg:col-span-8 flex flex-col space-y-6">
                    {/* Form 1: Tên, Gmail & Số điện thoại */}
                    <motion.form
                        onSubmit={handleSaveInfo}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.05 }}
                        className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4"
                    >
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-sky-600" />
                                <h3 className="text-sm font-black text-slate-900">Thông tin tài khoản</h3>
                            </div>
                            {infoSuccess && (
                                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Đã lưu thay đổi
                                </span>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-extrabold text-slate-700">
                                    Tên hiển thị giáo viên
                                </label>
                                <div className="relative">
                                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        placeholder="Nhập họ và tên..."
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-sky-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-extrabold text-slate-700">
                                    Địa chỉ Gmail
                                </label>
                                <div className="relative">
                                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="example@gmail.com"
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-sky-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-extrabold text-slate-700">
                                    Số điện thoại
                                </label>
                                <div className="relative">
                                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="09xx xxx xxx"
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-sky-500 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-1">
                            <button
                                type="submit"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-extrabold shadow-xs transition-all cursor-pointer"
                            >
                                <Save className="w-4 h-4" />
                                <span>Lưu thông tin</span>
                            </button>
                        </div>
                    </motion.form>

                    {/* Form 2: Đổi mật khẩu */}
                    <motion.form
                        onSubmit={handleChangePassword}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4"
                    >
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-sky-600" />
                                <h3 className="text-sm font-black text-slate-900">Đổi mật khẩu</h3>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowPasswords(!showPasswords)}
                                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-500 hover:text-sky-600 cursor-pointer"
                            >
                                {showPasswords ? (
                                    <>
                                        <EyeOff className="w-3.5 h-3.5" /> Ẩn mật khẩu
                                    </>
                                ) : (
                                    <>
                                        <Eye className="w-3.5 h-3.5" /> Hiện mật khẩu
                                    </>
                                )}
                            </button>
                        </div>

                        {passwordMessage && (
                            <div
                                className={`p-3 rounded-xl text-xs font-bold border ${passwordMessage.type === 'success'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : 'bg-rose-50 text-rose-700 border-rose-200'
                                    }`}
                            >
                                {passwordMessage.text}
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-extrabold text-slate-700">
                                    Mật khẩu hiện tại
                                </label>
                                <div className="relative">
                                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type={showPasswords ? 'text' : 'password'}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="Mật khẩu hiện tại..."
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-sky-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-extrabold text-slate-700">
                                    Mật khẩu mới
                                </label>
                                <div className="relative">
                                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type={showPasswords ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Tối thiểu 6 ký tự..."
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-sky-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-extrabold text-slate-700">
                                    Xác nhận mật khẩu mới
                                </label>
                                <div className="relative">
                                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type={showPasswords ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Nhập lại mật khẩu..."
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-sky-500 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-1">
                            <button
                                type="submit"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold shadow-xs transition-all cursor-pointer"
                            >
                                <Lock className="w-4 h-4" />
                                <span>Cập nhật mật khẩu</span>
                            </button>
                        </div>
                    </motion.form>
                </div>

            </div>
        </div>
    );
};