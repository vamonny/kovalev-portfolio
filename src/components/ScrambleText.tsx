import { useEffect, useState, useRef, Fragment } from 'react';

const LATIN_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LATIN_LOWER = 'abcdefghijklmnopqrstuvwxyz';
const CYRILLIC_UPPER = 'АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЭЮЯ';
const CYRILLIC_LOWER = 'абвгдежзиклмнопрстуфхцчшщэюя';
const DIGITS = '0123456789';

function pickMatchedGlyph(ch: string): string | null {
  if (/[0-9]/.test(ch)) return DIGITS[Math.floor(Math.random() * DIGITS.length)];
  if (/[А-ЯЁ]/.test(ch)) return CYRILLIC_UPPER[Math.floor(Math.random() * CYRILLIC_UPPER.length)];
  if (/[а-яё]/.test(ch)) return CYRILLIC_LOWER[Math.floor(Math.random() * CYRILLIC_LOWER.length)];
  if (/[A-Z]/.test(ch)) return LATIN_UPPER[Math.floor(Math.random() * LATIN_UPPER.length)];
  if (/[a-z]/.test(ch)) return LATIN_LOWER[Math.floor(Math.random() * LATIN_LOWER.length)];
  // Preserve punctuation, spaces, dashes, brackets, quotes cleanly so words don't jitter
  return null;
}

interface ScrambleTextProps {
  text: string;
  className?: string;
  triggerOnHover?: boolean;
  triggerKey?: string | number;
  duration?: number;
}

export function ScrambleText({
  text,
  className = '',
  triggerOnHover = false,
  triggerKey,
  duration = 420,
}: ScrambleTextProps) {
  const [display, setDisplay] = useState(text);
  const rafRef = useRef<number>(0);

  const runScramble = () => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setDisplay(text);
      return;
    }

    cancelAnimationFrame(rafRef.current);
    const start = performance.now();
    const chars = Array.from(text);

    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      const revealedCount = Math.floor(progress * chars.length);

      const next = chars
        .map((ch, idx) => {
          if (idx < revealedCount) return ch;
          const glyph = pickMatchedGlyph(ch);
          return glyph ?? ch;
        })
        .join('');

      setDisplay(next);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setDisplay(text);
      }
    };

    rafRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    setDisplay(text);
    runScramble();
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, triggerKey]);

  // Split by whitespace so each word sits inside a nowrap span and NEVER breaks mid-word while scrambling
  const tokens = display.split(/(\s+)/);

  return (
    <span
      onMouseEnter={triggerOnHover ? runScramble : undefined}
      className={className}
    >
      {tokens.map((tok, i) =>
        /^\s+$/.test(tok) ? (
          <Fragment key={i}>{tok}</Fragment>
        ) : (
          <span key={i} className="inline-block whitespace-nowrap">
            {tok}
          </span>
        )
      )}
    </span>
  );
}
