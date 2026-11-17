import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSound } from '../context/SoundContext';
import { BilingualText } from '../i18n/translations';
import { RubberBlock } from './RubberMotion';

export interface LogofolioPlate {
  id: string;
  code: string;
  year: string;
  brand: string;
  niche: BilingualText;
  cluster: 'tech' | 'lifestyle' | 'craft';
  src: string;
  concept: BilingualText;
  formLogic: BilingualText;
}

interface LogofolioShowcaseProps {
  plates: LogofolioPlate[];
  coverPlateSrc?: string;
  accentColor?: string;
  onInspectImage?: (img: { src: string; caption: string }) => void;
}

const CLUSTERS: Array<{ id: 'all' | 'tech' | 'lifestyle' | 'craft'; label: BilingualText }> = [
  { id: 'all', label: { ru: 'Все знаки', en: 'All marks' } },
  { id: 'tech', label: { ru: 'Digital & Tech', en: 'Digital & Tech' } },
  { id: 'lifestyle', label: { ru: 'Сервис и еда', en: 'Service & Lifestyle' } },
  { id: 'craft', label: { ru: 'Спорт и крафт', en: 'Sport & Craft' } },
];

export function LogofolioShowcase({
  plates,
  coverPlateSrc,
  accentColor = '#346E71',
  onInspectImage,
}: LogofolioShowcaseProps) {
  const { lang, t } = useLanguage();
  const { playHover, playPluck } = useSound();

  const [cluster, setCluster] = useState<'all' | 'tech' | 'lifestyle' | 'craft'>('all');
  const [selectedId, setSelectedId] = useState<string>(plates[0]?.id || '');

  const visiblePlates = useMemo(
    () => (cluster === 'all' ? plates : plates.filter((p) => p.cluster === cluster)),
    [cluster, plates]
  );

  const activeIdx = Math.max(
    0,
    visiblePlates.findIndex((p) => p.id === selectedId)
  );
  const current = visiblePlates[activeIdx] || visiblePlates[0] || plates[0];

  if (!current) return null;

  const stepPlate = (delta: number) => {
    const nextIdx = (activeIdx + delta + visiblePlates.length) % visiblePlates.length;
    setSelectedId(visiblePlates[nextIdx].id);
    playPluck(delta > 0 ? 1.05 : 0.94);
  };

  return (
    <section className="max-w-[1380px] mx-auto px-4 sm:px-8 pb-12 sm:pb-16 border-t border-[#0B0B0B]/12 dark:border-white/12">
      {/* Sticky Archive Top Bar (always shows current mark, counter, clusters, title plate) */}
      <div className="sticky top-[64px] sm:top-[72px] z-30 -mx-4 sm:-mx-8 px-4 sm:px-8 py-3.5 bg-[#F6F6F2]/94 dark:bg-[#111616]/94 backdrop-blur-md border-b border-[#0B0B0B]/12 dark:border-white/12 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center justify-between lg:justify-start gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="font-mono-tabular type-sm font-semibold text-[#346E71] dark:text-[#6CC4C8] shrink-0">
                {String(activeIdx + 1).padStart(2, '0')} / {String(visiblePlates.length).padStart(2, '0')}
              </span>
              <h2 className="font-display font-bold type-body sm:type-heading text-[#0B0B0B] dark:text-[#EFEFE9] truncate">
                {current.brand}
              </h2>
            </div>

            <div className="inline-flex items-center gap-1 bg-[#E5E4DC] dark:bg-[#1A2020] p-0.5 rounded-[6px]">
              <button
                type="button"
                onClick={() => stepPlate(-1)}
                onMouseEnter={() => playHover()}
                aria-label={lang === 'ru' ? 'Предыдущий логотип' : 'Previous logo'}
                className="w-7 h-7 rounded-[4px] flex items-center justify-center hover:bg-[#0B0B0B] dark:hover:bg-[#E7FA53] hover:text-[#EFEFE9] dark:hover:text-[#0B0B0B] transition-colors duration-150"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => stepPlate(1)}
                onMouseEnter={() => playHover()}
                aria-label={lang === 'ru' ? 'Следующий логотип' : 'Next logo'}
                className="w-7 h-7 rounded-[4px] flex items-center justify-center hover:bg-[#0B0B0B] dark:hover:bg-[#E7FA53] hover:text-[#EFEFE9] dark:hover:text-[#0B0B0B] transition-colors duration-150"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div
              role="tablist"
              aria-label={lang === 'ru' ? 'Фильтр знаков' : 'Filter logofolio marks'}
              className="flex items-center gap-1 p-1 bg-[#E5E4DC] dark:bg-[#16161B] rounded-[6px] overflow-x-auto no-scrollbar max-w-full"
            >
              {CLUSTERS.map((tab) => {
                const isActive = cluster === tab.id;
                const count =
                  tab.id === 'all'
                    ? plates.length
                    : plates.filter((p) => p.cluster === tab.id).length;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => {
                      setCluster(tab.id);
                      const nextList =
                        tab.id === 'all' ? plates : plates.filter((p) => p.cluster === tab.id);
                      if (nextList[0]) setSelectedId(nextList[0].id);
                      playPluck(1.0);
                    }}
                    onMouseEnter={() => playHover()}
                    className={`px-3 py-1.5 rounded-[5px] type-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-[#0B0B0B] dark:bg-[#E7FA53] text-[#EFEFE9] dark:text-[#0B0B0B]'
                        : 'text-[#0B0B0B]/75 dark:text-[#EFEFE9]/75 hover:text-[#0B0B0B] dark:hover:text-[#EFEFE9]'
                    }`}
                  >
                    <span>{t(tab.label)}</span>
                    <span className="font-mono-tabular opacity-60">{count}</span>
                  </button>
                );
              })}
            </div>

            {coverPlateSrc && onInspectImage && (
              <button
                type="button"
                onClick={() =>
                  onInspectImage({
                    src: coverPlateSrc,
                    caption:
                      lang === 'ru'
                        ? 'Титульный лист Logofolio (2024–2026)'
                        : 'Logofolio Cover Specimen (2024–2026)',
                  })
                }
                onMouseEnter={() => playHover()}
                className="px-3 py-1.5 rounded-[6px] border border-[#0B0B0B]/18 dark:border-white/18 hover:border-[#346E71] dark:hover:border-[#E7FA53] hover:text-[#346E71] dark:hover:text-[#E7FA53] type-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0"
              >
                {lang === 'ru' ? 'Титульный лист ↗' : 'Title plate ↗'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Light-Table Specimen Viewer */}
      <RubberBlock skewFactor={0.45} driftFactor={5}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-6">
          <div className="lg:col-span-7 relative">
            <button
              type="button"
              onClick={() =>
                onInspectImage?.({
                  src: current.src,
                  caption: `${current.code} · ${current.brand} · ${t(current.niche)} (${current.year})`,
                })
              }
              data-cursor={lang === 'ru' ? 'Увеличить' : 'Inspect'}
              className="group relative block w-full aspect-[16/10] max-h-[52vh] bg-white border border-[#0B0B0B]/12 dark:border-white/12 overflow-hidden text-left shadow-[0_24px_60px_-24px_rgba(11,11,11,0.14)]"
            >
              <img
                src={current.src}
                alt={`${current.brand} · ${t(current.niche)}`}
                decoding="async"
                className="w-full h-full object-contain transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-[1.03]"
              />
              <span className="absolute top-3 right-3 w-9 h-9 bg-[#0B0B0B]/80 text-[#EFEFE9] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <ZoomIn className="w-4 h-4" />
              </span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                stepPlate(-1);
              }}
              onMouseEnter={() => playHover()}
              aria-label={lang === 'ru' ? 'Предыдущий логотип' : 'Previous logo'}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#0B0B0B]/75 hover:bg-[#346E71] text-white border border-white/20 rounded-[6px] flex items-center justify-center transition-colors duration-150 backdrop-blur-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                stepPlate(1);
              }}
              onMouseEnter={() => playHover()}
              aria-label={lang === 'ru' ? 'Следующий логотип' : 'Next logo'}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#0B0B0B]/75 hover:bg-[#346E71] text-white border border-white/20 rounded-[6px] flex items-center justify-center transition-colors duration-150 backdrop-blur-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-between p-5 sm:p-7 bg-white dark:bg-[#16161B] border border-[#0B0B0B]/12 dark:border-white/12">
            <div>
              <div className="flex items-center justify-between type-sm text-[#0B0B0B]/60 dark:text-[#EFEFE9]/65 pb-3.5 border-b border-[#0B0B0B]/10 dark:border-white/10">
                <span className="font-mono-tabular">
                  {current.code} / {String(plates.length).padStart(2, '0')} · {current.year}
                </span>
                <span style={{ color: accentColor }} className="font-medium dark:!text-[#E7FA53]">
                  {t(current.niche)}
                </span>
              </div>

              <h3 className="type-heading font-display font-bold text-[#0B0B0B] dark:text-[#EFEFE9] mt-4 mb-4">
                {current.brand}
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="type-sm font-medium text-[#0B0B0B]/55 dark:text-[#EFEFE9]/55 mb-1">
                    {lang === 'ru' ? 'Семантика и метафора' : 'Concept and symbol'}
                  </p>
                  <p className="type-body text-[#0B0B0B]/85 dark:text-[#EFEFE9]/85 leading-relaxed">
                    {t(current.concept)}
                  </p>
                </div>

                <div>
                  <p className="type-sm font-medium text-[#0B0B0B]/55 dark:text-[#EFEFE9]/55 mb-1">
                    {lang === 'ru' ? 'Геометрия и шрифт' : 'Form and typography'}
                  </p>
                  <p className="type-body text-[#0B0B0B]/85 dark:text-[#EFEFE9]/85 leading-relaxed">
                    {t(current.formLogic)}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-5 border-t border-[#0B0B0B]/10 dark:border-white/10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 type-sm text-[#0B0B0B]/65 dark:text-[#EFEFE9]/65">
                <span className="w-3.5 h-3.5 rounded-full bg-[#2E302F] border border-[#0B0B0B]/15 dark:border-white/20 inline-block" />
                <span className="w-3.5 h-3.5 rounded-full bg-[#346E71] border border-[#0B0B0B]/15 dark:border-white/20 inline-block" />
                <span className="w-3.5 h-3.5 rounded-full bg-white border border-[#0B0B0B]/20 inline-block" />
                <span className="ml-1">
                  {lang === 'ru' ? 'Общая палитра серии' : 'Shared series palette'}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => stepPlate(-1)}
                  aria-label={lang === 'ru' ? 'Предыдущий логотип' : 'Previous logo'}
                  className="w-9 h-9 border border-[#0B0B0B]/18 dark:border-white/18 hover:bg-[#0B0B0B] dark:hover:bg-[#E7FA53] hover:text-[#EFEFE9] dark:hover:text-[#0B0B0B] transition-colors duration-150 flex items-center justify-center"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => stepPlate(1)}
                  aria-label={lang === 'ru' ? 'Следующий логотип' : 'Next logo'}
                  className="w-9 h-9 border border-[#0B0B0B]/18 dark:border-white/18 hover:bg-[#0B0B0B] dark:hover:bg-[#E7FA53] hover:text-[#EFEFE9] dark:hover:text-[#0B0B0B] transition-colors duration-150 flex items-center justify-center"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </RubberBlock>

      {/* Contact Sheet Thumbnail Index (All marks clearly visible and labeled) */}
      <RubberBlock skewFactor={-0.35} driftFactor={-4}>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-3.5">
          {visiblePlates.map((plate) => {
            const isSelected = plate.id === current.id;
            return (
              <button
                key={plate.id}
                type="button"
                onClick={() => {
                  setSelectedId(plate.id);
                  playPluck(1.02);
                }}
                onMouseEnter={() => playHover()}
                style={
                  isSelected
                    ? { borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }
                    : undefined
                }
                className={`group text-left bg-white dark:bg-[#16161B] border transition-[border-color,transform,box-shadow] duration-200 ${
                  isSelected
                    ? '-translate-y-0.5'
                    : 'border-[#0B0B0B]/12 dark:border-white/12 hover:border-[#0B0B0B]/45 dark:hover:border-white/40 hover:-translate-y-0.5'
                }`}
              >
                <div className="w-full aspect-[16/10] bg-white overflow-hidden border-b border-[#0B0B0B]/8">
                  <img
                    src={plate.src}
                    alt={`${plate.brand} · ${t(plate.niche)}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-[1.06]"
                  />
                </div>
                <div className="px-3 py-2 flex items-baseline justify-between gap-2">
                  <span className="font-display font-semibold type-sm text-[#0B0B0B] dark:text-[#EFEFE9] truncate">
                    {plate.brand}
                  </span>
                  <span className="font-mono-tabular text-[13px] text-[#0B0B0B]/55 dark:text-[#EFEFE9]/60 shrink-0">
                    {plate.code.replace('MARK ', '')}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </RubberBlock>
    </section>
  );
}
