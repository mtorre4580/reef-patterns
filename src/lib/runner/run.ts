import { DEFAULT_TIMEOUT_MS, TIMEOUT_MESSAGE, type RunRequest, type RunResult } from './types';

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
 * Ejecuta el código del usuario en un worker nuevo. Si no responde a tiempo, lo termina y
 * reporta todos los tests como fallidos por timeout.
 */
export function runInWorker(request: RunRequest, createWorker?: CreateWorker): Promise<RunResult> {
  const timeoutMs = request.timeoutMs ?? DEFAULT_TIMEOUT_MS;
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

    const timer = setTimeout(() => finish(failAll(TIMEOUT_MESSAGE, true)), timeoutMs);

    worker.onmessage = (event) => finish(event.data as RunResult);
    worker.onerror = (event) => {
      event.preventDefault?.();
      finish(failAll(`Error en el runner: ${event.message ?? 'desconocido'}`));
    };
    worker.postMessage(request);
  });
}
