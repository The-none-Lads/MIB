import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ShieldCheck, Scan, Fingerprint, Lock, CheckCircle2, FastForward } from 'lucide-react';

interface VerificationSequenceProps {
  slug: string;
  codename?: string;
  onComplete: () => void;
}

export const VerificationSequence: React.FC<VerificationSequenceProps> = ({
  slug,
  codename,
  onComplete,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [step, setStep] = useState<number>(0);

  const steps = [
    { label: 'AUTHENTICATING NFC TRANSPONDER...', icon: Scan },
    { label: 'QUERYING COSMIC CLEARANCE REGISTRY...', icon: Fingerprint },
    { label: 'DECRYPTING PUBLIC DOSSIER SIGNATURE...', icon: Lock },
    { label: 'SECURITY CLEARANCE VERIFIED', icon: ShieldCheck },
  ];

  useEffect(() => {
    // If user prefers reduced motion, finish immediately
    if (shouldReduceMotion) {
      onComplete();
      return;
    }

    const timer1 = setTimeout(() => setStep(1), 450);
    const timer2 = setTimeout(() => setStep(2), 900);
    const timer3 = setTimeout(() => setStep(3), 1350);
    const timer4 = setTimeout(() => onComplete(), 1800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [shouldReduceMotion, onComplete]);

  if (shouldReduceMotion) {
    return null;
  }

  const CurrentIcon = steps[step]?.icon || Scan;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-mib-obsidian-950/95 backdrop-blur-xl p-4"
        role="alert"
        aria-live="polite"
        aria-label="Verifying identity clearance"
      >
        {/* Terminal frame */}
        <div className="relative w-full max-w-md p-8 rounded-2xl bg-mib-obsidian-900 border border-mib-cyan-500/30 shadow-[0_0_50px_rgba(34,211,238,0.15)] overflow-hidden">
          {/* Scanning beam animation */}
          <motion.div
            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-mib-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee]"
            initial={{ top: 0 }}
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />

          {/* Top header */}
          <div className="flex items-center justify-between border-b border-mib-charcoal-700/80 pb-3 mb-6">
            <div className="flex items-center space-x-2 text-xs font-mono text-mib-cyan-400">
              <span className="w-2 h-2 rounded-full bg-mib-cyan-400 animate-ping" />
              <span>MIB // NFC IDENTITY VERIFICATION</span>
            </div>
            <button
              onClick={onComplete}
              className="flex items-center space-x-1 text-[11px] font-mono text-mib-silver-400 hover:text-mib-cyan-300 transition-colors"
              title="Skip verification animation"
            >
              <span>SKIP</span>
              <FastForward className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Central radar / scanner graphic */}
          <div className="flex flex-col items-center justify-center my-6">
            <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-mib-obsidian-950 border border-mib-charcoal-600 shadow-inner">
              {/* Outer pulsing ring */}
              <div className="absolute inset-0 rounded-full border border-mib-cyan-400/30 animate-ping opacity-30" />
              <CurrentIcon className="w-10 h-10 text-mib-cyan-400 transition-all duration-300 transform scale-110" />
            </div>

            <div className="mt-6 text-center">
              <span className="text-xs font-mono tracking-widest text-mib-silver-400 uppercase">
                TARGET IDENTIFIER:
              </span>
              <div className="text-xl font-display font-bold text-white tracking-wider mt-0.5">
                {codename || slug.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Stepper / progress status */}
          <div className="space-y-2 mt-6">
            {steps.map((s, idx) => {
              const isPast = step > idx;
              const isCurrent = step === idx;
              return (
                <div
                  key={idx}
                  className={`flex items-center space-x-3 text-xs font-mono transition-colors duration-200 ${
                    isPast
                      ? 'text-mib-emerald-400'
                      : isCurrent
                      ? 'text-mib-cyan-300 font-semibold'
                      : 'text-mib-charcoal-600'
                  }`}
                >
                  {isPast ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-mib-emerald-400 shrink-0" />
                  ) : isCurrent ? (
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-mib-cyan-400 border-t-transparent animate-spin shrink-0" />
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full border border-mib-charcoal-700 shrink-0" />
                  )}
                  <span className="truncate">{s.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

