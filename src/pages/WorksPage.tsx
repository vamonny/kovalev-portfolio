import { useMemo, useState } from 'react';
import { ArrowUpRight, LayoutList, Rows3 } from 'lucide-react';
import { ProjectCase, ProjectCategory } from '../data/projects';
import { useProjects } from '../context/ProjectsContext';
import { useLanguage } from '../context/LanguageContext';
import { useSound } from '../context/SoundContext';
import { useCurtainNavigation } from '../context/NavigationContext';
import { useRubberScroll } from '../hooks/useRubberScroll';
import { translations } from '../i18n/translations';
import { ScrambleText } from '../components/ScrambleText';
import { RubberText } from '../components/RubberText';
import { RubberBlock, RubberWords } from '../components/RubberMotion';
import { ResilientImage } from '../components/ResilientImage';

type FilterKey = 'all' | 'uiux' | 'graphic' | 'logo' | 'identity';
type ViewMode = 'editorial' | 'index';

interface ProjectPreviewPack {
  mainSrc: string;
  mainIsContain?: boolean;
  mainBg?: string;
  strip: Array<{ src: string; bg?: string; isContain?: boolean }>;
  scopeSummary: { ru: string; en: string };
}

const PREVIEW_PACKS: Record<string, ProjectPreviewPack> = {
  'slot-01': {
    mainSrc: '/assets/aistudio/Screenshot_2026-05-16_184350_51c20aa2.webp',
    mainBg: '#FFFFFF',
    strip: [
      { src: '/assets/aistudio/image_62a6c9c4.webp', bg: '#FFFFFF', isContain: true },
      { src: '/assets/aistudio/Screenshot_2026-05-16_184441_cc36e6e8.webp', bg: '#FFFFFF' },
      { src: '/assets/aistudio/Screenshot_2026-05-16_184505_8a77c64a.webp', bg: '#FFFFFF' },
    ],
    scopeSummary: {
      ru: 'Многостраничный сайт · 4 пары До/После · ГОСТ и SEO',
      en: 'Multi-page website · 4 Before/After pairs · GOST & SEO',
    },
  },
  'slot-02': {
    mainSrc: '/assets/aistudio/4_becce05d.webp',
    mainBg: '#121318',
    strip: [
      { src: '/assets/aistudio/image_cf7f3a44.webp', bg: '#1D1E26' },
      { src: '/assets/aistudio/______d804c5ad.webp', bg: '#EDEDEF' },
      { src: '/assets/aistudio/f_64769fa72e404262_19048e6c.webp', bg: '#090B0E' },
    ],
    scopeSummary: {
      ru: '5 товарных серий · Фен, iPhone, Мышь, Чайник, Носки',
      en: '5 Product Series · Dryer, iPhone, Mouse, Kettle, Socks',
    },
  },
  'slot-03': {
    mainSrc: '/assets/encyclopedia/spread-01.jpg',
    mainBg: '#F3EBDC',
    strip: [
      { src: '/assets/aistudio/image_15316a87.webp', bg: '#F3EBDC' },
      { src: '/assets/encyclopedia/spread-09.jpg', bg: '#F3EBDC' },
      { src: '/assets/encyclopedia/spread-22.jpg', bg: '#F3EBDC' },
    ],
    scopeSummary: {
      ru: '61 страница · 30 глав и разворотов · PDF-издание',
      en: '61 Pages · 30 Illustrated Chapters · Complete PDF',
    },
  },
  'slot-04': {
    mainSrc: '/assets/aistudio/_______1_fb4c1100.png',
    mainIsContain: true,
    mainBg: '#FFFFFF',
    strip: [
      { src: '/assets/aistudio/2_a410a25e.png', bg: '#FFFFFF', isContain: true },
      { src: '/assets/aistudio/3_4a5de5f7.png', bg: '#FFFFFF', isContain: true },
      { src: '/assets/aistudio/7_1a85b4f3.png', bg: '#FFFFFF', isContain: true },
    ],
    scopeSummary: {
      ru: '10 авторских логотипов · Титульный лист · 2024–2026',
      en: '10 Brand Marks · Title Sheet · 2024–2026 Collection',
    },
  },
  'slot-05': {
    mainSrc: '/assets/aistudio/image_f0f056c2.webp',
    mainIsContain: true,
    mainBg: '#0D080E',
    strip: [
      { src: '/assets/pafos/slide-01.jpg', bg: '#140F16' },
      { src: '/assets/pafos/slide-04.jpg', bg: '#140F16' },
      { src: '/assets/pafos/slide-06.jpg', bg: '#140F16' },
    ],
    scopeSummary: {
      ru: '17 слайдов брендбука · Лого-сетка · VIP-носители и неон',
      en: '17 Guideline Slides · Logo Grid · VIP Carriers & Neon',
    },
  },
  'slot-06': {
    mainSrc: '/assets/aistudio/________1_v2_54930af9.webp',
    mainBg: '#DCE1E6',
    strip: [
      { src: '/assets/aistudio/_____1_14cdffdb.png', bg: '#070E1A' },
      { src: '/assets/aistudio/Frame_2_15061e1a.webp', bg: '#FFFFFF', isContain: true },
      { src: '/assets/aistudio/_____-Photoroom_1_e7ba0eea.webp', bg: '#FFFFFF', isContain: true },
    ],
    scopeSummary: {
      ru: '11 носителей · Лого, паттерн, полиграфия, мерч и веб UI/UX',
      en: '11 Touchpoints · Logo, Pattern, Print, Merch & Web UI/UX',
    },
  },
};

export function WorksPage() {
  const { lang, t } = useLanguage();
  const { projects } = useProjects();
  const { playHover, playMorph, playClick } = useSound();
  const { navigateWithCurtain } = useCurtainNavigation();
  const scrollVel = useRubberScroll(0.05);

  const [filter, setFilter] = useState<FilterKey>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('editorial');
  const [hoveredRow, setHoveredRow] = useState<ProjectCase | null>(null);

  const publishedProjects = useMemo(
    () => projects.filter((p) => !p.isSlotPlaceholder),
    [projects]
  );

  const filterOptions: { key: FilterKey; label: string; count: number }[] = [
    {
      key: 'all',
      label: lang === 'ru' ? 'Все кейсы' : 'All Cases',
      count: publishedProjects.length,
    },
    {
      key: 'uiux',
      label: t(translations.works.categories.uiux),
      count: publishedProjects.filter((p) => p.category === 'uiux').length,
    },
    {
      key: 'graphic',
      label: lang === 'ru' ? 'Графика и книги' : 'Graphic & Editorial',
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

  const rubberTilt = Math.max(-3.6, Math.min(3.6, scrollVel * 2.2));

  return (
    <div className="bg-[#EFEFE9] dark:bg-[#0C0C0F] text-[#0B0B0B] dark:text-[#EFEFE9] min-h-screen pt-20 sm:pt-24 pb-24 px-4 sm:px-7 transition-colors duration-300 overflow-x-hidden">
      <div className="max-w-[1400px] mx-auto">
        {/* Swiss-Italian Editorial Monograph Header */}
        <RubberBlock immediate skewFactor={0.7} driftFactor={6}>
          <div className="pb-4 border-b border-[#0B0B0B]/15 dark:border-white/15 flex flex-wrap items-center justify-between gap-3 pr-14 sm:pr-16">
            <span className="font-mono-tabular text-[11px] uppercase tracking-[0.2em] text-[#D61914] dark:text-[#E7FA53]">
              <ScrambleText
                text={
                  lang === 'ru'
                    ? `ЭКСПОЗИЦИЯ № 01–${String(publishedProjects.length).padStart(2, '0')} · 2024–2026`
                    : `EXHIBITION № 01–${String(publishedProjects.length).padStart(2, '0')} · 2024–2026`
                }
                triggerKey={`works-eye-${lang}`}
                duration={360}
              />
            </span>
            <span className="font-serif-editorial italic text-[13px] text-[#0B0B0B]/65 dark:text-[#EFEFE9]/65">
              {lang === 'ru' ? 'Кураторский архив кейсов' : 'Curated Case Monograph'}
            </span>
          </div>

          <div className="pt-8 sm:pt-12 pb-10 border-b border-[#0B0B0B]/15 dark:border-white/15 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7">
              <h1 className="font-display font-extrabold uppercase tracking-[-0.045em] leading-[0.94] text-[clamp(2.3rem,5vw,4.5rem)] text-balance-safe">
                <RubberText
                  text={lang === 'ru' ? 'Избранные' : 'Selected'}
                  stretchStrength={1.0}
                />{' '}
                <span className="font-serif-editorial italic font-semibold lowercase tracking-[-0.02em] text-[#D61914] dark:text-[#E7FA53]">
                  <RubberText
                    text={lang === 'ru' ? 'работы' : 'works'}
                    stretchStrength={1.0}
                  />
                </span>
              </h1>
            </div>

            <div className="lg:col-span-5 flex flex-col items-start lg:items-end gap-5">
              <RubberWords
                text={t(translations.works.lead)}
                elasticity={0.9}
                className="font-sans-body text-[15px] sm:text-[17px] text-[#0B0B0B]/80 dark:text-[#EFEFE9]/80 leading-[1.36] lg:text-right max-w-md"
              />
              <button
                type="button"
                onClick={() =>
                  navigateWithCurtain('/dome', {
                    italicLine: lang === 'ru' ? 'СФЕРА' : '3D DOME',
                    regularLine: lang === 'ru' ? 'ВСЕ РАБОТЫ' : 'ARCHIVE',
                  })
                }
                onMouseEnter={() => playHover()}
                className="group inline-flex items-center gap-2 font-mono-tabular text-[11px] font-semibold uppercase tracking-[0.14em] border-b border-[#0B0B0B] dark:border-[#E7FA53] pb-1 text-[#0B0B0B] dark:text-[#EFEFE9] hover:text-[#D61914] dark:hover:text-[#E7FA53] transition-colors whitespace-nowrap shrink-0"
              >
                <span>{lang === 'ru' ? 'Открыть 3D сферу' : 'Open 3D Sphere'}</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>
        </RubberBlock>

        {/* Minimal Typographic Filter Line + Editorial/Index View Switcher */}
        <div className="py-5 flex flex-wrap items-center justify-between gap-4 border-b border-[#0B0B0B]/15 dark:border-[#EFEFE9]/15">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {filterOptions.map((opt) => {
              const active = filter === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => {
                    playMorph();
                    setFilter(opt.key);
                  }}
                  onMouseEnter={() => playHover()}
                  aria-pressed={active}
                  className={`group relative py-1 inline-flex items-baseline gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'text-[#0B0B0B] dark:text-[#E7FA53] font-bold'
                      : 'text-[#0B0B0B]/55 dark:text-[#EFEFE9]/55 hover:text-[#0B0B0B] dark:hover:text-[#EFEFE9]'
                  }`}
                >
                  <span
                    className={`text-[12px] sm:text-[13px] tracking-[-0.01em] uppercase ${
                      active ? 'font-display' : 'font-sans-body font-medium'
                    }`}
                  >
                    {opt.label}
                  </span>
                  <sup className="font-serif-editorial italic text-[11px] text-[#D61914] dark:text-[#E7FA53]">
                    {String(opt.count).padStart(2, '0')}
                  </sup>
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 right-0 bottom-0 h-[1.5px] bg-[#D61914] dark:bg-[#E7FA53] transition-transform duration-300 origin-left ${
                      active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-50'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 font-mono-tabular text-[11px] uppercase tracking-[0.12em]">
            <button
              type="button"
              onClick={() => {
                playClick();
                setViewMode('editorial');
              }}
              aria-pressed={viewMode === 'editorial'}
              className={`inline-flex items-center gap-1.5 py-1 transition-colors whitespace-nowrap shrink-0 ${
                viewMode === 'editorial'
                  ? 'text-[#0B0B0B] dark:text-[#E7FA53] underline underline-offset-4 font-bold'
                  : 'text-[#0B0B0B]/55 dark:text-[#EFEFE9]/55 hover:text-[#0B0B0B] dark:hover:text-[#EFEFE9]'
              }`}
            >
              <Rows3 className="w-3.5 h-3.5" />
              <span>{lang === 'ru' ? 'Витрина' : 'Showcase'}</span>
            </button>
            <span aria-hidden="true" className="opacity-30">/</span>
            <button
              type="button"
              onClick={() => {
                playClick();
                setViewMode('index');
              }}
              aria-pressed={viewMode === 'index'}
              className={`inline-flex items-center gap-1.5 py-1 transition-colors whitespace-nowrap shrink-0 ${
                viewMode === 'index'
                  ? 'text-[#0B0B0B] dark:text-[#E7FA53] underline underline-offset-4 font-bold'
                  : 'text-[#0B0B0B]/55 dark:text-[#EFEFE9]/55 hover:text-[#0B0B0B] dark:hover:text-[#EFEFE9]'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span>{lang === 'ru' ? 'Индекс' : 'Index'}</span>
            </button>
          </div>
        </div>

        {/* VIEW 1: Architectural Monograph Rows with Alternating Rubber Scroll Elasticity */}
        {viewMode === 'editorial' ? (
          <div className="divide-y divide-[#0B0B0B]/15 dark:divide-[#EFEFE9]/15">
            {filtered.map((project, idx) => {
              const pack = PREVIEW_PACKS[project.id];
              const cleanTitle = t(project.title).replace(/^Слот \d+\s*—\s*|^Slot \d+\s*—\s*/i, '');
              const reverseOnDesktop = idx % 2 === 1;

              return (
                <article
                  key={project.id}
                  className="py-12 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
                >
                  {/* Editorial Dossier Column */}
                  <RubberBlock
                    skewFactor={reverseOnDesktop ? -0.9 : 0.9}
                    driftFactor={8}
                    className={`lg:col-span-5 flex flex-col justify-between h-full ${
                      reverseOnDesktop ? 'lg:order-2' : ''
                    }`}
                  >
                    <div>
                      <div className="flex items-baseline justify-between gap-4 pb-3 mb-5 border-b border-[#0B0B0B]/12 dark:border-white/12">
                        <span className="font-serif-editorial italic text-3xl sm:text-4xl font-semibold text-[#D61914] dark:text-[#E7FA53] leading-none">
                          {String(idx + 1).padStart(2, '0')}.
                        </span>
                        <span className="font-mono-tabular text-[11px] uppercase tracking-[0.16em] text-[#0B0B0B]/60 dark:text-[#EFEFE9]/60 text-right">
                          {project.year.split('·')[0].trim()}
                        </span>
                      </div>

                      <p className="font-serif-editorial italic text-sm sm:text-[15px] text-[#0B0B0B]/70 dark:text-[#EFEFE9]/70 mb-2">
                        {t(project.categoryLabel)}
                      </p>

                      <button
                        type="button"
                        onClick={() => openCase(project)}
                        onMouseEnter={() => playHover()}
                        data-cursor={lang === 'ru' ? 'Открыть кейс' : 'Open case'}
                        className="group text-left block w-full"
                      >
                        <h2 className="font-display font-extrabold uppercase tracking-[-0.035em] leading-[1.03] text-[clamp(1.45rem,2.35vw,2.2rem)] text-[#0B0B0B] dark:text-[#EFEFE9] group-hover:text-[#D61914] dark:group-hover:text-[#E7FA53] transition-colors text-balance-safe">
                          <ScrambleText text={cleanTitle} triggerOnHover duration={300} />
                        </h2>
                      </button>

                      <RubberWords
                        text={t(project.subtitle)}
                        elasticity={0.75}
                        className="font-sans-body text-[15px] sm:text-base text-[#0B0B0B]/80 dark:text-[#EFEFE9]/78 leading-[1.45] mt-5 max-w-[44ch]"
                      />

                      {pack && (
                        <p className="font-mono-tabular text-[11px] uppercase tracking-[0.12em] text-[#0B0B0B]/55 dark:text-[#EFEFE9]/55 mt-5">
                          {t(pack.scopeSummary)}
                        </p>
                      )}
                    </div>

                    <div className="pt-6 mt-8 border-t border-[#0B0B0B]/12 dark:border-[#EFEFE9]/12 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2" aria-label="Project palette">
                        {project.typographySpec.palette.map((hex) => (
                          <span
                            key={hex}
                            style={{ backgroundColor: hex }}
                            className="w-5 h-2 border border-[#0B0B0B]/20 dark:border-[#EFEFE9]/25 inline-block"
                            title={hex}
                          />
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => openCase(project)}
                        onMouseEnter={() => playHover()}
                        className="font-mono-tabular text-[11px] font-semibold uppercase tracking-[0.14em] inline-flex items-center gap-1.5 text-[#0B0B0B] dark:text-[#EFEFE9] hover:text-[#D61914] dark:hover:text-[#E7FA53] transition-colors group"
                      >
                        <span>{lang === 'ru' ? 'Смотреть кейс' : 'View Case Study'}</span>
                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </button>
                    </div>
                  </RubberBlock>

                  {/* Unified 16:10 Plate + 3-Frame Proof Contact Strip */}
                  <RubberBlock
                    skewFactor={reverseOnDesktop ? 0.9 : -0.9}
                    driftFactor={-8}
                    delay={0.05}
                    className={`lg:col-span-7 ${reverseOnDesktop ? 'lg:order-1' : ''}`}
                  >
                    <button
                      type="button"
                      onClick={() => openCase(project)}
                      onMouseEnter={() => playHover()}
                      data-cursor={lang === 'ru' ? 'Открыть кейс' : 'Open case'}
                      className="group block w-full text-left"
                    >
                      <div
                        style={{ backgroundColor: pack?.mainBg || '#FFFFFF' }}
                        className="w-full aspect-[16/10] overflow-hidden border border-[#0B0B0B]/14 dark:border-[#EFEFE9]/15"
                      >
                        <ResilientImage
                          src={pack?.mainSrc || project.heroImage || project.coverImage}
                          alt={cleanTitle}
                          fallbackTitle={project.slotCode}
                          className="w-full h-full"
                          imgClassName={`w-full h-full ${
                            pack?.mainIsContain ? 'object-contain' : 'object-cover'
                          } transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]`}
                        />
                      </div>

                      {pack?.strip && pack.strip.length > 0 && (
                        <div className="grid grid-cols-3 gap-2.5 mt-2.5">
                          {pack.strip.map((frame, frameIdx) => (
                            <div
                              key={frame.src + frameIdx}
                              style={{ backgroundColor: frame.bg || '#FFFFFF' }}
                              className="aspect-[16/10] overflow-hidden border border-[#0B0B0B]/12 dark:border-[#EFEFE9]/12"
                            >
                              <ResilientImage
                                src={frame.src}
                                alt={`${cleanTitle} plate ${frameIdx + 1}`}
                                fallbackTitle={project.slotCode}
                                className="w-full h-full"
                                imgClassName={`w-full h-full ${
                                  frame.isContain
                                    ? 'object-contain p-1.5 sm:p-2'
                                    : 'object-cover object-top'
                                } transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]`}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </button>
                  </RubberBlock>
                </article>
              );
            })}
          </div>
        ) : (
          /* VIEW 2: Swiss Index Table with Live Hover Specimen Plate */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-8 items-start">
            <div
              style={{
                transform: `skewY(${(rubberTilt * 0.28).toFixed(2)}deg)`,
              }}
              className="lg:col-span-8 divide-y divide-[#0B0B0B]/15 dark:divide-[#EFEFE9]/15 border-b border-[#0B0B0B]/15 dark:border-[#EFEFE9]/15 will-change-transform"
            >
              {filtered.map((project, idx) => {
                const cleanTitle = t(project.title).replace(/^Слот \d+\s*—\s*|^Slot \d+\s*—\s*/i, '');
                const pack = PREVIEW_PACKS[project.id];
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
                    className={`w-full text-left py-5 px-2 sm:px-3 grid grid-cols-12 gap-3 items-baseline transition-all duration-300 ${
                      isActive
                        ? 'bg-[#E5E4DC]/65 dark:bg-[#16161B] pl-4 sm:pl-5'
                        : 'hover:bg-[#E5E4DC]/35 dark:hover:bg-[#16161B]/60'
                    }`}
                  >
                    <span className="col-span-2 sm:col-span-1 font-serif-editorial italic text-base font-semibold text-[#D61914] dark:text-[#E7FA53]">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="col-span-10 sm:col-span-6 font-display font-bold uppercase text-base sm:text-xl tracking-tight text-[#0B0B0B] dark:text-[#EFEFE9]">
                      {cleanTitle}
                    </span>
                    <span className="col-span-8 sm:col-span-3 col-start-3 sm:col-start-auto font-serif-editorial italic text-xs text-[#0B0B0B]/65 dark:text-[#EFEFE9]/65 truncate">
                      {pack ? t(pack.scopeSummary).split('·')[0].trim() : t(project.categoryLabel)}
                    </span>
                    <span className="col-span-4 sm:col-span-2 text-right font-mono-tabular text-xs uppercase text-[#0B0B0B]/70 dark:text-[#EFEFE9]/70 inline-flex items-center justify-end gap-1">
                      <span>{project.year.split('·')[0].trim()}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </button>
                );
              })}
            </div>

            <div
              style={{
                transform: `skewY(${(-rubberTilt * 0.25).toFixed(2)}deg)`,
              }}
              className="hidden lg:block lg:col-span-4 sticky top-20 will-change-transform"
            >
              {(() => {
                const previewProj = hoveredRow || filtered[0];
                if (!previewProj) return null;
                const pack = PREVIEW_PACKS[previewProj.id];
                return (
                  <button
                    type="button"
                    onClick={() => openCase(previewProj)}
                    className="block w-full text-left border border-[#0B0B0B]/15 dark:border-[#EFEFE9]/15 bg-white dark:bg-[#16161B] overflow-hidden"
                  >
                    <div
                      style={{ backgroundColor: pack?.mainBg || '#FFFFFF' }}
                      className="aspect-[16/10] w-full overflow-hidden border-b border-[#0B0B0B]/10 dark:border-[#EFEFE9]/12"
                    >
                      <ResilientImage
                        src={pack?.mainSrc || previewProj.heroImage || previewProj.coverImage}
                        alt={t(previewProj.title)}
                        fallbackTitle={previewProj.slotCode}
                        className="w-full h-full"
                        imgClassName={`w-full h-full ${
                          pack?.mainIsContain ? 'object-contain' : 'object-cover'
                        }`}
                      />
                    </div>
                    <div className="p-4">
                      <p className="font-serif-editorial italic text-xs text-[#D61914] dark:text-[#E7FA53] mb-1">
                        {t(previewProj.categoryLabel)}
                      </p>
                      <p className="font-sans-body text-xs text-[#0B0B0B]/75 dark:text-[#EFEFE9]/75 leading-relaxed">
                        {t(previewProj.subtitle)}
                      </p>
                    </div>
                  </button>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
