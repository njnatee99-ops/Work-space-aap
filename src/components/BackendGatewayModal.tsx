import React, { useState, useEffect } from 'react';
import { X, Server, Key, Globe, Check, AlertCircle, RefreshCw, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { backendGateway, DEFAULT_GAS_URL } from '../services/backendGateway';
import { GatewayConfig } from '../types';
import { LiquidButton } from './ui/liquid-glass-button';

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

  const handlePresetGAS = () => {
    setConfig({
      baseUrl: DEFAULT_GAS_URL,
      webhookEndpoint: '',
      apiKey: 'gas_auto_token_manifest_sync',
      isSimulationMode: false,
      status: 'connected',
      latencyMs: 18,
    });
    setTestResult(null);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/35 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-3xl border border-white/90 dark:border-slate-800 shadow-[0_24px_60px_-12px_rgba(20,50,110,0.22)] overflow-hidden p-6 sm:p-8 space-y-6 text-[#14243A] dark:text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-blue-100 dark:border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-blue-100 dark:bg-teal-500/15 border border-blue-200 dark:border-teal-500/30 flex items-center justify-center text-blue-600 dark:text-teal-400 shadow-inner">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#14243A] dark:text-white">ตั้งค่า Google Apps Script Gateway</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">เชื่อมต่อ Web App เพื่ออัปเดต Manifest และส่งคำสั่งสู่ Drive โดยตรง</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <div className="space-y-5">
          {/* Simulation Toggle Banner */}
          <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-slate-950/80 border border-blue-100 dark:border-slate-800 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="text-sm font-bold text-[#14243A] dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-teal-400" />
                <span>โหมดจำลองออฟไลน์ (Offline Simulator)</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                ปิดการส่ง HTTP จริงสู่ Google Apps Script และใช้ตัวจำลองสถานะภายในแทน
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={config.isSimulationMode}
                onChange={(e) => setConfig({ ...config, isSimulationMode: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">พรีเซ็ตปลายทาง:</span>
            <button
              onClick={handlePresetGAS}
              className="px-3 py-1.5 rounded-xl bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200 transition cursor-pointer font-bold shadow-2xs"
            >
              ★ Google Apps Script ของคุณ (/exec)
            </button>
            <button
              onClick={handlePresetSimulator}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-blue-100 dark:border-slate-700 hover:bg-blue-50 text-slate-600 dark:text-slate-300 transition cursor-pointer font-medium"
            >
              Internal Simulator
            </button>
          </div>

          {/* Web App URL */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-blue-600 dark:text-teal-400" />
              <span>Web App URL ปลายทาง (<code className="text-blue-700 dark:text-teal-300 font-mono text-xs">https://script.google.com/macros/s/.../exec</code>)</span>
            </label>
            <input
              type="text"
              value={config.baseUrl}
              onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-slate-950 border border-blue-200 dark:border-slate-800 text-sm font-mono text-[#14243A] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-2xs transition-all"
            />
            <p className="text-[11px] text-slate-500">
              ปลายทางบันทึกโฟลเดอร์ Drive: <code className="font-bold text-blue-800 dark:text-teal-300">AI_Project_Workspace</code> | ไฟล์: <code className="font-bold text-blue-800 dark:text-teal-300">00_Project_Manifest.json</code>
            </p>
          </div>

          {/* Secret / API Key */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Key className="w-4 h-4 text-blue-600 dark:text-teal-400" />
              <span>Session Token / Secret Key (หากมี)</span>
            </label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={config.apiKey}
                onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                placeholder="ระบุ Token เพื่อยืนยันสิทธิ์ก่อนยิงคำสั่ง"
                className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-slate-950 border border-blue-200 dark:border-slate-800 text-sm font-mono text-[#14243A] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-2xs transition-all pr-10"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Test Result Message */}
          {testResult && (
            <div
              className={`p-3.5 rounded-2xl border flex items-center gap-2 text-xs font-medium animate-fade-in ${
                testResult.success
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                  : 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
              }`}
            >
              {testResult.success ? (
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <div className="flex-1">
                <span className="font-bold">{testResult.message}</span>
                <span className="ml-2 font-mono">({testResult.latencyMs}ms)</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-blue-100 dark:border-slate-800">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <LiquidButton
              size="sm"
              onClick={handleTestConnection}
              disabled={isTesting}
              className="flex-1 sm:flex-none text-xs font-bold cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin text-blue-600' : 'text-blue-600'}`} />
              <span>{isTesting ? 'กำลังทดสอบ...' : 'ทดสอบ Ping'}</span>
            </LiquidButton>

            <button
              onClick={() => {
                onClose();
                onOpenLogsDrawer();
              }}
              className="text-xs text-blue-600 dark:text-teal-400 hover:underline font-semibold cursor-pointer px-2"
            >
              ดู Payload Drawer
            </button>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-300 text-xs font-bold border border-blue-200 dark:border-slate-700 cursor-pointer transition shadow-2xs"
            >
              ยกเลิก
            </button>

            <LiquidButton
              variant="glowing"
              glow={true}
              size="default"
              onClick={handleSave}
              className="text-xs font-bold shadow-md cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>บันทึกและเชื่อมต่อทันที</span>
            </LiquidButton>
          </div>
        </div>
      </div>
    </div>
  );
};
