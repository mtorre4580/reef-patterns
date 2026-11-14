import Editor, { loader, type OnMount } from '@monaco-editor/react';
import * as monaco from 'monaco-editor/editor/editor.api';
import 'monaco-editor/languages/definitions/javascript/register';
import {
  javascriptDefaults,
  ScriptTarget,
} from 'monaco-editor/languages/features/typescript/register';
import EditorWorker from 'monaco-editor/editor/editor.worker?worker';
import TsWorker from 'monaco-editor/languages/features/typescript/ts.worker?worker';
import { useEffect, useRef } from 'react';
import { monacoThemes } from '@/lib/editor-theme';
import type { CodeEditorProps } from './editor-types';

// Monaco local (sin CDN) con sus workers empaquetados por Vite
self.MonacoEnvironment = {
  getWorker(_id: string, label: string) {
    if (label === 'typescript' || label === 'javascript') return new TsWorker();
    return new EditorWorker();
  },
};
loader.config({ monaco });

javascriptDefaults.setCompilerOptions({
  target: ScriptTarget.ESNext,
  allowNonTsExtensions: true,
  checkJs: false,
  lib: ['es2023'],
});
javascriptDefaults.setDiagnosticsOptions({ noSemanticValidation: true, noSyntaxValidation: false });

monaco.editor.defineTheme(
  'abyss-reef-dark',
  monacoThemes.dark as monaco.editor.IStandaloneThemeData,
);
monaco.editor.defineTheme(
  'abyss-reef-light',
  monacoThemes.light as monaco.editor.IStandaloneThemeData,
);

/** Editor Monaco. Export por defecto porque se carga con React.lazy. */
export default function MonacoEditor({ value, onChange, onRun, theme, label }: CodeEditorProps) {
  const runRef = useRef(onRun);
  useEffect(() => {
    runRef.current = onRun;
  }, [onRun]);

  const handleMount: OnMount = (editor) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => runRef.current());
    editor.getDomNode()?.querySelector('textarea')?.setAttribute('aria-label', label);
  };

  return (
    <Editor
      language="javascript"
      value={value}
      onChange={(v) => onChange(v ?? '')}
      onMount={handleMount}
      theme={theme === 'dark' ? 'abyss-reef-dark' : 'abyss-reef-light'}
      loading={<p className="p-4 text-sm text-kelp">Cargando editor…</p>}
      options={{
        fontFamily: "'Geist Mono Variable', ui-monospace, Menlo, monospace",
        fontSize: 13.5,
        lineHeight: 21,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        tabSize: 2,
        padding: { top: 12, bottom: 12 },
        automaticLayout: true,
        accessibilitySupport: 'auto',
        renderLineHighlight: 'line',
        fixedOverflowWidgets: true,
      }}
    />
  );
}
