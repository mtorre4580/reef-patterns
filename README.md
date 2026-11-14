# Reef Patterns

Web para repasar 52 patrones de diseño orientados a frontend y practicarlos con challenges que
se ejecutan en el navegador. Temática oceánica: arrecife, acuario y buceo.

- **Catálogo**: 52 patrones ordenados por frecuencia de uso, agrupados en zonas de buceo
  (Superficie → Abismo), con búsqueda difusa, filtros sincronizados con la URL y paleta ⌘K.
- **Playground**: editor Monaco, tests que corren en un Web Worker con timeout, chequeos AST,
  pistas, solución y un timón que asigna challenges al azar priorizando los pendientes.

## Desarrollo

```bash
pnpm install
pnpm dev
```

| Comando | Qué hace |
|---|---|
| `pnpm dev` | Servidor de desarrollo |
| `pnpm build` | Typecheck + build de producción |
| `pnpm test` / `pnpm test:run` | Vitest (watch / una vez) |
| `pnpm lint` / `pnpm typecheck` | ESLint / `tsc --noEmit` |
| `pnpm validate:content` | Valida patrones y ejecuta cada challenge (la solución pasa, el starter falla) |

## Deploy

GitHub Pages: el workflow `.github/workflows/deploy.yml` construye y publica en cada push a
`main` (también se puede correr a mano). La app usa `HashRouter` porque Pages no tiene fallback
de SPA, y Vite construye con `base: '/reef-patterns/'`.

Publicada en <https://mtorre4580.github.io/reef-patterns/> (requiere activar Pages con fuente
“GitHub Actions” en *Settings → Pages* la primera vez).

Ver [`CLAUDE.md`](./CLAUDE.md) para el contexto técnico y [`docs/PLAN.md`](./docs/PLAN.md) para
el plan por fases.
