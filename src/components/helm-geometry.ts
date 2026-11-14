/** Ángulo (grados, sentido horario desde arriba) del centro del sector `index`. */
export function sectorCenter(index: number, count: number): number {
  const size = 360 / count;
  return index * size + size / 2;
}

/**
 * Rotación final para que el sector `index` quede bajo el puntero (arriba), dando al menos
 * `turns` vueltas completas desde la rotación actual.
 */
export function targetRotation(current: number, index: number, count: number, turns = 4): number {
  const target = (360 - sectorCenter(index, count)) % 360;
  const delta = (((target - current) % 360) + 360) % 360;
  return current + turns * 360 + delta;
}

/** Punto en coordenadas del SVG para un ángulo medido desde arriba en sentido horario. */
export function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
