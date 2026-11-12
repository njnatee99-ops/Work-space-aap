import React, { useState, useEffect } from 'react';
import {
  Printer,
  Eye,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Sliders,
  FileText,
  Lock,
  Unlock,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Clock,
  Layers,
  ChevronRight,
  Maximize2,
  Check,
  Zap,
  Info
} from 'lucide-react';
import {
  Work4StatusResponse,
  Work4Category,
  Work4PreviewResponse,
  Work4PrintResponse
} from '../types';
import { work4Service, generateUUID, DEFAULT_OFFLINE_MOCK_DATA } from '../services/work4Service';

interface Work4PrintStudioProps {
  onBack?: () => void;
  theme?: 'light' | 'dark';
}

export const Work4PrintStudio: React.FC<Work4PrintStudioProps> = ({
  onBack,
  theme = 'light'
}) => {
  const [data, setData] = useState<Work4StatusResponse>(DEFAULT_OFFLINE_MOCK_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Work4Category>(DEFAULT_OFFLINE_MOCK_DATA.categories[6]); // C07 default
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedMonth, setSelectedMonth] = useState('11');
  
  // Margin calibration (mm)
  const [marginTopMm, setMarginTopMm] = useState<number>(0);
  const [marginLeftMm, setMarginLeftMm] = useState<number>(0);
  
  // Preview state
  const [previewData, setPreviewData] = useState<Work4PreviewResponse | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  
  // Print execution & Double-click guard state
  const [isPrinting, setIsPrinting] = useState(false);
  const [printSuccessNotice, setPrintSuccessNotice] = useState<string | null>(null);
  const [printErrorNotice, setPrintErrorNotice] = useState<string | null>(null);
  const [lastIdempotencyKey, setLastIdempotencyKey] = useState<string>('');
  const [jobHistory, setJobHistory] = useState<Array<{
    job_id: string;
    idempotency_key: string;
    category: string;
    status: string;
    time: string;
    message: string;
  }>>([]);

  // Fetch status on mount or month/year change
  const fetchStatus = async () => {
    setIsLoading(true);
    try {
      const res = await work4Service.getStatus(selectedYear, selectedMonth);
      setData(res);
      // update selected category reference
      const found = res.categories.find(c => c.code === selectedCategory.code) || res.categories[0];
      setSelectedCategory(found);
    } catch (err) {
      console.error('Failed to load status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [selectedYear, selectedMonth]);

  // Load preview when category or margins change
  const handleLoadPreview = async (cat: Work4Category) => {
    if (cat.status !== 'FOUND') return;
    setIsPreviewLoading(true);
    try {
      const res = await work4Service.getPreview({
        year: selectedYear,
        month: selectedMonth,
        category_code: cat.code,
        margin_top_mm: marginTopMm,
        margin_left_mm: marginLeftMm
      });
      setPreviewData(res);
      setCurrentPage(1);
    } catch (err) {
      console.error('Preview error:', err);
    } finally {
      setIsPreviewLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCategory && selectedCategory.status === 'FOUND') {
      handleLoadPreview(selectedCategory);
    }
  }, [selectedCategory.code, marginTopMm, marginLeftMm]);

  // Handle Print Action with Debounce & Idempotency Key Guard
  const handlePrint = async (cat: Work4Category) => {
    if (isPrinting) return; // Debounce guard

    // 1. Printer Readiness Check
    if (!data.printer_status.is_ready && data.mode === 'OFFLINE_MOCK') {
      setPrintErrorNotice(`ระบบระงับการสั่งพิมพ์: ${data.printer_status.message}`);
      setTimeout(() => setPrintErrorNotice(null), 6000);
      return;
    }

    setIsPrinting(true);
    setPrintErrorNotice(null);
    setPrintSuccessNotice(null);

    // Generate Idempotency Key (UUID v4)
    const idempotencyKey = generateUUID();
    const jobId = `JOB-${selectedYear}${selectedMonth}-${cat.code}-${Math.floor(100 + Math.random() * 900)}`;
    setLastIdempotencyKey(idempotencyKey);

    try {
      const res = await work4Service.sendPrint({
        job_id: jobId,
        idempotency_key: idempotencyKey,
        category_code: cat.code,
        confirmed_by_owner: true
      });

      // Append to Job History
      setJobHistory(prev => [
        {
          job_id: res.job_id,
          idempotency_key: idempotencyKey,
          category: `${cat.code}: ${cat.name}`,
          status: res.status,
          time: new Date().toLocaleTimeString('th-TH'),
          message: res.message || ''
        },
        ...prev.slice(0, 9)
      ]);

      if (res.status === 'BLOCKED_CMS2_OFFLINE') {
        setPrintErrorNotice(`ความปลอดภัย: ${res.message} (Idempotency Key: ${idempotencyKey.substring(0, 8)}...)`);
      } else if (res.status === 'QUEUED') {
        setPrintSuccessNotice(`สำเร็จ! ส่งงาน ${jobId} เข้า Spooler Windows บน CMS-2 เรียบร้อย (จำนวน ${cat.pdf_pages} แผ่น A6)`);
      }
    } catch (err: any) {
      setPrintErrorNotice(`เกิดข้อผิดพลาดในการสั่งพิมพ์: ${err?.message || 'Network error'}`);
    } finally {
      setTimeout(() => {
        setIsPrinting(false);
      }, 1000);
    }
  };

  // Toggle Mode for local verification
  const handleToggleMode = async () => {
    setIsLoading(true);
    try {
      const updated = await work4Service.toggleMode();
      setData(updated);
      setPrintSuccessNotice(`สลับโหมดเป็น: ${updated.mode === 'OFFLINE_MOCK' ? 'โหมดจำลอง (OFFLINE_MOCK)' : 'โหมดจริง (CMS2_LIVE)'} เรียบร้อย`);
      setTimeout(() => setPrintSuccessNotice(null), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Metric summaries
  const totalFoundRecords = data.categories.filter(c => c.status === 'FOUND').reduce((acc, c) => acc + c.record_count, 0);
  const totalFoundPages = data.categories.filter(c => c.status === 'FOUND').reduce((acc, c) => acc + c.pdf_pages, 0);
  const skippedCount = data.categories.filter(c => c.status === 'SKIPPED_EMPTY').length;
  const errorCount = data.categories.filter(c => c.status === 'ERROR').length;

  return (
    <div className="space-y-6 pb-12 animate-fade-in font-sans">
      {/* Top Banner & Mode Status */}
      <div className={`rounded-3xl p-6 sm:p-7 border backdrop-blur-xl transition-all shadow-[0_16px_40px_-16px_rgba(20,50,90,0.1)] ${
        data.mode === 'OFFLINE_MOCK'
          ? 'bg-amber-500/10 border-amber-500/30 text-amber-950 dark:text-amber-200'
          : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono uppercase tracking-wide flex items-center gap-1.5 shadow-xs ${
                data.mode === 'OFFLINE_MOCK'
                  ? 'bg-amber-500 text-white animate-pulse'
                  : 'bg-emerald-600 text-white'
              }`}>
                {data.mode === 'OFFLINE_MOCK' ? (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>โหมดจำลอง (CMS-2 ออฟไลน์)</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-3.5 h-3.5" />
                    <span>CMS-2 ออนไลน์ (Live Spooler)</span>
                  </>
                )}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                OFFLINE DATA CONTRACT ปลอด PII 100%
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#14243A] dark:text-white flex items-center gap-2">
              <Printer className="w-6 h-6 text-blue-600 dark:text-teal-400" />
              <span>พิมพ์หนังสือบอกกล่าวการชำระหนี้ (WORK 4 — A6)</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {data.printer_status.message}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleMode}
              disabled={isLoading}
              className="px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-2 bg-white/90 dark:bg-slate-900 hover:bg-white text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 shadow-xs"
              title="สลับโหมดจำลองและโหมดจริงเพื่อทดสอบกติกาความปลอดภัย"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>จำลองสลับโหมด ({data.mode === 'OFFLINE_MOCK' ? 'เปิดเป็น LIVE' : 'กลับเป็น MOCK'})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Alert Notices */}
      {printSuccessNotice && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-500/50 rounded-2xl text-xs sm:text-sm text-emerald-900 dark:text-emerald-200 flex items-start gap-2.5 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <span>{printSuccessNotice}</span>
        </div>
      )}

      {printErrorNotice && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-500/50 rounded-2xl text-xs sm:text-sm text-amber-900 dark:text-amber-200 flex items-start gap-2.5 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <span>{printErrorNotice}</span>
        </div>
      )}

      {/* 4 CORE ADVANTAGES HIGHLIGHT CARD (Contract Requirement) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-blue-200/80 dark:border-slate-800 shadow-2xs space-y-1">
          <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400 font-bold text-xs">
            <ShieldCheck className="w-4 h-4" />
            <span>1. ล็อกปุ่มกันกดเบิ้ล</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
            Idempotency Key ป้องกันการสั่งพิมพ์ซ้ำซ้อนขณะประมวลผล
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-blue-200/80 dark:border-slate-800 shadow-2xs space-y-1">
          <div className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-400 font-bold text-xs">
            <Printer className="w-4 h-4" />
            <span>2. เช็กสถานะเครื่องพิมพ์</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
            {data.printer_status.is_ready ? 'เครื่องพิมพ์พร้อมทำงาน' : 'เครื่องพิมพ์ออฟไลน์ (ล็อกปุ่มพิมพ์)'}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-blue-200/80 dark:border-slate-800 shadow-2xs space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
            <Eye className="w-4 h-4" />
            <span>3. แยกพรีวิว / พิมพ์จริง</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
            ตรวจดูฟอร์ม A6 และปรับระยะขอบได้เต็มที่ก่อนส่งพิมพ์
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-blue-200/80 dark:border-slate-800 shadow-2xs space-y-1">
          <div className="flex items-center gap-1.5 text-teal-700 dark:text-teal-400 font-bold text-xs">
            <Zap className="w-4 h-4" />
            <span>4. ตัด Excel ออก 100%</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
            อ่านไฟล์ .RPT ตรงสู่ PDF A6 รวดเร็ว ไม่เพี้ยน ปลอด PII
          </p>
        </div>
      </div>

      {/* SECTION 1: INPUT — Filter, Month Selector & Margin Calibration */}
      <div className="card-glass rounded-3xl p-5 sm:p-6 border border-blue-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-blue-100 dark:border-slate-800 pb-3">
          <h3 className="text-sm sm:text-base font-bold text-[#14243A] dark:text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600 dark:text-teal-400" />
            <span>[INPUT] รอบเดือน และ ปรับแต่งระยะขอบเครื่องพิมพ์ (A6 Margins)</span>
          </h3>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
            Task: {data.task_id}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Year/Month selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">รอบปี / เดือนที่สแกน</label>
            <div className="flex items-center gap-2">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-blue-500"
              >
                <option value="2026">2026 (2569)</option>
                <option value="2025">2025 (2568)</option>
              </select>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-blue-500"
              >
                <option value="11">11 — พฤศจิกายน</option>
                <option value="12">12 — ธันวาคม</option>
                <option value="10">10 — ตุลาคม</option>
              </select>
            </div>
          </div>

          {/* Top Margin Slider (-10 to +10 mm) */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">ระยะขอบบน (Top Margin):</span>
              <span className="font-mono font-bold text-blue-600 dark:text-teal-400">{marginTopMm >= 0 ? `+${marginTopMm}` : marginTopMm} มม.</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="-10"
                max="10"
                step="0.5"
                value={marginTopMm}
                onChange={(e) => setMarginTopMm(parseFloat(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <button
                onClick={() => setMarginTopMm(0)}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 hover:text-blue-600 text-xs"
                title="รีเซ็ตขอบบนเป็น 0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Left Margin Slider (-10 to +10 mm) */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">ระยะขอบซ้าย (Left Margin):</span>
              <span className="font-mono font-bold text-blue-600 dark:text-teal-400">{marginLeftMm >= 0 ? `+${marginLeftMm}` : marginLeftMm} มม.</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="-10"
                max="10"
                step="0.5"
                value={marginLeftMm}
                onChange={(e) => setMarginLeftMm(parseFloat(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <button
                onClick={() => setMarginLeftMm(0)}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 hover:text-blue-600 text-xs"
                title="รีเซ็ตขอบซ้ายเป็น 0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: PROCESS & 9-CATEGORY RESULT BLOCK */}
      <div className="space-y-4">
        {/* Metric summary bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-blue-200 dark:border-slate-800 shadow-2xs">
            <span className="text-xs text-slate-500 dark:text-slate-400">สัญญาที่พบ (Found)</span>
            <div className="text-xl sm:text-2xl font-black text-blue-600 dark:text-teal-400 mt-0.5">
              {totalFoundRecords} <span className="text-xs font-normal text-slate-500">ราย</span>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-blue-200 dark:border-slate-800 shadow-2xs">
            <span className="text-xs text-slate-500 dark:text-slate-400">หน้า A6 พร้อมพิมพ์</span>
            <div className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
              {totalFoundPages} <span className="text-xs font-normal text-slate-500">หน้า</span>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-blue-200 dark:border-slate-800 shadow-2xs">
            <span className="text-xs text-slate-500 dark:text-slate-400">หมวดว่าง (Auto-Skip)</span>
            <div className="text-xl sm:text-2xl font-black text-slate-600 dark:text-slate-400 mt-0.5">
              {skippedCount} <span className="text-xs font-normal text-slate-500">หมวด</span>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-blue-200 dark:border-slate-800 shadow-2xs">
            <span className="text-xs text-slate-500 dark:text-slate-400">หมวดติดข้อผิดพลาด</span>
            <div className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400 mt-0.5">
              {errorCount} <span className="text-xs font-normal text-slate-500">หมวด</span>
            </div>
          </div>
        </div>

        {/* 9 Categories List & Interactive Selector */}
        <div className="card-glass rounded-3xl p-5 sm:p-6 border border-blue-200/90 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-[#14243A] dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600 dark:text-teal-400" />
                <span>[RESULT BLOCK] ตารางสถานะ 9 หมวดมาตรฐาน (CLT RPT Index)</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                คลิกเลือกหมวดเพื่อดูพรีวิว A6 ทันที หรือสั่งพิมพ์รายหมวด
              </p>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 font-bold w-fit">
              {data.month_label}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {data.categories.map((cat) => {
              const isSelected = selectedCategory.code === cat.code;
              const isFound = cat.status === 'FOUND';
              const isSkipped = cat.status === 'SKIPPED_EMPTY';
              const isError = cat.status === 'ERROR';

              return (
                <div
                  key={cat.code}
                  onClick={() => {
                    setSelectedCategory(cat);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'bg-blue-50/90 dark:bg-teal-950/40 border-blue-500 dark:border-teal-400 shadow-md ring-2 ring-blue-500/20'
                      : isFound
                      ? 'bg-white/80 dark:bg-slate-900/80 border-blue-100 dark:border-slate-800 hover:border-blue-300 shadow-2xs'
                      : 'bg-slate-50/60 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800/80 opacity-75'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono font-bold text-blue-700 dark:text-teal-300 bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 rounded-md">
                          {cat.code}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          {cat.rpt_prefix}
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                        isFound
                          ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-300'
                          : isSkipped
                          ? 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          : 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-300'
                      }`}>
                        {cat.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-[#14243A] dark:text-white">
                      {cat.name}
                    </h4>

                    <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{cat.form_type}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      {isFound ? (
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {cat.record_count} ราย <span className="text-slate-400 font-normal">({cat.pdf_pages} หน้า)</span>
                        </span>
                      ) : isSkipped ? (
                        <span className="text-slate-400 italic">ไม่มีข้อมูลข้ามอัตโนมัติ</span>
                      ) : (
                        <span className="text-rose-500 font-mono text-[11px]">{cat.error_code}</span>
                      )}
                    </div>

                    {isFound && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCategory(cat);
                          setIsPreviewModalOpen(true);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/50 dark:hover:bg-blue-800/60 text-blue-800 dark:text-blue-200 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>พรีวิว</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 3: INTERACTIVE A6 PREVIEW VISUALIZER & DUAL-ACTION CONTROLS */}
      <div className="card-glass rounded-3xl p-5 sm:p-7 border border-blue-200/90 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#14243A] dark:text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600 dark:text-teal-400" />
              <span>พรีวิวเอกสารขนาด A6 (105 × 148 mm) — {selectedCategory.code}: {selectedCategory.name}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              ฟอร์ม: {selectedCategory.form_type} | ระยะขอบบน: {marginTopMm} mm, ซ้าย: {marginLeftMm} mm
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPreviewModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>ขยายเต็มจอ</span>
            </button>
          </div>
        </div>

        {/* Visual A6 Sheet Representation */}
        <div className="flex justify-center p-4 sm:p-6 bg-slate-100/70 dark:bg-slate-950/70 rounded-2xl border border-slate-200 dark:border-slate-800/80">
          <div
            className="w-full max-w-[340px] aspect-[105/148] bg-white text-slate-900 rounded-xl shadow-xl border border-slate-300 relative overflow-hidden flex flex-col justify-between p-4 transition-all"
            style={{
              paddingTop: `${16 + marginTopMm * 1.5}px`,
              paddingLeft: `${16 + marginLeftMm * 1.5}px`,
            }}
          >
            {/* Watermark in OFFLINE_MOCK mode */}
            {data.mode === 'OFFLINE_MOCK' && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center -rotate-30 opacity-15">
                <span className="text-2xl font-black font-mono text-slate-500 uppercase tracking-widest text-center">
                  OFFLINE MOCK<br />ZERO PII SAFE
                </span>
              </div>
            )}

            {/* A6 Form Header */}
            <div className="border-b-2 border-slate-800 pb-2 space-y-1">
              <div className="flex justify-between items-start text-[10px] font-mono text-slate-600">
                <span>สหกรณ์ออมทรัพย์ (CRD SYSTEM)</span>
                <span className="font-bold text-blue-700">A6 FORM {selectedCategory.code}</span>
              </div>
              <h5 className="text-xs font-black text-center text-slate-900">
                {selectedCategory.form_type.includes('ก.2/ค.2') ? 'หนังสือบอกกล่าวการชำระหนี้ (แบบ ก.2 / ค.2)' : 'ใบแจ้งเตือนหนี้ค้างชำระ (ใบฟ้า EMS)'}
              </h5>
              <div className="text-[9px] text-center text-slate-500 font-mono">
                ต้นทาง: {selectedCategory.rpt_prefix}.RPT | ไม่ผ่าน Excel (Direct RPT)
              </div>
            </div>

            {/* Mock Content Body (100% Zero-PII) */}
            <div className="space-y-2 text-[10px] text-slate-700 flex-1 py-3">
              <div className="flex justify-between border-b border-dashed border-slate-200 pb-1">
                <span className="font-semibold">เรียน สมาชิก/ผู้กู้/ผู้ค้ำ:</span>
                <span className="font-mono text-slate-500">เลขที่สัญญา: [LN-2026-XXXXX]</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-slate-200 pb-1">
                <span className="font-semibold">หมวดการแจ้ง:</span>
                <span className="font-bold text-blue-900">{selectedCategory.name}</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-slate-200 pb-1">
                <span className="font-semibold">สถานะการค้าง:</span>
                <span className="font-mono text-slate-600">งวดที่ครบกำหนดตามมติ</span>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200 text-[9px] text-slate-600 space-y-1">
                <div className="font-bold text-slate-800">ตราสาร EMS ตอบรับในประเทศ:</div>
                <div className="flex justify-between font-mono">
                  <span>Tracking Code:</span>
                  <span>[EMS-SIMULATED-A6]</span>
                </div>
              </div>
            </div>

            {/* A6 Footer */}
            <div className="border-t border-slate-200 pt-2 flex justify-between items-center text-[9px] text-slate-500 font-mono">
              <span>หน้า {currentPage} จาก {selectedCategory.pdf_pages || 1}</span>
              <span className="text-blue-700 font-bold">105x148 mm</span>
            </div>
          </div>
        </div>

        {/* SECTION 4: ACTION (Debounced Print & Preview Buttons) */}
        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Primary Button 1: Dedicated Preview Button */}
            <button
              onClick={() => setIsPreviewModalOpen(true)}
              className="w-full sm:flex-1 py-3.5 px-5 rounded-2xl font-bold text-sm bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-700 flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all"
            >
              <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>เปิดดูพรีวิว A6 ({selectedCategory.pdf_pages} หน้า)</span>
            </button>

            {/* Primary Button 2: Dedicated Windows Print Button with Debounce Guard & Mode Gate */}
            <button
              onClick={() => handlePrint(selectedCategory)}
              disabled={isPrinting || (data.mode === 'OFFLINE_MOCK' && !data.printer_status.is_ready)}
              className={`w-full sm:flex-1 py-3.5 px-5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                data.mode === 'OFFLINE_MOCK'
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-700 cursor-not-allowed opacity-80'
                  : isPrinting
                  ? 'bg-emerald-600/70 text-white cursor-wait'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-emerald-500/20 hover:scale-[1.01]'
              }`}
              title={
                data.mode === 'OFFLINE_MOCK'
                  ? 'ปุ่มถูกล็อก: เครื่อง CMS-2 ออฟไลน์ ไม่สามารถส่งคำสั่งพิมพ์จริงได้'
                  : 'สั่งพิมพ์เอกสาร A6 ออกเครื่องพิมพ์ Windows บน CMS-2'
              }
            >
              {isPrinting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>กำลังส่งเข้าคิวพิมพ์ (Idempotency Guard)...</span>
                </>
              ) : data.mode === 'OFFLINE_MOCK' ? (
                <>
                  <Lock className="w-4 h-4 text-amber-500" />
                  <span>ล็อกปุ่มสั่งพิมพ์จริง (CMS-2 ออฟไลน์)</span>
                </>
              ) : (
                <>
                  <Printer className="w-4 h-4" />
                  <span>ยืนยันสั่งพิมพ์จริง ({selectedCategory.code})</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-1 font-mono">
            <span>เครื่องพิมพ์เป้าหมาย: {data.printer_status.printer_name}</span>
            <span>Host: {data.printer_status.host}</span>
          </div>
        </div>
      </div>

      {/* JOB QUEUE & IDEMPOTENCY EXECUTION LOG */}
      {jobHistory.length > 0 && (
        <div className="card-glass rounded-3xl p-5 sm:p-6 border border-blue-200/90 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-blue-100 dark:border-slate-800 pb-2">
            <h4 className="text-xs sm:text-sm font-bold text-[#14243A] dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600 dark:text-teal-400" />
              <span>ประวัติคำสั่งพิมพ์และ Idempotency Log (กันกดเบิ้ล)</span>
            </h4>
            <span className="text-[10px] font-mono text-slate-400">บันทึกล่าสุด {jobHistory.length} รายการ</span>
          </div>

          <div className="space-y-2">
            {jobHistory.map((job, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-blue-700 dark:text-teal-300">{job.job_id}</span>
                    <span className="text-slate-600 dark:text-slate-300 font-semibold">{job.category}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    Key: {job.idempotency_key} • {job.message}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    job.status === 'QUEUED'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {job.status}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{job.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FULLSCREEN PREVIEW MODAL */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h4 className="font-bold text-base text-slate-900 dark:text-white">
                  พรีวิวหน้าเอกสาร A6 — {selectedCategory.name}
                </h4>
                <p className="text-xs text-slate-500 font-mono">
                  {selectedCategory.form_type} • หน้า {currentPage} จาก {selectedCategory.pdf_pages || 1}
                </p>
              </div>
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Preview */}
            <div className="flex-1 overflow-auto flex justify-center py-4 bg-slate-100 dark:bg-slate-950 rounded-2xl">
              <div
                className="w-[280px] aspect-[105/148] bg-white text-slate-900 rounded-lg shadow-lg border border-slate-300 p-4 flex flex-col justify-between text-xs relative"
                style={{
                  paddingTop: `${16 + marginTopMm * 1.5}px`,
                  paddingLeft: `${16 + marginLeftMm * 1.5}px`,
                }}
              >
                {data.mode === 'OFFLINE_MOCK' && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center -rotate-30 opacity-15">
                    <span className="text-xl font-black font-mono text-slate-500 uppercase tracking-widest text-center">
                      OFFLINE MOCK<br />ZERO PII
                    </span>
                  </div>
                )}
                <div className="border-b-2 border-slate-800 pb-2">
                  <div className="text-[9px] font-mono text-blue-700">A6 PREVIEW — {selectedCategory.code}</div>
                  <h6 className="text-[11px] font-bold text-center mt-1">{selectedCategory.form_type}</h6>
                </div>
                <div className="space-y-1.5 text-[9px] text-slate-600 my-auto">
                  <div>ผู้รับ: [สมาชิกตามสิทธิ์]</div>
                  <div>งวดค้างชำระ: 2 / 4 / 5 งวด</div>
                  <div>ยอดหนี้ตามสัญญา: [Zero-PII Encrypted]</div>
                  <div className="p-2 bg-blue-50 rounded border border-blue-200 text-blue-900 font-mono text-[8px]">
                    ใบตอบรับ EMS ในประเทศ (ขนาด A6)
                  </div>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between text-[8px] text-slate-400 font-mono">
                  <span>Margin: T={marginTopMm}mm, L={marginLeftMm}mm</span>
                  <span>105x148mm</span>
                </div>
              </div>
            </div>

            {/* Page navigation */}
            <div className="flex items-center justify-between pt-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-xl border text-xs font-semibold disabled:opacity-40 cursor-pointer"
              >
                หน้าก่อนหน้า
              </button>
              <span className="text-xs font-mono font-bold">
                {currentPage} / {selectedCategory.pdf_pages || 1}
              </span>
              <button
                disabled={currentPage >= (selectedCategory.pdf_pages || 1)}
                onClick={() => setCurrentPage(p => Math.min(selectedCategory.pdf_pages || 1, p + 1))}
                className="px-3 py-1.5 rounded-xl border text-xs font-semibold disabled:opacity-40 cursor-pointer"
              >
                หน้าถัดไป
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
