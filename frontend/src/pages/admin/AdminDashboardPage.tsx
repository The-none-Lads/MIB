import React from 'react';
import { Lock, ShieldAlert, Cpu, CreditCard, Users, Activity, PlusCircle, Key } from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Notice Header */}
      <div className="p-4 rounded-xl bg-mib-amber-500/10 border border-mib-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-mib-amber-500/20 text-mib-amber-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-mono font-bold tracking-widest text-mib-amber-400 uppercase">
              RESTRICTED SECTOR // CHIEF OF OPERATIONS ONLY
            </div>
            <h1 className="text-xl font-display font-bold text-white tracking-wide">
              ADMINISTRATIVE COMMAND CONSOLE
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-mib-amber-300">
          <Key className="w-3.5 h-3.5" />
          <span>SESSION: LEVEL 9 CLEARANCE REQUIRED</span>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="mib-classified-card p-6 space-y-2">
          <div className="flex items-center justify-between text-mib-silver-400">
            <span className="text-xs font-mono uppercase tracking-wider">Active Operatives</span>
            <Users className="w-4 h-4 text-mib-cyan-400" />
          </div>
          <div className="text-3xl font-display font-bold text-white">42</div>
          <div className="text-[10px] font-mono text-mib-emerald-400 flex items-center space-x-1">
            <span>● ALL SANCTIONED</span>
          </div>
        </div>

        <div className="mib-classified-card p-6 space-y-2">
          <div className="flex items-center justify-between text-mib-silver-400">
            <span className="text-xs font-mono uppercase tracking-wider">Registered NFC Cards</span>
            <CreditCard className="w-4 h-4 text-mib-amber-400" />
          </div>
          <div className="text-3xl font-display font-bold text-white">88</div>
          <div className="text-[10px] font-mono text-mib-silver-400">
            NTAG424 DNA SECURE
          </div>
        </div>

        <div className="mib-classified-card p-6 space-y-2">
          <div className="flex items-center justify-between text-mib-silver-400">
            <span className="text-xs font-mono uppercase tracking-wider">Public Scans (24h)</span>
            <Activity className="w-4 h-4 text-mib-emerald-400" />
          </div>
          <div className="text-3xl font-display font-bold text-white">1,249</div>
          <div className="text-[10px] font-mono text-mib-cyan-400">
            +18.4% FROM PREV CYCLE
          </div>
        </div>

        <div className="mib-classified-card p-6 space-y-2">
          <div className="flex items-center justify-between text-mib-silver-400">
            <span className="text-xs font-mono uppercase tracking-wider">System Integrity</span>
            <Cpu className="w-4 h-4 text-mib-silver-300" />
          </div>
          <div className="text-3xl font-display font-bold text-mib-emerald-400">99.99%</div>
          <div className="text-[10px] font-mono text-mib-silver-500">
            QUANTUM SYNC OPTIMAL
          </div>
        </div>
      </div>

      {/* Action shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="mib-classified-card p-6 space-y-4">
          <h2 className="text-base font-display font-bold text-white flex items-center space-x-2">
            <PlusCircle className="w-4 h-4 text-mib-cyan-400" />
            <span>Personnel Management</span>
          </h2>
          <p className="text-xs font-mono text-mib-silver-400 leading-relaxed">
            Register new operative identities, manage classified codenames, assign division clearance, and configure public directory publication states.
          </p>
          <div className="pt-2">
            <button
              disabled
              className="px-4 py-2 rounded-lg bg-mib-charcoal-800 text-mib-silver-500 text-xs font-mono uppercase tracking-wider border border-mib-charcoal-700 cursor-not-allowed flex items-center space-x-2"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Phase 2 Admin Module Locked</span>
            </button>
          </div>
        </div>

        <div className="mib-classified-card p-6 space-y-4">
          <h2 className="text-base font-display font-bold text-white flex items-center space-x-2">
            <CreditCard className="w-4 h-4 text-mib-amber-400" />
            <span>NFC Card Transponders</span>
          </h2>
          <p className="text-xs font-mono text-mib-silver-400 leading-relaxed">
            Provision, assign, and audit physical NFC cards. Cryptographic UID mapping and tamper-evident revocation protocols.
          </p>
          <div className="pt-2">
            <button
              disabled
              className="px-4 py-2 rounded-lg bg-mib-charcoal-800 text-mib-silver-500 text-xs font-mono uppercase tracking-wider border border-mib-charcoal-700 cursor-not-allowed flex items-center space-x-2"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Card Provisioning Locked</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

