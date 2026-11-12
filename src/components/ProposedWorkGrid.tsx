import React, { useState } from 'react';
import { ExternalLink, ShieldAlert, CheckCircle2, Lock, FileSpreadsheet, Layers, HelpCircle } from 'lucide-react';
import { WORKSPACE_FOLDER_ID } from '../services/backendGateway';
import { LiquidButton } from './ui/liquid-glass-button';

interface ProposedWorkGridProps {
  onSelectWork?: (workId: string) => void;
}

export const ProposedWorkGrid: React.FC<ProposedWorkGridProps> = ({ onSelectWork }) => {
  const [activeNotice, setActiveNotice] = useState<string | null>(null);

  const workItems = [
    { id: 'WORK 1', title: 'แยก พม. / พม.+สัญญาอื่น', status: 'ACTIVE_SCOPE', desc: 'ตรวจรอบมติ แยกสมาชิกที่มี พม. 1 สัญญา ออกจากสมาชิกหลายสัญญา' },
    { id: 'WORK 2', title: 'ระบบสัญญาร่วม & ผู้ค้ำประกัน', status: 'PROPOSED', desc: 'ตรวจสอบการค้ำประกันไขว้และข้อจำกัดสัญญาเดี่ยว/ร่วม' },
    { id: 'WORK 3', title: 'บันทึกวันชำระและคำนวณเบี้ยปรับ', status: 'PROPOSED', desc: 'ควบคุมตามกฎ V003 ไม่คิดยอดหนี้ใหม่ คงศูนย์นำหน้า' },
    { id: 'WORK 4', title: 'เตรียมพิมพ์จดหมาย 9 หมวด & EMS', status: 'ACTIVE_SCOPE', desc: 'ตรวจรายชื่อ 9 หมวด แยกผู้กู้/กู้ร่วม/ผู้ค้ำ × 2/4/5 งวด (A6 Direct RPT)' },
    { id: 'WORK 5', title: 'ระบบรับชำระผ่าน Gateway สาขา', status: 'PROPOSED', desc: 'เชื่อมต่อ Staging สรุปยอดรายวันปลอด PII' },
    { id: 'WORK 6', title: 'ออกรายงานสรุปยอดลูกหนี้คงเหลือ', status: 'PROPOSED', desc: 'แยกหมวดลูกหนี้ตามอายุหนี้และรอบมติ' },
    { id: 'WORK 7', title: 'ตรวจสอบเงื่อนไขลดหย่อนดอกเบี้ย', status: 'PROPOSED', desc: 'คำนวณสิทธิประโยชน์ตามระเบียบ CRD' },
    { id: 'WORK 8', title: 'ระบบแจ้งเตือนก่อนหมดอายุความ', status: 'PROPOSED', desc: 'สแกนสัญญาที่เข้าเกณฑ์ติดตามเร่งด่วน' },
    { id: 'WORK 9', title: 'ส่งออกรายงานภาษีและข้อมูลบัญชี', status: 'PROPOSED', desc: 'แปลงข้อมูลเข้ารูปแบบมาตรฐานสากล' },
  ];

  const externalLinks = [
    {
      id: 'UI-03',
      name: 'Google Drive Workspace',
      url: `https://drive.google.com/drive/folders/${WORKSPACE_FOLDER_ID}`,
      desc: 'โฟลเดอร์ AI_Project_Workspace (Read-only status)',
    },
    {
      id: 'UI-05',
      name: 'Confluence Master Index',
      url: 'https://njnatee99.atlassian.net/wiki/pages/524291',
      desc: 'MASTER INDEX เอกสาร CRD สถาปัตยกรรม',
    },
    {
      id: 'UI-06',
      name: 'Jira SCRUM-1 / SCRUM-2',
      url: 'https://njnatee99.atlassian.net',
      desc: 'ระบบติดตามงาน CRD Backlog',
    },
  ];

  const handleActionClick = (id: string, title: string, isProposed: boolean) => {
    if (id === 'WORK 4' && onSelectWork) {
      onSelectWork('work4');
      return;
    }
    if (isProposed) {
      setActiveNotice(`สถานะ: [PROPOSED / ยังไม่เชื่อมต่อ Production] - โมดูล "${title}" อยู่ระหว่างจัดเตรียม Source Code และรออนุมัติ Deployment ตามระเบียบ CRD`);
      setTimeout(() => setActiveNotice(null), 5000);
    }
  };

  return (
    <section className="card-glass rounded-3xl p-6 sm:p-8 space-y-6 border border-blue-200/90 shadow-[0_16px_40px_-16px_rgba(20,50,90,0.1)]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-100 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-[#14243A] dark:text-white flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-indigo-600 dark:text-teal-400" />
            <span>โครงสร้างงาน CRD &amp; ผังงาน WORK 1–9</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
            แสดงสถานะโมดูลขอบเขตงานจริง และโมดูลที่ออกแบบไว้ล่วงหน้า (Proposed Guardrails)
          </p>
        </div>
        <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-blue-100 dark:bg-blue-500/15 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30">
          Section 05 Compliance
        </span>
      </div>

      {activeNotice && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-500/40 rounded-2xl text-xs sm:text-sm text-amber-900 dark:text-amber-300 flex items-start gap-2.5 shadow-2xs font-sans">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <span>{activeNotice}</span>
        </div>
      )}

      {/* Grid WORK 1-9 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
        {workItems.map((item) => {
          const isActive = item.status === 'ACTIVE_SCOPE';
          return (
            <div
              key={item.id}
              onClick={() => handleActionClick(item.id, item.title, !isActive)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                isActive
                  ? 'bg-blue-50/90 dark:bg-teal-950/40 border-blue-300 dark:border-teal-500/40 shadow-xs hover:border-blue-500'
                  : 'bg-white/90 dark:bg-slate-950/80 border-blue-100 dark:border-slate-800 hover:border-blue-300 opacity-95 shadow-2xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="text-xs font-bold font-mono text-blue-700 dark:text-teal-300">{item.id}</span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                      isActive
                        ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {isActive ? '● มีผลในแอป' : 'PROPOSED'}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#14243A] dark:text-white leading-snug">{item.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
              </div>

              <div className="pt-2 border-t border-blue-50 dark:border-slate-800/80 text-[11px] font-medium text-slate-500">
                {isActive ? 'พร้อมทดสอบในระบบ' : 'แตะเพื่อดูสถานะ'}
              </div>
            </div>
          );
        })}
      </div>

      {/* External CRD Verification Links */}
      <div className="pt-4 border-t border-blue-100 dark:border-slate-800">
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3">
          ลิงก์เชื่อมโยงเอกสารสถาปัตยกรรม CRD ภายนอก:
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {externalLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-2xl bg-white/90 dark:bg-slate-900 border border-blue-200/80 dark:border-slate-800 hover:border-blue-400 text-slate-800 dark:text-slate-200 flex items-center justify-between gap-2 shadow-2xs group transition-all"
            >
              <div>
                <div className="font-bold text-blue-700 dark:text-teal-300 group-hover:underline flex items-center gap-1">
                  <span>{link.name}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{link.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
