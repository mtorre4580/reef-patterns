import { useCallback, useRef, useState } from 'react';
import type { Challenge } from '@/content/types';
import { runInWorker, type CreateWorker, type RunResult } from '@/lib/runner';

export type RunStatus = 'idle' | 'running' | 'done';

export function useRunner(createWorker?: CreateWorker) {
  const [status, setStatus] = useState<RunStatus>('idle');
  const [result, setResult] = useState<RunResult | null>(null);
  const runId = useRef(0);

  const run = useCallback(
    async (challenge: Challenge, code: string) => {
      const id = ++runId.current;
      setStatus('running');
      const next = await runInWorker(
        { code, tests: challenge.tests, checks: challenge.checks },
        createWorker,
      );
      if (id !== runId.current) return null; // una ejecución más nueva ganó
      setResult(next);
      setStatus('done');
      return next;
    },
    [createWorker],
  );

  const clear = useCallback(() => {
    runId.current++;
    setStatus('idle');
    setResult(null);
  }, []);

  return { status, result, run, clear };
}
