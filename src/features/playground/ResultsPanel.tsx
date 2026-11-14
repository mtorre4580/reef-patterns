import { CheckCircle2, CircleDashed, Loader2, ShieldCheck, XCircle } from 'lucide-react';
import type { LogEntry, RunResult } from '@/lib/runner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import type { RunStatus } from './useRunner';

interface ResultsPanelProps {
  status: RunStatus;
  result: RunResult | null;
  testNames: string[];
}

const logColor: Record<LogEntry['level'], string> = {
  log: 'text-foam',
  info: 'text-biolum',
  warn: 'text-cat-creacional',
  error: 'text-coral',
};

function summary(status: RunStatus, result: RunResult | null, total: number) {
  if (status === 'running') return 'Ejecutando tests…';
  if (!result) return `${total} tests sin ejecutar. Probá con Ejecutar o ⌘/Ctrl + Enter.`;
  const passed = result.results.filter((r) => r.passed).length;
  const all = result.results.length;
  if (result.timedOut) return 'Tiempo agotado: ¿hay un bucle infinito?';
  return passed === all
    ? `¡Todo en verde! ${passed} de ${all} pasaron.`
    : `${passed} de ${all} pasaron.`;
}

export function ResultsPanel({ status, result, testNames }: ResultsPanelProps) {
  const passed = result?.results.filter((r) => r.passed).length ?? 0;
  const total = result?.results.length ?? testNames.length;
  const allGreen = !!result && passed === total && total > 0;

  return (
    <Tabs defaultValue="results" className="flex flex-col">
      <TabsList aria-label="Panel de salida" className="sticky top-0 z-[1] bg-trench">
        <TabsTrigger value="results">Resultados</TabsTrigger>
        <TabsTrigger value="console">
          Consola
          {!!result?.logs.length && (
            <span className="rounded bg-reef px-1.5 font-mono text-xs text-kelp">
              {result.logs.length}
            </span>
          )}
        </TabsTrigger>
        <span
          className={cn(
            'ml-auto font-mono text-xs tabular-nums',
            allGreen ? 'text-anemone' : 'text-kelp',
          )}
        >
          {result ? `${passed} de ${total} tests` : ''}
        </span>
      </TabsList>

      <TabsContent value="results" className="p-4">
        <p
          aria-live="polite"
          aria-atomic="true"
          className={cn('mb-4 text-sm', allGreen ? 'text-anemone' : 'text-kelp')}
        >
          {summary(status, result, testNames.length)}
        </p>
        <ul className="flex flex-col gap-2" aria-busy={status === 'running'}>
          {result
            ? result.results.map((r, i) => (
                <li
                  key={`${r.kind}-${i}`}
                  className="rounded-control border border-line bg-abyss/40 px-3 py-2 text-sm"
                >
                  <div className="flex items-start gap-2">
                    {r.passed ? (
                      <CheckCircle2 aria-hidden className="mt-0.5 size-4 shrink-0 text-anemone" />
                    ) : (
                      <XCircle aria-hidden className="mt-0.5 size-4 shrink-0 text-coral" />
                    )}
                    <span className="flex-1">
                      <span className="sr-only">{r.passed ? 'Aprobado: ' : 'Falló: '}</span>
                      {r.name}
                    </span>
                    {r.kind === 'check' && (
                      <span className="inline-flex items-center gap-1 text-xs text-kelp">
                        <ShieldCheck aria-hidden className="size-3.5" /> Regla
                      </span>
                    )}
                  </div>
                  {r.error && (
                    <p className="mt-1.5 pl-6 font-mono text-xs break-words text-coral">
                      {r.error}
                    </p>
                  )}
                </li>
              ))
            : testNames.map((name) => (
                <li
                  key={name}
                  className="flex items-start gap-2 rounded-control border border-line px-3 py-2 text-sm text-kelp"
                >
                  {status === 'running' ? (
                    <Loader2 aria-hidden className="mt-0.5 size-4 shrink-0 animate-spin" />
                  ) : (
                    <CircleDashed aria-hidden className="mt-0.5 size-4 shrink-0" />
                  )}
                  {name}
                </li>
              ))}
        </ul>
        {result && (
          <p className="mt-4 font-mono text-xs text-kelp">{Math.round(result.durationMs)} ms</p>
        )}
      </TabsContent>

      <TabsContent value="console" className="p-4">
        {result?.logs.length ? (
          <ol className="flex flex-col gap-1 font-mono text-xs">
            {result.logs.map((log, i) => (
              <li key={i} className={cn('break-words whitespace-pre-wrap', logColor[log.level])}>
                {log.level !== 'log' && <span className="text-kelp">[{log.level}] </span>}
                {log.args.join(' ')}
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-kelp">Lo que imprimas con console.log aparece acá.</p>
        )}
      </TabsContent>
    </Tabs>
  );
}
