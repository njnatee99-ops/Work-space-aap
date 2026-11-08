import React, { useState } from 'react';
import { KeyRound, ShieldAlert, GitCommit, SendHorizontal, CheckCircle2, Play, RefreshCw, Terminal, Layers } from 'lucide-react';
import { backendGateway } from '../services/backendGateway';

interface BentoGridProps {
  onOpenLogsDrawer: () => void;
}

export const BentoGrid: React.FC<BentoGridProps> = ({ onOpenLogsDrawer }) => {
  // State for Card 01: Dual-Key Ledger Ingestion
  const [dualKeyProgress, setDualKeyProgress] = useState(100);
  const [isIngesting, setIsIngesting] = useState(false);
  const [ingestTxHash, setIngestTxHash] = useState('0x8f2a...c914');

  // State for Card 02: 16 Stop Gates Compliance
  const [isScanningGates, setIsScanningGates] = useState(false);
  const [gateStates, setGateStates] = useState<boolean[]>(Array(16).fill(true));
  const [activeGateIndex, setActiveGateIndex] = useState<number | null>(null);

  // State for Card 03: Contract Timeline Hierarchy
  const [activeStep, setActiveStep] = useState(2); // 0: Ingestion, 1: Multi-Sig, 2: Timelock, 3: Finality

  // State for Card 04: Webhook Backend Dispatch
  const [isDispatching, setIsDispatching] = useState(false);
  const [lastDispatchedEvent, setLastDispatchedEvent] = useState('contract.state_committed');

  // Interactive handler for Card 01
  const handleRunDualKeyIngestion = async () => {
    setIsIngesting(true);
    setDualKeyProgress(0);

    const interval = setInterval(() => {
      setDualKeyProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 25;
      });
    }, 120);

    const randomHash = `0x${Array.from({ length: 4 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}...${Array.from({ length: 4 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    setIngestTxHash(randomHash);

    await backendGateway.dispatchAction('bento.dual_key_ingest', {
      module: '01_dual_key_ledger',
      keyA_Client: '0xKeyClient_Alpha',
      keyB_Auditor: '0xKeyAuditor_Secure',
      contractStandard: 'ERC-4337',
      hash: randomHash,
      status: 'VERIFIED_AND_LOCKED',
    });

    setIsIngesting(false);
  };

  // Interactive handler for Card 02
  const handleScanGates = async () => {
    setIsScanningGates(true);
    const newStates = [...gateStates];

    for (let i = 0; i < 16; i++) {
      setActiveGateIndex(i);
      newStates[i] = true;
      setGateStates([...newStates]);
      await new Promise((r) => setTimeout(r, 60));
    }

    setActiveGateIndex(null);
    setIsScanningGates(false);

    await backendGateway.dispatchAction('bento.stop_gates_audit', {
      module: '02_stop_gates',
      totalGates: 16,
      passedGates: 16,
      auditedAt: new Date().toISOString(),
      invariants: ['NO_REENTRANCY', 'GAS_CEILING_SAFE', 'SIGNATURE_QUORUM_MET'],
    });
  };

  // Interactive handler for Card 03
  const handleSelectTimelineStep = async (stepIndex: number) => {
    setActiveStep(stepIndex);
    const stepNames = ['01_Draft_Proposal', '02_MultiSig_Consensus', '03_Timelock_Enforcement', '04_OnChain_Finality'];
    await backendGateway.dispatchAction('bento.timeline_transition', {
      module: '03_contract_timeline',
      targetStage: stepNames[stepIndex],
      timestamp: new Date().toISOString(),
    });
  };

  // Interactive handler for Card 04
  const handleTriggerWebhookDispatch = async () => {
    setIsDispatching(true);
    const events = [
      'contract.state_committed',
      'ledger.block_finalized',
      'gate.compliance_certified',
      'governance.vote_quorum_reached',
    ];
    const chosenEvent = events[Math.floor(Math.random() * events.length)];
    setLastDispatchedEvent(chosenEvent);

    await backendGateway.dispatchAction('bento.webhook_dispatch', {
      module: '04_webhook_backend_dispatch',
      eventName: chosenEvent,
      deliveryAttempt: 1,
      targetEndpoint: backendGateway.getConfig().webhookEndpoint,
      payload: {
        contractId: '0x712a83f982',
        gasUsed: 21450,
        consensusScore: 0.998,
      },
    });

    setIsDispatching(false);
    onOpenLogsDrawer();
  };

  const gateNames = [
    '01. Gas Cap Guard', '02. Reentrancy Lock', '03. Quorum Validator', '04. Timelock Window',
    '05. Oracle Freshness', '06. Signature Ingestion', '07. Nonce Monotonicity', '08. State Boundary',
    '09. Call Depth Ceiling', '10. Return Buffer Check', '11. Zero-Address Shield', '12. Balance Invariant',
    '13. Role Pre-flight', '14. Event Pre-emission', '15. SLA Deadline', '16. Finality Anchor'
  ];

  return (
    <section id="bento" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs font-mono text-cyan-400">
            <Layers className="w-3.5 h-3.5" />
            <span>Architecture & Core Modules (01–04)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight" style={{ textWrap: 'balance' }}>
            สถาปัตยกรรม 4 โมดูลหลักเพื่อความปลอดภัยสูงสุด
          </h2>
          <p className="text-base text-slate-400 leading-relaxed">
            ผสานการทำงานแบบกระจายศูนย์ร่วมกับระบบหลังบ้านเดิมของคุณ ผ่านมาตรฐานการนำเข้าบัญชีคู่และการกำกับดูแลแบบเรียลไทม์
          </p>
        </div>

        {/* Bento Grid: Asymmetric 4-Card Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* CARD 01: Dual-Key Ledger Ingestion (Marquee, col-span-7) */}
          <div className="lg:col-span-7 rounded-3xl p-6 sm:p-8 bg-[#0b1120] border border-slate-800 hover:border-slate-700 transition-all duration-300 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                  01. Dual-Key Ledger Ingestion
                </span>
                <span className="text-xs text-slate-500 font-mono">Consensus: 2 of 2 Keys</span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">
                การนำเข้าข้อมูลสัญญาผ่านกุญแจคู่ขนาน
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                ทุกคำสั่งหรือธุรกรรมสัญญาต้องได้รับการประทับตราดิจิทัลจากทั้งกุญแจผู้ส่ง (Client Key)
                และกุญแจผู้ตรวจสอบ (Auditor Node) พร้อมกัน ป้องกันการปลอมแปลงและตรวจสอบความถูกต้องก่อนบันทึกลงสมุดบัญชี
              </p>

              {/* Interactive Ingestion Simulator Widget */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="flex items-center gap-2 font-semibold text-slate-300 mb-1">
                      <KeyRound className="w-3.5 h-3.5 text-cyan-400" /> Key A: Client Signature
                    </div>
                    <div className="font-mono text-slate-400 text-[11px] truncate">
                      secp256k1: 0x93FA...E82B
                    </div>
                    <div className="mt-1 text-[11px] text-emerald-400 font-medium">✓ ลงนามเรียบร้อย</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="flex items-center gap-2 font-semibold text-slate-300 mb-1">
                      <KeyRound className="w-3.5 h-3.5 text-teal-400" /> Key B: Gate Validator
                    </div>
                    <div className="font-mono text-slate-400 text-[11px] truncate">
                      ed25519: 0x418C...A20F
                    </div>
                    <div className="mt-1 text-[11px] text-emerald-400 font-medium">✓ ตรวจสอบความถูกต้อง</div>
                  </div>
                </div>

                {/* Progress & Hash */}
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-mono">
                    <span>สถานะการประมวลผล Ingestion</span>
                    <span className="text-cyan-400">{dualKeyProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-teal-400 transition-all duration-300"
                      style={{ width: `${dualKeyProgress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-1 border-t border-slate-800/60">
                  <span>Ledger Hash: <span className="text-slate-200">{ingestTxHash}</span></span>
                  <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Immutable Lock
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between gap-4">
              <span className="text-xs text-slate-400">ทดสอบการ Ingest คำสั่งผ่าน Gateway</span>
              <button
                onClick={handleRunDualKeyIngestion}
                disabled={isIngesting}
                className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-xl border border-cyan-500/30 text-xs font-semibold cursor-pointer transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isIngesting ? 'animate-spin' : ''}`} />
                {isIngesting ? 'กำลังลงนาม...' : 'จำลองการ Ingest ข้อมูล'}
              </button>
            </div>
          </div>

          {/* CARD 02: 16 Stop Gates Compliance (col-span-5) */}
          <div className="lg:col-span-5 rounded-3xl p-6 sm:p-8 bg-[#0b1120] border border-slate-800 hover:border-slate-700 transition-all duration-300 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-mono font-bold text-teal-400 bg-teal-950/80 px-2.5 py-1 rounded-lg border border-teal-500/20">
                  02. 16 Stop Gates Compliance
                </span>
                <span className="text-xs text-emerald-400 font-mono font-semibold">16/16 Passed</span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">
                ด่านตรวจสอบความปลอดภัย 16 ขั้น
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                ตรวจสอบเงื่อนไขความปลอดภัยและ Invariant ทุกมิติ หากตรวจพบลักษณะผิดปกติระบบจะหยุดคำสั่งทันทีภายใน 0.4ms
              </p>

              {/* 16 Gates Interactive Matrix */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/90 mb-4">
                <div className="grid grid-cols-4 gap-2">
                  {gateStates.map((passed, idx) => (
                    <div
                      key={idx}
                      title={gateNames[idx]}
                      className={`p-2 rounded-lg text-center transition-all ${
                        activeGateIndex === idx
                          ? 'bg-cyan-500 text-slate-950 font-bold scale-105 shadow-md shadow-cyan-500/50'
                          : passed
                          ? 'bg-slate-900/90 border border-emerald-500/30 text-emerald-400'
                          : 'bg-slate-900 border border-slate-800 text-slate-500'
                      }`}
                    >
                      <div className="text-[10px] font-mono font-bold">G-{String(idx + 1).padStart(2, '0')}</div>
                      <div className="text-[9px] truncate opacity-80 mt-0.5">
                        {activeGateIndex === idx ? 'SCAN' : 'PASS'}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-2.5 flex justify-between items-center text-[11px] text-slate-400">
                  <span>สถานะการสแกนความปลอดภัย</span>
                  <span className="text-emerald-400 font-mono font-bold">100% Zero Vulnerabilities</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-4">
              <span className="text-xs text-slate-400">สแกน Invariants ครบทุกด่าน</span>
              <button
                onClick={handleScanGates}
                disabled={isScanningGates}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 text-xs font-semibold cursor-pointer transition-all disabled:opacity-50"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-teal-400" />
                {isScanningGates ? 'กำลังตรวจสอบ...' : 'ตรวจสอบ Stop Gates'}
              </button>
            </div>
          </div>

          {/* CARD 03: Contract Timeline Hierarchy (col-span-5) */}
          <div className="lg:col-span-5 rounded-3xl p-6 sm:p-8 bg-[#0b1120] border border-slate-800 hover:border-slate-700 transition-all duration-300 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                  03. Contract Timeline Hierarchy
                </span>
                <span className="text-xs text-cyan-300 font-mono">SLA Guarantee</span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">
                ลำดับขั้นไทม์ไลน์สัญญาและ SLA
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                แสดงสถานะสัญญาตามลำดับโครงสร้าง DAG ควบคุมเวลาการหน่วง (Timelock) และการส่งต่อผลลัพธ์อัตโนมัติ
              </p>

              {/* Interactive Timeline Stepper */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90">
                {[
                  { title: 'ร่างข้อตกลงและตรวจสอบพารามิเตอร์', desc: 'Validated payload schemas' },
                  { title: 'รวบรวมลายเซ็นฉันทามติ Multi-Sig', desc: '3/3 signatures collected' },
                  { title: 'ระยะหน่วงเวลาปลอดภัย (Timelock SLA)', desc: '120s buffer window active' },
                  { title: 'บันทึกสถานะสิ้นสุดลงบน Ledger', desc: 'On-chain finality committed' },
                ].map((step, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectTimelineStep(idx)}
                    className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-3 cursor-pointer ${
                      activeStep === idx
                        ? 'bg-slate-900 border border-cyan-500/50 shadow-md shadow-cyan-950'
                        : 'hover:bg-slate-900/60 opacity-70'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 ${
                        activeStep >= idx ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-white">{step.title}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{step.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>คลิกเลือกลำดับขั้นเพื่อส่ง Event</span>
              <span className="font-mono text-cyan-400">Stage {activeStep + 1} of 4</span>
            </div>
          </div>

          {/* CARD 04: Webhook Backend Dispatch (col-span-7) */}
          <div className="lg:col-span-7 rounded-3xl p-6 sm:p-8 bg-[#0b1120] border border-slate-800 hover:border-slate-700 transition-all duration-300 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                  04. Webhook Backend Dispatch
                </span>
                <span className="text-xs text-emerald-400 font-mono font-semibold">200 OK Delivery</span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">
                กระจายข้อมูลสู่เซิร์ฟเวอร์หลังบ้านแบบเรียลไทม์
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                ส่งตรง Payload ในรูปแบบ JSON ที่มีมาตรฐานสูง พร้อมระบบส่งซ้ำอัตโนมัติ (Exponential Backoff Retries)
                และการยืนยันลายเซ็น HMAC เพื่อให้ระบบของคุณทำงานร่วมได้อย่างราบรื่น
              </p>

              {/* Terminal Code Mock */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
                <div className="flex items-center justify-between text-slate-500 pb-2 border-b border-slate-800">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" /> OUTBOUND WEBHOOK DISPATCH
                  </span>
                  <span className="text-emerald-400">STATUS: ACTIVE</span>
                </div>
                <div className="text-cyan-300">
                  POST {backendGateway.getConfig().webhookEndpoint} HTTP/1.1
                </div>
                <div className="text-slate-400">
                  Authorization: Bearer nk_live_•••••••
                </div>
                <div className="text-slate-400">
                  X-Nexus-Event: <span className="text-emerald-300 font-semibold">{lastDispatchedEvent}</span>
                </div>
                <div className="text-slate-500 text-[11px] pt-1">
                  &#123; &quot;contractId&quot;: &quot;0x712a83f982&quot;, &quot;gasUsed&quot;: 21450, &quot;consensus&quot;: true &#125;
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between gap-4">
              <span className="text-xs text-slate-400">ส่งข้อมูล JSON ไปยังหลังบ้าน</span>
              <button
                onClick={handleTriggerWebhookDispatch}
                disabled={isDispatching}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-400 to-teal-300 text-slate-950 font-semibold rounded-xl text-xs cursor-pointer hover:shadow-lg hover:shadow-cyan-500/20 transition-all disabled:opacity-50"
              >
                <SendHorizontal className="w-3.5 h-3.5" />
                {isDispatching ? 'กำลังส่ง...' : 'ส่งคำสั่งทดสอบ (Test Dispatch)'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
