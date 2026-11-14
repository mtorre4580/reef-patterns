import { lazy, Suspense } from 'react';
import type { CodeEditorProps } from './editor-types';

const MonacoEditor = lazy(() => import('./MonacoEditor'));

export const CodeEditor = (props: CodeEditorProps) => {
  return (
    <Suspense fallback={<p className="p-4 text-sm text-kelp">Cargando editor…</p>}>
      <MonacoEditor {...props} />
    </Suspense>
  );
};
