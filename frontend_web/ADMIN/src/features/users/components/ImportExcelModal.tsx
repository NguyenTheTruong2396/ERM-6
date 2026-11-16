import React, { useState } from 'react';
import { X, UploadCloud, Download, CheckCircle2 } from 'lucide-react';

interface ImportExcelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ImportExcelModal: React.FC<ImportExcelModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Giả lập hiệu ứng Upload UI không cần kết nối Backend API
  const handleUpload = () => {
    if (!selectedFile) return;
    setIsUploading(true);

    // Giả lập thời gian xử lý 1 giây
    setTimeout(() => {
      setIsUploading(false);
      setSuccessMessage(`Đã nhập thành công danh sách từ file ${selectedFile.name}!`);
      if (onSuccess) onSuccess();

      // Tự động đóng modal sau 1.5s
      setTimeout(() => {
        onClose();
        setSuccessMessage(null);
        setSelectedFile(null);
      }, 1500);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in duration-150">

        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 tracking-tight">Nhập danh sách học sinh từ Excel</h3>
            <p className="text-xs text-slate-500 mt-0.5">Tải lên file danh sách học sinh lớp 6 theo định dạng chuẩn.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors">
            <X className="w-4 h-4 stroke-[1.5]" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {successMessage ? (
            <div className="p-8 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <div className="text-sm font-semibold text-slate-900">{successMessage}</div>
              <p className="text-xs text-slate-400">Đang cập nhật danh sách hiển thị...</p>
            </div>
          ) : (
            <>
              <label className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center hover:border-slate-300 transition-colors bg-slate-50/50 block cursor-pointer">
                <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} className="hidden" />
                <div className="mx-auto w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mb-3">
                  <UploadCloud className="w-5 h-5 stroke-[1.5]" />
                </div>
                <div className="text-xs font-medium text-slate-700">
                  {selectedFile ? (
                    <span className="text-emerald-600 font-semibold">{selectedFile.name}</span>
                  ) : (
                    <>Kéo thả file .xlsx, .xls vào đây, hoặc <span className="text-slate-900 font-semibold underline underline-offset-2">chọn file</span></>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Dung lượng tối đa 10MB. Định dạng hỗ trợ: .xlsx, .xls</p>
              </label>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-500">Chưa có file mẫu chuẩn?</span>
                <a href="#template" onClick={(e) => { e.preventDefault(); alert('Đã tải xuống file mẫu Excel!'); }} className="inline-flex items-center gap-1.5 font-medium text-slate-900 hover:underline underline-offset-2">
                  <Download className="w-3.5 h-3.5 stroke-[1.5]" />
                  Tải file mẫu Excel (.xlsx)
                </a>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!successMessage && (
          <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="px-3.5 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 rounded-md transition-colors shadow-sm"
            >
              {isUploading ? 'Đang xử lý...' : 'Tiến hành nhập'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};