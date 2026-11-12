import React from 'react';
import { PlusCircle, ShieldCheck, ArrowRight, FolderGit2, FileCode, Activity, Zap, Check } from 'lucide-react';
import { LiquidSculptureHero } from './ui/LiquidSculptureHero';
import { WORKSPACE_FOLDER_ID, MANIFEST_FILE_NAME } from '../services/backendGateway';

interface HeroOverviewSectionProps {
  onGoToScopeBuilder: () => void;
  onGoToStopGates: () => void;
  onGoToAIDispatcher: () => void;
  theme?: 'light' | 'dark';
}

export const HeroOverviewSection: React.FC<HeroOverviewSectionProps> = ({
  onGoToScopeBuilder,
  onGoToStopGates,
  onGoToAIDispatcher,
  theme = 'light',
}) => {
  return (
    <section className="space-y-6">
      {/* 07 • Liquid Sculpture: Header hero หลัง Top Nav และก่อน Gateway status, สูง 170-260px */}
      <div className="rounded-2xl border border-blue-200/50 dark:border-teal-500/30 overflow-hidden shadow-xl bg-gradient-to-b from-blue-50/70 to-white dark:from-[#0b101d] dark:to-[#070b12]">
        <LiquidSculptureHero height={220} theme={theme} particleDensity={0.25} />
      </div>

      {/* Scope Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 dark:bg-teal-950/70 border border-blue-300 dark:border-teal-500/30 text-blue-800 dark:text-teal-300 text-xs font-semibold">
        <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-teal-400" />
        <span>Dual-Key Ledger &amp; Self-Expanding Workspace Engine</span>
      </div>

      {/* Main Headline */}
      <div className="space-y-3">
        <h1 className="text-2xl sm:text-4xl lg:text-4xl font-extrabold text-white leading-tight">
          ระบบจัดการและตรวจสอบสัญญาอัจฉริยะ<br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-300 to-teal-400">
            {' '}พร้อมส่งคำสั่งขยายงานตรงสู่ Google Drive ของคุณ
          </span>
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
          เชื่อมต่อกับ Google Apps Script ของคุณแล้ว! คุณสามารถกดสั่งงานให้ Google AI สังเคราะห์รูปแบบหรือเพิ่มขอบเขตงาน (WORK / โมดูลใหม่) จากข้างในแอปนี้ได้ทันทีโดยไม่ต้องสลับกลับไปแก้โค้ดข้างนอก
          ระบบจะส่ง Payload ไปบันทึกอัปเดต <code className="text-teal-300 font-mono text-xs bg-slate-900 px-1.5 py-0.5 rounded border border-teal-500/30">{MANIFEST_FILE_NAME}</code> ในโฟลเดอร์{' '}
          <code className="text-teal-300 font-mono text-xs bg-slate-900 px-1.5 py-0.5 rounded border border-teal-500/30">AI_Project_Workspace</code> อัตโนมัติ
        </p>
      </div>

      {/* Primary Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        <button
          onClick={onGoToAIDispatcher}
          type="button"
          className="w-full py-3.5 px-5 rounded-2xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition glow-teal cursor-pointer"
        >
          <Zap className="w-4 h-4 text-slate-950 fill-current" />
          <span>⚡ สั่งงาน Google AI ทันที</span>
          <span>→</span>
        </button>

        <button
          onClick={onGoToScopeBuilder}
          type="button"
          className="w-full py-3.5 px-5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-teal-400/50 text-white font-semibold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-teal-400" />
          <span>+ เพิ่มขอบเขตงานใหม่ในแอปทันที</span>
          <span>→</span>
        </button>

        <button
          onClick={onGoToStopGates}
          type="button"
          className="w-full py-3.5 px-5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-teal-400/50 text-white font-semibold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <span>สำรวจระบบ 01-04 &amp; Stop Gates</span>
          <span className="text-teal-400">→</span>
        </button>
      </div>

      {/* Quick Status Bullets */}
      <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] sm:text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="text-teal-400 font-bold">✓</span>
          <span>เชื่อมลิงก์ <code className="mono text-slate-300">/exec</code> แล้ว</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-teal-400 font-bold">✓</span>
          <span>เพิ่มขอบเขตงานในแอปได้ทันที</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-teal-400 font-bold">✓</span>
          <span>ปลอดข้อมูลส่วนบุคคล 100%</span>
        </div>
      </div>

      {/* 4 Google AI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 pt-3">
        <div className="p-4 rounded-2xl bg-[#0e1626] border border-slate-800 shadow-md">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <FolderGit2 className="w-3.5 h-3.5 text-teal-400" /> Target Workspace
          </div>
          <div className="text-lg sm:text-xl font-bold text-white font-mono tracking-tight truncate">
            Drive Sync
          </div>
          <div className="text-[11px] text-teal-300 font-mono truncate mt-0.5">
            {WORKSPACE_FOLDER_ID}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0e1626] border border-slate-800 shadow-md">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <FileCode className="w-3.5 h-3.5 text-teal-400" /> Manifest Target
          </div>
          <div className="text-lg sm:text-xl font-bold text-white font-mono tracking-tight">
            ONLINE
          </div>
          <div className="text-[11px] text-teal-300 font-mono mt-0.5">
            {MANIFEST_FILE_NAME}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0e1626] border border-slate-800 shadow-md">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Stop Gate Invariants
          </div>
          <div className="text-lg sm:text-xl font-bold text-white font-mono tabular-nums tracking-tight">
            16 / 16 Active
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            V003 &amp; PDPA Zero-PII
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0e1626] border border-slate-800 shadow-md">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-teal-400" /> Web App Response
          </div>
          <div className="text-lg sm:text-xl font-bold text-white font-mono tabular-nums tracking-tight">
            &lt; 18ms
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Apps Script Exec Latency
          </div>
        </div>
      </div>
    </section>
  );
};
