import { useEffect, useState } from 'react';
import { ArrowLeft, Check, ChevronLeft, ChevronRight, Share2, X } from 'lucide-react';
import { ProjectCase } from '../../data/projects';
import { useLanguage } from '../../context/LanguageContext';
import { useSound } from '../../context/SoundContext';
import { translations } from '../../i18n/translations';
import { RubberBlock } from '../RubberMotion';
import { ResilientImage } from '../ResilientImage';

export interface LightboxItem {
  src: string;
  caption: string;
}

export interface CaseViewProps {
  project: ProjectCase;
  nextProject?: ProjectCase;
  caseIndex: number;
  totalCases: number;
  onInspectImage: (payload: LightboxItem) => void;
  onOpenNext: () => void;
  onBackToWorks: () => void;
  scrollVel: number;
}

export function cleanProjectTitle(title: string) {
  return title.replace(/^Слот \d+\s*[—–-]\s*|^Slot \d+\s*[—–-]\s*/i, '');
}

interface CaseTopUtilityBarProps {
  slotCode: string;
  year: string;
  caseIndex: number;
  totalCases: number;
  onBackToWorks: () => void;
  tone?: 'auto' | 'dark' | 'light';
}

export function CaseTopUtilityBar({
  slotCode,
  year,
  caseIndex,
  totalCases,
  onBackToWorks,
  tone = 'auto',
}: CaseTopUtilityBarProps) {
  const { lang } = useLanguage();
  const { playClick, playHover } = useSound();
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    playClick();
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (url && navigator.clipboard) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const borderCls =
    tone === 'dark'
      ? 'border-white/12 text-[#EFEFE9]'
      : tone === 'light'
      ? 'border-[#0B0B0B]/12 text-[#0B0B0B]'
      : 'border-[#0B0B0B]/12 dark:border-white/12 text-[#0B0B0B] dark:text-[#EFEFE9]';

  const mutedCls =
    tone === 'dark'
      ? 'text-white/70 hover:text-white'
      : tone === 'light'
      ? 'text-[#0B0B0B]/70 hover:text-[#0B0B0B]'
      : 'text-[#0B0B0B]/70 dark:text-[#EFEFE9]/70 hover:text-[#0B0B0B] dark:hover:text-[#EFEFE9]';

  return (
    <div className="max-w-[1380px] mx-auto px-4 sm:px-8 pt-16 sm:pt-20">
      <div className={`flex flex-wrap items-center justify-between gap-4 py-3 border-b ${borderCls}`}>
        <button
          type="button"
          onClick={() => {
            playClick();
            onBackToWorks();
          }}
          onMouseEnter={() => playHover()}
          className={`inline-flex items-center gap-2 type-sm font-medium transition-colors duration-150 ${mutedCls}`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'ru' ? 'Все работы' : 'All works'}</span>
        </button>

        <span className="hidden sm:inline type-sm tabular-nums opacity-70">
          {caseIndex} / {totalCases} · {slotCode} · {year.split('·')[0].trim()}
        </span>

        <button
          type="button"
          onClick={handleShare}
          onMouseEnter={() => playHover()}
          className={`inline-flex items-center gap-1.5 type-sm font-medium transition-colors duration-150 ${mutedCls}`}
        >
          {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          <span>
            {copied
              ? lang === 'ru'
                ? 'Скопировано'
                : 'Copied'
              : lang === 'ru'
              ? 'Поделиться'
              : 'Share'}
          </span>
        </button>
      </div>
    </div>
  );
}

interface CaseNextProjectBarProps {
  nextProject?: ProjectCase;
  currentProjectId: string;
  onOpenNext: () => void;
  tone?: 'auto' | 'dark' | 'light';
  accentColor?: string;
}

export function CaseNextProjectBar({
  nextProject,
  currentProjectId,
  onOpenNext,
  tone = 'auto',
  accentColor,
}: CaseNextProjectBarProps) {
  const { lang, t } = useLanguage();
  const { playHover } = useSound();

  if (!nextProject || nextProject.id === currentProjectId) return null;

  const borderCls =
    tone === 'dark'
      ? 'border-white/12 text-[#EFEFE9]'
      : tone === 'light'
      ? 'border-[#0B0B0B]/12 text-[#0B0B0B]'
      : 'border-[#0B0B0B]/12 dark:border-white/12 text-[#0B0B0B] dark:text-[#EFEFE9]';

  const subCls =
    tone === 'dark'
      ? 'text-white/65'
      : tone === 'light'
      ? 'text-[#0B0B0B]/65'
      : 'text-[#0B0B0B]/65 dark:text-[#EFEFE9]/65';

  const cardBorder =
    tone === 'dark'
      ? 'border-white/14'
      : tone === 'light'
      ? 'border-[#0B0B0B]/14'
      : 'border-[#0B0B0B]/14 dark:border-white/14';

  return (
    <RubberBlock
      skewFactor={0.5}
      driftFactor={4}
      className={`max-w-[1380px] mx-auto px-4 sm:px-8 pt-12 pb-10 border-t ${borderCls}`}
    >
      <button
        type="button"
        onClick={onOpenNext}
        onMouseEnter={() => playHover()}
        className="group w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-center text-left py-2"
      >
        <div className="md:col-span-3 space-y-1">
          <p className={`type-sm font-medium ${subCls}`}>
            {t(translations.caseStudy.nextProject)}
          </p>
          <p className={`type-sm tabular-nums ${subCls}`}>
            {nextProject.slotCode}
          </p>
        </div>

        <div className="md:col-span-5">
          <div className="relative pt-2 pr-2">
            <div
              className={`overflow-hidden border ${cardBorder} transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]`}
            >
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
                className={`w-full aspect-[16/9] ${
                  nextProject.coverFit === 'contain' ? 'bg-white' : 'bg-[#0B0B0B]'
                }`}
                imgClassName={
                  nextProject.coverFit === 'contain'
                    ? 'w-full h-full object-contain p-4 sm:p-6'
                    : 'w-full h-full object-cover'
                }
              />
            </div>
            <div
              style={{ backgroundColor: accentColor || nextProject.theme.accent || '#F5ED86' }}
              className="absolute top-0 right-0 w-16 h-5 border border-[#0B0B0B]/15"
              aria-hidden="true"
            />
          </div>
        </div>

        <div className="md:col-span-4 space-y-1.5">
          <p className="type-heading font-display font-bold group-hover:opacity-75 transition-opacity duration-150">
            {cleanProjectTitle(t(nextProject.title))}
          </p>
          <p className={`type-sm ${subCls}`}>{t(nextProject.categoryLabel)}</p>
        </div>
      </button>
    </RubberBlock>
  );
}

interface CaseLightboxProps {
  items: LightboxItem[];
  activeIndex: number | null;
  onChangeIndex: (nextIdx: number) => void;
  onClose: () => void;
  coverBg?: string;
}

export function CaseLightbox({
  items,
  activeIndex,
  onChangeIndex,
  onClose,
  coverBg,
}: CaseLightboxProps) {
  const { lang, t } = useLanguage();
  const { playClick, playHover } = useSound();

  const isOpen = activeIndex !== null && items.length > 0;
  const safeIdx =
    activeIndex !== null && items.length > 0
      ? ((activeIndex % items.length) + items.length) % items.length
      : 0;
  const activeItem = isOpen ? items[safeIdx] : null;
  const hasMultiple = items.length > 1;

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && hasMultiple) {
        playClick();
        onChangeIndex((safeIdx + 1) % items.length);
      } else if (e.key === 'ArrowLeft' && hasMultiple) {
        playClick();
        onChangeIndex((safeIdx - 1 + items.length) % items.length);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, hasMultiple, safeIdx, items.length, onChangeIndex, onClose, playClick]);

  if (!activeItem) return null;

  const step = (delta: number) => {
    playClick();
    onChangeIndex((safeIdx + delta + items.length) % items.length);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={activeItem.caption}
      onClick={onClose}
      className="fixed inset-0 z-[95] bg-[#09090C]/94 backdrop-blur-md p-4 sm:p-8 flex flex-col justify-between"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex items-center justify-between gap-4 text-[#EFEFE9] type-sm"
      >
        <div className="flex items-center gap-3 min-w-0">
          {hasMultiple && (
            <span className="tabular-nums font-semibold text-[#E7FA53] shrink-0">
              {safeIdx + 1} / {items.length}
            </span>
          )}
          <span className="truncate text-white/90">{activeItem.caption}</span>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label={t(translations.nav.close)}
          className="w-10 h-10 bg-[#EFEFE9] text-[#0B0B0B] hover:bg-[#E7FA53] flex items-center justify-center rounded-[6px] transition-colors duration-150 shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative my-auto max-w-6xl w-full mx-auto flex items-center justify-center gap-2 sm:gap-4"
      >
        {hasMultiple && (
          <button
            type="button"
            onClick={() => step(-1)}
            onMouseEnter={() => playHover()}
            aria-label={lang === 'ru' ? 'Предыдущее изображение' : 'Previous image'}
            className="hidden sm:flex w-11 h-11 bg-white/10 hover:bg-[#E7FA53] text-white hover:text-[#0B0B0B] border border-white/20 rounded-[6px] items-center justify-center transition-colors duration-150 shrink-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        <div className="w-full max-h-[76vh] overflow-hidden border border-white/18">
          <img
            src={activeItem.src}
            alt={activeItem.caption}
            decoding="async"
            className={`w-full h-full max-h-[76vh] object-contain ${
              coverBg === '#FFFFFF' ? 'bg-[#121216]' : 'bg-[#0B0B0B]'
            }`}
          />
        </div>

        {hasMultiple && (
          <button
            type="button"
            onClick={() => step(1)}
            onMouseEnter={() => playHover()}
            aria-label={lang === 'ru' ? 'Следующее изображение' : 'Next image'}
            className="hidden sm:flex w-11 h-11 bg-white/10 hover:bg-[#E7FA53] text-white hover:text-[#0B0B0B] border border-white/20 rounded-[6px] items-center justify-center transition-colors duration-150 shrink-0"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      <div
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col sm:flex-row items-center justify-center gap-3 text-center type-sm text-[#EFEFE9]/65"
      >
        {hasMultiple && (
          <div className="flex sm:hidden items-center gap-3">
            <button
              type="button"
              onClick={() => step(-1)}
              className="px-3 py-1.5 border border-white/25 rounded-[5px] text-white inline-flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              {lang === 'ru' ? 'Назад' : 'Prev'}
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              className="px-3 py-1.5 border border-white/25 rounded-[5px] text-white inline-flex items-center gap-1"
            >
              {lang === 'ru' ? 'Вперёд' : 'Next'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
        <span>
          {hasMultiple
            ? lang === 'ru'
              ? 'Используйте стрелки ← и → для перелистывания или Esc для выхода'
              : 'Use arrow keys ← and → to navigate or Esc to close'
            : lang === 'ru'
            ? 'Нажмите Esc или на фон, чтобы закрыть'
            : 'Press Esc or click backdrop to close'}
        </span>
      </div>
    </div>
  );
}
