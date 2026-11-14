import { tiers } from '@/content/tiers';
import { computeDepth } from './depth';

describe('computeDepth', () => {
  it('arranca en la superficie', () => {
    const reading = computeDepth(tiers, [{ top: 400, height: 400 }, null, null, null], 300);
    expect(reading.depth).toBe(0);
    expect(reading.zone?.zone).toBe('Superficie');
  });

  it('interpola dentro de la zona actual', () => {
    const rects = [
      { top: -800, height: 400 },
      { top: -100, height: 400 },
      { top: 300, height: 400 },
      { top: 700, height: 400 },
    ];
    const reading = computeDepth(tiers, rects, 100);
    expect(reading.zone?.zone).toBe('Arrecife');
    expect(reading.depth).toBe(20); // halfway through 10–30 m
  });

  it('no supera la profundidad máxima de la última zona', () => {
    const rects = tiers.map(() => ({ top: -2000, height: 100 }));
    expect(computeDepth(tiers, rects, 0).depth).toBe(100);
  });
});
