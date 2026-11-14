import { Command } from 'cmdk';
import { Compass, Waves } from 'lucide-react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useNavigate } from 'react-router';
import { patterns } from '@/content';
import { categoryLabel } from '@/content/categories';
import { createPatternSearch } from '@/lib/search';

const search = createPatternSearch(patterns);

interface PaletteContextValue {
  open: () => void;
}

const PaletteContext = createContext<PaletteContextValue | null>(null);

export function useCommandPalette(): PaletteContextValue {
  const ctx = useContext(PaletteContext);
  if (!ctx) throw new Error('useCommandPalette debe usarse dentro de <CommandPaletteProvider>');
  return ctx;
}

/** ⌘K / Ctrl+K palette: ⌘K, type, Enter opens any pattern. */
export const CommandPaletteProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const results = useMemo(() => search.search(query).slice(0, 12), [query]);

  const go = useCallback(
    (to: string) => {
      setOpen(false);
      setQuery('');
      navigate(to, { viewTransition: true });
    },
    [navigate],
  );

  const ctx = useMemo(() => ({ open: () => setOpen(true) }), []);

  return (
    <PaletteContext.Provider value={ctx}>
      {children}
      <Command.Dialog
        open={isOpen}
        onOpenChange={setOpen}
        label="Buscar patrones"
        shouldFilter={false}
        overlayClassName="fixed inset-0 z-40 bg-abyss/70 backdrop-blur-sm"
        contentClassName="fixed top-[12vh] left-1/2 z-50 w-[min(36rem,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-panel border border-line bg-trench animate-fade-in"
      >
        <Command.Input
          value={query}
          onValueChange={setQuery}
          placeholder="Buscá un patrón…"
          className="h-12 w-full border-b border-line bg-transparent px-4 text-foam outline-none placeholder:text-kelp"
        />
        <Command.List className="max-h-[50vh] overflow-y-auto p-2">
          <Command.Empty className="px-3 py-6 text-center text-sm text-kelp">
            Sin resultados para “{query}”.
          </Command.Empty>
          <Command.Group
            heading="Patrones"
            className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:text-kelp"
          >
            {results.map((p) => (
              <Command.Item
                key={p.id}
                value={p.id}
                onSelect={() => go(`/patterns/${p.id}`)}
                className="flex cursor-pointer items-center gap-3 rounded-control px-3 py-2 text-sm text-foam data-[selected=true]:bg-reef"
              >
                <Compass aria-hidden className="size-4 text-kelp" />
                <span className="flex-1">
                  {p.name} <span className="text-kelp">· {p.nameEs}</span>
                </span>
                <span className="text-xs text-kelp">{categoryLabel(p.category)}</span>
              </Command.Item>
            ))}
          </Command.Group>
          <Command.Group
            heading="Acciones"
            className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:text-kelp"
          >
            <Command.Item
              value="ir-al-playground"
              onSelect={() => go('/playground')}
              className="flex cursor-pointer items-center gap-3 rounded-control px-3 py-2 text-sm text-foam data-[selected=true]:bg-reef"
            >
              <Waves aria-hidden className="size-4 text-kelp" /> Ir al playground
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command.Dialog>
    </PaletteContext.Provider>
  );
};
