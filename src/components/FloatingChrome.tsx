import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Volume2, VolumeX, Menu, X, Moon, Sun, RotateCcw } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useSound } from '../context/SoundContext';
import { useCurtainNavigation } from '../context/NavigationContext';
import { translations } from '../i18n/translations';
import { ScrambleText } from './ScrambleText';
import { GooeyNav } from './GooeyNav';

export function FloatingChrome() {
  const { isDark, toggleTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const { soundEnabled, toggleSound, playHover, playClick, playMorph } = useSound();
  const { navigateWithCurtain } = useCurtainNavigation();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [pendingNavIndex, setPendingNavIndex] = useState<number | null>(null);

  useEffect(() => {
    setMenuOpen(false);
    setPendingNavIndex(null);
    document.body.classList.remove('dg-scroll-lock');
  }, [location.pathname]);

  const isHome = location.pathname === '/';

  const menuLinks = useMemo(
    () => [
      {
        path: '/',
        label: t(translations.nav.home),
        italicLine: lang === 'ru' ? 'ГЛАВНАЯ' : 'HOME',
        regularLine: 'KIRILL KOVALEV',
      },
      {
        path: '/works',
        label: t(translations.nav.works),
        italicLine: lang === 'ru' ? 'АРХИВ' : 'SELECTED',
        regularLine: lang === 'ru' ? 'РАБОТЫ' : 'WORKS',
      },
      {
        path: '/dome',
        label: lang === 'ru' ? '3D Сфера' : '3D Sphere',
        italicLine: lang === 'ru' ? 'СФЕРА' : '3D DOME',
        regularLine: lang === 'ru' ? 'ВСЕ РАБОТЫ' : 'GALLERY',
      },
      {
        path: '/about',
        label: t(translations.nav.about),
        italicLine: lang === 'ru' ? 'ПОДХОД' : 'STUDIO',
        regularLine: lang === 'ru' ? 'О СЕБЕ' : 'ABOUT',
      },
      {
        path: '/contacts',
        label: t(translations.nav.contacts),
        italicLine: lang === 'ru' ? 'СВЯЗЬ' : 'LET’S',
        regularLine: lang === 'ru' ? 'КОНТАКТЫ' : 'TALK',
      },
    ],
    [lang, t]
  );

  const routeActiveIndex = useMemo(() => {
    if (location.pathname === '/') return 0;
    if (location.pathname.startsWith('/works')) return 1;
    if (location.pathname.startsWith('/dome')) return 2;
    if (location.pathname.startsWith('/about')) return 3;
    if (location.pathname.startsWith('/contacts')) return 4;
    return 0;
  }, [location.pathname]);

  const activeGooeyIndex = pendingNavIndex ?? routeActiveIndex;

  const handleGooeySelect = (index: number) => {
    const target = menuLinks[index];
    if (!target) return;
    playMorph();
    setPendingNavIndex(index);
    const alreadyOnTarget =
      target.path === '/'
        ? location.pathname === '/'
        : location.pathname === target.path;
    if (alreadyOnTarget) return;
    navigateWithCurtain(target.path, {
      italicLine: target.italicLine,
      regularLine: target.regularLine,
    });
  };

  return (
    <>
      {/* Persistent Top GooeyNav Dock + Dark/Light Mode Switcher (stays visible above CurvedCurtain z-[90]) */}
      <div className="pointer-events-none fixed top-2.5 sm:top-4 left-0 right-0 z-[92] px-1.5 sm:px-6 flex justify-center items-center gap-1.5 sm:gap-2.5">
        <div className="pointer-events-auto max-w-full min-w-0">
          <GooeyNav
            items={menuLinks.map((item) => ({ label: item.label }))}
            activeIndex={activeGooeyIndex}
            onChange={handleGooeySelect}
            theme={isDark ? 'light' : 'dark'}
            size="md"
            frame={true}
            particleCount={15}
            spread={56}
            animationTime={600}
            timeVariance={300}
            gooeyness={0.5}
            wobble={0.5}
            hoverEffect={true}
          />
        </div>

        <button
          type="button"
          onClick={() => {
            playMorph();
            toggleTheme();
          }}
          onMouseEnter={() => playHover()}
          aria-pressed={isDark}
          aria-label={
            isDark
              ? lang === 'ru'
                ? 'Переключить на светлую тему'
                : 'Switch to light theme'
              : lang === 'ru'
              ? 'Переключить на тёмную тему'
              : 'Switch to dark theme'
          }
          title={
            isDark
              ? lang === 'ru'
                ? 'Светлая тема'
                : 'Light mode'
              : lang === 'ru'
              ? 'Тёмная тема'
              : 'Dark mode'
          }
          className={`pointer-events-auto w-8 h-8 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-110 active:scale-95 shrink-0 ${
            isDark
              ? 'liquid-glass-light text-[#0B0B0B] hover:text-[#D61914]'
              : 'liquid-glass-dark text-[#EFEFE9] hover:text-[#E7FA53]'
          }`}
        >
          {isDark ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
        </button>
      </div>

      {/* Top-right Liquid Glass K monogram tile (desktop/tablet) */}
      {!isHome && (
        <button
          type="button"
          onClick={() =>
            navigateWithCurtain('/', {
              italicLine: lang === 'ru' ? 'ГЛАВНАЯ' : 'HOME',
            })
          }
          onMouseEnter={() => playHover()}
          aria-label={t(translations.nav.home)}
          className={`hidden sm:flex group fixed top-5 right-5 sm:top-6 sm:right-7 z-40 w-11 h-11 rounded-[14px] items-center justify-center transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-110 active:scale-95 overflow-hidden ${
            isDark ? 'liquid-glass-dark' : 'liquid-glass-light'
          }`}
        >
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-80 group-hover:opacity-100 transition-opacity ${
              isDark
                ? 'from-white/15 via-transparent to-cyan-200/10'
                : 'from-white/55 via-transparent to-cyan-200/15'
            }`}
          />
          <svg
            viewBox="0 0 28 28"
            className={`relative w-5 h-5 transition-colors ${
              isDark
                ? 'text-[#EFEFE9] group-hover:text-[#E7FA53]'
                : 'text-[#0B0B0B] group-hover:text-[#D61914]'
            }`}
            aria-hidden="true"
          >
            <path
              d="M6 23 L10 5 H15 L11 23 Z M14 14 L22 5 H26 L18 14 L23 23 H18 Z"
              fill="currentColor"
            />
          </svg>
        </button>
      )}

      {/* Floating Bottom-Right Liquid Glass Menu Button & Drawer */}
      <div className="fixed bottom-11 sm:bottom-12 right-4 sm:right-7 z-50 flex flex-col items-end">
        <nav
          aria-label="Site navigation"
          aria-hidden={!menuOpen}
          style={{
            transform: menuOpen
              ? 'translate3d(0, 0, 0) scale(1, 1)'
              : 'translate3d(0, 14px, 0) scale(0.86, 1.12)',
            opacity: menuOpen ? 1 : 0,
            pointerEvents: menuOpen ? 'auto' : 'none',
            transition:
              'transform 460ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 200ms ease',
          }}
          className={`mb-3 w-48 sm:w-52 rounded-[18px] py-3 px-4 flex flex-col gap-1 origin-bottom-right ${
            isDark
              ? 'liquid-glass-dark text-[#EFEFE9]'
              : 'liquid-glass-light text-[#0B0B0B]'
          }`}
        >
          {menuLinks.map((item) => {
            const active =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);
            return (
              <button
                key={item.path}
                type="button"
                tabIndex={menuOpen ? 0 : -1}
                onClick={() => {
                  setMenuOpen(false);
                  navigateWithCurtain(item.path, {
                    italicLine: item.italicLine,
                    regularLine: item.regularLine,
                  });
                }}
                onMouseEnter={() => playHover()}
                className={`w-full text-left py-2 px-1 font-display text-lg sm:text-xl font-semibold tracking-[-0.03em] leading-[1.1] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:translate-x-1.5 flex items-center justify-between ${
                  active
                    ? isDark
                      ? 'text-[#E7FA53]'
                      : 'text-[#D61914]'
                    : isDark
                    ? 'text-[#EFEFE9] hover:text-[#E7FA53]'
                    : 'text-[#0B0B0B] hover:text-[#D61914]'
                }`}
              >
                <ScrambleText text={item.label} triggerOnHover duration={300} />
                {active && <span className="text-[10px]">●</span>}
              </button>
            );
          })}
          <div className={`mt-1.5 pt-2 border-t ${isDark ? 'border-white/12' : 'border-[#0B0B0B]/12'}`}>
            <button
              type="button"
              tabIndex={menuOpen ? 0 : -1}
              onClick={() => {
                playClick();
                setMenuOpen(false);
                window.dispatchEvent(new CustomEvent('kk-replay-intro'));
              }}
              onMouseEnter={() => playHover()}
              className={`w-full text-left py-1.5 px-1 font-mono-tabular text-[10px] uppercase tracking-[0.14em] flex items-center justify-between transition-colors ${
                isDark
                  ? 'text-[#EFEFE9]/65 hover:text-[#E7FA53]'
                  : 'text-[#0B0B0B]/65 hover:text-[#D61914]'
              }`}
            >
              <span>{lang === 'ru' ? 'Повторить интро' : 'Replay intro'}</span>
              <RotateCcw className="w-3 h-3 shrink-0" />
            </button>
          </div>
        </nav>

        <button
          type="button"
          onClick={() => {
            playClick();
            setMenuOpen((prev) => !prev);
          }}
          onMouseEnter={() => playHover()}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? t(translations.nav.close) : t(translations.nav.menu)}
          className={`w-11 h-11 rounded-[14px] transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-110 active:scale-90 flex items-center justify-center ${
            isDark
              ? 'liquid-glass-light text-[#0B0B0B] hover:text-[#D61914]'
              : 'liquid-glass-dark text-[#EFEFE9] hover:text-[#E7FA53]'
          }`}
        >
          {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Fixed Bottom Liquid Glass Micro-Utility Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 h-9 sm:h-10 liquid-glass-bar border-t border-[#0B0B0B]/10 dark:border-white/10 px-4 sm:px-7 flex items-center justify-between text-[10px] sm:text-[11px] font-sans-body font-semibold uppercase tracking-[-0.01em] text-[#0B0B0B] dark:text-[#EFEFE9]">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <span className="whitespace-nowrap shrink-0">© 2026</span>
          <span aria-hidden="true" className="opacity-40">·</span>
          <button
            type="button"
            onClick={() =>
              navigateWithCurtain('/', {
                italicLine: 'KIRILL',
                regularLine: 'KOVALEV',
              })
            }
            className="hidden sm:inline hover:text-[#D61914] transition-colors whitespace-nowrap shrink-0"
          >
            KIRILL KOVALEV
          </button>
          <span aria-hidden="true" className="hidden sm:inline opacity-40">|</span>

          {/* Instant RU / EN switcher */}
          <div className="flex items-center gap-1 whitespace-nowrap shrink-0">
            <button
              type="button"
              onClick={() => {
                playClick();
                setLang('ru');
              }}
              aria-pressed={lang === 'ru'}
              className={`px-1 py-0.5 transition-colors ${
                lang === 'ru'
                  ? 'font-bold text-[#0B0B0B] dark:text-[#E7FA53] underline underline-offset-4'
                  : 'opacity-55 hover:opacity-100'
              }`}
            >
              RU
            </button>
            <span aria-hidden="true" className="opacity-35">/</span>
            <button
              type="button"
              onClick={() => {
                playClick();
                setLang('en');
              }}
              aria-pressed={lang === 'en'}
              className={`px-1 py-0.5 transition-colors ${
                lang === 'en'
                  ? 'font-bold text-[#0B0B0B] dark:text-[#E7FA53] underline underline-offset-4'
                  : 'opacity-55 hover:opacity-100'
              }`}
            >
              EN
            </button>
          </div>

          <span aria-hidden="true" className="opacity-40">|</span>

          {/* Sound Toggle Icon (matches speaker icon in video bottom-left) */}
          <button
            type="button"
            onClick={toggleSound}
            aria-pressed={soundEnabled}
            aria-label={soundEnabled ? t(translations.utility.soundOn) : t(translations.utility.soundOff)}
            className="inline-flex items-center gap-1 py-1 px-1.5 hover:text-[#D61914] transition-colors whitespace-nowrap shrink-0"
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-[#D61914]" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 opacity-60" />
            )}
            <span className="hidden md:inline">
              {soundEnabled ? (lang === 'ru' ? 'ЗВУК' : 'SOUND') : lang === 'ru' ? 'ТИХО' : 'MUTE'}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 whitespace-nowrap shrink-0">
          <a
            href="https://t.me/vamonny"
            target="_blank"
            rel="noreferrer"
            onMouseEnter={() => playHover()}
            className="hover:text-[#D61914] transition-colors"
          >
            TELEGRAM
          </a>
          <span aria-hidden="true" className="opacity-40">|</span>
          <a
            href="mailto:vamonny06@gmail.com"
            onMouseEnter={() => playHover()}
            className="hover:text-[#D61914] transition-colors"
          >
            EMAIL
          </a>
        </div>
      </div>
    </>
  );
}
