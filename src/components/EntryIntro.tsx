import { useEffect, useState, useCallback, useRef } from 'react';
import { ParticleArrowSwitch } from './ParticleArrowSwitch';
import { GlassIconReveal, KOVALEV_K_SVG, preloadGlassLogo } from './GlassIconReveal';
import { useLanguage } from '../context/LanguageContext';
import { useSound } from '../context/SoundContext';
import { soundEngine } from '../audio/soundEngine';

type Stage = 'gate' | 'reveal' | 'done';

const INTRO_STORAGE_KEY = 'kk_intro_seen';

export function EntryIntro() {
  const { lang } = useLanguage();
  const { soundEnabled, setSoundEnabled, playIntroReveal, playIntroResolve, playHover } =
    useSound();

  const [reducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  const [stage, setStage] = useState<Stage>(() => {
    if (reducedMotion) return 'done';
    if (typeof window !== 'undefined') {
      try {
        if (window.sessionStorage.getItem(INTRO_STORAGE_KEY) === '1') {
          return 'done';
        }
      } catch {
        // ignore storage restrictions
      }
    }
    return 'gate';
  });

  const [activated, setActivated] = useState(false);
  const [slideProgress, setSlideProgress] = useState(0);
  const [gateFading, setGateFading] = useState(false);
  const [revealVisible, setRevealVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  const audioWantedRef = useRef(true);
  const revealPlayedRef = useRef(false);
  const resolvePlayedRef = useRef(false);
  const exitingRef = useRef(false);
  const timersRef = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  const markIntroSeen = useCallback(() => {
    try {
      window.sessionStorage.setItem(INTRO_STORAGE_KEY, '1');
    } catch {
      // ignore storage restrictions
    }
  }, []);

  // Precompute K monogram SDF quietly while user is on the start switch
  useEffect(() => {
    if (stage === 'done') return;
    preloadGlassLogo(KOVALEV_K_SVG).catch(() => {});
  }, [stage]);

  // Listen for "Replay intro" trigger from FloatingChrome drawer
  useEffect(() => {
    const onReplay = () => {
      clearTimers();
      audioWantedRef.current = true;
      revealPlayedRef.current = false;
      resolvePlayedRef.current = false;
      exitingRef.current = false;
      setActivated(false);
      setSlideProgress(0);
      setGateFading(false);
      setRevealVisible(false);
      setExiting(false);
      setStage('gate');
    };
    window.addEventListener('kk-replay-intro', onReplay);
    return () => {
      window.removeEventListener('kk-replay-intro', onReplay);
      clearTimers();
    };
  }, [clearTimers]);

  const handleActivate = useCallback(
    (withSound: boolean) => {
      if (activated || stage !== 'gate') return;
      audioWantedRef.current = withSound;
      setActivated(true);
      markIntroSeen();
      setSoundEnabled(withSound);

      if (withSound) {
        soundEngine.setEnabled(true, true);
        soundEngine.unlock(() => {
          soundEngine.playClick();
          soundEngine.playTransition();
        });
      } else {
        soundEngine.setEnabled(false, true);
      }

      // 1) Switch glides swiftly (~420ms), particles swirl behind inertia & stream into '↗' (~900ms)
      // 2) Hold the clean warm amber '↗' state briefly (~250ms), then fade switch cleanly on #EFEFE9
      // 3) Mount Liquid Glass 'K' reveal synced to soundEngine.playIntroReveal()
      const fadeTimer = window.setTimeout(() => {
        setGateFading(true);
      }, 1180);

      const revealTimer = window.setTimeout(() => {
        setStage('reveal');
        requestAnimationFrame(() => {
          setRevealVisible(true);
        });
      }, 1500);

      timersRef.current.push(fadeTimer, revealTimer);
    },
    [activated, stage, markIntroSeen, setSoundEnabled]
  );

  const handleRevealStart = useCallback(() => {
    if (revealPlayedRef.current || !audioWantedRef.current) return;
    soundEngine.unlock(() => {
      if (revealPlayedRef.current || exitingRef.current || !audioWantedRef.current) return;
      if (playIntroReveal()) {
        revealPlayedRef.current = true;
      }
    });
  }, [playIntroReveal]);

  const finishIntro = useCallback(() => {
    if (exitingRef.current) return;
    exitingRef.current = true;
    markIntroSeen();
    setExiting(true);
  }, [markIntroSeen]);

  useEffect(() => {
    if (!exiting) return;
    const t = window.setTimeout(() => {
      setStage('done');
    }, 520);
    timersRef.current.push(t);
    return () => window.clearTimeout(t);
  }, [exiting]);

  // Safety timeout once Stage 2 GlassIconReveal starts
  useEffect(() => {
    if (stage !== 'reveal' || exiting) return;
    const safety = window.setTimeout(() => {
      finishIntro();
    }, 4600);
    return () => window.clearTimeout(safety);
  }, [stage, exiting, finishIntro]);

  // Keyboard support for both Stage 1 (switch) and Stage 2 (K reveal skip)
  useEffect(() => {
    if (stage === 'done') return;
    const onKey = (e: KeyboardEvent) => {
      if (stage === 'gate' && !activated) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
          e.preventDefault();
          handleActivate(true);
        }
        return;
      }
      if (stage === 'reveal' && (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ')) {
        if (audioWantedRef.current && soundEnabled && !resolvePlayedRef.current) {
          resolvePlayedRef.current = true;
          playIntroResolve();
        }
        finishIntro();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [stage, activated, handleActivate, finishIntro, playIntroResolve, soundEnabled]);

  if (stage === 'done') return null;

  // Stage 1 smoothly morphs #09090D -> #EFEFE9 in exact sync with the switch spring;
  // Stage 2 sits natively on #EFEFE9 to match <GlassIconReveal look="light" background="#EFEFE9" />
  const p = stage === 'reveal' ? 1 : slideProgress;
  const r = Math.round(9 + (239 - 9) * p);
  const g = Math.round(9 + (239 - 9) * p);
  const b = Math.round(13 + (233 - 13) * p);

  return (
    <div
      aria-label={
        stage === 'gate'
          ? lang === 'ru'
            ? 'Экран входа'
            : 'Entry switch'
          : 'Kirill Kovalev Intro'
      }
      onClick={() => {
        if (stage !== 'reveal') return;
        if (audioWantedRef.current && soundEnabled && !resolvePlayedRef.current) {
          resolvePlayedRef.current = true;
          playIntroResolve();
        }
        finishIntro();
      }}
      style={{
        backgroundColor: `rgb(${r}, ${g}, ${b})`,
        opacity: exiting ? 0 : 1,
        transform: exiting ? 'scale(1.025)' : 'scale(1)',
        transition:
          'opacity 500ms cubic-bezier(0.22, 1, 0.36, 1), transform 500ms cubic-bezier(0.22, 1, 0.36, 1)',
      }}
      className={`fixed inset-0 z-[96] flex flex-col items-center justify-center overflow-hidden select-none px-6 ${
        exiting
          ? 'pointer-events-none'
          : stage === 'reveal'
          ? 'cursor-pointer pointer-events-auto'
          : 'pointer-events-auto'
      }`}
    >
      {/* STAGE 1: Tactile Particle-Arrow Capsule Switch */}
      {stage === 'gate' && (
        <div
          style={{
            opacity: gateFading ? 0 : 1,
            transform: gateFading ? 'scale(0.95)' : 'scale(1)',
            transition:
              'opacity 340ms cubic-bezier(0.22, 1, 0.36, 1), transform 340ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
          className={`relative flex flex-col items-center ${
            gateFading ? 'pointer-events-none' : 'pointer-events-auto'
          }`}
        >
          <div
            style={{
              opacity: activated || p > 0.15 ? 0 : 1,
              transform: activated ? 'translateY(-6px)' : 'translateY(0)',
              transition: 'opacity 260ms ease, transform 260ms ease',
            }}
            className="mb-7 text-center pointer-events-none"
          >
            <p className="font-mono-tabular text-[10px] tracking-[0.26em] uppercase text-[#6D7282] mb-2">
              KIRILL KOVALEV
            </p>
            <h1 className="font-display text-[21px] sm:text-[24px] font-semibold tracking-[-0.025em] leading-tight text-[#EFEFE9]">
              {lang === 'ru' ? (
                <>
                  Открыть{' '}
                  <span className="font-serif-editorial italic font-normal text-[#96B8FF]">
                    портфолио
                  </span>
                </>
              ) : (
                <>
                  Open{' '}
                  <span className="font-serif-editorial italic font-normal text-[#96B8FF]">
                    portfolio
                  </span>
                </>
              )}
            </h1>
          </div>

          <div className="scale-95 sm:scale-105">
            <ParticleArrowSwitch
              activated={activated}
              onActivate={() => handleActivate(true)}
              onProgressChange={setSlideProgress}
              onHover={() => playHover()}
              ariaLabel={lang === 'ru' ? 'Открыть портфолио' : 'Open portfolio'}
            />
          </div>

          <div
            style={{
              opacity: activated || p > 0.15 ? 0 : 1,
              transform: activated ? 'translateY(6px)' : 'translateY(0)',
              transition: 'opacity 260ms ease, transform 260ms ease',
            }}
            className="mt-7 flex flex-col items-center gap-3"
          >
            <span className="font-mono-tabular text-[10px] tracking-[0.22em] uppercase text-[#7E8290]">
              {lang === 'ru' ? 'Нажмите или потяните →' : 'Click or slide →'}
            </span>

            <button
              type="button"
              onClick={() => handleActivate(false)}
              onMouseEnter={() => playHover()}
              className="font-sans-body text-[12px] tracking-[-0.01em] text-[#6E717C] hover:text-[#B8BCC8] transition-colors cursor-pointer"
            >
              {lang === 'ru' ? 'Без звука' : 'Without sound'}
            </button>
          </div>
        </div>
      )}

      {/* STAGE 2: Liquid Glass 'K' Monogram Reveal (synced 1:1 with soundEngine.playIntroReveal) */}
      {stage === 'reveal' && (
        <div
          style={{
            opacity: revealVisible ? 1 : 0,
            transition: 'opacity 260ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
          className="absolute inset-0 flex flex-col items-center justify-center"
        >
          <div className="w-[min(74vw,380px)] h-[min(74vw,380px)] relative">
            <GlassIconReveal
              logo={KOVALEV_K_SVG}
              label="K Monogram"
              look="light"
              background="#EFEFE9"
              logoColor="#0B0B0B"
              tileSize={290}
              logoScale={0.68}
              finalScale={0.78}
              loop={false}
              speed={1.32}
              replayOnClick={false}
              onStart={handleRevealStart}
              onComplete={finishIntro}
              tuning={{
                startZoom: 2.35,
                dispersion: 1.75,
                colorBleed: 1.3,
              }}
              className="w-full h-full"
            />
          </div>

          <div className="absolute bottom-7 left-0 right-0 px-6 flex items-center justify-between font-sans-body text-[10px] font-semibold tracking-[0.08em] uppercase text-[#0B0B0B]/55">
            <span>
              {audioWantedRef.current && soundEnabled
                ? 'KIRILL KOVALEV · SOUND ON'
                : 'KIRILL KOVALEV · MUTE'}
            </span>
            <span className="hover:text-[#D61914] transition-colors">
              {lang === 'ru' ? 'Нажмите, чтобы пропустить' : 'Click to skip'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
