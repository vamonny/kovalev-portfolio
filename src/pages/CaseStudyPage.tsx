import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProjects } from '../context/ProjectsContext';
import { useLanguage } from '../context/LanguageContext';
import { useCurtainNavigation } from '../context/NavigationContext';
import { useRubberScroll } from '../hooks/useRubberScroll';
import { BilingualText, translations } from '../i18n/translations';
import { ProjectCase } from '../data/projects';
import {
  CaseLightbox,
  CaseViewProps,
  cleanProjectTitle,
  LightboxItem,
} from '../components/case-studies/CaseSharedChrome';
import { CaseSemyaView } from '../components/case-studies/CaseSemyaView';
import { CaseMarketplaceView } from '../components/case-studies/CaseMarketplaceView';
import { CaseEncyclopediaView } from '../components/case-studies/CaseEncyclopediaView';
import { CaseLogofolioView } from '../components/case-studies/CaseLogofolioView';
import { CasePafosView } from '../components/case-studies/CasePafosView';
import { CaseOpenspaceView } from '../components/case-studies/CaseOpenspaceView';
import { CaseStudyPageLegacyBackup } from './CaseStudyPageLegacyBackup';

function buildProjectGallery(
  project: ProjectCase,
  t: (text: BilingualText) => string,
  lang: 'ru' | 'en'
): LightboxItem[] {
  const seen = new Set<string>();
  const items: LightboxItem[] = [];
  const cleanTitle = cleanProjectTitle(t(project.title));

  const push = (src: string | undefined, caption: string) => {
    if (!src || seen.has(src)) return;
    seen.add(src);
    items.push({ src, caption });
  };

  push(project.heroImage, `${project.slotCode} · ${cleanTitle}`);
  push(
    project.coverImage,
    `${project.slotCode} · ${lang === 'ru' ? 'Знак и обложка' : 'Cover / Mark'}`
  );

  project.secondaryImages.forEach((src, i) => {
    push(src, `${project.slotCode} · 0${i + 1}`);
  });

  if (project.beforeAfter) {
    project.beforeAfter.pairs.forEach((pair) => {
      push(pair.afterSrc, `${t(pair.label)} · ${lang === 'ru' ? 'После' : 'After'}`);
      push(pair.beforeSrc, `${t(pair.label)} · ${lang === 'ru' ? 'До' : 'Before'}`);
    });
    project.beforeAfter.extraPlates?.forEach((plate) => {
      push(plate.src, `${plate.tag} · ${t(plate.caption)}`);
    });
  }

  if (project.marketplaceSeries) {
    project.marketplaceSeries.forEach((sku) => {
      if (sku.spreadImage) {
        push(
          sku.spreadImage.src,
          `${sku.code} · ${t(sku.name)} (${t(sku.spreadImage.caption)})`
        );
      }
      sku.slides.forEach((slide) => {
        push(slide.src, `${sku.code} · ${t(sku.name)} · ${t(slide.label)}`);
      });
    });
  }

  if (project.encyclopediaData) {
    project.encyclopediaData.spreads.forEach((spread) => {
      push(spread.src, `${spread.chapter}. ${t(spread.title)} (${spread.pages})`);
    });
  }

  if (project.logofolioData) {
    push(
      project.logofolioData.coverPlateSrc,
      lang === 'ru' ? 'Logofolio · Титульный лист (2024–2026)' : 'Logofolio · Cover specimen (2024–2026)'
    );
    project.logofolioData.plates.forEach((plate) => {
      push(plate.src, `${plate.code} · ${plate.brand} · ${t(plate.niche)} (${plate.year})`);
    });
  }

  if (project.brandbookData) {
    project.brandbookData.slides.forEach((slide) => {
      push(slide.src, `${slide.page} · ${t(slide.title)}`);
    });
  }

  if (project.identityPlates) {
    project.identityPlates.forEach((plate) => {
      push(plate.src, `${plate.code} · ${t(plate.title)}`);
    });
  }

  return items;
}

export function CaseStudyPage() {
  const { slug } = useParams<{ slug: string }>();
  const { lang, t } = useLanguage();
  const { projects, getProjectBySlug } = useProjects();
  const { navigateWithCurtain } = useCurtainNavigation();
  const scrollVel = useRubberScroll(0.055);

  const [lightboxState, setLightboxState] = useState<{
    items: LightboxItem[];
    index: number;
  } | null>(null);

  useEffect(() => {
    setLightboxState(null);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [slug]);

  const project = slug ? getProjectBySlug(slug) : undefined;

  const baseGallery = useMemo(() => {
    if (!project) return [];
    return buildProjectGallery(project, t, lang);
  }, [project, t, lang]);

  const handleInspectImage = useCallback(
    (payload: LightboxItem) => {
      const existingIdx = baseGallery.findIndex((item) => item.src === payload.src);
      if (existingIdx >= 0) {
        const items = baseGallery.map((item, idx) =>
          idx === existingIdx && payload.caption ? { ...item, caption: payload.caption } : item
        );
        setLightboxState({ items, index: existingIdx });
      } else {
        setLightboxState({
          items: [payload, ...baseGallery],
          index: 0,
        });
      }
    },
    [baseGallery]
  );

  const handleBackToWorks = useCallback(() => {
    navigateWithCurtain('/works', {
      italicLine: lang === 'ru' ? 'АРХИВ' : 'SELECTED',
      regularLine: lang === 'ru' ? 'РАБОТЫ' : 'WORKS',
    });
  }, [navigateWithCurtain, lang]);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#EFEFE9] dark:bg-[#0C0C0F] text-[#0B0B0B] dark:text-[#EFEFE9] flex flex-col items-center justify-center px-6 text-center pb-16 transition-colors duration-300">
        <h1 className="type-heading font-display font-bold mb-6">
          {t(translations.caseStudy.notFound)}
        </h1>
        <button
          type="button"
          onClick={handleBackToWorks}
          className="px-6 py-3 rounded-[6px] bg-[#0B0B0B] dark:bg-[#E7FA53] text-[#EFEFE9] dark:text-[#0B0B0B] type-sm font-semibold transition-colors duration-150"
        >
          {t(translations.caseStudy.backToWorks)}
        </button>
      </div>
    );
  }

  const currentIdx = projects.findIndex((p) => p.id === project.id);
  const nextProject = projects[(currentIdx + 1) % projects.length];
  const cleanTitle = cleanProjectTitle(t(project.title));

  const openNext = () => {
    if (!nextProject) return;
    const nextTitle = cleanProjectTitle(t(nextProject.title));
    const words = nextTitle.split(' ');
    const split = Math.ceil(words.length / 2);
    navigateWithCurtain(`/works/${nextProject.slug}`, {
      italicLine: words.slice(0, split).join(' '),
      regularLine: words.slice(split).join(' ') || nextProject.slotCode,
      thumbnail: nextProject.heroImage || nextProject.coverImage,
    });
  };

  const viewProps: CaseViewProps = {
    project,
    nextProject,
    caseIndex: currentIdx + 1,
    totalCases: projects.length,
    onInspectImage: handleInspectImage,
    onOpenNext: openNext,
    onBackToWorks: handleBackToWorks,
    scrollVel,
  };

  const renderCaseView = () => {
    switch (project.id) {
      case 'slot-01':
        return <CaseSemyaView {...viewProps} />;
      case 'slot-02':
        return <CaseMarketplaceView {...viewProps} />;
      case 'slot-03':
        return <CaseEncyclopediaView {...viewProps} />;
      case 'slot-04':
        return <CaseLogofolioView {...viewProps} />;
      case 'slot-05':
        return <CasePafosView {...viewProps} />;
      case 'slot-06':
        return <CaseOpenspaceView {...viewProps} />;
      default:
        return <CaseStudyPageLegacyBackup />;
    }
  };

  return (
    <>
      {renderCaseView()}

      <CaseLightbox
        items={lightboxState?.items ?? []}
        activeIndex={lightboxState?.index ?? null}
        onChangeIndex={(nextIdx) =>
          setLightboxState((prev) => (prev ? { ...prev, index: nextIdx } : prev))
        }
        onClose={() => setLightboxState(null)}
        coverBg={project.coverBg}
      />
    </>
  );
}
