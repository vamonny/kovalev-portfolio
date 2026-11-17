import React, { useState } from 'react';
import { useSound } from '../context/SoundContext';

interface KineticTextProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  accentIndices?: number[];
  accentColor?: string;
}

export function KineticText({
  text,
  className = '',
  as: Tag = 'h1',
  accentIndices = [],
  accentColor = '#E63B1F',
}: KineticTextProps) {
  const [hoveredWord, setHoveredWord] = useState<number | null>(null);
  const { playHover } = useSound();

  const words = text.split(' ');

  return (
    <Tag className={`${className} text-balance-safe`}>
      {words.map((word, wIdx) => {
        const isHovered = hoveredWord === wIdx;
        const isAdjacent = hoveredWord !== null && Math.abs(hoveredWord - wIdx) === 1;
        const isAccent = accentIndices.includes(wIdx);

        return (
          <span
            key={`${word}-${wIdx}`}
            onMouseEnter={() => {
              setHoveredWord(wIdx);
              playHover();
            }}
            onMouseLeave={() => setHoveredWord(null)}
            style={{
              color: isAccent ? accentColor : undefined,
              transform: isHovered
                ? 'translate3d(0, -4px, 0) scaleY(1.08) skewX(-3deg)'
                : isAdjacent
                ? 'translate3d(0, -1px, 0) scaleY(1.02)'
                : 'translate3d(0, 0, 0) scaleY(1)',
              transition: 'transform 420ms cubic-bezier(0.16, 1, 0.3, 1), color 200ms ease',
            }}
            className="inline-block mr-[0.26em] last:mr-0 origin-bottom will-change-transform select-none sm:select-text"
          >
            {word}
          </span>
        );
      })}
    </Tag>
  );
}
