import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useProjects } from '../context/ProjectsContext';
import { useLanguage } from '../context/LanguageContext';
import { useSound } from '../context/SoundContext';
import { useCurtainNavigation } from '../context/NavigationContext';
import { useRubberScroll } from '../hooks/useRubberScroll';
import { translations } from '../i18n/translations';
import { ScrambleText } from '../components/ScrambleText';
import { RubberText } from '../components/RubberText';
import { RubberBlock, RubberWords } from '../components/RubberMotion';
import { RubberArch } from '../components/RubberArch';
import { ResilientImage } from '../components/ResilientImage';
import { BeforeAfterShowcase } from '../components/BeforeAfterShowcase';
import { MarketplaceSeriesShowcase } from '../components/MarketplaceSeriesShowcase';
import { EncyclopediaReader } from '../components/EncyclopediaReader';
import { LogofolioShowcase } from '../components/LogofolioShowcase';
import { BrandbookShowcase } from '../components/BrandbookShowcase';
import { IdentityShowcase } from '../components/IdentityShowcase';

export function CaseStudyPage() {
  const { slug } = useParams<{ slug: string }>();
  const { isDark } = useTheme();
  const { lang, t } = useLanguage();
  const { projects, getProjectBySlug } = useProjects();
  const { playHover } = useSound();
  const { navigateWithCurtain } = useCurtainNavigation();
  const scrollVel = useRubberScroll(0.055);

  const [showStickyTitle, setShowStickyTitle] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<{ src: string; caption: string } | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setShowStickyTitle(window.scrollY > 340);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!lightboxImage) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxImage(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxImage]);

  const project = slug ? getProjectBySlug(slug) : undefined;

  if (!project) {
    return (
      <div className="min-h-screen bg-[#EFEFE9] dark:bg-[#0C0C0F] text-[#0B0B0B] dark:text-[#EFEFE9] flex flex-col items-center justify-center px-6 text-center pb-16 transition-colors duration-300">
        <h1 className="font-display text-4xl font-bold uppercase mb-6">
          {t(translations.caseStudy.notFound)}
        </h1>
        <button
          type="button"
          onClick={() =>
            navigateWithCurtain('/works', {
              italicLine: lang === 'ru' ? 'АРХИВ' : 'SELECTED',
              regularLine: lang === 'ru' ? 'РАБОТЫ' : 'WORKS',
            })
          }
          className="px-6 py-3 bg-[#0B0B0B] dark:bg-[#E7FA53] text-[#EFEFE9] dark:text-[#0B0B0B] text-xs font-semibold uppercase tracking-wider"
        >
          {t(translations.caseStudy.backToWorks)}
        </button>
      </div>
    );
  }

  const currentIdx = projects.findIndex((p) => p.id === project.id);
  const nextProject = projects[(currentIdx + 1) % projects.length];
  const cleanTitle = t(project.title).replace(/^Слот \d+\s*—\s*|^Slot \d+\s*—\s*/i, '');

  const openNext = () => {
    if (!nextProject) return;
    const nextTitle = t(nextProject.title).replace(/^Слот \d+\s*—\s*|^Slot \d+\s*—\s*/i, '');
    const words = nextTitle.split(' ');
    const split = Math.ceil(words.length / 2);
    navigateWithCurtain(`/works/${nextProject.slug}`, {
      italicLine: words.slice(0, split).join(' '),
      regularLine: words.slice(split).join(' ') || nextProject.slotCode,
      thumbnail: nextProject.heroImage || nextProject.coverImage,
    });
  };

  const bandColor =
    project.theme.bg === '#EFEFE9' || project.theme.bg === '#F4F1EA'
      ? '#D61914'
      : project.theme.bg;
  const bandInk = '#EFEFE9';

  const rubberStretchY = 1 + Math.min(0.08, Math.abs(scrollVel) * 0.045);
  const rubberSquashX = 1 - Math.min(0.03, Math.abs(scrollVel) * 0.015);

  return (
    <div className="bg-[#EFEFE9] dark:bg-[#0C0C0F] text-[#0B0B0B] dark:text-[#EFEFE9] min-h-screen pb-20 overflow-x-hidden transition-colors duration-300">
      {/* Pinned Top-Center Mini-Title Lockup on Scroll */}
      <div
        aria-hidden={!showStickyTitle}
        style={{
          opacity: showStickyTitle ? 1 : 0,
          transform: showStickyTitle ? 'translate3d(-50%, 0, 0)' : 'translate3d(-50%, -14px, 0)',
          transition: 'opacity 240ms ease, transform 380ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
        className={`fixed top-[66px] sm:top-[76px] left-1/2 z-30 pointer-events-none text-center px-4 py-1.5 rounded-[14px] ${
          isDark ? 'liquid-glass-dark' : 'liquid-glass-light'
        }`}
      >
        <p className="font-display font-bold uppercase text-sm sm:text-base leading-[0.96] tracking-[-0.03em] text-[#0B0B0B] dark:text-[#EFEFE9]">
          {cleanTitle}
        </p>
        <p className="font-serif-editorial italic text-[11px] text-[#0B0B0B]/65 dark:text-[#EFEFE9]/65 mt-0.5">
          {t(project.categoryLabel)}
        </p>
      </div>

      {project.isLogoCover || project.preserveTypographyMedia ? (
        <section className="max-w-[1380px] mx-auto px-5 sm:px-8 pt-20 sm:pt-24 pb-6 text-center">
          <div className="flex items-center justify-center flex-wrap gap-x-3 gap-y-1 mb-6 sm:mb-7">
            <span className="font-mono-tabular text-[11px] uppercase tracking-[0.2em] text-[#D61914] dark:text-[#E7FA53]">
              {project.slotCode}
            </span>
            <span aria-hidden="true" className="opacity-35">·</span>
            <span className="font-serif-editorial italic text-sm text-[#0B0B0B]/70 dark:text-[#EFEFE9]/70">
              {t(project.categoryLabel)}
            </span>
          </div>

          <h1 className="font-display font-extrabold uppercase tracking-[-0.038em] leading-[1.02] text-[clamp(1.85rem,4.1vw,3.75rem)] text-[#0B0B0B] dark:text-[#EFEFE9] text-balance-safe max-w-6xl mx-auto">
            <RubberText text={cleanTitle} stretchStrength={0.95} className="justify-center" />
          </h1>

          <p className="font-mono-tabular text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#0B0B0B]/55 dark:text-[#EFEFE9]/55 mt-5 sm:mt-6 mb-10 sm:mb-12">
            {project.year} · KIRILL KOVALEV
          </p>

          {project.heroImage && (
            <RubberBlock immediate skewFactor={0.65} driftFactor={7}>
              <button
                type="button"
                onClick={() =>
                  setLightboxImage({
                    src: project.heroImage!,
                    caption: `${project.slotCode} — ${cleanTitle}`,
                  })
                }
                data-cursor={lang === 'ru' ? 'Увеличить' : 'Inspect'}
                className="group block w-full max-w-[1180px] mx-auto overflow-hidden border border-[#0B0B0B]/15 dark:border-white/15 text-left shadow-[0_24px_60px_-24px_rgba(11,11,11,0.2)] bg-[#0B0B0B]"
              >
                <img
                  src={project.heroImage}
                  alt={t(project.title)}
                  decoding="async"
                  className="w-full h-auto block transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-[1.02]"
                />
              </button>
            </RubberBlock>
          )}
        </section>
      ) : (
        <>
          <div className="relative w-full h-[38vh] sm:h-[46vh] overflow-hidden bg-[#0B0B0B]">
            <button
              type="button"
              onClick={() =>
                setLightboxImage({
                  src: project.heroImage || project.coverImage,
                  caption: `${project.slotCode} — ${cleanTitle}`,
                })
              }
              data-cursor={lang === 'ru' ? 'Увеличить' : 'Inspect'}
              style={{
                transform: `scale(${1 + Math.min(0.06, Math.abs(scrollVel) * 0.04)})`,
              }}
              className="block w-full h-full will-change-transform text-left"
            >
              <ResilientImage
                src={project.heroImage || project.coverImage}
                alt={t(project.title)}
                fallbackTitle={project.slotCode}
                className="w-full h-full"
                imgClassName="w-full h-full object-cover"
              />
            </button>

            <RubberArch
              color={isDark ? '#0C0C0F' : '#EFEFE9'}
              direction="up"
              velocity={scrollVel}
              className="absolute bottom-0 left-0 h-12 sm:h-16"
            />
          </div>

          <section className="max-w-[1380px] mx-auto px-5 sm:px-8 pt-3 sm:pt-5 pb-12 text-center">
            <div className="flex items-center justify-center flex-wrap gap-x-3 gap-y-1 mb-7 sm:mb-8">
              <span className="font-mono-tabular text-[11px] uppercase tracking-[0.2em] text-[#D61914] dark:text-[#E7FA53]">
                {project.slotCode}
              </span>
              <span aria-hidden="true" className="opacity-35">·</span>
              <span className="font-serif-editorial italic text-sm text-[#0B0B0B]/70 dark:text-[#EFEFE9]/70">
                {t(project.categoryLabel)}
              </span>
            </div>

            <h1 className="font-display font-extrabold uppercase tracking-[-0.038em] leading-[1.02] text-[clamp(1.85rem,4.1vw,3.75rem)] text-[#0B0B0B] dark:text-[#EFEFE9] text-balance-safe max-w-6xl mx-auto">
              <RubberText text={cleanTitle} stretchStrength={0.95} className="justify-center" />
            </h1>

            <p className="font-mono-tabular text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#0B0B0B]/55 dark:text-[#EFEFE9]/55 mt-5 sm:mt-6">
              {project.year} · KIRILL KOVALEV
            </p>
          </section>
        </>
      )}

      {/* Editorial Description with Rubber Scroll Flex */}
      <section className="max-w-4xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
        <RubberBlock skewFactor={0.65} driftFactor={7}>
          <p className="font-serif-editorial italic text-xs sm:text-sm text-[#D61914] dark:text-[#E7FA53] mb-4">
            <ScrambleText
              text={lang === 'ru' ? '01 · Задача проекта' : '01 · Project Brief'}
              triggerKey={`desc-${project.id}-${lang}`}
              duration={360}
            />
          </p>
          <RubberWords
            text={t(project.task)}
            elasticity={0.85}
            className="font-sans-body text-[clamp(1.35rem,2.7vw,2.25rem)] leading-[1.24] tracking-[-0.022em] font-normal text-[#0B0B0B] dark:text-[#EFEFE9] mb-12"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-[#0B0B0B]/15 dark:border-white/15 text-sm sm:text-base leading-relaxed text-[#0B0B0B]/82 dark:text-[#EFEFE9]/82">
            <div>
              <p className="font-serif-editorial italic text-sm text-[#D61914] dark:text-[#E7FA53] mb-2">
                {t(translations.caseStudy.sections.problem)}
              </p>
              <p>{t(project.problem)}</p>
            </div>
            <div>
              <p className="font-serif-editorial italic text-sm text-[#D61914] dark:text-[#E7FA53] mb-2">
                {t(translations.caseStudy.sections.concept)}
              </p>
              <p>{t(project.concept)}</p>
            </div>
          </div>
        </RubberBlock>
      </section>

      {/* Challenge & Architectural System Thesis */}
      <section className="max-w-4xl mx-auto px-5 sm:px-8 pb-6 sm:pb-10">
        <RubberBlock skewFactor={-0.6} driftFactor={6}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-baseline pt-8 border-t border-[#0B0B0B]/15 dark:border-white/15">
            <div className="md:col-span-4 font-serif-editorial italic text-sm text-[#0B0B0B]/65 dark:text-[#EFEFE9]/65">
              <ScrambleText
                text={lang === 'ru' ? 'Вызов и решение' : 'Challenge & Solution'}
                triggerOnHover
                duration={320}
              />
            </div>
            <div className="md:col-span-8 text-base sm:text-xl leading-relaxed text-[#0B0B0B] dark:text-[#EFEFE9]/90">
              {t(project.visualSystemNotes)}
            </div>
          </div>
        </RubberBlock>
      </section>

      {/* Bold Chromatic Band with Dynamic Rubber Arches & 2-Column Brand Mark Lockup */}
      <section
        style={{ backgroundColor: bandColor, color: bandInk }}
        className="relative my-14 sm:my-20 py-20 sm:py-28 px-5 sm:px-8 overflow-hidden"
      >
        <RubberArch
          color={isDark ? '#0C0C0F' : '#EFEFE9'}
          direction="down"
          velocity={scrollVel}
          className="absolute top-0 left-0 h-12 sm:h-16"
        />

        <div className="max-w-[1380px] mx-auto pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <RubberBlock skewFactor={0.85} driftFactor={8} className="lg:col-span-6 border border-white/20 p-8 sm:p-12 flex flex-col justify-between bg-black/15">
              <div className="flex items-center justify-between font-mono-tabular text-[10px] uppercase tracking-[0.2em] opacity-75">
                <span>{t(translations.caseStudy.sections.system)}</span>
                <span>{project.year}</span>
              </div>

              <div
                style={{
                  transform: `scale(${rubberSquashX}, ${rubberStretchY})`,
                }}
                className="my-12 text-center will-change-transform"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 border border-white/30 mb-4">
                  <span className="font-serif-editorial italic font-semibold text-2xl">K</span>
                </div>
                <h2 className="font-display font-bold uppercase tracking-tight leading-[0.94] text-[clamp(2rem,4.2vw,3.6rem)]">
                  <RubberText text={project.slotCode} className="justify-center" />
                </h2>
              </div>

              <div className="space-y-4 pt-6 border-t border-white/20 text-xs font-mono-tabular">
                <div className="flex flex-wrap justify-between gap-2">
                  <span className="opacity-65">DISPLAY: {project.typographySpec.display}</span>
                  <span className="opacity-65">BODY: {project.typographySpec.body}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.typographySpec.palette.map((hex) => (
                    <div
                      key={hex}
                      className="flex items-center gap-1.5 px-2 py-1 bg-black/30 border border-white/20 text-[10px]"
                    >
                      <span
                        style={{ backgroundColor: hex }}
                        className="w-3 h-3 inline-block border border-white/30"
                      />
                      <span>{hex}</span>
                    </div>
                  ))}
                </div>
              </div>
            </RubberBlock>

            <RubberBlock skewFactor={-0.85} driftFactor={-8} delay={0.05} className="lg:col-span-6 relative overflow-hidden border border-white/20 group">
              {(() => {
                const specimenSrc =
                  project.isLogoCover && project.heroImage
                    ? project.heroImage
                    : project.isLogoCover || project.preserveTypographyMedia
                    ? project.coverImage
                    : project.secondaryImages[0] || project.coverImage;
                const useContainedNeutral =
                  !project.isLogoCover && project.preserveTypographyMedia && project.coverFit === 'contain';
                return (
                  <button
                    type="button"
                    onClick={() =>
                      setLightboxImage({
                        src: specimenSrc,
                        caption: `${project.slotCode} — SYSTEM SPECIMEN`,
                      })
                    }
                    data-cursor={lang === 'ru' ? 'Увеличить' : 'Inspect'}
                    style={
                      useContainedNeutral
                        ? { backgroundColor: '#EFEFE9' }
                        : { backgroundColor: project.theme.surface }
                    }
                    className="block w-full h-full text-left"
                  >
                    <ResilientImage
                      src={specimenSrc}
                      alt={t(project.title)}
                      fallbackTitle={project.slotCode}
                      className="w-full h-full min-h-[340px]"
                      imgClassName={
                        useContainedNeutral
                          ? 'w-full h-full max-h-[520px] object-contain p-5 sm:p-8 transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-[1.03]'
                          : 'w-full h-full max-h-[520px] object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-[1.03]'
                      }
                    />
                  </button>
                );
              })()}
            </RubberBlock>
          </div>
        </div>

        <RubberArch
          color={isDark ? '#0C0C0F' : '#EFEFE9'}
          direction="up"
          velocity={-scrollVel}
          className="absolute bottom-0 left-0 h-12 sm:h-16"
        />
      </section>

      {/* Interactive Showcases wrapped with gentle RubberBlock scroll responsiveness */}
      {project.beforeAfter && (
        <RubberBlock skewFactor={0.4} driftFactor={5}>
          <BeforeAfterShowcase
            pairs={project.beforeAfter.pairs}
            extraPlates={project.beforeAfter.extraPlates}
            accentColor={bandColor}
            onInspectImage={setLightboxImage}
          />
        </RubberBlock>
      )}

      {project.marketplaceSeries && (
        <RubberBlock skewFactor={0.4} driftFactor={5}>
          <MarketplaceSeriesShowcase
            series={project.marketplaceSeries}
            accentColor={project.theme.bg === '#1D1E26' ? '#C81E6E' : bandColor}
            onInspectImage={setLightboxImage}
          />
        </RubberBlock>
      )}

      {project.encyclopediaData && (
        <RubberBlock skewFactor={0.4} driftFactor={5}>
          <EncyclopediaReader
            spreads={project.encyclopediaData.spreads}
            pdfUrl={project.encyclopediaData.pdfUrl}
            accentColor={bandColor}
            onInspectImage={setLightboxImage}
          />
        </RubberBlock>
      )}

      {project.logofolioData && (
        <RubberBlock skewFactor={0.4} driftFactor={5}>
          <LogofolioShowcase
            plates={project.logofolioData.plates}
            coverPlateSrc={project.logofolioData.coverPlateSrc}
            accentColor={bandColor}
            onInspectImage={setLightboxImage}
          />
        </RubberBlock>
      )}

      {project.brandbookData && (
        <RubberBlock skewFactor={0.4} driftFactor={5}>
          <BrandbookShowcase
            slides={project.brandbookData.slides}
            accentColor={project.theme.accent}
            onInspectImage={setLightboxImage}
          />
        </RubberBlock>
      )}

      {project.identityPlates && (
        <RubberBlock skewFactor={0.4} driftFactor={5}>
          <IdentityShowcase
            plates={project.identityPlates}
            accentColor={bandColor}
            onInspectImage={setLightboxImage}
          />
        </RubberBlock>
      )}

      {/* Process Stages (Swiss hairline editorial columns), Decisions & Applications */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 py-10 sm:py-14 space-y-14">
        <div>
          <p className="font-serif-editorial italic text-sm text-[#D61914] dark:text-[#E7FA53] mb-6">
            {t(translations.caseStudy.sections.process)}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {project.processStages.map((stage, i) => (
              <RubberBlock
                key={i}
                skewFactor={i === 1 ? -0.7 : 0.7}
                driftFactor={6}
                delay={i * 0.06}
                className="pt-5 border-t border-[#0B0B0B]/20 dark:border-white/20"
              >
                <div className="flex items-baseline justify-between mb-3">
                  <span className="font-serif-editorial italic text-2xl font-semibold text-[#D61914] dark:text-[#E7FA53]">
                    {String(i + 1).padStart(2, '0')}.
                  </span>
                  <span className="font-mono-tabular text-[10px] uppercase tracking-wider text-[#0B0B0B]/55 dark:text-[#EFEFE9]/55">
                    {t(stage.label)}
                  </span>
                </div>
                <h3 className="font-display text-lg sm:text-xl font-bold uppercase tracking-tight mb-2.5">
                  {t(stage.title)}
                </h3>
                <p className="text-sm text-[#0B0B0B]/80 dark:text-[#EFEFE9]/80 leading-relaxed">
                  {t(stage.description)}
                </p>
              </RubberBlock>
            ))}
          </div>
        </div>

        <RubberBlock skewFactor={0.65} driftFactor={7} className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-8 border-t border-[#0B0B0B]/15 dark:border-white/15">
          <div>
            <p className="font-serif-editorial italic text-sm text-[#D61914] dark:text-[#E7FA53] mb-4">
              {t(translations.caseStudy.sections.decisions)}
            </p>
            <ul className="space-y-3.5 text-sm sm:text-base leading-relaxed">
              {project.graphicDecisions.map((item, idx) => (
                <li key={idx} className="flex gap-3 items-baseline">
                  <span className="font-serif-editorial italic text-sm text-[#D61914] dark:text-[#E7FA53] shrink-0">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span>{t(item)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-serif-editorial italic text-sm text-[#D61914] dark:text-[#E7FA53] mb-4">
              {t(translations.caseStudy.sections.applications)}
            </p>
            <ul className="divide-y divide-[#0B0B0B]/12 dark:divide-white/12 border-y border-[#0B0B0B]/12 dark:border-white/12 text-sm sm:text-base font-medium">
              {project.applications.map((app, idx) => (
                <li key={idx} className="py-3">
                  {t(app)}
                </li>
              ))}
            </ul>
          </div>
        </RubberBlock>
      </section>

      {/* Signature NEXT PROJECT Bar */}
      {nextProject && nextProject.id !== project.id && (
        <RubberBlock skewFactor={0.7} driftFactor={7} className="max-w-[1380px] mx-auto px-5 sm:px-8 pt-12 sm:pt-16 pb-8 border-t border-[#0B0B0B]/15 dark:border-white/15">
          <button
            type="button"
            onClick={openNext}
            onMouseEnter={() => playHover()}
            data-cursor={lang === 'ru' ? 'Открыть кейс' : 'View project'}
            className="group w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-center text-left py-4"
          >
            <div className="md:col-span-3">
              <span className="font-serif-editorial italic text-sm text-[#0B0B0B]/65 dark:text-[#EFEFE9]/65">
                <ScrambleText
                  text={t(translations.caseStudy.nextProject)}
                  triggerOnHover
                  duration={300}
                />
              </span>
            </div>

            <div className="md:col-span-5">
              <div className="relative pt-3 pr-3">
                <div className="overflow-hidden border border-[#0B0B0B]/12 dark:border-white/12 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-[1.03]">
                  <ResilientImage
                    src={
                      nextProject.coverFit !== 'contain' &&
                      nextProject.preserveTypographyMedia &&
                      nextProject.heroImage
                        ? nextProject.heroImage
                        : nextProject.coverImage
                    }
                    alt={t(nextProject.title)}
                    fallbackTitle={nextProject.slotCode}
                    className={`w-full aspect-[16/9] ${nextProject.coverFit === 'contain' ? 'bg-white' : 'bg-[#0B0B0B]'}`}
                    imgClassName={
                      nextProject.coverFit === 'contain'
                        ? 'w-full h-full object-contain p-4 sm:p-6 transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-[1.06]'
                        : 'w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-[1.06]'
                    }
                  />
                </div>
                <div
                  className="absolute top-0 right-0 w-20 h-7 bg-[#F5ED86] border border-[#0B0B0B]/10 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-1 group-hover:-translate-y-1"
                  aria-hidden="true"
                />
              </div>
            </div>

            <div className="md:col-span-4">
              <p className="font-display font-bold uppercase text-2xl sm:text-3xl tracking-tight leading-[0.98] group-hover:text-[#D61914] dark:group-hover:text-[#E7FA53] transition-colors">
                <ScrambleText
                  text={t(nextProject.title).replace(/^Слот \d+\s*—\s*|^Slot \d+\s*—\s*/i, '')}
                  triggerOnHover
                  duration={360}
                />
              </p>
              <p className="font-serif-editorial italic text-xs text-[#0B0B0B]/60 dark:text-[#EFEFE9]/60 mt-2">
                {t(nextProject.categoryLabel)}
              </p>
            </div>
          </button>
        </RubberBlock>
      )}

      {/* Fullscreen Lightbox Inspector */}
      {lightboxImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightboxImage.caption}
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-[95] bg-[#0B0B0B]/92 backdrop-blur-md p-4 sm:p-10 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-[#EFEFE9] font-mono-tabular text-xs uppercase tracking-widest">
            <span>{lightboxImage.caption}</span>
            <button
              type="button"
              onClick={() => setLightboxImage(null)}
              aria-label={t(translations.nav.close)}
              className="w-10 h-10 bg-[#EFEFE9] text-[#0B0B0B] hover:bg-[#E7FA53] flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div
            onClick={(e) => e.stopPropagation()}
            className="my-auto max-w-5xl w-full mx-auto max-h-[78vh] overflow-hidden border border-[#EFEFE9]/20"
          >
            <img
              src={lightboxImage.src}
              alt={lightboxImage.caption}
              decoding="async"
              className={`w-full h-full max-h-[78vh] object-contain ${
                project.coverBg === '#FFFFFF' ? 'bg-white' : 'bg-[#0B0B0B]'
              }`}
            />
          </div>

          <div className="text-center font-mono-tabular text-[10px] uppercase tracking-widest text-[#EFEFE9]/55">
            ESC / CLICK TO CLOSE
          </div>
        </div>
      )}
    </div>
  );
}
