import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useRubberScroll } from '../hooks/useRubberScroll';

/**
 * Elastic top tension thread ("Everything Is Connected") indicating reading/scroll progress
 * with subtle rubber sag proportional to scroll velocity.
 */
export function ScrollThread() {
  const { pathname } = useLocation();
  const { isDark } = useTheme();
  const scrollVel = useRubberScroll(0.05);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const doc = document.documentElement;
      const maxScroll = doc.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) {
        setProgress(0);
        return;
      }
      setProgress(Math.max(0, Math.min(1, window.scrollY / maxScroll)));
    };

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [pathname]);

  if (pathname === '/') return null;

  const pct = (progress * 100).toFixed(2);
  const sag = Math.max(-8, Math.min(8, scrollVel * 6));

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-40 h-5 pointer-events-none overflow-hidden"
    >
      <svg viewBox="0 0 1440 20" preserveAspectRatio="none" className="w-full h-full">
        {/* Hairline full-width guide */}
        <line
          x1="0"
          y1="2"
          x2="1440"
          y2="2"
          stroke={isDark ? '#EFEFE9' : '#0B0B0B'}
          strokeOpacity={isDark ? '0.14' : '0.1'}
          strokeWidth="1"
        />
        {/* Live elastic scarlet thread from 0 to current scroll progress */}
        <path
          d={`M0,2 Q${(progress * 720).toFixed(1)},${(2 + sag).toFixed(1)} ${(progress * 1440).toFixed(1)},2`}
          fill="none"
          stroke="#D61914"
          strokeWidth="2.5"
        />
      </svg>
      <div
        style={{ left: `calc(${pct}% - 3px)` }}
        className="absolute top-0 w-1.5 h-1.5 rounded-full bg-[#D61914]"
      />
    </div>
  );
}
