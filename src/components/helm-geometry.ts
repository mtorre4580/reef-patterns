/** Angle (degrees, clockwise from the top) of the center of sector `index`. */
export function sectorCenter(index: number, count: number): number {
  const size = 360 / count;
  return index * size + size / 2;
}

/**
 * Final rotation that leaves sector `index` under the pointer (top), after at least
 * `turns` full turns from the current rotation.
 */
export function targetRotation(current: number, index: number, count: number, turns = 4): number {
  const target = (360 - sectorCenter(index, count)) % 360;
  const delta = (((target - current) % 360) + 360) % 360;
  return current + turns * 360 + delta;
}

/** SVG point for an angle measured clockwise from the top. */
export function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
