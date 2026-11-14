/**
 * Mini librería de asserts del runner. Solo lo necesario:
 * toBe, toEqual (deep), toBeTruthy, toThrow, toHaveBeenCalled, toHaveBeenCalledTimes y fn().
 */

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

/** Crea una función espía que registra sus llamadas y opcionalmente delega en `impl`. */
export function fn(impl?: (...args: unknown[]) => unknown): Spy {
  const spy = function (this: unknown, ...args: unknown[]) {
    spy.calls.push(args);
    return impl?.apply(this, args);
  } as Spy;
  spy.calls = [];
  spy[SPY] = true;
  return spy;
}

function isSpy(value: unknown): value is Spy {
  return typeof value === 'function' && (value as Partial<Spy>)[SPY] === true;
}

export function format(value: unknown, seen = new WeakSet<object>()): string {
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'function') return `[Function ${value.name || 'anónima'}]`;
  if (typeof value === 'bigint') return `${value}n`;
  if (typeof value === 'symbol') return value.toString();
  if (value === null || typeof value !== 'object') return String(value);
  if (seen.has(value)) return '[Circular]';
  seen.add(value);
  if (value instanceof Error) return `${value.name}: ${value.message}`;
  if (Array.isArray(value)) return `[${value.map((v) => format(v, seen)).join(', ')}]`;
  if (value instanceof Map)
    return `Map(${[...value].map(([k, v]) => `${format(k, seen)} => ${format(v, seen)}`).join(', ')})`;
  if (value instanceof Set) return `Set(${[...value].map((v) => format(v, seen)).join(', ')})`;
  if (value instanceof Date) return value.toISOString();
  const name =
    value.constructor && value.constructor !== Object ? `${value.constructor.name} ` : '';
  const entries = Object.entries(value).map(([k, v]) => `${k}: ${format(v, seen)}`);
  return `${name}{ ${entries.join(', ')} }`.replace('{  }', '{}');
}

export function deepEqual(a: unknown, b: unknown, seen = new Map<object, object>()): boolean {
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
}

function requireSpy(actual: unknown, matcher: string): Spy {
  if (!isSpy(actual)) throw new AssertionError(`${matcher} espera una función creada con fn()`);
  return actual;
}

export function expect(actual: unknown) {
  return {
    toBe(expected: unknown) {
      if (!Object.is(actual, expected))
        throw new AssertionError(`Se esperaba ${format(expected)} y se recibió ${format(actual)}`);
    },
    toEqual(expected: unknown) {
      if (!deepEqual(actual, expected))
        throw new AssertionError(
          `Se esperaba un valor igual a ${format(expected)} y se recibió ${format(actual)}`,
        );
    },
    toBeTruthy() {
      if (!actual)
        throw new AssertionError(`Se esperaba un valor verdadero y se recibió ${format(actual)}`);
    },
    toThrow(expected?: string | RegExp) {
      if (typeof actual !== 'function')
        throw new AssertionError('toThrow espera una función: expect(() => …).toThrow()');
      let thrown: unknown;
      let didThrow = false;
      try {
        (actual as () => unknown)();
      } catch (error) {
        didThrow = true;
        thrown = error;
      }
      if (!didThrow) throw new AssertionError('Se esperaba que la función lanzara un error');
      if (expected === undefined) return;
      const message = thrown instanceof Error ? thrown.message : String(thrown);
      const ok = typeof expected === 'string' ? message.includes(expected) : expected.test(message);
      if (!ok)
        throw new AssertionError(
          `Se esperaba un error con ${format(String(expected))} y se lanzó ${format(message)}`,
        );
    },
    toHaveBeenCalled() {
      const spy = requireSpy(actual, 'toHaveBeenCalled');
      if (spy.calls.length === 0)
        throw new AssertionError('Se esperaba que la función fuera llamada');
    },
    toHaveBeenCalledTimes(times: number) {
      const spy = requireSpy(actual, 'toHaveBeenCalledTimes');
      if (spy.calls.length !== times)
        throw new AssertionError(
          `Se esperaba que la función fuera llamada ${times} ${times === 1 ? 'vez' : 'veces'} y fue llamada ${spy.calls.length}`,
        );
    },
  };
}
