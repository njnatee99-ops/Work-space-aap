import React from 'react';
import { Shield, ExternalLink } from 'lucide-react';

interface FooterProps {
  onOpenGatewayModal: () => void;
  onOpenLogsDrawer: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenGatewayModal, onOpenLogsDrawer }) => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-[#060910] text-slate-400 py-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800/80">
          {/* Col 1: Wordmark & Statement */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-teal-300 flex items-center justify-center text-slate-950 font-black text-sm">
                N
              </div>
              <span className="text-base font-bold text-white tracking-tight">NexusLedger</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              โครงสร้างพื้นฐานการกำกับดูแล Smart Contract และการนำเข้าบัญชีคู่ระดับองค์กร พร้อมเกตเวย์เชื่อมต่อหลังบ้านแบบเรียลไทม์
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-200 tracking-wider">ระบบหลัก</div>
            <ul className="space-y-1.5">
              <li>
                <a href="#hero" className="hover:text-cyan-400 transition-colors">
                  หน้าแรก &amp; สถานะการเชื่อมต่อ
                </a>
              </li>
              <li>
                <a href="#bento" className="hover:text-cyan-400 transition-colors">
                  Bento Grid 01-04
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-cyan-400 transition-colors">
                  แพ็กเกจและราคา
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-cyan-400 transition-colors">
                  ติดต่อทีมวิศวกรรม
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Gateway & Utilities */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-200 tracking-wider">เครื่องมือเกตเวย์</div>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={onOpenGatewayModal}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left"
                >
                  กำหนดค่า Backend Endpoint
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenLogsDrawer}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left"
                >
                  Live Payload Drawer
                </button>
              </li>
              <li>
                <span className="text-slate-500">Dual-Key Ingestion API (v1)</span>
              </li>
              <li>
                <span className="text-slate-500">16 Stop Gates Invariants</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Compliance */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-200 tracking-wider">มาตรฐานความปลอดภัย</div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              รองรับมาตรฐาน ERC-4337, Account Abstraction, Zero-Knowledge Verification และการตรวจสอบลายเซ็น HMAC SHA-256
            </p>
            <div className="pt-1 flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
              <Shield className="w-3.5 h-3.5" />
              <span>Cryptographic Invariant Sealed</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} NexusLedger Platform. สงวนลิขสิทธิ์ทุกประการ.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">นโยบายความเป็นส่วนตัว</span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-slate-400 cursor-pointer">ข้อกำหนดการใช้งาน</span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-slate-400 cursor-pointer">SLA Agreement</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
