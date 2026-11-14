import { useI18n } from '@/i18n';
import { lazy, Suspense } from 'react';
import type { CodeEditorProps } from './editor-types';

const MonacoEditor = lazy(() => import('./MonacoEditor'));

export const CodeEditor = (props: CodeEditorProps) => {
  const { t } = useI18n();
  return (
    <Suspense fallback={<p className="p-4 text-sm text-kelp">{t('playground.loadingEditor')}</p>}>
      <MonacoEditor {...props} />
    </Suspense>
  );
};
