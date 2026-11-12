import React, { useState } from 'react';
import { X, Github, Download, Copy, Check, Terminal, FileCode, ExternalLink, Sparkles, Folder } from 'lucide-react';
import { LiquidButton } from './ui/liquid-glass-button';

interface ExportCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenGasModal: () => void;
}

export const ExportCodeModal: React.FC<ExportCodeModalProps> = ({
  isOpen,
  onClose,
  onOpenGasModal,
}) => {
  const [activeTab, setActiveTab] = useState<'quick' | 'github' | 'local'>('quick');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/35 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl border border-white/90 dark:border-slate-800 shadow-[0_24px_60px_-12px_rgba(20,50,110,0.22)] flex flex-col overflow-hidden text-[#14243A] dark:text-white">
        {/* Header */}
        <div className="px-6 py-5 bg-white/80 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-teal-500/15 border border-blue-100 flex items-center justify-center text-blue-600 dark:text-teal-400 shadow-xs">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#14243A] dark:text-white">
                วิธีนำโค้ดและโปรเจกต์ออกไปใช้งาน (Export & Run)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                เลือกวิธีที่สะดวกที่สุดในการนำโค้ดไปเปิดบนคอมพิวเตอร์ของคุณ
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="px-6 pt-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('quick')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'quick'
                ? 'bg-blue-600 text-white shadow-sm font-bold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>1. ส่งออกทาง GitHub (แนะนำ)</span>
          </button>

          <button
            onClick={() => setActiveTab('local')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'local'
                ? 'bg-blue-600 text-white shadow-sm font-bold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>2. คำสั่งรันบนคอมพิวเตอร์</span>
          </button>

          <button
            onClick={() => setActiveTab('github')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'github'
                ? 'bg-blue-600 text-white shadow-sm font-bold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>3. คัดลอกแยกไฟล์ / ปุ่ม Liquid</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs leading-relaxed">
          {activeTab === 'quick' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-start gap-3.5">
                <Github className="w-6 h-6 text-slate-900 shrink-0 mt-0.5" />
                <div className="space-y-1.5">
                  <h4 className="text-sm font-bold text-slate-900">
                    วิธีที่ 1: ส่งออกเข้า GitHub ด้วย 1 คลิก (ง่ายและเร็วที่สุด)
                  </h4>
                  <p className="text-slate-600">
                    มองไปที่ <strong>มุมขวาบนของหน้าจอ AI Studio</strong> (ตรงแถบเดียวกับปุ่ม Share และ Publish)
                  </p>
                  <ol className="list-decimal pl-4 space-y-1 text-slate-700 font-medium">
                    <li>คลิกที่ไอคอน <strong>GitHub (รูปแมว Octocat)</strong> ที่มุมขวาบน</li>
                    <li>เลือกบัญชี GitHub ของคุณ แล้วกด <strong>Export to GitHub</strong></li>
                    <li>ระบบจะสร้าง Repository พร้อมโค้ดทั้งหมดให้โดยอัตโนมัติ คุณสามารถโหลด ZIP หรือโคลนลงเครื่องได้ทันที</li>
                  </ol>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <Folder className="w-4 h-4 text-blue-600" />
                  <span>วิธีที่ 2: ดูโค้ดผ่านแถบเมนูด้านบนของหน้าต่าง Preview</span>
                </div>
                <p className="text-slate-600">
                  เหนือหน้าจอตัวอย่างที่คุณกำลังดูอยู่ จะมีปุ่ม <strong>&lt;/&gt; (ดูโค้ด)</strong> และ <strong>ไอคอนรูปโฟลเดอร์ 📁</strong> คุณสามารถกดเพื่อเลือกเปิดดูโค้ดของไฟล์ใดก็ได้ และสามารถกดคัดลอก (Copy) ไปใช้งานได้ทันที
                </p>
              </div>
            </div>
          )}

          {activeTab === 'local' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-blue-600" />
                <span>ขั้นตอนการรันโปรเจกต์บนเครื่องของคุณ (Localhost)</span>
              </h4>

              <div className="space-y-2">
                <span className="text-slate-600 font-medium">1. ติดตั้ง Dependencies (ทำครั้งแรกครั้งเดียว):</span>
                <div className="relative">
                  <pre className="p-3.5 rounded-xl bg-slate-900 text-blue-200 font-mono text-xs">
                    npm install
                  </pre>
                  <button
                    onClick={() => copyToClipboard('npm install', 'npm-install')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold cursor-pointer transition flex items-center gap-1 border border-slate-700"
                  >
                    {copiedCmd === 'npm-install' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCmd === 'npm-install' ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-slate-600 font-medium">2. เริ่มรันโปรเจกต์ (พอร์ต 3000):</span>
                <div className="relative">
                  <pre className="p-3.5 rounded-xl bg-slate-900 text-blue-200 font-mono text-xs">
                    npm run dev
                  </pre>
                  <button
                    onClick={() => copyToClipboard('npm run dev', 'npm-run-dev')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold cursor-pointer transition flex items-center gap-1 border border-slate-700"
                  >
                    {copiedCmd === 'npm-run-dev' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCmd === 'npm-run-dev' ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  เมื่อรันแล้ว เปิดเบราว์เซอร์ไปที่ <code className="text-blue-700 font-bold">http://localhost:3000</code> เพื่อใช้งาน
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-slate-600 font-medium">3. สั่ง Build สำหรับใช้งานจริง (Production):</span>
                <div className="relative">
                  <pre className="p-3.5 rounded-xl bg-slate-900 text-blue-200 font-mono text-xs">
                    npm run build
                  </pre>
                  <button
                    onClick={() => copyToClipboard('npm run build', 'npm-build')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold cursor-pointer transition flex items-center gap-1 border border-slate-700"
                  >
                    {copiedCmd === 'npm-build' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCmd === 'npm-build' ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'github' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-blue-600" />
                <span>ตำแหน่งไฟล์สำคัญที่คุณสามารถคัดลอกไปใช้เดี่ยวๆ ได้</span>
              </h4>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-800">
                    1. โค้ดปุ่มกระจกใส (Liquid Glass Button)
                  </div>
                  <span className="text-[11px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
                    /src/components/ui/liquid-glass-button.tsx
                  </span>
                </div>
                <p className="text-slate-600">
                  ไฟล์คอมโพเนนต์ปุ่มกระจกน้ำใส สไตล์ iOS พร้อมเอฟเฟกต์เรืองแสงและเงากระจก นำไปวางในโฟลเดอร์ <code>/components/ui/</code> ของโปรเจกต์ React + Tailwind ใดๆ ได้ทันที
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-800">
                    2. โค้ดหลังบ้าน Google Apps Script (Code.gs)
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenGasModal();
                    }}
                    className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    เปิดดูและคัดลอก 1-Click →
                  </button>
                </div>
                <p className="text-slate-600">
                  โค้ด Google Apps Script Web App สำหรับรับคำสั่งและเขียนไฟล์ Manifest ลงโฟลเดอร์ Google Drive (AI_Project_Workspace)
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:px-6 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-slate-500 text-[11px]">
            มีเอกสารคู่มือฉบับเต็มอยู่ในไฟล์ <strong>BUTTON_USAGE_GUIDE.md</strong> ในโปรเจกต์
          </span>
          <LiquidButton
            size="default"
            onClick={onClose}
            className="text-xs font-bold cursor-pointer shadow-xs"
          >
            <span>เข้าใจแล้ว ปิดหน้าต่าง</span>
          </LiquidButton>
        </div>
      </div>
    </div>
  );
};
