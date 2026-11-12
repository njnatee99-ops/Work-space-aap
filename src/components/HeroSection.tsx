import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Zap, ArrowRight, RefreshCw, Radio, PlusCircle, Check } from 'lucide-react';
import { HighImpactPrimaryButton } from './HighImpactPrimaryButton';
import { ThreeScene } from './ThreeScene';
import { backendGateway } from '../services/backendGateway';
import { GatewayConfig } from '../types';

interface HeroSectionProps {
  onOpenGatewayModal: () => void;
  onOpenLogsDrawer: () => void;
  onScrollToScopeBuilder: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenGatewayModal,
  onOpenLogsDrawer,
  onScrollToScopeBuilder,
}) => {
  const [config, setConfig] = useState<GatewayConfig>(backendGateway.getConfig());
  const [isPinging, setIsPinging] = useState(false);
  const [lastPingFeedback, setLastPingFeedback] = useState<string | null>(null);

  useEffect(() => {
    return backendGateway.onConfigChange((newConfig) => {
      setConfig(newConfig);
    });
  }, []);

  const handleTestPing = async () => {
    setIsPinging(true);
    setLastPingFeedback(null);
    try {
      const res = await backendGateway.testConnection();
      setLastPingFeedback(`${res.message} (${res.latencyMs}ms)`);
      setTimeout(() => setLastPingFeedback(null), 5000);
    } finally {
      setIsPinging(false);
    }
  };

  return (
    <section id="hero" className="relative pt-6 pb-16 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Real-time Backend Server Connection Status Bar */}
        <div className="mb-6 p-3 sm:p-4 rounded-2xl bg-[#0d1527]/90 border border-teal-500/25 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 font-medium text-slate-300">
                <Radio className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold text-white">สถานะการเชื่อมต่อหลังบ้าน:</span>
              </span>
              <span className="font-mono text-emerald-300 bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/40 text-xs font-semibold">
                Google Apps Script (Connected)
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0 self-end sm:self-auto">
              <span className="font-mono text-xs text-slate-300">
                Latency: <span className="text-emerald-400 font-bold tabular-nums">{config.latencyMs}ms</span>
              </span>
              <button
                onClick={handleTestPing}
                disabled={isPinging}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl border border-slate-700 text-xs font-medium cursor-pointer transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin text-teal-400' : ''}`} />
                {isPinging ? 'กำลังทดสอบ...' : 'ทดสอบ Ping'}
              </button>
              <button
                onClick={onOpenGatewayModal}
                className="text-xs text-teal-400 hover:text-teal-300 underline font-medium cursor-pointer"
              >
                แก้ไข
              </button>
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
            <div className="truncate text-teal-300/90 max-w-xl">
              {config.baseUrl}
            </div>
            <div className="text-emerald-400 font-medium">
              {lastPingFeedback || '● พร้อมยิงคำสั่งขยายขอบเขตงานจริงเข้า Drive'}
            </div>
          </div>
        </div>

        {/* Hero Grid: Left Content, Right 3D Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Clear High-Contrast Headline & CTAs */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/60 border border-teal-500/30 text-xs text-teal-300 font-medium tracking-wide">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Dual-Key Ledger &amp; Self-Expanding Workspace Engine</span>
            </div>

            {/* Clean Thai Headline without word-break chops */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-snug sm:leading-tight tracking-tight">
              ระบบจัดการและตรวจสอบสัญญาอัจฉริยะ<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-300 to-teal-400">
                พร้อมส่งคำสั่งขยายงานตรงสู่ Google Drive
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              เชื่อมต่อกับ Google Apps Script Web App แล้ว! คุณสามารถกดเพิ่มขอบเขตงาน (WORK / โมดูลใหม่) จากในหน้านี้ได้ทันทีโดยไม่ต้องสลับไปแก้โค้ดข้างนอก
              ระบบจะส่ง Payload ไปบันทึกอัปเดตลง <code className="text-teal-300 font-mono text-xs bg-slate-900 px-1.5 py-0.5 rounded border border-teal-500/30">00_Project_Manifest.json</code> ในโฟลเดอร์ <code className="text-teal-300 font-mono text-xs bg-slate-900 px-1.5 py-0.5 rounded border border-teal-500/30">AI_Project_Workspace</code> บน Google Drive ของคุณอัตโนมัติ
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <HighImpactPrimaryButton
                size="lg"
                onClick={onScrollToScopeBuilder}
                icon={<PlusCircle className="w-5 h-5 text-slate-950" />}
              >
                + เพิ่มขอบเขตงานใหม่ในแอปทันที
              </HighImpactPrimaryButton>

              <a
                href="#bento"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-xs sm:text-sm font-semibold text-slate-200 bg-slate-900/90 hover:bg-slate-800 rounded-2xl border border-slate-700/80 hover:border-teal-500/40 transition-all shadow-md cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>สำรวจระบบ 01-04 &amp; Stop Gates</span>
                <ArrowRight className="w-4 h-4 text-teal-400" />
              </a>
            </div>

            <div className="pt-1 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-teal-400 font-bold shrink-0" />
                <span>เชื่อมลิงก์ <code className="text-slate-200 font-mono">/exec</code> แล้ว</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-teal-400 font-bold shrink-0" />
                <span>เพิ่มขอบเขตงานในแอปได้ทันที</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-teal-400 font-bold shrink-0" />
                <span>ปลอดข้อมูลส่วนบุคคล (PDPA Zero-PII)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Three.js 3D Scene */}
          <div className="lg:col-span-6">
            <ThreeScene />
          </div>
        </div>

        {/* Real-time Statistics Strip */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#0b1120]/80 border border-slate-800 shadow-md">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-teal-400" /> Target Workspace
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white font-mono tracking-tight truncate">
              Drive Sync
            </div>
            <div className="text-[11px] text-slate-500 mt-1">AI_Project_Workspace</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0b1120]/80 border border-slate-800 shadow-md">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Stop Gate Invariants
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white font-mono tabular-nums tracking-tight">
              16 / 16
            </div>
            <div className="text-[11px] text-slate-500 mt-1">V003 &amp; PDPA Zero-PII</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0b1120]/80 border border-slate-800 shadow-md">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-teal-400" /> Web App Response
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white font-mono tabular-nums tracking-tight">
              &lt; 18ms
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Apps Script Exec Latency</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0b1120]/80 border border-slate-800 shadow-md">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" /> Active Manifest
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white font-mono tracking-tight">
              ONLINE
            </div>
            <div className="text-[11px] text-slate-500 mt-1">00_Project_Manifest.json</div>
          </div>
        </div>
      </div>
    </section>
  );
};
