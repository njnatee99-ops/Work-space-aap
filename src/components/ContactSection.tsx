import React, { useState } from 'react';
import { Mail, Building, User, FileText, Send, CheckCircle2, Copy, Check, Ticket, AlertCircle } from 'lucide-react';
import { HighImpactPrimaryButton } from './HighImpactPrimaryButton';
import { backendGateway } from '../services/backendGateway';

interface ContactSectionProps {
  onOpenLogsDrawer: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenLogsDrawer }) => {
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    email: '',
    contractVolume: '10,000 - 100,000 สัญญา/เดือน',
    message: '',
  });

  const [touched, setTouched] = useState({
    name: false,
    organization: false,
    email: false,
    message: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [issuedTicket, setIssuedTicket] = useState<{
    id: string;
    timestamp: string;
    email: string;
    org: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  // Real-time field validation logic
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const errors = {
    name: formData.name.trim().length < 2 ? 'กรุณาระบุชื่อ-นามสกุลให้ถูกต้อง (อย่างน้อย 2 ตัวอักษร)' : '',
    organization: formData.organization.trim().length < 2 ? 'กรุณาระบุชื่อองค์กรหรือบริษัท' : '',
    email: !emailRegex.test(formData.email.trim()) ? 'กรุณาระบุอีเมลที่ถูกต้อง (เช่น yourname@company.com)' : '',
    message: formData.message.trim().length < 8 ? 'กรุณากรอกรายละเอียดข้อความอย่างน้อย 8 ตัวอักษร' : '',
  };

  const isFormValid = !errors.name && !errors.organization && !errors.email && !errors.message;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, organization: true, email: true, message: true });

    if (!isFormValid) return;

    setIsSubmitting(true);

    // Algorithmic Ticket ID Generation
    const randomHex = Math.floor(1000 + Math.random() * 9000).toString(16).toUpperCase();
    const ticketId = `TKT-2026-${randomHex}`;
    const timestamp = new Date().toLocaleString('th-TH');

    try {
      await backendGateway.dispatchAction('contact.ticket_submission', {
        ticketId,
        name: formData.name,
        organization: formData.organization,
        email: formData.email,
        contractVolume: formData.contractVolume,
        message: formData.message,
        timestamp: new Date().toISOString(),
      });

      setIssuedTicket({
        id: ticketId,
        timestamp,
        email: formData.email,
        org: formData.organization,
      });

      onOpenLogsDrawer();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyTicket = () => {
    if (!issuedTicket) return;
    navigator.clipboard.writeText(issuedTicket.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleResetForm = () => {
    setIssuedTicket(null);
    setFormData({
      name: '',
      organization: '',
      email: '',
      contractVolume: '10,000 - 100,000 สัญญา/เดือน',
      message: '',
    });
    setTouched({
      name: false,
      organization: false,
      email: false,
      message: false,
    });
  };

  return (
    <section id="contact" className="py-24 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs font-mono text-cyan-400">
            <Ticket className="w-3.5 h-3.5" />
            <span>Real-time Ingestion &amp; Support Ticket</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight" style={{ textWrap: 'balance' }}>
            ติดต่อทีมงานวิศวกรรมสถาปัตยกรรมสัญญา
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            กรอกข้อมูลเพื่อรับคำปรึกษาทางเทคนิค ระบบจะออกหมายเลข Ticket ID ทันที และส่งสัญญาณ Payload สู่เซิร์ฟเวอร์หลังบ้าน
          </p>
        </div>

        {/* Form Container */}
        <div className="rounded-3xl p-6 sm:p-10 bg-[#0b1120] border border-slate-800 shadow-2xl relative overflow-hidden">
          {issuedTicket ? (
            /* Ticket Confirmation View */
            <div className="py-8 text-center space-y-6 max-w-xl mx-auto animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-cyan-950/80 border border-cyan-400/40 flex items-center justify-center text-cyan-300 mx-auto shadow-[0_0_30px_rgba(6,182,212,0.4)]">
                <CheckCircle2 className="w-8 h-8 text-cyan-400" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white mb-2">ออกหมายเลขคำร้อง (Ticket ID) สำเร็จ</h3>
                <p className="text-sm text-slate-300">
                  ระบบได้บันทึกคำร้องและยิง Webhook Payload สู่เซิร์ฟเวอร์หลังบ้านเรียบร้อยแล้ว
                </p>
              </div>

              {/* Ticket Card Badge */}
              <div className="p-6 rounded-2xl bg-slate-950 border border-cyan-500/40 font-mono text-left space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs text-slate-500">TICKET IDENTIFIER</span>
                  <button
                    onClick={handleCopyTicket}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-cyan-300 cursor-pointer transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอกรหัส'}</span>
                  </button>
                </div>

                <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 tracking-wider">
                  {issuedTicket.id}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 pt-2 border-t border-slate-900">
                  <div>
                    <span className="text-slate-600 block">องค์กร:</span>
                    <span className="text-slate-200">{issuedTicket.org}</span>
                  </div>
                  <div>
                    <span className="text-slate-600 block">อีเมลตอบกลับ:</span>
                    <span className="text-slate-200 truncate block">{issuedTicket.email}</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500">
                  เวลาที่บันทึกคำร้อง: {issuedTicket.timestamp}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <button
                  onClick={onOpenLogsDrawer}
                  className="px-6 py-3 rounded-2xl bg-slate-900 border border-slate-700 hover:border-cyan-500/40 text-sm font-semibold text-cyan-300 transition-colors"
                >
                  ตรวจสอบ Payload ใน Drawer
                </button>
                <button
                  onClick={handleResetForm}
                  className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-sm font-semibold text-white transition-colors"
                >
                  ส่งข้อความใหม่
                </button>
              </div>
            </div>
          ) : (
            /* Active Contact Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Name Field */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    <span>ชื่อ-นามสกุลผู้ติดต่อ <span className="text-rose-400">*</span></span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    onBlur={() => setTouched({ ...touched, name: true })}
                    placeholder="เช่น ศรันย์ วงศ์พานิช"
                    className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-sm text-white placeholder-slate-600 focus:outline-none transition-colors ${
                      touched.name && errors.name
                        ? 'border-rose-500/80 focus:border-rose-400'
                        : 'border-slate-800 focus:border-cyan-400'
                    }`}
                  />
                  {touched.name && errors.name && (
                    <div className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.name}</span>
                    </div>
                  )}
                </div>

                {/* Organization Field */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-cyan-400" />
                    <span>ชื่อองค์กร / บริษัท <span className="text-rose-400">*</span></span>
                  </label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    onBlur={() => setTouched({ ...touched, organization: true })}
                    placeholder="เช่น Siam Tech Governance Ltd."
                    className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-sm text-white placeholder-slate-600 focus:outline-none transition-colors ${
                      touched.organization && errors.organization
                        ? 'border-rose-500/80 focus:border-rose-400'
                        : 'border-slate-800 focus:border-cyan-400'
                    }`}
                  />
                  {touched.organization && errors.organization && (
                    <div className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.organization}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Email Field */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-cyan-400" />
                    <span>อีเมลติดต่อธุรกิจ <span className="text-rose-400">*</span></span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    onBlur={() => setTouched({ ...touched, email: true })}
                    placeholder="sarun@siamtech.co.th"
                    className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-sm text-white placeholder-slate-600 focus:outline-none transition-colors ${
                      touched.email && errors.email
                        ? 'border-rose-500/80 focus:border-rose-400'
                        : 'border-slate-800 focus:border-cyan-400'
                    }`}
                  />
                  {touched.email && errors.email && (
                    <div className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.email}</span>
                    </div>
                  )}
                </div>

                {/* Contract Volume Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    <span>ปริมาณสัญญาต่อเดือนโดยประมาณ</span>
                  </label>
                  <select
                    value={formData.contractVolume}
                    onChange={(e) => setFormData({ ...formData, contractVolume: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
                  >
                    <option value="< 10,000 สัญญา/เดือน">&lt; 10,000 สัญญา/เดือน</option>
                    <option value="10,000 - 100,000 สัญญา/เดือน">10,000 - 100,000 สัญญา/เดือน (แนะนำ)</option>
                    <option value="100,000 - 1,000,000 สัญญา/เดือน">100,000 - 1,000,000 สัญญา/เดือน</option>
                    <option value="> 1,000,000 สัญญา/เดือน">&gt; 1,000,000 สัญญา/เดือน (ระดับองค์กรขนาดใหญ่)</option>
                  </select>
                </div>
              </div>

              {/* Message Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>รายละเอียดความต้องการหรือสถาปัตยกรรมที่สนใจ <span className="text-rose-400">*</span></span>
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  onBlur={() => setTouched({ ...touched, message: true })}
                  placeholder="ระบุข้อกำหนดในการเชื่อมต่อ เช่น ต้องการทดสอบ Dual-Key Ledger Ingestion กับระบบ ERP ภายใน..."
                  className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-sm text-white placeholder-slate-600 focus:outline-none transition-colors ${
                    touched.message && errors.message
                      ? 'border-rose-500/80 focus:border-rose-400'
                      : 'border-slate-800 focus:border-cyan-400'
                  }`}
                />
                {touched.message && errors.message && (
                  <div className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.message}</span>
                  </div>
                )}
              </div>

              {/* Submit CTA */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-slate-400">
                  ระบบจะออก Ticket ID ให้ทันทีเมื่อตรวจสอบข้อมูลผ่าน
                </span>
                <HighImpactPrimaryButton
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  icon={<Send className="w-4 h-4 text-slate-950" />}
                >
                  {isSubmitting ? 'กำลังออก Ticket & ส่ง Payload...' : 'ส่งข้อมูลติดต่อและออก Ticket ID'}
                </HighImpactPrimaryButton>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
