# CLAUDE.md — Reef Patterns

Context guide for working in this repo. Read all of it before touching code.

## What it is

A website where any developer can review design patterns, with a frontend focus.
It has two parts:

1. **Catalog**: 52 patterns sorted by how often they are used, with search, group filters and a
   detail page (when to use it, benefits, drawbacks, JavaScript example).
2. **Playground**: a VS Code–like editor on the left and a results panel on the right. The user
   spins a ship's helm (wheel) that randomly picks a challenge that forces them to apply a
   pattern, writes the solution, and the tests run in the browser. There is no backend.

The **design** follows a nautical theme (an old sailing ship; see Design). The **content** does
not: examples and challenges use situations a developer meets at work (checkout, payments,
notifications, API clients, forms, feature flags, background jobs…), so nobody needs domain
knowledge to understand an exercise.

## Stack

| Area | Choice | Notes |
|---|---|---|
| Runtime | Node LTS (24) | `.nvmrc` at the root |
| Packages | pnpm | Never use npm or yarn. Commit `pnpm-lock.yaml` |
| Build | Vite (latest stable) + `@vitejs/plugin-react` | |
| UI | React 19 | Function components and hooks only |
| App language | Strict TypeScript | **Examples and challenges** are plain JavaScript (see Conventions) |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) | Tokens in `src/styles/theme.css` via `@theme` |
| Base components | shadcn/ui (Radix primitives) | Copied into `src/components/ui`, adapted to the theme |
| Icons | lucide-react | |
| Animation | Motion (`motion/react`) | Respect `prefers-reduced-motion` |
| Routing | React Router (library mode) | |
| Search | Fuse.js + `cmdk` command palette (⌘K) | |
| i18n | Custom: Context + typed dictionaries in `src/i18n` | en (default), es, pt-BR; no dependencies |
| Editor | Monaco via `@monaco-editor/react` | Loaded with `React.lazy`; local Monaco, no CDN |
| Read-only code highlighting | Shiki | Custom “Abyss Reef” theme |
| Challenge execution | Web Worker + small custom assertion library | See “Runner” |
| Static checks | acorn + acorn-walk | Per-challenge AST rules |
| Tests | Vitest + React Testing Library + `@testing-library/user-event` + jsdom | |
| Lint/format | ESLint (flat config) + Prettier | |
| Git hooks | husky + commitlint (`@commitlint/config-conventional`) | `.husky/pre-push` runs `pnpm lint`; `.husky/commit-msg` validates the message |
| CI | GitHub Actions | lint, typecheck, validate content, unit tests, build + bundle budget, `pnpm audit`, dependency review, Playwright + axe (both themes), Lighthouse CI, CodeQL |
| Browser tests | Playwright + `@axe-core/playwright` | `e2e/`, runs against the production build |
| Performance | Lighthouse CI (`lighthouserc.json`) + `bundle-budget.json` | Gzip limits per chunk |
| Dependencies | Dependabot (weekly, grouped) | `.github/dependabot.yml` |
| Deploy | GitHub Pages with `HashRouter` (`createHashRouter`) | `deploy.yml` runs after CI passes on `main`; `base: '/reef-patterns/'` |

## Commands

```bash
pnpm install
pnpm dev                # development server
pnpm build              # production build
pnpm preview            # preview the build (served under /reef-patterns/)
pnpm test               # Vitest in watch mode
pnpm test:run           # Vitest once (CI)
pnpm lint
pnpm typecheck          # tsc --noEmit
pnpm validate:content   # checks patterns and challenges (see Testing)
pnpm check:bundle       # gzip budget per chunk (after pnpm build)
pnpm test:e2e           # Playwright + axe in dark and light (after pnpm build)
pnpm lhci               # Lighthouse CI on the built site
```

## Structure

```
src/
  app/                 # router, providers, root layout
  components/ui/       # shadcn/ui adapted to the theme
  components/          # shared components (DepthGauge, CodeBlock, Helm…)
  features/
    catalog/           # list, filters, search, pattern detail
    playground/        # editor, results panel, helm, runner wiring
    progress/          # user progress (localStorage)
  content/
    categories.ts
    tiers.ts
    patterns/<id>.ts   # one file per pattern
    challenges/<patternId>/<challengeId>.ts
    index.ts           # registry: patterns, patternsById, challengesByPattern
  i18n/                # I18nProvider, useI18n, LanguageSwitcher, messages/{en,es,pt-BR}.ts
  lib/
    runner/            # worker, assertions, AST checks, result types, localized messages
    search.ts
    random.ts          # injectable rng for the helm
  styles/theme.css
  test/                # Vitest setup and helpers
scripts/
  validate-content.ts
```

Rule: each feature exports its public API from `features/<x>/index.ts`. Do not import internal
files from another feature.

## Content model

```ts
type CategoryId = 'creacional' | 'estructural' | 'comportamiento'
  | 'arquitectura' | 'resiliencia' | 'frontend';
type Tier = 1 | 2 | 3 | 4; // 1 Essential … 4 Rare
type Localized<T> = Record<'en' | 'es' | 'pt-BR', T>;  // every visible text, in all 3 languages

interface Pattern {
  id: string;                    // kebab-case, stable: used in URLs
  rank: number;                  // global order 1..N, no gaps
  name: string;                  // canonical English name (Strategy)
  localName: Localized<string>;  // Strategy / Estrategia / Estratégia
  category: CategoryId;
  tier: Tier;
  gof: boolean;
  summary: Localized<string>;    // one sentence
  when: Localized<string>;       // when to use it
  pros: Localized<string[]>;     // 2-4, same count in every language
  cons: Localized<string[]>;     // 2-4
  realWorld: Localized<string>;  // where it shows up in the JS ecosystem
  example: { title: Localized<string>; scenario: Localized<string>; code: string }; // code: English JS
  related: string[];             // existing ids
}

interface Challenge {
  id: string;                       // `${patternId}-${n}`
  patternId: string;
  title: Localized<string>;
  difficulty: 'facil' | 'media' | 'dificil';
  story: Localized<string>;         // real-world work context
  instructions: Localized<string>;  // what to implement, with exact API names
  starterCode: string;              // English JS
  tests: { name: Localized<string>; code: string }[];  // use the runner's expect()
  checks?: AstCheck<Localized<string>>[];              // optional static rules
  hints: Localized<string[]>;
  solution: string;                 // English JS, must pass every test
}
```

The 52 patterns and their order come from the original list (Essential → Rare). When adding one,
recompute `rank` and run `pnpm validate:content`.

`challengesByPattern` is a `Map<string, Challenge[]>` built in `content/index.ts`. The helm never
reaches challenges any other way.

## Runner (running user code)

- Runs in a **Web Worker** created with
  `new Worker(new URL('./runner.worker.ts', import.meta.url), { type: 'module' })`.
- Input: `{ code, tests, checks, timeoutMs, locale }`. The worker builds a single script with the
  user code followed by each test, runs it with `new Function` and returns
  `{ results: { name, passed, error?, kind }[], logs: { level, args }[], durationMs }`.
- `console.*` is intercepted inside the worker and forwarded to the Console panel.
- Default timeout is 2000 ms: the main thread calls `worker.terminate()` and reports
  “Time is up: is there an infinite loop?” (localized). A new worker is created per run.
- `lib/runner/expect.ts`: `toBe`, `toEqual` (deep), `toBeTruthy`, `toThrow`,
  `toHaveBeenCalled`/`toHaveBeenCalledTimes` with a custom `fn()` spy. Nothing more unless needed.
  Assertion messages come from `lib/runner/messages.ts` in the active language.
- AST checks (acorn) run in the worker before the tests. Supported rules: `forbidNode`
  (e.g. `SwitchStatement`), `requireClass`, `requireMethod`, `maxIfStatements`. A failed check
  shows up as one more result, with its message.
- Tests must check **behavior that can only be achieved by applying the pattern** (e.g.
  Singleton: two calls return the same instance; Observer: an unsubscribed listener gets no
  notifications), not the exact shape of the code.

## Helm (wheel)

- `pickChallenge(pool, completedIds, rng)` in `features/playground/pick.ts` is a pure function.
  `rng` is injected (`Math.random` by default) so it can be tested.
- Pool = challenges of the patterns that pass the active filters. Unsolved ones come first; if all
  are solved, it picks among all of them.
- The helm animation is purely visual: the result is computed **before** animating and the
  animation ends on the chosen sector.
- Progress and drafts live in `localStorage` under `reef-patterns:progress` and
  `reef-patterns:draft:<challengeId>`, always wrapped in try/catch.

## Design

Direction: an **old sailing ship**. Weathered wood, hemp rope, sailcloth, brass fittings and sea
blue. Dark by default (night watch: navy sea, walnut panels, brass lanterns) with a light mode
(deck by day: sailcloth and parchment charts, navy ink). Usage tiers are still dive zones:

| Tier | Name | Zone | Depth shown |
|---|---|---|---|
| 1 | Essential | Surface | 0–10 m |
| 2 | Widely used | Reef | 10–30 m |
| 3 | Situational | Drop-off | 30–60 m |
| 4 | Rare | Abyss | 60 m+ |

- **Tokens** in `src/styles/theme.css` (`@theme`, dark values by default; the original ocean
  names are kept): `--color-abyss` background, `--color-trench` panels, `--color-reef` raised
  panels, `--color-current` borders, `--color-foam` text, `--color-kelp` secondary text,
  `--color-lagoon` interactive accent (sea blue), `--color-biolum` focus (brass in dark, navy in
  light), `--color-coral` failures, `--color-anemone` passes. Ship materials are the same in both
  themes: `--color-wood*`, `--color-rope*`, `--color-brass*`, `--color-sail`, `--color-navy`, and
  `--color-on-wood*` for text on wood. Category colors: `--cat-<id>`; never convey information
  through color alone.
- **Material utilities** (CSS only, no images): `wood`, `planks` (header and tab bars), `rope` /
  `rope-v` (dividers, progress, sounding line), `parchment` (cards and panels), `nailed` (two brass
  nails on signs), `brass` (coins, badges, readouts), `sea` (animated waves).
- **Typography**: IM Fell English (`--font-display`) for `h1`/`h2`, signs and the helm; Geist for
  UI text; Geist Mono for code. 1.25 modular scale.
- **Signature elements**: the wooden ship's helm (turned handles, brass hub, king spoke knot, brass
  pointer that flicks per sector), the sounding-line depth gauge (rope pays out with a lead weight),
  the hero sailing ship bobbing on the waves, wooden zone signs, signal flags when all tests pass.
- **Interaction**: buttons sink 1 px when pressed; rows lift and a rope slides in under them; rank
  coins flip on hover; results enter one by one. The helm spins on click, Enter/Space, or a drag
  with enough speed (in either direction). All decorative motion (sway, bob, waves) stops with
  `prefers-reduced-motion`; use `usePrefersReducedMotion` (Motion's hook caches the value).
- **Sound** (`src/lib/sound.ts`, synthesized with Web Audio, no files): wooden creak when the helm
  starts, a ratchet tick per sector, a ship's bell when it stops and two bells when every test
  passes. On by default, muted from the header toggle and stored in `reef-patterns:sound`. Sounds
  only play in response to a user action and are no-ops where Web Audio does not exist.
- Shadows are allowed where they sell a physical object (wood, brass, the helm); keep panels flat
  otherwise.
- Copy stays plain: nautical look, clear words (“Run tests”, not “Weigh anchor”).
- Monaco and Shiki share the “Abyss Reef” palette in `src/lib/editor-theme.ts` (night navy in
  dark, sailcloth in light).

## Accessibility (mandatory)

WCAG 2.2 AA. Full keyboard navigation (including the helm: Enter/Space spins it), visible focus
with `--color-biolum`, `aria-live` on the results panel, contrast verified in both themes,
`prefers-reduced-motion` disables the spin animation (shows the result directly).

## Conventions

- **Example and challenge code: modern JavaScript (ES2023), no TypeScript, no dependencies, no
  DOM APIs** (it runs in a worker). Identifiers in English.
- **Every code comment is written in English**, no exceptions: app, scripts, tests and the JS
  of examples and challenges shown to users. This is the team standard. Example and challenge
  code is shared by all three languages: comments, strings and error messages are in English;
  only the prose (`Localized`) is translated. `runnableChallenge(challenge, locale)` builds the
  test and check names in the active language for the runner.
- **Example and challenge domain: real-world development**, not the nautical theme. Use situations
  developers actually meet: e-commerce (cart, checkout, shipping, discounts, payments), auth and
  sessions, API clients, pagination, notifications, analytics, feature flags, forms, file
  uploads, background jobs, config, logging. Each example tells a concrete story, no `Foo`/`Bar`
  classes, and must make sense without domain knowledge.
- **i18n**: the UI is in English by default and can be switched to Spanish (`es`) and Portuguese
  (`pt-BR`) from the header; the choice is stored in `reef-patterns:locale`. No visible text is
  hardcoded in a component: everything comes from `useI18n().t('key')`. Keys live in
  `src/i18n/messages/en.ts` (source of truth); `es.ts` and `pt-BR.ts` must have exactly the same
  keys (enforced by the `Messages` type). Plurals use `{ one, other }` + `{count}`.
- Tone: plain English; neutral Rioplatense Spanish (“buscá”, “probá”); Brazilian Portuguese.
  Sentence case in all three.
- Components: one component per file, PascalCase name, typed props, no `default export` except
  for lazy loading.
- **Components are always arrow functions** assigned to `const`
  (`export const Button = ({ … }: ButtonProps) => …`). Never `function Button()`; ESLint enforces
  it. For lazy loading: `const MonacoEditor = () => …; export default MonacoEditor;`.
- State: local with hooks; shared state with Context + `useReducer`. Do not add state libraries
  without discussing it first.
- Do not add new dependencies without explaining in the PR why the existing ones are not enough.

## Testing

- Components: React Testing Library, queries by role and accessible text (`getByRole`,
  `getByLabelText`); no class selectors.
- Pure logic (`search`, `pickChallenge`, `expect`, AST checks): unit tests.
- Runner: tests with a fake worker; cover success, failure, exception and timeout.
- **Content** (`pnpm validate:content`, also runs in CI):
  - unique ids, contiguous `rank`, `related` points to existing ids;
  - every text exists in all three languages and lists have the same length in each;
  - each pattern's `example.code` parses with acorn;
  - for each challenge, the `solution` passes every test and check, and the `starterCode` fails
    at least one.
- A PR is not merged with failing tests.

## How to add…

**A pattern**: create `src/content/patterns/<id>.ts` with every text in `en`, `es` and `pt-BR`,
register it in `content/index.ts`, adjust `rank` and run `pnpm validate:content` (it fails if a
language is missing or lists differ in length between languages).

**A challenge**: create `src/content/challenges/<patternId>/<patternId>-<n>.ts` with
`starterCode`, `tests`, `hints` and `solution` (code in English, texts in all 3 languages);
register it in `content/challenges/index.ts`; run `pnpm validate:content`.

## Git

- Main branch `main`. Branches `feat/…`, `fix/…`, `content/…`, `docs/…`, `chore/…`.
- Conventional commits: `feat:`, `fix:`, `content:`, `test:`, `chore:`, `docs:` (also `refactor`, `perf`,
  `style`, `ci`, `build`, `revert`). Enforced by the `commit-msg` hook (`commitlint.config.js`).
- Hooks are installed by `pnpm install` (`prepare: husky`). `pre-push` runs `pnpm lint` and blocks the
  push if it fails. Do not skip hooks with `--no-verify`.
- Every PR fills in `.github/pull_request_template.md` (GitHub loads it automatically); write
  “N/A” for sections that do not apply.
- One PR per iteration. When PRs are stacked, retarget each one to `main` before merging it.
- Update the “Status” section of this file when closing each phase.

## Status

- [x] Phase 0 — Setup
- [x] Phase 1 — Content
- [x] Phase 2 — Catalog
- [x] Phase 3 — Playground and runner
- [x] Phase 4 — Challenges and helm
- [x] Phase 5 — Polish and deploy (GitHub Pages)
- [x] i18n — UI and content in en, es and pt-BR
- [x] Nautical redesign — old ship look, wooden helm, ship sounds

See `docs/PLAN.md` for the details of each phase.
