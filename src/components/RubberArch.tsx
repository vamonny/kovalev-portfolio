interface RubberArchProps {
  color: string;
  direction: 'up' | 'down';
  velocity?: number;
  className?: string;
}

/**
 * Scroll-reactive SVG rubber membrane edge that bows deeper during scroll momentum
 * and springs back elastically.
 */
export function RubberArch({ color, direction, velocity = 0, className = '' }: RubberArchProps) {
  const flex = Math.max(-36, Math.min(36, velocity * 34));

  if (direction === 'up') {
    const ctrlY = Math.max(-40, Math.min(64, -18 - flex));
    return (
      <svg
        viewBox="0 0 1440 72"
        preserveAspectRatio="none"
        aria-hidden="true"
        style={{ color }}
        className={`w-full pointer-events-none ${className}`}
      >
        <path d={`M0,72 L0,44 Q720,${ctrlY.toFixed(1)} 1440,44 L1440,72 Z`} fill="currentColor" />
      </svg>
    );
  }

  const ctrlY = Math.max(12, Math.min(115, 84 + flex));
  return (
    <svg
      viewBox="0 0 1440 72"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ color }}
      className={`w-full pointer-events-none ${className}`}
    >
      <path d={`M0,0 L1440,0 L1440,26 Q720,${ctrlY.toFixed(1)} 0,26 Z`} fill="currentColor" />
    </svg>
  );
}
