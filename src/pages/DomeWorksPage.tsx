import { useMemo, useRef, useState } from 'react';
import { ArrowUpRight, Grid2x2, Moon, Palette, Sun, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useProjects } from '../context/ProjectsContext';
import { useSound } from '../context/SoundContext';
import { useCurtainNavigation } from '../context/NavigationContext';
import { DomeGallery, DomeGalleryHandle, DomeImageItem } from '../components/DomeGallery';
import { ScrambleText } from '../components/ScrambleText';

type DomeFilter = 'all' | 'slot-01' | 'slot-02' | 'slot-03' | 'slot-04' | 'slot-05' | 'slot-06';

interface TaggedDomeItem extends DomeImageItem {
  projectId: string;
}

export function DomeWorksPage() {
  const { isDark, toggleTheme } = useTheme();
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
          pushUnique(
            'slot-01',
            pair.afterSrc,
            `${title} — ${t(pair.label)}`,
            p.slug,
            title,
            cat,
            p.year
          );
        });
        p.beforeAfter?.extraPlates?.forEach((plate) => {
          if (plate.tag.includes('BEFORE')) return;
          pushUnique(
            'slot-01',
            plate.src,
            t(plate.caption),
            p.slug,
            title,
            cat,
            p.year
          );
        });
      }

      if (p.id === 'slot-02') {
        p.marketplaceSeries?.forEach((series) => {
          if (series.spreadImage) {
            pushUnique(
              'slot-02',
              series.spreadImage.src,
              `${t(series.name)} — ${t(series.spreadImage.caption)}`,
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
        pushUnique(
          'slot-04',
          p.coverImage,
          'logofolio. (2024–2026)',
          p.slug,
          title,
          cat,
          p.year
        );
        if (p.logofolioData?.coverPlateSrc) {
          pushUnique(
            'slot-04',
            p.logofolioData.coverPlateSrc,
            'logofolio. Plate (2024–2026)',
            p.slug,
            title,
            cat,
            p.year
          );
        }
        p.logofolioData?.plates.forEach((plate) => {
          pushUnique(
            'slot-04',
            plate.src,
            `${plate.brand} — ${t(plate.niche)} (${plate.year})`,
            p.slug,
            title,
            cat,
            plate.year
          );
        });
      }
      if (p.id === 'slot-05') {
        pushUnique('slot-05', p.coverImage, `${title} — VIP Suite`, p.slug, title, cat, p.year);
        p.brandbookData?.slides.forEach((slide) => {
          pushUnique(
            'slot-05',
            slide.src,
            `${t(slide.title)} (${slide.page})`,
            p.slug,
            title,
            cat,
            p.year
          );
        });
      }

      if (p.id === 'slot-06') {
        p.identityPlates?.forEach((plate) => {
          pushUnique(
            'slot-06',
            plate.src,
            `${t(plate.title)} (${plate.code})`,
            p.slug,
            title,
            cat,
            p.year
          );
        });
      }
    }

    // Interleave rounds across projects so adjacent dome tiles show rich visual contrast
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
    { id: 'all', label: lang === 'ru' ? 'Все работы' : 'All Works' },
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
      className="relative w-screen h-[100dvh] overflow-hidden select-none transition-colors duration-300"
    >
      {/* Fullscreen React Bits 3D Dome Gallery */}
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
          imageBorderRadius="18px"
          openedImageBorderRadius="18px"
          openedImageWidth="min(84vw, 760px)"
          openedImageHeight="min(66vh, 520px)"
          onInspectChange={setInspected}
          onTileActivate={() => playPluck(1.04)}
        />
      </div>

      {/* Top HUD Bar (sits cleanly beneath global GooeyNav dock) */}
      <header className="pointer-events-none fixed top-0 left-0 right-0 z-30 pt-[66px] sm:pt-[76px] px-3.5 sm:px-5 pb-2 pr-4 sm:pr-20 flex flex-col gap-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div
            className={`pointer-events-auto inline-flex items-center gap-3 px-3.5 py-2 rounded-[14px] ${
              isLightTheme
                ? 'liquid-glass-light text-[#0B0B0B]'
                : 'liquid-glass-dark text-[#EFEFE9]'
            }`}
          >
            <div>
              <p className="font-mono-tabular text-[9px] sm:text-[10px] uppercase tracking-[0.16em] text-[#D61914] font-semibold leading-none mb-1">
                <ScrambleText
                  text={
                    lang === 'ru'
                      ? `3D СФЕРА · ${filteredItems.length} РАБОТ`
                      : `3D DOME · ${filteredItems.length} WORKS`
                  }
                  triggerKey={`dome-cnt-${filteredItems.length}-${lang}`}
                  duration={260}
                />
              </p>
              <h1 className="font-display font-bold uppercase tracking-[-0.03em] text-sm sm:text-base leading-none">
                {lang === 'ru' ? (
                  <>
                    Вся экспозиция{' '}
                    <span className="font-serif-editorial italic font-semibold lowercase text-[#D61914] dark:text-[#E7FA53]">
                      в сфере
                    </span>
                  </>
                ) : (
                  <>
                    Full Exhibition{' '}
                    <span className="font-serif-editorial italic font-semibold lowercase text-[#D61914] dark:text-[#E7FA53]">
                      sphere
                    </span>
                  </>
                )}
              </h1>
            </div>

            <span
              aria-hidden="true"
              className={`h-6 w-px ${isLightTheme ? 'bg-[#0B0B0B]/15' : 'bg-white/15'}`}
            />

            <button
              type="button"
              onClick={() => {
                document.body.classList.remove('dg-scroll-lock');
                navigateWithCurtain('/works', {
                  italicLine: lang === 'ru' ? 'СЕТКА' : 'GRID',
                  regularLine: lang === 'ru' ? 'РАБОТ' : 'WORKS',
                });
              }}
              onMouseEnter={() => playHover()}
              className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono-tabular font-semibold uppercase tracking-[0.06em] hover:text-[#D61914] transition-colors whitespace-nowrap"
            >
              <Grid2x2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {lang === 'ru' ? 'Сетка' : 'Grid'}
              </span>
            </button>
          </div>

          {/* Theme + Color + Filter Toolbar */}
          <div className="pointer-events-auto flex flex-wrap items-center gap-1.5">
            {filterTabs.map((tab) => {
              const active = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    playMorph();
                    setFilter(tab.id);
                  }}
                  onMouseEnter={() => playHover()}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-[10px] text-[10px] sm:text-[11px] font-mono-tabular font-semibold uppercase tracking-[0.04em] transition-all border ${
                    active
                      ? isLightTheme
                        ? 'bg-[#0B0B0B] text-[#E7FA53] border-[#0B0B0B]'
                        : 'bg-[#E7FA53] text-[#0B0B0B] border-[#E7FA53]'
                      : isLightTheme
                      ? 'liquid-glass-light text-[#0B0B0B]/85 hover:text-[#D61914]'
                      : 'liquid-glass-dark text-[#EFEFE9]/85 hover:text-[#E7FA53]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => {
                playClick();
                setGrayscale((g) => !g);
              }}
              onMouseEnter={() => playHover()}
              title={lang === 'ru' ? 'Переключить цвет / ЧБ' : 'Toggle Color / Grayscale'}
              className={`px-2.5 py-1.5 rounded-[10px] text-[10px] sm:text-[11px] font-mono-tabular font-semibold uppercase tracking-[0.04em] inline-flex items-center gap-1.5 transition-colors ${
                isLightTheme
                  ? 'liquid-glass-light text-[#0B0B0B]'
                  : 'liquid-glass-dark text-[#EFEFE9]'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span className="hidden md:inline">
                {grayscale ? (lang === 'ru' ? 'Ч/Б' : 'B&W') : lang === 'ru' ? 'Цвет' : 'Color'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                playClick();
                toggleTheme();
              }}
              onMouseEnter={() => playHover()}
              aria-label={lang === 'ru' ? 'Сменить тему сайта' : 'Toggle theme'}
              className={`w-8 h-8 rounded-[10px] inline-flex items-center justify-center transition-colors ${
                isLightTheme
                  ? 'liquid-glass-light text-[#0B0B0B] hover:text-[#D61914]'
                  : 'liquid-glass-dark text-[#EFEFE9] hover:text-[#E7FA53]'
              }`}
            >
              {isLightTheme ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Bottom Gesture Hint (hidden when inspecting a work) */}
      {!inspected && (
        <div className="pointer-events-none fixed bottom-12 sm:bottom-14 left-4 sm:left-7 z-20 pr-16">
          <p
            className={`inline-block px-3 py-1.5 rounded-[10px] font-mono-tabular text-[10px] uppercase tracking-[0.12em] ${
              isLightTheme
                ? 'liquid-glass-light text-[#0B0B0B]/70'
                : 'liquid-glass-dark text-[#EFEFE9]/75'
            }`}
          >
            {lang === 'ru'
              ? 'Тяните или крутите колесо · Клик — открыть работу'
              : 'Drag or scroll to orbit · Click tile to inspect'}
          </p>
        </div>
      )}

      {/* Inspected Work Action Bar (appears when a tile enlarges) */}
      {inspected && (
        <div className="pointer-events-none fixed bottom-12 sm:bottom-14 left-4 right-16 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-40 flex justify-center">
          <div
            className={`pointer-events-auto rounded-[16px] px-4 py-2.5 sm:px-5 sm:py-3 flex flex-wrap items-center justify-between gap-3 sm:gap-5 max-w-[92vw] sm:max-w-2xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.35)] ${
              isLightTheme
                ? 'liquid-glass-light text-[#0B0B0B]'
                : 'liquid-glass-dark text-[#EFEFE9]'
            }`}
          >
            <div className="min-w-0">
              <p
                className={`font-mono-tabular text-[9px] sm:text-[10px] uppercase tracking-[0.14em] font-semibold truncate ${
                  isLightTheme ? 'text-[#D61914]' : 'text-[#E7FA53]'
                }`}
              >
                {inspected.categoryLabel}
                {inspected.year ? ` · ${inspected.year}` : ''}
              </p>
              <p
                className={`font-display font-bold text-xs sm:text-sm uppercase tracking-tight truncate max-w-[56vw] sm:max-w-[320px] ${
                  isLightTheme ? 'text-[#0B0B0B]' : 'text-[#EFEFE9]'
                }`}
              >
                {inspected.alt || inspected.projectTitle}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {inspected.projectSlug && (
                <button
                  type="button"
                  onClick={openInspectedCase}
                  onMouseEnter={() => playHover()}
                  className={`px-3.5 py-2 rounded-[10px] text-[10px] sm:text-[11px] font-mono-tabular font-semibold uppercase tracking-[0.06em] inline-flex items-center gap-1.5 transition-colors ${
                    isLightTheme
                      ? 'bg-[#0B0B0B] text-[#EFEFE9] hover:bg-[#D61914]'
                      : 'bg-[#E7FA53] text-[#0B0B0B] hover:bg-[#D61914] hover:text-[#EFEFE9]'
                  }`}
                >
                  <span>{lang === 'ru' ? 'Открыть кейс' : 'Open Case'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  playClick();
                  domeRef.current?.close();
                }}
                aria-label={lang === 'ru' ? 'Закрыть' : 'Close'}
                className="w-8 h-8 rounded-[10px] border border-[#0B0B0B]/15 hover:bg-[#0B0B0B] hover:text-[#EFEFE9] flex items-center justify-center transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
