import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const AppLayout: React.FC = () => {
  return (
    <div className="relative min-h-screen flex flex-col bg-mib-obsidian-950 text-mib-silver-200">
      {/* Ambient background grid & vignette */}
      <div className="fixed inset-0 bg-cyber-grid bg-[size:40px_40px] opacity-25 pointer-events-none" />
      <div className="fixed inset-0 bg-radial-vignette pointer-events-none" />

      {/* Top Navbar */}
      <Navbar />

      {/* Main Dynamic View */}
      <main className="flex-1 relative z-10 w-full">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

