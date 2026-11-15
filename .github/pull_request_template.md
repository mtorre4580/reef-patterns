<!--
  Thanks for contributing to Reef Patterns!
  Fill in every section. Write "N/A" when a section does not apply instead of deleting it.
  The PR title must follow Conventional Commits, e.g. `feat: add command palette shortcuts`.
-->

## Summary

<!-- What does this PR do and why? 1–3 sentences focused on the problem and the outcome. -->

Closes #

## Type of change

<!-- Check every option that applies. -->

- [ ] `feat` — new feature
- [ ] `fix` — bug fix
- [ ] `content` — new or updated pattern / challenge
- [ ] `refactor` — code change with no behavior change
- [ ] `perf` — performance improvement
- [ ] `style` — formatting or visual-only change
- [ ] `test` — tests only
- [ ] `docs` — documentation only
- [ ] `chore` / `build` / `ci` — tooling, dependencies or pipeline
- [ ] **Breaking change** — existing behavior, URLs or stored data (`localStorage`) change

## Changes

<!-- Bullet list of the main changes. Mention files or areas reviewers should focus on. -->

-

## Screenshots / recordings

<!-- Required for UI changes: show both themes. Write "N/A" otherwise. -->

| Theme | Before | After |
| ----- | ------ | ----- |
| Dark  |        |       |
| Light |        |       |

## How to test

<!-- Steps a reviewer can follow to verify the change locally. -->

1. `pnpm install && pnpm dev`
2.
3.

## Checklist

### Quality

- [ ] `pnpm lint` and `pnpm typecheck` pass
- [ ] `pnpm test:run` passes and new logic is covered by tests
- [ ] `pnpm build` and `pnpm check:bundle` pass (bundle within budget)

### Content _(only if patterns or challenges changed)_

- [ ] `pnpm validate:content` passes
- [ ] Every text exists in `en`, `es` and `pt-BR`, with the same list lengths
- [ ] Example / challenge code is plain ES2023 JavaScript: no TypeScript, no DOM APIs, no dependencies
- [ ] The scenario is a real-world development situation (no `Foo` / `Bar`, no nautical domain)
- [ ] Tests check behavior that only the pattern achieves; `rank` recomputed when adding a pattern

### i18n

- [ ] No hardcoded visible text: everything goes through `useI18n().t('key')`
- [ ] New keys added to `en.ts`, `es.ts` and `pt-BR.ts`

### Accessibility & UX _(only if the UI changed)_

- [ ] Fully usable with the keyboard, with visible focus
- [ ] Checked in dark and light themes; information is not conveyed by color alone
- [ ] Decorative motion stops with `prefers-reduced-motion`
- [ ] `pnpm test:e2e` (Playwright + axe) passes

### Conventions

- [ ] Components are arrow functions assigned to `const`, one per file, with typed props
- [ ] All code comments are in English
- [ ] Cross-feature imports go only through `features/<x>/index.ts`
- [ ] Branch name and commits follow the conventions; hooks were not skipped (`--no-verify`)

### Docs

- [ ] `CLAUDE.md` / `docs/PLAN.md` updated if behavior, structure or phase status changed

## Dependencies added

<!-- Name each new dependency and explain why the existing ones are not enough. Write "None" otherwise. -->

None

## Notes for reviewers

<!-- Risks, trade-offs, follow-ups or anything that needs special attention. -->
