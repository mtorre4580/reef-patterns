import { sectorCenter, targetRotation } from './helm-geometry';

describe('helm geometry', () => {
  it('places the center of each sector', () => {
    expect(sectorCenter(0, 4)).toBe(45);
    expect(sectorCenter(3, 4)).toBe(315);
  });

  it('the final rotation leaves the chosen sector at the top', () => {
    for (const [current, index, count] of [
      [0, 0, 4],
      [123, 2, 7],
      [1800, 5, 11],
    ] as const) {
      const rotation = targetRotation(current, index, count);
      const finalAngle = (sectorCenter(index, count) + rotation) % 360;
      expect(Math.round(finalAngle) % 360).toBe(0);
      expect(rotation - current).toBeGreaterThanOrEqual(4 * 360);
    }
  });
});
