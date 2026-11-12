import React, { useState } from 'react';
import { X, Terminal, Trash2, ArrowUpRight, ArrowDownLeft, Copy, Check } from 'lucide-react';
import { backendGateway } from '../services/backendGateway';
import { PayloadLog } from '../types';

interface PayloadLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PayloadLogsModal: React.FC<PayloadLogsModalProps> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState<PayloadLog[]>(backendGateway.getLogs());
  const [selectedLog, setSelectedLog] = useState<PayloadLog | null>(logs[0] || null);
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    return backendGateway.onLog((newLogs) => {
      setLogs(newLogs);
      if (!selectedLog && newLogs.length > 0) {
        setSelectedLog(newLogs[0]);
      }
    });
  }, [selectedLog]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (!selectedLog) return;
    navigator.clipboard.writeText(JSON.stringify(selectedLog, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    backendGateway.clearLogs();
    setSelectedLog(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/35 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[85vh] rounded-3xl bg-white/92 dark:bg-slate-900/90 backdrop-blur-3xl border border-white/90 dark:border-slate-800 shadow-[0_24px_60px_-12px_rgba(20,50,110,0.22)] flex flex-col overflow-hidden text-[#14243A] dark:text-white">
        {/* Header */}
        <div className="px-6 py-4 bg-white/80 dark:bg-slate-950 border-b border-blue-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-teal-500/15 border border-blue-200 flex items-center justify-center text-blue-700 dark:text-teal-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#14243A] dark:text-white">
                ประวัติการส่งคำสั่ง (Live Gateway Payloads)
              </h3>
              <span className="text-xs font-mono text-slate-500">บันทึกทั้งหมด {logs.length} รายการ</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {logs.length > 0 && (
              <button
                onClick={handleClear}
                className="px-3 py-1.5 text-xs text-rose-600 hover:text-rose-700 rounded-xl hover:bg-rose-50 transition-colors flex items-center gap-1.5 cursor-pointer font-bold border border-rose-200"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>ล้างประวัติ</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 sm:grid-cols-12 min-h-[380px]">
          {/* Left: Log list */}
          <div className="sm:col-span-5 border-r border-blue-100 dark:border-slate-800 overflow-y-auto divide-y divide-blue-50 dark:divide-slate-800 p-2 space-y-1">
            {logs.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 font-medium">
                ยังไม่มีประวัติการส่งคำสั่ง
                <br />
                (กดส่งคำสั่งหรือบันทึกขอบเขตงานเพื่อดูผลลัพธ์)
              </div>
            ) : (
              logs.map((log) => {
                const isSelected = selectedLog?.id === log.id;
                return (
                  <button
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className={`w-full text-left p-3 rounded-2xl transition-all font-mono text-xs cursor-pointer ${
                      isSelected
                        ? 'bg-blue-100/90 dark:bg-slate-800 border border-blue-300 text-blue-900 dark:text-teal-300 shadow-2xs font-bold'
                        : 'hover:bg-blue-50/70 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="px-2 py-0.5 rounded-full font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 border border-emerald-200">
                        {log.status} {log.method}
                      </span>
                      <span className="text-slate-500 text-[10px]">{log.timestamp}</span>
                    </div>
                    <div className="font-bold text-[#14243A] dark:text-white truncate">{log.action}</div>
                    <div className="text-[10px] text-slate-500 truncate mt-0.5">{log.endpoint}</div>
                  </button>
                );
              })
            )}
          </div>

          {/* Right: Selected Log Detail */}
          <div className="sm:col-span-7 p-5 overflow-y-auto bg-blue-50/40 dark:bg-slate-950/70 font-mono text-xs space-y-4">
            {selectedLog ? (
              <>
                <div className="flex items-center justify-between pb-2 border-b border-blue-100 dark:border-slate-800">
                  <span className="text-[11px] text-slate-600 dark:text-slate-400 font-bold">PAYLOAD DETAIL</span>
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white hover:bg-blue-50 text-xs text-blue-700 border border-blue-200 shadow-2xs cursor-pointer font-bold transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอก JSON'}</span>
                  </button>
                </div>

                <div className="space-y-1 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium">Action:</span>{' '}
                    <span className="text-blue-900 dark:text-emerald-400 font-bold">{selectedLog.action}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Target:</span>{' '}
                    <span className="text-blue-700 dark:text-teal-300 break-all select-all font-semibold">{selectedLog.endpoint}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Latency:</span>{' '}
                    <span className="text-[#14243A] font-bold">{selectedLog.latencyMs}ms</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-blue-700 dark:text-teal-300 text-xs font-bold mb-1.5">
                    <ArrowUpRight className="w-4 h-4" /> Outbound Request Body (JSON)
                  </div>
                  <pre className="p-3.5 rounded-2xl bg-white/95 dark:bg-slate-900 border border-blue-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 overflow-x-auto leading-relaxed shadow-inner">
                    {JSON.stringify(selectedLog.payload, null, 2)}
                  </pre>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 text-xs font-bold mb-1.5">
                    <ArrowDownLeft className="w-4 h-4" /> Response Acknowledged (HTTP {selectedLog.status})
                  </div>
                  <pre className="p-3.5 rounded-2xl bg-white/95 dark:bg-slate-900 border border-blue-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 overflow-x-auto leading-relaxed shadow-inner">
                    {JSON.stringify(selectedLog.response, null, 2)}
                  </pre>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs font-medium">
                เลือกคำสั่งทางซ้ายเพื่อตรวจสอบรายละเอียด
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
