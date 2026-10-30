import React from 'react';
import { ShieldAlert, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative border-t border-mib-charcoal-800 bg-mib-obsidian-950 py-8 px-4 sm:px-6 lg:px-8 text-xs font-mono text-mib-silver-500 overflow-hidden">
      {/* Background Watermark */}
      <div className="mib-watermark text-4xl sm:text-6xl -top-2 left-1/2 -translate-x-1/2 text-mib-charcoal-700/20 select-none">
        TOP SECRET // EYES ONLY // UNCLASSIFIED SUMMARY
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div className="flex flex-col space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start space-x-2 text-mib-silver-400 font-semibold tracking-wider">
            <ShieldAlert className="w-4 h-4 text-mib-amber-500" />
            <span>MEN IN BLACK // DIGITAL IDENTITY ARCHIVE</span>
          </div>
          <p className="text-[11px] text-mib-silver-500">
            Authorized personnel only. Unsanctioned neuralyzer deployment or identity decryption is punishable under Intergalactic Treaty 104-A.
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end space-y-1 text-right">
          <div className="flex items-center space-x-2 text-[10px] text-mib-cyan-400/80">
            <Cpu className="w-3 h-3" />
            <span>SYS_SIG: 0x9F41C..2026 // PROD-STABLE</span>
          </div>
          <div className="text-[10px] text-mib-silver-500">
            ALL EXTRATERRESTRIAL ACTIVITY LOGGED & MONITORED
          </div>
        </div>
      </div>
    </footer>
  );
};

