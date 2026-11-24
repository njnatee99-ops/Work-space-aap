import React from 'react';
import {
  Layers,
  ChevronRight,
  Bot,
  Printer,
  Settings,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { GatewayConfig } from '../types';
import { LiquidButton } from './ui/liquid-glass-button';
import { GlassBox } from './ui/glass-box';
import { CrdLiveOperationsPanel } from './CrdLiveOperationsPanel';

interface CleanHubDashboardProps {
  config: GatewayConfig;
  scopesCount: number;
  logCount: number;
  onNavigate: (
    view:
      | 'work4-studio'
      | 'ai-chat'
      | '3d-view'
      | 'ai-studio'
      | 'scope-builder'
      | 'stop-gates'
      | 'gascode'
      | 'proposed-work'
      | 'admin-hub'
  ) => void;
  onOpenGatewayModal: () => void;
  onOpenLogsModal: () => void;
  onOpenExportModal?: () => void;
  theme: 'light' | 'dark';
}

export const CleanHubDashboard: React.FC<CleanHubDashboardProps> = ({
  onNavigate,
}) => {
  // หน้าบ้าน (Front-of-House): เฉพาะงานปฏิบัติการหลักที่ใช้งานจริงทุกวัน ไม่ปนโค้ดหรือเครื่องมือหลังบ้าน
  const frontOperations = [
    {
      id: 'proposed-work' as const,
      title: 'ศูนย์ปฏิบัติการ WORK 1–9',
      subtitle: 'งานพ้นสมาชิกภาพ · ติดตามหนี้ · เมลสาขา · ผ่อนผัน',
      badge: '9 สายงานหลัก',
      icon: <Layers className="w-6 h-6 text-blue-600 dark:text-teal-400" />,
      actionText: 'เข้าหน้าปฏิบัติการ WORK 1–9',
      highlight: true,
    },
    {
      id: 'work4-studio' as const,
      title: 'ห้องพิมพ์จดหมาย WORK 4 & EMS',
      subtitle: 'เลือกหมวดผู้รับ 9 หมวด ตรวจเลขสมาชิก 5 หลัก พรีวิวคู่ก่อนพิมพ์',
      badge: 'CMS-2 · 9 หมวด',
      icon: <Printer className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      actionText: 'เปิดห้องพิมพ์จดหมาย',
      highlight: false,
    },
    {
      id: 'ai-chat' as const,
      title: 'ผู้ช่วย AI แชท CRD',
      subtitle: 'ถาม-ตอบกฎระเบียบ สรุปงาน และส่งขอบเขตงานเข้าระบบ',
      badge: 'AI Assistant',
      icon: <Bot className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      actionText: 'เปิดแชทผู้ช่วย AI',
      highlight: false,
    },
  ];

  return (
    <section className="space-y-5">
      {/* Compact Hero Header for iPhone 15 Pro Max (No Clutter, No Template Badges) */}
      <GlassBox variant="frosted" className="p-5 sm:p-6 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-teal-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            หน้าบ้านปฏิบัติการจริง (Front Office)
          </span>
          <button
            type="button"
            onClick={() => onNavigate('admin-hub')}
            className="touch-target inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100/90 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>ไปหลังบ้าน</span>
          </button>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#14243A] dark:text-white">
          เลือกสายงานที่ต้องการดำเนินการ
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          รวมงานปฏิบัติการจริง WORK 1–9, พิมพ์จดหมาย EMS และผู้ช่วย AI ไว้หน้าเดียว ส่วนตั้งค่า Gateway, โค้ด และ Logs แยกไปไว้หน้าหลังบ้านเรียบร้อยแล้ว
        </p>
      </GlassBox>

      {/* Primary Front-of-House Action Cards (Large Touch Targets for iPhone 15 Pro Max) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {frontOperations.map((card) => (
          <GlassBox
            key={card.id}
            variant="default"
            interactive={true}
            onClick={() => onNavigate(card.id)}
            className="group"
          >
            <div className="p-5 flex flex-col justify-between space-y-4 h-full">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-100/90 dark:bg-slate-900 border border-white dark:border-slate-800 shadow-2xs">
                    {card.icon}
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/90 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700">
                    {card.badge}
                  </span>
                </div>
                <div className="space-y-1">
                  <h2 className="text-base font-bold text-[#14243A] dark:text-white group-hover:text-blue-700 dark:group-hover:text-teal-300 transition-colors">
                    {card.title}
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {card.subtitle}
                  </p>
                </div>
              </div>

              <LiquidButton
                size="default"
                variant={card.highlight ? 'glowing' : 'default'}
                glow={card.highlight}
                className="touch-target w-full text-xs font-bold cursor-pointer"
              >
                <span>{card.actionText}</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </LiquidButton>
            </div>
          </GlassBox>
        ))}
      </div>

      {/* Live Dispatch Operations Panel (Separated per Workstream) */}
      <CrdLiveOperationsPanel />

      {/* Compact Safety Footer Pill */}
      <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>มาตรฐาน Zero-PII & Read-Only 100%</span>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('admin-hub')}
          className="font-semibold text-blue-700 dark:text-teal-400 hover:underline cursor-pointer"
        >
          จัดการหลังบ้าน →
        </button>
      </div>
    </section>
  );
};
