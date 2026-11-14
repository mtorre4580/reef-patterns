import type { ChallengeTest } from '@/content/types';
import { runAstChecks } from './ast-checks';
import { createExpect, fn, format } from './expect';
import { runnerMessages } from './messages';
import type { LogEntry, LogLevel, RunRequest, RunResult, TestResult } from './types';

const PER_TEST_ASYNC_TIMEOUT_MS = 1500;

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message || error.name;
  return format(error);
}

function createConsole(logs: LogEntry[]) {
  const make =
    (level: LogLevel) =>
    (...args: unknown[]) =>
      logs.push({ level, args: args.map((a) => (typeof a === 'string' ? a : format(a))) });
  return {
    log: make('log'),
    info: make('info'),
    warn: make('warn'),
    error: make('error'),
    debug: make('log'),
    table: make('log'),
  };
}

/**
 * Builds a single script with the user code followed by each test (as async functions in the
 * same scope) and runs it with `new Function`. There is no timeout for synchronous loops: the
 * main thread handles that by terminating the worker.
 */
export function buildScript(code: string, tests: ChallengeTest[]): string {
  const testFns = tests.map((t) => `async () => {\n${t.code}\n}`).join(',\n');
  return `"use strict";\n${code}\n;\nreturn [\n${testFns}\n];`;
}

function withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), ms);
    promise.then(
      (v) => (clearTimeout(timer), resolve(v)),
      (e) => (clearTimeout(timer), reject(e)),
    );
  });
}

export async function executeChallenge(request: RunRequest): Promise<RunResult> {
  const start = performance.now();
  const logs: LogEntry[] = [];
  const m = runnerMessages[request.locale ?? 'en'];
  const results: TestResult[] = runAstChecks(request.code, request.checks, m);
  const sandboxConsole = createConsole(logs);

  let testFns: (() => Promise<void>)[];
  try {
    const factory = new Function(
      'expect',
      'fn',
      'console',
      buildScript(request.code, request.tests),
    );
    testFns = factory(createExpect(m), fn, sandboxConsole) as (() => Promise<void>)[];
  } catch (error) {
    const detail = errorMessage(error);
    const message = error instanceof SyntaxError ? m.syntaxError(detail) : m.loadError(detail);
    for (const t of request.tests)
      results.push({ name: t.name, passed: false, kind: 'test', error: message });
    return { results, logs, durationMs: performance.now() - start };
  }

  for (const [i, test] of request.tests.entries()) {
    try {
      await withTimeout(
        testFns[i]!(),
        PER_TEST_ASYNC_TIMEOUT_MS,
        m.testTimeout(PER_TEST_ASYNC_TIMEOUT_MS),
      );
      results.push({ name: test.name, passed: true, kind: 'test' });
    } catch (error) {
      results.push({ name: test.name, passed: false, kind: 'test', error: errorMessage(error) });
    }
  }

  return { results, logs, durationMs: Math.round(performance.now() - start) };
}

export function allPassed(result: RunResult): boolean {
  return result.results.length > 0 && result.results.every((r) => r.passed);
}
