import React, { useState } from 'react';
import { Code2, Copy, Check, ExternalLink, FolderGit2 } from 'lucide-react';
import { WORKSPACE_FOLDER_ID, MANIFEST_FILE_NAME } from '../services/backendGateway';
import { LiquidButton } from './ui/liquid-glass-button';

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

export const GasCodeSection: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(GAS_BACKEND_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="card-glass rounded-3xl p-6 sm:p-8 space-y-6 border border-blue-200/90 shadow-[0_16px_40px_-16px_rgba(20,50,90,0.1)]">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-blue-100 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#14243A] dark:text-white flex items-center gap-2.5">
            <Code2 className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            <span>โค้ดหลังบ้าน Google Apps Script (Code.gs)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
            นำโค้ดนี้ไปวางใน Google Apps Script ของคุณเพื่อรองรับการรับคำสั่งเพิ่มขอบเขตงานและบันทึกลง Google Drive อัตโนมัติ
          </p>
        </div>

        <LiquidButton
          size="default"
          onClick={handleCopy}
          className="text-xs font-bold shadow-md cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-blue-600" />}
          <span>{copied ? 'คัดลอกโค้ดเรียบร้อย!' : 'คัดลอก Code.gs (1-Click)'}</span>
        </LiquidButton>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
        <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-950 border border-blue-200/80 dark:border-slate-800 flex items-center gap-2.5 text-slate-700 dark:text-slate-300 shadow-2xs">
          <FolderGit2 className="w-5 h-5 text-blue-600 dark:text-teal-400 shrink-0" />
          <span>
            โฟลเดอร์ Drive ปลายทาง: <code className="mono text-blue-800 dark:text-teal-300 font-bold">AI_Project_Workspace</code>
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-950 border border-blue-200/80 dark:border-slate-800 flex items-center gap-2.5 text-slate-700 dark:text-slate-300 shadow-2xs">
          <Code2 className="w-5 h-5 text-blue-600 dark:text-teal-400 shrink-0" />
          <span>
            ไฟล์ Manifest: <code className="mono text-blue-800 dark:text-teal-300 font-bold">00_Project_Manifest.json</code>
          </span>
        </div>
      </div>

      <pre className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono text-blue-100 overflow-x-auto max-h-[420px] leading-relaxed shadow-inner">
        {GAS_BACKEND_CODE}
      </pre>
    </section>
  );
};
