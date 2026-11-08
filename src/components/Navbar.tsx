import React, { useState, useEffect } from 'react';
import { Server, Settings2, Menu, X } from 'lucide-react';
import { backendGateway } from '../services/backendGateway';
import { GatewayConfig } from '../types';

interface NavbarProps {
  onOpenGatewayModal: () => void;
  onOpenLogsDrawer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenGatewayModal, onOpenLogsDrawer }) => {
  const [config, setConfig] = useState<GatewayConfig>(backendGateway.getConfig());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    return backendGateway.onConfigChange((newConfig) => {
      setConfig(newConfig);
    });
  }, []);

  const getStatusColor = () => {
    switch (config.status) {
      case 'connected':
        return 'text-emerald-400 bg-emerald-950/80 border-emerald-500/30';
      case 'simulated':
        return 'text-cyan-400 bg-cyan-950/80 border-cyan-500/30';
      case 'testing':
        return 'text-amber-400 bg-amber-950/80 border-amber-500/30';
      default:
        return 'text-rose-400 bg-rose-950/80 border-rose-500/30';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#080c14]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a href="#" className="flex items-center gap-2.5 whitespace-nowrap shrink-0 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-300 flex items-center justify-center text-slate-950 font-black text-lg shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            N
          </div>
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
            NexusLedger
          </span>
        </a>

        {/* Zone 2: 4-5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#hero" className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0">
            หน้าแรก
          </a>
          <a href="#bento" className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0">
            ระบบงาน 01-04
          </a>
          <a href="#pricing" className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0">
            ตารางราคา
          </a>
          <a href="#contact" className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0">
            ติดต่อเรา
          </a>
          <button
            onClick={onOpenLogsDrawer}
            className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer text-slate-400"
          >
            ประวัติการส่ง Payload
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenGatewayModal}
            className={`hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium border cursor-pointer transition-all duration-200 ${getStatusColor()}`}
            title="ตั้งค่าเซิร์ฟเวอร์หลังบ้านของผู้ใช้ (User Backend Gateway)"
          >
            <Server className="w-3.5 h-3.5" />
            <span className="font-mono">
              {config.isSimulationMode
                ? 'Simulator Mode'
                : config.status === 'connected'
                ? 'Connected'
                : 'Custom Backend'}
            </span>
            <span className="text-[11px] opacity-75 font-mono">({config.latencyMs}ms)</span>
            <Settings2 className="w-3.5 h-3.5 ml-0.5 opacity-60" />
          </button>

          <button
            onClick={onOpenGatewayModal}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 rounded-xl hover:from-cyan-300 hover:to-teal-200 transition-all shadow-[0_4px_14px_rgba(6,182,212,0.3)] whitespace-nowrap shrink-0 cursor-pointer"
          >
            ตั้งค่า Gateway
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-3 pb-6 border-b border-slate-800 bg-[#080c14]/98 space-y-3 text-sm">
          <a
            href="#hero"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-200 hover:text-cyan-400 font-medium"
          >
            หน้าแรก
          </a>
          <a
            href="#bento"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-200 hover:text-cyan-400 font-medium"
          >
            ระบบงาน 01-04 (Bento Grid)
          </a>
          <a
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-200 hover:text-cyan-400 font-medium"
          >
            ตารางราคา
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-200 hover:text-cyan-400 font-medium"
          >
            ติดต่อเรา
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenLogsDrawer();
            }}
            className="w-full text-left py-2 text-slate-400 hover:text-cyan-400 font-medium"
          >
            ประวัติการส่ง Payload
          </button>
          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenGatewayModal();
              }}
              className="w-full py-2.5 px-4 bg-slate-900 border border-slate-700 rounded-xl text-center text-cyan-400 font-medium flex items-center justify-center gap-2"
            >
              <Settings2 className="w-4 h-4" />
              จัดการเชื่อมต่อเซิร์ฟเวอร์หลังบ้าน
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
