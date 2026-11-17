import React, { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useProjects } from '../context/ProjectsContext';
import { useSound } from '../context/SoundContext';
import { useCurtainNavigation } from '../context/NavigationContext';
import { useRubberScroll } from '../hooks/useRubberScroll';
import { ProjectCase } from '../data/projects';
import { translations } from '../i18n/translations';
import { ScrambleText } from '../components/ScrambleText';
import { RubberText } from '../components/RubberText';
import { RubberWords } from '../components/RubberMotion';
import {
  PortfolioWarpCarousel,
  PortfolioWarpCarouselHandle,
} from '../components/PortfolioWarpCarousel';

export function HomePage() {
  const { isDark } = useTheme();
  const { lang, t } = useLanguage();
  const { projects } = useProjects();
  const { playHover } = useSound();
  const { navigateWithCurtain } = useCurtainNavigation();
  const scrollVel = useRubberScroll(0.055);

  const carouselRef = useRef<PortfolioWarpCarouselHandle>(null);

  const [activeProject, setActiveProject] = useState<ProjectCase | undefined>(projects[0]);
  const [activeIndex, setActiveIndex] = useState(0);

  const currentProject = activeProject || projects[0];
  const shortTitle = currentProject
    ? t(currentProject.title).replace(/^Слот \d+\s*—\s*|^Slot \d+\s*—\s*/i, '')
    : '';

  const openProject = (project: ProjectCase) => {
    const titleStr = t(project.title).replace(/^Слот \d+\s*—\s*|^Slot \d+\s*—\s*/i, '');
    const words = titleStr.split(' ');
    const splitPoint = Math.ceil(words.length / 2);

    navigateWithCurtain(`/works/${project.slug}`, {
      italicLine: words.slice(0, splitPoint).join(' '),
      regularLine: words.slice(splitPoint).join(' ') || project.slotCode,
      thumbnail: project.heroImage || project.coverImage,
    });
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) < 1) return;
    carouselRef.current?.impulseWheel(delta);
  };

  const clampedVel = Math.max(-1.4, Math.min(1.4, scrollVel));
  const carouselScale = 1 + Math.min(0.025, Math.abs(clampedVel) * 0.016);
  const carouselLift = -clampedVel * 7;
  const stripSkew = clampedVel * 1.1;
  const leftSkew = clampedVel * 1.25;
  const rightSkew = -clampedVel * 1.15;
  const rightDrift = -clampedVel * 9;

  return (
    <div
      onWheel={handleWheel}
      className="min-h-[calc(100vh-36px)] sm:min-h-[calc(100vh-40px)] bg-[#EFEFE9] dark:bg-[#0C0C0F] text-[#0B0B0B] dark:text-[#EFEFE9] flex flex-col justify-between pt-14 sm:pt-[68px] pb-11 overflow-hidden select-none transition-colors duration-300"
    >
      {/* TOP HALF: WebGL2 3D Optical Warp Carousel + Editorial Active Project Strip */}
      <section aria-label={t(translations.works.title)} className="w-full">
        <div
          style={{
            transform: `translate3d(0, ${carouselLift.toFixed(2)}px, 0) scale(${carouselScale.toFixed(4)})`,
            transition: Math.abs(clampedVel) > 0.01 ? 'none' : 'transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
          className="relative w-full h-[38vh] sm:h-[43vh] lg:h-[46vh] min-h-[290px] max-h-[490px] will-change-transform"
        >
          <PortfolioWarpCarousel
            ref={carouselRef}
            projects={projects}
            onOpenProject={openProject}
            onActiveChange={(proj, idx) => {
              setActiveProject(proj);
              setActiveIndex(idx);
            }}
            background={isDark ? '#0C0C0F' : '#EFEFE9'}
            warp={0.92}
            className="w-full h-full"
          />
        </div>

        {currentProject && (
          <div
            style={{
              transform: `translate3d(0, ${(-clampedVel * 4).toFixed(2)}px, 0) skewY(${(stripSkew * 0.35).toFixed(2)}deg)`,
              transition: Math.abs(clampedVel) > 0.01 ? 'none' : 'transform 480ms cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
            className="border-t border-b border-[#0B0B0B]/10 dark:border-[#EFEFE9]/12 px-4 sm:px-7 py-2.5 flex flex-wrap items-center justify-between gap-3 bg-[#EFEFE9] dark:bg-[#0C0C0F] transition-colors duration-300 will-change-transform"
          >
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 min-w-0">
              <span className="font-mono-tabular text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.08em] text-[#0B0B0B]/55 dark:text-[#EFEFE9]/55 shrink-0">
                {String(activeIndex + 1).padStart(2, '0')} /{' '}
                {String(projects.length).padStart(2, '0')} · {currentProject.slotCode}
              </span>

              <button
                type="button"
                onClick={() => openProject(currentProject)}
                onMouseEnter={() => playHover()}
                className="font-display font-bold text-[15px] sm:text-[18px] tracking-[-0.03em] uppercase leading-[1.06] text-[#0B0B0B] dark:text-[#EFEFE9] hover:text-[#D61914] transition-colors text-left truncate max-w-[70vw] sm:max-w-[44vw]"
              >
                <ScrambleText
                  text={shortTitle}
                  triggerKey={`active-${currentProject.id}-${lang}`}
                  duration={320}
                />
              </button>

              <span className="hidden md:inline-block font-serif-editorial italic text-[13px] text-[#0B0B0B]/65 dark:text-[#EFEFE9]/65 truncate">
                {t(currentProject.categoryLabel)}
              </span>
            </div>

            <div className="flex items-center gap-3 shrink-0 ml-auto">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => carouselRef.current?.prev()}
                  aria-label={lang === 'ru' ? 'Предыдущий проект' : 'Previous project'}
                  className="w-8 h-8 border border-[#0B0B0B]/15 dark:border-[#EFEFE9]/20 hover:border-[#0B0B0B] dark:hover:border-[#E7FA53] hover:bg-[#0B0B0B] dark:hover:bg-[#E7FA53] hover:text-[#EFEFE9] dark:hover:text-[#0B0B0B] transition-colors flex items-center justify-center"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => carouselRef.current?.next()}
                  aria-label={lang === 'ru' ? 'Следующий проект' : 'Next project'}
                  className="w-8 h-8 border border-[#0B0B0B]/15 dark:border-[#EFEFE9]/20 hover:border-[#0B0B0B] dark:hover:border-[#E7FA53] hover:bg-[#0B0B0B] dark:hover:bg-[#E7FA53] hover:text-[#EFEFE9] dark:hover:text-[#0B0B0B] transition-colors flex items-center justify-center"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => openProject(currentProject)}
                onMouseEnter={() => playHover()}
                className="font-sans-body text-[11px] sm:text-[12px] font-semibold uppercase tracking-[-0.01em] underline underline-offset-4 hover:text-[#D61914] transition-colors"
              >
                {lang === 'ru' ? 'Открыть кейс ↗' : 'Open case ↗'}
              </button>
            </div>
          </div>
        )}
      </section>

      {/* BOTTOM HALF: Monumental Swiss Rubber Wordmark Left + Editorial Designer Statement Right */}
      <section className="px-4 sm:px-7 pt-3 pb-3 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-end">
        <div
          style={{
            transform: `translate3d(0, ${(-clampedVel * 6).toFixed(2)}px, 0) skewY(${(leftSkew * 0.45).toFixed(2)}deg)`,
            transition: Math.abs(clampedVel) > 0.01 ? 'none' : 'transform 480ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
          className="lg:col-span-7 will-change-transform"
        >
          <div className="flex items-center gap-2.5 mb-2">
            <span className="font-sans-body text-[10px] sm:text-[11px] font-semibold tracking-[0.12em] uppercase text-[#0B0B0B]/70 dark:text-[#EFEFE9]/70">
              KIRILL
            </span>
            <span aria-hidden="true" className="text-[#0B0B0B]/30 dark:text-[#EFEFE9]/30">
              ·
            </span>
            <span className="font-serif-editorial italic text-[12px] sm:text-[13px] tracking-[0.02em] text-[#D61914] dark:text-[#E7FA53]">
              {t(translations.home.thesisTitle)}
            </span>
          </div>

          <h1 className="font-display font-extrabold uppercase tracking-[-0.055em] leading-[0.82] text-[clamp(4rem,12.4vw,11.5rem)] text-[#0B0B0B] dark:text-[#EFEFE9] whitespace-nowrap">
            <RubberText
              text="KOVALEV"
              stretchStrength={1.2}
              cursorLabel={lang === 'ru' ? 'Работы' : 'Works'}
              onClick={() =>
                navigateWithCurtain('/works', {
                  italicLine: lang === 'ru' ? 'ВСЕ' : 'ALL',
                  regularLine: lang === 'ru' ? 'РАБОТЫ' : 'WORKS',
                })
              }
              className="hover:text-[#D61914] transition-colors duration-300 cursor-pointer flex-nowrap"
            />
          </h1>
        </div>

        <div
          style={{
            transform: `translate3d(0, ${rightDrift.toFixed(2)}px, 0) skewY(${(rightSkew * 0.45).toFixed(2)}deg)`,
            transition: Math.abs(clampedVel) > 0.01 ? 'none' : 'transform 480ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
          className="lg:col-span-5 lg:pb-1.5 pr-14 sm:pr-16 lg:pr-20 will-change-transform"
        >
          <p className="font-sans-body text-[13px] sm:text-[14px] font-medium uppercase tracking-[-0.015em] text-[#0B0B0B] dark:text-[#EFEFE9] mb-2.5 flex flex-wrap items-baseline gap-x-2">
            <ScrambleText
              text={lang === 'ru' ? 'КИРИЛЛ КОВАЛЁВ' : 'KIRILL KOVALEV'}
              triggerOnHover
              triggerKey={`exp-${lang}-${currentProject?.id || '0'}`}
              duration={360}
            />
            <span className="font-serif-editorial italic font-semibold lowercase text-[15px] sm:text-[16px] text-[#D61914] dark:text-[#E7FA53]">
              experience©
            </span>
          </p>

          <RubberWords
            text={t(translations.home.heroLead)}
            elasticity={1.08}
            className="font-sans-body text-[16px] sm:text-[18.5px] leading-[1.28] tracking-[-0.02em] text-[#0B0B0B] dark:text-[#EFEFE9]/88 max-w-[430px] font-normal"
          />

          <div className="mt-4 flex flex-wrap items-center gap-5 text-[12px] font-semibold uppercase tracking-[-0.01em] text-[#0B0B0B] dark:text-[#EFEFE9]">
            <button
              type="button"
              onClick={() =>
                navigateWithCurtain('/works', {
                  italicLine: lang === 'ru' ? 'АРХИВ' : 'SELECTED',
                  regularLine: lang === 'ru' ? 'РАБОТЫ' : 'WORKS',
                })
              }
              onMouseEnter={() => playHover()}
              className="underline underline-offset-4 hover:text-[#D61914] dark:hover:text-[#E7FA53] transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5 hover:scale-105"
            >
              {t(translations.home.heroExplore)} ↗
            </button>
            <button
              type="button"
              onClick={() =>
                navigateWithCurtain('/dome', {
                  italicLine: lang === 'ru' ? 'СФЕРА' : '3D DOME',
                  regularLine: lang === 'ru' ? 'ВСЕ РАБОТЫ' : 'ARCHIVE',
                })
              }
              onMouseEnter={() => playHover()}
              className="underline underline-offset-4 hover:text-[#D61914] dark:hover:text-[#E7FA53] transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5 hover:scale-105"
            >
              {lang === 'ru' ? '3D Сфера' : '3D Sphere'} ↗
            </button>
            <button
              type="button"
              onClick={() =>
                navigateWithCurtain('/contacts', {
                  italicLine: lang === 'ru' ? 'СВЯЗЬ' : 'LET’S',
                  regularLine: lang === 'ru' ? 'КОНТАКТЫ' : 'TALK',
                })
              }
              onMouseEnter={() => playHover()}
              className="underline underline-offset-4 hover:text-[#D61914] dark:hover:text-[#E7FA53] transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5 hover:scale-105"
            >
              {t(translations.home.heroConnect)} ↗
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
