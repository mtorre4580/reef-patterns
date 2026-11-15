# Contributing to Reef Patterns

Thanks for helping! New challenges, translations, fixes and ideas are all welcome.

## Before you start

- Requires Node 24 (`.nvmrc`) and **pnpm** (never npm or yarn).
- `pnpm install` also installs the git hooks: commit messages follow Conventional Commits and
  `pre-push` runs lint and tests.
- Read [`CLAUDE.md`](./CLAUDE.md): it has the content model, the runner, the design rules and the
  code conventions.

## Good first contributions

- **A new challenge** for a pattern that has none yet. Create
  `src/content/challenges/<patternId>/<patternId>-<n>.ts` with `starterCode`, `tests`, `hints` and
  `solution`, register it in `src/content/challenges/index.ts` and run `pnpm validate:content`
  (the solution must pass every test and the starter must fail at least one).
- **Translation fixes** in `src/i18n/messages/{es,pt-BR}.ts` or in the `Localized` texts of a
  pattern.
- **Bug reports** with the steps to reproduce, browser and theme.

## Rules that keep the content consistent

- Example and challenge code is plain modern JavaScript (ES2023): no TypeScript, no dependencies,
  no DOM APIs. Identifiers and comments in English.
- Scenarios come from real development work (checkout, payments, API clients, notifications,
  forms…), never `Foo`/`Bar`.
- Tests check behavior that only the pattern achieves, not the exact shape of the code.
- Every visible text exists in `en`, `es` and `pt-BR`, with lists of the same length.

## Pull requests

1. Branch from `main`: `feat/…`, `fix/…`, `content/…`, `docs/…`, `chore/…`.
2. Run `pnpm lint`, `pnpm typecheck`, `pnpm test:run` and `pnpm validate:content`.
3. Fill in the pull request template (write “N/A” for sections that do not apply).
