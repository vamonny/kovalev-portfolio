import { useCurtainNavigation } from '../context/NavigationContext';
import { ScrambleText } from './ScrambleText';

export function CurvedCurtain() {
  const { phase, payload, progress, transitionSeq } = useCurtainNavigation();

  if (phase === 'idle' || !payload) return null;

  const translateY =
    phase === 'entering'
      ? '0%'
      : phase === 'holding'
      ? '0%'
      : '-128%';

  const textRubberStyle =
    phase === 'exiting'
      ? {
          transform: 'translate3d(0, -28px, 0) scaleY(1.1) scaleX(0.97)',
          opacity: 0,
          transition:
            'transform 360ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 260ms ease',
        }
      : {
          transform: 'translate3d(0, 0, 0) scaleY(1) scaleX(1)',
          opacity: 1,
          transition: 'transform 320ms cubic-bezier(0.16, 1, 0.3, 1), opacity 200ms ease',
        };

  return (
    <div
      aria-live="polite"
      aria-label="Page transition"
      style={{
        transform: `translate3d(0, ${translateY}, 0)`,
        transition:
          phase === 'entering'
            ? 'transform 300ms cubic-bezier(0.22, 1, 0.36, 1)'
            : phase === 'exiting'
            ? 'transform 420ms cubic-bezier(0.76, 0, 0.24, 1)'
            : 'none',
      }}
      className="fixed inset-0 z-[90] bg-[#F5ED86] text-[#0B0B0B] flex flex-col items-center justify-between py-10 px-6 pointer-events-auto will-change-transform"
    >
      {/* Top Convex Arch on Entry */}
      <svg
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute -top-[156px] left-0 w-full h-[160px] text-[#F5ED86] pointer-events-none"
      >
        <path d="M0,160 Q720,-90 1440,160 Z" fill="currentColor" />
      </svg>

      {/* Bottom Convex Arch on Exit */}
      <svg
        viewBox="0 0 1440 170"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute -bottom-[166px] left-0 w-full h-[170px] text-[#F5ED86] pointer-events-none"
      >
        <path
          d={
            phase === 'exiting'
              ? 'M0,0 L1440,0 L1440,12 Q720,195 0,12 Z'
              : 'M0,0 L1440,0 L1440,18 Q720,115 0,18 Z'
          }
          fill="currentColor"
        />
      </svg>

      <div className="h-4" />

      {/* Editorial Serif Scramble Title (clean Cyrillic/Latin line height, no word breaking) */}
      <div
        style={textRubberStyle}
        className="flex flex-col items-center text-center max-w-5xl px-4 will-change-transform"
      >
        <p className="font-serif-editorial italic font-semibold tracking-[-0.015em] text-[clamp(1.9rem,4.6vw,4rem)] leading-[1.08] uppercase text-balance-safe">
          <ScrambleText
            text={payload.italicLine}
            triggerKey={`curtain-top-${transitionSeq}`}
            duration={340}
          />
        </p>

        {payload.regularLine && (
          <p className="font-serif-editorial font-medium tracking-[-0.01em] text-[clamp(1.75rem,4.2vw,3.6rem)] leading-[1.08] uppercase mt-2.5 text-balance-safe">
            <ScrambleText
              text={payload.regularLine}
              triggerKey={`curtain-bot-${transitionSeq}`}
              duration={400}
            />
          </p>
        )}
      </div>

      {/* Bottom 000 -> 100 Tabular Counter */}
      <div className="font-mono-tabular text-[11px] font-semibold tracking-[0.22em]">
        {String(progress).padStart(3, '0')}
      </div>
    </div>
  );
}
