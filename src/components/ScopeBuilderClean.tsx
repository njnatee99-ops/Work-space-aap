import React, { useState, useEffect } from 'react';
import { PlusCircle, Sparkles, Send, RefreshCw, CheckCircle2, Trash2, FolderGit2 } from 'lucide-react';
import { backendGateway } from '../services/backendGateway';
import { ScopeItem } from '../types';
import { LiquidButton, MetalButton } from './ui/liquid-glass-button';

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

interface ScopeBuilderCleanProps {
  onOpenLogsModal: () => void;
}

export const ScopeBuilderClean: React.FC<ScopeBuilderCleanProps> = ({ onOpenLogsModal }) => {
  const [scopes, setScopes] = useState<ScopeItem[]>(backendGateway.getScopes());
  const [code, setCode] = useState(`CRD-SCOPE-0${scopes.length + 1}`);
  const [title, setTitle] = useState('');
  const [gate, setGate] = useState('DUAL_KEY_LEDGER');
  const [rule, setRule] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState<string | null>(null);

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
      setActivePreset(key);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !code.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setFeedback('กำลังส่งขอบเขตงานไปยัง Google Apps Script...');

    const newScope: ScopeItem = {
      id: code.trim(),
      title: title.trim(),
      gate,
      rule: rule.trim() || 'ควบคุมการทำงานตามระเบียบ CRD และ 00_Project_Manifest.json',
      status: 'ACTIVE_SYNCED',
      updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };

    try {
      backendGateway.addScope(newScope);
      const res = await backendGateway.dispatchAction('ADD_SCOPE', {
        scope: newScope,
        manifestTarget: '00_Project_Manifest.json',
      });

      setFeedback(`✓ เพิ่มขอบเขตงาน "${newScope.id}" สำเร็จ และบันทึกเข้า Drive แล้ว (${res.log.latencyMs}ms)`);
      setTitle('');
      setRule('');
      setCode(`CRD-SCOPE-0${scopes.length + 2}`);
      setActivePreset(null);
    } catch {
      setFeedback('บันทึกในเครื่องเรียบร้อย (ออฟไลน์โหมด)');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setFeedback(null), 5000);
    }
  };

  const handleSyncToDrive = async (scope: ScopeItem) => {
    setSyncingId(scope.id);
    await backendGateway.dispatchAction('SYNC_EXISTING_SCOPE', {
      scope,
      manifestTarget: '00_Project_Manifest.json',
    });
    setSyncingId(null);
  };

  const handleDeleteScope = (id: string) => {
    backendGateway.removeScope(id);
  };

  return (
    <section id="sectionExpandScope" className="card-glass rounded-3xl p-6 sm:p-8 space-y-6 border border-blue-200/90 shadow-[0_16px_40px_-16px_rgba(20,50,90,0.1)]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-100 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#14243A] dark:text-white flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-blue-600 dark:bg-teal-400 animate-pulse" />
            ตัวพัฒนาและเพิ่มขอบเขตงานอัตโนมัติ (Self-Expanding Scope)
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
            พิมพ์ชื่อขอบเขตงานหรือเงื่อนไขที่ต้องการเพิ่ม ระบบจะยิงเข้า Google Apps Script และอัปเดต Manifest บน Google Drive ให้ทันที
          </p>
        </div>
        <span className="px-3.5 py-1.5 rounded-full bg-blue-100 dark:bg-teal-500/15 text-blue-800 dark:text-teal-300 font-mono text-xs font-bold border border-blue-200 dark:border-teal-500/30 shrink-0">
          {scopes.length} ขอบเขตงาน
        </span>
      </div>

      {/* Preset Chips */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-teal-400" />
          <span>แตะเพื่อเติมแม่แบบขอบเขตงานด่วน (1-Click Presets):</span>
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleApplyPreset('WORK1')}
            className={`px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer font-semibold border ${
              activePreset === 'WORK1'
                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/30'
                : 'bg-white/80 hover:bg-white dark:bg-slate-900 border-blue-200 dark:border-slate-700 text-blue-900 dark:text-teal-300 shadow-2xs'
            }`}
          >
            + WORK 1: แยก พม. / พม.+สัญญาอื่น
          </button>

          <button
            type="button"
            onClick={() => handleApplyPreset('WORK4')}
            className={`px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer font-semibold border ${
              activePreset === 'WORK4'
                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/30'
                : 'bg-white/80 hover:bg-white dark:bg-slate-900 border-blue-200 dark:border-slate-700 text-blue-900 dark:text-teal-300 shadow-2xs'
            }`}
          >
            + WORK 4: พิมพ์จดหมาย 9 หมวด &amp; EMS
          </button>

          <button
            type="button"
            onClick={() => handleApplyPreset('V003')}
            className={`px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer font-semibold border ${
              activePreset === 'V003'
                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/30'
                : 'bg-white/80 hover:bg-white dark:bg-slate-900 border-blue-200 dark:border-slate-700 text-blue-900 dark:text-teal-300 shadow-2xs'
            }`}
          >
            + กฎ V003: ล็อกเลขสมาชิก 5 หลัก &amp; พ.ศ./ค.ศ.
          </button>

          <button
            type="button"
            onClick={() => handleApplyPreset('BRANCH14')}
            className={`px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer font-semibold border ${
              activePreset === 'BRANCH14'
                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/30'
                : 'bg-white/80 hover:bg-white dark:bg-slate-900 border-blue-200 dark:border-slate-700 text-blue-900 dark:text-teal-300 shadow-2xs'
            }`}
          >
            + รับรายงานสาขาเข้า Drive อัตโนมัติ
          </button>
        </div>
      </div>

      {/* Expanded Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-4 pt-1">
        <div className="sm:col-span-4">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">รหัสโมดูล / ขอบเขตงาน</label>
          <input
            type="text"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="เช่น CRD-W01 หรือ MODULE-05"
            className="w-full px-4 py-3 rounded-2xl bg-white/95 dark:bg-slate-950 border border-blue-200 dark:border-slate-800 text-sm text-[#14243A] dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-2xs transition-all"
          />
        </div>

        <div className="sm:col-span-5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">ชื่อขอบเขตงาน / คำสั่งให้ระบบทำ</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="เช่น ตรวจคีย์เลขสมาชิก 5 หลักและแยกสัญญา พม."
            className="w-full px-4 py-3 rounded-2xl bg-white/95 dark:bg-slate-950 border border-blue-200 dark:border-slate-800 text-sm text-[#14243A] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-2xs transition-all"
          />
        </div>

        <div className="sm:col-span-3">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">ด่านควบคุม (Stop Gate)</label>
          <select
            value={gate}
            onChange={(e) => setGate(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-white/95 dark:bg-slate-950 border border-blue-200 dark:border-slate-800 text-sm text-[#14243A] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-2xs transition-all font-medium"
          >
            <option value="DUAL_KEY_LEDGER">Dual-Key (MemID + LoanID)</option>
            <option value="PDPA_ZERO_PII">PDPA Zero-PII Gate</option>
            <option value="V003_FORMAT_ONLY">V003 Format Control</option>
            <option value="AUTO_DRIVE_SYNC">Auto Drive Manifest Sync</option>
          </select>
        </div>

        <div className="sm:col-span-12">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">รายละเอียดกฎ / เงื่อนไขที่ห้ามเพี้ยน</label>
          <textarea
            rows={2}
            value={rule}
            onChange={(e) => setRule(e.target.value)}
            placeholder="ระบุกติกา เช่น ห้ามคำนวณดอกเบี้ยใหม่, คงศูนย์นำหน้า 5 หลัก, บันทึกผลลง 00_Project_Manifest.json"
            className="w-full px-4 py-3 rounded-2xl bg-white/95 dark:bg-slate-950 border border-blue-200 dark:border-slate-800 text-sm text-[#14243A] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-2xs transition-all"
          />
        </div>

        <div className="sm:col-span-12 flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <span className="text-xs font-medium text-blue-700 dark:text-teal-300">
            {feedback || 'พร้อมส่งคำสั่งไปยัง Google Apps Script Web App'}
          </span>

          <LiquidButton
            type="submit"
            disabled={isSubmitting}
            size="lg"
            className="w-full sm:w-auto px-7 py-3 text-sm font-bold shadow-md cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                <span>กำลังส่งข้อมูล...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 text-blue-600" />
                <span>ยิงขอบเขตงานเข้า Drive (Deploy Scope)</span>
              </>
            )}
          </LiquidButton>
        </div>
      </form>

      {/* Scope List (Expanded Light Frosted Glass Cards) */}
      <div className="space-y-3 pt-4 border-t border-blue-100 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <span>รายการขอบเขตงานที่ใช้งานอยู่ในระบบ:</span>
        </h3>

        <div className="space-y-3">
          {scopes.map((s) => (
            <div
              key={s.id}
              className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-slate-900/90 border border-blue-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs hover:shadow-sm transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-blue-100 dark:bg-teal-500/15 text-blue-800 dark:text-teal-300 font-mono text-xs font-bold border border-blue-200 dark:border-teal-500/30">
                    {s.id}
                  </span>
                  <span className="text-sm font-bold text-[#14243A] dark:text-white">
                    {s.title}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {s.rule}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Gate: {s.gate}</span>
                  <span>•</span>
                  <span>อัปเดต: {s.updatedAt}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => handleSyncToDrive(s)}
                  disabled={syncingId === s.id}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-slate-800 text-xs font-semibold text-blue-700 dark:text-teal-300 border border-blue-200 dark:border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${syncingId === s.id ? 'animate-spin' : ''}`} />
                  <span>ซิงก์ Drive</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteScope(s.id)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                  title="ลบ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
