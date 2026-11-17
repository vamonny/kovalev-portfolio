import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, ZoomIn } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSound } from '../context/SoundContext';
import { BilingualText } from '../i18n/translations';
import { ScrambleText } from './ScrambleText';

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
  { id: 'all', label: { ru: 'Все знаки', en: 'All Marks' } },
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
    <section className="max-w-[1380px] mx-auto px-5 sm:px-8 py-12 sm:py-16 border-t border-[#0B0B0B]/12 dark:border-white/12">
      {/* Section Header + Cluster Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
        <div>
          <p className="font-mono-tabular text-[10px] uppercase tracking-[0.2em] text-[#0B0B0B]/55 dark:text-[#EFEFE9]/60 mb-2">
            <ScrambleText
              text={
                lang === 'ru'
                  ? `ИНТЕРАКТИВНАЯ ВИТРИНА · ${plates.length} ЗНАКОВ (2024–2026)`
                  : `EXHIBITION LIGHT-TABLE · ${plates.length} MARKS (2024–2026)`
              }
              triggerKey={`lf-hdr-${lang}`}
              duration={320}
            />
          </p>
          <h2 className="font-display font-bold uppercase tracking-[-0.03em] text-2xl sm:text-4xl leading-[0.95] text-[#0B0B0B] dark:text-[#EFEFE9]">
            {lang === 'ru'
              ? 'Единая система знаков и метафор'
              : 'Unified Logofolio Archive'}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
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
                onClick={() => {
                  setCluster(tab.id);
                  const nextList =
                    tab.id === 'all' ? plates : plates.filter((p) => p.cluster === tab.id);
                  if (nextList[0]) setSelectedId(nextList[0].id);
                  playPluck(1.0);
                }}
                onMouseEnter={() => playHover()}
                className={`px-3.5 py-2 border text-[11px] font-mono-tabular font-semibold uppercase tracking-[0.06em] transition-colors flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#0B0B0B] dark:bg-[#E7FA53] text-[#EFEFE9] dark:text-[#0B0B0B] border-[#0B0B0B] dark:border-[#E7FA53]'
                    : 'border-[#0B0B0B]/18 dark:border-white/18 bg-white/60 dark:bg-[#16161B] text-[#0B0B0B] dark:text-[#EFEFE9]/80 hover:border-[#0B0B0B] dark:hover:border-white/45'
                }`}
              >
                <span>{t(tab.label)}</span>
                <span className="opacity-55">{String(count).padStart(2, '0')}</span>
              </button>
            );
          })}

          {coverPlateSrc && onInspectImage && (
            <button
              type="button"
              onClick={() =>
                onInspectImage({
                  src: coverPlateSrc,
                  caption: 'LOGOFOLIO. · COVER SPECIMEN (2024–2026)',
                })
              }
              onMouseEnter={() => playHover()}
              className="px-3.5 py-2 border border-[#0B0B0B]/18 dark:border-white/18 hover:border-[#346E71] dark:hover:border-[#E7FA53] hover:text-[#346E71] dark:hover:text-[#E7FA53] text-[11px] font-mono-tabular font-semibold uppercase tracking-[0.06em] transition-colors"
            >
              {lang === 'ru' ? 'Титульный лист ↗' : 'Title Plate ↗'}
            </button>
          )}
        </div>
      </div>

      {/* Main Light-Table Specimen Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-8">
        <div className="lg:col-span-7">
          <button
            type="button"
            onClick={() =>
              onInspectImage?.({
                src: current.src,
                caption: `${current.code} · ${current.brand} — ${t(current.niche)} (${current.year})`,
              })
            }
            data-cursor={lang === 'ru' ? 'Увеличить' : 'Inspect'}
            className="group relative block w-full aspect-[16/10] bg-white border border-[#0B0B0B]/15 dark:border-white/15 overflow-hidden text-left shadow-[0_24px_60px_-24px_rgba(11,11,11,0.16)]"
          >
            <img
              src={current.src}
              alt={`${current.brand} — ${t(current.niche)}`}
              decoding="async"
              className="w-full h-full object-contain transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-[1.03]"
            />
            <span className="absolute top-3 right-3 w-8 h-8 bg-[#0B0B0B]/80 text-[#EFEFE9] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn className="w-3.5 h-3.5" />
            </span>
          </button>
        </div>

        <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 bg-white dark:bg-[#16161B] border border-[#0B0B0B]/14 dark:border-white/12">
          <div>
            <div className="flex items-center justify-between font-mono-tabular text-[11px] uppercase tracking-[0.16em] text-[#0B0B0B]/55 dark:text-[#EFEFE9]/60 pb-4 border-b border-[#0B0B0B]/10 dark:border-white/10">
              <span>
                {current.code} / {String(plates.length).padStart(2, '0')} · {current.year}
              </span>
              <span style={{ color: accentColor }} className="font-semibold dark:!text-[#E7FA53]">
                {t(current.niche)}
              </span>
            </div>

            <h3 className="font-display font-bold uppercase tracking-[-0.03em] text-2xl sm:text-3xl text-[#0B0B0B] dark:text-[#EFEFE9] mt-5 mb-4 leading-[1.0]">
              <ScrambleText
                text={current.brand}
                triggerKey={`brand-${current.id}-${lang}`}
                duration={280}
              />
            </h3>

            <div className="space-y-4 text-sm sm:text-[15px] leading-relaxed text-[#0B0B0B]/85 dark:text-[#EFEFE9]/85">
              <div>
                <p className="font-mono-tabular text-[10px] uppercase tracking-[0.16em] text-[#0B0B0B]/45 dark:text-[#EFEFE9]/45 mb-1">
                  {lang === 'ru' ? 'СЕМАНТИКА И МЕТАФОРА' : 'CONCEPT & SYMBOL'}
                </p>
                <p>{t(current.concept)}</p>
              </div>

              <div>
                <p className="font-mono-tabular text-[10px] uppercase tracking-[0.16em] text-[#0B0B0B]/45 dark:text-[#EFEFE9]/45 mb-1">
                  {lang === 'ru' ? 'ГЕОМЕТРИЯ И ШРИФТ' : 'FORM & TYPOGRAPHY'}
                </p>
                <p>{t(current.formLogic)}</p>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-[#0B0B0B]/10 dark:border-white/10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-mono-tabular text-[10px] text-[#0B0B0B]/60 dark:text-[#EFEFE9]/60">
              <span className="w-4 h-4 bg-[#2E302F] border border-[#0B0B0B]/15 dark:border-white/20 inline-block" />
              <span className="w-4 h-4 bg-[#346E71] border border-[#0B0B0B]/15 dark:border-white/20 inline-block" />
              <span className="w-4 h-4 bg-white border border-[#0B0B0B]/20 inline-block" />
              <span className="ml-1 uppercase">PALETTE LOCK</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => stepPlate(-1)}
                aria-label={lang === 'ru' ? 'Предыдущий логотип' : 'Previous logo'}
                className="w-9 h-9 border border-[#0B0B0B]/20 dark:border-white/20 hover:bg-[#0B0B0B] dark:hover:bg-[#E7FA53] hover:text-[#EFEFE9] dark:hover:text-[#0B0B0B] transition-colors flex items-center justify-center"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => stepPlate(1)}
                aria-label={lang === 'ru' ? 'Следующий логотип' : 'Next logo'}
                className="w-9 h-9 border border-[#0B0B0B]/20 dark:border-white/20 hover:bg-[#0B0B0B] dark:hover:bg-[#E7FA53] hover:text-[#EFEFE9] dark:hover:text-[#0B0B0B] transition-colors flex items-center justify-center"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Sheet Thumbnail Index */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
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
              className={`group text-left bg-white dark:bg-[#16161B] border transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                isSelected
                  ? '-translate-y-0.5'
                  : 'border-[#0B0B0B]/12 dark:border-white/12 hover:border-[#0B0B0B]/45 dark:hover:border-white/40 hover:-translate-y-0.5'
              }`}
            >
              <div className="w-full aspect-[16/10] bg-white overflow-hidden border-b border-[#0B0B0B]/8">
                <img
                  src={plate.src}
                  alt={plate.brand}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-[1.06]"
                />
              </div>
              <div className="p-2.5 flex items-baseline justify-between gap-2">
                <span className="font-display font-bold text-xs uppercase tracking-tight text-[#0B0B0B] dark:text-[#EFEFE9] truncate">
                  {plate.brand}
                </span>
                <span className="font-mono-tabular text-[10px] text-[#0B0B0B]/50 dark:text-[#EFEFE9]/55 shrink-0">
                  {plate.code}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
