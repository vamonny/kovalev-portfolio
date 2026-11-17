import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useSound } from '../context/SoundContext';
import { translations } from '../i18n/translations';
import { ElasticDivider } from './ElasticDivider';

export function Footer() {
  const { t } = useLanguage();
  const { playClick, playHover } = useSound();

  return (
    <footer className="bg-[#0B0B0D] text-[#F4F1EA] pt-12 pb-20 sm:pb-14 px-5 sm:px-8 lg:px-12 border-t border-[#F4F1EA]/12">
      <div className="max-w-[1440px] mx-auto">
        <ElasticDivider color="#F4F1EA" className="mb-10" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-end pb-12 border-b border-[#F4F1EA]/12">
          <div className="md:col-span-6">
            <p className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight uppercase mb-4">
              KIRILL KOVALEV
            </p>
            <p className="text-sm sm:text-base text-[#F4F1EA]/70 max-w-md leading-relaxed">
              {t(translations.footer.statement)}
            </p>
          </div>

          <div className="md:col-span-3 flex flex-col gap-2.5 text-sm">
            <Link
              to="/"
              onClick={() => playClick()}
              onMouseEnter={() => playHover()}
              className="text-[#F4F1EA]/75 hover:text-[#D9FF3F] transition-colors w-fit"
            >
              {t(translations.nav.home)}
            </Link>
            <Link
              to="/works"
              onClick={() => playClick()}
              onMouseEnter={() => playHover()}
              className="text-[#F4F1EA]/75 hover:text-[#D9FF3F] transition-colors w-fit"
            >
              {t(translations.nav.works)}
            </Link>
            <Link
              to="/about"
              onClick={() => playClick()}
              onMouseEnter={() => playHover()}
              className="text-[#F4F1EA]/75 hover:text-[#D9FF3F] transition-colors w-fit"
            >
              {t(translations.nav.about)}
            </Link>
            <Link
              to="/contacts"
              onClick={() => playClick()}
              onMouseEnter={() => playHover()}
              className="text-[#F4F1EA]/75 hover:text-[#D9FF3F] transition-colors w-fit"
            >
              {t(translations.nav.contacts)}
            </Link>
          </div>

          <div className="md:col-span-3 flex flex-col gap-2.5 text-sm">
            <a
              href="mailto:vamonny06@gmail.com"
              onMouseEnter={() => playHover()}
              className="text-[#F4F1EA] hover:text-[#E63B1F] transition-colors w-fit font-medium"
            >
              vamonny06@gmail.com
            </a>
            <a
              href="https://t.me/vamonny"
              target="_blank"
              rel="noreferrer"
              onMouseEnter={() => playHover()}
              className="text-[#F4F1EA]/75 hover:text-[#D9FF3F] transition-colors w-fit"
            >
              Telegram @vamonny
            </a>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#F4F1EA]/50">
          <p>{t(translations.footer.connected)}</p>
          <p className="font-mono-tabular">
            © {new Date().getFullYear()} {t(translations.footer.rights)}
          </p>
        </div>
      </div>
    </footer>
  );
}
