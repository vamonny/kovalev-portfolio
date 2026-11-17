import { useState } from 'react';
import { ZoomIn } from 'lucide-react';
import { BilingualText } from '../i18n/translations';
import { useLanguage } from '../context/LanguageContext';
import { useSound } from '../context/SoundContext';
import { ResilientImage } from './ResilientImage';
import { ScrambleText } from './ScrambleText';

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
  accentColor = '#155EEF',
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
    <section className="max-w-[1380px] mx-auto px-5 sm:px-8 py-12 sm:py-16">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <p
            style={{ color: accentColor }}
            className="font-mono-tabular text-[10px] uppercase tracking-[0.22em] mb-2 dark:!text-[#E7FA53]"
          >
            {lang === 'ru'
              ? `СЕРИИ КАРТОЧЕК · ${String(series.length).padStart(2, '0')} КАТЕГОРИЙ`
              : `MARKETPLACE DECK · ${String(series.length).padStart(2, '0')} SKUS`}
          </p>
          <h2 className="font-display font-extrabold uppercase text-2xl sm:text-4xl tracking-[-0.04em] leading-[0.95] text-[#0B0B0B] dark:text-[#EFEFE9]">
            <ScrambleText
              text={
                lang === 'ru'
                  ? 'ТИПОГРАФИКА В 5 КАТЕГОРИЯХ'
                  : 'TYPOGRAPHY ACROSS 5 CATEGORIES'
              }
              triggerOnHover
              duration={360}
            />
          </h2>
        </div>

        <p className="font-mono-tabular text-[11px] uppercase tracking-[0.16em] text-[#0B0B0B]/60 dark:text-[#EFEFE9]/60">
          {lang === 'ru'
            ? 'ВЫБЕРИТЕ ТОВАР · НАЖМИТЕ ДЛЯ УВЕЛИЧЕНИЯ'
            : 'SELECT SKU · CLICK ANY CARD TO INSPECT'}
        </p>
      </div>

      {/* Category Switcher Tabs */}
      <div className="flex flex-wrap gap-2 pb-6 border-b border-[#0B0B0B]/12 dark:border-white/12 mb-8">
        {series.map((item, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(idx)}
              onMouseEnter={() => playHover()}
              aria-pressed={isActive}
              className={`px-3.5 py-2.5 text-[11px] font-mono-tabular uppercase tracking-wider border transition-colors ${
                isActive
                  ? 'bg-[#0B0B0B] dark:bg-[#E7FA53] text-[#E7FA53] dark:text-[#0B0B0B] border-[#0B0B0B] dark:border-[#E7FA53]'
                  : 'bg-[#E5E4DC] dark:bg-[#16161B] text-[#0B0B0B]/80 dark:text-[#EFEFE9]/80 border-[#0B0B0B]/15 dark:border-white/12 hover:border-[#0B0B0B] dark:hover:border-white/45'
              }`}
            >
              {item.code} · {t(item.name)}
            </button>
          );
        })}
      </div>

      {/* Active SKU Breakdown & Meta Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-8 p-5 sm:p-7 bg-[#E5E4DC] dark:bg-[#16161B] border border-[#0B0B0B]/12 dark:border-white/12">
        <div className="lg:col-span-5 space-y-3">
          <div className="flex flex-wrap items-center gap-2 font-mono-tabular text-[10px] uppercase tracking-[0.18em] text-[#0B0B0B]/65 dark:text-[#EFEFE9]/65">
            <span>{active.code}</span>
            <span aria-hidden="true">·</span>
            <span>{active.marketplaceTag}</span>
          </div>
          <h3 className="font-display font-extrabold uppercase text-2xl sm:text-3xl tracking-[-0.03em] leading-[0.98] text-[#0B0B0B] dark:text-[#EFEFE9]">
            {t(active.name)}
          </h3>
          <p className="font-sans-body text-sm text-[#0B0B0B]/75 dark:text-[#EFEFE9]/75">{t(active.productType)}</p>

          <div className="flex flex-wrap gap-2 pt-2">
            {active.palette.map((hex) => (
              <div
                key={hex}
                className="flex items-center gap-1.5 px-2 py-1 bg-[#EFEFE9] dark:bg-[#0C0C0F] border border-[#0B0B0B]/15 dark:border-white/15 font-mono-tabular text-[10px]"
              >
                <span
                  style={{ backgroundColor: hex }}
                  className="w-3 h-3 inline-block border border-[#0B0B0B]/20 dark:border-white/25"
                />
                <span>{hex}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 lg:pt-0 lg:pl-6 lg:border-l border-t lg:border-t-0 border-[#0B0B0B]/12 dark:border-white/12">
          <div>
            <p
              style={{ color: accentColor }}
              className="font-mono-tabular text-[10px] uppercase tracking-[0.18em] mb-2 dark:!text-[#E7FA53]"
            >
              {lang === 'ru' ? 'ТИПОГРАФИЧЕСКИЙ ПРИЁМ' : 'TYPOGRAPHIC SYSTEM'}
            </p>
            <p className="text-sm sm:text-[15px] leading-relaxed text-[#0B0B0B]/85 dark:text-[#EFEFE9]/85">
              {t(active.typographyLogic)}
            </p>
          </div>
          <div>
            <p
              style={{ color: accentColor }}
              className="font-mono-tabular text-[10px] uppercase tracking-[0.18em] mb-2 dark:!text-[#E7FA53]"
            >
              {lang === 'ru' ? 'ИЕРАРХИЯ СМЫСЛОВ' : 'CONVERSION HIERARCHY'}
            </p>
            <p className="text-sm sm:text-[15px] leading-relaxed text-[#0B0B0B]/85 dark:text-[#EFEFE9]/85">
              {t(active.hierarchyNote)}
            </p>
          </div>
        </div>
      </div>

      {/* Presentation Chrome Spread (Wide Plate if present) */}
      {active.spreadImage && (
        <div className="mb-8">
          <button
            type="button"
            onClick={() => {
              playPluck(1.02);
              onInspectImage({
                src: active.spreadImage!.src,
                caption: `${active.code} — ${t(active.name)} (${t(active.spreadImage!.caption)})`,
              });
            }}
            onMouseEnter={() => playHover()}
            data-cursor={lang === 'ru' ? 'Увеличить' : 'Inspect'}
            className="group relative block w-full overflow-hidden border border-[#0B0B0B]/15 dark:border-white/15 bg-[#0B0B0B] text-left"
          >
            <ResilientImage
              src={active.spreadImage.src}
              alt={t(active.spreadImage.caption)}
              fallbackTitle={active.code}
              className="w-full aspect-[16/10] sm:aspect-[16/9]"
              imgClassName="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-[1.025]"
            />
            <div className="px-4 py-3 bg-[#EFEFE9] dark:bg-[#16161B] border-t border-[#0B0B0B]/12 dark:border-white/12 flex items-center justify-between gap-4">
              <span className="font-mono-tabular text-[11px] uppercase tracking-[0.14em] text-[#0B0B0B]/80 dark:text-[#EFEFE9]/80">
                {t(active.spreadImage.caption)}
              </span>
              <span className="inline-flex items-center gap-1.5 font-mono-tabular text-[10px] uppercase tracking-[0.16em] text-[#0B0B0B]/60 dark:text-[#EFEFE9]/65 group-hover:text-[#0B0B0B] dark:group-hover:text-[#E7FA53] shrink-0">
                <ZoomIn className="w-3.5 h-3.5" />
                {lang === 'ru' ? 'ОТКРЫТЬ' : 'INSPECT'}
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Individual 3:4 Marketplace Cards Grid (when standalone portrait cards exist) */}
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
                  caption: `${active.code} · ${t(active.name)} — ${t(slide.label)}`,
                });
              }}
              onMouseEnter={() => playHover()}
              data-cursor={lang === 'ru' ? 'Увеличить' : 'Inspect'}
              className="group text-left border border-[#0B0B0B]/15 dark:border-white/12 bg-[#EFEFE9] dark:bg-[#16161B] overflow-hidden transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1"
            >
              <div className="overflow-hidden bg-[#141418]">
                <ResilientImage
                  src={slide.src}
                  alt={`${t(active.name)} — ${t(slide.label)}`}
                  fallbackTitle={active.code}
                  className="w-full aspect-[3/4]"
                  imgClassName="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-[1.03]"
                />
              </div>
              <div className="px-3.5 py-2.5 flex items-center justify-between gap-2 border-t border-[#0B0B0B]/12 dark:border-white/12">
                <span className="font-mono-tabular text-[10px] uppercase tracking-[0.16em] text-[#0B0B0B]/75 dark:text-[#EFEFE9]/75">
                  {t(slide.label)}
                </span>
                <ZoomIn className="w-3.5 h-3.5 text-[#0B0B0B]/45 dark:text-[#EFEFE9]/50 group-hover:text-[#0B0B0B] dark:group-hover:text-[#E7FA53] transition-colors shrink-0" />
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
