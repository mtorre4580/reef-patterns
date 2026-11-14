import { AssertionError, deepEqual, expect as reefExpect, fn, format } from './expect';

describe('runner expect', () => {
  it('toBe uses Object.is', () => {
    expect(() => reefExpect(1).toBe(1)).not.toThrow();
    expect(() => reefExpect({}).toBe({})).toThrow(AssertionError);
    expect(() => reefExpect(NaN).toBe(NaN)).not.toThrow();
  });

  it('toEqual compares deeply, including Map and Set', () => {
    expect(() => reefExpect({ a: [1, { b: 2 }] }).toEqual({ a: [1, { b: 2 }] })).not.toThrow();
    expect(() => reefExpect(new Map([[1, 'a']])).toEqual(new Map([[1, 'a']]))).not.toThrow();
    expect(() => reefExpect([1, 2]).toEqual([2, 1])).toThrow(/Expected a value equal/);
    expect(deepEqual(new Set([1]), new Set([2]))).toBe(false);
  });

  it('toBeTruthy', () => {
    expect(() => reefExpect('x').toBeTruthy()).not.toThrow();
    expect(() => reefExpect(0).toBeTruthy()).toThrow();
  });

  it('toThrow with and without a message', () => {
    const boom = () => {
      throw new Error('Cannot ascend');
    };
    expect(() => reefExpect(boom).toThrow()).not.toThrow();
    expect(() => reefExpect(boom).toThrow('ascend')).not.toThrow();
    expect(() => reefExpect(boom).toThrow(/descend/)).toThrow(/Expected an error/);
    expect(() => reefExpect(() => 1).toThrow()).toThrow(/to throw an error/);
  });

  it('fn() records calls and delegates', () => {
    const spy = fn((x) => (x as number) * 2);
    expect(spy(2)).toBe(4);
    spy(3);
    expect(spy.calls).toEqual([[2], [3]]);
    expect(() => reefExpect(spy).toHaveBeenCalled()).not.toThrow();
    expect(() => reefExpect(spy).toHaveBeenCalledTimes(2)).not.toThrow();
    expect(() => reefExpect(spy).toHaveBeenCalledTimes(1)).toThrow(/1 time but it was called 2/);
    expect(() => reefExpect(() => {}).toHaveBeenCalled()).toThrow(/fn\(\)/);
  });

  it('format describes values readably', () => {
    expect(format({ a: 1, b: 'x' })).toBe('{ a: 1, b: "x" }');
    const circular: Record<string, unknown> = {};
    circular.self = circular;
    expect(format(circular)).toBe('{ self: [Circular] }');
  });
});
