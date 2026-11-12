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

  // State for Card 03: Contract Timeline & Manifest DAG
  const [activeStep, setActiveStep] = useState(2);

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
      memIdKeyA: '00123 (5-Digit Guard)',
      newLoanIdKeyB: 'NL-2026-8819',
      crdRule: 'แยกคีย์ระดับบุคคลออกจากคีย์ระดับสัญญา ห้ามคัดลอกข้อมูลข้ามสัญญา',
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
      await new Promise((r) => setTimeout(r, 50));
    }

    setActiveGateIndex(null);
    setIsScanningGates(false);

    await backendGateway.dispatchAction('bento.stop_gates_audit', {
      module: '02_stop_gates',
      totalGates: 16,
      passedGates: 16,
      auditedAt: new Date().toISOString(),
      invariants: ['V003_FORMAT_LOCKED', 'PDPA_ZERO_PII', 'NO_NEW_INTEREST_CALC', 'LEADING_ZERO_5_DIGITS'],
    });
  };

  // Interactive handler for Card 03
  const handleSelectTimelineStep = async (stepIndex: number) => {
    setActiveStep(stepIndex);
    const stepNames = [
      '01_Ingest_Payload (Mem_ID 5 หลัก)',
      '02_Stop_Gates_Scan (V003 & PDPA)',
      '03_Drive_Manifest_Sync (00_Project_Manifest.json)',
      '04_AppsScript_Commit (AI_Project_Workspace)',
    ];
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
      'manifest.scope_appended',
      'ledger.block_finalized',
      'gate.compliance_certified',
      'gas.webhook_acknowledged',
    ];
    const chosenEvent = events[Math.floor(Math.random() * events.length)];
    setLastDispatchedEvent(chosenEvent);

    await backendGateway.dispatchAction('bento.webhook_dispatch', {
      module: '04_webhook_backend_dispatch',
      eventName: chosenEvent,
      deliveryAttempt: 1,
      targetEndpoint: backendGateway.getConfig().baseUrl,
      payload: {
        contractId: '0x712a83f982',
        gasTarget: '00_Project_Manifest.json',
        consensus: true,
      },
    });

    setIsDispatching(false);
    onOpenLogsDrawer();
  };

  const gateNames = [
    '01. Leading Zero 5 หลัก', '02. แยก NewLoanID', '03. V003 Format Control', '04. PDPA Zero-PII',
    '05. ห้ามคำนวณเงินใหม่', '06. ปี พ.ศ./ค.ศ. มาตรฐาน', '07. Signature Ingestion', '08. State Boundary',
    '09. Call Depth Ceiling', '10. Return Buffer Check', '11. Zero-Address Shield', '12. Balance Invariant',
    '13. Role Pre-flight', '14. Event Pre-emission', '15. SLA Deadline', '16. Drive Manifest Anchor'
  ];

  return (
    <section id="bento" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900 border border-teal-500/30 text-xs font-mono text-teal-300">
            <Layers className="w-3.5 h-3.5" />
            <span>Architecture &amp; Core Modules (01–04)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight" style={{ textWrap: 'balance' }}>
            สถาปัตยกรรม 4 โมดูลหลักเพื่อความปลอดภัยสูงสุด
          </h2>
          <p className="text-base text-slate-300 leading-relaxed">
            ผสานการทำงานระหว่างการนำเข้าบัญชีคู่ กฎการจัดรูปแบบ V003 และการยิงคำสั่งเข้า Google Apps Script ใน Google Drive
          </p>
        </div>

        {/* Bento Grid: Asymmetric 4-Card Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* CARD 01: Dual-Key Ledger Ingestion (Marquee, col-span-7) */}
          <div className="lg:col-span-7 rounded-3xl p-6 sm:p-8 bg-[#0b1120] border border-slate-800 hover:border-slate-700 transition-all duration-300 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-mono font-bold text-teal-300 bg-teal-950/80 px-2.5 py-1 rounded-lg border border-teal-500/20">
                  01. Dual-Key Ledger Ingestion
                </span>
                <span className="text-xs text-slate-400 font-mono">Consensus: Mem_ID + LoanID</span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">
                การนำเข้าข้อมูลสัญญาผ่านกุญแจคู่ขนาน (CRD Standard)
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                แยกคีย์ระดับบุคคล (รหัสสมาชิก 5 หลักคงศูนย์นำหน้า) ออกจากคีย์ระดับสัญญา (NewLoanID)
                ป้องกันการนำข้อมูลหรือวันชำระล่าสุดข้ามสัญญามาปะปนกันตามกฎของระบบ
              </p>

              {/* Interactive Ingestion Simulator Widget */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="flex items-center gap-2 font-semibold text-slate-300 mb-1">
                      <KeyRound className="w-3.5 h-3.5 text-teal-400" /> Key A: Mem_ID (5 หลัก)
                    </div>
                    <div className="font-mono text-teal-300 text-[11px] truncate">
                      Leading Zero Guard: 00123
                    </div>
                    <div className="mt-1 text-[11px] text-emerald-400 font-medium">✓ ล็อกความยาว 5 หลัก</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="flex items-center gap-2 font-semibold text-slate-300 mb-1">
                      <KeyRound className="w-3.5 h-3.5 text-cyan-400" /> Key B: NewLoanID
                    </div>
                    <div className="font-mono text-cyan-300 text-[11px] truncate">
                      Contract Key: NL-2026-8819
                    </div>
                    <div className="mt-1 text-[11px] text-emerald-400 font-medium">✓ แยกสัญญาเดี่ยว/ร่วม</div>
                  </div>
                </div>

                {/* Progress & Hash */}
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-mono">
                    <span>สถานะการประมวลผล Ingestion</span>
                    <span className="text-teal-400">{dualKeyProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 transition-all duration-300"
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
              <span className="text-xs text-slate-400">ทดสอบ Ingest คำสั่งผ่าน Gateway</span>
              <button
                onClick={handleRunDualKeyIngestion}
                disabled={isIngesting}
                className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 rounded-xl border border-teal-500/30 text-xs font-semibold cursor-pointer transition-all disabled:opacity-50"
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
                <span className="text-sm font-mono font-bold text-teal-300 bg-teal-950/80 px-2.5 py-1 rounded-lg border border-teal-500/20">
                  02. 16 Stop Gates Compliance
                </span>
                <span className="text-xs text-emerald-400 font-mono font-semibold">16/16 Passed</span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">
                ด่านความปลอดภัย 16 ขั้น &amp; กฎ V003
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                ตรวจจับข้อมูลผิดรูปแบบ บล็อกข้อมูลส่วนบุคคล (PDPA Zero-PII) และห้ามคำนวณเงินหรือดอกเบี้ยใหม่เด็ดขาด
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
                          ? 'bg-teal-400 text-slate-950 font-bold scale-105 shadow-md shadow-teal-500/50'
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
                  <span className="text-emerald-400 font-mono font-bold">100% Zero-PII Leak</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-4">
              <span className="text-xs text-slate-400">สแกน Invariants ครบ 16 ด่าน</span>
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

          {/* CARD 03: Contract Timeline & Manifest DAG (col-span-5) */}
          <div className="lg:col-span-5 rounded-3xl p-6 sm:p-8 bg-[#0b1120] border border-slate-800 hover:border-slate-700 transition-all duration-300 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-mono font-bold text-teal-300 bg-teal-950/80 px-2.5 py-1 rounded-lg border border-teal-500/20">
                  03. Contract Timeline &amp; Manifest
                </span>
                <span className="text-xs text-teal-300 font-mono">Drive Sync</span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">
                ไทม์ไลน์สัญญาและ Manifest DAG
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                แสดงลำดับขั้นตอนการตรวจสอบและบันทึกประวัติการขยายงานลงสู่ <code className="text-teal-300 mono text-xs">00_Project_Manifest.json</code>
              </p>

              {/* Interactive Timeline Stepper */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90">
                {[
                  { title: 'นำเข้าข้อมูล Mem_ID 5 หลัก & NewLoanID', desc: 'Validated Dual-Key schemas' },
                  { title: 'ตรวจสอบ 16 Stop Gates & กฎ V003', desc: '100% Zero-PII & Invariants' },
                  { title: 'ซิงก์ 00_Project_Manifest.json ใน Drive', desc: 'AI_Project_Workspace active' },
                  { title: 'บันทึกสถานะสิ้นสุดใน Google Apps Script', desc: 'Apps Script Web App committed' },
                ].map((step, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectTimelineStep(idx)}
                    className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-3 cursor-pointer ${
                      activeStep === idx
                        ? 'bg-slate-900 border border-teal-500/50 shadow-md shadow-teal-950'
                        : 'hover:bg-slate-900/60 opacity-70'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 ${
                        activeStep >= idx ? 'bg-teal-400 text-slate-950' : 'bg-slate-800 text-slate-400'
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
              <span className="font-mono text-teal-400">Stage {activeStep + 1} of 4</span>
            </div>
          </div>

          {/* CARD 04: Webhook Backend Dispatch (col-span-7) */}
          <div className="lg:col-span-7 rounded-3xl p-6 sm:p-8 bg-[#0b1120] border border-slate-800 hover:border-slate-700 transition-all duration-300 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-mono font-bold text-teal-300 bg-teal-950/80 px-2.5 py-1 rounded-lg border border-teal-500/20">
                  04. Apps Script Webhook Dispatch
                </span>
                <span className="text-xs text-emerald-400 font-mono font-semibold">200 OK Delivery</span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">
                กระจายข้อมูลสู่ Google Apps Script Web App
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                ยิงคำสั่งในรูปแบบ JSON เข้าสู่ Web App Endpoint ของคุณ เพื่อบันทึกขอบเขตงานใหม่และประวัติการทำงานลงใน Google Drive ทันที
              </p>

              {/* Terminal Code Mock */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
                <div className="flex items-center justify-between text-slate-500 pb-2 border-b border-slate-800">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-teal-400" /> DISPATCH TO GOOGLE APPS SCRIPT
                  </span>
                  <span className="text-emerald-400">STATUS: CONNECTED</span>
                </div>
                <div className="text-teal-300 truncate">
                  POST https://script.google.com/macros/s/.../exec
                </div>
                <div className="text-slate-400">
                  X-Target-Manifest: <span className="text-white">00_Project_Manifest.json</span>
                </div>
                <div className="text-slate-400">
                  X-Nexus-Event: <span className="text-emerald-300 font-semibold">{lastDispatchedEvent}</span>
                </div>
                <div className="text-slate-500 text-[11px] pt-1">
                  &#123; &quot;workspaceId&quot;: &quot;1RvGehvlDrPTaR9JvQgCcFPqiQbRE8_yn&quot;, &quot;mode&quot;: &quot;AUTO_EXPAND&quot; &#125;
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between gap-4">
              <span className="text-xs text-slate-400">ส่งข้อมูล JSON ไปยังหลังบ้าน</span>
              <button
                onClick={handleTriggerWebhookDispatch}
                disabled={isDispatching}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 font-semibold rounded-xl text-xs cursor-pointer hover:shadow-lg hover:shadow-teal-500/20 transition-all disabled:opacity-50"
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
