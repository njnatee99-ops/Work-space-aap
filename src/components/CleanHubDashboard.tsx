import React from 'react';
import {
  Sparkles,
  PlusCircle,
  ShieldCheck,
  Code2,
  Terminal,
  Settings,
  ArrowRight,
  Layers,
  CheckCircle2,
  ChevronRight,
  Zap,
  Download
} from 'lucide-react';
import { GatewayConfig } from '../types';
import { WORKSPACE_FOLDER_ID, MANIFEST_FILE_NAME } from '../services/backendGateway';
import { LiquidButton } from './ui/liquid-glass-button';
import { GlassBox } from './ui/glass-box';

interface CleanHubDashboardProps {
  config: GatewayConfig;
  scopesCount: number;
  logCount: number;
  onNavigate: (view: 'ai-studio' | 'scope-builder' | 'stop-gates' | 'gascode' | 'proposed-work') => void;
  onOpenGatewayModal: () => void;
  onOpenLogsModal: () => void;
  onOpenExportModal?: () => void;
  theme: 'light' | 'dark';
}

export const CleanHubDashboard: React.FC<CleanHubDashboardProps> = ({
  config,
  scopesCount,
  logCount,
  onNavigate,
  onOpenGatewayModal,
  onOpenLogsModal,
  onOpenExportModal,
  theme,
}) => {
  const isLight = theme === 'light';

  const menuCards = [
    {
      id: 'ai-studio',
      title: 'สั่ง Google AI ออกแบบ UI ในแอป',
      desc: 'ระบบอ่านโค้ดของตัวเองแบบ Introspection แล้วให้ AI (Gemini Flash) สังเคราะห์หน้าจอใหม่และสเปกขอบเขตงานได้ทันที',
      badge: 'Gemini 3.8 Flash',
      badgeColor: 'bg-white/85 text-blue-900 border-slate-200/90 font-bold',
      icon: <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      onClick: () => onNavigate('ai-studio'),
      actionText: 'สั่ง AI ออกแบบ UI',
      hasHighlight: true, // Radiant glowing border
      highlightTag: 'อัปเดตล่าสุด',
    },
    {
      id: 'scope-builder',
      title: 'เพิ่มขอบเขตงาน (Scope Builder)',
      desc: 'แม่แบบขอบเขตงานด่วน WORK 1 (แยก พม.), WORK 4 (พิมพ์จดหมาย 9 หมวด), กฎ V003 และฟอร์มยิงขอบเขตงานเข้า Drive',
      badge: `${scopesCount} ขอบเขตงาน`,
      badgeColor: 'bg-white/85 text-slate-800 border-slate-200/90 font-bold',
      icon: <PlusCircle className="w-6 h-6 text-teal-600 dark:text-teal-400" />,
      onClick: () => onNavigate('scope-builder'),
      actionText: 'จัดการขอบเขตงาน',
      hasHighlight: false,
    },
    {
      id: 'stop-gates',
      title: 'ตรวจ 16 ด่าน Stop Gates & PDPA',
      desc: 'ระบบ 01–04 (Leading Zero 5 หลัก, คีย์สัญญา Dual-Key, PDPA Zero-PII ปลอดข้อมูลส่วนบุคคล) และเมทริกซ์ 16 ด่านควบคุม',
      badge: '16/16 ผ่านตรวจ',
      badgeColor: 'bg-white/85 text-emerald-800 border-slate-200/90 font-bold',
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      onClick: () => onNavigate('stop-gates'),
      actionText: 'ตรวจสอบ 16 ด่าน',
      hasHighlight: false,
    },
    {
      id: 'proposed-work',
      title: 'ผังงาน CRD WORK 1–9',
      desc: 'โครงสร้างงาน 9 หมวด, สัญญาเดี่ยว/ร่วม, การค้ำประกันไขว้ และเอกสารทางการ Confluence, Jira, Google Drive',
      badge: '9 หมวดงานหลัก',
      badgeColor: 'bg-white/85 text-indigo-900 border-slate-200/90 font-bold',
      icon: <Layers className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      onClick: () => onNavigate('proposed-work'),
      actionText: 'ดูผังงาน WORK 1–9',
      hasHighlight: false,
    },
    {
      id: 'gascode',
      title: 'โค้ด Google Apps Script (Code.gs)',
      desc: 'ดูและคัดลอก Source Code ของ Apps Script Web App 1-Click สำหรับรับคำสั่งและซิงก์ Manifest สู่ Google Drive',
      badge: 'พร้อมคัดลอกใช้งาน',
      badgeColor: 'bg-white/85 text-amber-900 border-slate-200/90 font-bold',
      icon: <Code2 className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
      onClick: () => onNavigate('gascode'),
      actionText: 'ดูโค้ด Code.gs',
      hasHighlight: false,
    },
    {
      id: 'payloads',
      title: 'ประวัติคำสั่ง (Live Payloads)',
      desc: 'บันทึกประวัติคำสั่ง Payload และ Response ที่ส่งไปและกลับจาก Google Apps Script พร้อมรายละเอียดมิลลิวินาที',
      badge: `${logCount} รายการบันทึก`,
      badgeColor: 'bg-white/85 text-slate-800 border-slate-200/90 font-bold',
      icon: <Terminal className="w-6 h-6 text-slate-700 dark:text-slate-300" />,
      onClick: onOpenLogsModal,
      actionText: 'ดูประวัติ Payloads',
      hasHighlight: false,
    },
  ];

  return (
    <section className="space-y-6">
      {/* Expanded Clean Header Banner */}
      <GlassBox variant="frosted" className="p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/90 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 shadow-2xs">
                NexusLedger Hub
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">· สถาปัตยกรรมสัญญาอัจฉริยะ</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#14243A] dark:text-white">
              เลือกเมนูเพื่อเริ่มใช้งานหรือสั่งงานระบบ
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              กล่องข้อความและเมนูถูกสร้างขึ้นด้วยสถาปัตยกรรมกระจกน้ำ 3 มิติ (GlassBox) มีมิติแสงสะท้อนชัดเจน และปุ่มไม่จมกลืนกับพื้นหลัง
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {onOpenExportModal && (
              <LiquidButton
                size="default"
                onClick={onOpenExportModal}
                className="text-xs font-bold cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-600" />
                <span>วิธีเอาโค้ดไปใช้</span>
              </LiquidButton>
            )}
            <LiquidButton
              size="default"
              onClick={onOpenGatewayModal}
              className="text-xs font-bold cursor-pointer"
            >
              <Settings className="w-4 h-4 text-blue-600" />
              <span>ตั้งค่า Gateway</span>
            </LiquidButton>
          </div>
        </div>
      </GlassBox>

      {/* Grid of Expanded Liquid Glass Menu Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {menuCards.map((card) => {
          const isHighlighted = card.hasHighlight;
          return (
            <GlassBox
              key={card.id}
              variant="default"
              interactive={true}
              onClick={card.onClick}
              className="group"
            >
              <div className="p-6 sm:p-7 flex flex-col justify-between space-y-5 h-full">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-200/55 dark:bg-slate-900 border border-white/95 dark:border-slate-800 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.95)] group-hover:scale-105 transition-transform backdrop-blur-xl">
                      {card.icon}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {card.highlightTag && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200/65 text-slate-800 border border-white/95 shadow-2xs backdrop-blur-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          {card.highlightTag}
                        </span>
                      )}
                      <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border shadow-2xs backdrop-blur-md ${card.badgeColor}`}>
                        {card.badge}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-[#14243A] dark:text-white group-hover:text-blue-700 dark:group-hover:text-teal-300 transition-colors flex items-center gap-2">
                      <span>{card.title}</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                </div>

                {/* Frosted Cloudy Liquid Button CTA inside each Card */}
                <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between gap-2">
                  <LiquidButton
                    size="default"
                    variant={isHighlighted ? "glowing" : "default"}
                    glow={isHighlighted}
                    beacon={isHighlighted}
                    className="w-full text-xs font-bold cursor-pointer"
                  >
                    <span>{card.actionText}</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </LiquidButton>
                </div>
              </div>
            </GlassBox>
          );
        })}
      </div>

      {/* Target Drive Location Info Banner (GlassBox) */}
      <GlassBox variant="subtle" className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-slate-700 dark:text-slate-300">
            โฟลเดอร์ Google Drive: <strong className="text-blue-900 dark:text-slate-100 font-bold">AI_Project_Workspace</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-700 dark:text-slate-300">
            ไฟล์ Manifest: <strong className="text-blue-700 dark:text-teal-400 font-bold">{MANIFEST_FILE_NAME}</strong>
          </span>
        </div>
      </GlassBox>
    </section>
  );
};
