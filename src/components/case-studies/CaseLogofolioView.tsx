import { useRef } from 'react';
import { ArrowDownRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n/translations';
import { RubberText } from '../RubberText';
import { RubberBlock } from '../RubberMotion';
import { LogofolioShowcase } from '../LogofolioShowcase';
import {
  CaseNextProjectBar,
  CaseTopUtilityBar,
  CaseViewProps,
  cleanProjectTitle,
} from './CaseSharedChrome';

export function CaseLogofolioView({
  project,
  nextProject,
  caseIndex,
  totalCases,
  onInspectImage,
  onOpenNext,
  onBackToWorks,
}: CaseViewProps) {
  const { lang, t } = useLanguage();
  const marksRef = useRef<HTMLDivElement>(null);
  const cleanTitle = cleanProjectTitle(t(project.title));

  return (
    <div className="min-h-screen bg-[#ECECE6] dark:bg-[#0C1010] text-[#1A1C1B] dark:text-[#EDF0EE] pb-20 overflow-x-hidden transition-colors duration-200">
      <CaseTopUtilityBar
        slotCode={project.slotCode}
        year={project.year}
        caseIndex={caseIndex}
        totalCases={totalCases}
        onBackToWorks={onBackToWorks}
      />

      {/* Full-Width Archival Centerpiece Hero */}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-8 pt-8 sm:pt-12 pb-8 text-center flex flex-col items-center">
        <h1 className="font-display font-extrabold tracking-[-0.042em] leading-[0.95] text-[clamp(2.25rem,5.2vw,4.75rem)] text-balance-safe max-w-5xl">
          <RubberText text={cleanTitle} stretchStrength={0.85} className="justify-center" />
        </h1>

        <p className="type-body text-[#1A1C1B]/78 dark:text-[#EDF0EE]/78 max-w-[58ch] mt-4">
          {t(project.subtitle)}
        </p>

        {project.logofolioData && (
          <div className="mt-6">
            <button
              type="button"
              onClick={() => marksRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#346E71] hover:bg-[#254E50] text-white type-sm font-semibold rounded-[6px] transition-colors duration-150"
            >
              <span>
                {lang === 'ru' ? 'Перейти к архиву знаков' : 'Explore marks archive'}
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
              className="group block w-full overflow-hidden border border-[#1A1C1B]/14 dark:border-white/14 bg-white shadow-[0_24px_60px_-24px_rgba(11,11,11,0.16)] text-left"
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

      {/* Main Light-Table Interactive Archive */}
      {project.logofolioData && (
        <div ref={marksRef} className="bg-[#F6F6F2] dark:bg-[#111616]">
          <LogofolioShowcase
            plates={project.logofolioData.plates}
            coverPlateSrc={project.logofolioData.coverPlateSrc}
            accentColor="#346E71"
            onInspectImage={onInspectImage}
          />
        </div>
      )}

      {/* Colophon & Construction Notes */}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-8 py-12 space-y-12">
        <div className="max-w-[65ch] space-y-3">
          <h2 className="type-heading font-display font-bold">
            {t(translations.caseStudy.sections.task).replace(/^\d+\.\s*/, '')}
          </h2>
          <p className="type-body text-[#1A1C1B]/82 dark:text-[#EDF0EE]/82">{t(project.task)}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 border-t border-[#1A1C1B]/12 dark:border-white/12">
          <div className="lg:col-span-5 space-y-3">
            <h2 className="type-heading font-display font-bold text-[#346E71] dark:text-[#6CC4C8]">
              {t(translations.caseStudy.sections.problem).replace(/^\d+\.\s*/, '')}
            </h2>
            <p className="type-body text-[#1A1C1B]/82 dark:text-[#EDF0EE]/82 max-w-[60ch]">
              {t(project.problem)}
            </p>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <h2 className="type-heading font-display font-bold text-[#346E71] dark:text-[#6CC4C8]">
              {t(translations.caseStudy.sections.concept).replace(/^\d+\.\s*/, '')}
            </h2>
            <p className="type-body text-[#1A1C1B]/85 dark:text-[#EDF0EE]/85 max-w-[65ch]">
              {t(project.concept)}
            </p>
            <p className="type-body text-[#1A1C1B]/75 dark:text-[#EDF0EE]/75 max-w-[65ch]">
              {t(project.visualSystemNotes)}
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-[#1A1C1B]/12 dark:border-white/12">
          <h2 className="type-heading font-display font-bold mb-6">
            {t(translations.caseStudy.sections.process).replace(/^\d+\.\s*/, '')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {project.processStages.map((stage, i) => (
              <div key={i} className="space-y-2.5">
                <p className="type-sm tabular-nums font-semibold text-[#346E71] dark:text-[#6CC4C8]">
                  {t(stage.label)}
                </p>
                <h3 className="type-heading font-display font-bold">{t(stage.title)}</h3>
                <p className="type-body text-[#1A1C1B]/80 dark:text-[#EDF0EE]/80">
                  {t(stage.description)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-8 border-t border-[#1A1C1B]/12 dark:border-white/12">
          <div className="space-y-4">
            <h2 className="type-heading font-display font-bold">
              {t(translations.caseStudy.sections.decisions).replace(/^\d+\.\s*/, '')}
            </h2>
            <ul className="space-y-3 type-body text-[#1A1C1B]/85 dark:text-[#EDF0EE]/85">
              {project.graphicDecisions.map((item, idx) => (
                <li key={idx} className="flex gap-3 items-baseline">
                  <span className="tabular-nums font-semibold text-[#346E71] dark:text-[#6CC4C8] shrink-0">
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
              <ul className="divide-y divide-[#1A1C1B]/12 dark:divide-white/12 border-y border-[#1A1C1B]/12 dark:border-white/12 type-body">
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
        accentColor="#346E71"
      />
    </div>
  );
}
