import { runnerMessages } from './messages';
import { DEFAULT_TIMEOUT_MS, type RunRequest, type RunResult } from './types';

export interface WorkerLike {
  postMessage(message: unknown): void;
  terminate(): void;
  onmessage: ((event: MessageEvent) => void) | null;
  onerror: ((event: ErrorEvent) => void) | null;
}

export type CreateWorker = () => WorkerLike;

export const createRunnerWorker: CreateWorker = () =>
  new Worker(new URL('./runner.worker.ts', import.meta.url), { type: 'module' });

/**
 * Runs the user code in a fresh worker. If it does not answer in time, terminates it and
 * reports every test as failed by timeout.
 */
export function runInWorker(request: RunRequest, createWorker?: CreateWorker): Promise<RunResult> {
  const timeoutMs = request.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const m = runnerMessages[request.locale ?? 'en'];
  const started = performance.now();

  return new Promise((resolve) => {
    const worker = (createWorker ?? createRunnerWorker)();
    let settled = false;
    const finish = (result: RunResult) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      worker.terminate();
      resolve(result);
    };

    const failAll = (message: string, timedOut = false): RunResult => ({
      results: request.tests.map((t) => ({
        name: t.name,
        passed: false,
        kind: 'test',
        error: message,
      })),
      logs: [],
      durationMs: Math.round(performance.now() - started),
      timedOut,
    });

    const timer = setTimeout(() => finish(failAll(m.timeout, true)), timeoutMs);

    worker.onmessage = (event) => finish(event.data as RunResult);
    worker.onerror = (event) => {
      event.preventDefault?.();
      finish(failAll(m.runnerError(event.message ?? 'unknown')));
    };
    worker.postMessage(request);
  });
}
