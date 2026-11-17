import React, { useState, useRef } from 'react';
import { MoveHorizontal, Expand } from 'lucide-react';
import { BilingualText } from '../i18n/translations';
import { useLanguage } from '../context/LanguageContext';
import { useSound } from '../context/SoundContext';

export interface BeforeAfterPair {
  id: string;
  label: BilingualText;
  beforeSrc: string;
  afterSrc: string;
  beforeNote: BilingualText;
  afterNote: BilingualText;
}

export interface ExtraPlate {
  src: string;
  tag: string;
  caption: BilingualText;
}

interface BeforeAfterShowcaseProps {
  pairs: BeforeAfterPair[];
  extraPlates?: ExtraPlate[];
  accentColor?: string;
  onInspectImage?: (img: { src: string; caption: string }) => void;
}

export function BeforeAfterShowcase({
  pairs,
  extraPlates = [],
  accentColor = '#155EEF',
  onInspectImage,
}: BeforeAfterShowcaseProps) {
  const { lang, t } = useLanguage();
  const { playMorph, playHover, playPluck } = useSound();

  const [activeIdx, setActiveIdx] = useState(0);
  const [splitPct, setSplitPct] = useState(50);
  const draggingRef = useRef(false);
  const stageRef = useRef<HTMLDivElement>(null);

  const active = pairs[activeIdx] || pairs[0];
  if (!active) return null;

  const updateFromClientX = (clientX: number) => {
    const el = stageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setSplitPct(Math.max(4, Math.min(96, pct)));
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
    playPluck(1.1);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    updateFromClientX(e.clientX);
  };

  const handlePointerUp = () => {
    if (draggingRef.current) {
      draggingRef.current = false;
      playPluck(0.95);
    }
  };

  return (
    <section className="max-w-[1380px] mx-auto px-4 sm:px-8 py-12 sm:py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b border-[#0B0B0B]/12 dark:border-white/12 mb-6">
        <h2 className="type-heading font-display font-bold text-[#0B0B0B] dark:text-[#EFEFE9]">
          {lang === 'ru' ? 'Сравните старый и новый сайт' : 'Compare old and new interface'}
        </h2>

        <div
          role="tablist"
          aria-label={lang === 'ru' ? 'Экраны для сравнения' : 'Comparison screens'}
          className="inline-flex flex-wrap items-center gap-1 p-1 bg-[#E5E4DC] dark:bg-[#16161B] rounded-[6px]"
        >
          {pairs.map((pair, idx) => {
            const isSelected = idx === activeIdx;
            return (
              <button
                key={pair.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => {
                  playMorph();
                  setActiveIdx(idx);
                  setSplitPct(50);
                }}
                onMouseEnter={() => playHover()}
                className={`px-3 py-1.5 rounded-[5px] type-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-[#0B0B0B] dark:bg-[#E7FA53] text-[#EFEFE9] dark:text-[#0B0B0B] font-semibold'
                    : 'text-[#0B0B0B]/70 dark:text-[#EFEFE9]/75 hover:text-[#0B0B0B] dark:hover:text-white'
                }`}
              >
                {t(pair.label).replace(/^\d+\s*·\s*/, '')}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Split Slider Stage */}
      <div
        ref={stageRef}
        role="slider"
        tabIndex={0}
        aria-label={lang === 'ru' ? 'Сравнение До и После' : 'Before and After comparison slider'}
        aria-valuemin={4}
        aria-valuemax={96}
        aria-valuenow={Math.round(splitPct)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') setSplitPct((p) => Math.max(4, p - 6));
          if (e.key === 'ArrowRight') setSplitPct((p) => Math.min(96, p + 6));
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative w-full aspect-[16/9] overflow-hidden border border-[#0B0B0B]/14 dark:border-white/14 bg-[#0B0B0B] select-none touch-none cursor-ew-resize"
      >
        <img
          src={active.afterSrc}
          alt={`${t(active.label)} (${lang === 'ru' ? 'После' : 'After'})`}
          draggable={false}
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />

        <div
          style={{ clipPath: `inset(0 ${100 - splitPct}% 0 0)` }}
          className="absolute inset-0 will-change-[clip-path]"
        >
          <img
            src={active.beforeSrc}
            alt={`${t(active.label)} (${lang === 'ru' ? 'До' : 'Before'})`}
            draggable={false}
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
        </div>

        <span className="pointer-events-none absolute top-3 left-3 z-10 px-2.5 py-1 bg-[#0B0B0B]/85 text-[#EFEFE9] type-sm tabular-nums font-medium">
          {lang === 'ru' ? 'До' : 'Before'} · {Math.round(splitPct)}%
        </span>
        <span
          style={{ backgroundColor: accentColor }}
          className="pointer-events-none absolute top-3 right-3 z-10 px-2.5 py-1 text-[#EFEFE9] type-sm tabular-nums font-medium"
        >
          {lang === 'ru' ? 'После' : 'After'} · {Math.round(100 - splitPct)}%
        </span>

        <div
          style={{ left: `${splitPct}%` }}
          className="pointer-events-none absolute inset-y-0 w-[2px] -translate-x-1/2 bg-[#EFEFE9] shadow-[0_0_12px_rgba(11,11,11,0.55)] z-20"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-[12px] liquid-glass-light flex items-center justify-center text-[#0B0B0B]">
            <MoveHorizontal className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Caption Comparison Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="p-5 bg-[#E5E4DC]/80 dark:bg-[#16161B] border border-[#0B0B0B]/12 dark:border-white/12 flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <h3 className="type-sm font-semibold text-[#0B0B0B]/65 dark:text-[#EFEFE9]/65">
              {lang === 'ru' ? 'Было' : 'Before'}
            </h3>
            <p className="type-body text-[#0B0B0B]/85 dark:text-[#EFEFE9]/85">{t(active.beforeNote)}</p>
          </div>
          {onInspectImage && (
            <button
              type="button"
              onClick={() =>
                onInspectImage({
                  src: active.beforeSrc,
                  caption: `${lang === 'ru' ? 'До' : 'Before'}: ${t(active.label)}`,
                })
              }
              aria-label={lang === 'ru' ? 'Увеличить скриншот До' : 'Inspect Before screenshot'}
              className="p-2 border border-[#0B0B0B]/15 dark:border-white/18 hover:bg-[#0B0B0B] dark:hover:bg-[#E7FA53] hover:text-[#EFEFE9] dark:hover:text-[#0B0B0B] transition-colors duration-150 shrink-0 rounded-[5px]"
            >
              <Expand className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="p-5 bg-[#0B0B0B] dark:bg-[#1A1A24] text-[#EFEFE9] border border-[#0B0B0B] dark:border-[#E7FA53]/30 flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <h3 className="type-sm font-semibold text-[#E7FA53]">
              {lang === 'ru' ? 'Стало' : 'After'}
            </h3>
            <p className="type-body text-[#EFEFE9]/90">{t(active.afterNote)}</p>
          </div>
          {onInspectImage && (
            <button
              type="button"
              onClick={() =>
                onInspectImage({
                  src: active.afterSrc,
                  caption: `${lang === 'ru' ? 'После' : 'After'}: ${t(active.label)}`,
                })
              }
              aria-label={lang === 'ru' ? 'Увеличить скриншот После' : 'Inspect After screenshot'}
              className="p-2 border border-white/20 hover:bg-[#E7FA53] hover:text-[#0B0B0B] transition-colors duration-150 shrink-0 rounded-[5px]"
            >
              <Expand className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Extra Exhibition Plates */}
      {extraPlates.length > 0 && (
        <div className="mt-10 pt-8 border-t border-[#0B0B0B]/12 dark:border-white/12">
          <h3 className="type-heading font-display font-bold mb-5 text-[#0B0B0B] dark:text-[#EFEFE9]">
            {lang === 'ru'
              ? 'Дополнительные экраны системы'
              : 'Additional system screens'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {extraPlates.map((plate, i) => (
              <button
                key={`${plate.tag}-${i}`}
                type="button"
                onClick={() =>
                  onInspectImage?.({
                    src: plate.src,
                    caption: `${plate.tag}: ${t(plate.caption)}`,
                  })
                }
                onMouseEnter={() => playHover()}
                className="group text-left bg-[#E5E4DC]/80 dark:bg-[#16161B] border border-[#0B0B0B]/12 dark:border-white/12 overflow-hidden transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5"
              >
                <div className="aspect-[16/10] w-full overflow-hidden bg-[#0B0B0B]">
                  <img
                    src={plate.src}
                    alt={t(plate.caption)}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-top transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-4">
                  <p className="type-sm text-[#0B0B0B] dark:text-[#EFEFE9]">{t(plate.caption)}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
