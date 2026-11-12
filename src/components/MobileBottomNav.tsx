import React from 'react';
import { Home, PlusCircle, ShieldCheck, FileCode, Settings, Terminal, Sparkles } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  onOpenGatewayModal: () => void;
  onOpenLogsModal: () => void;
  logCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenGatewayModal,
  onOpenLogsModal,
  logCount,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden backdrop-blur-lg bg-white/95 dark:bg-[#070b12]/95 border-t border-slate-200 dark:border-slate-800/80 px-2 py-1 shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Tab 1: Home */}
        <button
          type="button"
          onClick={() => onSelectTab('overview')}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1.5 px-1 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'overview'
              ? 'text-blue-700 dark:text-teal-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">หน้าหลัก</span>
        </button>

        {/* Tab 2: Design Studio */}
        <button
          type="button"
          onClick={() => onSelectTab('design-studio')}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1.5 px-1 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'design-studio'
              ? 'text-blue-700 dark:text-teal-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Sparkles className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">ออกแบบ UI</span>
        </button>

        {/* Tab 3: Scopes */}
        <button
          type="button"
          onClick={() => onSelectTab('scope-builder')}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1.5 px-1 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'scope-builder'
              ? 'text-blue-700 dark:text-teal-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <PlusCircle className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">ขอบเขตงาน</span>
        </button>

        {/* Tab 4: Stop Gates */}
        <button
          type="button"
          onClick={() => onSelectTab('stop-gates')}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1.5 px-1 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'stop-gates'
              ? 'text-blue-700 dark:text-teal-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <ShieldCheck className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">ด่านตรวจ</span>
        </button>

        {/* Tab 5: Settings / Gateway */}
        <button
          type="button"
          onClick={onOpenGatewayModal}
          className="flex flex-col items-center justify-center min-w-[56px] py-1.5 px-1 rounded-xl text-slate-500 dark:text-slate-400 hover:text-blue-700 dark:hover:text-teal-400 transition-colors cursor-pointer"
        >
          <Settings className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">ตั้งค่า GW</span>
        </button>

        {/* Tab 6: Live Payloads pill */}
        <button
          type="button"
          onClick={onOpenLogsModal}
          className="relative flex flex-col items-center justify-center min-w-[48px] py-1.5 px-1 rounded-xl text-slate-500 dark:text-slate-400 hover:text-blue-700 dark:hover:text-teal-400 transition-colors cursor-pointer"
          title="ดูประวัติ Payloads"
        >
          <Terminal className="w-5 h-5 mb-0.5 text-blue-600 dark:text-teal-400" />
          <span className="text-[10px] tracking-tight font-mono">{logCount}</span>
          <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </button>
      </div>
    </div>
  );
};
