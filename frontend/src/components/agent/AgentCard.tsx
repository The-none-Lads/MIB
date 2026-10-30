import React, { useState } from 'react';
import { Shield, Sparkles, AlertCircle, Quote, Award, Calendar, Hash } from 'lucide-react';
import type { PublicAgentDetail, PublicAgentSummary } from '../../types/agent';

interface AgentCardProps {
  agent: PublicAgentDetail | PublicAgentSummary;
  isDetailed?: boolean;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent, isDetailed = false }) => {
  const [imgError, setImgError] = useState(false);
  const detail = agent as Partial<PublicAgentDetail>;

  const isStatusActive = agent.status.toLowerCase() === 'active';

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Outer Card with holographic border & corner brackets */}
      <div className="mib-classified-card overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(34,211,238,0.2)]">
        {/* Holographic Header Bar */}
        <div className="relative px-6 py-4 bg-gradient-to-r from-mib-obsidian-950 via-mib-charcoal-900 to-mib-obsidian-950 border-b border-mib-charcoal-700/80 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-mib-obsidian-950 border border-mib-cyan-500/50 flex items-center justify-center shadow-inner">
              <Shield className="w-4 h-4 text-mib-cyan-400" />
            </div>
            <div>
              <div className="text-[10px] font-mono tracking-widest text-mib-cyan-400 font-bold uppercase">
                UNITED STATES // M.I.B.
              </div>
              <div className="text-[9px] font-mono tracking-wider text-mib-silver-400">
                OFFICIAL DIGITAL IDENTITY PASS
              </div>
            </div>
          </div>

          {/* Smart Chip Graphic */}
          <div className="flex items-center space-x-2">
            <div className="w-7 h-6 rounded bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border border-amber-300/60 shadow-sm flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 border-t border-b border-amber-600/40 my-1" />
              <div className="absolute inset-0 border-l border-r border-amber-600/40 mx-1" />
              <div className="w-2 h-2 rounded-full border border-amber-700/60" />
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-6">
          {/* Top row: Photograph + Main ID Data */}
          <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
            {/* Photograph Container */}
            <div className="relative w-32 h-40 sm:w-36 sm:h-44 rounded-lg bg-mib-obsidian-950 border-2 border-mib-charcoal-600 overflow-hidden shadow-inner shrink-0 group">
              {/* Scanline overlay */}
              <div className="absolute inset-0 mib-scanlines opacity-40 z-10 pointer-events-none" />

              {/* Status indicator pip */}
              <div className="absolute top-2 left-2 z-20 flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-mib-obsidian-950/80 backdrop-blur-sm border border-mib-charcoal-700">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isStatusActive
                      ? 'bg-mib-emerald-400 shadow-[0_0_8px_#10b981] animate-pulse'
                      : 'bg-mib-amber-400'
                  }`}
                />
                <span className="text-[9px] font-mono uppercase tracking-wider text-mib-silver-300 font-semibold">
                  {agent.status}
                </span>
              </div>

              {agent.photograph_url && !imgError ? (
                <img
                  src={agent.photograph_url}
                  alt={`Operative ${agent.codename}`}
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover grayscale contrast-125 filter group-hover:grayscale-0 transition-all duration-500"
                />
              ) : (
                /* Cinematic fallback operative silhouette (Sunglasses + Black Suit) */
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-mib-charcoal-900 to-mib-obsidian-950 text-mib-silver-400 relative">
                  <svg
                    className="w-24 h-28 text-mib-silver-400/80 drop-shadow-md"
                    viewBox="0 0 100 120"
                    fill="currentColor"
                  >
                    {/* Head */}
                    <circle cx="50" cy="35" r="20" />
                    {/* Sunglasses */}
                    <path
                      d="M36 33 C36 29 48 29 48 33 L48 37 C48 40 36 40 36 37 Z"
                      fill="#07090e"
                    />
                    <path
                      d="M52 33 C52 29 64 29 64 33 L64 37 C64 40 52 40 52 37 Z"
                      fill="#07090e"
                    />
                    <path d="M47 34 H53" stroke="#07090e" strokeWidth="2" />
                    {/* Dark Suit / Shoulders */}
                    <path d="M15 110 C15 70 30 60 50 60 C70 60 85 70 85 110 Z" />
                    {/* White Shirt Collar */}
                    <path d="M42 60 L50 82 L58 60 Z" fill="#ffffff" />
                    {/* Black Tie */}
                    <path d="M48 68 L52 68 L54 98 L50 105 L46 98 Z" fill="#000000" />
                  </svg>
                  <span className="text-[9px] font-mono tracking-widest text-mib-silver-500 uppercase mt-1">
                    CLASSIFIED BIO-PHOTO
                  </span>
                </div>
              )}
            </div>

            {/* Operative Core Fields */}
            <div className="flex-1 w-full space-y-3 text-center sm:text-left">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-mib-silver-500">
                  OPERATIVE CODENAME
                </span>
                <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-wide uppercase mib-glow-cyan">
                  {agent.codename}
                </h1>
                <div className="flex items-center justify-center sm:justify-start space-x-1.5 mt-0.5 text-xs font-mono text-mib-cyan-400">
                  <Hash className="w-3.5 h-3.5 text-mib-silver-500" />
                  <span>{agent.agent_number}</span>
                </div>
              </div>

              {/* Clearance Badge & Division */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <span className="px-2.5 py-1 rounded bg-mib-amber-500/10 border border-mib-amber-500/40 text-mib-amber-300 text-xs font-mono font-semibold tracking-wider flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-mib-amber-400" />
                  <span>{agent.clearance_level.toUpperCase()}</span>
                </span>

                <span className="px-2.5 py-1 rounded bg-mib-charcoal-800 border border-mib-charcoal-700 text-mib-silver-300 text-xs font-mono">
                  {agent.rank}
                </span>
              </div>

              {/* Operational Division */}
              <div className="pt-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-mib-silver-500 block">
                  DIVISION
                </span>
                <span className="text-xs font-mono text-mib-silver-200 font-medium">
                  {agent.division}
                </span>
              </div>
            </div>
          </div>

          {/* Specialization & Recruitment Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-mib-charcoal-800/80 text-xs font-mono">
            {agent.specialization && (
              <div className="p-2.5 rounded-lg bg-mib-obsidian-950/70 border border-mib-charcoal-800">
                <span className="text-[9px] uppercase tracking-wider text-mib-silver-500 block">
                  SPECIALIZATION
                </span>
                <span className="text-mib-silver-200 font-medium">
                  {agent.specialization}
                </span>
              </div>
            )}

            {agent.recruitment_date && (
              <div className="p-2.5 rounded-lg bg-mib-obsidian-950/70 border border-mib-charcoal-800">
                <span className="text-[9px] uppercase tracking-wider text-mib-silver-500 block">
                  RECRUITMENT ARCHIVE
                </span>
                <span className="text-mib-silver-300 flex items-center space-x-1">
                  <Calendar className="w-3 h-3 text-mib-cyan-400" />
                  <span>{agent.recruitment_date}</span>
                </span>
              </div>
            )}
          </div>

          {/* Signature Quote */}
          {detail.signature_quote && (
            <div className="relative p-3.5 rounded-lg bg-mib-charcoal-900/60 border border-mib-charcoal-700/60 text-xs italic text-mib-silver-300">
              <Quote className="w-4 h-4 text-mib-cyan-400/40 absolute top-2 right-2" />
              <p className="pr-4 leading-relaxed font-sans">
                &ldquo;{detail.signature_quote}&rdquo;
              </p>
            </div>
          )}

          {/* Dossier Biography (If Detailed view) */}
          {isDetailed && detail.biography && (
            <div className="pt-2 border-t border-mib-charcoal-800/80 space-y-1.5">
              <div className="flex items-center space-x-1.5 text-xs font-mono text-mib-cyan-400 font-semibold tracking-wider">
                <Award className="w-3.5 h-3.5" />
                <span>UNCLASSIFIED DOSSIER SUMMARY</span>
              </div>
              <p className="text-xs text-mib-silver-400 font-sans leading-relaxed bg-mib-obsidian-950/60 p-3 rounded-lg border border-mib-charcoal-800">
                {detail.biography}
              </p>
            </div>
          )}

          {/* Security Barcode & Clearance Warning */}
          <div className="pt-4 border-t border-mib-charcoal-800/80 flex items-center justify-between text-[9px] font-mono text-mib-silver-500">
            <div className="flex items-center space-x-2">
              {/* Stylized pseudo-barcode */}
              <div className="flex items-center space-x-[2px] h-6 bg-mib-silver-300/10 p-1 rounded">
                {[1, 2, 1, 3, 1, 2, 1, 1, 2, 3, 1, 2, 1].map((w, i) => (
                  <span
                    key={i}
                    className="h-full bg-mib-silver-400 inline-block opacity-80"
                    style={{ width: `${w}px` }}
                  />
                ))}
              </div>
              <span className="tracking-widest">NFC-VERIFIED</span>
            </div>

            <div className="flex items-center space-x-1 text-mib-amber-500/80">
              <AlertCircle className="w-3 h-3" />
              <span>EYES ONLY</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

