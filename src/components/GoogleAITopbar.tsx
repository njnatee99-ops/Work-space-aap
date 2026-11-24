import React from 'react';
import { GatewayConfig } from '../types';
import { LiquidButton } from './ui/liquid-glass-button';
import { useFirebase } from '../contexts/FirebaseContext';
import { Cloud, LogIn, LogOut, Settings, ChevronLeft, Moon, Sun } from 'lucide-react';

interface GoogleAITopbarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  config: GatewayConfig;
  onOpenGatewayModal: () => void;
  onOpenLogsModal: () => void;
  onOpenGasCodeModal: () => void;
  onOpenExportModal?: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

const TAB_TITLES: Record<string, string> = {
  overview: 'CRD Work Center',
  'proposed-work': 'ปฏิบัติการ WORK 1–9',
  'work4-studio': 'พิมพ์จดหมาย WORK 4',
  'ai-chat': 'ผู้ช่วย AI CRD',
  'admin-hub': 'หลังบ้านและตั้งค่าระบบ',
  'scope-builder': 'จัดการขอบเขตงาน',
  'stop-gates': 'ตรวจ 16 ด่านควบคุม',
  'ai-studio': 'ออกแบบ UI หลังบ้าน',
  '3d-view': 'ผังระบบ 3 มิติ',
  gascode: 'โค้ดหลังบ้าน (Code.gs)',
};

export const GoogleAITopbar: React.FC<GoogleAITopbarProps> = ({
  activeTab,
  onSelectTab,
  theme = 'light',
  onToggleTheme,
}) => {
  const { user, authLoading, signInWithGoogle, signOutUser } = useFirebase();
  const isHome = activeTab === 'overview';
  const isAdminSection = ['admin-hub', 'scope-builder', 'stop-gates', 'ai-studio', '3d-view', 'gascode'].includes(activeTab);

  return (
    <header
      className={`sticky top-0 z-40 safe-top pb-2.5 px-4 backdrop-blur-2xl border-b transition-colors ${
        theme === 'light'
          ? 'bg-white/80 border-slate-200/70 text-[#14243A] shadow-2xs'
          : 'bg-[#070b12]/85 border-slate-800/80 text-white'
      }`}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 min-h-[44px]">
        {/* Left: Brand Title or Native iOS-style Back Button */}
        <div className="flex items-center gap-2 min-w-0">
          {!isHome ? (
            <button
              type="button"
              onClick={() => onSelectTab(isAdminSection && activeTab !== 'admin-hub' ? 'admin-hub' : 'overview')}
              className={`touch-target inline-flex items-center gap-1 pr-3 pl-1.5 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
                theme === 'light'
                  ? 'text-blue-700 hover:bg-blue-50 active:bg-blue-100'
                  : 'text-teal-300 hover:bg-slate-800 active:bg-slate-700'
              }`}
            >
              <ChevronLeft className="w-5 h-5 shrink-0" />
              <span className="truncate">{isAdminSection && activeTab !== 'admin-hub' ? 'หลังบ้าน' : 'หน้าหลัก'}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 min-w-0">
              <span className={`font-bold text-lg tracking-tight truncate ${theme === 'light' ? 'text-[#14243A]' : 'text-white'}`}>
                CRD Work Center
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                พร้อมใช้งาน
              </span>
            </div>
          )}
        </div>

        {/* Center/Subtitle on Subpages */}
        {!isHome && (
          <span className="hidden sm:inline-block text-sm font-semibold truncate text-slate-600 dark:text-slate-300">
            {TAB_TITLES[activeTab] || 'CRD Work Center'}
          </span>
        )}

        {/* Right: Clean Mobile-First Controls (Max 3 Compact Touch-Friendly Buttons) */}
        <div className="flex items-center gap-1.5 shrink-0">
          {!authLoading && (
            user ? (
              <LiquidButton
                onClick={() => { signOutUser(); }}
                type="button"
                size="sm"
                className="touch-target px-2.5 text-xs font-semibold cursor-pointer"
                title={`ซิงก์แล้ว: ${user.email || user.displayName || 'Google User'} (แตะเพื่อออก)`}
              >
                <Cloud className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <LogOut className="w-3.5 h-3.5 text-slate-500 dark:text-slate-300" />
              </LiquidButton>
            ) : (
              <LiquidButton
                onClick={() => { signInWithGoogle(); }}
                type="button"
                size="sm"
                className="touch-target px-3 text-xs font-bold cursor-pointer"
                title="ซิงก์ Google"
              >
                <LogIn className="w-4 h-4 text-blue-600 dark:text-teal-400" />
                <span className="hidden sm:inline">ซิงก์</span>
              </LiquidButton>
            )
          )}

          {onToggleTheme && (
            <LiquidButton
              onClick={onToggleTheme}
              type="button"
              size="sm"
              className="touch-target w-11 px-0 flex items-center justify-center cursor-pointer"
              title={theme === 'light' ? 'สลับเป็นโหมดมืด' : 'สลับเป็นโหมดสว่าง'}
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-slate-700" />
              ) : (
                <Sun className="w-4 h-4 text-amber-300" />
              )}
            </LiquidButton>
          )}

          <LiquidButton
            onClick={() => onSelectTab('admin-hub')}
            type="button"
            size="sm"
            variant={isAdminSection ? 'glowing' : 'default'}
            className="touch-target px-3 text-xs font-bold cursor-pointer"
            title="เข้าหน้าหลังบ้านและตั้งค่าระบบ"
          >
            <Settings className="w-4 h-4 text-blue-600 dark:text-teal-400" />
            <span className="hidden sm:inline">หลังบ้าน</span>
          </LiquidButton>
        </div>
      </div>
    </header>
  );
};
