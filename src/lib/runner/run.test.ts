import { executeChallenge } from './execute';
import { runInWorker, type WorkerLike } from './run';
import { TIMEOUT_MESSAGE, type RunRequest } from './types';

/** Worker simulado que ejecuta el código en el mismo hilo (o nunca responde). */
class FakeWorker implements WorkerLike {
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;
  terminated = false;
  constructor(private mode: 'run' | 'hang' | 'crash') {}
  postMessage(message: unknown) {
    if (this.mode === 'hang') return;
    if (this.mode === 'crash') {
      queueMicrotask(() => this.onerror?.({ message: 'boom', preventDefault() {} } as ErrorEvent));
      return;
    }
    executeChallenge(message as RunRequest).then((data) => {
      if (!this.terminated) this.onmessage?.({ data } as MessageEvent);
    });
  }
  terminate() {
    this.terminated = true;
  }
}

const request: RunRequest = {
  code: 'const depth = () => 18;',
  tests: [
    { name: 'pasa', code: 'expect(depth()).toBe(18);' },
    { name: 'falla', code: 'expect(depth()).toBe(30);' },
  ],
};

describe('runInWorker', () => {
  it('devuelve los resultados y termina el worker', async () => {
    let worker!: FakeWorker;
    const result = await runInWorker(request, () => (worker = new FakeWorker('run')));
    expect(result.results.map((r) => r.passed)).toEqual([true, false]);
    expect(worker.terminated).toBe(true);
  });

  it('corta por timeout (bucle infinito) y marca todos los tests', async () => {
    let worker!: FakeWorker;
    const result = await runInWorker(
      { ...request, timeoutMs: 30 },
      () => (worker = new FakeWorker('hang')),
    );
    expect(result.timedOut).toBe(true);
    expect(result.results.every((r) => !r.passed && r.error === TIMEOUT_MESSAGE)).toBe(true);
    expect(worker.terminated).toBe(true);
  });

  it('reporta errores del worker', async () => {
    const result = await runInWorker(request, () => new FakeWorker('crash'));
    expect(result.results[0]?.error).toBe('Error en el runner: boom');
  });

  it('crea un worker nuevo por ejecución', async () => {
    const created: FakeWorker[] = [];
    const factory = () => {
      const w = new FakeWorker('run');
      created.push(w);
      return w;
    };
    await runInWorker(request, factory);
    await runInWorker(request, factory);
    expect(created).toHaveLength(2);
  });
});
