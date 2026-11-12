import React, { useState, useEffect } from 'react';
import { Wifi, RefreshCw, Copy, Check, CheckCircle2, SlidersHorizontal } from 'lucide-react';
import { backendGateway, SyncState } from '../services/backendGateway';
import { GatewayConfig } from '../types';
import { LiquidButton } from './ui/liquid-glass-button';
import { GlassBox } from './ui/glass-box';

interface ConnectionStatusBannerProps {
  config: GatewayConfig;
  onOpenGatewayModal: () => void;
}

export const ConnectionStatusBanner: React.FC<ConnectionStatusBannerProps> = ({
  config,
  onOpenGatewayModal,
}) => {
  const [isPinging, setIsPinging] = useState(false);
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [syncState, setSyncState] = useState<SyncState>(() => backendGateway.getSyncState());

  useEffect(() => {
    const unsubscribe = backendGateway.onSyncStateChange((newState) => {
      setSyncState(newState);
    });
    return unsubscribe;
  }, []);

  // Trigger a brief sync indicator transition whenever config latency/baseUrl changes externally
  useEffect(() => {
    setSyncState(backendGateway.getSyncState());
  }, [config.latencyMs, config.baseUrl]);

  const handlePing = async () => {
    setIsPinging(true);
    setFeedback(null);
    try {
      const res = await backendGateway.testConnection();
      setFeedback(`ส่งสัญญาณ Ping สำเร็จ (${res.latencyMs}ms) เชื่อมต่อสมบูรณ์`);
      setTimeout(() => setFeedback(null), 4000);
    } finally {
      setIsPinging(false);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(config.baseUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isSyncing = syncState.status === 'syncing' || isPinging;

  return (
    <GlassBox variant="frosted" className="p-5 sm:p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Status & Real-Time Sync Indicator */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-200/60 dark:bg-slate-800 backdrop-blur-xl border border-white/90 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-teal-400 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.95)]">
            <Wifi className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm sm:text-base font-bold text-[#14243A] dark:text-slate-100">
                สถานะการเชื่อมต่อหลังบ้าน
              </span>

              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-white/75 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-white/90 dark:border-emerald-500/40 flex items-center gap-1.5 shadow-2xs backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Google Apps Script (Connected)
              </span>

              {/* Real-time Sync Indicator ('กำลังซิงค์' / 'ล่าสุด') */}
              <span
                onClick={() => backendGateway.triggerSyncPulse(700)}
                title={`อัปเดตเมื่อ: ${syncState.updatedAt} (แตะเพื่อซิงค์ข้อมูล)`}
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border backdrop-blur-xl transition-all duration-300 cursor-pointer select-none shadow-2xs ${
                  isSyncing
                    ? 'bg-amber-50/90 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300/90 dark:border-amber-700'
                    : 'bg-slate-200/60 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border-white/90 dark:border-slate-700'
                }`}
              >
                <span className="relative flex h-2 w-2">
                  {isSyncing ? (
                    <>
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-80" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                    </>
                  ) : (
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
                  )}
                </span>
                <span>{isSyncing ? 'กำลังซิงค์' : 'ล่าสุด'}</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              เชื่อมตรงกับ Web App อัปเดตข้อมูลเข้า Google Drive อัตโนมัติ (ซิงค์ล่าสุด: {syncState.updatedAt})
            </p>
          </div>
        </div>

        {/* Right: Latency & Frosted Cloudy Button Actions */}
        <div className="flex items-center gap-2.5">
          <div className="text-xs font-mono text-slate-600 dark:text-slate-400 bg-slate-200/55 dark:bg-slate-800/80 backdrop-blur-xl px-3 py-1.5 rounded-full border border-white/90 dark:border-slate-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)]">
            Latency: <strong className="text-slate-900 dark:text-emerald-400 tabular-nums font-bold">{config.latencyMs}ms</strong>
          </div>

          <LiquidButton
            size="sm"
            onClick={handlePing}
            disabled={isPinging}
            className="text-xs font-semibold cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin text-blue-600' : 'text-slate-700 dark:text-slate-200'}`} />
            <span>{isPinging ? 'กำลังซิงค์...' : 'ทดสอบ Ping'}</span>
          </LiquidButton>

          <LiquidButton
            size="sm"
            onClick={onOpenGatewayModal}
            className="text-xs font-semibold cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-700 dark:text-slate-200" />
            <span>ตั้งค่า URL</span>
          </LiquidButton>
        </div>
      </div>

      {/* URL Display Bar - Frosted Cloudy Glass */}
      <div className="bg-slate-200/45 dark:bg-slate-900/90 backdrop-blur-xl border border-white/85 dark:border-slate-800 rounded-2xl p-3 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 text-xs shadow-[inset_0_1px_2px_rgba(255,255,255,0.85)]">
        <div className="flex items-center gap-2 truncate min-w-0">
          <span className="text-slate-500 font-mono font-semibold shrink-0">Web App:</span>
          <span className="font-mono text-slate-800 dark:text-slate-200 truncate select-all">{config.baseUrl}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopyUrl}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-200/70 dark:bg-slate-800 hover:bg-white/90 text-slate-800 dark:text-slate-200 border border-white/95 dark:border-slate-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.95)] transition-colors cursor-pointer text-xs font-semibold backdrop-blur-md"
            title="คัดลอก URL"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
            <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
          </button>
          <span className="text-emerald-800 dark:text-emerald-400 font-semibold text-xs flex items-center gap-1 bg-white/75 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-white/90 dark:border-emerald-800 backdrop-blur-md">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{feedback || 'พร้อมส่งคำสั่งขยายงานจริง'}</span>
          </span>
        </div>
      </div>
    </GlassBox>
  );
};
