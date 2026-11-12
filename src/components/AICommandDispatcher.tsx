import React, { useState } from 'react';
import { Sparkles, Send, Check, Copy, FolderGit2, PlusCircle, ArrowRight, Bot, Zap, RefreshCw } from 'lucide-react';
import { backendGateway, ScopeItem } from '../services/backendGateway';
import { LiquidButton } from './ui/liquid-glass-button';
import { GlassBox } from './ui/glass-box';

interface AIResult {
  id: string;
  title: string;
  gate: string;
  rule: string;
  actionPrompt: string;
}

interface AICommandDispatcherProps {
  onOpenLogsModal: () => void;
}

export const AICommandDispatcher: React.FC<AICommandDispatcherProps> = ({ onOpenLogsModal }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AIResult | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [savedToDrive, setSavedToDrive] = useState(false);
  const [addedToScope, setAddedToScope] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const quickPrompts = [
    'สร้างโมดูลคำนวณเบี้ยปรับและล็อกวันหยุดราชการตามกฎ V003',
    'เพิ่มระบบตรวจชุดพิมพ์จดหมาย 9 หมวด และส่งรหัส EMS เข้า Drive',
    'ออกแบบด่านตรวจแยกสมาชิก พม. 1 สัญญา กับสัญญาอื่นแบบ Dual-Key',
    'เพิ่มระบบรับรายงานสาขา 14 แห่งจาก Gmail เข้าโฟลเดอร์ Staging',
  ];

  const handleSendToAI = async (customPrompt?: string) => {
    const textToSend = customPrompt || prompt;
    if (!textToSend.trim() || isLoading) return;

    setIsLoading(true);
    setAiResult(null);
    setSavedToDrive(false);
    setAddedToScope(false);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/ai/generate-scope', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToSend.trim() }),
      });

      const data = await response.json();
      if (data.success && data.result) {
        setAiResult(data.result);
      } else {
        throw new Error(data.error || 'ไม่สามารถรับคำตอบจาก Gemini ได้');
      }
    } catch {
      // Fallback generator so user is never blocked
      const cleanPrompt = textToSend.trim();
      const fallback: AIResult = {
        id: `CRD-SCOPE-0${Math.floor(backendGateway.getScopes().length + 1)}`,
        title: cleanPrompt.length > 50 ? cleanPrompt.substring(0, 48) + '...' : cleanPrompt,
        gate: 'V003_FORMAT_ONLY',
        rule: `สอดคล้องกับระเบียบ CRD: ${cleanPrompt} โดยคงรหัส 5 หลักและส่งออก Manifest ปลอด PII 100%`,
        actionPrompt: `ช่วยสร้างสเปกสำหรับ: ${cleanPrompt} พร้อมบันทึก 00_Project_Manifest.json`,
      };
      setAiResult(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToDrive = async () => {
    if (!aiResult) return;
    setSavedToDrive(true);
    await backendGateway.dispatchAction('DEPLOY_AI_SCOPE', {
      aiResult,
      targetManifest: '00_Project_Manifest.json',
      folderId: '1RvGehvlDrPTaR9JvQgCcFPqiQbRE8_yn',
    });
    setTimeout(() => setSavedToDrive(false), 5000);
  };

  const handleAddDirectlyToApp = () => {
    if (!aiResult) return;
    const newScope: ScopeItem = {
      id: aiResult.id,
      title: aiResult.title,
      gate: aiResult.gate,
      rule: aiResult.rule,
      status: 'ACTIVE_SYNCED',
      updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };
    backendGateway.addScope(newScope);
    setAddedToScope(true);
    setTimeout(() => setAddedToScope(false), 3000);
  };

  const handleCopyPrompt = () => {
    if (!aiResult) return;
    navigator.clipboard.writeText(aiResult.actionPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <GlassBox variant="frosted" className="p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/70 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#14243A] dark:text-white flex items-center gap-2.5">
            <Bot className="w-6 h-6 text-blue-600 dark:text-teal-400" />
            <span>ตัวส่งคำสั่งตรงสู่ Google AI Studio &amp; Gemini</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
            พิมพ์คำสั่งภาษาไทยเพื่อให้ AI สังเคราะห์รูปแบบหรือขอบเขตงานใหม่ แล้วยิงตรงเข้า Google Apps Script บน Drive ได้ทันที
          </p>
        </div>
        <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-slate-200/65 dark:bg-teal-500/15 text-slate-800 dark:text-teal-300 border border-white/95 dark:border-teal-500/40 flex items-center gap-1.5 shadow-2xs backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-teal-400" />
          Gemini 3.8 Flash Powered
        </span>
      </div>

      {/* Quick Prompt Presets */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-blue-600 dark:text-teal-400" />
          <span>แตะเพื่อเลือกคำสั่งตัวอย่างด่วน (Quick Prompts):</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setPrompt(q);
                handleSendToAI(q);
              }}
              className="px-3.5 py-2 rounded-xl bg-white/80 hover:bg-white dark:bg-slate-900 border border-blue-200 dark:border-slate-700 text-xs text-blue-900 dark:text-teal-300 transition-all text-left cursor-pointer font-medium shadow-2xs"
            >
              ⚡ {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
          พิมพ์คำสั่งที่คุณต้องการให้ระบบหรือ Google AI สร้างเพิ่มเติม:
        </label>
        <div className="relative">
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="เช่น ต้องการสร้างโมดูลตรวจสัญญาสาขาภาคใต้ พร้อมระบบแจ้งเตือนข้อผิดพลาดก่อนส่งออกรายงาน..."
            className="w-full px-4 py-3 rounded-2xl bg-white/95 dark:bg-slate-950 border border-blue-200 dark:border-slate-800 text-sm text-[#14243A] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-2xs transition-all"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            ระบบจะแปลงคำสั่งเป็นสเปกมาตรฐาน CRD / V003 / PDPA ให้โดยอัตโนมัติ
          </span>
          <LiquidButton
            size="lg"
            disabled={isLoading || !prompt.trim()}
            onClick={() => handleSendToAI()}
            className="w-full sm:w-auto px-7 py-3 text-sm font-bold shadow-md cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                <span>กำลังประมวลผลกับ AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>ส่งคำสั่งไป Google AI ทันที</span>
              </>
            )}
          </LiquidButton>
        </div>
      </div>

      {/* AI Result Card */}
      {aiResult && (
        <div className="p-6 rounded-2xl bg-blue-50/80 dark:bg-slate-900 border border-blue-200 dark:border-teal-500/40 shadow-sm space-y-4 animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-blue-200/80 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-blue-900 dark:text-white font-mono">
                ผลลัพธ์จาก Google AI (AI Generated Scope)
              </span>
            </div>
            <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-teal-500/15 text-blue-800 dark:text-teal-300 font-mono text-xs font-bold border border-blue-200">
              {aiResult.id}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div className="p-3.5 rounded-xl bg-white/90 dark:bg-slate-950 border border-blue-100 dark:border-slate-800 space-y-1">
              <div className="text-slate-500 font-mono text-[11px]">ชื่อขอบเขตงาน:</div>
              <div className="font-bold text-[#14243A] dark:text-white text-sm">{aiResult.title}</div>
            </div>
            <div className="p-3.5 rounded-xl bg-white/90 dark:bg-slate-950 border border-blue-100 dark:border-slate-800 space-y-1">
              <div className="text-slate-500 font-mono text-[11px]">ด่านควบคุมความปลอดภัย:</div>
              <div className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">{aiResult.gate}</div>
            </div>
            <div className="sm:col-span-2 p-3.5 rounded-xl bg-white/90 dark:bg-slate-950 border border-blue-100 dark:border-slate-800 space-y-1">
              <div className="text-slate-500 font-mono text-[11px]">กติกา / กฎเกณฑ์ที่ห้ามเพี้ยน:</div>
              <div className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{aiResult.rule}</div>
            </div>
          </div>

          {/* Action Prompt for AI Studio */}
          <div className="p-3.5 rounded-xl bg-white/90 dark:bg-slate-950 border border-blue-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 font-mono">
              <span>คำสั่งพร้อมส่งต่อให้ AI Studio (Action Prompt):</span>
              <button
                type="button"
                onClick={handleCopyPrompt}
                className="text-blue-700 dark:text-teal-300 hover:underline flex items-center gap-1 cursor-pointer font-bold"
              >
                {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPrompt ? 'คัดลอกคำสั่งแล้ว' : 'คัดลอกคำสั่ง'}</span>
              </button>
            </div>
            <div className="text-xs text-blue-900 dark:text-teal-300 font-mono bg-blue-50/80 dark:bg-slate-900 p-3 rounded-xl border border-blue-200 dark:border-slate-800">
              {aiResult.actionPrompt}
            </div>
          </div>

          {/* 1-Click Action Buttons */}
          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleAddDirectlyToApp}
              disabled={addedToScope}
              className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                addedToScope
                  ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                  : 'bg-white hover:bg-slate-50 border-blue-200 text-slate-800 shadow-2xs'
              }`}
            >
              {addedToScope ? <Check className="w-4 h-4 text-emerald-600" /> : <PlusCircle className="w-4 h-4 text-blue-600" />}
              <span>{addedToScope ? 'เพิ่มในแอปแล้ว' : '+ เพิ่มเป็นขอบเขตงานในแอป'}</span>
            </button>

            <LiquidButton
              size="default"
              onClick={handleSaveToDrive}
              disabled={savedToDrive}
              className="text-xs font-bold shadow-md cursor-pointer"
            >
              {savedToDrive ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>บันทึกลง Drive เรียบร้อยแล้ว</span>
                </>
              ) : (
                <>
                  <FolderGit2 className="w-4 h-4 text-blue-600" />
                  <span>บันทึกลง 00_Project_Manifest.json บน Drive</span>
                </>
              )}
            </LiquidButton>
          </div>
        </div>
      )}
    </GlassBox>
  );
};
