/** Pure logic for the bundle budget: kept apart from the CLI so it can be unit tested. */

export interface Budget {
  /** Max gzip KB of the JS and CSS that index.html loads up front. */
  initial: number;
  /** Max gzip KB for any JS chunk not listed in `chunks`. */
  defaultChunk: number;
  /** Max gzip KB per chunk, keyed by name without the hash (e.g. `index.js`). */
  chunks: Record<string, number>;
}

export interface Asset {
  /** File name as emitted by Vite, e.g. `index-ywmbuSRv.js`. */
  file: string;
  gzipBytes: number;
  /** True when index.html loads it directly. */
  initial: boolean;
}

export interface BudgetRow {
  label: string;
  kb: number;
  limitKb: number;
  ok: boolean;
}

/** `index-ywmbuSRv.js` → `index.js`, `ts.worker-CVbFdYz4.js` → `ts.worker.js`. */
export function chunkName(file: string): string {
  return file.replace(/-[A-Za-z0-9_-]{8}(\.[a-z0-9]+)$/, '$1');
}

const toKb = (bytes: number) => Math.round((bytes / 1024) * 10) / 10;

export function checkBudget(assets: Asset[], budget: Budget): BudgetRow[] {
  const rows: BudgetRow[] = [];

  const initialBytes = assets.filter((a) => a.initial).reduce((sum, a) => sum + a.gzipBytes, 0);
  const initialKb = toKb(initialBytes);
  rows.push({
    label: 'initial load (JS + CSS)',
    kb: initialKb,
    limitKb: budget.initial,
    ok: initialKb <= budget.initial,
  });

  for (const asset of assets) {
    if (!asset.file.endsWith('.js')) continue;
    const name = chunkName(asset.file);
    const limitKb = budget.chunks[name] ?? budget.defaultChunk;
    const kb = toKb(asset.gzipBytes);
    rows.push({ label: name, kb, limitKb, ok: kb <= limitKb });
  }

  return rows;
}
