import { motion } from 'motion/react';
import { useCurtainNavigation } from '../context/NavigationContext';

function MaskedRevealLine({
  text,
  exiting,
  baseDelay = 0.08,
  wordStep = 0.045,
}: {
  text: string;
  exiting: boolean;
  baseDelay?: number;
  wordStep?: number;
}) {
  const words = text.trim().split(/\s+/).filter(Boolean);

  return (
    <span className="inline-flex flex-wrap justify-center gap-x-[0.26em] gap-y-[0.05em]">
      {words.map((word, idx) => (
        <span
          key={`${idx}-${word}`}
          className="inline-block overflow-hidden align-bottom py-[0.08em] -my-[0.08em]"
        >
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: '115%', opacity: 0, skewY: 4 }}
            animate={
              exiting
                ? { y: '-115%', opacity: 0, skewY: -3 }
                : { y: '0%', opacity: 1, skewY: 0 }
            }
            transition={{
              duration: exiting ? 0.24 : 0.46,
              delay: exiting ? idx * 0.02 : baseDelay + idx * wordStep,
              ease: exiting ? [0.7, 0, 0.84, 0] : [0.16, 1, 0.3, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function CurvedCurtain() {
  const { phase, payload, progress, transitionSeq } = useCurtainNavigation();

  if (phase === 'idle' || !payload) return null;

  const isExiting = phase === 'exiting';

  return (
    <motion.div
      key={transitionSeq}
      aria-live="polite"
      aria-label="Page transition"
      initial={{ y: '118%' }}
      animate={{ y: isExiting ? '-128%' : '0%' }}
      transition={{
        duration: isExiting ? 0.44 : 0.32,
        ease: isExiting ? [0.76, 0, 0.24, 1] : [0.22, 1, 0.36, 1],
      }}
      className="fixed inset-0 z-[95] bg-[#0E0E12] text-[#EFEFE9] flex flex-col items-center justify-between py-10 px-6 pointer-events-auto will-change-transform"
    >
      {/* Top Convex Arch on Entry */}
      <svg
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute -top-[156px] left-0 w-full h-[160px] text-[#0E0E12] pointer-events-none"
      >
        <path d="M0,160 Q720,-90 1440,160 Z" fill="currentColor" />
      </svg>

      {/* Bottom Convex Arch on Exit */}
      <svg
        viewBox="0 0 1440 170"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute -bottom-[166px] left-0 w-full h-[170px] text-[#0E0E12] pointer-events-none"
      >
        <path
          d={
            isExiting
              ? 'M0,0 L1440,0 L1440,12 Q720,195 0,12 Z'
              : 'M0,0 L1440,0 L1440,18 Q720,115 0,18 Z'
          }
          fill="currentColor"
        />
      </svg>

      <div className="h-4" />

      {/* Masked Staggered Editorial Reveal (no character scrambling) */}
      <div className="flex flex-col items-center text-center max-w-5xl px-4">
        <p className="font-serif-editorial italic font-semibold tracking-[-0.018em] text-[clamp(1.9rem,4.6vw,4rem)] leading-[1.08] uppercase text-[#EFEFE9] text-balance-safe">
          <MaskedRevealLine
            text={payload.italicLine}
            exiting={isExiting}
            baseDelay={0.08}
            wordStep={0.045}
          />
        </p>

        {payload.regularLine && (
          <>
            <motion.span
              aria-hidden="true"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={
                isExiting
                  ? { scaleX: 0, opacity: 0 }
                  : { scaleX: 1, opacity: 1 }
              }
              transition={{
                duration: isExiting ? 0.2 : 0.38,
                delay: isExiting ? 0 : 0.14,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="my-3 h-[2px] w-12 origin-center bg-[#D61914]"
            />

            <p className="font-display font-bold tracking-[-0.03em] text-[clamp(1.75rem,4.2vw,3.6rem)] leading-[1.08] uppercase text-[#EFEFE9]/82 text-balance-safe">
              <MaskedRevealLine
                text={payload.regularLine}
                exiting={isExiting}
                baseDelay={0.16}
                wordStep={0.045}
              />
            </p>
          </>
        )}
      </div>

      {/* Bottom 000 -> 100 Tabular Counter */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={isExiting ? { opacity: 0, y: -8 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="font-mono-tabular type-sm font-semibold text-[#EFEFE9]/70 flex items-center gap-2"
      >
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#D61914]" />
        <span>{String(progress).padStart(3, '0')}</span>
      </motion.div>
    </motion.div>
  );
}
