import { Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSound } from '../context/SoundContext';
import { translations } from '../i18n/translations';

export function UtilityDock() {
  const { lang, setLang, t } = useLanguage();
  const { soundEnabled, toggleSound, playClick, playHover } = useSound();

  return (
    <div
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center bg-[#0B0B0D] text-[#F4F1EA] border border-[#F4F1EA]/20 shadow-lg"
      role="region"
      aria-label="Language and Sound Controls"
    >
      {/* Instant RU / EN Switcher */}
      <div className="flex items-center border-r border-[#F4F1EA]/15">
        <button
          type="button"
          onClick={() => {
            setLang('ru');
            playClick();
          }}
          onMouseEnter={() => playHover()}
          aria-pressed={lang === 'ru'}
          className={`px-3 py-2.5 min-h-[40px] font-mono-tabular text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
            lang === 'ru'
              ? 'bg-[#E63B1F] text-[#F4F1EA]'
              : 'text-[#F4F1EA]/65 hover:text-[#F4F1EA]'
          }`}
        >
          RU
        </button>
        <button
          type="button"
          onClick={() => {
            setLang('en');
            playClick();
          }}
          onMouseEnter={() => playHover()}
          aria-pressed={lang === 'en'}
          className={`px-3 py-2.5 min-h-[40px] font-mono-tabular text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
            lang === 'en'
              ? 'bg-[#E63B1F] text-[#F4F1EA]'
              : 'text-[#F4F1EA]/65 hover:text-[#F4F1EA]'
          }`}
        >
          EN
        </button>
      </div>

      {/* Sound Design Toggle (muted by default) */}
      <button
        type="button"
        onClick={toggleSound}
        onMouseEnter={() => playHover()}
        aria-pressed={soundEnabled}
        aria-label={soundEnabled ? t(translations.utility.soundOn) : t(translations.utility.soundOff)}
        className="flex items-center gap-2 px-3.5 py-2.5 min-h-[40px] font-mono-tabular text-xs text-[#F4F1EA] hover:bg-[#F4F1EA]/10 transition-colors whitespace-nowrap shrink-0"
      >
        {soundEnabled ? (
          <Volume2 className="w-3.5 h-3.5 text-[#D9FF3F]" aria-hidden="true" />
        ) : (
          <VolumeX className="w-3.5 h-3.5 text-[#F4F1EA]/55" aria-hidden="true" />
        )}
        <span className="hidden sm:inline">
          {soundEnabled ? t(translations.utility.soundOn) : t(translations.utility.soundOff)}
        </span>
      </button>
    </div>
  );
}
