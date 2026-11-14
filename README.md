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

Vercel (`vercel.json` incluido): importá el repo en Vercel; detecta Vite, instala con pnpm y
reescribe las rutas del SPA a `index.html`. Si el dominio final no es
`reef-patterns.vercel.app`, actualizá `canonical` y las URLs de Open Graph en `index.html`.

Ver [`CLAUDE.md`](./CLAUDE.md) para el contexto técnico y [`docs/PLAN.md`](./docs/PLAN.md) para
el plan por fases.
