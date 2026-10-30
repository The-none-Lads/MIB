import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Radio, Terminal, Users, Lock, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [timeString, setTimeString] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-mib-charcoal-700/80 bg-mib-obsidian-950/90 backdrop-blur-md">
      {/* Top telemetry band */}
      <div className="hidden sm:flex items-center justify-between px-4 py-1 text-[10px] font-mono tracking-wider text-mib-silver-400 bg-mib-obsidian-900/60 border-b border-mib-charcoal-800">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1.5 text-mib-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-mib-emerald-400 animate-ping" />
            <span className="font-semibold">SEC-NET // NODE-01.ALPHA</span>
          </span>
          <span className="text-mib-charcoal-600">|</span>
          <span className="text-mib-silver-500">ENCRYPTION: QUANTUM-ECC-521</span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-mib-amber-400 font-semibold flex items-center space-x-1">
            <Radio className="h-3 w-3 animate-pulse" />
            <span>LEVEL 9 PUBLIC RELAY</span>
          </span>
          <span className="text-mib-charcoal-600">|</span>
          <span className="text-mib-cyan-400 font-mono">{timeString || 'SYNCHRONIZING...'}</span>
        </div>
      </div>

      {/* Main Agency Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Monogram */}
          <Link
            to="/directory"
            className="group flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-mib-cyan-500 rounded-lg p-1"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-mib-charcoal-800 border border-mib-charcoal-600 group-hover:border-mib-cyan-400 transition-colors shadow-inner">
              <Shield className="w-5 h-5 text-mib-cyan-400 group-hover:text-mib-cyan-300 transition-colors" />
              <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-mib-cyan-400" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg tracking-widest text-mib-silver-100 group-hover:text-white flex items-center gap-1.5">
                M.I.B.
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-mib-charcoal-800 text-mib-silver-400 border border-mib-charcoal-700">
                  SYSTEM
                </span>
              </span>
              <span className="text-[9px] font-mono tracking-widest text-mib-silver-500 uppercase">
                Department of Special Affairs
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/directory"
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-md text-xs font-mono uppercase tracking-wider transition-all ${
                location.pathname === '/directory' || location.pathname === '/'
                  ? 'bg-mib-charcoal-800 text-mib-cyan-300 border border-mib-cyan-500/40 shadow-sm'
                  : 'text-mib-silver-400 hover:text-mib-silver-100 hover:bg-mib-charcoal-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Personnel Directory</span>
            </Link>

            <Link
              to="/agent/k"
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-md text-xs font-mono uppercase tracking-wider transition-all ${
                location.pathname.startsWith('/agent')
                  ? 'bg-mib-charcoal-800 text-mib-cyan-300 border border-mib-cyan-500/40 shadow-sm'
                  : 'text-mib-silver-400 hover:text-mib-silver-100 hover:bg-mib-charcoal-900'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Identity Verification</span>
            </Link>

            <div className="h-4 w-px bg-mib-charcoal-700 mx-2" />

            <Link
              to="/admin"
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-mono tracking-wider border transition-all ${
                location.pathname.startsWith('/admin')
                  ? 'bg-mib-amber-500/10 text-mib-amber-300 border-mib-amber-500/50'
                  : 'text-mib-silver-400 hover:text-mib-amber-400 border-mib-charcoal-700 hover:border-mib-amber-500/40'
              }`}
            >
              <Lock className="w-3 h-3 text-mib-amber-500" />
              <span>Terminal Auth</span>
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-mib-silver-400 hover:text-white hover:bg-mib-charcoal-800 focus:outline-none focus:ring-2 focus:ring-mib-cyan-500"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-mib-charcoal-800 bg-mib-obsidian-900 px-4 pt-3 pb-4 space-y-2">
          <div className="text-[11px] font-mono text-mib-cyan-400 pb-2 border-b border-mib-charcoal-800 flex justify-between">
            <span>SEC-NET RELAY</span>
            <span>{timeString}</span>
          </div>
          <Link
            to="/directory"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded text-xs font-mono uppercase tracking-wider text-mib-silver-200 hover:bg-mib-charcoal-800"
          >
            Personnel Directory
          </Link>
          <Link
            to="/agent/k"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded text-xs font-mono uppercase tracking-wider text-mib-silver-200 hover:bg-mib-charcoal-800"
          >
            Identity Verification
          </Link>
          <Link
            to="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded text-xs font-mono uppercase tracking-wider text-mib-amber-400 hover:bg-mib-charcoal-800 border border-mib-amber-500/30"
          >
            Terminal Auth
          </Link>
        </div>
      )}
    </header>
  );
};

