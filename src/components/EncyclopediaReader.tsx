import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, ChevronLeft, ChevronRight, Grid, ZoomIn } from 'lucide-react';
import { BilingualText } from '../i18n/translations';
import { useLanguage } from '../context/LanguageContext';
import { useSound } from '../context/SoundContext';
import { RubberBlock } from './RubberMotion';

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
  const indexGridRef = useRef<HTMLDivElement>(null);

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
    <section className="max-w-[1380px] mx-auto px-4 sm:px-8 pb-12 sm:pb-16">
      {/* Sticky Top Reader Bar (always visible when browsing any spread) */}
      <div className="sticky top-[64px] sm:top-[72px] z-30 -mx-4 sm:-mx-8 px-4 sm:px-8 py-3.5 bg-[#FAF6EE]/94 dark:bg-[#121217]/94 backdrop-blur-md border-b border-[#171512]/14 dark:border-white/14 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span
              style={{ color: accentColor }}
              className="type-sm tabular-nums font-bold dark:!text-[#F6E238] shrink-0"
            >
              {lang === 'ru' ? `Глава ${active.chapter}` : `Ch. ${active.chapter}`}
            </span>
            <span className="type-sm tabular-nums text-[#171512]/65 dark:text-[#F3EBDC]/65 shrink-0">
              {lang === 'ru' ? `Стр. ${active.pages}` : `Pp. ${active.pages}`}
            </span>
            <span className="hidden md:inline font-display font-semibold type-sm text-[#171512] dark:text-[#F3EBDC] truncate max-w-[360px]">
              · {lang === 'ru' ? active.title.ru : active.title.en}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1 p-0.5 bg-[#E5E4DC] dark:bg-[#1E1D19] rounded-[6px] type-sm tabular-nums">
              <button
                type="button"
                onClick={() => goTo(activeIndex - 1)}
                onMouseEnter={() => playHover()}
                aria-label={lang === 'ru' ? 'Предыдущий разворот' : 'Previous spread'}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[5px] hover:bg-[#0B0B0B] dark:hover:bg-[#E7FA53] hover:text-[#EFEFE9] dark:hover:text-[#0B0B0B] transition-colors duration-150"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{lang === 'ru' ? 'Назад' : 'Prev'}</span>
              </button>
              <span className="px-2.5 text-[#0B0B0B] dark:text-[#EFEFE9] font-semibold">
                {activeIndex + 1} / {total}
              </span>
              <button
                type="button"
                onClick={() => goTo(activeIndex + 1)}
                onMouseEnter={() => playHover()}
                aria-label={lang === 'ru' ? 'Следующий разворот' : 'Next spread'}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[5px] hover:bg-[#0B0B0B] dark:hover:bg-[#E7FA53] hover:text-[#EFEFE9] dark:hover:text-[#0B0B0B] transition-colors duration-150"
              >
                <span>{lang === 'ru' ? 'Дальше' : 'Next'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => indexGridRef.current?.scrollIntoView({ behavior: 'smooth' })}
              onMouseEnter={() => playHover()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#171512]/18 dark:border-white/20 hover:bg-[#0B0B0B] dark:hover:bg-[#E7FA53] hover:text-[#EFEFE9] dark:hover:text-[#0B0B0B] type-sm font-medium rounded-[6px] transition-colors duration-150 shrink-0"
            >
              <Grid className="w-3.5 h-3.5" />
              <span>{lang === 'ru' ? 'Все 30 глав' : 'All 30 chapters'}</span>
            </button>

            {pdfUrl && (
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => playHover()}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#171512]/18 dark:border-white/20 hover:bg-[#0B3AA4] hover:text-white type-sm font-medium rounded-[6px] transition-colors duration-150 shrink-0"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>PDF</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Spread Viewport with Overlay Page Arrows */}
      <RubberBlock skewFactor={0.45} driftFactor={5}>
        <div className="border border-[#171512]/16 dark:border-white/15 bg-[#EFEFE9] dark:bg-[#16161B]">
          <div className="relative bg-[#1C1C20] flex items-center justify-center">
            <button
              type="button"
              onClick={() => {
                playMorph();
                onInspectImage({
                  src: active.src,
                  caption: `${active.chapter}. ${lang === 'ru' ? active.title.ru : active.title.en} (${active.pages})`,
                });
              }}
              className="group relative block w-full overflow-hidden text-center"
            >
              <img
                src={active.src}
                alt={`${active.chapter}. ${lang === 'ru' ? active.title.ru : active.title.en}`}
                decoding="async"
                className="w-full max-h-[66vh] object-contain mx-auto block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.01]"
              />
              <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0B0B0B]/85 text-[#EFEFE9] type-sm rounded-[5px] opacity-90 group-hover:opacity-100 transition-opacity duration-150">
                <ZoomIn className="w-4 h-4" />
                <span>{lang === 'ru' ? 'Открыть крупнее' : 'Inspect'}</span>
              </span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goTo(activeIndex - 1);
              }}
              onMouseEnter={() => playHover()}
              aria-label={lang === 'ru' ? 'Предыдущий разворот' : 'Previous spread'}
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#0B0B0B]/75 hover:bg-[#0B3AA4] text-white border border-white/20 rounded-[6px] flex items-center justify-center transition-colors duration-150 backdrop-blur-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goTo(activeIndex + 1);
              }}
              onMouseEnter={() => playHover()}
              aria-label={lang === 'ru' ? 'Следующий разворот' : 'Next spread'}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#0B0B0B]/75 hover:bg-[#0B3AA4] text-white border border-white/20 rounded-[6px] flex items-center justify-center transition-colors duration-150 backdrop-blur-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="px-4 sm:px-6 py-4 bg-[#FAF6EE] dark:bg-[#121217] border-t border-[#171512]/12 dark:border-white/12 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <p className="type-heading font-display font-bold text-[#171512] dark:text-[#F3EBDC]">
              {active.chapter}. {lang === 'ru' ? active.title.ru : active.title.en}
            </p>
            <p className="type-body text-[#171512]/75 dark:text-[#F3EBDC]/75 italic">
              «{lang === 'ru' ? active.takeaway.ru : active.takeaway.en}»
            </p>
          </div>
        </div>
      </RubberBlock>

      {/* Chapter Index Matrix */}
      <div ref={indexGridRef} className="scroll-mt-36 mt-6">
        <RubberBlock skewFactor={-0.35} driftFactor={-4}>
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
                  className={`p-3 text-left border transition-colors duration-150 ${
                    isActive
                      ? 'bg-[#0B0B0B] dark:bg-[#E7FA53] text-[#EFEFE9] dark:text-[#0B0B0B] border-[#0B0B0B] dark:border-[#E7FA53]'
                      : 'bg-[#FAF6EE] dark:bg-[#181713] text-[#171512] dark:text-[#F3EBDC] border-[#171512]/12 dark:border-white/12 hover:border-[#171512] dark:hover:border-white/45'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 type-sm tabular-nums opacity-65 mb-1">
                    <span>{item.chapter}</span>
                    <span>{item.pages}</span>
                  </div>
                  <p className="type-sm font-semibold leading-snug line-clamp-2">
                    {lang === 'ru' ? item.title.ru : item.title.en}
                  </p>
                </button>
              );
            })}
          </div>
        </RubberBlock>
      </div>
    </section>
  );
}
