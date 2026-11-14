import { angleOf, sectorAt, sectorCenter, targetRotation } from './helm-geometry';

describe('helm geometry', () => {
  it('places the center of each sector', () => {
    expect(sectorCenter(0, 4)).toBe(45);
    expect(sectorCenter(3, 4)).toBe(315);
  });

  it('the final rotation leaves the chosen sector at the top, clockwise', () => {
    for (const [current, index, count] of [
      [0, 0, 4],
      [123, 2, 7],
      [1800, 5, 11],
    ] as const) {
      const rotation = targetRotation(current, index, count);
      expect(sectorAt(rotation, count)).toBe(index);
      expect(rotation - current).toBeGreaterThanOrEqual(4 * 360);
    }
  });

  it('also lands on the sector when spinning counter-clockwise', () => {
    for (const [current, index, count] of [
      [0, 1, 4],
      [-250, 6, 13],
      [900, 0, 8],
    ] as const) {
      const rotation = targetRotation(current, index, count, 3, -1);
      expect(sectorAt(rotation, count)).toBe(index);
      expect(current - rotation).toBeGreaterThanOrEqual(3 * 360);
    }
  });

  it('measures pointer angles clockwise from the top', () => {
    expect(angleOf(100, 0, 100, 100)).toBeCloseTo(0);
    expect(angleOf(200, 100, 100, 100)).toBeCloseTo(90);
    expect(angleOf(100, 200, 100, 100)).toBeCloseTo(180);
  });
});
