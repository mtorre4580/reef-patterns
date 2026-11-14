import { useDocumentTitle } from '@/lib/useDocumentTitle';

export function PlaygroundPlaceholder() {
  useDocumentTitle('Playground');
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Playground</h1>
      <p className="mt-2 text-kelp">Muy pronto vas a poder practicar cada patrón acá.</p>
    </div>
  );
}
