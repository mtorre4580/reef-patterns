# Plan — Reef Patterns

Suggested location in the repo: `docs/PLAN.md`. The permanent technical context lives in `CLAUDE.md`,
which wins whenever the two disagree.

## Goals

1. Any developer can review a pattern in under a minute: search for it, read when to use it and see
   a JavaScript example.
2. They can practice it by solving a challenge that can only be solved by applying the pattern, with
   immediate feedback and no backend.
3. The experience feels like a big-tech product: fast, accessible and clear, with its own
   old-sailing-ship identity.

## Key decisions

| Topic | Decision | Why |
|---|---|---|
| App language | TypeScript | Typing the content model prevents mistakes across 52 patterns and N challenges. The examples users see are still plain JS. |
| UI kit | Tailwind v4 + shadcn/ui | De facto standard; the code lives in the repo and can be themed without fighting the library. |
| Editor | Monaco | It is the VS Code engine: familiar shortcuts, multicursor and autocomplete, like interview platforms. Loaded lazily because it is heavy. |
| Execution | Web Worker + `terminate()` on timeout | Isolates user code from the UI thread and stops infinite loops. |
| Pattern validation | Behavior tests + optional AST rules | Tests verify what only the pattern achieves; AST rules cover what tests cannot (e.g. “no switch” in Strategy). |
| “Dynamic” challenges | `Map<patternId, Challenge[]>` + helm with injectable rng | No backend; randomness is a pure, testable function. |
| Persistence | localStorage | Progress, drafts per challenge, locale and sound preference. |
| Content domain | Real-world development scenarios | Checkout, payments, API clients, feature flags… Nobody needs domain knowledge to understand an exercise. The nautical theme stays in the design. |
| i18n | Custom Context + typed dictionaries | English by default, plus Spanish and Brazilian Portuguese, with no extra dependencies. |
| Deploy | GitHub Pages + `HashRouter` | Free static hosting next to the repo; hash routes avoid 404s on refresh. |

## Visual identity

The direction is an **old sailing ship**: weathered wood, hemp rope, sailcloth, brass fittings and
sea blue. Dark by default (night watch: navy sea, walnut panels, brass lanterns) with a light mode
(deck by day: sailcloth and parchment charts, navy ink). All materials are CSS only, no images.

The four usage tiers are still dive zones: Surface (Essential, 0–10 m), Reef (Widely used,
10–30 m), Drop-off (Situational, 30–60 m) and Abyss (Rare, 60 m+). A sounding-line depth gauge
(rope paying out with a lead weight) marks the zone while browsing the catalog, and each zone has a
wooden sign.

Signature elements:

- The playground wheel is a wooden ship's **helm** with one sector per available pattern: turned
  handles, brass hub, king spoke knot and a brass pointer that flicks per sector.
- A hero sailing ship bobbing on the waves, and signal flags when every test passes.
- Typography: IM Fell English for headings, signs and the helm; Geist for UI text; Geist Mono for
  code.
- Ship sounds synthesized with Web Audio (creak, ratchet tick, ship's bell), muted from the header.
- All decorative motion stops with `prefers-reduced-motion`. Copy stays plain (“Run tests”, not
  “Weigh anchor”).

Screens:

```
Catalog
┌──────────────────────────────────────────────┬────┐
│ Reef Patterns     [⌘K Search]   EN ▾  🔊  ◐  │    │
│ [Creational][Structural][Behavioral]…[GoF]   │ 0m │
│                                              │ ┃  │
│ Surface · 0–10 m                             │ ●  │
│  1  Strategy        Behavioral       GoF  ›  │ ┃  │
│  2  Observer        Behavioral       GoF  ›  │ ┃  │
│ …                                            │60m │
└──────────────────────────────────────────────┴────┘

Playground
┌───────────────────────────┬──────────────────────┐
│ Observer · Easy      [⎈]  │ Results | Console    │
│ ┌───────────────────────┐ │ ✓ notifies everyone  │
│ │ Monaco (JS)           │ │ ✗ unsubscribe…       │
│ │                       │ │                      │
│ └───────────────────────┘ │ Hint · Solution      │
│ [Reset]    [Run ⌘↵]       │                      │
└───────────────────────────┴──────────────────────┘
```

On mobile the playground switches to tabs (Instructions / Code / Results), because a split editor
does not fit in 390 px.

## Phases

All phases below are done; see the “Status” section of `CLAUDE.md`.

### Phase 0 — Setup (½ day)

- Create the project in `/Users/mtorre4580/Desktop/Roadmap/Claude/Patterns`:
  `pnpm create vite@latest . --template react-ts`, `git init`, `.nvmrc`.
- Tailwind v4, shadcn/ui (`pnpm dlx shadcn@latest init`), ESLint flat + Prettier.
- Vitest + RTL + jsdom with `src/test/setup.ts`.
- Scripts from `CLAUDE.md`; GitHub Actions workflow (lint, typecheck, test, build).
- Copy `CLAUDE.md` to the root and this file to `docs/PLAN.md`.

**Done when**: `pnpm lint && pnpm typecheck && pnpm test:run && pnpm build` passes locally and in
CI with a sample test.

### Phase 1 — Content (2–3 days)

- Type model (`Pattern`, `Challenge`, `CategoryId`, `Tier`) in `src/content/types.ts`.
- Migrate the 52 patterns from the original list, one per file, each with a JS example built on a
  real-world development scenario. Priority: tiers 1 and 2 complete first (29 patterns); tiers 3
  and 4 afterwards.
- `scripts/validate-content.ts` and its CI step.

**Done when**: all 52 patterns validate and every example parses.

### Phase 2 — Catalog (2–3 days)

- Layout, light/dark theme, tokens.
- List grouped by zone with `DepthGauge`.
- Filters by category, tier and GoF, synced with the URL (`?cat=…&tier=…`).
- Fuzzy search with Fuse.js and a ⌘K palette with `cmdk`.
- Detail page `/patterns/:id` with the example highlighted by Shiki, related patterns and a
  “Practice this pattern” button.

**Done when**: any pattern can be found by keyboard in fewer than 3 keystrokes from ⌘K, and RTL
tests cover search, filters and navigation.

### Phase 3 — Playground and runner (3–4 days)

- Lazy Monaco with the “Abyss Reef” theme; `Ctrl/⌘ + Enter` runs.
- Runner: worker, `expect`, `fn()` spies, console capture, timeout, AST checks.
- Right panel with Results and Console tabs, `aria-live`, “3 of 5 tests” counter.
- Reset, Show hint (one at a time) and Show solution (with confirmation) buttons.
- Autosaved draft per challenge.

**Done when**: a sample challenge can be solved end to end and the runner tests cover success,
failure, exception, infinite loop and AST rule.

### Phase 4 — Challenges and helm (3–5 days, iterative)

- Pure `pickChallenge` + tests with a fixed rng.
- `Helm` component (SVG + Motion): computes the result before animating, spins on click,
  Enter/Space or a fast enough drag, no animation with reduced motion.
- First batch: 2 challenges per Essential pattern (22). Then tiers 2 and 3.
- Progress: mark as completed, “pending” filter, badge per zone (“Reef zone completed”).

**Done when**: the helm only picks among the active filters, prioritizes pending challenges, and
`validate:content` confirms every solution passes and every starter fails.

### Phase 5 — Polish and deploy (2 days)

- Accessibility audit (axe + keyboard + screen reader) and Lighthouse ≥ 95.
- Code splitting for the playground; the catalog must not load Monaco.
- Themed 404 page, metadata and Open Graph.
- CI quality gates: bundle budget, Playwright + axe in both themes, Lighthouse CI, `pnpm audit`,
  dependency review, CodeQL and Dependabot.
- Deploy to GitHub Pages (`base: '/reef-patterns/'`) from `deploy.yml` after CI passes on `main`.

### i18n — en, es, pt-BR

- `I18nProvider`, `useI18n` and `LanguageSwitcher`; keys in `src/i18n/messages/en.ts`, with `es`
  and `pt-BR` forced to the same keys by the `Messages` type.
- Every visible content text becomes `Localized<T>`; example and challenge code stays in English.
- Runner messages and test names follow the active locale.

### Nautical redesign

- Ship materials (`wood`, `planks`, `rope`, `parchment`, `brass`, `sea`), wooden helm, sounding-line
  gauge, hero ship, signal flags and synthesized ship sounds.

### Later

- More challenges: a second one for every tier 2 pattern, then tiers 3 and 4.
- Per-challenge visualizations (for example, the cart badge, analytics and storage reacting to each
  Observer notification).
- Offline PWA.
- Share a solution through an encoded URL.

## Examples per pattern (tiers 1 and 2)

| Pattern | Scenario |
|---|---|
| Strategy | Checkout shipping options (standard, express, store pickup) that marketing can extend. |
| Observer | Adding to the cart notifies the header badge, analytics and storage sync. |
| Factory Method | Create the user's chosen notification channel: email, SMS or push. |
| Singleton | One API client sharing the base URL and the current auth token. |
| Decorator | Add auth headers and logging to a base fetcher without a subclass per combination. |
| Adapter | Two payment providers with different amount formats and field names, one shape for the UI. |
| Facade | Place an order in one call: reserve stock, charge the card, send the confirmation. |
| Dependency Injection | A user service that gets the real HTTP client in production and a fake in tests. |
| Builder | Report queries with optional filters, sorting and limits, without string concatenation. |
| Module | An analytics queue that batches events and keeps the queue private. |
| Iterator | Walk cursor-paginated orders one by one and stop at the first refund. |
| Composite | Folder sizes where folders contain files or other folders. |
| Command | Undo for typing and deleting in a notes editor. |
| Proxy | Cache exchange rates from a paid per-request API. |
| Repository | Todo tasks in memory for tests and in localStorage in the browser, same API. |
| MVC | Task model with overdue logic, a text view and a controller for user input. |
| MVVM | Signup ViewModel that turns raw field values into error messages and button state. |
| Pub/Sub | Micro-frontends (header, catalog, cart) talking through a topic-based event bus. |
| Chain of Responsibility | API error handlers mapping thrown errors to 400, 404, 401 or 500. |
| Template Method | CSV and JSON exports sharing the same load, filter, format and header steps. |
| State | Order lifecycle: pending, paid, shipped, delivered; cancel only before shipping. |
| Abstract Factory | Cloud storage + managed queue in production, disk + in-memory queue locally. |
| Custom Hooks | A data-fetching hook that wraps loading, error and abort on unmount. |
| Provider | Current user and logout available to the whole tree without prop drilling. |
| Flux | Product page, mini cart and checkout changing the same cart through actions. |
| Container / Presentational | `UserListContainer` fetches users; `UserList` only draws them. |
| Compound Components | Settings tabs that share the active tab with any layout. |
| Higher-Order Component | `withFeatureFlag` renders a component only when its flag is on. |
| Render Props | Shared fetching logic feeding a table on one page and a card on another. |

Tier 3 and 4 backend architecture patterns (Saga, CQRS, Unit of Work, Event Sourcing) stay in the
catalog with a simulated in-memory example; their challenges come last.

## First batch of challenges

24 challenges: two per Essential pattern, plus Command and State. Some examples:

- **Observer · Cart that notifies the UI**: `subscribe` returns a function to unsubscribe. Tests
  verify that every subscriber gets the update and that an unsubscribed one does not.
- **Strategy · Shipping cost calculator**: the calculator receives a strategy. AST rule: no
  `switch`. Tests add a new strategy without touching the calculator.
- **Singleton · A single API client**: every call returns the same instance and its state persists
  between calls.
- **State · Order lifecycle**: valid transitions between states and an error when trying to ship an
  unpaid order or cancel a shipped one.
- **Command · Text editor with undo**: `execute`, `undo` and history; tests undo several edits and
  verify the text.

## Risks

| Risk | Mitigation |
|---|---|
| Tests that can be passed without applying the pattern | Design tests around behavior exclusive to the pattern and add AST rules; review each challenge against a “cheating” solution. |
| Monaco is heavy on mobile | Lazy load and tabs on mobile; fall back to CodeMirror if the bundle is a concern. |
| Content volume (52 patterns + challenges, in three languages) | Prioritize tiers 1–2, a per-file template and automated validation (including same keys and list lengths per language). |
| Theme overshadowing clarity | Functional copy first; the nautical look lives in the design, never in example domains or action labels. |
