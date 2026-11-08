import React, { useState, useEffect } from 'react';
import { Terminal, X, ChevronUp, ChevronDown, Copy, Check, Trash2, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { backendGateway } from '../services/backendGateway';
import { PayloadLog } from '../types';

interface PayloadInspectorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export const PayloadInspectorDrawer: React.FC<PayloadInspectorDrawerProps> = ({
  isOpen,
  onClose,
  onOpen,
}) => {
  const [logs, setLogs] = useState<PayloadLog[]>(backendGateway.getLogs());
  const [selectedLog, setSelectedLog] = useState<PayloadLog | null>(logs[0] || null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    return backendGateway.onLog((newLogs) => {
      setLogs(newLogs);
      if (newLogs.length > 0 && !selectedLog) {
        setSelectedLog(newLogs[0]);
      } else if (newLogs.length > 0 && selectedLog) {
        // Keep selected if exists or update to newest
        const found = newLogs.find((l) => l.id === selectedLog.id);
        if (found) setSelectedLog(found);
      }
    });
  }, [selectedLog]);

  const handleCopyJson = () => {
    if (!selectedLog) return;
    navigator.clipboard.writeText(JSON.stringify(selectedLog, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    backendGateway.clearLogs();
    setSelectedLog(null);
  };

  // If closed, render compact floating badge pill at bottom-right
  if (!isOpen) {
    return (
      <button
        onClick={onOpen}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-slate-900/95 border border-cyan-500/40 text-cyan-400 hover:text-cyan-300 text-xs font-mono shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-md cursor-pointer hover:border-cyan-400 transition-all group"
        title="เปิดดูประวัติการส่ง Payload สู่หลังบ้าน"
      >
        <Terminal className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform" />
        <span className="font-semibold text-white">Live Gateway Payloads</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
        <span className="px-1.5 py-0.5 rounded-md bg-cyan-950 border border-cyan-500/30 text-[10px] text-cyan-300">
          {logs.length}
        </span>
      </button>
    );
  }

  return (
    <aside aria-label="Live Gateway Payload Inspector" className="fixed bottom-0 right-0 z-50 w-full sm:w-[620px] max-h-[85vh] bg-[#080d1a] border-t sm:border-l border-slate-700/80 rounded-t-3xl sm:rounded-tl-3xl shadow-[0_-15px_50px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden animate-slide-up">
      {/* Drawer Header */}
      <div className="px-5 py-3.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-bold text-white tracking-wide">
            User Backend Gateway Inspector
          </span>
          <span className="text-xs font-mono text-slate-400">({logs.length} payloads)</span>
        </div>

        <div className="flex items-center gap-2">
          {logs.length > 0 && (
            <button
              onClick={handleClear}
              className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
              title="ล้างประวัติทั้งหมด"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
            title="ย่อลง"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Drawer Body: Log List + Inspector */}
      <div className="flex-1 overflow-hidden grid grid-cols-1 sm:grid-cols-12 min-h-[320px] max-h-[480px]">
        {/* Left Column: Log item list */}
        <div className="sm:col-span-5 border-r border-slate-800/80 overflow-y-auto divide-y divide-slate-850 p-1">
          {logs.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">
              ยังไม่มีการส่ง Payload
              <br />
              (กดปุ่มใดๆ ในหน้าเว็บเพื่อทดสอบการส่งข้อมูล)
            </div>
          ) : (
            logs.map((log) => {
              const isSelected = selectedLog?.id === log.id;
              const isSuccess = log.status >= 200 && log.status < 300;
              return (
                <button
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer font-mono text-xs ${
                    isSelected
                      ? 'bg-slate-900/90 border border-cyan-500/40 text-cyan-300'
                      : 'hover:bg-slate-900/40 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span
                      className={`px-1.5 py-0.2 rounded font-bold ${
                        isSuccess ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                      }`}
                    >
                      {log.status} {log.method}
                    </span>
                    <span className="text-slate-500">{log.timestamp}</span>
                  </div>
                  <div className="font-semibold truncate text-white">{log.action}</div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                    <span className="truncate max-w-[130px]">{log.endpoint}</span>
                    <span className="text-cyan-400 tabular-nums">{log.latencyMs}ms</span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Right Column: Detailed JSON Inspector */}
        <div className="sm:col-span-7 p-4 overflow-y-auto bg-slate-950/60 font-mono text-xs space-y-4">
          {selectedLog ? (
            <>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-[11px] text-slate-400">PAYLOAD INSPECTION DETAIL</span>
                <button
                  onClick={handleCopyJson}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-cyan-300 cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอก JSON'}</span>
                </button>
              </div>

              {/* Endpoint & Header Badges */}
              <div className="space-y-1 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Target Endpoint:</span>
                  <span className="text-cyan-300 break-all">{selectedLog.endpoint}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Action Type:</span>
                  <span className="text-emerald-400 font-bold">{selectedLog.action}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Latency:</span>
                  <span className="text-slate-200">{selectedLog.latencyMs}ms</span>
                  {selectedLog.isSimulated && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/20">
                      Simulated
                    </span>
                  )}
                </div>
              </div>

              {/* Outbound JSON */}
              <div>
                <div className="flex items-center gap-1.5 text-cyan-400 text-[11px] font-semibold mb-1">
                  <ArrowUpRight className="w-3.5 h-3.5" /> Outbound Request Body (JSON)
                </div>
                <pre className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-200 overflow-x-auto leading-relaxed">
                  {JSON.stringify(selectedLog.payload, null, 2)}
                </pre>
              </div>

              {/* Response JSON */}
              <div>
                <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-semibold mb-1">
                  <ArrowDownLeft className="w-3.5 h-3.5" /> Inbound Response Body (HTTP {selectedLog.status})
                </div>
                <pre className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-200 overflow-x-auto leading-relaxed">
                  {JSON.stringify(selectedLog.response, null, 2)}
                </pre>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-xs">
              เลือกคำสั่งทางซ้ายเพื่อตรวจสอบรายละเอียด JSON
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
