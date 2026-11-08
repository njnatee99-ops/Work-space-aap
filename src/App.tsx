/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { BentoGrid } from './components/BentoGrid';
import { PricingSection } from './components/PricingSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { BackendGatewayModal } from './components/BackendGatewayModal';
import { PayloadInspectorDrawer } from './components/PayloadInspectorDrawer';

export default function App() {
  const [isGatewayModalOpen, setIsGatewayModalOpen] = useState(false);
  const [isLogsDrawerOpen, setIsLogsDrawerOpen] = useState(false);

  const handleSelectEnterprise = () => {
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 selection:bg-cyan-500 selection:text-slate-950 font-sans antialiased">
      {/* Top Navigation Bar */}
      <Navbar
        onOpenGatewayModal={() => setIsGatewayModalOpen(true)}
        onOpenLogsDrawer={() => setIsLogsDrawerOpen(true)}
      />

      {/* Main Content Layout */}
      <main>
        {/* 1. Hero Section */}
        <HeroSection
          onOpenGatewayModal={() => setIsGatewayModalOpen(true)}
          onOpenLogsDrawer={() => setIsLogsDrawerOpen(true)}
        />

        {/* 2. Features Bento Grid (01–04) */}
        <BentoGrid onOpenLogsDrawer={() => setIsLogsDrawerOpen(true)} />

        {/* 3. Pricing Matrix Section */}
        <PricingSection
          onSelectEnterprise={handleSelectEnterprise}
          onOpenLogsDrawer={() => setIsLogsDrawerOpen(true)}
        />

        {/* 4. Contact Form Section */}
        <ContactSection onOpenLogsDrawer={() => setIsLogsDrawerOpen(true)} />
      </main>

      {/* Quiet Footer */}
      <Footer
        onOpenGatewayModal={() => setIsGatewayModalOpen(true)}
        onOpenLogsDrawer={() => setIsLogsDrawerOpen(true)}
      />

      {/* User Backend Gateway Configuration Modal */}
      <BackendGatewayModal
        isOpen={isGatewayModalOpen}
        onClose={() => setIsGatewayModalOpen(false)}
        onOpenLogsDrawer={() => setIsLogsDrawerOpen(true)}
      />

      {/* Live Gateway Outbound Payload Inspector Drawer */}
      <PayloadInspectorDrawer
        isOpen={isLogsDrawerOpen}
        onClose={() => setIsLogsDrawerOpen(false)}
        onOpen={() => setIsLogsDrawerOpen(true)}
      />
    </div>
  );
}
