/**
 * Pure helpers for scripts/prerender.ts: they turn the built index.html into one static page per
 * route, with its own <head> metadata, JSON-LD and readable content inside #root. React replaces
 * #root on load (createRoot), so the static markup is only for crawlers and the first paint.
 */
import type { Pattern, Tier } from '../src/content/types.ts';

export const SITE_URL = 'https://mtorre4580.github.io/reef-patterns/';
export const SITE_NAME = 'Reef Patterns';

const ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/** Escapes text for HTML content and attribute values. */
export const escapeHtml = (text: string): string => text.replace(/[&<>"']/g, (c) => ESCAPES[c]!);

/** Serializes JSON-LD so it cannot close its own <script> tag. */
export const jsonLd = (data: unknown): string =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;

/** Absolute URL of a site path; paths are relative to the site root, e.g. `patterns/strategy/`. */
export const pageUrl = (path = ''): string => new URL(path, SITE_URL).href;

export interface PageMeta {
  title: string;
  description: string;
  /** Path relative to the site root, with a trailing slash ('' for the home) */
  path: string;
  /** Extra tags appended to <head>, e.g. JSON-LD */
  head?: string;
  /** Static HTML placed inside #root */
  body: string;
}

const replaceOnce = (html: string, pattern: RegExp, replacement: string, what: string): string => {
  if (!pattern.test(html)) throw new Error(`prerender: ${what} not found in the template`);
  return html.replace(pattern, replacement);
};

const metaPattern = (attr: 'name' | 'property', key: string) =>
  new RegExp(`<meta\\s+${attr}="${key}"\\s+content="[^"]*"\\s*/?>`);

/** Fills the template with a page's metadata and static content. */
export const renderPage = (template: string, page: PageMeta): string => {
  const url = pageUrl(page.path);
  const title = escapeHtml(page.title);
  const description = escapeHtml(page.description);
  const metas: [attr: 'name' | 'property', key: string, value: string][] = [
    ['name', 'description', description],
    ['property', 'og:title', title],
    ['property', 'og:description', description],
    ['property', 'og:url', url],
    ['name', 'twitter:title', title],
    ['name', 'twitter:description', description],
  ];

  let html = replaceOnce(template, /<title>[^<]*<\/title>/, `<title>${title}</title>`, '<title>');
  html = replaceOnce(
    html,
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${url}" />`,
    'canonical link',
  );
  for (const [attr, key, value] of metas) {
    html = replaceOnce(
      html,
      metaPattern(attr, key),
      `<meta ${attr}="${key}" content="${value}" />`,
      key,
    );
  }
  if (page.head) html = replaceOnce(html, /<\/head>/, `${page.head}\n  </head>`, '</head>');
  return replaceOnce(html, /<div id="root"><\/div>/, `<div id="root">${page.body}</div>`, '#root');
};

/** sitemap.xml for the given site paths. */
export const buildSitemap = (paths: string[], lastmod: string): string => {
  const urls = paths
    .map((p) => `  <url><loc>${escapeHtml(pageUrl(p))}</loc><lastmod>${lastmod}</lastmod></url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
};

// Inline styles only: Tailwind does not scan this file, and the markup lives for one paint
const WRAP = 'data-prerender style="max-width:72ch;margin:0 auto;padding:2rem 1rem;line-height:1.6"';

const link = (path: string, text: string) =>
  `<a href="${escapeHtml(new URL(path, SITE_URL).pathname)}">${escapeHtml(text)}</a>`;

const list = (items: string[]) =>
  `<ul>${items.map((i) => `<li>${escapeHtml(i)}</li>`).join('')}</ul>`;

export const patternPath = (id: string) => `patterns/${id}/`;

export interface Labels {
  categories: Record<string, { label: string }>;
  tiers: Record<Tier, { label: string; zone: string }>;
}

/** Search-friendly page title for a pattern. */
export const patternTitle = (p: Pattern) => `${p.name} design pattern in JavaScript · ${SITE_NAME}`;

export const patternDescription = (p: Pattern) =>
  `${p.summary.en} When to use the ${p.name} pattern, pros, cons and a JavaScript example, plus a challenge to practice it.`;

export const renderPatternPage = (
  template: string,
  p: Pattern,
  byId: ReadonlyMap<string, Pattern>,
  labels: Labels,
): string => {
  const path = patternPath(p.id);
  const category = labels.categories[p.category]?.label ?? p.category;
  const tier = labels.tiers[p.tier];
  const related = p.related.map((id) => byId.get(id)).filter((r): r is Pattern => r !== undefined);

  const body = `<main ${WRAP}>
<nav aria-label="Breadcrumb">${link('', SITE_NAME)} › ${escapeHtml(p.name)}</nav>
<h1>${escapeHtml(p.name)} pattern</h1>
<p>${escapeHtml(`#${p.rank} · ${category} · ${tier.label} (${tier.zone})${p.gof ? ' · Gang of Four' : ''}`)}</p>
<p>${escapeHtml(p.summary.en)}</p>
<h2>When to use it</h2>
<p>${escapeHtml(p.when.en)}</p>
<h2>Benefits</h2>
${list(p.pros.en)}
<h2>Drawbacks</h2>
${list(p.cons.en)}
<h2>In the JavaScript ecosystem</h2>
<p>${escapeHtml(p.realWorld.en)}</p>
<h2>Example: ${escapeHtml(p.example.title.en)}</h2>
<p>${escapeHtml(p.example.scenario.en)}</p>
<pre><code class="language-js">${escapeHtml(p.example.code)}</code></pre>
<p>${link(`playground/?pattern=${p.id}`, `Practice the ${p.name} pattern in the playground`)}</p>
${related.length > 0 ? `<h2>Related patterns</h2><ul>${related.map((r) => `<li>${link(patternPath(r.id), r.name)}</li>`).join('')}</ul>` : ''}
</main>`;

  const head = [
    jsonLd({
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: `${p.name} design pattern`,
      description: p.summary.en,
      url: pageUrl(path),
      inLanguage: 'en',
      isAccessibleForFree: true,
      learningResourceType: 'Tutorial',
      proficiencyLevel: p.tier <= 2 ? 'Beginner' : 'Expert',
      about: { '@type': 'Thing', name: `${p.name} pattern` },
      keywords: ['design patterns', p.name, category, 'JavaScript', 'frontend'].join(', '),
      isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
    }),
    jsonLd({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: p.name, item: pageUrl(path) },
      ],
    }),
  ].join('\n    ');

  return renderPage(template, {
    title: patternTitle(p),
    description: patternDescription(p),
    path,
    head,
    body,
  });
};

export const HOME_TITLE = `${SITE_NAME} · 52 design patterns for frontend developers`;
export const HOME_DESCRIPTION =
  'Learn 52 design patterns for frontend developers, sorted by how often they are used, with JavaScript examples and interactive challenges that run in your browser.';

export const renderHomePage = (template: string, patterns: Pattern[], labels: Labels): string => {
  const sections = ([1, 2, 3, 4] as const)
    .map((tier) => {
      const inTier = patterns.filter((p) => p.tier === tier);
      const { label, zone } = labels.tiers[tier];
      return `<h2>${escapeHtml(`${label} (${zone})`)}</h2>
<ol>${inTier.map((p) => `<li value="${p.rank}">${link(patternPath(p.id), p.name)}: ${escapeHtml(p.summary.en)}</li>`).join('')}</ol>`;
    })
    .join('\n');

  const body = `<main ${WRAP}>
<h1>Design patterns for frontend developers</h1>
<p>${escapeHtml(HOME_DESCRIPTION)}</p>
<p>${link('playground/', 'Practice in the playground')}</p>
${sections}
</main>`;

  const head = [
    jsonLd({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
      description: HOME_DESCRIPTION,
      inLanguage: ['en', 'es', 'pt-BR'],
    }),
    jsonLd({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Design patterns sorted by usage',
      itemListElement: patterns.map((p) => ({
        '@type': 'ListItem',
        position: p.rank,
        name: p.name,
        url: pageUrl(patternPath(p.id)),
      })),
    }),
  ].join('\n    ');

  return renderPage(template, {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    path: '',
    head,
    body,
  });
};

export const PLAYGROUND_TITLE = `Design patterns playground: coding challenges · ${SITE_NAME}`;
export const PLAYGROUND_DESCRIPTION =
  'Spin the helm to get a random design pattern challenge, write the solution in a VS Code–like editor and run the tests in your browser. No sign-up.';

export const renderPlaygroundPage = (template: string): string =>
  renderPage(template, {
    title: PLAYGROUND_TITLE,
    description: PLAYGROUND_DESCRIPTION,
    path: 'playground/',
    body: `<main ${WRAP}>
<h1>Design patterns playground</h1>
<p>${escapeHtml(PLAYGROUND_DESCRIPTION)}</p>
<p>${link('', 'Browse the 52 patterns')}</p>
</main>`,
  });
