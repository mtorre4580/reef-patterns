/**
 * The runner's tiny assertion library. Only what is needed:
 * toBe, toEqual (deep), toBeTruthy, toThrow, toHaveBeenCalled, toHaveBeenCalledTimes and fn().
 */

import { runnerMessages, type RunnerMessages } from './messages';

export class AssertionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AssertionError';
  }
}

const SPY = Symbol('reef-spy');

export interface Spy {
  (...args: unknown[]): unknown;
  calls: unknown[][];
  [SPY]: true;
}

/** Creates a spy function that records its calls and optionally delegates to `impl`. */
export const fn = (impl?: (...args: unknown[]) => unknown): Spy => {
  const spy = function (this: unknown, ...args: unknown[]) {
    spy.calls.push(args);
    return impl?.apply(this, args);
  } as Spy;
  spy.calls = [];
  spy[SPY] = true;
  return spy;
};

const isSpy = (value: unknown): value is Spy =>
  typeof value === 'function' && (value as Partial<Spy>)[SPY] === true;

export const format = (
  value: unknown,
  seen = new WeakSet<object>(),
  anonymous = 'anonymous',
): string => {
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'function') return `[Function ${value.name || anonymous}]`;
  if (typeof value === 'bigint') return `${value}n`;
  if (typeof value === 'symbol') return value.toString();
  if (value === null || typeof value !== 'object') return String(value);
  if (seen.has(value)) return '[Circular]';
  seen.add(value);
  if (value instanceof Error) return `${value.name}: ${value.message}`;
  if (Array.isArray(value)) return `[${value.map((v) => format(v, seen, anonymous)).join(', ')}]`;
  if (value instanceof Map)
    return `Map(${[...value].map(([k, v]) => `${format(k, seen, anonymous)} => ${format(v, seen, anonymous)}`).join(', ')})`;
  if (value instanceof Set)
    return `Set(${[...value].map((v) => format(v, seen, anonymous)).join(', ')})`;
  if (value instanceof Date) return value.toISOString();
  const name =
    value.constructor && value.constructor !== Object ? `${value.constructor.name} ` : '';
  const entries = Object.entries(value).map(([k, v]) => `${k}: ${format(v, seen, anonymous)}`);
  return `${name}{ ${entries.join(', ')} }`.replace('{  }', '{}');
};

export const deepEqual = (a: unknown, b: unknown, seen = new Map<object, object>()): boolean => {
  if (Object.is(a, b)) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;
  if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) return false;
  if (seen.get(a) === b) return true;
  seen.set(a, b);
  if (a instanceof Date) return a.getTime() === (b as Date).getTime();
  if (a instanceof Map) {
    const mb = b as Map<unknown, unknown>;
    if (a.size !== mb.size) return false;
    for (const [k, v] of a) if (!mb.has(k) || !deepEqual(v, mb.get(k), seen)) return false;
    return true;
  }
  if (a instanceof Set) {
    const sb = b as Set<unknown>;
    if (a.size !== sb.size) return false;
    for (const v of a) if (!sb.has(v)) return false;
    return true;
  }
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every(
    (k) =>
      Object.prototype.hasOwnProperty.call(b, k) &&
      deepEqual((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k], seen),
  );
};

/** Builds `expect` with assertion messages in the given language. */
export const createExpect = (m: RunnerMessages = runnerMessages.en) => {
  const show = (value: unknown) => format(value, new WeakSet(), m.anonymous);
  const requireSpy = (actual: unknown, matcher: string): Spy => {
    if (!isSpy(actual)) throw new AssertionError(m.needsSpy(matcher));
    return actual;
  };

  return (actual: unknown) => ({
    toBe(expected: unknown) {
      if (!Object.is(actual, expected))
        throw new AssertionError(m.toBe(show(expected), show(actual)));
    },
    toEqual(expected: unknown) {
      if (!deepEqual(actual, expected))
        throw new AssertionError(m.toEqual(show(expected), show(actual)));
    },
    toBeTruthy() {
      if (!actual) throw new AssertionError(m.toBeTruthy(show(actual)));
    },
    toThrow(expected?: string | RegExp) {
      if (typeof actual !== 'function') throw new AssertionError(m.toThrowNeedsFunction);
      let thrown: unknown;
      let didThrow = false;
      try {
        (actual as () => unknown)();
      } catch (error) {
        didThrow = true;
        thrown = error;
      }
      if (!didThrow) throw new AssertionError(m.didNotThrow);
      if (expected === undefined) return;
      const message = thrown instanceof Error ? thrown.message : String(thrown);
      const ok = typeof expected === 'string' ? message.includes(expected) : expected.test(message);
      if (!ok) throw new AssertionError(m.wrongError(show(String(expected)), show(message)));
    },
    toHaveBeenCalled() {
      const spy = requireSpy(actual, 'toHaveBeenCalled');
      if (spy.calls.length === 0) throw new AssertionError(m.notCalled);
    },
    toHaveBeenCalledTimes(times: number) {
      const spy = requireSpy(actual, 'toHaveBeenCalledTimes');
      if (spy.calls.length !== times)
        throw new AssertionError(m.calledTimes(times, spy.calls.length));
    },
  });
};

/** English `expect`, handy for tests and scripts. */
export const expect = createExpect();
