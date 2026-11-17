import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import { BilingualText } from '../i18n/translations';
import { useLanguage } from '../context/LanguageContext';
import { useSound } from '../context/SoundContext';
import { RubberBlock } from './RubberMotion';

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
        label: lang === 'ru' ? 'Все слайды' : 'All slides',
        count: slides.length,
      },
      {
        key: 'intro',
        label: lang === 'ru' ? 'Концепция' : 'Concept',
        count: slides.filter((s) => s.sectionKey === 'intro').length,
      },
      {
        key: 'logo',
        label: lang === 'ru' ? 'Лого и сетка' : 'Logo & grid',
        count: slides.filter((s) => s.sectionKey === 'logo').length,
      },
      {
        key: 'system',
        label: lang === 'ru' ? 'Шрифт и паттерн' : 'Type & pattern',
        count: slides.filter((s) => s.sectionKey === 'system').length,
      },
      {
        key: 'carriers',
        label: lang === 'ru' ? 'Носители' : 'Brand carriers',
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
    <section className="max-w-[1380px] mx-auto px-4 sm:px-8 py-12 sm:py-16">
      <div className="bg-[#120E14] text-[#F4F1EA] border border-white/12 px-5 pb-5 sm:px-8 sm:pb-8 lg:px-10 lg:pb-10 shadow-[0_28px_70px_-28px_rgba(11,11,11,0.45)]">
        {/* Sticky Top Bar: Header + Connected Section Filter */}
        <div className="sticky top-[64px] sm:top-[72px] z-30 -mx-5 sm:-mx-8 lg:-mx-10 px-5 sm:px-8 lg:px-10 py-4 bg-[#120E14]/94 backdrop-blur-md flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/12">
          <div className="flex items-center gap-3">
            <h2 className="type-body sm:type-heading font-display font-bold text-[#F4F1EA]">
              {lang === 'ru' ? 'Интерактивный гайдлайн' : 'Interactive brandbook'}
            </h2>
            <span className="font-mono-tabular type-sm text-white/65">
              {String(safeIndex + 1).padStart(2, '0')} / {String(visibleSlides.length).padStart(2, '0')}
            </span>
          </div>

          <div
            role="tablist"
            aria-label={lang === 'ru' ? 'Разделы брендбука' : 'Brandbook sections'}
            className="flex items-center gap-1 p-1 bg-white/[0.06] rounded-[6px] overflow-x-auto no-scrollbar max-w-full"
          >
            {filterOptions.map((opt) => {
              const active = sectionFilter === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => handleSelectFilter(opt.key)}
                  onMouseEnter={() => playHover()}
                  style={
                    active
                      ? { backgroundColor: accentColor, color: '#FFFFFF' }
                      : undefined
                  }
                  className={`px-3 py-1.5 rounded-[5px] type-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                    active ? 'font-semibold' : 'text-white/75 hover:text-white'
                  }`}
                >
                  <span>{opt.label}</span>
                  <span className="font-mono-tabular opacity-70">{opt.count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main 16:9 Stage */}
        <RubberBlock skewFactor={0.45} driftFactor={5} className="mt-6 sm:mt-8">
          <div className="relative bg-[#0B090C] border border-white/12 overflow-hidden group">
            <button
              type="button"
              onClick={() =>
                onInspectImage({
                  src: currentSlide.src,
                  caption: `${currentSlide.page} · ${t(currentSlide.title)}`,
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

            <button
              type="button"
              onClick={() => stepSlide(-1)}
              onMouseEnter={() => playHover()}
              aria-label={lang === 'ru' ? 'Предыдущий слайд' : 'Previous slide'}
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#0B0B0B]/75 hover:bg-[#E6007E] text-white border border-white/20 flex items-center justify-center transition-colors duration-150 backdrop-blur-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => stepSlide(1)}
              onMouseEnter={() => playHover()}
              aria-label={lang === 'ru' ? 'Следующий слайд' : 'Next slide'}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#0B0B0B]/75 hover:bg-[#E6007E] text-white border border-white/20 flex items-center justify-center transition-colors duration-150 backdrop-blur-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() =>
                onInspectImage({
                  src: currentSlide.src,
                  caption: `${currentSlide.page} · ${t(currentSlide.title)}`,
                })
              }
              aria-label={lang === 'ru' ? 'Открыть во весь экран' : 'Inspect fullscreen'}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 px-3 py-1.5 bg-[#0B0B0B]/75 hover:bg-[#E6007E] text-white border border-white/20 type-sm inline-flex items-center gap-1.5 transition-colors duration-150 backdrop-blur-sm"
            >
              <Expand className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{lang === 'ru' ? 'Крупнее' : 'Inspect'}</span>
            </button>
          </div>

          {/* Caption + Slide Counter */}
          <div className="mt-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 type-sm text-white/60 mb-1.5">
                <span style={{ color: accentColor }} className="font-medium">
                  {t(currentSlide.sectionLabel)}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-tabular">{currentSlide.page}</span>
              </div>
              <h3 className="type-heading font-display font-bold text-white">
                {t(currentSlide.title)}
              </h3>
              <p className="type-body text-white/75 mt-1.5 max-w-[65ch] leading-relaxed">
                {t(currentSlide.note)}
              </p>
            </div>

            <div className="font-mono-tabular type-sm text-white/75 whitespace-nowrap shrink-0">
              {String(safeIndex + 1).padStart(2, '0')} / {String(visibleSlides.length).padStart(2, '0')}
            </div>
          </div>

          {/* Thumbnail Strip */}
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
                  className={`group text-left border transition-[border-color,opacity] duration-200 overflow-hidden bg-[#18131B] ${
                    isCurrent
                      ? 'ring-1 ring-[#E6007E] opacity-100'
                      : 'border-white/12 opacity-65 hover:opacity-100 hover:border-white/40'
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
                  <div className="px-2 py-1.5 flex items-center justify-between font-mono-tabular text-[13px] text-white/80">
                    <span>{slide.page}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </RubberBlock>
      </div>
    </section>
  );
}
