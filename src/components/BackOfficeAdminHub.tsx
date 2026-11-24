import React from 'react';
import {
  Settings,
  ShieldCheck,
  Code2,
  Terminal,
  PlusCircle,
  Sparkles,
  Box,
  Download,
  ChevronRight,
  Server,
} from 'lucide-react';
import { GatewayConfig } from '../types';
import { ConnectionStatusBanner } from './ConnectionStatusBanner';
import { GlassBox } from './ui/glass-box';
import { LiquidButton } from './ui/liquid-glass-button';

interface BackOfficeAdminHubProps {
  config: GatewayConfig;
  scopesCount: number;
  logCount: number;
  onNavigate: (
    view: 'scope-builder' | 'stop-gates' | 'ai-studio' | '3d-view' | 'gascode'
  ) => void;
  onOpenGatewayModal: () => void;
  onOpenLogsModal: () => void;
  onOpenExportModal: () => void;
}

export const BackOfficeAdminHub: React.FC<BackOfficeAdminHubProps> = ({
  config,
  scopesCount,
  logCount,
  onNavigate,
  onOpenGatewayModal,
  onOpenLogsModal,
  onOpenExportModal,
}) => {
  const adminTools = [
    {
      id: 'scope-builder',
      title: 'จัดการขอบเขตงาน (Scope Builder)',
      desc: 'กำหนดแม่แบบกฎ WORK 1–9 และยิงอัปเดตสเปกลง Manifest',
      badge: `${scopesCount} รายการ`,
      icon: <PlusCircle className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
      onClick: () => onNavigate('scope-builder'),
    },
    {
      id: 'stop-gates',
      title: 'ตรวจ 16 ด่าน Stop Gates & PDPA',
      desc: 'ตรวจสอบกฎ Leading Zero 5 หลัก, Dual-Key และ Zero-PII',
      badge: '16/16 ผ่าน',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      onClick: () => onNavigate('stop-gates'),
    },
    {
      id: 'payloads',
      title: 'ประวัติคำสั่ง (Live Payloads)',
      desc: 'ตรวจบันทึก Request/Response ที่เชื่อมกับ Google Apps Script',
      badge: `${logCount} บันทึก`,
      icon: <Terminal className="w-5 h-5 text-slate-700 dark:text-slate-300" />,
      onClick: onOpenLogsModal,
    },
    {
      id: 'gascode',
      title: 'โค้ดหลังบ้าน (Google Apps Script)',
      desc: 'ดูและคัดลอก Source Code ของ Code.gs สำหรับเชื่อมต่อ Drive',
      badge: 'Code.gs',
      icon: <Code2 className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      onClick: () => onNavigate('gascode'),
    },
    {
      id: 'ai-studio',
      title: 'สตูดิโอออกแบบ UI หลังบ้าน',
      desc: 'ให้ AI สังเคราะห์คอมโพเนนต์และทดสอบโครงสร้างหน้าจอ',
      badge: 'Dev Studio',
      icon: <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      onClick: () => onNavigate('ai-studio'),
    },
    {
      id: '3d-view',
      title: 'ผังสถาปัตยกรรมระบบ 3 มิติ',
      desc: 'ดูโครงสร้าง Dual-Key Ledger และวงแหวน 16 ด่านแบบ 3 มิติ',
      badge: '3D Map',
      icon: <Box className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      onClick: () => onNavigate('3d-view'),
    },
  ];

  return (
    <section className="space-y-5">
      <GlassBox variant="frosted" className="p-5 sm:p-6 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 dark:text-teal-300 mb-1">
              <Server className="w-4 h-4" />
              ระบบหลังบ้านและผู้ดูแล (Back Office / System Admin)
            </div>
            <h1 className="text-xl font-bold text-[#14243A] dark:text-white">
              ตั้งค่าการเชื่อมต่อ โค้ด และตรวจสอบระบบ
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <LiquidButton
              size="sm"
              onClick={onOpenExportModal}
              className="touch-target px-3 text-xs font-bold cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>เอาโค้ดไปใช้</span>
            </LiquidButton>
            <LiquidButton
              size="sm"
              onClick={onOpenGatewayModal}
              className="touch-target px-3 text-xs font-bold cursor-pointer"
            >
              <Settings className="w-4 h-4 text-blue-600" />
              <span>ตั้งค่า Gateway</span>
            </LiquidButton>
          </div>
        </div>
      </GlassBox>

      {/* Connection Status Banner moved cleanly into Back Office only */}
      <ConnectionStatusBanner
        config={config}
        onOpenGatewayModal={onOpenGatewayModal}
      />

      {/* Back-Office Tool List (Clean Mobile-First Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {adminTools.map((tool) => (
          <GlassBox
            key={tool.id}
            variant="default"
            interactive={true}
            onClick={tool.onClick}
            className="p-4 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-slate-100/90 dark:bg-slate-900 border border-white dark:border-slate-800 shrink-0">
                {tool.icon}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-[#14243A] dark:text-white truncate">
                    {tool.title}
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
                    {tool.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {tool.desc}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          </GlassBox>
        ))}
      </div>
    </section>
  );
};
