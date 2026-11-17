import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Moon, RotateCcw, Sun, Volume2, VolumeX, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useSound } from '../context/SoundContext';
import { useCurtainNavigation } from '../context/NavigationContext';
import { translations } from '../i18n/translations';
import { PillNav, PillNavItem } from './PillNav';

export function FloatingChrome() {
  const { isDark, toggleTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const { soundEnabled, toggleSound, playHover, playClick, playMorph } = useSound();
  const { navigateWithCurtain } = useCurtainNavigation();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
    document.body.classList.remove('dg-scroll-lock');
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 18);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isForcedDarkRoute =
    location.pathname.includes('wb-ozon-marketplace-typography') ||
    location.pathname.includes('pafos-seductions-brandbook');

  const darkHeaderSurface = isDark || isForcedDarkRoute;

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
        italicLine: lang === 'ru' ? 'ПОДХОД' : 'PRACTICE',
        regularLine: lang === 'ru' ? 'О СЕБЕ' : 'ABOUT',
      },
      {
        path: '/contacts',
        label: t(translations.nav.contacts),
        italicLine: lang === 'ru' ? 'СВЯЗЬ' : 'CONTACT',
        regularLine: lang === 'ru' ? 'КОНТАКТЫ' : 'INQUIRY',
      },
    ],
    [lang, t]
  );

  const pillItems: PillNavItem[] = useMemo(
    () =>
      menuLinks.map((item) => ({
        label: item.label,
        href: item.path,
      })),
    [menuLinks]
  );

  const activeNavHref = useMemo(() => {
    const match = menuLinks.find((item) =>
      item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path)
    );
    return match ? match.path : '/';
  }, [location.pathname, menuLinks]);

  const go = (item: (typeof menuLinks)[number]) => {
    playMorph();
    setMenuOpen(false);
    const alreadyThere =
      item.path === '/' ? location.pathname === '/' : location.pathname === item.path;
    if (alreadyThere) return;
    navigateWithCurtain(item.path, {
      italicLine: item.italicLine,
      regularLine: item.regularLine,
    });
  };

  return (
    <>
      {/* Three-Zone Header: Left Brand Wordmark + Centered PillNav + Right Primary CTA */}
      <header
        className={`fixed top-0 left-0 right-0 z-[92] h-16 sm:h-[72px] px-4 sm:px-8 flex items-center justify-between gap-4 transition-[background-color,border-color,backdrop-filter] duration-200 pointer-events-none ${
          isScrolled || menuOpen
            ? darkHeaderSurface
              ? 'bg-[#0C0C0F]/82 backdrop-blur-md border-b border-white/10 text-[#EFEFE9]'
              : 'bg-[#EFEFE9]/82 backdrop-blur-md border-b border-[#0B0B0B]/10 text-[#0B0B0B]'
            : darkHeaderSurface
            ? 'bg-transparent border-b border-transparent text-[#EFEFE9]'
            : 'bg-transparent border-b border-transparent text-[#0B0B0B]'
        }`}
      >
        {/* Zone 1 (Left): Brand Wordmark */}
        <button
          type="button"
          onClick={() => go(menuLinks[0])}
          onMouseEnter={() => playHover()}
          className="pointer-events-auto font-display text-lg sm:text-[21px] font-bold tracking-[-0.03em] whitespace-nowrap shrink-0 text-left hover:opacity-80 transition-opacity duration-200"
        >
          Kirill Kovalev
        </button>

        {/* Zone 2 (Center): React Bits PillNav */}
        <div className="hidden lg:flex flex-1 min-w-0 items-center justify-center pointer-events-auto">
          <PillNav
            items={pillItems}
            activeHref={activeNavHref}
            onItemClick={(_item, index, event) => {
              event.preventDefault();
              const target = menuLinks[index];
              if (target) go(target);
            }}
            theme={darkHeaderSurface ? 'dark' : 'light'}
            surface="glass"
            size="md"
            itemStyle="pill"
            hoverEffect="fill"
            indicator="pill"
            bounce={0.16}
            collapse="never"
            ariaLabel="Primary navigation"
          />
        </div>

        {/* Zone 3 (Right): Primary CTA + Mobile/Tablet Menu Trigger */}
        <div className="flex items-center gap-2.5 shrink-0 pointer-events-auto">
          <button
            type="button"
            onClick={() => go(menuLinks[4])}
            onMouseEnter={() => playHover()}
            className={`hidden sm:inline-flex items-center justify-center px-4 py-2 type-sm font-semibold rounded-[6px] whitespace-nowrap shrink-0 transition-colors duration-200 ${
              darkHeaderSurface
                ? 'bg-[#E7FA53] text-[#0B0B0B] hover:bg-white'
                : 'bg-[#0B0B0B] text-[#EFEFE9] hover:bg-[#D61914]'
            }`}
          >
            {t(translations.nav.cta)}
          </button>

          <button
            type="button"
            onClick={() => {
              playClick();
              setMenuOpen((prev) => !prev);
            }}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? t(translations.nav.close) : t(translations.nav.menu)}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-[6px] border border-current/20"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile / Tablet Navigation Drawer */}
      {menuOpen && (
        <div
          className={`fixed inset-x-0 top-16 sm:top-[72px] z-[91] lg:hidden border-b px-5 py-6 flex flex-col gap-3 shadow-xl ${
            darkHeaderSurface
              ? 'bg-[#0C0C0F]/96 border-white/14 text-[#EFEFE9]'
              : 'bg-[#EFEFE9]/96 border-[#0B0B0B]/14 text-[#0B0B0B]'
          } backdrop-blur-lg`}
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
                onClick={() => go(item)}
                className={`w-full text-left py-2 type-heading font-display font-bold tracking-tight transition-colors ${
                  active
                    ? darkHeaderSurface
                      ? 'text-[#E7FA53]'
                      : 'text-[#D61914]'
                    : 'opacity-85 hover:opacity-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <div className="pt-3 mt-1 border-t border-current/12 flex items-center justify-between">
            <button
              type="button"
              onClick={() => go(menuLinks[4])}
              className={`px-4 py-2.5 type-sm font-semibold rounded-[6px] ${
                darkHeaderSurface
                  ? 'bg-[#E7FA53] text-[#0B0B0B]'
                  : 'bg-[#0B0B0B] text-[#EFEFE9]'
              }`}
            >
              {t(translations.nav.cta)}
            </button>
            <button
              type="button"
              onClick={() => {
                playClick();
                setMenuOpen(false);
                window.dispatchEvent(new CustomEvent('kk-replay-intro'));
              }}
              className="inline-flex items-center gap-1.5 type-sm opacity-75 hover:opacity-100"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{lang === 'ru' ? 'Повторить интро' : 'Replay intro'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Slim Bottom Utility Bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 h-10 liquid-glass-bar border-t border-[#0B0B0B]/10 dark:border-white/10 px-4 sm:px-8 flex items-center justify-between text-[13px] sm:type-sm font-sans-body font-medium text-[#0B0B0B] dark:text-[#EFEFE9]">
        <div className="flex items-center gap-3 min-w-0">
          <span className="tabular-nums opacity-70 whitespace-nowrap shrink-0">© 2026</span>

          {/* Segmented RU / EN Language Switcher */}
          <div className="flex items-center bg-[#0B0B0B]/[0.06] dark:bg-white/[0.08] p-0.5 rounded-[5px] whitespace-nowrap shrink-0">
            <button
              type="button"
              onClick={() => {
                playClick();
                setLang('ru');
              }}
              aria-pressed={lang === 'ru'}
              className={`px-2 py-0.5 rounded-[4px] transition-colors duration-150 ${
                lang === 'ru'
                  ? 'bg-[#0B0B0B] dark:bg-[#E7FA53] text-[#EFEFE9] dark:text-[#0B0B0B] font-semibold'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              RU
            </button>
            <button
              type="button"
              onClick={() => {
                playClick();
                setLang('en');
              }}
              aria-pressed={lang === 'en'}
              className={`px-2 py-0.5 rounded-[4px] transition-colors duration-150 ${
                lang === 'en'
                  ? 'bg-[#0B0B0B] dark:bg-[#E7FA53] text-[#EFEFE9] dark:text-[#0B0B0B] font-semibold'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              EN
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              playMorph();
              toggleTheme();
            }}
            aria-pressed={isDark}
            aria-label={isDark ? 'Light mode' : 'Dark mode'}
            className="inline-flex items-center gap-1.5 py-1 hover:opacity-70 transition-opacity whitespace-nowrap shrink-0"
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">
              {isDark
                ? lang === 'ru'
                  ? 'Светлая тема'
                  : 'Light theme'
                : lang === 'ru'
                ? 'Тёмная тема'
                : 'Dark theme'}
            </span>
          </button>

          <button
            type="button"
            onClick={toggleSound}
            aria-pressed={soundEnabled}
            aria-label={soundEnabled ? t(translations.utility.soundOn) : t(translations.utility.soundOff)}
            className="inline-flex items-center gap-1.5 py-1 hover:opacity-70 transition-opacity whitespace-nowrap shrink-0"
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-[#D61914] dark:text-[#E7FA53]" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 opacity-65" />
            )}
            <span className="hidden sm:inline">
              {soundEnabled ? (lang === 'ru' ? 'Звук' : 'Sound') : lang === 'ru' ? 'Тихо' : 'Muted'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              playClick();
              window.dispatchEvent(new CustomEvent('kk-replay-intro'));
            }}
            onMouseEnter={() => playHover()}
            className="hidden md:inline-flex items-center gap-1.5 py-1 opacity-75 hover:opacity-100 transition-opacity whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === 'ru' ? 'Интро' : 'Intro'}</span>
          </button>
        </div>

        <div className="flex items-center gap-3 whitespace-nowrap shrink-0">
          <a
            href="https://t.me/vamonny"
            target="_blank"
            rel="noreferrer"
            onMouseEnter={() => playHover()}
            className="hover:text-[#D61914] dark:hover:text-[#E7FA53] transition-colors"
          >
            Telegram
          </a>
          <span aria-hidden="true" className="opacity-30">·</span>
          <a
            href="mailto:vamonny06@gmail.com"
            onMouseEnter={() => playHover()}
            className="hover:text-[#D61914] dark:hover:text-[#E7FA53] transition-colors"
          >
            Email
          </a>
        </div>
      </footer>
    </>
  );
}
