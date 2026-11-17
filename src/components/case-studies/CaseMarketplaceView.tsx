import { useRef } from 'react';
import { ArrowDownRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n/translations';
import { RubberText } from '../RubberText';
import { RubberBlock } from '../RubberMotion';
import { MarketplaceSeriesShowcase } from '../MarketplaceSeriesShowcase';
import {
  CaseNextProjectBar,
  CaseTopUtilityBar,
  CaseViewProps,
  cleanProjectTitle,
} from './CaseSharedChrome';

export function CaseMarketplaceView({
  project,
  nextProject,
  caseIndex,
  totalCases,
  onInspectImage,
  onOpenNext,
  onBackToWorks,
}: CaseViewProps) {
  const { lang, t } = useLanguage();
  const seriesRef = useRef<HTMLDivElement>(null);
  const cleanTitle = cleanProjectTitle(t(project.title));

  return (
    <div
      style={{
        backgroundImage:
          'radial-gradient(ellipse 68% 42% at 50% 0%, rgba(255, 67, 147, 0.14), transparent 70%)',
      }}
      className="dark min-h-screen bg-[#0E0F14] text-[#EFEFE9] pb-20 overflow-x-hidden"
    >
      <CaseTopUtilityBar
        slotCode={project.slotCode}
        year={project.year}
        caseIndex={caseIndex}
        totalCases={totalCases}
        onBackToWorks={onBackToWorks}
        tone="dark"
      />

      {/* Commanding Dark Showroom Centerpiece */}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-8 pt-8 sm:pt-12 pb-8 text-center flex flex-col items-center">
        <h1 className="font-display font-extrabold tracking-[-0.042em] leading-[0.95] text-[clamp(2.25rem,5.2vw,4.75rem)] text-white text-balance-safe max-w-5xl">
          <RubberText text={cleanTitle} stretchStrength={0.85} className="justify-center" />
        </h1>

        <p className="type-body text-white/78 max-w-[58ch] mt-4">
          {t(project.subtitle)}
        </p>

        {project.marketplaceSeries && (
          <div className="mt-6">
            <button
              type="button"
              onClick={() => seriesRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#E7FA53] hover:bg-white text-[#0B0B0B] type-sm font-semibold rounded-[6px] transition-colors duration-150"
            >
              <span>
                {lang === 'ru' ? 'Смотреть 5 серий карточек' : 'Browse 5 product series'}
              </span>
              <ArrowDownRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {(project.heroImage || project.coverImage) && (
          <RubberBlock immediate skewFactor={-0.45} driftFactor={-4} className="w-full max-w-[1160px] mt-10">
            <button
              type="button"
              onClick={() =>
                onInspectImage({
                  src: project.heroImage || project.coverImage,
                  caption: `${project.slotCode}: ${cleanTitle}`,
                })
              }
              className="group block w-full overflow-hidden border border-white/14 bg-[#151720] shadow-[0_30px_80px_-28px_rgba(255,67,147,0.28)] text-left"
            >
              <img
                src={project.heroImage || project.coverImage}
                alt={cleanTitle}
                decoding="async"
                className="w-full h-auto block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.015]"
              />
            </button>
          </RubberBlock>
        )}
      </section>

      {/* Main Interactive Showcase */}
      {project.marketplaceSeries && (
        <div ref={seriesRef} className="border-y border-white/10 bg-[#12131A] my-4">
          <MarketplaceSeriesShowcase
            series={project.marketplaceSeries}
            accentColor="#E7FA53"
            onInspectImage={onInspectImage}
          />
        </div>
      )}

      {/* Project Brief & Shelf Strategy */}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-8 py-12 space-y-12">
        <div className="max-w-[65ch] space-y-3">
          <h2 className="type-heading font-display font-bold text-white">
            {t(translations.caseStudy.sections.task).replace(/^\d+\.\s*/, '')}
          </h2>
          <p className="type-body text-white/82">{t(project.task)}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 border-t border-white/12">
          <div className="lg:col-span-5 space-y-3">
            <h2 className="type-heading font-display font-bold text-[#FF4393]">
              {t(translations.caseStudy.sections.problem).replace(/^\d+\.\s*/, '')}
            </h2>
            <p className="type-body text-white/80 max-w-[60ch]">{t(project.problem)}</p>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <h2 className="type-heading font-display font-bold text-[#E7FA53]">
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
                <p className="type-sm tabular-nums font-semibold text-[#E7FA53]">
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
                  <span className="tabular-nums font-semibold text-[#E7FA53] shrink-0">
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
        accentColor="#FF4393"
      />
    </div>
  );
}
