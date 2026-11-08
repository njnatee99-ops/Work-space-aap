import React, { useState } from 'react';
import { Check, Sparkles, Building2, User, Zap } from 'lucide-react';
import { HighImpactPrimaryButton } from './HighImpactPrimaryButton';
import { backendGateway } from '../services/backendGateway';

interface PricingSectionProps {
  onSelectEnterprise: () => void;
  onOpenLogsDrawer: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectEnterprise, onOpenLogsDrawer }) => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedPlanFeedback, setSelectedPlanFeedback] = useState<string | null>(null);

  const handleSelectPlan = async (planId: string, planName: string, price: number) => {
    setSelectedPlanFeedback(`คุณได้เลือกแผน ${planName} เรียบร้อยแล้ว (ส่ง Payload สู่ Gateway)`);
    await backendGateway.dispatchAction('pricing.plan_selection', {
      planId,
      planName,
      billingCycle: isAnnual ? 'annual' : 'monthly',
      priceThb: price,
      discountApplied: isAnnual ? '20%' : '0%',
      timestamp: new Date().toISOString(),
    });
    onOpenLogsDrawer();
    setTimeout(() => setSelectedPlanFeedback(null), 5000);
  };

  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs font-mono text-cyan-400">
            <Zap className="w-3.5 h-3.5" />
            <span>Transparent Enterprise Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight" style={{ textWrap: 'balance' }}>
            เลือกแผนการใช้งานที่ลงตัวกับขนาดองค์กร
          </h2>
          <p className="text-base text-slate-400 leading-relaxed">
            เริ่มต้นใช้งานได้ทันที พร้อมเชื่อมต่อเข้ากับเซิร์ฟเวอร์หลังบ้านผ่าน API &amp; Webhook ได้ทุกแผน
          </p>

          {/* Billing Cycle Toggle */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-white' : 'text-slate-400'}`}>
              ชำระรายเดือน
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-14 h-8 bg-slate-800 rounded-full p-1 cursor-pointer transition-colors duration-200 border border-slate-700"
              role="switch"
              aria-checked={isAnnual}
            >
              <div
                className={`w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-teal-300 shadow-md transform transition-transform duration-200 ${
                  isAnnual ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${isAnnual ? 'text-white' : 'text-slate-400'}`}>
                ชำระรายปี
              </span>
              <span className="text-[11px] font-bold text-cyan-300 bg-cyan-950/90 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                ประหยัด 20%
              </span>
            </div>
          </div>

          {selectedPlanFeedback && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs max-w-md mx-auto animate-fade-in">
              ✓ {selectedPlanFeedback}
            </div>
          )}
        </div>

        {/* Pricing Cards Grid (3 Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Plan 1: Community (0฿) */}
          <div className="rounded-3xl p-8 bg-[#0b1120] border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all duration-200 shadow-xl">
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 mb-6">
                <User className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Community</h3>
              <p className="text-xs text-slate-400 mb-6">สำหรับนักพัฒนาและผู้เริ่มต้นทดสอบระบบ</p>

              <div className="mb-6 pb-6 border-b border-slate-800">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white font-mono tabular-nums">0฿</span>
                  <span className="text-xs text-slate-400">/ ตลอดชีพ</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">ไม่มีค่าใช้จ่ายแอบแฝง</div>
              </div>

              <ul className="space-y-3 text-xs text-slate-300 mb-8">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>10,000 การตรวจสอบสัญญา / เดือน</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Dual-Key Ledger Verification ระดับพื้นฐาน</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>เชื่อมต่อ Webhook สูงสุด 1 ปลายทาง</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Community Discord &amp; Documentation</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleSelectPlan('community', 'Community', 0)}
              className="w-full py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-white font-semibold text-sm cursor-pointer transition-colors"
            >
              เริ่มต้นใช้งานฟรี
            </button>
          </div>

          {/* Plan 2: Professional (2,900฿/mo) - MOST POPULAR WITH CYAN NEON GLOW */}
          <div className="relative rounded-3xl p-8 bg-[#0d1629] border-2 border-cyan-400 shadow-[0_0_40px_rgba(6,182,212,0.35),0_0_15px_rgba(6,182,212,0.2)] flex flex-col justify-between transform md:-translate-y-2">
            {/* Cyan Neon Glow Ribbon Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.8)] tracking-wide">
                <Sparkles className="w-3.5 h-3.5" /> ยอดนิยม · แนะนำสำหรับโปรดักชัน
              </span>
            </div>

            <div>
              <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-300 mb-6">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Professional</h3>
              <p className="text-xs text-slate-300 mb-6">สำหรับทีมที่ต้องการความเร็วและความปลอดภัยระดับองค์กร</p>

              <div className="mb-6 pb-6 border-b border-cyan-500/20">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white font-mono tabular-nums">
                    {isAnnual ? '2,320฿' : '2,900฿'}
                  </span>
                  <span className="text-xs text-slate-300">/ เดือน</span>
                </div>
                <div className="text-xs text-cyan-300 font-mono mt-1">
                  {isAnnual ? 'ชำระรายปี 27,840฿ (ประหยัด 5,760฿)' : 'คิดค่าบริการตามรอบบิลรายเดือน'}
                </div>
              </div>

              <ul className="space-y-3.5 text-xs text-slate-200 mb-8">
                <li className="flex items-center gap-2.5 font-medium">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>1,000,000 การตรวจสอบสัญญา / เดือน</span>
                </li>
                <li className="flex items-center gap-2.5 font-medium">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>16 Stop Gates Compliance ตรวจสอบครบทุกด่าน</span>
                </li>
                <li className="flex items-center gap-2.5 font-medium">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Webhook Backend Dispatch ไม่จำกัดปลายทาง</span>
                </li>
                <li className="flex items-center gap-2.5 font-medium">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>ความเร็วการส่งข้อมูล &lt; 12ms รับประกัน SLA</span>
                </li>
                <li className="flex items-center gap-2.5 font-medium">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>การสนับสนุนเร่งด่วนตลอด 24 ชั่วโมง (Priority Support)</span>
                </li>
              </ul>
            </div>

            <HighImpactPrimaryButton
              size="lg"
              className="w-full text-center"
              onClick={() => handleSelectPlan('professional', 'Professional', isAnnual ? 2320 : 2900)}
            >
              เลือกแพ็กเกจ Professional
            </HighImpactPrimaryButton>
          </div>

          {/* Plan 3: Custom Enterprise */}
          <div className="rounded-3xl p-8 bg-[#0b1120] border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all duration-200 shadow-xl">
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 mb-6">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Custom Enterprise</h3>
              <p className="text-xs text-slate-400 mb-6">สำหรับองค์กรขนาดใหญ่ สถาบันการเงิน และรัฐบาล</p>

              <div className="mb-6 pb-6 border-b border-slate-800">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">ตามขนาดงาน</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">ข้อตกลงและเงื่อนไขแบบกำหนดเอง</div>
              </div>

              <ul className="space-y-3 text-xs text-slate-300 mb-8">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>ไม่จำกัดปริมาณการตรวจสอบสัญญา</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Private Dedicated Gateway Node แยกเฉพาะองค์กร</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Custom Stop Gates Rule Engine ปรับแต่งเงื่อนไขเฉพาะ</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>SLA 99.99% Uptime และความรับผิดชอบทางกฎหมาย</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Dedicated Security Architect &amp; 24/7 Hotline</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onSelectEnterprise}
              className="w-full py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 text-white font-semibold text-sm cursor-pointer transition-colors"
            >
              ติดต่อทีมงาน Enterprise
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
