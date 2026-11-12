import React, { useState, useEffect } from 'react';
import { PlusCircle, Layers, RefreshCw, CheckCircle2, Shield, FolderGit2, Sparkles, Send } from 'lucide-react';
import { backendGateway, ScopeItem } from '../services/backendGateway';
import { HighImpactPrimaryButton } from './HighImpactPrimaryButton';

const PRESET_TEMPLATES = {
  WORK1: {
    code: 'CRD-WORK-01',
    title: 'WORK 1: แยกตาราง พม. และ พม.+สัญญาอื่น',
    gate: 'DUAL_KEY_LEDGER',
    rule: 'ตรวจรอบมติ แยกสมาชิกที่มีเฉพาะ พม. 1 สัญญา ออกจากสมาชิกที่มีหลายสัญญา ห้ามคัดลอกวันชำระล่าสุดข้ามสัญญา',
  },
  WORK4: {
    code: 'CRD-WORK-04',
    title: 'WORK 4: เตรียมชุดพิมพ์จดหมายแจ้งหนี้ 9 หมวด & EMS',
    gate: 'PDPA_ZERO_PII',
    rule: 'ตรวจไฟล์รายชื่อ 9 หมวด (ผู้กู้/กู้ร่วม/ผู้ค้ำ × 2/4/5 งวด) เลือกโฟลเดอร์เดือนได้เอง และส่งเฉพาะจำนวนรายการขึ้น Cloud',
  },
  V003: {
    code: 'CRD-V003-GATE',
    title: 'V003 Format Gate: จัดรูปแบบวันที่ พ.ศ./ค.ศ. & รหัส 5 หลัก',
    gate: 'V003_FORMAT_ONLY',
    rule: 'จัดรูปแบบเฉพาะรหัสสมาชิก 5 หลักและปี พ.ศ./ค.ศ. หากข้อมูลผิดรูปแบบให้เว้นว่างและนับจำนวน ไม่เดาค่าแทน',
  },
  BRANCH14: {
    code: 'CRD-BRANCH-INTAKE',
    title: 'ระบบรับไฟล์รายงานสาขาจาก Gmail เข้าโฟลเดอร์ Drive',
    gate: 'AUTO_DRIVE_SYNC',
    rule: 'คัดแยกไฟล์แนบตามอีเมลสาขาและเดือนรายงานเข้าโฟลเดอร์ Staging โดยไม่เปิดอ่านข้อมูลส่วนบุคคล',
  },
};

interface ScopeBuilderSectionProps {
  onOpenLogsDrawer: () => void;
}

export const ScopeBuilderSection: React.FC<ScopeBuilderSectionProps> = ({ onOpenLogsDrawer }) => {
  const [scopes, setScopes] = useState<ScopeItem[]>(backendGateway.getScopes());
  const [code, setCode] = useState(`CRD-SCOPE-0${scopes.length + 1}`);
  const [title, setTitle] = useState('');
  const [gate, setGate] = useState('DUAL_KEY_LEDGER');
  const [rule, setRule] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  useEffect(() => {
    return backendGateway.onScopeChange((newScopes) => {
      setScopes(newScopes);
    });
  }, []);

  const handleApplyPreset = (key: keyof typeof PRESET_TEMPLATES) => {
    const preset = PRESET_TEMPLATES[key];
    if (preset) {
      setCode(preset.code);
      setTitle(preset.title);
      setGate(preset.gate);
      setRule(preset.rule);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    const newScope: ScopeItem = {
      id: code.trim() || `CRD-SCOPE-0${scopes.length + 1}`,
      title: title.trim(),
      gate,
      rule: rule.trim() || 'ยึดตามกฎมาตรฐาน CRD และ PDPA Zero-PII',
      status: 'ACTIVE_SYNCED',
      updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };

    backendGateway.addScope(newScope);

    // Dispatch to Google Apps Script
    const res = await backendGateway.dispatchAction('APPEND_NEW_SCOPE', {
      scope: newScope,
      manifestTarget: '00_Project_Manifest.json',
      workspaceId: '1RvGehvlDrPTaR9JvQgCcFPqiQbRE8_yn',
    });

    setIsSubmitting(false);
    setFeedback(`ส่งคำสั่งเพิ่มขอบเขตงาน "${newScope.id}" สู่ 00_Project_Manifest.json เรียบร้อย (${res.log.latencyMs}ms)`);
    onOpenLogsDrawer();

    // Reset inputs
    setTitle('');
    setRule('');
    setCode(`CRD-SCOPE-0${scopes.length + 2}`);
    setTimeout(() => setFeedback(null), 6000);
  };

  const handleResync = async (scope: ScopeItem) => {
    setSyncingId(scope.id);
    await backendGateway.dispatchAction('SYNC_EXISTING_SCOPE', {
      scope,
      manifestTarget: '00_Project_Manifest.json',
    });
    setSyncingId(null);
    onOpenLogsDrawer();
  };

  return (
    <section id="scope-builder" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-teal-950/70 border border-teal-500/30 text-xs font-mono text-teal-300">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>AI Project Workspace (Self-Expanding Scope)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight" style={{ textWrap: 'balance' }}>
            ตัวพัฒนาและเพิ่มขอบเขตงานอัตโนมัติในแอป
          </h2>
          <p className="text-base text-slate-300 leading-relaxed">
            สั่งงานและขยายขอบเขตโมดูลใหม่ได้จากในหน้านี้ทันทีโดยไม่ต้องแก้โค้ดภายนอก ระบบจะส่ง Payload เข้า Google Apps Script เพื่ออัปเดตไฟล์{' '}
            <code className="text-teal-300 font-mono text-xs bg-slate-900 px-1.5 py-0.5 rounded border border-teal-500/30">
              00_Project_Manifest.json
            </code>{' '}
            ใน Drive โฟลเดอร์ <code className="text-teal-300 font-mono text-xs bg-slate-900 px-1.5 py-0.5 rounded border border-teal-500/30">AI_Project_Workspace</code> ทันที
          </p>
        </div>

        {/* Builder Container */}
        <div className="rounded-3xl p-6 sm:p-8 bg-[#0b1120] border border-slate-800 shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-teal-400 animate-pulse" />
              <h3 className="text-lg font-bold text-white">เพิ่มขอบเขตงาน / โมดูลใหม่ (Direct Dispatch)</h3>
            </div>
            <span className="px-3 py-1 rounded-xl bg-teal-500/15 text-teal-300 font-mono text-xs border border-teal-500/30">
              {scopes.length} ขอบเขตงานกำลังทำงาน
            </span>
          </div>

          {/* Preset Chips */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>แตะเพื่อเติมแม่แบบขอบเขตงานด่วน (CRD Standard Templates):</span>
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleApplyPreset('WORK1')}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-teal-400/50 text-xs text-teal-300 transition-colors cursor-pointer"
              >
                + WORK 1: แยก พม. / พม.+สัญญาอื่น
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('WORK4')}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-teal-400/50 text-xs text-teal-300 transition-colors cursor-pointer"
              >
                + WORK 4: พิมพ์จดหมาย 9 หมวด &amp; EMS
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('V003')}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-teal-400/50 text-xs text-teal-300 transition-colors cursor-pointer"
              >
                + กฎ V003: ล็อกเลขสมาชิก 5 หลัก &amp; พ.ศ./ค.ศ.
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('BRANCH14')}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-teal-400/50 text-xs text-teal-300 transition-colors cursor-pointer"
              >
                + รับรายงานสาขาเข้า Drive อัตโนมัติ
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-4 pt-1">
            <div className="sm:col-span-4">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">รหัสโมดูล / ขอบเขตงาน</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="เช่น CRD-W01 หรือ MODULE-05"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white font-mono focus:outline-none focus:border-teal-400 transition-colors"
              />
            </div>

            <div className="sm:col-span-5">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">ชื่อขอบเขตงาน / คำสั่งให้ระบบทำ</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="เช่น ตรวจคีย์เลขสมาชิก 5 หลักและแยกสัญญา พม."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-teal-400 transition-colors"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">ด่านควบคุม (Stop Gate)</label>
              <select
                value={gate}
                onChange={(e) => setGate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-teal-400 transition-colors"
              >
                <option value="DUAL_KEY_LEDGER">Dual-Key (MemID + LoanID)</option>
                <option value="PDPA_ZERO_PII">PDPA Zero-PII Gate</option>
                <option value="V003_FORMAT_ONLY">V003 Format Control</option>
                <option value="AUTO_DRIVE_SYNC">Auto Drive Manifest Sync</option>
              </select>
            </div>

            <div className="sm:col-span-12">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">รายละเอียดกฎ / เงื่อนไขที่ห้ามเพี้ยน</label>
              <textarea
                rows={2}
                value={rule}
                onChange={(e) => setRule(e.target.value)}
                placeholder="ระบุกติกา เช่น ห้ามคำนวณดอกเบี้ยใหม่, คงศูนย์นำหน้า 5 หลัก, บันทึกผลลง 00_Project_Manifest.json"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-teal-400 transition-colors"
              />
            </div>

            <div className="sm:col-span-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <span className="text-xs text-teal-300">
                {feedback || 'พร้อมส่งคำสั่งไปยัง Google Apps Script Web App'}
              </span>
              <HighImpactPrimaryButton
                type="submit"
                size="md"
                disabled={isSubmitting}
                icon={<Send className="w-4 h-4 text-slate-950" />}
              >
                {isSubmitting ? 'กำลังบันทึกลง Manifest...' : 'บันทึก & ยิงเข้า Google Apps Script ทันที'}
              </HighImpactPrimaryButton>
            </div>
          </form>

          {/* Active Scopes Grid */}
          <div className="pt-6 border-t border-slate-800/80">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              ขอบเขตงานที่ทำงานอยู่ในปัจจุบัน (Active Manifest Scopes)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {scopes.map((scope) => (
                <div
                  key={scope.id}
                  className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-teal-500/15 text-teal-300 font-mono text-xs font-bold">
                        {scope.id}
                      </span>
                      <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> {scope.gate}
                      </span>
                    </div>
                    <h5 className="text-sm font-semibold text-white">{scope.title}</h5>
                    <p className="text-xs text-slate-400 leading-relaxed">{scope.rule}</p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>อัปเดต: {scope.updatedAt}</span>
                    <button
                      type="button"
                      onClick={() => handleResync(scope)}
                      disabled={syncingId === scope.id}
                      className="text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <RefreshCw className={`w-3 h-3 ${syncingId === scope.id ? 'animate-spin' : ''}`} />
                      <span>{syncingId === scope.id ? 'กำลังซิงก์...' : 'ยิงซิงก์ซ้ำ →'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
