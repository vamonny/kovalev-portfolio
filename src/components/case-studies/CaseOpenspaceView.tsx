import { useRef } from 'react';
import { ArrowDownRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n/translations';
import { RubberText } from '../RubberText';
import { RubberBlock } from '../RubberMotion';
import { IdentityShowcase } from '../IdentityShowcase';
import {
  CaseNextProjectBar,
  CaseTopUtilityBar,
  CaseViewProps,
  cleanProjectTitle,
} from './CaseSharedChrome';

export function CaseOpenspaceView({
  project,
  nextProject,
  caseIndex,
  totalCases,
  onInspectImage,
  onOpenNext,
  onBackToWorks,
}: CaseViewProps) {
  const { lang, t } = useLanguage();
  const platesRef = useRef<HTMLDivElement>(null);
  const cleanTitle = cleanProjectTitle(t(project.title));

  return (
    <div
      style={{
        backgroundImage:
          'radial-gradient(ellipse 64% 40% at 50% 0%, rgba(0, 159, 227, 0.1), transparent 68%)',
      }}
      className="min-h-screen bg-[#EAF0F5] dark:bg-[#08101A] text-[#081426] dark:text-[#EDF4FA] pb-20 overflow-x-hidden transition-colors duration-200"
    >
      <CaseTopUtilityBar
        slotCode={project.slotCode}
        year={project.year}
        caseIndex={caseIndex}
        totalCases={totalCases}
        onBackToWorks={onBackToWorks}
      />

      {/* Centered Spatial Monumental Hero + Inline Cloud Emblem */}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-8 pt-8 sm:pt-12 pb-8 text-center flex flex-col items-center">
        {project.coverImage && (
          <button
            type="button"
            onClick={() =>
              onInspectImage({
                src: project.coverImage,
                caption: `${project.slotCode}: ${lang === 'ru' ? 'Основной знак' : 'Primary emblem'}`,
              })
            }
            className="mb-5 px-5 py-2.5 bg-white border border-[#0B4F78]/15 shadow-sm hover:border-[#009FE3] transition-colors duration-150"
          >
            <img
              src={project.coverImage}
              alt={project.slotCode}
              className="h-11 w-auto object-contain"
            />
          </button>
        )}

        <h1 className="font-display font-extrabold tracking-[-0.042em] leading-[0.95] text-[clamp(2.25rem,5.2vw,4.75rem)] text-balance-safe max-w-5xl">
          <RubberText text={cleanTitle} stretchStrength={0.85} className="justify-center" />
        </h1>

        <p className="type-body text-[#081426]/80 dark:text-[#EDF4FA]/80 max-w-[58ch] mt-4">
          {t(project.subtitle)}
        </p>

        {project.identityPlates && (
          <div className="mt-6">
            <button
              type="button"
              onClick={() => platesRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0B4F78] hover:bg-[#083B5A] text-white type-sm font-semibold rounded-[6px] transition-colors duration-150"
            >
              <span>
                {lang === 'ru' ? 'Смотреть все 11 носителей' : 'Explore 11 identity plates'}
              </span>
              <ArrowDownRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {project.heroImage && (
          <RubberBlock immediate skewFactor={-0.45} driftFactor={-4} className="w-full max-w-[1160px] mt-10">
            <button
              type="button"
              onClick={() =>
                onInspectImage({
                  src: project.heroImage!,
                  caption: `${project.slotCode}: ${cleanTitle}`,
                })
              }
              className="group block w-full overflow-hidden border border-[#0B4F78]/20 dark:border-[#009FE3]/25 bg-[#081426] shadow-[0_28px_72px_-24px_rgba(11,79,120,0.34)] text-left"
            >
              <img
                src={project.heroImage}
                alt={cleanTitle}
                decoding="async"
                className="w-full h-auto block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.015]"
              />
            </button>
          </RubberBlock>
        )}
      </section>

      {/* Main 11-Plate Identity Showcase */}
      {project.identityPlates && (
        <div
          ref={platesRef}
          className="border-y border-[#0B4F78]/12 dark:border-white/12 bg-white/65 dark:bg-[#0B1522] my-4"
        >
          <IdentityShowcase
            plates={project.identityPlates}
            accentColor="#0B4F78"
            onInspectImage={onInspectImage}
          />
        </div>
      )}

      {/* Dual-Polarity Architecture & Rollout */}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-8 py-12 space-y-12">
        <div className="max-w-[65ch] space-y-3">
          <h2 className="type-heading font-display font-bold">
            {t(translations.caseStudy.sections.task).replace(/^\d+\.\s*/, '')}
          </h2>
          <p className="type-body text-[#081426]/82 dark:text-[#EDF4FA]/82">{t(project.task)}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 border-t border-[#0B4F78]/14 dark:border-white/12">
          <div className="lg:col-span-5 space-y-3">
            <h2 className="type-heading font-display font-bold text-[#0B4F78] dark:text-[#55C7F7]">
              {t(translations.caseStudy.sections.problem).replace(/^\d+\.\s*/, '')}
            </h2>
            <p className="type-body text-[#081426]/82 dark:text-[#EDF4FA]/82 max-w-[60ch]">
              {t(project.problem)}
            </p>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <h2 className="type-heading font-display font-bold text-[#0B4F78] dark:text-[#55C7F7]">
              {t(translations.caseStudy.sections.concept).replace(/^\d+\.\s*/, '')}
            </h2>
            <p className="type-body text-[#081426]/88 dark:text-[#EDF4FA]/88 max-w-[65ch]">
              {t(project.concept)}
            </p>
            <p className="type-body text-[#081426]/78 dark:text-[#EDF4FA]/78 max-w-[65ch]">
              {t(project.visualSystemNotes)}
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-[#0B4F78]/14 dark:border-white/12">
          <h2 className="type-heading font-display font-bold mb-6">
            {t(translations.caseStudy.sections.process).replace(/^\d+\.\s*/, '')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {project.processStages.map((stage, i) => (
              <div key={i} className="space-y-2.5">
                <p className="type-sm tabular-nums font-semibold text-[#0B4F78] dark:text-[#55C7F7]">
                  {t(stage.label)}
                </p>
                <h3 className="type-heading font-display font-bold">{t(stage.title)}</h3>
                <p className="type-body text-[#081426]/80 dark:text-[#EDF4FA]/80">
                  {t(stage.description)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-8 border-t border-[#0B4F78]/14 dark:border-white/12">
          <div className="space-y-4">
            <h2 className="type-heading font-display font-bold">
              {t(translations.caseStudy.sections.decisions).replace(/^\d+\.\s*/, '')}
            </h2>
            <ul className="space-y-3 type-body text-[#081426]/85 dark:text-[#EDF4FA]/85">
              {project.graphicDecisions.map((item, idx) => (
                <li key={idx} className="flex gap-3 items-baseline">
                  <span className="tabular-nums font-semibold text-[#0B4F78] dark:text-[#55C7F7] shrink-0">
                    {idx + 1}.
                  </span>
                  <span>{t(item)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="type-heading font-display font-bold">
                {t(translations.caseStudy.sections.applications).replace(/^\d+\.\s*/, '')}
              </h2>
              <ul className="divide-y divide-[#0B4F78]/12 dark:divide-white/12 border-y border-[#0B4F78]/12 dark:border-white/12 type-body">
                {project.applications.map((app, idx) => (
                  <li key={idx} className="py-3">
                    {t(app)}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap items-center gap-4 type-sm opacity-75">
              <span>{project.typographySpec.display}</span>
              <span className="flex items-center gap-2">
                {project.typographySpec.palette.map((hex) => (
                  <span key={hex} className="inline-flex items-center gap-1.5">
                    <span
                      style={{ backgroundColor: hex }}
                      className="w-3 h-3 inline-block border border-black/20"
                    />
                    <span>{hex}</span>
                  </span>
                ))}
              </span>
            </div>
          </div>
        </div>
      </section>

      <CaseNextProjectBar
        nextProject={nextProject}
        currentProjectId={project.id}
        onOpenNext={onOpenNext}
        accentColor="#009FE3"
      />
    </div>
  );
}
