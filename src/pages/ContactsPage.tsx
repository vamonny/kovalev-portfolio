import React, { useState } from 'react';
import { Check, Copy, ArrowUpRight, Send } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSound } from '../context/SoundContext';
import { translations } from '../i18n/translations';
import { RubberBlock } from '../components/RubberMotion';
import { RubberText } from '../components/RubberText';

const EMAIL = 'vamonny06@gmail.com';
const TELEGRAM = '@vamonny';
const TELEGRAM_URL = 'https://t.me/vamonny';

export function ContactsPage() {
  const { lang, t } = useLanguage();
  const { playClick, playHover, playSuccess, playMorph } = useSound();

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
    lang === 'ru' ? `Запрос на проект: ${name.trim()}` : `Project inquiry: ${name.trim()}`
  )}&body=${encodeURIComponent(briefText)}`;

  const telegramHref = `${TELEGRAM_URL}?text=${encodeURIComponent(briefText)}`;

  return (
    <div className="bg-[#EFEFE9] dark:bg-[#0C0C0F] text-[#0B0B0B] dark:text-[#EFEFE9] min-h-screen pt-20 sm:pt-24 pb-20 px-4 sm:px-8 transition-colors duration-200 overflow-x-hidden">
      <div className="max-w-[1380px] mx-auto">
        <RubberBlock immediate skewFactor={0.65} driftFactor={6} className="pt-2 pb-10 border-b border-[#0B0B0B]/14 dark:border-white/14">
          <h1 className="font-display font-extrabold tracking-[-0.042em] leading-[0.95] text-[clamp(2.25rem,4.5vw,4.1rem)] max-w-4xl mb-5 text-balance-safe">
            <RubberText
              text={
                lang === 'ru'
                  ? 'Обсудим задачу и сделаем чисто'
                  : 'Let’s build something clean and sharp'
              }
              stretchStrength={0.85}
            />
          </h1>
          <p className="type-body text-[#0B0B0B]/80 dark:text-[#EFEFE9]/80 max-w-[60ch]">
            {t(translations.contacts.lead)}
          </p>
        </RubberBlock>

        <div className="pt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Direct Channels */}
          <RubberBlock immediate skewFactor={0.95} driftFactor={8} className="lg:col-span-5 space-y-10">
            <div>
              <h2 className="type-heading font-display font-bold mb-4">
                {t(translations.contacts.directChannels)}
              </h2>

              <div className="divide-y divide-[#0B0B0B]/14 dark:divide-white/14 border-y border-[#0B0B0B]/14 dark:border-white/14">
                <div className="py-5 flex items-end justify-between gap-4">
                  <div className="min-w-0">
                    <p className="type-sm text-[#0B0B0B]/60 dark:text-[#EFEFE9]/60 mb-1">
                      Telegram
                    </p>
                    <a
                      href={TELEGRAM_URL}
                      target="_blank"
                      rel="noreferrer"
                      onMouseEnter={() => playHover()}
                      className="type-heading font-display font-bold hover:text-[#D61914] dark:hover:text-[#E7FA53] transition-colors duration-150 truncate block"
                    >
                      {TELEGRAM}
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(TELEGRAM, 'tg')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#0B0B0B]/20 dark:border-white/20 hover:bg-[#0B0B0B] dark:hover:bg-[#E7FA53] hover:text-[#EFEFE9] dark:hover:text-[#0B0B0B] type-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 rounded-[5px]"
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

                <div className="py-5 flex items-end justify-between gap-4">
                  <div className="min-w-0">
                    <p className="type-sm text-[#0B0B0B]/60 dark:text-[#EFEFE9]/60 mb-1">
                      Email
                    </p>
                    <a
                      href={`mailto:${EMAIL}`}
                      onMouseEnter={() => playHover()}
                      className="type-heading font-display font-bold hover:text-[#D61914] dark:hover:text-[#E7FA53] transition-colors duration-150 truncate block"
                    >
                      {EMAIL}
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(EMAIL, 'email')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#0B0B0B]/20 dark:border-white/20 hover:bg-[#0B0B0B] dark:hover:bg-[#E7FA53] hover:text-[#EFEFE9] dark:hover:text-[#0B0B0B] type-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 rounded-[5px]"
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
              <h2 className="type-heading font-display font-bold mb-3">
                {t(translations.contacts.socialsTitle)}
              </h2>
              <div className="divide-y divide-[#0B0B0B]/12 dark:divide-white/12 border-y border-[#0B0B0B]/12 dark:border-white/12">
                <a
                  href={TELEGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={() => playHover()}
                  className="py-3.5 flex items-center justify-between hover:text-[#D61914] dark:hover:text-[#E7FA53] transition-colors duration-150"
                >
                  <span className="type-body font-semibold">Telegram · @vamonny</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
                <a
                  href={`mailto:${EMAIL}`}
                  onMouseEnter={() => playHover()}
                  className="py-3.5 flex items-center justify-between hover:text-[#D61914] dark:hover:text-[#E7FA53] transition-colors duration-150"
                >
                  <span className="type-body font-semibold">Email · vamonny06@gmail.com</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
                <div className="py-3.5 flex items-center justify-between gap-4 type-sm">
                  <span className="text-[#0B0B0B]/60 dark:text-[#EFEFE9]/60">
                    {lang === 'ru' ? 'Формат работы' : 'Availability'}
                  </span>
                  <span className="text-right font-medium text-[#0B0B0B] dark:text-[#EFEFE9]">
                    {lang === 'ru'
                      ? 'Заказы · Команды · Студия'
                      : 'Commissions · Teams · Studio'}
                  </span>
                </div>
              </div>
            </div>
          </RubberBlock>

          {/* Single-Surface Inquiry Form */}
          <RubberBlock immediate skewFactor={-0.95} driftFactor={-8} delay={0.05} className="lg:col-span-7 bg-[#141418] text-[#EFEFE9] rounded-[12px] p-6 sm:p-10 border border-white/12">
            <h2 className="type-heading font-display font-bold mb-6 pb-4 border-b border-white/12">
              {t(translations.contacts.form.title)}
            </h2>

            {submitted ? (
              <div className="py-4 space-y-6">
                <h3 className="type-heading font-display font-bold text-[#E7FA53]">
                  {t(translations.contacts.form.successTitle)}
                </h3>
                <p className="type-body text-[#EFEFE9]/82 max-w-[54ch]">
                  {t(translations.contacts.form.successBody)}
                </p>

                <pre className="p-4 bg-black/40 border border-white/15 type-sm text-[#EFEFE9]/85 whitespace-pre-wrap">
                  {briefText}
                </pre>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <a
                    href={telegramHref}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => playClick()}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#E7FA53] text-[#0B0B0B] hover:bg-white type-sm font-semibold rounded-[6px] transition-colors duration-150"
                  >
                    <Send className="w-4 h-4" />
                    <span>{t(translations.contacts.form.openTelegram)}</span>
                  </a>
                  <a
                    href={mailtoHref}
                    onClick={() => playClick()}
                    className="inline-flex items-center gap-2 px-5 py-3 border border-white/25 hover:border-white type-sm font-semibold rounded-[6px] transition-colors duration-150"
                  >
                    <span>{t(translations.contacts.form.openMail)}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopy(briefText, 'brief')}
                    className="inline-flex items-center gap-2 px-4 py-3 border border-white/25 hover:border-white type-sm font-medium rounded-[6px] transition-colors duration-150"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>
                      {copiedField === 'brief'
                        ? t(translations.contacts.form.copiedBrief)
                        : t(translations.contacts.form.copyBrief)}
                    </span>
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
                    className="px-3 py-3 type-sm text-white/65 hover:text-white transition-colors duration-150"
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
                      className="block type-sm text-[#EFEFE9]/75 mb-2"
                    >
                      {t(translations.contacts.form.name)}
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder={lang === 'ru' ? 'Александр / Studio' : 'Alex / Studio'}
                      className="w-full px-0 py-3 bg-transparent border-b border-[#EFEFE9]/25 type-body text-[#EFEFE9] placeholder:text-[#EFEFE9]/35 focus:border-[#E7FA53] outline-none transition-colors duration-150"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block type-sm text-[#EFEFE9]/75 mb-2"
                    >
                      {t(translations.contacts.form.email)}
                    </label>
                    <input
                      id="contact-email"
                      type="text"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      required
                      placeholder="name@company.com / @telegram"
                      className="w-full px-0 py-3 bg-transparent border-b border-[#EFEFE9]/25 type-body text-[#EFEFE9] placeholder:text-[#EFEFE9]/35 focus:border-[#E7FA53] outline-none transition-colors duration-150"
                    />
                  </div>
                </div>

                <div>
                  <span className="block type-sm text-[#EFEFE9]/75 mb-3">
                    {t(translations.contacts.form.scopeLabel)}
                  </span>
                  <div className="inline-flex flex-wrap gap-1.5 p-1.5 bg-white/[0.05] rounded-[8px]">
                    {scopes.map((sc) => {
                      const active = selectedScopes.includes(sc.id);
                      return (
                        <button
                          key={sc.id}
                          type="button"
                          onClick={() => toggleScope(sc.id)}
                          aria-pressed={active}
                          className={`px-3 py-1.5 rounded-[5px] type-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 ${
                            active
                              ? 'bg-[#E7FA53] text-[#0B0B0B] font-semibold'
                              : 'text-[#EFEFE9]/72 hover:text-white'
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
                    className="block type-sm text-[#EFEFE9]/75 mb-2"
                  >
                    {t(translations.contacts.form.message)}
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="w-full px-0 py-3 bg-transparent border-b border-[#EFEFE9]/25 type-body text-[#EFEFE9] placeholder:text-[#EFEFE9]/35 focus:border-[#E7FA53] outline-none resize-y transition-colors duration-150"
                  />
                </div>

                {error && (
                  <p role="alert" className="type-sm font-medium text-[#E7FA53]">
                    {error}
                  </p>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#E7FA53] text-[#0B0B0B] hover:bg-white type-sm font-semibold rounded-[6px] transition-colors duration-150"
                  >
                    <Send className="w-4 h-4" />
                    <span>{t(translations.contacts.form.submit)}</span>
                  </button>
                </div>
              </form>
            )}
          </RubberBlock>
        </div>
      </div>
    </div>
  );
}
