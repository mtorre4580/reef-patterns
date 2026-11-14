import { AssertionError, deepEqual, expect as reefExpect, fn, format } from './expect';

describe('expect del runner', () => {
  it('toBe usa Object.is', () => {
    expect(() => reefExpect(1).toBe(1)).not.toThrow();
    expect(() => reefExpect({}).toBe({})).toThrow(AssertionError);
    expect(() => reefExpect(NaN).toBe(NaN)).not.toThrow();
  });

  it('toEqual compara en profundidad, incluidos Map y Set', () => {
    expect(() => reefExpect({ a: [1, { b: 2 }] }).toEqual({ a: [1, { b: 2 }] })).not.toThrow();
    expect(() => reefExpect(new Map([[1, 'a']])).toEqual(new Map([[1, 'a']]))).not.toThrow();
    expect(() => reefExpect([1, 2]).toEqual([2, 1])).toThrow(/Se esperaba un valor igual/);
    expect(deepEqual(new Set([1]), new Set([2]))).toBe(false);
  });

  it('toBeTruthy', () => {
    expect(() => reefExpect('x').toBeTruthy()).not.toThrow();
    expect(() => reefExpect(0).toBeTruthy()).toThrow();
  });

  it('toThrow con y sin mensaje', () => {
    const boom = () => {
      throw new Error('No se puede ascender');
    };
    expect(() => reefExpect(boom).toThrow()).not.toThrow();
    expect(() => reefExpect(boom).toThrow('ascender')).not.toThrow();
    expect(() => reefExpect(boom).toThrow(/descender/)).toThrow(/Se esperaba un error/);
    expect(() => reefExpect(() => 1).toThrow()).toThrow(/lanzara un error/);
  });

  it('fn() registra llamadas y delega', () => {
    const spy = fn((x) => (x as number) * 2);
    expect(spy(2)).toBe(4);
    spy(3);
    expect(spy.calls).toEqual([[2], [3]]);
    expect(() => reefExpect(spy).toHaveBeenCalled()).not.toThrow();
    expect(() => reefExpect(spy).toHaveBeenCalledTimes(2)).not.toThrow();
    expect(() => reefExpect(spy).toHaveBeenCalledTimes(1)).toThrow(/1 vez y fue llamada 2/);
    expect(() => reefExpect(() => {}).toHaveBeenCalled()).toThrow(/fn\(\)/);
  });

  it('format describe valores de forma legible', () => {
    expect(format({ a: 1, b: 'x' })).toBe('{ a: 1, b: "x" }');
    const circular: Record<string, unknown> = {};
    circular.self = circular;
    expect(format(circular)).toBe('{ self: [Circular] }');
  });
});
