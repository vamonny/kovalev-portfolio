import { useRef } from 'react';
import { ArrowDownRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n/translations';
import { RubberText } from '../RubberText';
import { RubberBlock } from '../RubberMotion';
import { BrandbookShowcase } from '../BrandbookShowcase';
import {
  CaseNextProjectBar,
  CaseTopUtilityBar,
  CaseViewProps,
  cleanProjectTitle,
} from './CaseSharedChrome';

export function CasePafosView({
  project,
  nextProject,
  caseIndex,
  totalCases,
  onInspectImage,
  onOpenNext,
  onBackToWorks,
}: CaseViewProps) {
  const { lang, t } = useLanguage();
  const slidesRef = useRef<HTMLDivElement>(null);
  const cleanTitle = cleanProjectTitle(t(project.title));

  return (
    <div
      style={{
        backgroundImage:
          'radial-gradient(ellipse 65% 42% at 50% 0%, rgba(230, 0, 126, 0.2), transparent 68%)',
      }}
      className="dark min-h-screen bg-[#08060A] text-[#F4F1EA] pb-20 overflow-x-hidden"
    >
      <CaseTopUtilityBar
        slotCode={project.slotCode}
        year={project.year}
        caseIndex={caseIndex}
        totalCases={totalCases}
        onBackToWorks={onBackToWorks}
        tone="dark"
      />

      {/* Atmospheric Obsidian Velvet Hero */}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-8 pt-8 sm:pt-12 pb-8 text-center flex flex-col items-center">
        <h1 className="font-display font-extrabold tracking-[-0.042em] leading-[0.95] text-[clamp(2.25rem,5.2vw,4.75rem)] text-white text-balance-safe max-w-5xl">
          <RubberText text={cleanTitle} stretchStrength={0.85} className="justify-center" />
        </h1>

        <p className="type-body text-white/78 max-w-[58ch] mt-4">
          {t(project.subtitle)}
        </p>

        {project.brandbookData && (
          <div className="mt-6">
            <button
              type="button"
              onClick={() => slidesRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#E6007E] hover:bg-[#FF1C96] text-white type-sm font-semibold rounded-[6px] transition-colors duration-150"
            >
              <span>
                {lang === 'ru' ? 'Листать весь брендбук' : 'Open brand guidelines'}
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
              className="group block w-full overflow-hidden border border-[#E6007E]/30 bg-[#0E0B10] shadow-[0_30px_90px_-24px_rgba(230,0,126,0.38)] text-left"
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

      {/* Main Interactive Brandbook Reader */}
      {project.brandbookData && (
        <div ref={slidesRef} className="my-4">
          <BrandbookShowcase
            slides={project.brandbookData.slides}
            accentColor={project.theme.accent}
            onInspectImage={onInspectImage}
          />
        </div>
      )}

      {/* Nocturnal Philosophy & VIP Visual System */}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-8 py-12 space-y-12">
        <div className="max-w-[65ch] space-y-3">
          <h2 className="type-heading font-display font-bold text-white">
            {t(translations.caseStudy.sections.task).replace(/^\d+\.\s*/, '')}
          </h2>
          <p className="type-body text-white/82">{t(project.task)}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 border-t border-white/12">
          <div className="lg:col-span-5 space-y-3">
            <h2 className="type-heading font-display font-bold text-[#FF77BF]">
              {t(translations.caseStudy.sections.problem).replace(/^\d+\.\s*/, '')}
            </h2>
            <p className="type-body text-white/82 max-w-[60ch]">{t(project.problem)}</p>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <h2 className="type-heading font-display font-bold text-[#E6007E]">
              {t(translations.caseStudy.sections.concept).replace(/^\d+\.\s*/, '')}
            </h2>
            <p className="type-body text-white/88 max-w-[65ch]">{t(project.concept)}</p>
            <p className="type-body text-white/75 max-w-[65ch]">{t(project.visualSystemNotes)}</p>
          </div>
        </div>

        <div className="pt-8 border-t border-white/12">
          <h2 className="type-heading font-display font-bold text-white mb-6">
            {t(translations.caseStudy.sections.process).replace(/^\d+\.\s*/, '')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {project.processStages.map((stage, i) => (
              <div key={i} className="space-y-2.5">
                <p className="type-sm tabular-nums font-semibold text-[#FF77BF]">
                  {t(stage.label)}
                </p>
                <h3 className="type-heading font-display font-bold text-white">
                  {t(stage.title)}
                </h3>
                <p className="type-body text-white/76">{t(stage.description)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-8 border-t border-white/12">
          <div className="space-y-4">
            <h2 className="type-heading font-display font-bold text-white">
              {t(translations.caseStudy.sections.decisions).replace(/^\d+\.\s*/, '')}
            </h2>
            <ul className="space-y-3 type-body text-white/85">
              {project.graphicDecisions.map((item, idx) => (
                <li key={idx} className="flex gap-3 items-baseline">
                  <span className="tabular-nums font-semibold text-[#FF77BF] shrink-0">
                    {idx + 1}.
                  </span>
                  <span>{t(item)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="type-heading font-display font-bold text-white">
                {t(translations.caseStudy.sections.applications).replace(/^\d+\.\s*/, '')}
              </h2>
              <ul className="divide-y divide-white/12 border-y border-white/12 type-body text-white/85">
                {project.applications.map((app, idx) => (
                  <li key={idx} className="py-3">
                    {t(app)}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap items-center gap-4 type-sm text-white/65">
              <span>{project.typographySpec.display}</span>
              <span className="flex items-center gap-2">
                {project.typographySpec.palette.map((hex) => (
                  <span key={hex} className="inline-flex items-center gap-1.5">
                    <span
                      style={{ backgroundColor: hex }}
                      className="w-3 h-3 inline-block border border-white/25"
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
        tone="dark"
        accentColor="#E6007E"
      />
    </div>
  );
}
