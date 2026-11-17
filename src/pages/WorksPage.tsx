import { useMemo, useState } from 'react';
import { ArrowUpRight, LayoutGrid, LayoutList } from 'lucide-react';
import { ProjectCase, ProjectCategory } from '../data/projects';
import { useProjects } from '../context/ProjectsContext';
import { useLanguage } from '../context/LanguageContext';
import { useSound } from '../context/SoundContext';
import { useCurtainNavigation } from '../context/NavigationContext';
import { translations } from '../i18n/translations';
import { ResilientImage } from '../components/ResilientImage';
import { RubberBlock } from '../components/RubberMotion';
import { RubberText } from '../components/RubberText';

type FilterKey = 'all' | 'uiux' | 'graphic' | 'logo' | 'identity';
type ViewMode = 'grid' | 'index';

interface ProjectPreviewPack {
  mainSrc: string;
  mainIsContain?: boolean;
  mainBg?: string;
}

const PREVIEW_PACKS: Record<string, ProjectPreviewPack> = {
  'slot-01': {
    mainSrc: '/assets/aistudio/Screenshot_2026-05-16_184350_51c20aa2.webp',
    mainBg: '#FFFFFF',
  },
  'slot-02': {
    mainSrc: '/assets/aistudio/4_becce05d.webp',
    mainBg: '#121318',
  },
  'slot-03': {
    mainSrc: '/assets/encyclopedia/spread-01.jpg',
    mainBg: '#F3EBDC',
  },
  'slot-04': {
    mainSrc: '/assets/aistudio/_______1_fb4c1100.png',
    mainIsContain: true,
    mainBg: '#FFFFFF',
  },
  'slot-05': {
    mainSrc: '/assets/aistudio/image_f0f056c2.webp',
    mainIsContain: true,
    mainBg: '#0D080E',
  },
  'slot-06': {
    mainSrc: '/assets/aistudio/________1_v2__1__9a171c73.png',
    mainBg: '#DCE1E6',
  },
};

export function WorksPage() {
  const { lang, t } = useLanguage();
  const { projects } = useProjects();
  const { playHover, playMorph, playClick } = useSound();
  const { navigateWithCurtain } = useCurtainNavigation();

  const [filter, setFilter] = useState<FilterKey>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [hoveredRow, setHoveredRow] = useState<ProjectCase | null>(null);

  const publishedProjects = useMemo(
    () => projects.filter((p) => !p.isSlotPlaceholder),
    [projects]
  );

  const filterOptions: { key: FilterKey; label: string; count: number }[] = [
    {
      key: 'all',
      label: lang === 'ru' ? 'Все кейсы' : 'All cases',
      count: publishedProjects.length,
    },
    {
      key: 'uiux',
      label: t(translations.works.categories.uiux),
      count: publishedProjects.filter((p) => p.category === 'uiux').length,
    },
    {
      key: 'graphic',
      label: lang === 'ru' ? 'Графика и книги' : 'Graphic & books',
      count: publishedProjects.filter((p) => p.category === 'graphic').length,
    },
    {
      key: 'logo',
      label: t(translations.works.categories.logo),
      count: publishedProjects.filter((p) => p.category === 'logo').length,
    },
    {
      key: 'identity',
      label: t(translations.works.categories.identity),
      count: publishedProjects.filter((p) => p.category === 'identity').length,
    },
  ];

  const filtered = useMemo(() => {
    if (filter === 'all') return publishedProjects;
    return publishedProjects.filter((p) => p.category === (filter as ProjectCategory));
  }, [publishedProjects, filter]);

  const openCase = (project: ProjectCase) => {
    const clean = t(project.title).replace(/^Слот \d+\s*—\s*|^Slot \d+\s*—\s*/i, '');
    const words = clean.split(' ');
    const split = Math.ceil(words.length / 2);
    const pack = PREVIEW_PACKS[project.id];
    navigateWithCurtain(`/works/${project.slug}`, {
      italicLine: words.slice(0, split).join(' '),
      regularLine: words.slice(split).join(' ') || project.slotCode,
      thumbnail: pack?.mainSrc || project.heroImage || project.coverImage,
    });
  };

  return (
    <div className="bg-[#EFEFE9] dark:bg-[#0C0C0F] text-[#0B0B0B] dark:text-[#EFEFE9] min-h-screen pt-20 sm:pt-24 pb-20 px-4 sm:px-8 transition-colors duration-200 overflow-x-hidden">
      <div className="max-w-[1320px] mx-auto">
        {/* Compact Masthead + Inline Filters with Scroll Flex */}
        <RubberBlock immediate skewFactor={0.55} driftFactor={6}>
          <header className="pb-6 border-b border-[#0B0B0B]/12 dark:border-white/12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <h1 className="font-display font-extrabold tracking-[-0.045em] leading-[0.95] text-[clamp(2rem,4vw,3.4rem)] text-balance-safe">
                  <RubberText text={t(translations.works.title)} stretchStrength={0.85} />
                </h1>
                <p className="type-body text-[#0B0B0B]/70 dark:text-[#EFEFE9]/70 max-w-[54ch] mt-2.5">
                  {t(translations.works.lead)}
                </p>
              </div>

              <div className="inline-flex items-center gap-1 p-1 bg-[#E5E4DC] dark:bg-[#16161B] rounded-[6px] type-sm font-medium self-start md:self-auto shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    setViewMode('grid');
                  }}
                  aria-pressed={viewMode === 'grid'}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[5px] transition-colors duration-150 whitespace-nowrap shrink-0 ${
                    viewMode === 'grid'
                      ? 'bg-[#0B0B0B] dark:bg-[#E7FA53] text-[#EFEFE9] dark:text-[#0B0B0B] font-semibold'
                      : 'text-[#0B0B0B]/70 dark:text-[#EFEFE9]/70 hover:text-[#0B0B0B] dark:hover:text-[#EFEFE9]'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>{lang === 'ru' ? 'Сетка' : 'Grid'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    setViewMode('index');
                  }}
                  aria-pressed={viewMode === 'index'}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[5px] transition-colors duration-150 whitespace-nowrap shrink-0 ${
                    viewMode === 'index'
                      ? 'bg-[#0B0B0B] dark:bg-[#E7FA53] text-[#EFEFE9] dark:text-[#0B0B0B] font-semibold'
                      : 'text-[#0B0B0B]/70 dark:text-[#EFEFE9]/70 hover:text-[#0B0B0B] dark:hover:text-[#EFEFE9]'
                  }`}
                >
                  <LayoutList className="w-3.5 h-3.5" />
                  <span>{lang === 'ru' ? 'Таблица' : 'Index'}</span>
                </button>
              </div>
            </div>

            <div
              role="tablist"
              aria-label={lang === 'ru' ? 'Фильтр по направлениям' : 'Filter by discipline'}
              className="inline-flex flex-wrap items-center gap-1 p-1 bg-[#E5E4DC] dark:bg-[#16161B] rounded-[6px]"
            >
              {filterOptions.map((opt) => {
                const active = filter === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => {
                      playMorph();
                      setFilter(opt.key);
                    }}
                    onMouseEnter={() => playHover()}
                    className={`px-3.5 py-1.5 rounded-[5px] type-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 ${
                      active
                        ? 'bg-[#0B0B0B] dark:bg-[#E7FA53] text-[#EFEFE9] dark:text-[#0B0B0B] font-semibold'
                        : 'text-[#0B0B0B]/70 dark:text-[#EFEFE9]/70 hover:text-[#0B0B0B] dark:hover:text-[#EFEFE9]'
                    }`}
                  >
                    <span>{opt.label}</span>
                    <span className="tabular-nums opacity-65">{opt.count}</span>
                  </button>
                );
              })}
            </div>
          </header>
        </RubberBlock>

        {/* VIEW 1: Clean 2-Column Editorial Grid with Counter-Flex Scroll Motion */}
        {viewMode === 'grid' ? (
          <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-11">
            {filtered.map((project, idx) => {
              const pack = PREVIEW_PACKS[project.id];
              const cleanTitle = t(project.title).replace(
                /^Слот \d+\s*—\s*|^Slot \d+\s*—\s*/i,
                ''
              );
              const isLeft = idx % 2 === 0;

              return (
                <RubberBlock
                  key={project.id}
                  immediate={idx < 2}
                  skewFactor={isLeft ? 0.85 : -0.85}
                  driftFactor={isLeft ? 8 : -8}
                  delay={isLeft ? 0 : 0.04}
                >
                  <article className="group flex flex-col">
                    <button
                      type="button"
                      onClick={() => openCase(project)}
                      onMouseEnter={() => playHover()}
                      data-cursor={lang === 'ru' ? 'Открыть' : 'Open'}
                      className="block w-full text-left"
                    >
                      <div
                        style={{ backgroundColor: pack?.mainBg || '#FFFFFF' }}
                        className="w-full aspect-[16/10] overflow-hidden border border-[#0B0B0B]/12 dark:border-white/12 rounded-[4px]"
                      >
                        <ResilientImage
                          src={pack?.mainSrc || project.heroImage || project.coverImage}
                          alt={cleanTitle}
                          fallbackTitle={project.slotCode}
                          className="w-full h-full"
                          imgClassName={`w-full h-full ${
                            pack?.mainIsContain ? 'object-contain p-3 sm:p-4' : 'object-cover'
                          } transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.025]`}
                        />
                      </div>

                      <div className="pt-4 flex flex-col gap-1.5">
                        <div className="flex items-center justify-between gap-4">
                          <span className="type-sm text-[#0B0B0B]/60 dark:text-[#EFEFE9]/60">
                            {t(project.categoryLabel)} · {project.year.split('·')[0].trim()}
                          </span>

                          <div className="flex items-center gap-1.5" aria-hidden="true">
                            {project.typographySpec.palette.slice(0, 4).map((hex) => (
                              <span
                                key={hex}
                                style={{ backgroundColor: hex }}
                                className="w-3 h-3 rounded-full border border-[#0B0B0B]/18 dark:border-white/20 inline-block"
                              />
                            ))}
                          </div>
                        </div>

                        <div className="flex items-baseline justify-between gap-3">
                          <h2 className="type-heading font-display font-bold text-[#0B0B0B] dark:text-[#EFEFE9] group-hover:text-[#D61914] dark:group-hover:text-[#E7FA53] transition-colors duration-150">
                            {cleanTitle}
                          </h2>
                          <ArrowUpRight className="w-4 h-4 shrink-0 text-[#0B0B0B]/45 dark:text-[#EFEFE9]/45 group-hover:text-[#D61914] dark:group-hover:text-[#E7FA53] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-[transform,color] duration-150" />
                        </div>

                        <p className="type-body text-[#0B0B0B]/75 dark:text-[#EFEFE9]/75 line-clamp-2 max-w-[54ch]">
                          {t(project.subtitle)}
                        </p>
                      </div>
                    </button>
                  </article>
                </RubberBlock>
              );
            })}
          </div>
        ) : (
          /* VIEW 2: Structured Index Table with Counter-Flex Preview */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-8 items-start">
            <RubberBlock
              immediate
              skewFactor={0.75}
              driftFactor={7}
              className="lg:col-span-8 divide-y divide-[#0B0B0B]/12 dark:divide-white/12 border-b border-[#0B0B0B]/12 dark:border-white/12"
            >
              {filtered.map((project, idx) => {
                const cleanTitle = t(project.title).replace(
                  /^Слот \d+\s*—\s*|^Slot \d+\s*—\s*/i,
                  ''
                );
                const isActive = (hoveredRow || filtered[0])?.id === project.id;

                return (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => openCase(project)}
                    onMouseEnter={() => {
                      playHover();
                      setHoveredRow(project);
                    }}
                    className={`w-full text-left py-4 px-3 grid grid-cols-12 gap-3 items-baseline transition-colors duration-150 ${
                      isActive
                        ? 'bg-[#E5E4DC]/75 dark:bg-[#16161B]'
                        : 'hover:bg-[#E5E4DC]/40 dark:hover:bg-[#16161B]/60'
                    }`}
                  >
                    <span className="col-span-2 sm:col-span-1 tabular-nums type-sm font-semibold text-[#D61914] dark:text-[#E7FA53]">
                      {idx + 1}
                    </span>
                    <span className="col-span-10 sm:col-span-6 font-display font-bold text-base sm:text-lg tracking-tight text-[#0B0B0B] dark:text-[#EFEFE9]">
                      {cleanTitle}
                    </span>
                    <span className="col-span-8 sm:col-span-3 col-start-3 sm:col-start-auto type-sm text-[#0B0B0B]/65 dark:text-[#EFEFE9]/65 truncate">
                      {t(project.categoryLabel)}
                    </span>
                    <span className="col-span-4 sm:col-span-2 text-right tabular-nums type-sm text-[#0B0B0B]/70 dark:text-[#EFEFE9]/70 inline-flex items-center justify-end gap-1">
                      <span>{project.year.split('·')[0].trim()}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </button>
                );
              })}
            </RubberBlock>

            <RubberBlock
              immediate
              skewFactor={-0.75}
              driftFactor={-7}
              delay={0.05}
              className="hidden lg:block lg:col-span-4 sticky top-24"
            >
              {(() => {
                const previewProj = hoveredRow || filtered[0];
                if (!previewProj) return null;
                const pack = PREVIEW_PACKS[previewProj.id];
                return (
                  <button
                    type="button"
                    onClick={() => openCase(previewProj)}
                    className="block w-full text-left border border-[#0B0B0B]/12 dark:border-white/12 bg-white dark:bg-[#16161B] rounded-[4px] overflow-hidden"
                  >
                    <div
                      style={{ backgroundColor: pack?.mainBg || '#FFFFFF' }}
                      className="aspect-[16/10] w-full overflow-hidden border-b border-[#0B0B0B]/10 dark:border-white/12"
                    >
                      <ResilientImage
                        src={pack?.mainSrc || previewProj.heroImage || previewProj.coverImage}
                        alt={t(previewProj.title)}
                        fallbackTitle={previewProj.slotCode}
                        className="w-full h-full"
                        imgClassName={`w-full h-full ${
                          pack?.mainIsContain ? 'object-contain p-3' : 'object-cover'
                        }`}
                      />
                    </div>
                    <div className="p-5 space-y-1.5">
                      <p className="type-sm font-medium text-[#D61914] dark:text-[#E7FA53]">
                        {t(previewProj.categoryLabel)}
                      </p>
                      <p className="type-body text-[#0B0B0B]/80 dark:text-[#EFEFE9]/80">
                        {t(previewProj.subtitle)}
                      </p>
                    </div>
                  </button>
                );
              })()}
            </RubberBlock>
          </div>
        )}
      </div>
    </div>
  );
}
