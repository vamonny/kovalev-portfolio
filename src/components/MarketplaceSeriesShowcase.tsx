import { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { BilingualText } from '../i18n/translations';
import { useLanguage } from '../context/LanguageContext';
import { useSound } from '../context/SoundContext';
import { ResilientImage } from './ResilientImage';
import { RubberBlock } from './RubberMotion';

export interface MarketplaceCardSlide {
  src: string;
  label: BilingualText;
}

export interface MarketplaceSeriesItem {
  id: string;
  code: string;
  name: BilingualText;
  productType: BilingualText;
  marketplaceTag: string;
  palette: string[];
  typographyLogic: BilingualText;
  hierarchyNote: BilingualText;
  spreadImage?: {
    src: string;
    caption: BilingualText;
  };
  slides: MarketplaceCardSlide[];
}

interface MarketplaceSeriesShowcaseProps {
  series: MarketplaceSeriesItem[];
  accentColor?: string;
  onInspectImage: (payload: { src: string; caption: string }) => void;
}

export function MarketplaceSeriesShowcase({
  series,
  accentColor = '#E7FA53',
  onInspectImage,
}: MarketplaceSeriesShowcaseProps) {
  const { lang, t } = useLanguage();
  const { playHover, playMorph, playPluck } = useSound();
  const [activeIndex, setActiveIndex] = useState(0);

  if (!series.length) return null;

  const active = series[activeIndex] ?? series[0];

  const handleSelect = (idx: number) => {
    const normalized = ((idx % series.length) + series.length) % series.length;
    if (normalized === activeIndex) return;
    playMorph();
    setActiveIndex(normalized);
  };

  return (
    <section className="max-w-[1380px] mx-auto px-4 sm:px-8 pb-12 sm:pb-16">
      {/* Sticky Top Series Switcher Bar (always visible while viewing cards) */}
      <div className="sticky top-[64px] sm:top-[72px] z-30 -mx-4 sm:-mx-8 px-4 sm:px-8 py-3.5 bg-[#12131A]/94 backdrop-blur-md border-b border-white/12 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center justify-between lg:justify-start gap-3">
            <h2 className="font-display font-bold type-body sm:type-heading text-white">
              {lang === 'ru' ? 'Серии карточек' : 'Product series'}
            </h2>
            <div className="inline-flex items-center gap-1 bg-white/[0.08] p-0.5 rounded-[6px]">
              <button
                type="button"
                onClick={() => handleSelect(activeIndex - 1)}
                onMouseEnter={() => playHover()}
                aria-label={lang === 'ru' ? 'Предыдущий товар' : 'Previous product'}
                className="w-7 h-7 rounded-[4px] flex items-center justify-center text-white/80 hover:bg-[#E7FA53] hover:text-[#0B0B0B] transition-colors duration-150"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 type-sm tabular-nums font-semibold text-white">
                {activeIndex + 1} / {series.length}
              </span>
              <button
                type="button"
                onClick={() => handleSelect(activeIndex + 1)}
                onMouseEnter={() => playHover()}
                aria-label={lang === 'ru' ? 'Следующий товар' : 'Next product'}
                className="w-7 h-7 rounded-[4px] flex items-center justify-center text-white/80 hover:bg-[#E7FA53] hover:text-[#0B0B0B] transition-colors duration-150"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            role="tablist"
            aria-label={lang === 'ru' ? 'Серии карточек' : 'Product series'}
            className="flex items-center gap-1 p-1 bg-white/[0.06] rounded-[6px] overflow-x-auto no-scrollbar max-w-full"
          >
            {series.map((item, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleSelect(idx)}
                  onMouseEnter={() => playHover()}
                  className={`px-3 py-1.5 rounded-[5px] type-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#E7FA53] text-[#0B0B0B] font-semibold'
                      : 'text-white/75 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <span className="tabular-nums opacity-65">0{idx + 1}</span>
                  <span>{t(item.name)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active SKU Summary */}
      <RubberBlock skewFactor={0.45} driftFactor={5}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-8 pb-6 border-b border-white/12">
          <div className="lg:col-span-5 space-y-2">
            <p className="type-sm text-white/60">
              {active.marketplaceTag} · {t(active.productType)}
            </p>
            <h3 className="type-heading font-display font-bold text-white">{t(active.name)}</h3>
            <div className="flex flex-wrap items-center gap-3 pt-1 type-sm text-white/65">
              {active.palette.map((hex) => (
                <span key={hex} className="inline-flex items-center gap-1.5">
                  <span
                    style={{ backgroundColor: hex }}
                    className="w-3 h-3 inline-block border border-white/25"
                  />
                  <span>{hex}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <p style={{ color: accentColor }} className="type-sm font-semibold">
                {lang === 'ru' ? 'Типографический приём' : 'Typographic approach'}
              </p>
              <p className="type-body text-white/85">{t(active.typographyLogic)}</p>
            </div>
            <div className="space-y-1.5">
              <p style={{ color: accentColor }} className="type-sm font-semibold">
                {lang === 'ru' ? 'Иерархия смыслов' : 'Conversion hierarchy'}
              </p>
              <p className="type-body text-white/85">{t(active.hierarchyNote)}</p>
            </div>
          </div>
        </div>

        {/* Wide Spread Plate with Quick Product Switch Arrows */}
        {active.spreadImage && (
          <div className="mb-8">
            <div className="relative w-full max-w-[calc(60vh*16/9)] mx-auto border border-white/14 bg-[#0B0B0B]">
              <button
                type="button"
                onClick={() => {
                  playPluck(1.02);
                  onInspectImage({
                    src: active.spreadImage!.src,
                    caption: `${t(active.name)}: ${t(active.spreadImage!.caption)}`,
                  });
                }}
                onMouseEnter={() => playHover()}
                className="group relative block w-full overflow-hidden text-left"
              >
                <ResilientImage
                  src={active.spreadImage.src}
                  alt={t(active.spreadImage.caption)}
                  fallbackTitle={active.code}
                  className="w-full aspect-[16/10] sm:aspect-[16/9]"
                  imgClassName="w-full h-full object-cover transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
                />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(activeIndex - 1);
                }}
                onMouseEnter={() => playHover()}
                aria-label={lang === 'ru' ? 'Предыдущий товар' : 'Previous product'}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#0B0B0B]/75 hover:bg-[#E7FA53] text-white hover:text-[#0B0B0B] border border-white/20 rounded-[6px] flex items-center justify-center transition-colors duration-150 backdrop-blur-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(activeIndex + 1);
                }}
                onMouseEnter={() => playHover()}
                aria-label={lang === 'ru' ? 'Следующий товар' : 'Next product'}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#0B0B0B]/75 hover:bg-[#E7FA53] text-white hover:text-[#0B0B0B] border border-white/20 rounded-[6px] flex items-center justify-center transition-colors duration-150 backdrop-blur-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="px-4 py-3 bg-[#16161B] border-t border-white/12 flex items-center justify-between gap-4">
                <span className="type-sm text-white/80">{t(active.spreadImage.caption)}</span>
                <button
                  type="button"
                  onClick={() => {
                    playPluck(1.02);
                    onInspectImage({
                      src: active.spreadImage!.src,
                      caption: `${t(active.name)}: ${t(active.spreadImage!.caption)}`,
                    });
                  }}
                  className="inline-flex items-center gap-1.5 type-sm font-medium text-white/75 hover:text-[#E7FA53] shrink-0 transition-colors duration-150"
                >
                  <ZoomIn className="w-4 h-4" />
                  <span>{lang === 'ru' ? 'Увеличить' : 'Inspect'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </RubberBlock>

      {/* Individual Portrait Cards Grid */}
      {active.slides.length > 0 && (
        <RubberBlock skewFactor={-0.4} driftFactor={-4}>
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 ${
              active.slides.length >= 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2 max-w-4xl mx-auto'
            } gap-5 sm:gap-6`}
          >
            {active.slides.map((slide, sIdx) => (
              <button
                key={`${active.id}-slide-${sIdx}`}
                type="button"
                onClick={() => {
                  playPluck(1.08 + sIdx * 0.04);
                  onInspectImage({
                    src: slide.src,
                    caption: `${t(active.name)}: ${t(slide.label)}`,
                  });
                }}
                onMouseEnter={() => playHover()}
                className="group text-left border border-white/12 bg-[#16161B] overflow-hidden transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5"
              >
                <div className="overflow-hidden bg-[#141418]">
                  <ResilientImage
                    src={slide.src}
                    alt={`${t(active.name)} · ${t(slide.label)}`}
                    fallbackTitle={active.code}
                    className="w-full aspect-[3/4]"
                    imgClassName="w-full h-full object-cover transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
                  />
                </div>
                <div className="px-4 py-3 flex items-center justify-between gap-2 border-t border-white/12">
                  <span className="type-sm text-white/80">{t(slide.label)}</span>
                  <ZoomIn className="w-4 h-4 text-white/50 group-hover:text-[#E7FA53] transition-colors duration-150 shrink-0" />
                </div>
              </button>
            ))}
          </div>
        </RubberBlock>
      )}
    </section>
  );
}
