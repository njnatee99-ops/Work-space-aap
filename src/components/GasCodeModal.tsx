import React, { useState } from 'react';
import { X, Code2, Copy, Check, ExternalLink, FolderGit2 } from 'lucide-react';
import { WORKSPACE_FOLDER_ID, MANIFEST_FILE_NAME } from '../services/backendGateway';
import { LiquidButton } from './ui/liquid-glass-button';

interface GasCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GAS_BACKEND_CODE = `// วางโค้ดนี้ใน Google Apps Script ของคุณ แล้วกด Deploy > Manage deployments > Edit (New version)
const WORKSPACE_FOLDER_ID = '${WORKSPACE_FOLDER_ID}'; // AI_Project_Workspace
const MANIFEST_FILE_NAME = '${MANIFEST_FILE_NAME}';

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'ONLINE',
    service: 'NexusLedger × AI HUB CONTROL CENTER',
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const body = e && e.postData && e.postData.contents ? JSON.parse(e.postData.contents) : {};
    const folder = DriveApp.getFolderById(WORKSPACE_FOLDER_ID);
    const files = folder.getFilesByName(MANIFEST_FILE_NAME);
    let manifest = {
      projectName: 'AI HUB CONTROL CENTER',
      lastUpdated: new Date().toISOString(),
      currentStatus: 'ระบบกำลังทำงานและขยายขอบเขตอัตโนมัติ',
      scopes: [],
      history_logs: []
    };
    let file = null;
    if (files.hasNext()) {
      file = files.next();
      try { manifest = JSON.parse(file.getBlob().getDataAsString()); } catch (err) {}
    }
    manifest.scopes = manifest.scopes || [];
    manifest.history_logs = manifest.history_logs || [];
    if (body.scope) {
      manifest.scopes.unshift(body.scope);
      manifest.history_logs.unshift('เพิ่มขอบเขตงาน: ' + body.scope.id + ' - ' + body.scope.title);
    } else {
      manifest.history_logs.unshift('Ping / Command: ' + (body.action || 'TEST_PING'));
    }
    manifest.lastUpdated = new Date().toISOString();
    if (file) {
      file.setContent(JSON.stringify(manifest, null, 2));
    } else {
      folder.createFile(MANIFEST_FILE_NAME, JSON.stringify(manifest, null, 2), MimeType.PLAIN_TEXT);
    }
    return ContentService.createTextOutput(JSON.stringify({ status: 'PASS', manifestUpdated: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}`;

export const GasCodeModal: React.FC<GasCodeModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(GAS_BACKEND_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/35 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white/92 dark:bg-slate-900/90 backdrop-blur-3xl border border-white/90 dark:border-slate-800 shadow-[0_24px_60px_-12px_rgba(20,50,110,0.22)] p-6 sm:p-8 overflow-hidden space-y-5 text-[#14243A] dark:text-white">
        <div className="flex items-center justify-between pb-4 border-b border-blue-100 dark:border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-100 dark:bg-amber-500/15 border border-amber-200 flex items-center justify-center text-amber-700 dark:text-amber-300 shadow-inner">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#14243A] dark:text-white">โค้ดหลังบ้าน Google Apps Script (Code.gs)</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">ซิงก์ตรงกับ AI_Project_Workspace (ID: 1RvGehvlDrPTaR9JvQgCcFPqiQbRE8_yn)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center gap-2.5 text-slate-700">
            <FolderGit2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              โฟลเดอร์ Drive: <code className="font-bold text-blue-900">AI_Project_Workspace</code>
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center gap-2.5 text-slate-700">
            <Code2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              ไฟล์ Manifest: <code className="font-bold text-blue-900">00_Project_Manifest.json</code>
            </span>
          </div>
        </div>

        <pre className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono text-blue-100 overflow-x-auto max-h-[380px] leading-relaxed shadow-inner">
          {GAS_BACKEND_CODE}
        </pre>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-blue-100 dark:border-slate-800">
          <span className="text-xs text-slate-500">
            Deploy เป็น Web App โดยตั้งค่า "Execute as: Me" และ "Who has access: Anyone"
          </span>
          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-blue-200 cursor-pointer transition shadow-2xs"
            >
              ปิดหน้าต่าง
            </button>
            <LiquidButton
              variant="glowing"
              glow={true}
              size="default"
              onClick={handleCopy}
              className="text-xs font-bold shadow-md cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'คัดลอกโค้ดเรียบร้อย!' : 'คัดลอก Code.gs (1-Click)'}</span>
            </LiquidButton>
          </div>
        </div>
      </div>
    </div>
  );
};
