import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { useDocumentTitle } from '@/lib/useDocumentTitle';

/** Sonar with no echo: nothing at this depth. */
const EmptySonar = () => {
  return (
    <svg viewBox="0 0 160 160" aria-hidden className="size-40">
      {[70, 52, 34].map((r, i) => (
        <circle
          key={r}
          cx="80"
          cy="80"
          r={r}
          fill="none"
          stroke="var(--color-line)"
          strokeWidth="1.5"
          strokeDasharray={i === 0 ? '4 6' : undefined}
        />
      ))}
      <line
        x1="80"
        y1="80"
        x2="80"
        y2="10"
        stroke="var(--color-lagoon)"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 80 80"
          to="360 80 80"
          dur="4s"
          repeatCount="indefinite"
        />
      </line>
      <circle cx="80" cy="80" r="4" fill="var(--color-biolum)" />
    </svg>
  );
};

export const NotFoundPage = () => {
  useDocumentTitle('Página no encontrada');
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center">
      <EmptySonar />
      <p className="mt-6 font-mono text-sm text-kelp">404 m · el sonar no encuentra nada</p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight">Esta página no existe</h1>
      <p className="mt-2 text-kelp">
        Bajaste más de la cuenta. Volvé a la superficie y retomá desde el catálogo, o buscá un
        patrón con <kbd className="font-mono">⌘K</kbd>.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        <Button asChild variant="primary">
          <Link to="/">Volver al catálogo</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link to="/playground">Ir al playground</Link>
        </Button>
      </div>
    </div>
  );
};
