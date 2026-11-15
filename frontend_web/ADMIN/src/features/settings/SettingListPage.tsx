import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Save, CheckCircle2, RotateCcw } from 'lucide-react';

interface SystemSetting {
  id: number;
  logo_app: string;
  smtp_email: string;
  smtp_password?: string;
  sms_gateway_token: string;
  sms_gateway_url: string;
  theme: 'LIGHT' | 'DARK' | 'SYSTEM';
  is_active: boolean;
}

const initialSettings: SystemSetting = {
  id: 1,
  logo_app: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=60',
  smtp_email: 'noreply.english6@education.edu.vn',
  smtp_password: '••••••••••••••••',
  sms_gateway_token: 'sk_live_sms_9988221100xxa7',
  sms_gateway_url: 'https://api.smsgateway.vn/v1/send',
  theme: 'LIGHT',
  is_active: true,
};

export const SettingListPage: React.FC = () => {
  const [formData, setFormData] = useState<SystemSetting>(initialSettings);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleChange = (field: keyof SystemSetting, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Đã lưu cấu hình hệ thống thành công!');
  };

  const handleReset = () => {
    setFormData(initialSettings);
    showToast('Đã khôi phục về cấu hình mặc định!');
  };

  return (
    <div className="space-y-6 w-full">

      {/* Header Trang */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Cài đặt Hệ thống
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors shadow-sm inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt lại mặc định</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 text-xs font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors shadow-sm inline-flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Lưu thay đổi</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">

        {/* 1. GIAO DIỆN & THƯƠNG HIỆU */}
        <div className="bg-white border border-slate-200/80 rounded-lg p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-semibold text-sm text-slate-900">
              Giao diện & Thương hiệu
            </h3>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600 font-medium">Trạng thái hoạt động:</span>
              <button
                type="button"
                onClick={() => handleChange('is_active', !formData.is_active)}
                className="cursor-pointer"
              >
                {formData.is_active ? (
                  <span className="inline-flex items-center text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded border border-emerald-200 text-[11px]">
                    Kích hoạt (Active)
                  </span>
                ) : (
                  <span className="inline-flex items-center text-slate-400 font-medium bg-slate-100 px-2 py-1 rounded border border-slate-200 text-[11px]">
                    Tạm ngưng (Inactive)
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-slate-700 font-medium mb-1.5">Logo ứng dụng (logo_app)</label>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-lg border border-slate-200 bg-slate-50 p-1 flex items-center justify-center overflow-hidden flex-shrink-0">
                  <img src={formData.logo_app} alt="Logo App" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <input
                    type="text"
                    value={formData.logo_app}
                    onChange={(e) => handleChange('logo_app', e.target.value)}
                    placeholder="Dán đường dẫn URL logo..."
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-400"
                  />
                  <p className="text-[10px] text-slate-400">Khuyên dùng ảnh PNG trong suốt kích thước 256x256px</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1.5">Giao diện mặc định (theme)</label>
              <select
                value={formData.theme}
                onChange={(e) => handleChange('theme', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:border-slate-400 font-medium"
              >
                <option value="LIGHT">Giao diện Sáng (Light Theme)</option>
                <option value="DARK">Giao diện Tối (Dark Theme)</option>
                <option value="SYSTEM">Tự động theo Thiết bị (System Theme)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. CẤU HÌNH GỬI MAIL SMTP */}
        <div className="bg-white border border-slate-200/80 rounded-lg p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-semibold text-sm text-slate-900">
              Cấu hình Máy chủ Gửi Mail (SMTP)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Email gửi thông báo (smtp_email)</label>
              <input
                type="email"
                value={formData.smtp_email}
                onChange={(e) => handleChange('smtp_email', e.target.value)}
                placeholder="noreply@domain.com"
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Mật khẩu ứng dụng SMTP (smtp_password)</label>
              <input
                type="password"
                value={formData.smtp_password}
                onChange={(e) => handleChange('smtp_password', e.target.value)}
                placeholder="••••••••••••••••"
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-400 font-mono"
              />
            </div>
          </div>
        </div>

        {/* 3. CẤU HÌNH SMS GATEWAY */}
        <div className="bg-white border border-slate-200/80 rounded-lg p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-semibold text-sm text-slate-900">
              Cấu hình Cổng tin nhắn SMS Gateway
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Địa chỉ SMS API Endpoint (sms_gateway_url)</label>
              <input
                type="text"
                value={formData.sms_gateway_url}
                onChange={(e) => handleChange('sms_gateway_url', e.target.value)}
                placeholder="https://api.smsgateway.vn/v1/send"
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-400 font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Mã Token xác thực SMS (sms_gateway_token)</label>
              <input
                type="password"
                value={formData.sms_gateway_token}
                onChange={(e) => handleChange('sms_gateway_token', e.target.value)}
                placeholder="Token SMS API..."
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:bg-white focus:border-slate-400 font-mono text-[11px]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors shadow-sm inline-flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Lưu tất cả cấu hình hệ thống</span>
          </button>
        </div>

      </form>

      {toastMessage && createPortal(
        <div className="fixed bottom-5 right-5 z-[10000] flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white rounded-lg shadow-xl text-xs font-medium animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 stroke-[2]" />
          <span>{toastMessage}</span>
        </div>,
        document.body
      )}

    </div>
  );
};