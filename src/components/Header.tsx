import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSound } from '../context/SoundContext';
import { translations } from '../i18n/translations';
import { MagneticButton } from './MagneticButton';

export function Header() {
  const { t } = useLanguage();
  const { playHover, playClick } = useSound();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navItems = [
    { path: '/', label: t(translations.nav.home) },
    { path: '/works', label: t(translations.nav.works) },
    { path: '/about', label: t(translations.nav.about) },
    { path: '/contacts', label: t(translations.nav.contacts) },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F4F1EA]/90 backdrop-blur-md border-b border-[#141414]/12">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 h-14 sm:h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (strictly single-line text element) */}
        <Link
          to="/"
          onClick={() => playClick()}
          onMouseEnter={() => playHover()}
          className="font-display text-sm sm:text-base font-bold tracking-tight text-[#141414] whitespace-nowrap shrink-0 hover:text-[#E63B1F] transition-colors"
        >
          KIRILL KOVALEV
        </Link>

        {/* Zone 2: 4 single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Primary Navigation">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => playClick()}
                onMouseEnter={() => playHover()}
                className={`relative py-1 text-sm font-medium whitespace-nowrap shrink-0 transition-colors ${
                  active ? 'text-[#E63B1F]' : 'text-[#141414]/75 hover:text-[#141414]'
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute left-0 bottom-0 h-[1.5px] bg-[#E63B1F] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-left w-full ${
                    active ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action (desktop) + mobile menu trigger */}
        <div className="flex items-center shrink-0">
          <MagneticButton
            onClick={() => navigate('/contacts')}
            className="hidden md:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold tracking-wide bg-[#141414] text-[#F4F1EA] hover:bg-[#E63B1F] transition-colors whitespace-nowrap shrink-0"
          >
            {t(translations.nav.cta)}
          </MagneticButton>

          <button
            type="button"
            onClick={() => {
              playClick();
              setMobileOpen((v) => !v);
            }}
            aria-label={mobileOpen ? t(translations.nav.close) : t(translations.nav.menu)}
            aria-expanded={mobileOpen}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 -mr-2 text-[#141414]"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#141414]/12 bg-[#F4F1EA] px-5 py-6">
          <nav className="flex flex-col gap-2" aria-label="Mobile Navigation">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => playClick()}
                  className={`py-3 text-xl font-display font-semibold tracking-tight border-b border-[#141414]/10 flex items-center justify-between ${
                    active ? 'text-[#E63B1F]' : 'text-[#141414]'
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="font-mono-tabular text-xs opacity-50">↗</span>
                </Link>
              );
            })}
            <button
              type="button"
              onClick={() => {
                playClick();
                navigate('/contacts');
              }}
              className="mt-4 w-full py-3.5 px-5 bg-[#141414] text-[#F4F1EA] font-semibold text-sm text-center"
            >
              {t(translations.nav.cta)}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
