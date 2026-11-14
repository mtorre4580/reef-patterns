import type { Tier } from './types';

export interface TierInfo {
  tier: Tier;
  /** Depth range shown next to the zone name */
  depth: string;
  /** representative depth in meters, for the depth gauge */
  minDepth: number;
  maxDepth: number;
}

/** Usage tiers as dive zones. Labels and zone names live in the i18n messages. */
export const tiers: TierInfo[] = [
  { tier: 1, depth: '0–10 m', minDepth: 0, maxDepth: 10 },
  { tier: 2, depth: '10–30 m', minDepth: 10, maxDepth: 30 },
  { tier: 3, depth: '30–60 m', minDepth: 30, maxDepth: 60 },
  { tier: 4, depth: '60 m+', minDepth: 60, maxDepth: 100 },
];

export const tiersById = new Map(tiers.map((t) => [t.tier, t]));

export const tierInfo = (tier: Tier): TierInfo => {
  const info = tiersById.get(tier);
  if (!info) throw new Error(`Unknown tier: ${tier}`);
  return info;
};
