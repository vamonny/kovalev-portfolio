import { useMemo, useState } from 'react';
import { Expand } from 'lucide-react';
import { BilingualText } from '../i18n/translations';
import { useLanguage } from '../context/LanguageContext';
import { useSound } from '../context/SoundContext';
import { RubberBlock } from './RubberMotion';

export type IdentityCarrierGroup = 'identity' | 'print' | 'merch' | 'digital';

export interface IdentityCarrierPlate {
  id: string;
  code: string;
  src: string;
  group: IdentityCarrierGroup;
  surfaceBg?: string;
  title: BilingualText;
  note: BilingualText;
}

interface IdentityShowcaseProps {
  plates: IdentityCarrierPlate[];
  accentColor: string;
  onInspectImage: (img: { src: string; caption: string }) => void;
}

type GroupFilter = 'all' | IdentityCarrierGroup;

export function IdentityShowcase({
  plates,
  accentColor,
  onInspectImage,
}: IdentityShowcaseProps) {
  const { lang, t } = useLanguage();
  const { playClick, playHover, playMorph } = useSound();
  const [group, setGroup] = useState<GroupFilter>('all');

  const filters: Array<{ key: GroupFilter; label: string; count: number }> = useMemo(
    () => [
      {
        key: 'all',
        label: lang === 'ru' ? 'Все носители' : 'All touchpoints',
        count: plates.length,
      },
      {
        key: 'identity',
        label: lang === 'ru' ? 'Знак и паттерн' : 'Logo & pattern',
        count: plates.filter((p) => p.group === 'identity').length,
      },
      {
        key: 'print',
        label: lang === 'ru' ? 'Полиграфия' : 'Print & stationery',
        count: plates.filter((p) => p.group === 'print').length,
      },
      {
        key: 'merch',
        label: lang === 'ru' ? 'Мерч и награды' : 'Merch & awards',
        count: plates.filter((p) => p.group === 'merch').length,
      },
      {
        key: 'digital',
        label: lang === 'ru' ? 'Веб-сайт UI/UX' : 'Website UI/UX',
        count: plates.filter((p) => p.group === 'digital').length,
      },
    ],
    [lang, plates]
  );

  const visiblePlates = useMemo(
    () => (group === 'all' ? plates : plates.filter((p) => p.group === group)),
    [group, plates]
  );

  return (
    <section className="max-w-[1380px] mx-auto px-4 sm:px-8 pb-12 sm:pb-16">
      <div className="sticky top-[64px] sm:top-[72px] z-30 -mx-4 sm:-mx-8 px-4 sm:px-8 py-3.5 bg-[#F2F6FA]/94 dark:bg-[#0B1522]/94 backdrop-blur-md flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#0B4F78]/14 dark:border-white/12 mb-8">
        <h2 className="type-body sm:type-heading font-display font-bold text-[#0B0B0B] dark:text-[#EFEFE9]">
          {lang === 'ru'
            ? 'Фирменный стиль, полиграфия, мерч и веб'
            : 'Logo, print, merchandise and web UI'}
        </h2>

        <div
          role="tablist"
          aria-label={lang === 'ru' ? 'Группы носителей' : 'Touchpoint groups'}
          className="flex items-center gap-1 p-1 bg-[#E5E4DC] dark:bg-[#16161B] rounded-[6px] overflow-x-auto no-scrollbar max-w-full"
        >
          {filters.map((f) => {
            const active = group === f.key;
            return (
              <button
                key={f.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  playMorph();
                  setGroup(f.key);
                }}
                onMouseEnter={() => playHover()}
                className={`px-3 py-1.5 rounded-[5px] type-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  active
                    ? 'bg-[#0B0B0B] dark:bg-[#E7FA53] text-[#EFEFE9] dark:text-[#0B0B0B]'
                    : 'text-[#0B0B0B]/75 dark:text-[#EFEFE9]/75 hover:text-[#0B0B0B] dark:hover:text-[#EFEFE9]'
                }`}
              >
                <span>{f.label}</span>
                <span className="font-mono-tabular opacity-60">{f.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <RubberBlock skewFactor={0.45} driftFactor={5}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visiblePlates.map((plate) => {
          const titleStr = t(plate.title);
          const isDarkPlate = plate.group === 'digital';
          return (
            <button
              key={plate.id}
              type="button"
              onClick={() => {
                playClick();
                onInspectImage({
                  src: plate.src,
                  caption: `${plate.code} · ${titleStr}`,
                });
              }}
              onMouseEnter={() => playHover()}
              data-cursor={lang === 'ru' ? 'Увеличить' : 'Inspect'}
              className="group text-left border border-[#0B0B0B]/12 dark:border-white/12 bg-[#EFEFE9] dark:bg-[#16161B] flex flex-col justify-between overflow-hidden transition-colors duration-200 hover:border-[#0B0B0B]/45 dark:hover:border-white/40"
            >
              <div
                style={{
                  backgroundColor: isDarkPlate ? '#070E1A' : '#E6E5DD',
                }}
                className="relative w-full aspect-[4/3] overflow-hidden border-b border-[#0B0B0B]/10 dark:border-white/10 p-5 sm:p-6 flex items-center justify-center"
              >
                <img
                  src={plate.src}
                  alt={titleStr}
                  loading="lazy"
                  decoding="async"
                  className="max-w-full max-h-full w-auto h-auto object-contain drop-shadow-[0_12px_22px_rgba(11,11,11,0.14)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                />
                <span
                  className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center border opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                    isDarkPlate
                      ? 'bg-white/15 border-white/25 text-white'
                      : 'bg-[#0B0B0B] border-[#0B0B0B] text-[#EFEFE9]'
                  }`}
                >
                  <Expand className="w-3.5 h-3.5" />
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between bg-[#EFEFE9]/45 dark:bg-[#16161B]">
                <div>
                  <span
                    style={{ color: accentColor }}
                    className="font-mono-tabular type-sm font-medium dark:!text-[#E7FA53] block mb-1"
                  >
                    {plate.code}
                  </span>
                  <h3 className="type-body font-display font-bold text-[#0B0B0B] dark:text-[#EFEFE9] group-hover:text-[#D61914] dark:group-hover:text-[#E7FA53] transition-colors duration-150">
                    {titleStr}
                  </h3>
                </div>
                <p className="type-body text-[#0B0B0B]/70 dark:text-[#EFEFE9]/70 leading-relaxed mt-2.5">
                  {t(plate.note)}
                </p>
              </div>
            </button>
          );
        })}
        </div>
      </RubberBlock>
    </section>
  );
}
