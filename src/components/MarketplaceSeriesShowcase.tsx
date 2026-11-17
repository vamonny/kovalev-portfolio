import { useState } from 'react';
import { ZoomIn } from 'lucide-react';
import { BilingualText } from '../i18n/translations';
import { useLanguage } from '../context/LanguageContext';
import { useSound } from '../context/SoundContext';
import { ResilientImage } from './ResilientImage';

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
    if (idx === activeIndex) return;
    playMorph();
    setActiveIndex(idx);
  };

  return (
    <section className="max-w-[1380px] mx-auto px-4 sm:px-8 py-12 sm:py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b border-white/12 mb-6">
        <h2 className="type-heading font-display font-bold text-white">
          {lang === 'ru'
            ? 'Типографика в пяти категориях товаров'
            : 'Typography across five product series'}
        </h2>

        <div
          role="tablist"
          aria-label={lang === 'ru' ? 'Серии карточек' : 'Product series'}
          className="inline-flex flex-wrap items-center gap-1 p-1 bg-white/[0.06] rounded-[6px]"
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
                className={`px-3 py-1.5 rounded-[5px] type-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-[#E7FA53] text-[#0B0B0B] font-semibold'
                    : 'text-white/75 hover:text-white'
                }`}
              >
                {t(item.name)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active SKU Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-8 pb-8 border-b border-white/12">
        <div className="lg:col-span-5 space-y-2.5">
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

      {/* Wide Spread Plate */}
      {active.spreadImage && (
        <div className="mb-8">
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
            className="group relative block w-full overflow-hidden border border-white/14 bg-[#0B0B0B] text-left"
          >
            <ResilientImage
              src={active.spreadImage.src}
              alt={t(active.spreadImage.caption)}
              fallbackTitle={active.code}
              className="w-full aspect-[16/10] sm:aspect-[16/9]"
              imgClassName="w-full h-full object-cover transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
            />
            <div className="px-4 py-3 bg-[#16161B] border-t border-white/12 flex items-center justify-between gap-4">
              <span className="type-sm text-white/80">{t(active.spreadImage.caption)}</span>
              <span className="inline-flex items-center gap-1.5 type-sm font-medium text-white/70 group-hover:text-[#E7FA53] shrink-0 transition-colors duration-150">
                <ZoomIn className="w-4 h-4" />
                <span>{lang === 'ru' ? 'Увеличить' : 'Inspect'}</span>
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Individual Portrait Cards Grid */}
      {active.slides.length > 0 && (
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 ${
            active.slides.length >= 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2 max-w-4xl'
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
      )}
    </section>
  );
}
