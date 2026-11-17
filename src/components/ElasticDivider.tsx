import React, { useRef, useState } from 'react';
import { useSound } from '../context/SoundContext';

interface ElasticDividerProps {
  color?: string;
  className?: string;
}

export function ElasticDivider({ color = 'currentColor', className = '' }: ElasticDividerProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [ctrl, setCtrl] = useState({ x: 500, y: 24 });
  const [active, setActive] = useState(false);
  const { playPluck } = useSound();

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 1000;
    const ny = ((e.clientY - rect.top) / rect.height) * 48;
    const clampedY = Math.max(4, Math.min(44, ny));
    setCtrl({ x: nx, y: clampedY });
    setActive(true);
  };

  const handleMouseEnter = () => {
    playPluck(1.15);
  };

  const handleMouseLeave = () => {
    setActive(false);
    setCtrl({ x: 500, y: 24 });
  };

  const pathD = `M 0 24 Q ${ctrl.x.toFixed(1)} ${ctrl.y.toFixed(1)} 1000 24`;

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <svg
        ref={svgRef}
        viewBox="0 0 1000 48"
        preserveAspectRatio="none"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="w-full h-10 block cursor-pointer"
        aria-hidden="true"
      >
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth={active ? '1.6' : '1'}
          strokeOpacity={active ? '0.75' : '0.24'}
          style={{
            transition: active
              ? 'none'
              : 'd 650ms cubic-bezier(0.16, 1, 0.3, 1), stroke-opacity 240ms ease',
          }}
        />
      </svg>
    </div>
  );
}
