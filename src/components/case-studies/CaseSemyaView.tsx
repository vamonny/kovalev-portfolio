import { useRef } from 'react';
import { ArrowDownRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n/translations';
import { RubberText } from '../RubberText';
import { RubberBlock } from '../RubberMotion';
import { BeforeAfterShowcase } from '../BeforeAfterShowcase';
import {
  CaseNextProjectBar,
  CaseTopUtilityBar,
  CaseViewProps,
  cleanProjectTitle,
} from './CaseSharedChrome';

export function CaseSemyaView({
  project,
  nextProject,
  caseIndex,
  totalCases,
  onInspectImage,
  onOpenNext,
  onBackToWorks,
}: CaseViewProps) {
  const { lang, t } = useLanguage();
  const showcaseRef = useRef<HTMLDivElement>(null);
  const cleanTitle = cleanProjectTitle(t(project.title));

  return (
    <div
      style={{
        backgroundImage:
          'linear-gradient(to right, rgba(21,94,239,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(21,94,239,0.045) 1px, transparent 1px)',
        backgroundSize: '44px 44px',
      }}
      className="min-h-screen bg-[#F5F8FC] dark:bg-[#070D17] text-[#0A1322] dark:text-[#EDF3FC] pb-20 overflow-x-hidden transition-colors duration-200"
    >
      <CaseTopUtilityBar
        slotCode={project.slotCode}
        year={project.year}
        caseIndex={caseIndex}
        totalCases={totalCases}
        onBackToWorks={onBackToWorks}
      />

      {/* Full-Width Clinical Centerpiece Hero + Immediate UI Stage */}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-8 pt-8 sm:pt-12 pb-8 text-center flex flex-col items-center">
        <h1 className="font-display font-extrabold tracking-[-0.042em] leading-[0.95] text-[clamp(2.25rem,5.2vw,4.75rem)] text-balance-safe max-w-5xl">
          <RubberText text={cleanTitle} stretchStrength={0.85} className="justify-center" />
        </h1>

        <p className="type-body text-[#0A1322]/78 dark:text-[#EDF3FC]/78 max-w-[58ch] mt-4">
          {t(project.subtitle)}
        </p>

        {project.beforeAfter && (
          <div className="mt-6">
            <button
              type="button"
              onClick={() => showcaseRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#155EEF] hover:bg-[#0D4CD1] text-white type-sm font-semibold rounded-[6px] transition-colors duration-150"
            >
              <span>
                {lang === 'ru' ? 'Сравнить старый и новый сайт' : 'Compare old and new site'}
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
              className="group block w-full overflow-hidden border border-[#155EEF]/20 dark:border-[#00C6FF]/20 bg-[#0A1322] shadow-[0_24px_60px_-24px_rgba(21,94,239,0.25)] text-left"
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

      {/* Primary Interactive Showcase */}
      {project.beforeAfter && (
        <div
          ref={showcaseRef}
          className="border-y border-[#155EEF]/14 dark:border-[#00C6FF]/14 bg-white/75 dark:bg-[#09101D]/85 my-4"
        >
          <BeforeAfterShowcase
            pairs={project.beforeAfter.pairs}
            extraPlates={project.beforeAfter.extraPlates}
            accentColor="#155EEF"
            onInspectImage={onInspectImage}
          />
        </div>
      )}

      {/* Project Brief & Diagnostic Audit */}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-8 py-12 space-y-12">
        <div className="max-w-[65ch] space-y-3">
          <h2 className="type-heading font-display font-bold">
            {t(translations.caseStudy.sections.task).replace(/^\d+\.\s*/, '')}
          </h2>
          <p className="type-body text-[#0A1322]/82 dark:text-[#EDF3FC]/82">{t(project.task)}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 border-t border-[#155EEF]/14 dark:border-white/12">
          <div className="lg:col-span-5 space-y-3">
            <h2 className="type-heading font-display font-bold text-[#D61914] dark:text-[#FF7872]">
              {t(translations.caseStudy.sections.problem).replace(/^\d+\.\s*/, '')}
            </h2>
            <p className="type-body text-[#0A1322]/82 dark:text-[#EDF3FC]/82 max-w-[60ch]">
              {t(project.problem)}
            </p>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <h2 className="type-heading font-display font-bold text-[#155EEF] dark:text-[#55C7F7]">
              {t(translations.caseStudy.sections.concept).replace(/^\d+\.\s*/, '')}
            </h2>
            <p className="type-body text-[#0A1322]/85 dark:text-[#EDF3FC]/85 max-w-[65ch]">
              {t(project.concept)}
            </p>
            <p className="type-body text-[#0A1322]/75 dark:text-[#EDF3FC]/75 max-w-[65ch]">
              {t(project.visualSystemNotes)}
            </p>
          </div>
        </div>

        {/* Process Stages (Real 3-phase sequence) */}
        <div className="pt-8 border-t border-[#155EEF]/14 dark:border-white/12">
          <h2 className="type-heading font-display font-bold mb-6">
            {t(translations.caseStudy.sections.process).replace(/^\d+\.\s*/, '')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {project.processStages.map((stage, idx) => (
              <div key={idx} className="space-y-2.5">
                <p className="type-sm tabular-nums font-semibold text-[#155EEF] dark:text-[#55C7F7]">
                  {t(stage.label)}
                </p>
                <h3 className="type-heading font-display font-bold">{t(stage.title)}</h3>
                <p className="type-body text-[#0A1322]/80 dark:text-[#EDF3FC]/80">
                  {t(stage.description)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Decisions, Applications & System Swatches */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-8 border-t border-[#155EEF]/14 dark:border-white/12">
          <div className="space-y-4">
            <h2 className="type-heading font-display font-bold">
              {t(translations.caseStudy.sections.decisions).replace(/^\d+\.\s*/, '')}
            </h2>
            <ul className="space-y-3 type-body text-[#0A1322]/85 dark:text-[#EDF3FC]/85">
              {project.graphicDecisions.map((item, idx) => (
                <li key={idx} className="flex gap-3 items-baseline">
                  <span className="tabular-nums font-semibold text-[#155EEF] dark:text-[#55C7F7] shrink-0">
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
              <ul className="divide-y divide-[#155EEF]/12 dark:divide-white/12 border-y border-[#155EEF]/12 dark:border-white/12 type-body">
                {project.applications.map((app, idx) => (
                  <li key={idx} className="py-3">
                    {t(app)}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap items-center gap-4 type-sm text-[#0A1322]/70 dark:text-[#EDF3FC]/70">
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
        accentColor="#155EEF"
      />
    </div>
  );
}
