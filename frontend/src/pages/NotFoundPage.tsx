import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldX, ArrowLeft, Home, Zap } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-lg w-full mib-classified-card p-8 sm:p-10 border-mib-crimson-600/50 text-center space-y-6 relative overflow-hidden">
        {/* Subtle red corner glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-mib-crimson-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto w-20 h-20 rounded-2xl bg-mib-crimson-600/10 border-2 border-mib-crimson-600/40 flex items-center justify-center text-mib-crimson-500 shadow-[0_0_30px_rgba(239,68,68,0.25)]">
          <ShieldX className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded bg-mib-crimson-600/10 border border-mib-crimson-600/30 text-mib-crimson-400 text-xs font-mono font-bold tracking-widest uppercase">
            <Zap className="w-3.5 h-3.5" />
            <span>ERROR 404 // CLASSIFIED ACCESS DENIED</span>
          </div>
          <h1 className="text-3xl font-display font-extrabold text-white tracking-wide">
            UNKNOWN SECTOR
          </h1>
          <p className="text-xs font-mono text-mib-silver-400 leading-relaxed max-w-sm mx-auto">
            The coordinates you requested do not correlate with any registered MIB installation, operative dossier, or public relay.
          </p>
        </div>

        <div className="p-3.5 rounded-lg bg-mib-obsidian-950/80 border border-mib-charcoal-700/80 text-[11px] font-mono text-mib-silver-500 text-center space-y-1">
          <div className="text-mib-amber-400 font-semibold uppercase">
            NEURALYZER DEPLOYMENT WARNING
          </div>
          <p>
            Remain calm. Look directly at the red indicator light at the top of your device.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            to="/directory"
            className="px-5 py-2.5 rounded-lg bg-mib-charcoal-800 hover:bg-mib-charcoal-700 text-mib-silver-200 text-xs font-mono uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors border border-mib-charcoal-600"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Personnel Directory</span>
          </Link>

          <Link
            to="/"
            className="px-5 py-2.5 rounded-lg bg-mib-cyan-500/20 hover:bg-mib-cyan-500/30 text-mib-cyan-300 text-xs font-mono uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors border border-mib-cyan-500/40"
          >
            <Home className="w-4 h-4" />
            <span>HQ Console</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

