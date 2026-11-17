import React, { useState, useRef } from 'react';
import { MoveHorizontal, Expand } from 'lucide-react';
import { BilingualText } from '../i18n/translations';
import { useLanguage } from '../context/LanguageContext';
import { useSound } from '../context/SoundContext';
import { ScrambleText } from './ScrambleText';

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
    <section className="max-w-[1380px] mx-auto px-5 sm:px-8 py-12 sm:py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b border-[#0B0B0B]/12 dark:border-white/12 mb-6">
        <div>
          <p className="font-mono-tabular text-[10px] uppercase tracking-[0.2em] text-[#D61914] dark:text-[#E7FA53] mb-2">
            <ScrambleText
              text={lang === 'ru' ? 'ТРАНСФОРМАЦИЯ · ДО И ПОСЛЕ' : 'TRANSFORMATION · BEFORE & AFTER'}
              triggerOnHover
              duration={320}
            />
          </p>
          <h2 className="font-display font-extrabold uppercase tracking-[-0.04em] leading-[0.9] text-[clamp(1.75rem,3.6vw,3rem)] text-[#0B0B0B] dark:text-[#EFEFE9]">
            {lang === 'ru' ? 'Сравните старый и новый сайт' : 'Drag to compare old vs. redesign'}
          </h2>
        </div>

        {/* Pair selector tabs */}
        <div className="flex flex-wrap gap-2">
          {pairs.map((pair, idx) => {
            const isSelected = idx === activeIdx;
            return (
              <button
                key={pair.id}
                type="button"
                onClick={() => {
                  playMorph();
                  setActiveIdx(idx);
                  setSplitPct(50);
                }}
                onMouseEnter={() => playHover()}
                className={`px-3 py-1.5 text-[11px] font-sans-body font-semibold uppercase tracking-[-0.01em] border transition-colors whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-[#0B0B0B] dark:bg-[#E7FA53] text-[#EFEFE9] dark:text-[#0B0B0B] border-[#0B0B0B] dark:border-[#E7FA53]'
                    : 'bg-transparent text-[#0B0B0B]/70 dark:text-[#EFEFE9]/75 border-[#0B0B0B]/18 dark:border-white/18 hover:border-[#0B0B0B] dark:hover:border-white/50'
                }`}
              >
                {t(pair.label)}
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
        data-cursor={lang === 'ru' ? 'Тяните' : 'Drag'}
        className="relative w-full aspect-[16/9] overflow-hidden border border-[#0B0B0B]/15 dark:border-white/15 bg-[#0B0B0B] select-none touch-none cursor-ew-resize"
      >
        {/* Base Layer: AFTER */}
        <img
          src={active.afterSrc}
          alt={`${t(active.label)} — ${lang === 'ru' ? 'После' : 'After'}`}
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover object-top"
        />

        {/* Overlay Layer: BEFORE clipped smoothly */}
        <div
          style={{
            clipPath: `inset(0 ${100 - splitPct}% 0 0)`,
          }}
          className="absolute inset-0 will-change-[clip-path]"
        >
          <img
            src={active.beforeSrc}
            alt={`${t(active.label)} — ${lang === 'ru' ? 'До' : 'Before'}`}
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
        </div>

        {/* Corner State Badges */}
        <span className="pointer-events-none absolute top-3 left-3 z-10 px-2.5 py-1 bg-[#0B0B0B]/85 text-[#EFEFE9] font-mono-tabular text-[10px] font-semibold uppercase tracking-[0.14em]">
          {lang === 'ru' ? 'ДО' : 'BEFORE'} · {Math.round(splitPct)}%
        </span>
        <span
          style={{ backgroundColor: accentColor }}
          className="pointer-events-none absolute top-3 right-3 z-10 px-2.5 py-1 text-[#EFEFE9] font-mono-tabular text-[10px] font-semibold uppercase tracking-[0.14em]"
        >
          {lang === 'ru' ? 'ПОСЛЕ' : 'AFTER'} · {Math.round(100 - splitPct)}%
        </span>

        {/* Split Line + Liquid Glass Handle */}
        <div
          style={{ left: `${splitPct}%` }}
          className="pointer-events-none absolute inset-y-0 w-[2px] -translate-x-1/2 bg-[#EFEFE9] shadow-[0_0_12px_rgba(11,11,11,0.55)] z-20"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-[14px] liquid-glass-light flex items-center justify-center text-[#0B0B0B]">
            <MoveHorizontal className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Caption Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="p-4 sm:p-5 bg-[#E5E4DC] dark:bg-[#16161B] border border-[#0B0B0B]/12 dark:border-white/12 flex items-start justify-between gap-4">
          <div>
            <p className="font-mono-tabular text-[10px] uppercase tracking-[0.18em] text-[#0B0B0B]/55 dark:text-[#EFEFE9]/55 mb-1.5">
              {lang === 'ru' ? 'БЫЛО (ДО)' : 'PREVIOUS (BEFORE)'}
            </p>
            <p className="text-sm text-[#0B0B0B]/85 dark:text-[#EFEFE9]/85 leading-relaxed">{t(active.beforeNote)}</p>
          </div>
          {onInspectImage && (
            <button
              type="button"
              onClick={() =>
                onInspectImage({
                  src: active.beforeSrc,
                  caption: `${lang === 'ru' ? 'ДО' : 'BEFORE'} — ${t(active.label)}`,
                })
              }
              aria-label={lang === 'ru' ? 'Открыть скрин ДО' : 'Inspect BEFORE screen'}
              className="p-2 border border-[#0B0B0B]/15 dark:border-white/18 hover:bg-[#0B0B0B] dark:hover:bg-[#E7FA53] hover:text-[#EFEFE9] dark:hover:text-[#0B0B0B] transition-colors shrink-0"
            >
              <Expand className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="p-4 sm:p-5 bg-[#0B0B0B] dark:bg-[#1A1A24] text-[#EFEFE9] border border-[#0B0B0B] dark:border-[#E7FA53]/30 flex items-start justify-between gap-4">
          <div>
            <p
              style={{ color: '#E7FA53' }}
              className="font-mono-tabular text-[10px] uppercase tracking-[0.18em] mb-1.5"
            >
              {lang === 'ru' ? 'СТАЛО (ПОСЛЕ)' : 'REDESIGN (AFTER)'}
            </p>
            <p className="text-sm text-[#EFEFE9]/90 leading-relaxed">{t(active.afterNote)}</p>
          </div>
          {onInspectImage && (
            <button
              type="button"
              onClick={() =>
                onInspectImage({
                  src: active.afterSrc,
                  caption: `${lang === 'ru' ? 'ПОСЛЕ' : 'AFTER'} — ${t(active.label)}`,
                })
              }
              aria-label={lang === 'ru' ? 'Открыть скрин ПОСЛЕ' : 'Inspect AFTER screen'}
              className="p-2 border border-white/20 hover:bg-[#E7FA53] hover:text-[#0B0B0B] transition-colors shrink-0"
            >
              <Expand className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Extra Curated Exhibition Plates (After modules, Maps, Lead form, GOST mode) */}
      {extraPlates.length > 0 && (
        <div className="mt-10 pt-8 border-t border-[#0B0B0B]/12 dark:border-white/12">
          <p className="font-mono-tabular text-[10px] uppercase tracking-[0.2em] text-[#D61914] dark:text-[#E7FA53] mb-5">
            {lang === 'ru'
              ? 'ЭКРАНЫ СИСТЕМЫ · ФОРМА ЗАЯВКИ, КАРТА И ГОСТ ДЛЯ СЛАБОВИДЯЩИХ'
              : 'SYSTEM SCREENS · BOOKING FLOW, MAP & ACCESSIBILITY MODE'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {extraPlates.map((plate, i) => (
              <button
                key={`${plate.tag}-${i}`}
                type="button"
                onClick={() =>
                  onInspectImage?.({
                    src: plate.src,
                    caption: `${plate.tag} — ${t(plate.caption)}`,
                  })
                }
                onMouseEnter={() => playHover()}
                data-cursor={lang === 'ru' ? 'Увеличить' : 'Inspect'}
                className="group text-left bg-[#E5E4DC] dark:bg-[#16161B] border border-[#0B0B0B]/12 dark:border-white/12 overflow-hidden transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1"
              >
                <div className="aspect-[16/10] w-full overflow-hidden bg-[#0B0B0B]">
                  <img
                    src={plate.src}
                    alt={t(plate.caption)}
                    className="w-full h-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-[1.04]"
                  />
                </div>
                <div className="p-3.5">
                  <p className="font-mono-tabular text-[10px] uppercase tracking-[0.16em] text-[#D61914] dark:text-[#E7FA53] mb-1">
                    {plate.tag}
                  </p>
                  <p className="text-xs sm:text-sm font-medium text-[#0B0B0B] dark:text-[#EFEFE9] leading-snug">
                    {t(plate.caption)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
