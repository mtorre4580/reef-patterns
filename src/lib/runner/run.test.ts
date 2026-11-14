import { executeChallenge } from './execute';
import { runInWorker, type WorkerLike } from './run';
import { runnerMessages } from './messages';
import type { RunRequest } from './types';

/** Fake worker that runs the code on the same thread (or never answers). */
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
    { name: 'passes', code: 'expect(depth()).toBe(18);' },
    { name: 'fails', code: 'expect(depth()).toBe(30);' },
  ],
};

describe('runInWorker', () => {
  it('returns the results and terminates the worker', async () => {
    let worker!: FakeWorker;
    const result = await runInWorker(request, () => (worker = new FakeWorker('run')));
    expect(result.results.map((r) => r.passed)).toEqual([true, false]);
    expect(worker.terminated).toBe(true);
  });

  it('times out (infinite loop) and fails every test', async () => {
    let worker!: FakeWorker;
    const result = await runInWorker(
      { ...request, timeoutMs: 30 },
      () => (worker = new FakeWorker('hang')),
    );
    expect(result.timedOut).toBe(true);
    expect(result.results.every((r) => !r.passed && r.error === runnerMessages.en.timeout)).toBe(
      true,
    );
    expect(worker.terminated).toBe(true);
  });

  it('reports worker errors', async () => {
    const result = await runInWorker(request, () => new FakeWorker('crash'));
    expect(result.results[0]?.error).toBe('Runner error: boom');
  });

  it('creates a new worker per run', async () => {
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
