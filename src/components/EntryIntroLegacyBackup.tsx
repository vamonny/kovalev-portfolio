import { useEffect, useState, useCallback, useRef } from 'react';
import { GlassIconReveal, KOVALEV_K_SVG, preloadGlassLogo } from './GlassIconReveal';
import { StarBorder } from './StarBorder';
import WebThreads from './WebThreads';
import { useLanguage } from '../context/LanguageContext';
import { useSound } from '../context/SoundContext';
import { soundEngine } from '../audio/soundEngine';

type Stage = 'gate' | 'reveal' | 'done';

const INTRO_STORAGE_KEY = 'kk_intro_seen';

/**
 * Legacy backup of the WebThreads + StarBorder + GlassIconReveal 'K' intro.
 * Preserved intentionally in case you want to switch back at any time.
 */
export function EntryIntroLegacyBackup() {
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
  const [transitioning, setTransitioning] = useState(false);
  const [revealVisible, setRevealVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  const audioWantedRef = useRef(true);
  const revealPlayedRef = useRef(false);
  const resolvePlayedRef = useRef(false);
  const exitingRef = useRef(false);
  const gateTimerRef = useRef<number | null>(null);

  const markIntroSeen = useCallback(() => {
    try {
      window.sessionStorage.setItem(INTRO_STORAGE_KEY, '1');
    } catch {
      // ignore storage restrictions
    }
  }, []);

  useEffect(() => {
    if (stage === 'done') return;
    preloadGlassLogo(KOVALEV_K_SVG).catch(() => {});
  }, [stage]);

  const handleEnter = useCallback(
    (withSound: boolean) => {
      if (stage !== 'gate' || transitioning) return;
      audioWantedRef.current = withSound;
      setSoundEnabled(withSound);
      markIntroSeen();

      if (withSound) {
        soundEngine.setEnabled(true);
        soundEngine.unlock();
      } else {
        soundEngine.setEnabled(false);
      }

      setTransitioning(true);
      gateTimerRef.current = window.setTimeout(() => {
        gateTimerRef.current = null;
        setStage('reveal');
        requestAnimationFrame(() => {
          setRevealVisible(true);
        });
      }, 620);
    },
    [stage, transitioning, setSoundEnabled, markIntroSeen]
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
    return () => window.clearTimeout(t);
  }, [exiting]);

  useEffect(() => {
    if (stage !== 'reveal' || exiting) return;
    const safety = window.setTimeout(() => {
      finishIntro();
    }, 4600);
    return () => window.clearTimeout(safety);
  }, [stage, exiting, finishIntro]);

  useEffect(() => {
    if (stage === 'done') return;
    const onKey = (e: KeyboardEvent) => {
      if (stage === 'gate') {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleEnter(true);
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
  }, [stage, handleEnter, finishIntro, playIntroResolve, soundEnabled]);

  if (stage === 'done') return null;

  const isLightBackdrop = transitioning || stage === 'reveal';

  return (
    <div
      aria-label={stage === 'gate' ? (lang === 'ru' ? 'Стартовый экран' : 'Welcome screen') : 'Kirill Kovalev Intro'}
      onClick={() => {
        if (stage !== 'reveal') return;
        if (audioWantedRef.current && soundEnabled && !resolvePlayedRef.current) {
          resolvePlayedRef.current = true;
          playIntroResolve();
        }
        finishIntro();
      }}
      style={{
        backgroundColor: isLightBackdrop ? '#EFEFE9' : '#0C0C0F',
        opacity: exiting ? 0 : 1,
        transform: exiting ? 'scale(1.025)' : 'scale(1)',
        transition:
          'background-color 640ms cubic-bezier(0.22, 1, 0.36, 1), opacity 500ms cubic-bezier(0.22, 1, 0.36, 1), transform 500ms cubic-bezier(0.22, 1, 0.36, 1)',
      }}
      className={`fixed inset-0 z-[96] flex items-center justify-center overflow-hidden select-none ${
        exiting ? 'pointer-events-none' : stage === 'reveal' ? 'cursor-pointer pointer-events-auto' : 'pointer-events-auto'
      }`}
    >
      {stage === 'gate' && (
        <div
          style={{
            opacity: transitioning ? 0 : 1,
            transform: transitioning ? 'scale(0.97)' : 'scale(1)',
            transition:
              'opacity 460ms cubic-bezier(0.22, 1, 0.36, 1), transform 460ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
          className={`absolute inset-0 flex items-center justify-center px-6 ${
            transitioning ? 'pointer-events-none' : 'pointer-events-auto'
          }`}
        >
          <div className="absolute inset-0">
            <WebThreads
              colors={['#000bed', '#ffffff']}
              coreColor="#FFFFFF"
              threadCount={4}
              spread={0.18}
              speed={0.24}
              position={0.5}
              pinch={0.5}
              className="w-full h-full"
            />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <StarBorder
              color="#ffffff"
              trailColor="#ffffff"
              duration={4}
              direction="clockwise"
              stars={1}
              trailLength={0.3}
              thickness={1}
              radius={12}
              glow={0.6}
              hover="lap"
              sparkle={false}
              clickPulse
              theme="dark"
              onClick={() => handleEnter(true)}
              className="font-sans-body text-[14px] sm:text-[15px] tracking-[-0.01em] px-8 py-3.5"
            >
              {lang === 'ru' ? 'Начать' : 'Get started'}
            </StarBorder>

            <button
              type="button"
              onClick={() => handleEnter(false)}
              onMouseEnter={() => playHover()}
              className="absolute top-full left-1/2 -translate-x-1/2 mt-5 whitespace-nowrap font-sans-body text-[12px] sm:text-[13px] tracking-[-0.01em] text-[#7A7A82] hover:text-[#C8C8D0] transition-colors cursor-pointer"
            >
              {lang === 'ru' ? 'Без звука' : 'Without sound'}
            </button>
          </div>
        </div>
      )}

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
