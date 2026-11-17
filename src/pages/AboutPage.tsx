import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useSound } from '../context/SoundContext';
import { translations } from '../i18n/translations';
import { ScrambleText } from '../components/ScrambleText';
import { RubberText } from '../components/RubberText';
import { RubberBlock, RubberWords } from '../components/RubberMotion';
import { ResilientImage } from '../components/ResilientImage';
import { GlassIconReveal, KOVALEV_K_SVG } from '../components/GlassIconReveal';

export function AboutPage() {
  const { isDark } = useTheme();
  const { lang, t } = useLanguage();
  const { playHover, playMorph, playIntroReveal } = useSound();
  const [activePillar, setActivePillar] = useState(0);
  const [sealLook, setSealLook] = useState<'light' | 'dark'>(isDark ? 'dark' : 'light');

  useEffect(() => {
    setSealLook(isDark ? 'dark' : 'light');
  }, [isDark]);

  const romanNumerals = ['I.', 'II.', 'III.'];

  return (
    <div className="bg-[#EFEFE9] dark:bg-[#0C0C0F] text-[#0B0B0B] dark:text-[#EFEFE9] min-h-screen pb-24 transition-colors duration-300 overflow-x-hidden">
      <section className="max-w-[1440px] mx-auto px-4 sm:px-7 pt-20 sm:pt-24 pb-12">
        <div className="pb-4 border-b border-[#0B0B0B]/15 dark:border-white/15 flex items-center justify-between pr-14">
          <span className="font-mono-tabular text-[11px] uppercase tracking-[0.2em] text-[#D61914] dark:text-[#E7FA53]">
            <ScrambleText
              text={lang === 'ru' ? 'ПОДХОД И ФИЛОСОФИЯ' : 'PRACTICE & PHILOSOPHY'}
              triggerKey={`about-eyebrow-${lang}`}
              duration={360}
            />
          </span>
          <span className="font-serif-editorial italic text-[13px] text-[#0B0B0B]/65 dark:text-[#EFEFE9]/65">
            Kirill Kovalev · NN
          </span>
        </div>

        <div className="pt-8 sm:pt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Editorial Typographic Profile & Manifesto */}
          <RubberBlock immediate skewFactor={0.95} driftFactor={9} className="lg:col-span-7">
            <h1 className="font-display font-extrabold uppercase tracking-[-0.042em] leading-[0.95] text-[clamp(2rem,4.3vw,3.9rem)] mb-8 text-balance-safe">
              {lang === 'ru' ? (
                <>
                  <RubberText text="Графика, интерфейсы" stretchStrength={0.95} />{' '}
                  <span className="font-serif-editorial italic font-semibold lowercase tracking-[-0.02em] text-[#D61914] dark:text-[#E7FA53]">
                    <RubberText text="и ясная форма" stretchStrength={0.95} />
                  </span>
                </>
              ) : (
                <>
                  <RubberText text="Graphics, Interfaces" stretchStrength={0.95} />{' '}
                  <span className="font-serif-editorial italic font-semibold lowercase tracking-[-0.02em] text-[#D61914] dark:text-[#E7FA53]">
                    <RubberText text="& clear form" stretchStrength={0.95} />
                  </span>
                </>
              )}
            </h1>

            <RubberWords
              text={t(translations.about.intro)}
              elasticity={0.95}
              className="font-sans-body text-lg sm:text-[21px] leading-[1.34] tracking-[-0.02em] text-[#0B0B0B]/90 dark:text-[#EFEFE9]/90 max-w-[44ch] mb-10"
            />

            {/* Editorial Hairline Specification Ledger (replaces boxy grid cards) */}
            <div className="border-t border-[#0B0B0B]/15 dark:border-white/15 divide-y divide-[#0B0B0B]/12 dark:divide-white/12 mb-10">
              {translations.about.facts.map((fact, idx) => (
                <div
                  key={fact.label.en}
                  className="py-3.5 grid grid-cols-12 gap-3 items-baseline transition-transform duration-300 hover:translate-x-1"
                >
                  <span className="col-span-4 sm:col-span-4 font-serif-editorial italic text-xs sm:text-sm text-[#D61914] dark:text-[#E7FA53]">
                    {String(idx + 1).padStart(2, '0')} · {t(fact.label)}
                  </span>
                  <span className="col-span-8 sm:col-span-8 font-sans-body text-sm sm:text-[15px] font-medium text-[#0B0B0B] dark:text-[#EFEFE9] leading-snug text-right sm:text-left">
                    {t(fact.value)}
                  </span>
                </div>
              ))}
            </div>

            {/* Typographic Instrument Line (clean editorial list instead of SaaS tag pills) */}
            <div className="mb-12 pt-2">
              <p className="font-mono-tabular text-[10px] uppercase tracking-[0.2em] text-[#0B0B0B]/55 dark:text-[#EFEFE9]/55 mb-3">
                {t(translations.about.stackTitle)}
              </p>
              <p className="font-display text-base sm:text-xl font-bold uppercase tracking-[-0.02em] leading-[1.45] text-[#0B0B0B] dark:text-[#EFEFE9] flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                {[
                  { name: 'Figma', primary: true },
                  { name: 'HTML / CSS', primary: true },
                  { name: 'Illustrator', primary: false },
                  { name: 'Photoshop', primary: false },
                  { name: 'After Effects', primary: false },
                  { name: 'Blender', primary: false },
                ].map((tool, idx, arr) => (
                  <span key={tool.name} className="inline-flex items-baseline gap-2.5 whitespace-nowrap">
                    <span
                      className={
                        tool.primary
                          ? 'text-[#D61914] dark:text-[#E7FA53] underline underline-offset-4 decoration-1'
                          : 'text-[#0B0B0B]/80 dark:text-[#EFEFE9]/80'
                      }
                    >
                      {tool.name}
                    </span>
                    {idx < arr.length - 1 && (
                      <span aria-hidden="true" className="font-serif-editorial italic font-normal opacity-30">
                        /
                      </span>
                    )}
                  </span>
                ))}
              </p>
            </div>

            {/* Editorial Chapters Accordion (I. II. III.) */}
            <div className="pt-6 border-t border-[#0B0B0B]/15 dark:border-white/15">
              <p className="font-mono-tabular text-[11px] uppercase tracking-[0.2em] text-[#D61914] dark:text-[#E7FA53] mb-5">
                {t(translations.about.manifestoTitle)}
              </p>

              <div className="divide-y divide-[#0B0B0B]/15 dark:divide-white/15 border-b border-[#0B0B0B]/15 dark:border-white/15">
                {translations.about.pillars.map((pillar, idx) => {
                  const isOpen = activePillar === idx;
                  return (
                    <div key={pillar.index} className="py-1">
                      <button
                        type="button"
                        onClick={() => {
                          playMorph();
                          setActivePillar(idx);
                        }}
                        onMouseEnter={() => playHover()}
                        aria-expanded={isOpen}
                        className="w-full py-4 flex items-baseline justify-between gap-4 text-left group"
                      >
                        <div className="flex items-baseline gap-4 sm:gap-5">
                          <span
                            className={`font-serif-editorial italic text-xl sm:text-2xl transition-colors ${
                              isOpen
                                ? 'text-[#D61914] dark:text-[#E7FA53]'
                                : 'text-[#0B0B0B]/45 dark:text-[#EFEFE9]/45 group-hover:text-[#0B0B0B] dark:group-hover:text-[#EFEFE9]'
                            }`}
                          >
                            {romanNumerals[idx] || pillar.index}
                          </span>
                          <span
                            className={`font-display text-lg sm:text-2xl font-bold uppercase tracking-[-0.025em] transition-transform duration-300 group-hover:translate-x-1 ${
                              isOpen
                                ? 'text-[#0B0B0B] dark:text-[#E7FA53]'
                                : 'text-[#0B0B0B]/85 dark:text-[#EFEFE9]/85'
                            }`}
                          >
                            {t(pillar.title)}
                          </span>
                        </div>
                        <span className="font-mono-tabular text-sm opacity-60 shrink-0">
                          {isOpen ? '—' : '+'}
                        </span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="pb-5 pl-9 sm:pl-12 pr-4 font-sans-body text-sm sm:text-[16px] text-[#0B0B0B]/78 dark:text-[#EFEFE9]/78 leading-[1.52] max-w-[52ch]">
                              {t(pillar.body)}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </RubberBlock>

          {/* Right Column: Portrait & Interactive Optical Seal (counter-skew rubber flex) */}
          <RubberBlock immediate skewFactor={-0.95} driftFactor={-9} delay={0.08} className="lg:col-span-5 space-y-6">
            <div>
              <ResilientImage
                src="/assets/aistudio/image_8fdbeb1c.webp"
                alt={
                  lang === 'ru'
                    ? 'Кирилл Ковалёв на выставке генеративного и медиаискусства'
                    : 'Kirill Kovalev at a generative media-art exhibition'
                }
                fallbackTitle="KIRILL KOVALEV"
                className="w-full aspect-square border border-[#0B0B0B]/14 dark:border-white/15"
                imgClassName="w-full h-full object-cover grayscale contrast-[1.14] brightness-[0.98]"
              />
              <p className="mt-2 font-serif-editorial italic text-xs text-[#0B0B0B]/60 dark:text-[#EFEFE9]/60 flex items-center justify-between">
                <span>
                  {lang === 'ru' ? 'Нижний Новгород, медиаискусство' : 'Nizhny Novgorod, media art'}
                </span>
                <span className="font-mono-tabular not-italic text-[10px]">2020 — 2026</span>
              </p>
            </div>

            {/* Interactive Liquid Glass Monogram Specimen */}
            <div
              className={`rounded-[20px] p-4 sm:p-5 ${
                isDark ? 'liquid-glass-dark' : 'liquid-glass-light'
              }`}
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <span className="font-mono-tabular text-[10px] uppercase tracking-[0.18em] text-[#0B0B0B]/70 dark:text-[#EFEFE9]/75">
                  {lang === 'ru' ? 'ОПТИЧЕСКАЯ ПЕЧАТЬ · K' : 'OPTICAL SEAL · K'}
                </span>
                <div className="flex items-center gap-1 font-mono-tabular text-[10px] uppercase">
                  <button
                    type="button"
                    onClick={() => {
                      playMorph();
                      setSealLook('light');
                    }}
                    className={`px-2 py-0.5 rounded-[8px] transition-colors ${
                      sealLook === 'light'
                        ? 'bg-[#0B0B0B] dark:bg-[#EFEFE9] text-[#EFEFE9] dark:text-[#0B0B0B]'
                        : 'text-[#0B0B0B]/60 dark:text-[#EFEFE9]/60 hover:text-[#0B0B0B] dark:hover:text-[#EFEFE9]'
                    }`}
                  >
                    {lang === 'ru' ? 'Свет' : 'Light'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playMorph();
                      setSealLook('dark');
                    }}
                    className={`px-2 py-0.5 rounded-[8px] transition-colors ${
                      sealLook === 'dark'
                        ? 'bg-[#0B0B0B] dark:bg-[#E7FA53] text-[#E7FA53] dark:text-[#0B0B0B]'
                        : 'text-[#0B0B0B]/60 dark:text-[#EFEFE9]/60 hover:text-[#0B0B0B] dark:hover:text-[#EFEFE9]'
                    }`}
                  >
                    {lang === 'ru' ? 'Тьма' : 'Dark'}
                  </button>
                </div>
              </div>

              <div className="w-full h-56 sm:h-64 rounded-[14px] overflow-hidden border border-[#0B0B0B]/10 dark:border-white/10">
                <GlassIconReveal
                  logo={KOVALEV_K_SVG}
                  label="Kirill Kovalev Liquid Glass Monogram"
                  look={sealLook}
                  background={sealLook === 'light' ? '#EFEFE9' : '#0B0B0B'}
                  logoColor={sealLook === 'light' ? '#0B0B0B' : '#E7FA53'}
                  plateColor="#151518"
                  iconPlate={sealLook === 'dark'}
                  tileSize={190}
                  logoScale={0.68}
                  finalScale={0.78}
                  loop
                  hold={2.2}
                  speed={1.15}
                  onClick={() => {
                    if (!playIntroReveal()) playMorph();
                  }}
                  className="w-full h-full"
                />
              </div>

              <p className="mt-2.5 font-mono-tabular text-[10px] uppercase tracking-[0.14em] text-[#0B0B0B]/55 dark:text-[#EFEFE9]/55 flex items-center justify-between">
                <span>Liquid Glass Shader</span>
                <span>{lang === 'ru' ? 'Клик — повтор' : 'Click to replay'}</span>
              </p>
            </div>
          </RubberBlock>
        </div>
      </section>
    </div>
  );
}
