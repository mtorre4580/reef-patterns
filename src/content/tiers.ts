import type { Tier } from './types';

export interface TierInfo {
  tier: Tier;
  label: string;
  zone: string;
  depth: string;
  /** representative depth in meters, for the depth gauge */
  minDepth: number;
  maxDepth: number;
}

export const tiers: TierInfo[] = [
  { tier: 1, label: 'Esencial', zone: 'Superficie', depth: '0–10 m', minDepth: 0, maxDepth: 10 },
  { tier: 2, label: 'Muy usado', zone: 'Arrecife', depth: '10–30 m', minDepth: 10, maxDepth: 30 },
  { tier: 3, label: 'Situacional', zone: 'Drop-off', depth: '30–60 m', minDepth: 30, maxDepth: 60 },
  { tier: 4, label: 'Poco común', zone: 'Abismo', depth: '60 m+', minDepth: 60, maxDepth: 100 },
];

export const tiersById = new Map(tiers.map((t) => [t.tier, t]));

export function tierInfo(tier: Tier): TierInfo {
  const info = tiersById.get(tier);
  if (!info) throw new Error(`Tier desconocido: ${tier}`);
  return info;
}
