import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Lang, BilingualText } from '../i18n/translations';

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  t: (text: BilingualText) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kk_portfolio_lang');
      if (saved === 'en' || saved === 'ru') return saved;
    }
    return 'ru';
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    localStorage.setItem('kk_portfolio_lang', lang);
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((prev) => (prev === 'ru' ? 'en' : 'ru'));
  }, []);

  const t = useCallback(
    (text: BilingualText) => {
      return text[lang];
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
}
