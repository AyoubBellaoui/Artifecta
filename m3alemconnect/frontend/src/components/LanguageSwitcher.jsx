import { LANGUAGES, useI18n } from '../i18n/I18nProvider';

export default function LanguageSwitcher({ tone = 'light', className = '' }) {
  const { lang, setLang, t } = useI18n();
  const onDark = tone === 'dark';

  return (
    <div
      role="group"
      aria-label={t('nav.language')}
      className={`inline-flex items-center rounded-md border p-0.5 ${onDark ? 'border-white/20' : 'border-sand-300 bg-white'} ${className}`}
    >
      {LANGUAGES.map((language) => {
        const active = language.code === lang;
        const colors = active
          ? onDark
            ? 'bg-white text-navy-900'
            : 'bg-navy text-white'
          : onDark
            ? 'text-white/70 hover:text-white'
            : 'text-sand-600 hover:text-navy-900';
        return (
          <button
            key={language.code}
            type="button"
            lang={language.code}
            title={language.label}
            aria-pressed={active}
            onClick={() => setLang(language.code)}
            className={`h-7 min-w-[2.5rem] rounded px-2 text-xs font-semibold transition-colors ${colors}`}
          >
            {language.short}
          </button>
        );
      })}
    </div>
  );
}
