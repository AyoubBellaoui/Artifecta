import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import fr from './fr';
import ar from './ar';
import { normalizeKey } from './helpers';

const DICTIONARIES = { fr, ar };
const STORAGE_KEY = 'm3alem_lang';

export const LANGUAGES = [
  { code: 'fr', label: 'Français', short: 'FR', dir: 'ltr', locale: 'fr-MA' },
  { code: 'ar', label: 'العربية', short: 'عربي', dir: 'rtl', locale: 'ar-MA' },
];

function readInitialLang() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && DICTIONARIES[stored]) return stored;
  } catch {
    // Storage can be unavailable (private mode); fall back to French.
  }
  return 'fr';
}

function lookup(dictionary, key) {
  return key.split('.').reduce((node, part) => (node == null ? undefined : node[part]), dictionary);
}

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(readInitialLang);
  const language = LANGUAGES.find((l) => l.code === lang);
  const dictionary = DICTIONARIES[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = language.dir;
    document.title = dictionary.meta.title;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Ignore storage failures; the choice still applies for this visit.
    }
  }, [lang, language.dir, dictionary]);

  // Raw value (arrays/objects) with French as the fallback dictionary.
  const tm = useCallback((key) => lookup(dictionary, key) ?? lookup(fr, key), [dictionary]);

  const t = useCallback(
    (key, vars) => {
      let value = tm(key);
      if (value && typeof value === 'object' && !Array.isArray(value) && typeof vars?.count === 'number') {
        const category = new Intl.PluralRules(language.locale).select(vars.count);
        value = value[category] ?? value.other;
      }
      if (typeof value !== 'string') return key;
      if (!vars) return value;
      return value.replace(/\{(\w+)\}/g, (match, name) => {
        const replacement = vars[name];
        if (replacement === undefined) return match;
        return name === 'count' && typeof replacement === 'number'
          ? new Intl.NumberFormat(language.locale).format(replacement)
          : replacement;
      });
    },
    [tm, language.locale],
  );

  const formatNumber = useCallback(
    (value, options) => new Intl.NumberFormat(language.locale, options).format(Number(value) || 0),
    [language.locale],
  );

  const formatDate = useCallback(
    (value, options = { day: 'numeric', month: 'long', year: 'numeric' }) => {
      if (!value) return '';
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return '';
      return new Intl.DateTimeFormat(language.locale, options).format(date);
    },
    [language.locale],
  );

  const formatPrice = useCallback(
    (value) => t('common.price', { amount: formatNumber(value, { maximumFractionDigits: 0 }) }),
    [t, formatNumber],
  );

  const formatRating = useCallback(
    (value) => formatNumber(value, { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
    [formatNumber],
  );

  // Bilingual demo content is stored as { fr, ar }; API content is a plain string.
  const pick = useCallback(
    (value) => (value && typeof value === 'object' && !Array.isArray(value) ? value[lang] ?? value.fr : value),
    [lang],
  );

  const cityName = useCallback(
    (city) => (city ? lookup(dictionary, `cities.${normalizeKey(city)}`) || city : ''),
    [dictionary],
  );

  const categoryName = useCallback(
    (item) => {
      if (!item) return '';
      const slug = typeof item === 'string' ? item : item.slug || item.category_slug;
      const translated = slug && lookup(dictionary, `categories.${slug}.name`);
      if (translated) return translated;
      if (typeof item === 'string') return item;
      return (lang === 'ar' && item.name_ar) || item.name_fr || item.category_name || '';
    },
    [dictionary, lang],
  );

  const value = useMemo(
    () => ({
      lang,
      dir: language.dir,
      locale: language.locale,
      setLang,
      t,
      tm,
      formatNumber,
      formatDate,
      formatPrice,
      formatRating,
      pick,
      cityName,
      categoryName,
    }),
    [lang, language, t, tm, formatNumber, formatDate, formatPrice, formatRating, pick, cityName, categoryName],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within I18nProvider');
  return context;
}
