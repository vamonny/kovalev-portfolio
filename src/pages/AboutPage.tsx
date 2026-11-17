import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useSound } from '../context/SoundContext';
import { translations } from '../i18n/translations';
import { RubberBlock } from '../components/RubberMotion';
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

  return (
    <div className="bg-[#EFEFE9] dark:bg-[#0C0C0F] text-[#0B0B0B] dark:text-[#EFEFE9] min-h-screen pb-20 transition-colors duration-200 overflow-x-hidden">
      <section className="max-w-[1380px] mx-auto px-4 sm:px-8 pt-20 sm:pt-24 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Direct Heading + Uniform Body Prose + Hairline Spec Ledger */}
          <RubberBlock immediate skewFactor={0.6} driftFactor={5} className="lg:col-span-7">
            <h1 className="font-display font-extrabold tracking-[-0.04em] leading-[0.95] text-[clamp(2.25rem,4.5vw,4rem)] mb-6 text-balance-safe">
              {t(translations.about.title)}
            </h1>

            <p className="type-body text-[#0B0B0B]/85 dark:text-[#EFEFE9]/85 max-w-[60ch] mb-10">
              {t(translations.about.intro)}
            </p>

            {/* Hairline Specification Ledger */}
            <div className="border-t border-[#0B0B0B]/14 dark:border-white/14 divide-y divide-[#0B0B0B]/12 dark:divide-white/12 mb-10">
              {translations.about.facts.map((fact) => (
                <div
                  key={fact.label.en}
                  className="py-3.5 grid grid-cols-12 gap-4 items-baseline"
                >
                  <span className="col-span-4 type-sm text-[#0B0B0B]/60 dark:text-[#EFEFE9]/60">
                    {t(fact.label)}
                  </span>
                  <span className="col-span-8 type-body font-medium text-[#0B0B0B] dark:text-[#EFEFE9] text-right sm:text-left">
                    {t(fact.value)}
                  </span>
                </div>
              ))}
            </div>

            {/* Instrument List */}
            <div className="mb-12">
              <h2 className="type-heading font-display font-bold mb-3">
                {t(translations.about.stackTitle)}
              </h2>
              <p className="type-body text-[#0B0B0B]/82 dark:text-[#EFEFE9]/82">
                {[
                  'Figma',
                  'HTML / CSS',
                  'Illustrator',
                  'Photoshop',
                  'After Effects',
                  'Blender',
                ].join(' · ')}
              </p>
            </div>

            {/* Three Pillars Accordion */}
            <div className="pt-8 border-t border-[#0B0B0B]/14 dark:border-white/14">
              <h2 className="type-heading font-display font-bold mb-4">
                {t(translations.about.manifestoTitle)}
              </h2>

              <div className="divide-y divide-[#0B0B0B]/12 dark:divide-white/12 border-b border-[#0B0B0B]/12 dark:border-white/12">
                {translations.about.pillars.map((pillar, idx) => {
                  const isOpen = activePillar === idx;
                  return (
                    <div key={pillar.index}>
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
                        <span
                          className={`type-heading font-display font-bold transition-colors duration-150 ${
                            isOpen
                              ? 'text-[#D61914] dark:text-[#E7FA53]'
                              : 'text-[#0B0B0B] dark:text-[#EFEFE9] group-hover:text-[#D61914] dark:group-hover:text-[#E7FA53]'
                          }`}
                        >
                          {t(pillar.title)}
                        </span>
                        <span className="type-sm tabular-nums opacity-60 shrink-0">
                          {isOpen ? '−' : '+'}
                        </span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                          >
                            <p className="pb-5 type-body text-[#0B0B0B]/80 dark:text-[#EFEFE9]/80 max-w-[58ch]">
                              {t(pillar.body)}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </RubberBlock>

          {/* Right Column: Portrait & Interactive Optical Seal */}
          <RubberBlock immediate skewFactor={-0.6} driftFactor={-5} delay={0.05} className="lg:col-span-5 space-y-8">
            <div>
              <ResilientImage
                src="/assets/aistudio/image_8fdbeb1c.webp"
                alt={
                  lang === 'ru'
                    ? 'Кирилл Ковалёв на выставке генеративного и медиаискусства'
                    : 'Kirill Kovalev at a generative media-art exhibition'
                }
                fallbackTitle="KIRILL KOVALEV"
                className="w-full aspect-square border border-[#0B0B0B]/12 dark:border-white/12"
                imgClassName="w-full h-full object-cover grayscale contrast-[1.12]"
              />
              <p className="mt-2.5 type-sm tabular-nums text-[#0B0B0B]/60 dark:text-[#EFEFE9]/60 flex items-center justify-between">
                <span>
                  {lang === 'ru' ? 'Нижний Новгород, медиаискусство' : 'Nizhny Novgorod, media art'}
                </span>
                <span>2020–2026</span>
              </p>
            </div>

            {/* Interactive Liquid Glass Monogram Specimen (Single surface, Connected segmented toggle) */}
            <div className="border-t border-[#0B0B0B]/12 dark:border-white/12 pt-6 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="type-sm font-semibold text-[#0B0B0B] dark:text-[#EFEFE9]">
                  {lang === 'ru' ? 'Оптический знак K' : 'Optical Monogram K'}
                </h2>
                <div className="inline-flex items-center p-1 bg-[#E5E4DC] dark:bg-[#16161B] rounded-[6px] type-sm">
                  <button
                    type="button"
                    onClick={() => {
                      playMorph();
                      setSealLook('light');
                    }}
                    className={`px-3 py-1 rounded-[5px] transition-colors duration-150 ${
                      sealLook === 'light'
                        ? 'bg-[#0B0B0B] dark:bg-[#EFEFE9] text-[#EFEFE9] dark:text-[#0B0B0B] font-semibold'
                        : 'text-[#0B0B0B]/65 dark:text-[#EFEFE9]/65 hover:text-[#0B0B0B] dark:hover:text-[#EFEFE9]'
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
                    className={`px-3 py-1 rounded-[5px] transition-colors duration-150 ${
                      sealLook === 'dark'
                        ? 'bg-[#0B0B0B] dark:bg-[#E7FA53] text-[#E7FA53] dark:text-[#0B0B0B] font-semibold'
                        : 'text-[#0B0B0B]/65 dark:text-[#EFEFE9]/65 hover:text-[#0B0B0B] dark:hover:text-[#EFEFE9]'
                    }`}
                  >
                    {lang === 'ru' ? 'Тьма' : 'Dark'}
                  </button>
                </div>
              </div>

              <div className="w-full h-60 rounded-[12px] overflow-hidden border border-[#0B0B0B]/12 dark:border-white/12">
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

              <p className="type-sm text-[#0B0B0B]/60 dark:text-[#EFEFE9]/60">
                {lang === 'ru'
                  ? 'Нажмите на стекло, чтобы повторить анимацию'
                  : 'Click the glass tile to replay reveal'}
              </p>
            </div>
          </RubberBlock>
        </div>
      </section>
    </div>
  );
}
