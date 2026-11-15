# Reef Patterns

A website to review 52 frontend-oriented design patterns and practice them with challenges that
run in the browser. The design is an old sailing ship; the examples and challenges use real-world
situations (checkout, payments, API clients, notifications, feature flags…).

**Live:** <https://mtorre4580.github.io/reef-patterns/>

- **Catalog**: 52 patterns sorted by how often they are used, grouped into dive zones
  (Surface → Abyss), with fuzzy search, URL-synced filters and a ⌘K command palette.
- **Playground**: Monaco editor, tests that run in a Web Worker with a timeout, AST checks,
  hints, solutions and a ship's helm that assigns random challenges, unsolved ones first.
- **Languages**: English (default), Spanish and Brazilian Portuguese, for both UI and content.

## Development

Requires Node 24 (see `.nvmrc`) and pnpm.

```bash
pnpm install
pnpm dev
```

| Command | What it does |
|---|---|
| `pnpm dev` | Development server |
| `pnpm build` | Typecheck + production build |
| `pnpm preview` | Serves the build under `/reef-patterns/` |
| `pnpm test` / `pnpm test:run` | Vitest (watch / once) |
| `pnpm lint` / `pnpm typecheck` | ESLint / `tsc --noEmit` |
| `pnpm validate:content` | Validates patterns and runs every challenge (the solution passes, the starter fails) |

## Deploy

GitHub Pages: the `.github/workflows/deploy.yml` workflow builds and publishes on every push to
`main` (it can also be run manually). The app uses `HashRouter` because Pages has no SPA
fallback, and Vite builds with `base: '/reef-patterns/'`.

## Contributing

See [`CLAUDE.md`](./CLAUDE.md) for the technical context and conventions (English code comments,
arrow-function components, i18n rules) and [`docs/PLAN.md`](./docs/PLAN.md) for the original
phase plan.
