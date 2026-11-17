import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useSound } from '../context/SoundContext';

interface NodePoint {
  id: string;
  labelRu: string;
  labelEn: string;
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  color: string;
}

const INITIAL_NODES: NodePoint[] = [
  { id: 'form', labelRu: 'ФОРМА', labelEn: 'FORM', baseX: 22, baseY: 26, x: 22, y: 26, color: '#F4F1EA' },
  { id: 'type', labelRu: 'ШРИФТ', labelEn: 'TYPE', baseX: 78, baseY: 24, x: 78, y: 24, color: '#D9FF3F' },
  { id: 'motion', labelRu: 'ДВИЖЕНИЕ', labelEn: 'MOTION', baseX: 24, baseY: 76, x: 24, y: 76, color: '#E63B1F' },
  { id: 'system', labelRu: 'СИСТЕМА', labelEn: 'SYSTEM', baseX: 76, baseY: 74, x: 76, y: 74, color: '#F4F1EA' },
];

export function TensionCanvas({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  const { lang } = useLanguage();
  const { playPluck, playMorph } = useSound();
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<NodePoint[]>(INITIAL_NODES);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [morphIndex, setMorphIndex] = useState(0);

  // Compute centroid dynamically from all 4 nodes — "Everything Is Connected"
  const centerX = nodes.reduce((sum, n) => sum + n.x, 0) / nodes.length;
  const centerY = nodes.reduce((sum, n) => sum + n.y, 0) / nodes.length;

  // Calculate total tension displacement for visual morphing
  const totalTension = nodes.reduce(
    (sum, n) => sum + Math.hypot(n.x - n.baseX, n.y - n.baseY),
    0
  );

  // Spring back slowly when released
  useEffect(() => {
    if (draggingId) return;
    let rafId = 0;

    const step = () => {
      setNodes((prev) => {
        let moved = false;
        const next = prev.map((n) => {
          const dx = n.baseX - n.x;
          const dy = n.baseY - n.y;
          if (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05) {
            moved = true;
            return { ...n, x: n.x + dx * 0.14, y: n.y + dy * 0.14 };
          }
          return { ...n, x: n.baseX, y: n.baseY };
        });
        return moved ? next : prev;
      });
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [draggingId]);

  const updatePointerPosition = useCallback(
    (clientX: number, clientY: number) => {
      if (!draggingId || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const px = Math.max(10, Math.min(90, ((clientX - rect.left) / rect.width) * 100));
      const py = Math.max(12, Math.min(88, ((clientY - rect.top) / rect.height) * 100));
      setNodes((prev) =>
        prev.map((n) => (n.id === draggingId ? { ...n, x: px, y: py } : n))
      );
    },
    [draggingId]
  );

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingId) return;
    updatePointerPosition(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    if (draggingId) {
      playPluck(0.9 + Math.random() * 0.4);
      setDraggingId(null);
    }
  };

  const cycleMorph = () => {
    playMorph();
    setMorphIndex((prev) => (prev + 1) % 3);
    // Give all nodes an outward elastic impulse
    setNodes((prev) =>
      prev.map((n, idx) => ({
        ...n,
        x: n.baseX + (idx % 2 === 0 ? -7 : 7),
        y: n.baseY + (idx < 2 ? -6 : 6),
      }))
    );
  };

  const lineStroke = variant === 'dark' ? '#F4F1EA' : '#141414';
  const ringRadius = 11 + Math.min(9, totalTension * 0.18);
  const morphBorderRadius =
    morphIndex === 0 ? '9999px' : morphIndex === 1 ? '18px' : '0px';

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      data-cursor="DRAG"
      className={`relative w-full h-[360px] sm:h-[420px] select-none touch-none overflow-hidden border ${
        variant === 'dark'
          ? 'border-[#F4F1EA]/15 bg-[#121216]'
          : 'border-[#141414]/15 bg-[#ECE8DF]'
      }`}
    >
      {/* Subtle architectural coordinate grid */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
      >
        <line x1="50" y1="0" x2="50" y2="100" stroke={lineStroke} strokeOpacity="0.08" strokeWidth="0.25" />
        <line x1="0" y1="50" x2="100" y2="50" stroke={lineStroke} strokeOpacity="0.08" strokeWidth="0.25" />

        {/* Outer polygon connecting all 4 nodes */}
        <polygon
          points={nodes.map((n) => `${n.x},${n.y}`).join(' ')}
          fill="none"
          stroke={lineStroke}
          strokeOpacity="0.22"
          strokeWidth="0.35"
        />

        {/* Cross-tension curved Bezier cables linking every node to the living center */}
        {nodes.map((n) => (
          <path
            key={n.id}
            d={`M ${n.x} ${n.y} Q ${(n.x + centerX) / 2} ${centerY} ${centerX} ${centerY}`}
            fill="none"
            stroke={n.id === 'motion' ? '#E63B1F' : n.id === 'type' && variant === 'dark' ? '#D9FF3F' : lineStroke}
            strokeOpacity="0.65"
            strokeWidth="0.45"
          />
        ))}

        {/* Dynamic morphing central node */}
        <circle
          cx={centerX}
          cy={centerY}
          r={ringRadius}
          fill="none"
          stroke="#E63B1F"
          strokeWidth="0.5"
          strokeDasharray={morphIndex === 1 ? '1.8 1.4' : 'none'}
        />
      </svg>

      {/* Interactive Morphing Core Button */}
      <button
        type="button"
        onClick={cycleMorph}
        style={{
          left: `${centerX}%`,
          top: `${centerY}%`,
          borderRadius: morphBorderRadius,
          transform: `translate(-50%, -50%) rotate(${morphIndex * 45 + totalTension * 0.6}deg)`,
        }}
        className="absolute z-10 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-[#E63B1F] text-[#F4F1EA] font-mono-tabular text-[10px] tracking-widest uppercase transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105 focus-visible:outline-2 focus-visible:outline-white"
        aria-label={lang === 'ru' ? 'Трансформировать узел связи' : 'Morph connection core'}
      >
        <span style={{ transform: `rotate(${-(morphIndex * 45)}deg)` }}>
          {lang === 'ru' ? 'СВЯЗЬ' : 'LINK'}
        </span>
      </button>

      {/* Draggable Node Anchors */}
      {nodes.map((node) => {
        const isDragging = draggingId === node.id;
        return (
          <button
            key={node.id}
            type="button"
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              setDraggingId(node.id);
              playPluck(1.2);
            }}
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              transform: `translate(-50%, -50%) scale(${isDragging ? 1.12 : 1})`,
            }}
            className={`absolute z-20 px-3.5 py-2 border font-mono-tabular text-xs tracking-wider cursor-grab active:cursor-grabbing transition-shadow ${
              variant === 'dark'
                ? 'bg-[#0B0B0D] border-[#F4F1EA]/30 text-[#F4F1EA] hover:border-[#D9FF3F]'
                : 'bg-[#F4F1EA] border-[#141414]/30 text-[#141414] hover:border-[#E63B1F]'
            }`}
          >
            {lang === 'ru' ? node.labelRu : node.labelEn}
          </button>
        );
      })}
    </div>
  );
}
