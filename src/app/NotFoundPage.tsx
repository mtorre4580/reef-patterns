import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { useDocumentTitle } from '@/lib/useDocumentTitle';

export function NotFoundPage() {
  useDocumentTitle('Página no encontrada');
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <p className="font-mono text-sm text-kelp">404 m · fuera del mapa</p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight">Esta página no existe</h1>
      <p className="mt-2 text-kelp">Volvé a la superficie y retomá desde el catálogo.</p>
      <Button asChild variant="primary" className="mt-8">
        <Link to="/">Ir al catálogo</Link>
      </Button>
    </div>
  );
}
