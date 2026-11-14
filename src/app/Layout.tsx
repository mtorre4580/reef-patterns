import { Search } from 'lucide-react';
import { NavLink, Outlet, ScrollRestoration } from 'react-router';
import { CommandPaletteProvider, useCommandPalette } from '@/features/catalog';
import { ProgressProvider } from '@/features/progress';
import { Kbd } from '@/components/ui/kbd';
import { scrollToId } from '@/lib/scrollToId';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSwitcher, useI18n } from '@/i18n';

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

const SearchButton = () => {
  const { open } = useCommandPalette();
  const { t } = useI18n();
  return (
    <button
      type="button"
      onClick={open}
      className="inline-flex h-9 items-center gap-2 rounded-control border border-line bg-trench px-3 text-sm text-kelp transition-colors hover:text-foam"
    >
      <Search aria-hidden className="size-4" />
      <span className="hidden sm:inline">{t('nav.search')}</span>
      <span className="sr-only sm:hidden">{t('nav.searchPatterns')}</span>
      <Kbd className="hidden sm:inline-flex">{isMac ? '⌘K' : 'Ctrl K'}</Kbd>
    </button>
  );
};

const navClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'rounded-control px-2 py-1 text-sm transition-colors',
    isActive ? 'text-foam' : 'text-kelp hover:text-foam',
  );

const Header = () => {
  const { t } = useI18n();
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-abyss/85 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4 sm:gap-4 sm:px-6">
        <NavLink
          to="/"
          aria-label={t('nav.home')}
          className="flex shrink-0 items-center gap-2 font-semibold tracking-tight"
        >
          <svg aria-hidden viewBox="0 0 32 32" className="size-6">
            <path
              d="M6 20c3-3 5-3 8 0s5 3 8 0 4-3 4-3"
              fill="none"
              stroke="var(--color-lagoon)"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <circle cx="16" cy="11" r="3" fill="var(--color-biolum)" />
          </svg>
          <span className="hidden sm:inline">Reef Patterns</span>
        </NavLink>
        <nav aria-label={t('nav.main')} className="flex items-center gap-1">
          <NavLink to="/" end className={navClass}>
            {t('nav.catalog')}
          </NavLink>
          <NavLink to="/playground" className={navClass}>
            {t('nav.playground')}
          </NavLink>
        </nav>
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <SearchButton />
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export const Layout = () => {
  const { t } = useI18n();
  return (
    <ProgressProvider>
      <CommandPaletteProvider>
        <button
          type="button"
          onClick={() => scrollToId('contenido')}
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-control focus:bg-lagoon focus:px-3 focus:py-2 focus:text-lagoon-ink"
        >
          {t('nav.skipToContent')}
        </button>
        <Header />
        <main id="contenido" tabIndex={-1} className="outline-none">
          <Outlet />
        </main>
        <ScrollRestoration />
      </CommandPaletteProvider>
    </ProgressProvider>
  );
};
