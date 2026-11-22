import React, { useState } from 'react';
import {
  Mail,
  FileCheck2,
  Printer,
  ClipboardCheck,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { GlassBox } from './ui/glass-box';
import { LiquidButton } from './ui/liquid-glass-button';
import { backendGateway } from '../services/backendGateway';

interface JobCardSpec {
  id: 'WORK1' | 'WORK2' | 'WORK4' | 'WORK6';
  title: string;
  subtitle: string;
  action: string;
  payload: Record<string, unknown>;
  icon: React.ReactNode;
}

const APPSHEET_URL =
  'https://www.appsheet.com/newshortcut/545c8e25-4d3b-44e4-8267-cf06caca4f15';

const LIVE_JOB_CARDS: JobCardSpec[] = [
  {
    id: 'WORK1',
    title: 'WORK 1 · ดึงเมลสาขา 9+1 ศูนย์ (รอบ 21–5)',
    subtitle: 'แยก 7 โฟลเดอร์ + ทะเบียน Excel + จับคู่ S_Data_Loan',
    action: 'WORK1_GMAIL_PULL',
    payload: {
      workstream: 'WORK1',
      month: '2026-11',
      window: '21-5',
      script: 'AI_OUTPUT\\work1_gmail_pull.py',
      zeroPii: true,
    },
    icon: <Mail className="w-5 h-5 text-blue-600 dark:text-teal-400" />,
  },
  {
    id: 'WORK2',
    title: 'WORK 2 · ส่งพ้น & ชำระล่าสุด',
    subtitle: 'เทียบ S_Data_Loan + ตรวจค้าง 15 รายการ (#ส่งงานให้นธี)',
    action: 'WORK2_EXPEL_SYNC',
    payload: {
      workstream: 'WORK2',
      script: 'AI_OUTPUT\\update_expel_payment_dates.py',
      backlogCount: 15,
      zeroPii: true,
    },
    icon: <FileCheck2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
  },
  {
    id: 'WORK4',
    title: 'WORK 4 · ออก PDF .RPT บริษัท (9 หมวด)',
    subtitle: '02_ใบนำส่ง_A4 + 03_หนังสือแจ้ง + ตัวกรอง Mapping (Paper=0)',
    action: 'WORK4_QUEUE_PRINT_JOB',
    payload: {
      workstream: 'WORK4',
      script: 'ระบบพิมพ์จดหมาย\\CRD_WORK4_RptToPdf_Step2.ps1',
      filterScript: 'ระบบพิมพ์จดหมาย\\work4_pc_filter_mapping.py',
      paper: 0,
      zeroPii: true,
    },
    icon: <Printer className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
  },
  {
    id: 'WORK6',
    title: 'WORK 6 · เช็คลิสต์ผ่อนผัน (39 ไฟล์)',
    subtitle: 'ตรวจสอบสรุปผลเช็คลิสต์เอกสารผ่อนผันทั้งหมด 2569',
    action: 'WORK6_CHECKLIST_VERIFY',
    payload: {
      workstream: 'WORK6',
      script: 'WORK_6_CHECKLIST\\verify_outputs.py',
      zeroPii: true,
    },
    icon: <ClipboardCheck className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
  },
];

export const CrdLiveOperationsPanel: React.FC = () => {
  const [runningId, setRunningId] = useState<string | null>(null);
  const [statusMap, setStatusMap] = useState<Record<string, { ok: boolean; msg: string }>>({});

  const handleDispatch = async (job: JobCardSpec) => {
    if (runningId) return;
    setRunningId(job.id);
    try {
      const res = await backendGateway.dispatchAction(job.action, job.payload);
      setStatusMap((prev) => ({
        ...prev,
        [job.id]: {
          ok: res.success,
          msg: res.success
            ? `ส่งคำสั่ง ${job.action} สำเร็จ (${res.log.timestamp})`
            : `ส่งคำสั่งไม่สำเร็จ (${res.log.timestamp})`,
        },
      }));
    } catch (err) {
      setStatusMap((prev) => ({
        ...prev,
        [job.id]: {
          ok: false,
          msg: err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการเชื่อมต่อ',
        },
      }));
    } finally {
      setRunningId(null);
    }
  };

  return (
    <GlassBox variant="frosted" className="p-5 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-100 text-blue-900 dark:bg-teal-500/20 dark:text-teal-300">
              LIVE DISPATCH · แยก 4 สายงาน
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-300 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> Zero-PII & Paper=0
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
            ปุ่มสั่งงานด่วน CRD (ส่งเข้า Gateway แยกตามสคริปต์จริงบน PC)
          </h2>
        </div>

        <a
          href={APPSHEET_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 transition-colors shrink-0"
        >
          <span>เปิด AppSheet มือถือ</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {LIVE_JOB_CARDS.map((job) => {
          const isRunning = runningId === job.id;
          const st = statusMap[job.id];
          return (
            <div
              key={job.id}
              className="rounded-2xl border border-slate-200/80 dark:border-slate-700/70 bg-white/75 dark:bg-slate-900/60 p-4 flex flex-col justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
                  {job.icon}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{job.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{job.subtitle}</p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <LiquidButton
                  size="sm"
                  disabled={Boolean(runningId)}
                  onClick={() => handleDispatch(job)}
                >
                  {isRunning ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : null}
                  <span>{isRunning ? 'กำลังส่งคำสั่ง...' : `สั่งรัน ${job.id}`}</span>
                </LiquidButton>

                {st ? (
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium ${
                      st.ok
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {st.ok ? (
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    )}
                    <span className="truncate max-w-[190px]">{st.msg}</span>
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </GlassBox>
  );
};
