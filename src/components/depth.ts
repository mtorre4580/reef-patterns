import type { TierInfo } from '@/content/tiers';

export const MAX_GAUGE_DEPTH = 100;

export function zoneElementId(tier: number): string {
  return `zona-${tier}`;
}

export interface DepthReading {
  depth: number;
  zone: TierInfo | null;
}

/**
 * Calcula la profundidad según la posición de scroll: dentro de cada zona interpola entre su
 * profundidad mínima y máxima. Es pura para poder testearla.
 */
export function computeDepth(
  zones: TierInfo[],
  rects: ({ top: number; height: number } | null)[],
  referenceY: number,
): DepthReading {
  let current: DepthReading = { depth: zones[0]?.minDepth ?? 0, zone: zones[0] ?? null };
  zones.forEach((zone, i) => {
    const rect = rects[i];
    if (!rect || rect.top > referenceY) return;
    const progress = rect.height > 0 ? Math.min(1, (referenceY - rect.top) / rect.height) : 0;
    current = { depth: zone.minDepth + progress * (zone.maxDepth - zone.minDepth), zone };
  });
  return current;
}
