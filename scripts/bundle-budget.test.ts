import { checkBudget, chunkName, type Budget } from './bundle-budget';

const budget: Budget = { initial: 100, defaultChunk: 20, chunks: { 'index.js': 90 } };
const KB = 1024;

describe('chunkName', () => {
  it('strips the content hash', () => {
    expect(chunkName('index-ywmbuSRv.js')).toBe('index.js');
    expect(chunkName('ts.worker-CVbFdYz4.js')).toBe('ts.worker.js');
    expect(chunkName('engine-javascript-C30F4iNc.js')).toBe('engine-javascript.js');
  });
});

describe('checkBudget', () => {
  it('passes when everything fits', () => {
    const rows = checkBudget(
      [
        { file: 'index-ywmbuSRv.js', gzipBytes: 80 * KB, initial: true },
        { file: 'index-BPZ9JeTj.css', gzipBytes: 10 * KB, initial: true },
        { file: 'helper-AbCdEfGh.js', gzipBytes: 5 * KB, initial: false },
      ],
      budget,
    );
    expect(rows.every((r) => r.ok)).toBe(true);
    expect(rows[0]).toEqual({ label: 'initial load (JS + CSS)', kb: 90, limitKb: 100, ok: true });
  });

  it('flags the initial load and chunks over their limit', () => {
    const rows = checkBudget(
      [
        { file: 'index-ywmbuSRv.js', gzipBytes: 95 * KB, initial: true },
        { file: 'index-BPZ9JeTj.css', gzipBytes: 10 * KB, initial: true },
        { file: 'new-chunk-AbCdEfGh.js', gzipBytes: 25 * KB, initial: false },
      ],
      budget,
    );
    expect(rows.filter((r) => !r.ok).map((r) => r.label)).toEqual([
      'initial load (JS + CSS)',
      'index.js',
      'new-chunk.js',
    ]);
  });

  it('ignores CSS files as chunks but counts them in the initial load', () => {
    const rows = checkBudget(
      [{ file: 'index-BPZ9JeTj.css', gzipBytes: 50 * KB, initial: true }],
      budget,
    );
    expect(rows).toHaveLength(1);
  });
});
