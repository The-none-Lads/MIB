import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePublicAgent } from '../../hooks/useAgent';
import { AgentCard } from '../../components/agent/AgentCard';
import { VerificationSequence } from '../../components/agent/VerificationSequence';
import {
  ShieldAlert,
  ArrowLeft,
  FileText,
  Share2,
  RefreshCw,
  Terminal,
  Lock,
} from 'lucide-react';

export const AgentProfilePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [hasVerified, setHasVerified] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const { data: agent, isLoading, isError, error, refetch } = usePublicAgent(slug);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <div className="relative w-20 h-20 mb-6">
          <div className="absolute inset-0 rounded-full border-2 border-mib-charcoal-700 border-t-mib-cyan-400 animate-spin" />
          <div className="absolute inset-2 rounded-full border-2 border-mib-charcoal-700 border-b-mib-amber-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          <Terminal className="w-8 h-8 text-mib-cyan-400 absolute inset-0 m-auto" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-sm font-mono tracking-widest text-mib-cyan-300 font-bold uppercase animate-pulse">
            INTERROGATING QUANTUM IDENTITY REGISTER...
          </p>
          <p className="text-xs font-mono text-mib-silver-500">
            LOCATING OPERATIVE [{slug?.toUpperCase()}]
          </p>
        </div>
      </div>
    );
  }

  // Classified 404 / Unknown Operative / Redacted
  if (isError || !agent) {
    const is404 = error?.status === 404;

    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full mib-classified-card p-8 border-mib-crimson-600/40 text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-mib-crimson-600/10 border border-mib-crimson-600/40 flex items-center justify-center text-mib-crimson-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono tracking-widest text-mib-crimson-500 font-bold uppercase px-2.5 py-0.5 rounded bg-mib-crimson-600/10 border border-mib-crimson-600/30">
              {is404 ? 'CLASSIFIED // RECORD REDACTED' : 'SEC-NET COMM ERROR'}
            </span>
            <h1 className="text-2xl font-display font-bold text-white tracking-wide">
              {is404 ? 'Operative Non-Existent' : 'Connection Refused'}
            </h1>
            <p className="text-xs font-mono text-mib-silver-400 leading-relaxed">
              {is404
                ? `Operative identifier [${slug}] has not been recognized by Department headquarters. The file may be deeply classified, archived, or purged by neuralyzer protocol.`
                : error?.message || 'Unable to establish secure telemetry with agency servers.'}
            </p>
          </div>

          <div className="p-3 rounded bg-mib-obsidian-950/80 border border-mib-charcoal-700 text-[11px] font-mono text-mib-silver-500 flex items-center justify-center space-x-2">
            <Lock className="w-3.5 h-3.5 text-mib-amber-500" />
            <span>UNAUTHORIZED ACCESS ATTEMPTS ARE CATALOGUED</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              to="/directory"
              className="px-4 py-2 rounded-lg bg-mib-charcoal-800 hover:bg-mib-charcoal-700 text-mib-silver-200 text-xs font-mono uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors border border-mib-charcoal-600"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Directory</span>
            </Link>

            {!is404 && (
              <button
                onClick={() => refetch()}
                className="px-4 py-2 rounded-lg bg-mib-cyan-500/20 hover:bg-mib-cyan-500/30 text-mib-cyan-300 text-xs font-mono uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors border border-mib-cyan-500/40"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Transmission</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
      {/* Verification Sequence Overlay (first load per session) */}
      {!hasVerified && (
        <VerificationSequence
          slug={agent.slug}
          codename={agent.codename}
          onComplete={() => setHasVerified(true)}
        />
      )}

      {/* Top Breadcrumb & Action bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-mib-charcoal-800 pb-4">
        <Link
          to="/directory"
          className="inline-flex items-center space-x-2 text-xs font-mono text-mib-silver-400 hover:text-mib-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>RETURN TO PERSONNEL DIRECTORY</span>
        </Link>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-mib-charcoal-800 hover:bg-mib-charcoal-700 border border-mib-charcoal-600 text-xs font-mono text-mib-silver-300 transition-colors"
            title="Copy Public NFC Identity Link"
          >
            <Share2 className="w-3.5 h-3.5 text-mib-cyan-400" />
            <span>{copied ? 'COPIED TO CLIPBOARD' : 'SHARE NFC LINK'}</span>
          </button>
        </div>
      </div>

      {/* Main Agent Identity Card */}
      <section className="flex flex-col items-center">
        <div className="w-full flex justify-center">
          <AgentCard agent={agent} isDetailed={true} />
        </div>
      </section>

      {/* Supplemental Classified Intelligence Dossier Section */}
      <section className="mib-classified-card p-6 sm:p-8 space-y-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-between border-b border-mib-charcoal-700/80 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-mib-cyan-500/10 border border-mib-cyan-500/30 text-mib-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold text-white tracking-wide">
                PUBLIC DOSSIER ARCHIVE
              </h2>
              <p className="text-xs font-mono text-mib-silver-500">
                LEVEL 9 PUBLIC RELAY — SANITIZED SUMMARY
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded bg-mib-emerald-500/10 border border-mib-emerald-500/40 text-mib-emerald-300 font-bold">
            SECURITY CLEARANCE ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-lg bg-mib-obsidian-950/80 border border-mib-charcoal-800 space-y-1">
            <span className="text-mib-silver-500 text-[10px]">RECORD REGISTERED ON</span>
            <p className="text-mib-silver-200">
              {new Date(agent.created_at).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-mib-obsidian-950/80 border border-mib-charcoal-800 space-y-1">
            <span className="text-mib-silver-500 text-[10px]">STATUS DESIGNATION</span>
            <p className="text-mib-emerald-400 font-semibold uppercase">
              {agent.status} // SANCTIONED OPERATIVE
            </p>
          </div>
        </div>

        {/* Intelligence Notice */}
        <div className="p-4 rounded-lg bg-mib-charcoal-900/40 border border-mib-charcoal-700/60 text-xs font-mono text-mib-silver-400 space-y-2">
          <div className="text-mib-amber-400 font-bold flex items-center space-x-1.5">
            <ShieldAlert className="w-4 h-4" />
            <span>DIRECTIVE 89-B: CIVILIAN INTERACTION POLICY</span>
          </div>
          <p className="font-sans leading-relaxed text-[13px] text-mib-silver-300">
            This identity token confirms authentic MIB affiliation under United States covert charter.
            If civilian memory retention compromise is observed, standard Class-A neuralyzer exposure
            is authorized immediately.
          </p>
        </div>
      </section>
    </div>
  );
};

