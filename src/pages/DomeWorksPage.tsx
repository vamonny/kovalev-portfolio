import { useMemo, useRef, useState } from 'react';
import { ArrowUpRight, Palette, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useProjects } from '../context/ProjectsContext';
import { useSound } from '../context/SoundContext';
import { useCurtainNavigation } from '../context/NavigationContext';
import { DomeGallery, DomeGalleryHandle, DomeImageItem } from '../components/DomeGallery';

type DomeFilter = 'all' | 'slot-01' | 'slot-02' | 'slot-03' | 'slot-04' | 'slot-05' | 'slot-06';

interface TaggedDomeItem extends DomeImageItem {
  projectId: string;
}

export function DomeWorksPage() {
  const { isDark } = useTheme();
  const { lang, t } = useLanguage();
  const { projects } = useProjects();
  const { playClick, playHover, playMorph, playPluck } = useSound();
  const { navigateWithCurtain } = useCurtainNavigation();

  const domeRef = useRef<DomeGalleryHandle>(null);

  const [filter, setFilter] = useState<DomeFilter>('all');
  const [grayscale, setGrayscale] = useState(false);
  const isLightTheme = !isDark;
  const [inspected, setInspected] = useState<DomeImageItem | null>(null);

  const allItems = useMemo<TaggedDomeItem[]>(() => {
    const byProject: Record<string, TaggedDomeItem[]> = {
      'slot-01': [],
      'slot-02': [],
      'slot-03': [],
      'slot-04': [],
      'slot-05': [],
      'slot-06': [],
    };
    const seenSrc = new Set<string>();

    const pushUnique = (
      projectId: string,
      src: string | undefined,
      alt: string,
      projectSlug: string,
      projectTitle: string,
      categoryLabel: string,
      year: string
    ) => {
      if (!src || seenSrc.has(src)) return;
      seenSrc.add(src);
      byProject[projectId]?.push({
        projectId,
        src,
        alt,
        projectSlug,
        projectTitle,
        categoryLabel,
        year,
      });
    };

    for (const p of projects) {
      if (p.isSlotPlaceholder) continue;
      const title = t(p.title);
      const cat = t(p.categoryLabel);

      if (p.id === 'slot-01') {
        pushUnique('slot-01', p.coverImage, title, p.slug, title, cat, p.year);
        p.beforeAfter?.pairs.forEach((pair) => {
          pushUnique('slot-01', pair.afterSrc, `${title} · ${t(pair.label)}`, p.slug, title, cat, p.year);
        });
        p.beforeAfter?.extraPlates?.forEach((plate) => {
          if (plate.tag.includes('BEFORE')) return;
          pushUnique('slot-01', plate.src, t(plate.caption), p.slug, title, cat, p.year);
        });
      }

      if (p.id === 'slot-02') {
        p.marketplaceSeries?.forEach((series) => {
          if (series.spreadImage) {
            pushUnique(
              'slot-02',
              series.spreadImage.src,
              `${t(series.name)} · ${t(series.spreadImage.caption)}`,
              p.slug,
              title,
              cat,
              p.year
            );
          }
          series.slides.forEach((slide) => {
            pushUnique(
              'slot-02',
              slide.src,
              `${t(series.name)} · ${t(slide.label)}`,
              p.slug,
              title,
              cat,
              p.year
            );
          });
        });
      }

      if (p.id === 'slot-03') {
        pushUnique('slot-03', p.coverImage, title, p.slug, title, cat, p.year);
        p.encyclopediaData?.spreads.forEach((sp) => {
          pushUnique(
            'slot-03',
            sp.src,
            `${lang === 'ru' ? 'Глава' : 'Chapter'} ${sp.chapter} · ${t(sp.title)}`,
            p.slug,
            title,
            cat,
            p.year
          );
        });
      }

      if (p.id === 'slot-04') {
        pushUnique('slot-04', p.coverImage, 'logofolio. (2024–2026)', p.slug, title, cat, p.year);
        if (p.logofolioData?.coverPlateSrc) {
          pushUnique('slot-04', p.logofolioData.coverPlateSrc, 'logofolio. Plate', p.slug, title, cat, p.year);
        }
        p.logofolioData?.plates.forEach((plate) => {
          pushUnique(
            'slot-04',
            plate.src,
            `${plate.brand} · ${t(plate.niche)} (${plate.year})`,
            p.slug,
            title,
            cat,
            plate.year
          );
        });
      }

      if (p.id === 'slot-05') {
        pushUnique('slot-05', p.coverImage, title, p.slug, title, cat, p.year);
        p.brandbookData?.slides.forEach((slide) => {
          pushUnique('slot-05', slide.src, `${t(slide.title)} (${slide.page})`, p.slug, title, cat, p.year);
        });
      }

      if (p.id === 'slot-06') {
        p.identityPlates?.forEach((plate) => {
          pushUnique('slot-06', plate.src, `${t(plate.title)} (${plate.code})`, p.slug, title, cat, p.year);
        });
      }
    }

    const buckets = [
      byProject['slot-06'],
      byProject['slot-05'],
      byProject['slot-04'],
      byProject['slot-02'],
      byProject['slot-01'],
      byProject['slot-03'],
    ];
    const maxLen = Math.max(...buckets.map((b) => b.length));
    const mixed: TaggedDomeItem[] = [];
    for (let i = 0; i < maxLen; i++) {
      for (const b of buckets) {
        if (b[i]) mixed.push(b[i]);
      }
    }
    return mixed;
  }, [lang, projects, t]);

  const filteredItems = useMemo(
    () => (filter === 'all' ? allItems : allItems.filter((item) => item.projectId === filter)),
    [allItems, filter]
  );

  const filterTabs: Array<{ id: DomeFilter; label: string }> = [
    { id: 'all', label: lang === 'ru' ? 'Все работы' : 'All works' },
    { id: 'slot-06', label: 'OpenSpace' },
    { id: 'slot-05', label: 'PAFOS' },
    { id: 'slot-04', label: lang === 'ru' ? 'Логофолио' : 'Logofolio' },
    { id: 'slot-02', label: 'WB / Ozon' },
    { id: 'slot-03', label: lang === 'ru' ? 'Энциклопедия' : 'Encyclopedia' },
    { id: 'slot-01', label: lang === 'ru' ? 'Семья НН' : 'Dentistry' },
  ];

  const openInspectedCase = () => {
    if (!inspected?.projectSlug) return;
    document.body.classList.remove('dg-scroll-lock');
    const titleStr = inspected.projectTitle || inspected.alt || 'CASE';
    const words = titleStr.split(' ');
    const split = Math.ceil(words.length / 2);
    navigateWithCurtain(`/works/${inspected.projectSlug}`, {
      italicLine: words.slice(0, split).join(' '),
      regularLine: words.slice(split).join(' ') || 'ARCHIVE',
      thumbnail: inspected.src,
    });
  };

  const overlayColor = isLightTheme ? '#EFEFE9' : '#101014';

  return (
    <div
      style={{ backgroundColor: overlayColor }}
      className="relative w-screen h-[100dvh] overflow-hidden select-none transition-colors duration-200"
    >
      <div className="w-full h-full">
        <DomeGallery
          ref={domeRef}
          images={filteredItems}
          fit={0.9}
          minRadius={800}
          maxVerticalRotationDeg={20}
          overlayBlurColor={overlayColor}
          grayscale={grayscale}
          isLightTheme={isLightTheme}
          imageBorderRadius="16px"
          openedImageBorderRadius="16px"
          openedImageWidth="min(84vw, 760px)"
          openedImageHeight="min(66vh, 520px)"
          onInspectChange={setInspected}
          onTileActivate={() => playPluck(1.04)}
        />
      </div>

      {/* Connected Filter Controls Bar Beneath Top Header */}
      <div className="pointer-events-none fixed top-16 sm:top-20 left-0 right-0 z-30 px-4 sm:px-8 flex flex-wrap items-center justify-between gap-3">
        <h1
          className={`pointer-events-auto type-heading font-display font-bold ${
            isLightTheme ? 'text-[#0B0B0B]' : 'text-[#EFEFE9]'
          }`}
        >
          {lang === 'ru' ? '3D сфера работ' : '3D works sphere'}
        </h1>

        <div className="pointer-events-auto flex flex-wrap items-center gap-2">
          <div
            role="tablist"
            aria-label={lang === 'ru' ? 'Фильтр 3D сферы' : '3D sphere filter'}
            className={`inline-flex flex-wrap items-center gap-1 p-1 rounded-[8px] ${
              isLightTheme ? 'liquid-glass-light' : 'liquid-glass-dark'
            }`}
          >
            {filterTabs.map((tab) => {
              const active = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    playMorph();
                    setFilter(tab.id);
                  }}
                  onMouseEnter={() => playHover()}
                  className={`px-3 py-1 rounded-[6px] type-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 ${
                    active
                      ? isLightTheme
                        ? 'bg-[#0B0B0B] text-[#E7FA53] font-semibold'
                        : 'bg-[#E7FA53] text-[#0B0B0B] font-semibold'
                      : isLightTheme
                      ? 'text-[#0B0B0B]/78 hover:text-[#0B0B0B]'
                      : 'text-[#EFEFE9]/78 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => {
              playClick();
              setGrayscale((g) => !g);
            }}
            onMouseEnter={() => playHover()}
            className={`px-3 py-2 rounded-[8px] type-sm font-medium inline-flex items-center gap-1.5 transition-colors duration-150 whitespace-nowrap shrink-0 ${
              isLightTheme ? 'liquid-glass-light text-[#0B0B0B]' : 'liquid-glass-dark text-[#EFEFE9]'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>
              {grayscale ? (lang === 'ru' ? 'Ч/Б' : 'B&W') : lang === 'ru' ? 'Цвет' : 'Color'}
            </span>
          </button>
        </div>
      </div>

      {/* Inspected Work Action Bar */}
      {inspected && (
        <div className="pointer-events-none fixed bottom-14 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-40 flex justify-center">
          <div
            className={`pointer-events-auto rounded-[10px] px-4 py-3 sm:px-5 flex flex-wrap items-center justify-between gap-4 max-w-[94vw] sm:max-w-2xl shadow-xl ${
              isLightTheme
                ? 'liquid-glass-light text-[#0B0B0B]'
                : 'liquid-glass-dark text-[#EFEFE9]'
            }`}
          >
            <div className="min-w-0">
              <p className="type-sm font-semibold truncate max-w-[60vw] sm:max-w-[360px]">
                {inspected.alt || inspected.projectTitle}
              </p>
              <p className="type-sm opacity-70 truncate">{inspected.categoryLabel}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {inspected.projectSlug && (
                <button
                  type="button"
                  onClick={openInspectedCase}
                  onMouseEnter={() => playHover()}
                  className={`px-4 py-2 rounded-[6px] type-sm font-semibold inline-flex items-center gap-1.5 transition-colors duration-150 whitespace-nowrap ${
                    isLightTheme
                      ? 'bg-[#0B0B0B] text-[#EFEFE9] hover:bg-[#D61914]'
                      : 'bg-[#E7FA53] text-[#0B0B0B] hover:bg-white'
                  }`}
                >
                  <span>{lang === 'ru' ? 'Открыть кейс' : 'Open case'}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  playClick();
                  domeRef.current?.close();
                }}
                aria-label={lang === 'ru' ? 'Закрыть' : 'Close'}
                className="w-9 h-9 rounded-[6px] border border-current/20 flex items-center justify-center transition-colors duration-150"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
