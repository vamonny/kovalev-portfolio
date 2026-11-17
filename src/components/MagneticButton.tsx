import React, { useRef, useState } from 'react';
import { useSound } from '../context/SoundContext';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  cursorLabel?: string;
  as?: 'button' | 'div';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  ariaLabel?: string;
}

export function MagneticButton({
  children,
  className = '',
  strength = 0.28,
  onClick,
  cursorLabel,
  as = 'button',
  type = 'button',
  disabled = false,
  ariaLabel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const { playHover, playClick } = useSound();

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (disabled) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) * strength;
    const dy = (e.clientY - (rect.top + rect.height / 2)) * strength;
    setOffset({ x: dx, y: dy });
  };

  const handleMouseEnter = () => {
    if (!disabled) playHover();
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (disabled) return;
    playClick();
    onClick?.(e);
  };

  const style: React.CSSProperties = {
    transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
    transition:
      offset.x === 0 && offset.y === 0
        ? 'transform 480ms cubic-bezier(0.16, 1, 0.3, 1)'
        : 'transform 120ms cubic-bezier(0.16, 1, 0.3, 1)',
  };

  if (as === 'div') {
    return (
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        style={style}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        data-cursor={cursorLabel}
        className={className}
      >
        {children}
      </div>
    );
  }

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      data-cursor={cursorLabel}
      className={className}
    >
      {children}
    </button>
  );
}
