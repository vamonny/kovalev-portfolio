import { useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, ZoomIn } from 'lucide-react';
import { BilingualText } from '../i18n/translations';
import { useLanguage } from '../context/LanguageContext';
import { useSound } from '../context/SoundContext';
import { ScrambleText } from './ScrambleText';

export interface EncyclopediaSpread {
  chapter: string;
  pages: string;
  src: string;
  title: BilingualText;
  takeaway: BilingualText;
}

interface EncyclopediaReaderProps {
  spreads: EncyclopediaSpread[];
  pdfUrl?: string;
  accentColor?: string;
  onInspectImage: (payload: { src: string; caption: string }) => void;
}

export function EncyclopediaReader({
  spreads,
  pdfUrl,
  accentColor = '#0B3AA4',
  onInspectImage,
}: EncyclopediaReaderProps) {
  const { lang } = useLanguage();
  const { playHover, playMorph, playPluck } = useSound();
  const [activeIndex, setActiveIndex] = useState(0);

  if (!spreads.length) return null;

  const active = spreads[activeIndex] ?? spreads[0];
  const total = spreads.length;

  const goTo = (nextIdx: number) => {
    const normalized = ((nextIdx % total) + total) % total;
    if (normalized === activeIndex) return;
    playPluck(0.92 + (normalized % 6) * 0.04);
    setActiveIndex(normalized);
  };

  return (
    <section className="max-w-[1380px] mx-auto px-5 sm:px-8 py-12 sm:py-16">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <p
            style={{ color: accentColor }}
            className="font-mono-tabular text-[10px] uppercase tracking-[0.22em] mb-2 dark:!text-[#E7FA53]"
          >
            {lang === 'ru'
              ? `ИНТЕРАКТИВНАЯ КНИГА · ${total} РАЗВОРОТОВ (61 СТРАНИЦА)`
              : `INTERACTIVE ZINE · ${total} SPREADS (61 PAGES)`}
          </p>
          <h2 className="font-display font-extrabold uppercase text-2xl sm:text-4xl tracking-[-0.04em] leading-[0.95] text-[#0B0B0B] dark:text-[#EFEFE9]">
            <ScrambleText
              text={
                lang === 'ru'
                  ? 'ЛИСТАЙ ВСЕ 30 ГЛАВ ЭНЦИКЛОПЕДИИ'
                  : 'FLIP ALL 30 CHAPTER SPREADS'
              }
              triggerOnHover
              duration={360}
            />
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {pdfUrl && (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => playHover()}
              className="inline-flex items-center gap-2 px-3.5 py-2 border border-[#0B0B0B]/20 dark:border-white/20 bg-[#E5E4DC] dark:bg-[#16161B] hover:bg-[#0B0B0B] dark:hover:bg-[#E7FA53] hover:text-[#E7FA53] dark:hover:text-[#0B0B0B] font-mono-tabular text-[10px] uppercase tracking-[0.16em] transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              {lang === 'ru' ? 'ПОЛНЫЙ PDF-ОРИГИНАЛ ↗' : 'FULL PDF EDITION ↗'}
            </a>
          )}
        </div>
      </div>

      {/* Main Spread Viewport + Controls */}
      <div className="border border-[#0B0B0B]/15 dark:border-white/15 bg-[#E5E4DC] dark:bg-[#16161B]">
        {/* Top Control Bar */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-[#0B0B0B]/12 dark:border-white/12 flex flex-wrap items-center justify-between gap-4 bg-[#EFEFE9] dark:bg-[#121217]">
          <div className="flex items-center gap-3">
            <span
              style={{ backgroundColor: accentColor }}
              className="px-2.5 py-1 text-[#EFEFE9] font-mono-tabular text-[10px] font-semibold uppercase tracking-[0.16em]"
            >
              {lang === 'ru' ? `ГЛАВА ${active.chapter}` : `CH. ${active.chapter}`}
            </span>
            <span className="font-mono-tabular text-[11px] uppercase tracking-[0.14em] text-[#0B0B0B]/60 dark:text-[#EFEFE9]/65">
              {lang === 'ru' ? `СТР. ${active.pages}` : `PP. ${active.pages}`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              onMouseEnter={() => playHover()}
              aria-label={lang === 'ru' ? 'Предыдущий разворот' : 'Previous spread'}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#0B0B0B]/20 dark:border-white/20 bg-[#EFEFE9] dark:bg-[#18181F] hover:bg-[#0B0B0B] dark:hover:bg-[#E7FA53] hover:text-[#EFEFE9] dark:hover:text-[#0B0B0B] font-mono-tabular text-[10px] uppercase tracking-wider transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              {lang === 'ru' ? 'Назад' : 'Prev'}
            </button>
            <span className="font-mono-tabular text-[11px] px-2 text-[#0B0B0B]/70 dark:text-[#EFEFE9]/75 min-w-[54px] text-center">
              {String(activeIndex + 1).padStart(2, '0')} / {total}
            </span>
            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              onMouseEnter={() => playHover()}
              aria-label={lang === 'ru' ? 'Следующий разворот' : 'Next spread'}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#0B0B0B]/20 dark:border-white/20 bg-[#EFEFE9] dark:bg-[#18181F] hover:bg-[#0B0B0B] dark:hover:bg-[#E7FA53] hover:text-[#EFEFE9] dark:hover:text-[#0B0B0B] font-mono-tabular text-[10px] uppercase tracking-wider transition-colors"
            >
              {lang === 'ru' ? 'Дальше' : 'Next'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Active Spread Plate */}
        <button
          type="button"
          onClick={() => {
            playMorph();
            onInspectImage({
              src: active.src,
              caption: `${active.chapter}. ${lang === 'ru' ? active.title.ru : active.title.en} (${active.pages})`,
            });
          }}
          data-cursor={lang === 'ru' ? 'Читать крупно' : 'Read large'}
          className="group relative block w-full bg-[#1C1C20] overflow-hidden text-left"
        >
          <img
            src={active.src}
            alt={`${active.chapter}. ${lang === 'ru' ? active.title.ru : active.title.en}`}
            className="w-full h-auto block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.012]"
          />
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0B0B0B]/85 text-[#EFEFE9] font-mono-tabular text-[10px] uppercase tracking-[0.14em] opacity-0 group-hover:opacity-100 transition-opacity">
            <ZoomIn className="w-3.5 h-3.5" />
            {lang === 'ru' ? 'Открыть во весь экран' : 'Inspect fullscreen'}
          </span>
        </button>

        {/* Bottom Caption & Takeaway Bar */}
        <div className="px-4 sm:px-6 py-4 bg-[#EFEFE9] dark:bg-[#121217] border-t border-[#0B0B0B]/12 dark:border-white/12 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <p className="font-display font-bold uppercase text-lg sm:text-xl tracking-[-0.02em] text-[#0B0B0B] dark:text-[#EFEFE9]">
            {active.chapter}. {lang === 'ru' ? active.title.ru : active.title.en}
          </p>
          <p className="font-sans-body text-sm text-[#0B0B0B]/75 dark:text-[#EFEFE9]/75 italic">
            «{lang === 'ru' ? active.takeaway.ru : active.takeaway.en}»
          </p>
        </div>
      </div>

      {/* 30-Chapter Quick Index Grid */}
      <div className="mt-6">
        <p className="font-mono-tabular text-[10px] uppercase tracking-[0.2em] text-[#0B0B0B]/55 dark:text-[#EFEFE9]/55 mb-3">
          {lang === 'ru'
            ? 'ОГЛАВЛЕНИЕ · ВЫБЕРИТЕ ЛЮБОЙ РАЗВОРОТ'
            : 'INDEX · JUMP TO ANY SPREAD'}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2">
          {spreads.map((item, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={item.chapter}
                type="button"
                onClick={() => goTo(idx)}
                onMouseEnter={() => playHover()}
                aria-pressed={isActive}
                className={`p-2.5 text-left border transition-all ${
                  isActive
                    ? 'bg-[#0B0B0B] dark:bg-[#E7FA53] text-[#EFEFE9] dark:text-[#0B0B0B] border-[#0B0B0B] dark:border-[#E7FA53]'
                    : 'bg-[#E5E4DC] dark:bg-[#16161B] text-[#0B0B0B] dark:text-[#EFEFE9] border-[#0B0B0B]/12 dark:border-white/12 hover:border-[#0B0B0B] dark:hover:border-white/45'
                }`}
              >
                <div className="flex items-center justify-between gap-1 font-mono-tabular text-[9px] uppercase tracking-wider opacity-65 mb-1">
                  <span>{item.chapter}</span>
                  <span>{item.pages}</span>
                </div>
                <p className="font-sans-body text-[11px] font-semibold leading-[1.2] line-clamp-2">
                  {lang === 'ru' ? item.title.ru : item.title.en}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
