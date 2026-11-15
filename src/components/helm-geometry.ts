/** Angle (degrees, clockwise from the top) of the center of sector `index`. */
export const sectorCenter = (index: number, count: number): number => {
  const size = 360 / count;
  return index * size + size / 2;
};

/**
 * Final rotation that leaves sector `index` under the pointer (top), after at least `turns` full
 * turns from the current rotation. `direction` 1 spins clockwise, -1 counter-clockwise.
 */
export const targetRotation = (
  current: number,
  index: number,
  count: number,
  turns = 4,
  direction: 1 | -1 = 1,
): number => {
  const target = (360 - sectorCenter(index, count)) % 360;
  const forward = (((target - current) % 360) + 360) % 360;
  if (direction === 1) return current + turns * 360 + forward;
  const backward = (360 - forward) % 360;
  return current - turns * 360 - backward;
};

/** Sector currently under the pointer for a given wheel rotation. */
export const sectorAt = (rotation: number, count: number): number => {
  const angle = ((-rotation % 360) + 360) % 360;
  return Math.floor(angle / (360 / count)) % count;
};

/** SVG point for an angle measured clockwise from the top. */
export const polar = (cx: number, cy: number, r: number, angleDeg: number) => {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};

/** Angle in degrees (clockwise from the top) of a point relative to a center. */
export const angleOf = (x: number, y: number, cx: number, cy: number): number =>
  ((Math.atan2(y - cy, x - cx) * 180) / Math.PI + 90 + 360) % 360;
