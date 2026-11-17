import React, { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useProjects } from '../context/ProjectsContext';
import { useSound } from '../context/SoundContext';
import { useCurtainNavigation } from '../context/NavigationContext';
import { useRubberScroll } from '../hooks/useRubberScroll';
import { ProjectCase } from '../data/projects';
import { translations } from '../i18n/translations';
import { RubberText } from '../components/RubberText';
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

  const clampedVel = Math.max(-1.2, Math.min(1.2, scrollVel));
  const carouselScale = 1 + Math.min(0.02, Math.abs(clampedVel) * 0.014);

  return (
    <div
      onWheel={handleWheel}
      className="h-[100dvh] w-full bg-[#EFEFE9] dark:bg-[#0C0C0F] text-[#0B0B0B] dark:text-[#EFEFE9] flex flex-col pt-16 sm:pt-[76px] pb-10 overflow-hidden select-none transition-colors duration-200"
    >
      {/* Monumental Centered Hero Statement + Single Primary Action */}
      <section className="shrink-0 max-w-[1380px] w-full mx-auto px-4 sm:px-8 pt-2 sm:pt-3 pb-1 text-center flex flex-col items-center">
        <h1 className="font-display font-extrabold tracking-[-0.045em] leading-[0.94] text-[clamp(2rem,4.5vw,4.35rem)] text-[#0B0B0B] dark:text-[#EFEFE9] text-balance-safe max-w-4xl">
          <RubberText
            text={
              lang === 'ru'
                ? 'Визуальные системы с характером'
                : 'Visual systems with character'
            }
            stretchStrength={0.95}
            className="justify-center"
          />
        </h1>

        <p className="type-body text-[#0B0B0B]/75 dark:text-[#EFEFE9]/75 max-w-[56ch] mt-2.5 sm:mt-3">
          {lang === 'ru'
            ? 'Графический дизайн, типографика и веб-интерфейсы, собранные в единый выразительный ритм.'
            : 'Graphic design, typography, and digital interfaces crafted as a cohesive living system.'}
        </p>

        <div className="mt-3.5 sm:mt-4">
          <button
            type="button"
            onClick={() =>
              navigateWithCurtain('/works', {
                italicLine: lang === 'ru' ? 'АРХИВ' : 'SELECTED',
                regularLine: lang === 'ru' ? 'РАБОТЫ' : 'WORKS',
              })
            }
            onMouseEnter={() => playHover()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0B0B0B] dark:bg-[#E7FA53] text-[#EFEFE9] dark:text-[#0B0B0B] hover:bg-[#D61914] dark:hover:bg-white hover:text-white dark:hover:text-[#0B0B0B] type-sm font-semibold rounded-[6px] transition-colors duration-200"
          >
            <span>{t(translations.home.heroExplore)}</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Flex-Filling Interactive WebGL Showcase Stage (Fits 100% Inside Single Screen) */}
      <section
        aria-label={t(translations.works.title)}
        className="flex-1 min-h-0 w-full flex flex-col justify-between mt-1"
      >
        <div
          style={{
            transform: `scale(${carouselScale.toFixed(4)})`,
            transition:
              Math.abs(clampedVel) > 0.01
                ? 'none'
                : 'transform 320ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
          className="flex-1 min-h-[190px] w-full will-change-transform"
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
          <div className="shrink-0 border-t border-[#0B0B0B]/12 dark:border-white/12 px-4 sm:px-8 py-2.5 flex flex-wrap items-center justify-between gap-4 bg-[#EFEFE9] dark:bg-[#0C0C0F] transition-colors duration-200">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 min-w-0">
              <span className="type-sm tabular-nums font-medium text-[#0B0B0B]/60 dark:text-[#EFEFE9]/60 shrink-0">
                {activeIndex + 1} / {projects.length}
              </span>

              <button
                type="button"
                onClick={() => openProject(currentProject)}
                onMouseEnter={() => playHover()}
                className="font-display font-bold text-base sm:text-lg tracking-[-0.02em] text-[#0B0B0B] dark:text-[#EFEFE9] hover:text-[#D61914] dark:hover:text-[#E7FA53] transition-colors duration-150 text-left truncate max-w-[68vw] sm:max-w-[44vw]"
              >
                {shortTitle}
              </button>

              <span className="hidden md:inline-block type-sm text-[#0B0B0B]/60 dark:text-[#EFEFE9]/60 truncate">
                {t(currentProject.categoryLabel)}
              </span>
            </div>

            <div className="flex items-center gap-3 shrink-0 ml-auto">
              <div className="flex items-center bg-[#E5E4DC] dark:bg-[#16161B] p-0.5 rounded-[6px]">
                <button
                  type="button"
                  onClick={() => carouselRef.current?.prev()}
                  aria-label={lang === 'ru' ? 'Предыдущий проект' : 'Previous project'}
                  className="w-8 h-8 rounded-[5px] hover:bg-[#0B0B0B] dark:hover:bg-[#E7FA53] hover:text-[#EFEFE9] dark:hover:text-[#0B0B0B] transition-colors duration-150 flex items-center justify-center"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => carouselRef.current?.next()}
                  aria-label={lang === 'ru' ? 'Следующий проект' : 'Next project'}
                  className="w-8 h-8 rounded-[5px] hover:bg-[#0B0B0B] dark:hover:bg-[#E7FA53] hover:text-[#EFEFE9] dark:hover:text-[#0B0B0B] transition-colors duration-150 flex items-center justify-center"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => openProject(currentProject)}
                onMouseEnter={() => playHover()}
                className="type-sm font-semibold underline underline-offset-4 hover:text-[#D61914] dark:hover:text-[#E7FA53] transition-colors duration-150 whitespace-nowrap"
              >
                {lang === 'ru' ? 'Открыть кейс' : 'Open case'}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
