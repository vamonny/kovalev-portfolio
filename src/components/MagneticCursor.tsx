import { useEffect, useRef, useState } from 'react';

function parseRgbLuminance(bg: string): number | null {
  const m = bg.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/i);
  if (!m) return null;
  const alpha = m[4] !== undefined ? parseFloat(m[4]) : 1;
  if (alpha < 0.15) return null;
  const r = parseInt(m[1], 10);
  const g = parseInt(m[2], 10);
  const b = parseInt(m[3], 10);
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

function checkIsDark(el: HTMLElement | null): boolean {
  if (!el) return document.documentElement.classList.contains('dark');

  const tag = el.tagName;
  if (tag === 'VIDEO' || el.closest('.liquid-glass-dark')) {
    return true;
  }

  let cur: HTMLElement | null = el;
  while (cur && cur !== document.documentElement) {
    const cls = typeof cur.className === 'string' ? cur.className : '';
    if (
      cls.includes('bg-[#0B0B0B]') ||
      cls.includes('bg-[#0C0C0F]') ||
      cls.includes('bg-[#101014]') ||
      cls.includes('bg-[#120E14]') ||
      cls.includes('bg-[#141418]') ||
      cls.includes('bg-[#16161B]') ||
      cls.includes('bg-[#1C1C20]') ||
      cls.includes('bg-[#070E1A]') ||
      cls.includes('bg-[#0B0B0D]') ||
      cls.includes('liquid-glass-dark')
    ) {
      return true;
    }

    if (
      cls.includes('bg-white') ||
      cls.includes('bg-[#EFEFE9]') ||
      cls.includes('bg-[#E5E4DC]') ||
      cls.includes('bg-[#E6E5DD]') ||
      cls.includes('liquid-glass-light')
    ) {
      // Explicit light container unless nested dark override matched earlier
      if (!document.documentElement.classList.contains('dark') || !cls.includes('dark:bg-')) {
        return false;
      }
    }

    const bg = window.getComputedStyle(cur).backgroundColor;
    const lum = parseRgbLuminance(bg);
    if (lum !== null) {
      return lum < 0.45;
    }
    cur = cur.parentElement;
  }

  return document.documentElement.classList.contains('dark');
}

export function MagneticCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string>('');
  const [isPressed, setIsPressed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isOverDark, setIsOverDark] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reducedMotion) return;

    setEnabled(true);
    document.documentElement.classList.add('custom-cursor-active');

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let rafId = 0;

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setIsVisible(true);

      const targetEl = e.target as HTMLElement | null;
      setIsOverDark(checkIsDark(targetEl));

      const el = targetEl?.closest('[data-cursor]') as HTMLElement | null;
      if (el) {
        setLabel(el.getAttribute('data-cursor') || '');
      } else {
        const interactive = targetEl?.closest(
          'a, button, input, textarea, select, [role="button"]'
        );
        setLabel(interactive ? '•' : '');
      }
    };

    const onMouseDown = () => setIsPressed(true);
    const onMouseUp = () => setIsPressed(false);
    const onMouseLeave = () => setIsVisible(false);

    const tick = () => {
      currentX += (targetX - currentX) * 0.28;
      currentY += (targetY - currentY) * 0.28;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    rafId = requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (!enabled || !isVisible) return null;

  const hasText = label.length > 1;
  const isInteractive = label.length > 0;

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="fixed top-0 left-0 z-[9999] pointer-events-none will-change-transform"
    >
      {/* Dual-Stroke high-contrast reticle dot + ring */}
      <div
        className={`-translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-150 ${
          isInteractive ? 'w-4 h-4' : 'w-2.5 h-2.5'
        } ${
          isOverDark
            ? 'bg-[#E7FA53] ring-1 ring-[#0B0B0B]/85 shadow-[0_0_10px_rgba(231,250,83,0.7)]'
            : 'bg-[#0B0B0B] outline outline-2 outline-white/90 shadow-[0_1px_4px_rgba(0,0,0,0.28)]'
        } ${isPressed ? 'scale-75' : 'scale-100'}`}
      />

      {/* Acid Lime floating tag ("View project" style) */}
      {hasText && (
        <div className="ml-3.5 -mt-1 px-2.5 py-1 bg-[#E7FA53] text-[#0B0B0B] border border-[#0B0B0B]/20 text-[11px] font-medium whitespace-nowrap shadow-md">
          {label}
        </div>
      )}
    </div>
  );
}
