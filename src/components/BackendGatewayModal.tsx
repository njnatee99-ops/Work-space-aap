import React, { useState, useEffect } from 'react';
import { X, Server, Key, Globe, Check, AlertCircle, RefreshCw, Eye, EyeOff, ShieldCheck, HelpCircle } from 'lucide-react';
import { backendGateway } from '../services/backendGateway';
import { GatewayConfig } from '../types';

interface BackendGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogsDrawer: () => void;
}

export const BackendGatewayModal: React.FC<BackendGatewayModalProps> = ({
  isOpen,
  onClose,
  onOpenLogsDrawer,
}) => {
  const [config, setConfig] = useState<GatewayConfig>(backendGateway.getConfig());
  const [showApiKey, setShowApiKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    latencyMs: number;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setConfig(backendGateway.getConfig());
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    backendGateway.updateConfig(config);
    onClose();
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      // Temporarily update config so test uses current values
      backendGateway.updateConfig(config);
      const res = await backendGateway.testConnection();
      setTestResult({
        success: res.success,
        message: res.message,
        latencyMs: res.latencyMs,
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handlePresetSimulator = () => {
    setConfig({
      baseUrl: 'https://api.nexusledger.io/v1',
      webhookEndpoint: '/webhooks/contract-dispatch',
      apiKey: 'nk_live_920f83ba7c1e4d',
      isSimulationMode: true,
      status: 'simulated',
      latencyMs: 14,
    });
    setTestResult(null);
  };

  const handlePresetLocalhost = () => {
    setConfig({
      baseUrl: 'http://localhost:8080/v1',
      webhookEndpoint: '/events/ledger-webhook',
      apiKey: 'dev_local_secret_key_88',
      isSimulationMode: false,
      status: 'offline',
      latencyMs: 4,
    });
    setTestResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0b1120] border border-cyan-500/30 shadow-2xl overflow-hidden p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">ตั้งค่า User Backend Gateway</h3>
              <p className="text-xs text-slate-400">กำหนดเซิร์ฟเวอร์หลังบ้านเพื่อรับคำสั่งและ Webhook โดยตรง</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <div className="py-6 space-y-5">
          {/* Simulation Toggle Banner */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="text-sm font-semibold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>โหมดจำลองสถานการณ์ (Built-in Interactive Simulator)</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                เมื่อเปิดใช้งาน ระบบจะตอบรับคำสั่งและจำลองการ Ingest พร้อม Payload ล็อกทันทีโดยไม่ต้องต่อเซิร์ฟเวอร์จริง (แนะนำสำหรับทดสอบความเร็วและการทำงาน)
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={config.isSimulationMode}
                onChange={(e) => setConfig({ ...config, isSimulationMode: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
            </label>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">พรีเซ็ตตัวอย่าง:</span>
            <button
              onClick={handlePresetSimulator}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Nexus Cloud Simulator
            </button>
            <button
              onClick={handlePresetLocalhost}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Localhost Node (Port 8080)
            </button>
          </div>

          {/* Base URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>Base URL ของเซิร์ฟเวอร์คุณ (Host Endpoint)</span>
            </label>
            <input
              type="text"
              value={config.baseUrl}
              onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
              placeholder="https://api.yourcompany.com/v1"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white font-mono focus:outline-none focus:border-cyan-400 transition-colors"
            />
            <p className="mt-1 text-[11px] text-slate-500">
              ทุกคำสั่งจากปุ่มในหน้าเว็บจะถูกส่งไปยัง Base URL นี้ (เช่น https://backend.mycorp.internal)
            </p>
          </div>

          {/* Webhook Endpoint Path */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-cyan-400" />
              <span>Webhook Dispatch Path</span>
            </label>
            <input
              type="text"
              value={config.webhookEndpoint}
              onChange={(e) => setConfig({ ...config, webhookEndpoint: e.target.value })}
              placeholder="/webhooks/contract-dispatch"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white font-mono focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          {/* API Key */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-cyan-400" />
              <span>API Key / Secret Token (Authorization Header)</span>
            </label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={config.apiKey}
                onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                placeholder="nk_live_xxxxxxxxxxxxxxxx"
                className="w-full px-4 py-2.5 pr-10 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white font-mono focus:outline-none focus:border-cyan-400 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              บันทึกอย่างปลอดภัยในบราวเซอร์ (localStorage) และจะแนบในส่วนหัว <span className="font-mono text-cyan-400">Authorization: Bearer [key]</span>
            </p>
          </div>

          {/* Test Ping Feedback */}
          {testResult && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                testResult.success
                  ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/80 border-rose-500/40 text-rose-300'
              }`}
            >
              {testResult.success ? (
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <div className="flex-1">
                <span className="font-semibold">{testResult.message}</span>
                <span className="ml-2 font-mono">({testResult.latencyMs}ms)</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleTestConnection}
              disabled={isTesting}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 cursor-pointer transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin text-cyan-400' : ''}`} />
              {isTesting ? 'กำลังทดสอบ...' : 'ทดสอบ Ping'}
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenLogsDrawer();
              }}
              className="text-xs text-cyan-400 hover:text-cyan-300 underline font-medium cursor-pointer"
            >
              เปิดดู Payload Drawer
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
            >
              ยกเลิก
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-300 hover:to-teal-200 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20 cursor-pointer transition-all"
            >
              บันทึกและใช้งาน Gateway
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
