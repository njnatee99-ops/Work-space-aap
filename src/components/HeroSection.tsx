import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Zap, ArrowRight, RefreshCw, Radio } from 'lucide-react';
import { HighImpactPrimaryButton } from './HighImpactPrimaryButton';
import { ThreeScene } from './ThreeScene';
import { backendGateway } from '../services/backendGateway';
import { GatewayConfig } from '../types';

interface HeroSectionProps {
  onOpenGatewayModal: () => void;
  onOpenLogsDrawer: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenGatewayModal, onOpenLogsDrawer }) => {
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
      setTimeout(() => setLastPingFeedback(null), 4000);
    } finally {
      setIsPinging(false);
    }
  };

  const handleQuickWebhookDispatch = async () => {
    await backendGateway.dispatchAction('hero.quick_dispatch_ping', {
      source: 'hero_section_cta',
      intent: 'verify_realtime_pipeline',
      contractStandard: 'ERC-4337 / Multi-Sig v2',
      auditGates: 16,
      timestamp: new Date().toISOString(),
    });
    onOpenLogsDrawer();
  };

  return (
    <section id="hero" className="relative pt-12 pb-20 overflow-hidden">
      {/* Background radial atmosphere glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Real-time Backend Server Connection Status Bar */}
        <div className="mb-8 p-3 sm:p-4 rounded-2xl bg-[#0d1527]/90 border border-cyan-500/25 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 font-medium text-slate-300">
                <Radio className={`w-4 h-4 ${config.status === 'connected' ? 'text-emerald-400' : 'text-cyan-400'} shrink-0`} />
                <span className="font-semibold text-white">สถานะการเชื่อมต่อหลังบ้าน:</span>
              </span>
              <span className="font-mono text-cyan-300 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-cyan-500/20 text-xs">
                {config.isSimulationMode ? 'Built-in Simulated Node' : config.baseUrl || 'Unconfigured'}
              </span>
              <span className="hidden md:inline text-slate-500">|</span>
              <span className="hidden md:flex items-center gap-1 text-slate-400 font-mono text-xs">
                Endpoint: <span className="text-slate-200">{config.webhookEndpoint}</span>
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0 self-end sm:self-auto">
              <span className="font-mono text-xs text-slate-300">
                Latency: <span className="text-emerald-400 font-bold tabular-nums">{config.latencyMs}ms</span>
              </span>
              <button
                onClick={handleTestPing}
                disabled={isPinging}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg border border-slate-700 text-xs font-medium cursor-pointer transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin text-cyan-400' : ''}`} />
                {isPinging ? 'กำลังทดสอบ...' : 'ทดสอบ Ping'}
              </button>
              <button
                onClick={onOpenGatewayModal}
                className="text-xs text-cyan-400 hover:text-cyan-300 underline font-medium cursor-pointer"
              >
                แก้ไข
              </button>
            </div>
          </div>

          {lastPingFeedback && (
            <div className="mt-2 pt-2 border-t border-slate-800/80 text-xs text-cyan-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block" />
              <span>{lastPingFeedback}</span>
            </div>
          )}
        </div>

        {/* Hero Grid: Left Content, Right 3D Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: High-Contrast Headline & CTAs */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-xs text-cyan-300 font-medium tracking-wide">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Dual-Key Ledger & Automated Stop Gates Engine</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]" style={{ textWrap: 'balance' }}>
              ระบบจัดการและตรวจสอบสัญญาอัจฉริยะ{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400">
                พร้อมส่งคำสั่งตรงสู่เซิร์ฟเวอร์คุณ
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              แพลตฟอร์มตรวจสอบความถูกต้องของ Smart Contract แบบเรียลไทม์ พร้อมกระบวนการ Ingestion บัญชีแยกประเภทคู่
              (Dual-Key Ledger) ผ่าน 16 ด่าน Stop Gates และยิง Webhook ตรงสู่เซิร์ฟเวอร์หลังบ้านของคุณทันที
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <HighImpactPrimaryButton
                size="lg"
                onClick={handleQuickWebhookDispatch}
                icon={<Zap className="w-5 h-5 text-slate-950 fill-slate-950" />}
              >
                ส่งสัญญาณ Webhook ทดสอบ
              </HighImpactPrimaryButton>

              <a
                href="#bento"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-slate-200 bg-slate-900/90 hover:bg-slate-800 rounded-2xl border border-slate-700/80 hover:border-cyan-500/40 transition-all duration-200 shadow-lg cursor-pointer"
              >
                <span>สำรวจระบบ 01-04</span>
                <ArrowRight className="w-4 h-4 text-cyan-400" />
              </a>
            </div>

            <p className="text-xs text-slate-400 flex items-center gap-2">
              <span className="text-emerald-400 font-bold">✓</span> รองรับ Base URL ทุกเซิร์ฟเวอร์
              <span className="text-slate-600">·</span>
              <span className="text-emerald-400 font-bold">✓</span> มีโหมด Simulator ทดสอบทันที
              <span className="text-slate-600">·</span>
              <span className="text-emerald-400 font-bold">✓</span> เข้ารหัส Dual-Key ปลอดภัย 100%
            </p>
          </div>

          {/* Right Column: Three.js 3D Scene */}
          <div className="lg:col-span-6">
            <ThreeScene />
          </div>
        </div>

        {/* Real-time Statistics Strip (Full Width Below Hero Split) */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-5 rounded-2xl bg-[#0b1120]/80 border border-slate-800/90 shadow-lg hover:border-slate-700 transition-colors">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" /> Contract Throughput
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tabular-nums tracking-tight">
              8.4M+
            </div>
            <div className="text-xs text-slate-500 mt-1">สัญญาถูกตรวจสอบ/เดือน</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0b1120]/80 border border-slate-800/90 shadow-lg hover:border-slate-700 transition-colors">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Stop Gate Compliance
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tabular-nums tracking-tight">
              16 / 16
            </div>
            <div className="text-xs text-slate-500 mt-1">ด่านความปลอดภัยอัตโนมัติ</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0b1120]/80 border border-slate-800/90 shadow-lg hover:border-slate-700 transition-colors">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" /> Webhook Latency
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tabular-nums tracking-tight">
              &lt; 12ms
            </div>
            <div className="text-xs text-slate-500 mt-1">ความเร็วการกระจายคำสั่ง</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0b1120]/80 border border-slate-800/90 shadow-lg hover:border-slate-700 transition-colors">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" /> Proof Verification
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tabular-nums tracking-tight">
              100%
            </div>
            <div className="text-xs text-slate-500 mt-1">Zero-Knowledge Proofs</div>
          </div>
        </div>
      </div>
    </section>
  );
};
