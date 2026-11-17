import { useState } from 'react';
import { useSound } from '../context/SoundContext';
import { useRubberScroll } from '../hooks/useRubberScroll';

interface RubberTextProps {
  text: string;
  className?: string;
  onClick?: () => void;
  cursorLabel?: string;
  stretchStrength?: number;
  scrollRubber?: boolean;
}

/**
 * Per-letter elastic rubber typography.
 * Responds both to hover plucking and live damped scroll/wheel velocity.
 * Words are wrapped in `whitespace-nowrap` so a word NEVER breaks mid-word.
 */
export function RubberText({
  text,
  className = '',
  onClick,
  cursorLabel,
  stretchStrength = 1,
  scrollRubber = true,
}: RubberTextProps) {
  const [hoveredGlobalIdx, setHoveredGlobalIdx] = useState<number | null>(null);
  const { playPluck } = useSound();
  const rawVel = useRubberScroll(scrollRubber ? 0.05 : 0);
  const scrollVel = scrollRubber ? rawVel : 0;

  const words = text
    .trim()
    .replace(/\s+([—–])/g, '\u00A0$1')
    .split(/\s+/)
    .filter(Boolean);
  let runningIdx = 0;

  return (
    <span
      onClick={onClick}
      data-cursor={cursorLabel}
      className={`inline-flex flex-wrap items-baseline gap-x-[0.26em] gap-y-[0.14em] ${className}`}
    >
      {words.map((word, wIdx) => {
        const chars = word.split('');
        return (
          <span key={`${word}-${wIdx}`} className="inline-flex whitespace-nowrap shrink-0">
            {chars.map((char, cIdx) => {
              const globalIdx = runningIdx++;
              const dist =
                hoveredGlobalIdx === null ? 99 : Math.abs(hoveredGlobalIdx - globalIdx);
              const factor = dist === 0 ? 1 : dist === 1 ? 0.52 : dist === 2 ? 0.2 : 0;

              // Scroll wave gives every heading living rubber ripple without clipping
              const phase = Math.sin(globalIdx * 0.65);
              const scrollTranslateY = -scrollVel * (5.2 + phase * 3.8) * stretchStrength;
              const scrollScaleY = 1 + Math.min(0.14, Math.abs(scrollVel) * 0.068 * stretchStrength);
              const scrollScaleX = 1 - Math.min(0.05, Math.abs(scrollVel) * 0.022 * stretchStrength);
              const scrollSkewX = scrollVel * -2.1 * stretchStrength;

              const scaleY = scrollScaleY + 0.22 * factor * stretchStrength;
              const scaleX = scrollScaleX - 0.09 * factor * stretchStrength;
              const translateY = scrollTranslateY - 7 * factor * stretchStrength;
              const hoverSkewX =
                hoveredGlobalIdx !== null && dist > 0 && dist <= 2
                  ? (globalIdx < hoveredGlobalIdx ? 4 : -4) * factor
                  : 0;
              const skewX = scrollSkewX + hoverSkewX;

              return (
                <span
                  key={`${wIdx}-${cIdx}`}
                  onMouseEnter={() => {
                    setHoveredGlobalIdx(globalIdx);
                    playPluck(0.85 + (globalIdx % 5) * 0.08);
                  }}
                  onMouseLeave={() => setHoveredGlobalIdx(null)}
                  style={{
                    transform: `translate3d(0, ${translateY.toFixed(2)}px, 0) scale(${scaleX.toFixed(3)}, ${scaleY.toFixed(3)}) skewX(${skewX.toFixed(2)}deg)`,
                    transition:
                      hoveredGlobalIdx !== null
                        ? 'transform 460ms cubic-bezier(0.34, 1.56, 0.64, 1), color 220ms ease'
                        : Math.abs(scrollVel) > 0.01
                        ? 'color 220ms ease'
                        : 'transform 540ms cubic-bezier(0.34, 1.56, 0.64, 1), color 220ms ease',
                  }}
                  className="inline-block origin-bottom will-change-transform"
                >
                  {char}
                </span>
              );
            })}
          </span>
        );
      })}
    </span>
  );
}
