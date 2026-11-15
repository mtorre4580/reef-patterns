import { patterns, patternsById } from '../src/content/index.ts';
import { en } from '../src/i18n/messages/en.ts';
import {
  buildSitemap,
  escapeHtml,
  jsonLd,
  renderHomePage,
  renderPage,
  renderPatternPage,
} from './prerender-lib.ts';

const TEMPLATE = `<!doctype html>
<html><head>
    <meta
      name="description"
      content="old"
    />
    <title>Old</title>
    <link rel="canonical" href="https://example.test/" />
    <meta property="og:title" content="old" />
    <meta property="og:description" content="old" />
    <meta property="og:url" content="old" />
    <meta name="twitter:title" content="old" />
    <meta name="twitter:description" content="old" />
  </head>
  <body><div id="root"></div></body></html>`;

const labels = { categories: en.categories, tiers: en.tiers };

describe('escapeHtml', () => {
  it('escapes markup and quotes', () => {
    expect(escapeHtml(`<a href="x">Tom's & co</a>`)).toBe(
      '&lt;a href=&quot;x&quot;&gt;Tom&#39;s &amp; co&lt;/a&gt;',
    );
  });
});

describe('jsonLd', () => {
  it('cannot close its own script tag', () => {
    expect(jsonLd({ text: '</script><script>alert(1)</script>' })).not.toContain('</script><');
  });
});

describe('renderPage', () => {
  it('replaces the head metadata and fills #root', () => {
    const html = renderPage(TEMPLATE, {
      title: 'A & B',
      description: 'Desc "quoted"',
      path: 'patterns/a/',
      body: '<p>hi</p>',
    });
    expect(html).toContain('<title>A &amp; B</title>');
    expect(html).toContain('<meta name="description" content="Desc &quot;quoted&quot;" />');
    expect(html).toContain(
      '<link rel="canonical" href="https://mtorre4580.github.io/reef-patterns/patterns/a/" />',
    );
    expect(html).toContain('<div id="root"><p>hi</p></div>');
    expect(html).not.toContain('old');
  });

  it('fails loudly when the template lost a tag', () => {
    expect(() =>
      renderPage('<html></html>', { title: 't', description: 'd', path: '', body: '' }),
    ).toThrow(/not found/);
  });
});

describe('pattern and home pages', () => {
  const strategy = patternsById.get('strategy')!;

  it('renders a pattern page with its content and links to related patterns', () => {
    const html = renderPatternPage(TEMPLATE, strategy, patternsById, labels);
    expect(html).toContain('<title>Strategy design pattern in JavaScript · Reef Patterns</title>');
    expect(html).toContain('<h1>Strategy pattern</h1>');
    expect(html).toContain('"@type":"TechArticle"');
    for (const id of strategy.related) expect(html).toContain(`/reef-patterns/patterns/${id}/`);
  });

  it('links every pattern from the home page', () => {
    const html = renderHomePage(TEMPLATE, patterns, labels);
    for (const p of patterns) expect(html).toContain(`href="/reef-patterns/patterns/${p.id}/"`);
  });
});

describe('buildSitemap', () => {
  it('lists absolute URLs', () => {
    const xml = buildSitemap(['', 'patterns/strategy/'], '2026-01-01');
    expect(xml).toContain('<loc>https://mtorre4580.github.io/reef-patterns/</loc>');
    expect(xml).toContain(
      '<loc>https://mtorre4580.github.io/reef-patterns/patterns/strategy/</loc>',
    );
    expect(xml).toContain('<lastmod>2026-01-01</lastmod>');
  });
});
