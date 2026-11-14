import { Languages } from 'lucide-react';
import { useI18n } from './I18nProvider';
import { isLocale, locales } from './locales';

/** Native select: keyboard and screen-reader friendly out of the box. */
export const LanguageSwitcher = () => {
  const { locale, setLocale, t } = useI18n();
  return (
    <label className="relative inline-flex h-9 items-center gap-1.5 rounded-control px-2 text-sm text-kelp hover:bg-reef hover:text-foam">
      <Languages aria-hidden className="size-4" />
      <span className="sr-only">{t('nav.language')}</span>
      <span aria-hidden className="font-mono text-xs">
        {locales.find((l) => l.id === locale)?.short}
      </span>
      <select
        value={locale}
        onChange={(e) => isLocale(e.target.value) && setLocale(e.target.value)}
        className="absolute inset-0 cursor-pointer opacity-0"
      >
        {locales.map((l) => (
          <option key={l.id} value={l.id} lang={l.id}>
            {l.label}
          </option>
        ))}
      </select>
    </label>
  );
};
