import { Play, RotateCcw } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import type { Challenge, Pattern } from '@/content/types';
import { useTheme } from '@/app/ThemeProvider';
import { Button } from '@/components/ui/button';
import { Kbd } from '@/components/ui/kbd';
import { useDocumentTitle } from '@/lib/useDocumentTitle';
import { cn } from '@/lib/utils';
import { ChallengeBrief } from './ChallengeBrief';
import { CodeEditor } from './CodeEditor';
import { HintsAndSolution } from './HintsAndSolution';
import { resolveChallenge } from './resolveChallenge';
import { ResultsPanel } from './ResultsPanel';
import { useDraft } from './useDraft';
import { useRunner } from './useRunner';

type MobileTab = 'brief' | 'code' | 'results';

const mobileTabs: { id: MobileTab; label: string }[] = [
  { id: 'brief', label: 'Enunciado' },
  { id: 'code', label: 'Código' },
  { id: 'results', label: 'Resultados' },
];

export function PlaygroundPage() {
  const [params] = useSearchParams();
  const resolution = resolveChallenge(params);
  useDocumentTitle(
    resolution.kind === 'challenge' ? `${resolution.challenge.title} · Playground` : 'Playground',
  );

  if (resolution.kind === 'no-challenges') {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Playground</h1>
        <p className="mt-3 text-kelp">
          {resolution.pattern
            ? `Todavía no hay challenges para ${resolution.pattern.name}. Estamos sumando más.`
            : 'Todavía no hay challenges cargados.'}
        </p>
        <Button asChild variant="primary" className="mt-8">
          <Link to="/playground">Ver otro challenge</Link>
        </Button>
      </div>
    );
  }

  return (
    <Workspace
      key={resolution.challenge.id}
      challenge={resolution.challenge}
      pattern={resolution.pattern}
    />
  );
}

function Workspace({ challenge, pattern }: { challenge: Challenge; pattern: Pattern }) {
  const { theme } = useTheme();
  const { code, setCode, reset } = useDraft(challenge);
  const runner = useRunner();
  const [mobileTab, setMobileTab] = useState<MobileTab>('brief');

  const run = useCallback(() => {
    setMobileTab((t) => (t === 'code' ? 'results' : t));
    void runner.run(challenge, code);
  }, [runner, challenge, code]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && !e.defaultPrevented) {
        e.preventDefault();
        run();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [run]);

  const panel = (tab: MobileTab) => cn(mobileTab !== tab && 'max-lg:hidden');

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] flex-col">
      <div
        role="tablist"
        aria-label="Secciones del playground"
        className="flex border-b border-line px-2 lg:hidden"
      >
        {mobileTabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={mobileTab === t.id}
            aria-controls={`panel-${t.id}`}
            onClick={() => setMobileTab(t.id)}
            className={cn(
              '-mb-px h-11 flex-1 border-b-2 text-sm',
              mobileTab === t.id ? 'border-biolum text-foam' : 'border-transparent text-kelp',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="flex min-h-0 flex-col lg:border-r lg:border-line">
          <section
            id="panel-brief"
            aria-label="Enunciado"
            className={cn(
              'overflow-y-auto p-4 sm:p-6 lg:max-h-[38%] lg:border-b lg:border-line',
              panel('brief'),
            )}
          >
            <ChallengeBrief challenge={challenge} pattern={pattern} />
          </section>

          <section
            id="panel-code"
            aria-label="Código"
            className={cn('flex min-h-0 flex-1 flex-col', panel('code'))}
          >
            <div className="min-h-[240px] flex-1 bg-trench">
              <CodeEditor
                value={code}
                onChange={setCode}
                onRun={run}
                theme={theme}
                label={`Editor de código para ${challenge.title}`}
              />
            </div>
            <div className="flex items-center gap-2 border-t border-line p-3">
              <Button variant="ghost" size="sm" onClick={() => (reset(), runner.clear())}>
                <RotateCcw aria-hidden /> Reiniciar
              </Button>
              <span className="ml-auto hidden text-xs text-kelp sm:inline">
                <Kbd>⌘/Ctrl</Kbd> + <Kbd>↵</Kbd>
              </span>
              <Button
                variant="primary"
                size="sm"
                onClick={run}
                disabled={runner.status === 'running'}
              >
                <Play aria-hidden /> Ejecutar tests
              </Button>
            </div>
          </section>
        </div>

        <section
          id="panel-results"
          aria-label="Resultados"
          className={cn('flex min-h-0 flex-col overflow-y-auto bg-trench/40', panel('results'))}
        >
          <ResultsPanel
            status={runner.status}
            result={runner.result}
            testNames={challenge.tests.map((t) => t.name)}
          />
          <HintsAndSolution challenge={challenge} onUseSolution={setCode} />
        </section>
      </div>
    </div>
  );
}
