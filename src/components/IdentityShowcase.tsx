import { useMemo, useState } from 'react';
import { Expand } from 'lucide-react';
import { BilingualText } from '../i18n/translations';
import { useLanguage } from '../context/LanguageContext';
import { useSound } from '../context/SoundContext';
import { ScrambleText } from './ScrambleText';

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
        label: lang === 'ru' ? 'Все носители' : 'All Touchpoints',
        count: plates.length,
      },
      {
        key: 'identity',
        label: lang === 'ru' ? 'Знак и паттерн' : 'Logo & Pattern',
        count: plates.filter((p) => p.group === 'identity').length,
      },
      {
        key: 'print',
        label: lang === 'ru' ? 'Полиграфия' : 'Print & Stationery',
        count: plates.filter((p) => p.group === 'print').length,
      },
      {
        key: 'merch',
        label: lang === 'ru' ? 'Мерч и награды' : 'Merch & Awards',
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
    <section className="max-w-[1380px] mx-auto px-5 sm:px-8 py-12 sm:py-16">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#0B0B0B]/12 dark:border-white/12">
        <div>
          <p
            style={{ color: accentColor }}
            className="font-mono-tabular text-[11px] uppercase tracking-[0.2em] mb-2 font-semibold dark:!text-[#E7FA53]"
          >
            <ScrambleText
              text={
                lang === 'ru'
                  ? 'СИСТЕМА НОСИТЕЛЕЙ · 11 ПОЗИЦИЙ'
                  : 'IDENTITY SYSTEM · 11 TOUCHPOINTS'
              }
              triggerKey={`id-eye-${lang}`}
              duration={360}
            />
          </p>
          <h2 className="font-display font-extrabold uppercase tracking-[-0.035em] text-[clamp(1.6rem,3.4vw,2.8rem)] leading-[0.95] text-[#0B0B0B] dark:text-[#EFEFE9]">
            {lang === 'ru'
              ? 'Фирменный стиль, полиграфия, мерч и веб'
              : 'Logo, Print, Merchandise & Web UI'}
          </h2>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {filters.map((f) => {
            const active = group === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => {
                  playMorph();
                  setGroup(f.key);
                }}
                onMouseEnter={() => playHover()}
                aria-pressed={active}
                className={`px-3 py-2 font-mono-tabular text-[11px] uppercase tracking-[0.06em] border transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  active
                    ? 'bg-[#0B0B0B] dark:bg-[#E7FA53] text-[#E7FA53] dark:text-[#0B0B0B] border-[#0B0B0B] dark:border-[#E7FA53]'
                    : 'bg-transparent text-[#0B0B0B]/75 dark:text-[#EFEFE9]/75 border-[#0B0B0B]/15 dark:border-white/18 hover:border-[#0B0B0B] dark:hover:border-white/50'
                }`}
              >
                <span>{f.label}</span>
                <span className="opacity-55">{String(f.count).padStart(2, '0')}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  caption: `${plate.code} — ${titleStr}`,
                });
              }}
              onMouseEnter={() => playHover()}
              data-cursor={lang === 'ru' ? 'Увеличить' : 'Inspect'}
              className="group text-left border border-[#0B0B0B]/12 dark:border-white/12 bg-[#EFEFE9] dark:bg-[#16161B] flex flex-col justify-between overflow-hidden transition-colors duration-300 hover:border-[#0B0B0B]/45 dark:hover:border-white/40"
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
                  className={`absolute top-3 right-3 w-7 h-7 flex items-center justify-center border opacity-0 group-hover:opacity-100 transition-opacity ${
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
                  <p className="font-mono-tabular text-[10px] uppercase tracking-[0.16em] text-[#D61914] dark:text-[#E7FA53] mb-1.5">
                    {plate.code}
                  </p>
                  <h3 className="font-display font-bold uppercase text-base sm:text-lg leading-tight tracking-tight text-[#0B0B0B] dark:text-[#EFEFE9] group-hover:text-[#D61914] dark:group-hover:text-[#E7FA53] transition-colors">
                    {titleStr}
                  </h3>
                </div>
                <p className="font-sans-body text-xs sm:text-sm text-[#0B0B0B]/70 dark:text-[#EFEFE9]/70 leading-relaxed mt-2.5">
                  {t(plate.note)}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
