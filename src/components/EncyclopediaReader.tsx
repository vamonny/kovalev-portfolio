import { useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, ZoomIn } from 'lucide-react';
import { BilingualText } from '../i18n/translations';
import { useLanguage } from '../context/LanguageContext';
import { useSound } from '../context/SoundContext';

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
    <section className="max-w-[1380px] mx-auto px-4 sm:px-8 py-12 sm:py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <h2 className="type-heading font-display font-bold text-[#171512] dark:text-[#F3EBDC]">
          {lang === 'ru'
            ? 'Листайте развороты всех 30 глав'
            : 'Browse all 30 chapter spreads'}
        </h2>

        {pdfUrl && (
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => playHover()}
            className="inline-flex items-center gap-2 px-4 py-2 border border-[#171512]/20 dark:border-white/20 hover:bg-[#0B3AA4] hover:text-white type-sm font-medium rounded-[6px] transition-colors duration-150 shrink-0"
          >
            <BookOpen className="w-4 h-4" />
            <span>{lang === 'ru' ? 'Скачать полный PDF' : 'Open full PDF'}</span>
          </a>
        )}
      </div>

      {/* Main Spread Viewport */}
      <div className="border border-[#171512]/16 dark:border-white/15 bg-[#EFEFE9] dark:bg-[#16161B]">
        <div className="px-4 sm:px-6 py-3.5 border-b border-[#171512]/12 dark:border-white/12 flex flex-wrap items-center justify-between gap-4 bg-[#FAF6EE] dark:bg-[#121217]">
          <div className="flex items-center gap-3 type-sm tabular-nums">
            <span style={{ color: accentColor }} className="font-semibold dark:text-[#F6E238]">
              {lang === 'ru' ? `Глава ${active.chapter}` : `Chapter ${active.chapter}`}
            </span>
            <span className="opacity-65">
              {lang === 'ru' ? `Стр. ${active.pages}` : `Pp. ${active.pages}`}
            </span>
          </div>

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
            <span className="px-2.5 text-[#0B0B0B]/75 dark:text-[#EFEFE9]/75 font-medium">
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
        </div>

        <button
          type="button"
          onClick={() => {
            playMorph();
            onInspectImage({
              src: active.src,
              caption: `${active.chapter}. ${lang === 'ru' ? active.title.ru : active.title.en} (${active.pages})`,
            });
          }}
          className="group relative block w-full bg-[#1C1C20] overflow-hidden text-left"
        >
          <img
            src={active.src}
            alt={`${active.chapter}. ${lang === 'ru' ? active.title.ru : active.title.en}`}
            decoding="async"
            className="w-full h-auto block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.01]"
          />
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0B0B0B]/85 text-[#EFEFE9] type-sm rounded-[5px] opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <ZoomIn className="w-4 h-4" />
            <span>{lang === 'ru' ? 'Открыть крупнее' : 'Inspect'}</span>
          </span>
        </button>

        <div className="px-4 sm:px-6 py-4 bg-[#FAF6EE] dark:bg-[#121217] border-t border-[#171512]/12 dark:border-white/12 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <p className="type-heading font-display font-bold text-[#171512] dark:text-[#F3EBDC]">
            {active.chapter}. {lang === 'ru' ? active.title.ru : active.title.en}
          </p>
          <p className="type-body text-[#171512]/75 dark:text-[#F3EBDC]/75 italic">
            «{lang === 'ru' ? active.takeaway.ru : active.takeaway.en}»
          </p>
        </div>
      </div>

      {/* Chapter Index Matrix */}
      <div className="mt-6">
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
      </div>
    </section>
  );
}
