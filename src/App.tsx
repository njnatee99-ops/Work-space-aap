/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GoogleAITopbar } from './components/GoogleAITopbar';
import { ConnectionStatusBanner } from './components/ConnectionStatusBanner';
import { CleanHubDashboard } from './components/CleanHubDashboard';
import { SelfEvolvingDesignStudio } from './components/SelfEvolvingDesignStudio';
import { ScopeBuilderClean } from './components/ScopeBuilderClean';
import { StopGatesAuditClean } from './components/StopGatesAuditClean';
import { ProposedWorkGrid } from './components/ProposedWorkGrid';
import { GasCodeSection } from './components/GasCodeSection';
import { BackendGatewayModal } from './components/BackendGatewayModal';
import { GasCodeModal } from './components/GasCodeModal';
import { PayloadLogsModal } from './components/PayloadLogsModal';
import { ExportCodeModal } from './components/ExportCodeModal';
import { AICommandDispatcher } from './components/AICommandDispatcher';
import { LiquidNavbar, NimbusIcons, LiquidNavItem } from './components/ui/liquid-glass-navbar';
import { backendGateway } from './services/backendGateway';
import { GatewayConfig } from './types';
import { Terminal, ArrowLeft } from 'lucide-react';

export type ActiveTabType = 'overview' | 'scope-builder' | 'ai-studio' | 'stop-gates' | 'gascode' | 'proposed-work';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTabType>('overview');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [config, setConfig] = useState<GatewayConfig>(backendGateway.getConfig());
  const [isGatewayModalOpen, setIsGatewayModalOpen] = useState(false);
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);
  const [isGasCodeModalOpen, setIsGasCodeModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [logCount, setLogCount] = useState(backendGateway.getLogs().length);
  const [scopesCount, setScopesCount] = useState(backendGateway.getScopes().length);

  useEffect(() => {
    const unsubConfig = backendGateway.onConfigChange((newConfig) => {
      setConfig(newConfig);
    });
    const unsubLogs = backendGateway.onLog((logs) => {
      setLogCount(logs.length);
    });
    const unsubScopes = backendGateway.onScopeChange((scopes) => {
      setScopesCount(scopes.length);
    });
    return () => {
      unsubConfig();
      unsubLogs();
      unsubScopes();
    };
  }, []);

  // Liquid Navbar items matching IMG_5351.png
  const navItems: LiquidNavItem[] = [
    { label: "หน้าหลัก", icon: NimbusIcons.home, fx: "glow" },
    { label: "ขอบเขตงาน", icon: NimbusIcons.globe, fx: "spin" },
    { label: "สั่ง AI ออกแบบ", icon: NimbusIcons.plane, fx: "plane" },
    { label: "ตรวจ 16 ด่าน", icon: NimbusIcons.drop, fx: "drop" },
    { label: "ตั้งค่า", icon: NimbusIcons.user, fx: "wave" },
  ];

  // Map active tab to navbar index 0..4
  const getNavbarIndex = (): number => {
    switch (activeTab) {
      case 'overview':
        return 0;
      case 'scope-builder':
      case 'proposed-work':
        return 1;
      case 'ai-studio':
        return 2;
      case 'stop-gates':
        return 3;
      case 'gascode':
        return 4;
      default:
        return 0;
    }
  };

  const handleNavbarChange = (index: number) => {
    switch (index) {
      case 0:
        setActiveTab('overview');
        break;
      case 1:
        setActiveTab('scope-builder');
        break;
      case 2:
        setActiveTab('ai-studio');
        break;
      case 3:
        setActiveTab('stop-gates');
        break;
      case 4:
        setIsGatewayModalOpen(true);
        break;
    }
  };

  return (
    <div className={`relative min-h-screen font-sans antialiased flex flex-col transition-colors ${
      theme === 'light'
        ? 'bg-transparent text-[#14243A] selection:bg-blue-200 selection:text-blue-900'
        : 'theme-dark bg-[#070b12] text-slate-100 selection:bg-teal-400 selection:text-slate-950'
    }`}>
      {/* Pure iOS Frosted Crystal Glass Ambient (Pure White & Neutral Translucent, Zero Blue Tint) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-[10%] left-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-white/95 via-slate-50/50 to-transparent blur-[100px] opacity-90" />
        <div className="absolute top-[35%] -right-[5%] w-[480px] h-[480px] rounded-full bg-gradient-to-bl from-white/90 via-zinc-100/40 to-transparent blur-[110px] opacity-80" />
        <div className="absolute -bottom-[8%] left-[15%] w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-white/95 via-slate-50/50 to-transparent blur-[120px] opacity-90" />
      </div>

      {/* Top Bar with Brand, Back Button, Theme Switcher, and Gateway Trigger */}
      <GoogleAITopbar
        activeTab={activeTab}
        onSelectTab={(tabId) => setActiveTab(tabId as ActiveTabType)}
        config={config}
        onOpenGatewayModal={() => setIsGatewayModalOpen(true)}
        onOpenLogsModal={() => setIsLogsModalOpen(true)}
        onOpenGasCodeModal={() => setIsGasCodeModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-5 sm:py-6 space-y-6 pb-44">
        {/* Connection Status Banner (Always visible & interactive) */}
        <ConnectionStatusBanner
          config={config}
          onOpenGatewayModal={() => setIsGatewayModalOpen(true)}
        />

        {/* Back button banner if in a sub-menu */}
        {activeTab !== 'overview' && (
          <div className="flex items-center justify-between pb-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer ${
                theme === 'light'
                  ? 'bg-white/80 hover:bg-white text-slate-700 border border-blue-200/80 hover:border-blue-300'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-teal-300 border border-slate-700'
              }`}
            >
              <ArrowLeft className="w-4 h-4 text-blue-600 dark:text-teal-400" />
              <span>← กลับหน้าหลัก (Hub)</span>
            </button>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              {activeTab === 'ai-studio' && 'Google AI UI Studio'}
              {activeTab === 'scope-builder' && 'Scope Builder'}
              {activeTab === 'stop-gates' && '16 Stop Gates Audit'}
              {activeTab === 'proposed-work' && 'CRD WORK 1–9'}
              {activeTab === 'gascode' && 'Google Apps Script (Code.gs)'}
            </span>
          </div>
        )}

        {/* View 1: Clean Hub Dashboard (Simple 6-card Hub, no bloated banner!) */}
        {activeTab === 'overview' && (
          <CleanHubDashboard
            config={config}
            scopesCount={scopesCount}
            logCount={logCount}
            onNavigate={(view) => setActiveTab(view as ActiveTabType)}
            onOpenGatewayModal={() => setIsGatewayModalOpen(true)}
            onOpenLogsModal={() => setIsLogsModalOpen(true)}
            onOpenExportModal={() => setIsExportModalOpen(true)}
            theme={theme}
          />
        )}

        {/* View 2: Self-Evolving In-App AI UI Designer & Code Introspection */}
        {activeTab === 'ai-studio' && (
          <div className="space-y-6 animate-fade-in">
            <SelfEvolvingDesignStudio
              onOpenLogsModal={() => setIsLogsModalOpen(true)}
            />
            <AICommandDispatcher onOpenLogsModal={() => setIsLogsModalOpen(true)} />
          </div>
        )}

        {/* View 3: Scope Builder Dedicated View */}
        {activeTab === 'scope-builder' && (
          <div className="space-y-6 animate-fade-in">
            <ScopeBuilderClean onOpenLogsModal={() => setIsLogsModalOpen(true)} />
            <ProposedWorkGrid />
          </div>
        )}

        {/* View 4: Stop Gates 16-Stage Audit Dedicated View */}
        {activeTab === 'stop-gates' && (
          <div className="space-y-6 animate-fade-in">
            <StopGatesAuditClean onOpenLogsModal={() => setIsLogsModalOpen(true)} />
          </div>
        )}

        {/* View 5: Proposed WORK 1–9 Grid Dedicated View */}
        {activeTab === 'proposed-work' && (
          <div className="space-y-6 animate-fade-in">
            <ProposedWorkGrid />
          </div>
        )}

        {/* View 6: Google Apps Script Backend Code Section */}
        {activeTab === 'gascode' && (
          <div className="space-y-6 animate-fade-in">
            <GasCodeSection />
          </div>
        )}
      </main>

      {/* Floating Live Payloads counter button */}
      <div className="hidden md:block fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsLogsModalOpen(true)}
          className={`px-4 py-2.5 rounded-2xl border text-xs font-medium shadow-xl flex items-center gap-2.5 cursor-pointer transition-all ${
            theme === 'light'
              ? 'bg-white/95 hover:bg-slate-50 border-blue-200 text-[#14243A]'
              : 'bg-[#0e1626]/95 hover:bg-slate-800 border-teal-500/40 text-slate-200'
          }`}
        >
          <Terminal className="w-4 h-4 text-blue-600 dark:text-teal-400" />
          <span className="font-semibold">Live Payloads</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="px-1.5 py-0.5 rounded-md bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-teal-300 font-mono text-[11px] font-bold">
            {logCount}
          </span>
        </button>
      </div>

      {/* Docked Bottom Bar with Frosted Glass Strip (Fixes overlap & text squishing) */}
      <nav className="fixed bottom-0 inset-x-0 z-50 bg-white/75 dark:bg-slate-900/80 backdrop-blur-2xl border-t border-slate-200/50 dark:border-slate-800/80 py-2.5 px-4 flex flex-col items-center justify-center shadow-[0_-8px_30px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col items-center">
          <LiquidNavbar
            items={navItems}
            active={getNavbarIndex()}
            onChange={(idx) => handleNavbarChange(idx)}
            tone={theme === 'dark' ? 'dark' : 'light'}
            compact={true}
            sound={true}
          />
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-1 select-none tracking-tight">
            by guglielmogiannattasio.it
          </span>
        </div>
      </nav>

      {/* Modals */}
      <BackendGatewayModal
        isOpen={isGatewayModalOpen}
        onClose={() => setIsGatewayModalOpen(false)}
        onOpenLogsDrawer={() => setIsLogsModalOpen(true)}
      />

      <GasCodeModal
        isOpen={isGasCodeModalOpen}
        onClose={() => setIsGasCodeModalOpen(false)}
      />

      <PayloadLogsModal
        isOpen={isLogsModalOpen}
        onClose={() => setIsLogsModalOpen(false)}
      />

      <ExportCodeModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onOpenGasModal={() => setIsGasCodeModalOpen(true)}
      />
    </div>
  );
}
