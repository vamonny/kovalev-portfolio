import React, { useState } from 'react';
import { Check, Copy, ArrowUpRight, Send } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSound } from '../context/SoundContext';
import { useRubberScroll } from '../hooks/useRubberScroll';
import { translations } from '../i18n/translations';
import { ScrambleText } from '../components/ScrambleText';
import { RubberText } from '../components/RubberText';
import { RubberBlock, RubberWords } from '../components/RubberMotion';
import { GlassIconReveal, KOVALEV_K_SVG } from '../components/GlassIconReveal';

const EMAIL = 'vamonny06@gmail.com';
const TELEGRAM = '@vamonny';
const TELEGRAM_URL = 'https://t.me/vamonny';

export function ContactsPage() {
  const { lang, t } = useLanguage();
  const { playClick, playHover, playSuccess, playMorph, playIntroReveal } = useSound();
  const scrollVel = useRubberScroll(0.05);

  const [copiedField, setCopiedField] = useState<'email' | 'tg' | 'brief' | null>(null);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [selectedScopes, setSelectedScopes] = useState<string[]>(['uiux']);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const scopes = [
    { id: 'uiux', label: t(translations.works.categories.uiux) },
    { id: 'branding', label: t(translations.works.categories.branding) },
    { id: 'identity', label: t(translations.works.categories.identity) },
    { id: 'logo', label: t(translations.works.categories.logo) },
    { id: 'graphic', label: t(translations.works.categories.graphic) },
    { id: 'motion3d', label: t(translations.works.categories.motion3d) },
  ];

  const handleCopy = (val: string, field: 'email' | 'tg' | 'brief') => {
    playClick();
    navigator.clipboard?.writeText(val).catch(() => {});
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const toggleScope = (id: string) => {
    playMorph();
    setSelectedScopes((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((s) => s !== id) : prev) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedContact = contact.trim();
    const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedContact);
    const looksLikeTelegram = /^@?[a-zA-Z0-9_]{4,}$/.test(trimmedContact);

    if (!name.trim() || (!looksLikeEmail && !looksLikeTelegram) || message.trim().length < 4) {
      setError(t(translations.contacts.form.validationError));
      return;
    }
    setError('');
    playSuccess();
    setSubmitted(true);
  };

  const selectedScopeLabels = selectedScopes
    .map((id) => scopes.find((s) => s.id === id)?.label || id)
    .join(', ');

  const briefText =
    lang === 'ru'
      ? `Привет, Кирилл!\nИмя / компания: ${name.trim()}\nКонтакт: ${contact.trim()}\nНаправление: ${selectedScopeLabels}\n\nЗадача:\n${message.trim()}`
      : `Hi Kirill!\nName / Studio: ${name.trim()}\nContact: ${contact.trim()}\nDisciplines: ${selectedScopeLabels}\n\nBrief:\n${message.trim()}`;

  const mailtoHref = `mailto:${EMAIL}?subject=${encodeURIComponent(
    lang === 'ru' ? `Запрос на проект — ${name.trim()}` : `Project Inquiry — ${name.trim()}`
  )}&body=${encodeURIComponent(briefText)}`;

  const telegramHref = `${TELEGRAM_URL}?text=${encodeURIComponent(briefText)}`;

  const rubberTilt = Math.max(-4, Math.min(4, scrollVel * 2.5));

  return (
    <div className="bg-[#EFEFE9] dark:bg-[#0C0C0F] text-[#0B0B0B] dark:text-[#EFEFE9] min-h-screen pt-20 sm:pt-24 pb-24 px-4 sm:px-7 transition-colors duration-300 overflow-x-hidden">
      <div className="max-w-[1440px] mx-auto">
        <div className="pb-4 border-b border-[#0B0B0B]/15 dark:border-white/15 flex items-center justify-between pr-14">
          <span className="font-mono-tabular text-[11px] uppercase tracking-[0.2em] text-[#D61914] dark:text-[#E7FA53]">
            <ScrambleText
              text={t(translations.contacts.eyebrow)}
              triggerKey={`contacts-eye-${lang}`}
              duration={360}
            />
          </span>
          <span className="font-serif-editorial italic text-[13px] text-[#0B0B0B]/65 dark:text-[#EFEFE9]/65">
            {lang === 'ru' ? 'Нижний Новгород · RU / EN' : 'Nizhny Novgorod · RU / EN'}
          </span>
        </div>

        <RubberBlock immediate skewFactor={0.65} driftFactor={6} className="pt-8 sm:pt-12 pb-10 border-b border-[#0B0B0B]/15 dark:border-white/15">
          <h1 className="font-display font-extrabold uppercase tracking-[-0.042em] leading-[0.95] text-[clamp(2rem,4.4vw,4rem)] max-w-5xl mb-6 text-balance-safe">
            {lang === 'ru' ? (
              <>
                <RubberText text="Обсудим задачу" stretchStrength={0.95} />{' '}
                <span className="font-serif-editorial italic font-semibold lowercase tracking-[-0.02em] text-[#D61914] dark:text-[#E7FA53]">
                  <RubberText text="и сделаем чисто" stretchStrength={0.95} />
                </span>
              </>
            ) : (
              <>
                <RubberText text="Let’s build something" stretchStrength={0.95} />{' '}
                <span className="font-serif-editorial italic font-semibold lowercase tracking-[-0.02em] text-[#D61914] dark:text-[#E7FA53]">
                  <RubberText text="clean & sharp" stretchStrength={0.95} />
                </span>
              </>
            )}
          </h1>
          <RubberWords
            text={t(translations.contacts.lead)}
            elasticity={0.95}
            className="font-sans-body text-base sm:text-[20px] leading-[1.32] tracking-[-0.02em] text-[#0B0B0B]/88 dark:text-[#EFEFE9]/88 max-w-[46ch]"
          />
        </RubberBlock>

        <div className="pt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Direct Channels — Editorial Hairline Specimens */}
          <div
            style={{
              transform: `skewY(${(rubberTilt * 0.38).toFixed(2)}deg)`,
            }}
            className="lg:col-span-5 space-y-10 will-change-transform"
          >
            <div>
              <h2 className="font-mono-tabular text-[11px] uppercase tracking-[0.2em] text-[#D61914] dark:text-[#E7FA53] mb-4">
                {t(translations.contacts.directChannels)}
              </h2>

              <div className="divide-y divide-[#0B0B0B]/15 dark:divide-white/15 border-y border-[#0B0B0B]/15 dark:border-white/15">
                <div className="py-5 flex items-end justify-between gap-4 group">
                  <div className="min-w-0">
                    <p className="font-serif-editorial italic text-xs text-[#0B0B0B]/60 dark:text-[#EFEFE9]/60 mb-1">
                      01 · Telegram
                    </p>
                    <a
                      href={TELEGRAM_URL}
                      target="_blank"
                      rel="noreferrer"
                      onMouseEnter={() => playHover()}
                      className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-[-0.03em] hover:text-[#D61914] dark:hover:text-[#E7FA53] transition-all duration-300 group-hover:translate-x-1 truncate block"
                    >
                      {TELEGRAM}
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(TELEGRAM, 'tg')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#0B0B0B]/20 dark:border-white/20 hover:bg-[#0B0B0B] dark:hover:bg-[#E7FA53] hover:text-[#EFEFE9] dark:hover:text-[#0B0B0B] font-mono-tabular text-[11px] uppercase tracking-wider transition-colors whitespace-nowrap shrink-0"
                  >
                    {copiedField === 'tg' ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>{t(translations.contacts.copied)}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{t(translations.contacts.copy)}</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="py-5 flex items-end justify-between gap-4 group">
                  <div className="min-w-0">
                    <p className="font-serif-editorial italic text-xs text-[#0B0B0B]/60 dark:text-[#EFEFE9]/60 mb-1">
                      02 · Email
                    </p>
                    <a
                      href={`mailto:${EMAIL}`}
                      onMouseEnter={() => playHover()}
                      className="font-display text-lg sm:text-2xl font-extrabold uppercase tracking-[-0.03em] hover:text-[#D61914] dark:hover:text-[#E7FA53] transition-all duration-300 group-hover:translate-x-1 truncate block"
                    >
                      {EMAIL}
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(EMAIL, 'email')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#0B0B0B]/20 dark:border-white/20 hover:bg-[#0B0B0B] dark:hover:bg-[#E7FA53] hover:text-[#EFEFE9] dark:hover:text-[#0B0B0B] font-mono-tabular text-[11px] uppercase tracking-wider transition-colors whitespace-nowrap shrink-0"
                  >
                    {copiedField === 'email' ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>{t(translations.contacts.copied)}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{t(translations.contacts.copy)}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-mono-tabular text-[11px] uppercase tracking-[0.2em] text-[#D61914] dark:text-[#E7FA53] mb-3">
                {t(translations.contacts.socialsTitle)}
              </h2>
              <div className="divide-y divide-[#0B0B0B]/12 dark:divide-white/12 border-y border-[#0B0B0B]/12 dark:border-white/12">
                <a
                  href={TELEGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={() => playHover()}
                  className="py-3.5 flex items-center justify-between group hover:text-[#D61914] dark:hover:text-[#E7FA53] transition-colors"
                >
                  <span className="font-display text-lg uppercase font-bold">
                    <ScrambleText text="Telegram · @vamonny" triggerOnHover duration={260} />
                  </span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </a>
                <a
                  href={`mailto:${EMAIL}`}
                  onMouseEnter={() => playHover()}
                  className="py-3.5 flex items-center justify-between group hover:text-[#D61914] dark:hover:text-[#E7FA53] transition-colors"
                >
                  <span className="font-display text-lg uppercase font-bold">
                    <ScrambleText text="Email · vamonny06@gmail.com" triggerOnHover duration={260} />
                  </span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </a>
                <div className="py-3.5 flex items-center justify-between gap-4 text-xs text-[#0B0B0B]/70 dark:text-[#EFEFE9]/65">
                  <span className="font-serif-editorial italic text-sm">
                    {lang === 'ru' ? 'Формат работы' : 'Availability'}
                  </span>
                  <span className="text-right font-mono-tabular uppercase text-[#0B0B0B] dark:text-[#EFEFE9]">
                    {lang === 'ru'
                      ? 'Заказы · Команды · Студия (Удалённо / НН)'
                      : 'Commissions · Teams · Studio (Remote / NN)'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Inquiry Form */}
          <div
            style={{
              transform: `skewY(${(-rubberTilt * 0.34).toFixed(2)}deg)`,
            }}
            className="lg:col-span-7 rounded-[20px] liquid-glass-dark text-[#EFEFE9] p-6 sm:p-10 will-change-transform"
          >
            <div className="flex items-center justify-between gap-4 mb-8 pb-5 border-b border-white/12">
              <div>
                <p className="font-serif-editorial italic text-xs text-[#E7FA53] mb-1">
                  {lang === 'ru' ? 'Бриф и обсуждение' : 'Project Brief'}
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-[-0.03em]">
                  {t(translations.contacts.form.title)}
                </h2>
              </div>
              <div
                title={lang === 'ru' ? 'Нажмите, чтобы повторить' : 'Click to replay'}
                className="w-20 h-20 rounded-[14px] overflow-hidden shrink-0 border border-white/10"
              >
                <GlassIconReveal
                  logo={KOVALEV_K_SVG}
                  label="Kirill Kovalev Seal"
                  look="dark"
                  background="#121215"
                  plateColor="#1a1a1f"
                  logoColor="#E7FA53"
                  iconPlate
                  tileSize={64}
                  logoScale={0.7}
                  finalScale={0.84}
                  loop
                  hold={3.0}
                  speed={1.2}
                  onClick={() => {
                    if (!playIntroReveal()) playMorph();
                  }}
                  className="w-full h-full"
                />
              </div>
            </div>

            {submitted ? (
              <div className="py-6 space-y-6">
                <div className="w-11 h-11 bg-[#E7FA53] text-[#0B0B0B] flex items-center justify-center">
                  <Check className="w-5 h-5" />
                </div>
                <h3 className="font-display text-2xl font-bold uppercase">
                  {t(translations.contacts.form.successTitle)}
                </h3>
                <p className="text-base text-[#EFEFE9]/80 leading-relaxed max-w-lg">
                  {t(translations.contacts.form.successBody)}
                </p>

                <pre className="p-4 bg-[#141418] border border-[#EFEFE9]/15 text-xs font-mono-tabular text-[#EFEFE9]/80 whitespace-pre-wrap leading-relaxed">
                  {briefText}
                </pre>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <a
                    href={telegramHref}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => playClick()}
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#E7FA53] text-[#0B0B0B] hover:bg-[#D61914] hover:text-[#EFEFE9] text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{t(translations.contacts.form.openTelegram)}</span>
                  </a>
                  <a
                    href={mailtoHref}
                    onClick={() => playClick()}
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#EFEFE9] text-[#0B0B0B] hover:bg-[#D61914] hover:text-[#EFEFE9] text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    <span>{t(translations.contacts.form.openMail)}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopy(briefText, 'brief')}
                    className="inline-flex items-center gap-2 px-5 py-3.5 border border-[#EFEFE9]/25 text-xs font-semibold uppercase tracking-wider hover:border-[#EFEFE9] transition-colors"
                  >
                    {copiedField === 'brief' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#E7FA53]" />
                        <span>{t(translations.contacts.form.copiedBrief)}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{t(translations.contacts.form.copyBrief)}</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playClick();
                      setSubmitted(false);
                      setName('');
                      setContact('');
                      setMessage('');
                    }}
                    className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#EFEFE9]/65 hover:text-[#EFEFE9] transition-colors"
                  >
                    {t(translations.contacts.form.sendAnother)}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="flex items-baseline gap-2 text-xs text-[#EFEFE9]/75 mb-2"
                    >
                      <span className="font-serif-editorial italic text-[#E7FA53]">01.</span>
                      <span>{t(translations.contacts.form.name)}</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder={lang === 'ru' ? 'Александр / Studio' : 'Alex / Studio'}
                      className="w-full px-0 py-3 bg-transparent border-b border-[#EFEFE9]/25 text-sm sm:text-base text-[#EFEFE9] placeholder:text-[#EFEFE9]/30 focus:border-[#E7FA53] outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="flex items-baseline gap-2 text-xs text-[#EFEFE9]/75 mb-2"
                    >
                      <span className="font-serif-editorial italic text-[#E7FA53]">02.</span>
                      <span>{t(translations.contacts.form.email)}</span>
                    </label>
                    <input
                      id="contact-email"
                      type="text"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      required
                      placeholder="name@company.com / @telegram"
                      className="w-full px-0 py-3 bg-transparent border-b border-[#EFEFE9]/25 text-sm sm:text-base text-[#EFEFE9] placeholder:text-[#EFEFE9]/30 focus:border-[#E7FA53] outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <span className="flex items-baseline gap-2 text-xs text-[#EFEFE9]/75 mb-3">
                    <span className="font-serif-editorial italic text-[#E7FA53]">03.</span>
                    <span>{t(translations.contacts.form.scopeLabel)}</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {scopes.map((sc) => {
                      const active = selectedScopes.includes(sc.id);
                      return (
                        <button
                          key={sc.id}
                          type="button"
                          onClick={() => toggleScope(sc.id)}
                          aria-pressed={active}
                          className={`px-3.5 py-2 text-xs font-medium border transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-105 whitespace-nowrap shrink-0 ${
                            active
                              ? 'bg-[#E7FA53] text-[#0B0B0B] border-[#E7FA53] font-bold'
                              : 'bg-transparent text-[#EFEFE9]/75 border-[#EFEFE9]/20 hover:border-[#EFEFE9]'
                          }`}
                        >
                          {sc.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="flex items-baseline gap-2 text-xs text-[#EFEFE9]/75 mb-2"
                  >
                    <span className="font-serif-editorial italic text-[#E7FA53]">04.</span>
                    <span>{t(translations.contacts.form.message)}</span>
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="w-full px-0 py-3 bg-transparent border-b border-[#EFEFE9]/25 text-sm sm:text-base text-[#EFEFE9] placeholder:text-[#EFEFE9]/30 focus:border-[#E7FA53] outline-none resize-y transition-colors"
                  />
                </div>

                {error && (
                  <p role="alert" className="text-xs font-semibold text-[#E7FA53]">
                    {error}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-3 px-7 py-4 bg-[#E7FA53] text-[#0B0B0B] hover:bg-[#D61914] hover:text-[#EFEFE9] text-xs font-bold uppercase tracking-wider transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-[1.03]"
                  >
                    <Send className="w-4 h-4" />
                    <span>{t(translations.contacts.form.submit)}</span>
                  </button>
                  <span className="font-mono-tabular text-[11px] uppercase tracking-[0.12em] text-[#EFEFE9]/55">
                    Telegram (@vamonny) + Email
                  </span>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
