import { Search } from 'lucide-react';
import { NavLink, Outlet, ScrollRestoration } from 'react-router';
import { CommandPaletteProvider, useCommandPalette } from '@/features/catalog';
import { ProgressProvider } from '@/features/progress';
import { Kbd } from '@/components/ui/kbd';
import { scrollToId } from '@/lib/scrollToId';
import { cn } from '@/lib/utils';
import { ShipLogo } from '@/components/ShipLogo';
import { SoundToggle } from './SoundToggle';
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
      className="inline-flex h-9 items-center gap-2 rounded-control border border-brass/60 bg-black/20 px-3 text-sm text-on-wood-muted transition-colors hover:bg-black/30 hover:text-on-wood"
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
    'relative rounded-control px-2 py-1 text-sm transition-colors after:absolute after:inset-x-2 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-brass after:transition-transform after:duration-200',
    isActive
      ? 'text-on-wood after:scale-x-100'
      : 'text-on-wood-muted after:scale-x-0 hover:text-on-wood hover:after:scale-x-100',
  );

const Header = () => {
  const { t } = useI18n();
  return (
    <header className="sticky top-0 z-20">
      <div className="planks">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4 sm:gap-4 sm:px-6">
          <NavLink
            to="/"
            aria-label={t('nav.home')}
            className="group flex shrink-0 items-center gap-2 text-on-wood"
          >
            <ShipLogo className="size-7 transition-transform duration-500 group-hover:rotate-45" />
            <span className="hidden font-display text-xl sm:inline">Reef Patterns</span>
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
            <SoundToggle />
            <ThemeToggle />
          </div>
        </div>
      </div>
      <div aria-hidden className="rope h-[7px] rounded-none" />
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
