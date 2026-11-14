import { CheckCircle2, CircleDashed, Loader2, ShieldCheck, XCircle } from 'lucide-react';
import type { LogEntry, RunResult } from '@/lib/runner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'motion/react';
import { Bunting } from '@/components/Bunting';
import { useI18n, type TranslationKey } from '@/i18n';
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

const summary = (
  t: (key: TranslationKey, params?: Record<string, string | number>) => string,
  status: RunStatus,
  result: RunResult | null,
  total: number,
): string => {
  if (status === 'running') return t('results.running');
  if (!result) return t('results.notRun', { count: total });
  const passed = result.results.filter((r) => r.passed).length;
  const all = result.results.length;
  if (result.timedOut) return t('results.timeout');
  return passed === all
    ? t('results.allGreen', { passed, total: all })
    : t('results.partial', { passed, total: all });
};

const woodTab =
  'text-on-wood-muted hover:text-on-wood data-[state=active]:border-brass data-[state=active]:text-on-wood';

export const ResultsPanel = ({ status, result, testNames }: ResultsPanelProps) => {
  const { t } = useI18n();
  const passed = result?.results.filter((r) => r.passed).length ?? 0;
  const total = result?.results.length ?? testNames.length;
  const allGreen = !!result && passed === total && total > 0;

  return (
    <Tabs defaultValue="results" className="flex flex-col">
      <TabsList aria-label={t('results.panel')} className="planks sticky top-0 z-[1] border-b-0">
        <TabsTrigger value="results" className={woodTab}>
          {t('results.results')}
        </TabsTrigger>
        <TabsTrigger value="console" className={woodTab}>
          {t('results.console')}
          {!!result?.logs.length && (
            <span className="brass rounded-full px-1.5 font-mono text-xs">
              {result.logs.length}
            </span>
          )}
        </TabsTrigger>
        <span
          className={cn(
            'ml-auto font-mono text-xs tabular-nums',
            allGreen ? 'text-brass' : 'text-on-wood-muted',
          )}
        >
          {result ? t('results.testsCount', { passed, total }) : ''}
        </span>
      </TabsList>

      <TabsContent value="results" className="p-4">
        {allGreen && status === 'done' && <Bunting />}
        <p
          aria-live="polite"
          aria-atomic="true"
          className={cn(
            'mb-4 text-sm',
            allGreen ? 'font-display text-xl text-anemone' : 'text-kelp',
          )}
        >
          {summary(t, status, result, testNames.length)}
        </p>
        <ul className="flex flex-col gap-2" aria-busy={status === 'running'}>
          {result
            ? result.results.map((r, i) => (
                <motion.li
                  key={`${r.kind}-${i}-${r.passed}-${r.error ?? ''}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.2 }}
                  className={cn(
                    'rounded-control border border-l-4 border-line bg-abyss/30 px-3 py-2 text-sm',
                    r.passed ? 'border-l-anemone' : 'border-l-coral',
                  )}
                >
                  <div className="flex items-start gap-2">
                    {r.passed ? (
                      <CheckCircle2 aria-hidden className="mt-0.5 size-4 shrink-0 text-anemone" />
                    ) : (
                      <XCircle aria-hidden className="mt-0.5 size-4 shrink-0 text-coral" />
                    )}
                    <span className="flex-1">
                      <span className="sr-only">
                        {r.passed ? t('results.passed') : t('results.failed')}
                      </span>
                      {r.name}
                    </span>
                    {r.kind === 'check' && (
                      <span className="inline-flex items-center gap-1 text-xs text-kelp">
                        <ShieldCheck aria-hidden className="size-3.5" /> {t('results.rule')}
                      </span>
                    )}
                  </div>
                  {r.error && (
                    <p className="mt-1.5 pl-6 font-mono text-xs break-words text-coral">
                      {r.error}
                    </p>
                  )}
                </motion.li>
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
          <p className="text-sm text-kelp">{t('results.consoleEmpty')}</p>
        )}
      </TabsContent>
    </Tabs>
  );
};
