import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import { BilingualText } from '../i18n/translations';
import { useLanguage } from '../context/LanguageContext';
import { useSound } from '../context/SoundContext';
import { ScrambleText } from './ScrambleText';

export type BrandbookSectionKey = 'intro' | 'logo' | 'system' | 'carriers';

export interface BrandbookSlide {
  page: string;
  src: string;
  sectionKey: BrandbookSectionKey;
  sectionLabel: BilingualText;
  title: BilingualText;
  note: BilingualText;
}

interface BrandbookShowcaseProps {
  slides: BrandbookSlide[];
  accentColor: string;
  onInspectImage: (img: { src: string; caption: string }) => void;
}

type FilterSection = 'all' | BrandbookSectionKey;

export function BrandbookShowcase({
  slides,
  accentColor,
  onInspectImage,
}: BrandbookShowcaseProps) {
  const { lang, t } = useLanguage();
  const { playClick, playHover, playMorph } = useSound();

  const [sectionFilter, setSectionFilter] = useState<FilterSection>('all');
  const [activeIndex, setActiveIndex] = useState(0);

  const filterOptions: { key: FilterSection; label: string; count: number }[] = useMemo(
    () => [
      {
        key: 'all',
        label: lang === 'ru' ? 'Все слайды' : 'All Slides',
        count: slides.length,
      },
      {
        key: 'intro',
        label: lang === 'ru' ? 'Концепция' : 'Concept',
        count: slides.filter((s) => s.sectionKey === 'intro').length,
      },
      {
        key: 'logo',
        label: lang === 'ru' ? 'Лого и сетка' : 'Logo & Grid',
        count: slides.filter((s) => s.sectionKey === 'logo').length,
      },
      {
        key: 'system',
        label: lang === 'ru' ? 'Шрифт и паттерн' : 'Type & Pattern',
        count: slides.filter((s) => s.sectionKey === 'system').length,
      },
      {
        key: 'carriers',
        label: lang === 'ru' ? 'Носители' : 'Brand Carriers',
        count: slides.filter((s) => s.sectionKey === 'carriers').length,
      },
    ],
    [lang, slides]
  );

  const visibleSlides = useMemo(() => {
    if (sectionFilter === 'all') return slides;
    return slides.filter((s) => s.sectionKey === sectionFilter);
  }, [slides, sectionFilter]);

  const safeIndex = Math.min(activeIndex, Math.max(0, visibleSlides.length - 1));
  const currentSlide = visibleSlides[safeIndex] || slides[0];

  const handleSelectFilter = (next: FilterSection) => {
    playMorph();
    setSectionFilter(next);
    setActiveIndex(0);
  };

  const stepSlide = (delta: number) => {
    if (visibleSlides.length === 0) return;
    playClick();
    setActiveIndex((prev) => (prev + delta + visibleSlides.length) % visibleSlides.length);
  };

  if (!currentSlide) return null;

  return (
    <section className="max-w-[1380px] mx-auto px-5 sm:px-8 py-10 sm:py-16">
      <div className="bg-[#120E14] text-[#F4F1EA] border border-[#0B0B0B]/15 dark:border-white/15 p-5 sm:p-8 lg:p-10 shadow-[0_28px_70px_-28px_rgba(11,11,11,0.45)]">
        {/* Top Bar: Header + Section Filters */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-white/12">
          <div>
            <p
              style={{ color: accentColor }}
              className="font-mono-tabular text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-semibold mb-2"
            >
              <ScrambleText
                text={
                  lang === 'ru'
                    ? `ПОЛНЫЙ БРЕНДБУК · ${slides.length} СТРАНИЦ`
                    : `COMPLETE BRAND GUIDELINES · ${slides.length} SLIDES`
                }
                triggerKey={`bb-hdr-${lang}`}
                duration={320}
              />
            </p>
            <h2 className="font-display font-bold uppercase tracking-[-0.03em] leading-[0.95] text-2xl sm:text-4xl text-[#F4F1EA]">
              {lang === 'ru' ? 'Интерактивный просмотр гайдлайна' : 'Interactive Brandbook Reader'}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {filterOptions.map((opt) => {
              const active = sectionFilter === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => handleSelectFilter(opt.key)}
                  onMouseEnter={() => playHover()}
                  aria-pressed={active}
                  style={
                    active
                      ? { backgroundColor: accentColor, borderColor: accentColor, color: '#FFFFFF' }
                      : undefined
                  }
                  className={`px-3 py-1.5 text-[10px] sm:text-[11px] font-mono-tabular font-semibold uppercase tracking-[0.06em] border transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                    active
                      ? ''
                      : 'border-white/15 text-white/75 hover:border-white/45 hover:text-white'
                  }`}
                >
                  <span>{opt.label}</span>
                  <span className="opacity-65">{String(opt.count).padStart(2, '0')}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main 16:9 Stage */}
        <div className="mt-6 sm:mt-8">
          <div className="relative bg-[#0B090C] border border-white/12 overflow-hidden group">
            <button
              type="button"
              onClick={() =>
                onInspectImage({
                  src: currentSlide.src,
                  caption: `${currentSlide.page} — ${t(currentSlide.title)}`,
                })
              }
              data-cursor={lang === 'ru' ? 'Увеличить' : 'Inspect'}
              className="block w-full text-left"
            >
              <div className="w-full aspect-[16/9] overflow-hidden bg-[#140F16]">
                <img
                  src={currentSlide.src}
                  alt={t(currentSlide.title)}
                  decoding="async"
                  className="w-full h-full object-contain transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.015]"
                />
              </div>
            </button>

            {/* Stage Overlay Controls */}
            <button
              type="button"
              onClick={() => stepSlide(-1)}
              onMouseEnter={() => playHover()}
              aria-label={lang === 'ru' ? 'Предыдущий слайд' : 'Previous slide'}
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#0B0B0B]/75 hover:bg-[#E6007E] text-white border border-white/20 flex items-center justify-center transition-colors backdrop-blur-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => stepSlide(1)}
              onMouseEnter={() => playHover()}
              aria-label={lang === 'ru' ? 'Следующий слайд' : 'Next slide'}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#0B0B0B]/75 hover:bg-[#E6007E] text-white border border-white/20 flex items-center justify-center transition-colors backdrop-blur-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() =>
                onInspectImage({
                  src: currentSlide.src,
                  caption: `${currentSlide.page} — ${t(currentSlide.title)}`,
                })
              }
              aria-label={lang === 'ru' ? 'Открыть во весь экран' : 'Inspect fullscreen'}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 px-3 py-1.5 bg-[#0B0B0B]/75 hover:bg-[#E6007E] text-white border border-white/20 text-[10px] font-mono-tabular uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors backdrop-blur-sm"
            >
              <Expand className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{lang === 'ru' ? 'Крупнее' : 'Inspect'}</span>
            </button>
          </div>

          {/* Caption + Slide Counter */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 font-mono-tabular text-[10px] uppercase tracking-[0.16em] text-white/55 mb-1">
                <span style={{ color: accentColor }} className="font-semibold">
                  {t(currentSlide.sectionLabel)}
                </span>
                <span aria-hidden="true">·</span>
                <span>{currentSlide.page}</span>
              </div>
              <h3 className="font-display font-bold uppercase text-lg sm:text-xl tracking-tight text-white">
                {t(currentSlide.title)}
              </h3>
              <p className="font-sans-body text-xs sm:text-sm text-white/70 mt-1 max-w-3xl">
                {t(currentSlide.note)}
              </p>
            </div>

            <div className="font-mono-tabular text-xs sm:text-sm tracking-[0.14em] text-white/75 whitespace-nowrap shrink-0">
              {String(safeIndex + 1).padStart(2, '0')} / {String(visibleSlides.length).padStart(2, '0')}
            </div>
          </div>

          {/* Scrollable Thumbnail Strip */}
          <div className="mt-5 grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-9 gap-2">
            {visibleSlides.map((slide, idx) => {
              const isCurrent = idx === safeIndex;
              return (
                <button
                  key={slide.src}
                  type="button"
                  onClick={() => {
                    playClick();
                    setActiveIndex(idx);
                  }}
                  onMouseEnter={() => playHover()}
                  style={isCurrent ? { borderColor: accentColor } : undefined}
                  className={`group text-left border transition-all overflow-hidden bg-[#18131B] ${
                    isCurrent
                      ? 'ring-1 ring-[#E6007E] opacity-100'
                      : 'border-white/12 opacity-60 hover:opacity-100 hover:border-white/40'
                  }`}
                >
                  <div className="aspect-[16/9] w-full overflow-hidden bg-[#120E14]">
                    <img
                      src={slide.src}
                      alt={t(slide.title)}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="px-1.5 py-1 flex items-center justify-between font-mono-tabular text-[9px] uppercase tracking-wider text-white/75">
                    <span>{slide.page}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
