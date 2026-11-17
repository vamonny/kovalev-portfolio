import { BookOpen } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n/translations';
import { RubberText } from '../RubberText';
import { RubberBlock } from '../RubberMotion';
import { EncyclopediaReader } from '../EncyclopediaReader';
import {
  CaseNextProjectBar,
  CaseTopUtilityBar,
  CaseViewProps,
  cleanProjectTitle,
} from './CaseSharedChrome';

export function CaseEncyclopediaView({
  project,
  nextProject,
  caseIndex,
  totalCases,
  onInspectImage,
  onOpenNext,
  onBackToWorks,
}: CaseViewProps) {
  const { lang, t } = useLanguage();
  const cleanTitle = cleanProjectTitle(t(project.title));
  const pdfUrl = project.encyclopediaData?.pdfUrl;

  return (
    <div className="min-h-screen bg-[#F4ECE0] dark:bg-[#12110E] text-[#171512] dark:text-[#F3EBDC] pb-20 overflow-x-clip transition-colors duration-200">
      <CaseTopUtilityBar
        slotCode={project.slotCode}
        year={project.year}
        caseIndex={caseIndex}
        totalCases={totalCases}
        onBackToWorks={onBackToWorks}
      />

      {/* Full-Width Book Centerpiece Hero */}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-8 pt-8 sm:pt-12 pb-8 text-center flex flex-col items-center">
        <h1 className="font-display font-extrabold tracking-[-0.042em] leading-[0.95] text-[clamp(2.25rem,5.2vw,4.75rem)] text-balance-safe max-w-5xl">
          <RubberText text={cleanTitle} stretchStrength={0.85} className="justify-center" />
        </h1>

        <RubberBlock immediate skewFactor={0.45} driftFactor={4} className="flex flex-col items-center">
          <p className="type-body text-[#171512]/80 dark:text-[#F3EBDC]/80 max-w-[58ch] mt-4">
            {t(project.subtitle)}
          </p>

          {pdfUrl && (
            <div className="mt-6">
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0B3AA4] hover:bg-[#082C7D] text-[#F3EBDC] type-sm font-semibold rounded-[6px] transition-colors duration-150"
              >
                <BookOpen className="w-4 h-4" />
                <span>
                  {lang === 'ru' ? 'Скачать полный PDF (61 стр.)' : 'Download full PDF (61 pp.)'}
                </span>
              </a>
            </div>
          )}
        </RubberBlock>

        {project.heroImage && (
          <RubberBlock immediate skewFactor={-0.65} driftFactor={-6} className="w-full max-w-[1160px] mt-10">
            <button
              type="button"
              onClick={() =>
                onInspectImage({
                  src: project.heroImage!,
                  caption: `${project.slotCode}: ${cleanTitle}`,
                })
              }
              className="group block w-full overflow-hidden border border-[#171512]/16 dark:border-white/15 bg-[#171512] shadow-[0_24px_60px_-24px_rgba(23,21,18,0.28)] text-left"
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

      {/* Main 30-Chapter Interactive Reader */}
      {project.encyclopediaData && (
        <div className="border-y border-[#171512]/14 dark:border-white/14 bg-[#EDE4D5] dark:bg-[#161410] my-4">
          <EncyclopediaReader
            spreads={project.encyclopediaData.spreads}
            pdfUrl={project.encyclopediaData.pdfUrl}
            accentColor="#0B3AA4"
            onInspectImage={onInspectImage}
          />
        </div>
      )}

      {/* Project Brief & Editorial Essay */}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-8 py-12 space-y-12">
        <RubberBlock skewFactor={0.65} driftFactor={6} className="max-w-[65ch] space-y-3">
          <h2 className="type-heading font-display font-bold">
            {t(translations.caseStudy.sections.task).replace(/^\d+\.\s*/, '')}
          </h2>
          <p className="type-body text-[#171512]/85 dark:text-[#F3EBDC]/85">{t(project.task)}</p>
        </RubberBlock>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 border-t border-[#171512]/14 dark:border-white/14">
          <RubberBlock skewFactor={0.85} driftFactor={8} className="lg:col-span-5 space-y-3">
            <h2 className="type-heading font-display font-bold text-[#0B3AA4] dark:text-[#F6E238]">
              {t(translations.caseStudy.sections.problem).replace(/^\d+\.\s*/, '')}
            </h2>
            <p className="type-body text-[#171512]/85 dark:text-[#F3EBDC]/85 max-w-[60ch]">
              {t(project.problem)}
            </p>
          </RubberBlock>

          <RubberBlock skewFactor={-0.85} driftFactor={-8} delay={0.05} className="lg:col-span-7 space-y-4">
            <h2 className="type-heading font-display font-bold text-[#0B3AA4] dark:text-[#F6E238]">
              {t(translations.caseStudy.sections.concept).replace(/^\d+\.\s*/, '')}
            </h2>
            <p className="type-body text-[#171512]/88 dark:text-[#F3EBDC]/88 max-w-[65ch]">
              {t(project.concept)}
            </p>
            <p className="type-body text-[#171512]/78 dark:text-[#F3EBDC]/78 max-w-[65ch]">
              {t(project.visualSystemNotes)}
            </p>
          </RubberBlock>
        </div>

        <div className="pt-8 border-t border-[#171512]/14 dark:border-white/14">
          <h2 className="type-heading font-display font-bold mb-6">
            {t(translations.caseStudy.sections.process).replace(/^\d+\.\s*/, '')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {project.processStages.map((stage, i) => (
              <RubberBlock
                key={i}
                skewFactor={i % 2 === 0 ? 0.7 : -0.7}
                driftFactor={i % 2 === 0 ? 7 : -7}
                delay={i * 0.04}
                className="space-y-2.5"
              >
                <p className="type-sm tabular-nums font-semibold text-[#0B3AA4] dark:text-[#F6E238]">
                  {t(stage.label)}
                </p>
                <h3 className="type-heading font-display font-bold">{t(stage.title)}</h3>
                <p className="type-body text-[#171512]/80 dark:text-[#F3EBDC]/80">
                  {t(stage.description)}
                </p>
              </RubberBlock>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-8 border-t border-[#171512]/14 dark:border-white/14">
          <RubberBlock skewFactor={0.8} driftFactor={7} className="space-y-4">
            <h2 className="type-heading font-display font-bold">
              {t(translations.caseStudy.sections.decisions).replace(/^\d+\.\s*/, '')}
            </h2>
            <ul className="space-y-3 type-body text-[#171512]/85 dark:text-[#F3EBDC]/85">
              {project.graphicDecisions.map((item, idx) => (
                <li key={idx} className="flex gap-3 items-baseline">
                  <span className="tabular-nums font-semibold text-[#0B3AA4] dark:text-[#F6E238] shrink-0">
                    {idx + 1}.
                  </span>
                  <span>{t(item)}</span>
                </li>
              ))}
            </ul>
          </RubberBlock>

          <RubberBlock skewFactor={-0.8} driftFactor={-7} delay={0.05} className="space-y-6">
            <div className="space-y-4">
              <h2 className="type-heading font-display font-bold">
                {t(translations.caseStudy.sections.applications).replace(/^\d+\.\s*/, '')}
              </h2>
              <ul className="divide-y divide-[#171512]/12 dark:divide-white/12 border-y border-[#171512]/12 dark:border-white/12 type-body">
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
          </RubberBlock>
        </div>
      </section>

      <CaseNextProjectBar
        nextProject={nextProject}
        currentProjectId={project.id}
        onOpenNext={onOpenNext}
        accentColor="#F6E238"
      />
    </div>
  );
}
