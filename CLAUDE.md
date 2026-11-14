# CLAUDE.md — Reef Patterns

Guía de contexto para trabajar en este repo. Leela completa antes de tocar código.

## Qué es

Web para que cualquier dev repase patrones de diseño, orientada a frontend.
Tiene dos partes:

1. **Catálogo**: 52 patrones ordenados por frecuencia de uso, con buscador, filtros por grupo y
   detalle (cuándo usarlo, beneficios, contras, ejemplo en JavaScript).
2. **Playground**: editor tipo VS Code a la izquierda y panel de resultados a la derecha. El usuario
   gira un timón (rueda) que elige un challenge al azar que obliga a aplicar un patrón, escribe la
   solución y los tests se ejecutan en el navegador. No hay backend.

Todo el contenido y el diseño tienen temática oceánica: mar, arrecife, acuario de arrecife (reef) y
buceo. Los ejemplos de código usan ese dominio (sensores de acuario, dosificadoras, corales,
computadoras de buceo, etc.).

## Stack

| Área | Elección | Notas |
|---|---|---|
| Runtime | Node LTS (24) | `.nvmrc` en la raíz |
| Paquetes | pnpm | Nunca usar npm ni yarn. Commitear `pnpm-lock.yaml` |
| Build | Vite (última estable) + `@vitejs/plugin-react` | |
| UI | React 19 | Componentes funcionales y hooks únicamente |
| Lenguaje de la app | TypeScript estricto | Los **ejemplos y challenges** son JavaScript puro (ver Convenciones) |
| Estilos | Tailwind CSS v4 (`@tailwindcss/vite`) | Tokens en `src/styles/theme.css` con `@theme` |
| Componentes base | shadcn/ui (primitivas Radix) | Se copian a `src/components/ui`, se adaptan al tema |
| Íconos | lucide-react | |
| Animación | Motion (`motion/react`) | Respetar `prefers-reduced-motion` |
| Routing | React Router (modo librería) | |
| Búsqueda | Fuse.js + paleta de comandos `cmdk` (⌘K) | |
| Editor | Monaco vía `@monaco-editor/react` | Cargado con `React.lazy`; Monaco local, no CDN |
| Resaltado de código (solo lectura) | Shiki | Tema propio “Abyss Reef” |
| Ejecución de challenges | Web Worker + mini librería de asserts propia | Ver “Runner” |
| Chequeos estáticos | acorn + acorn-walk | Reglas AST por challenge |
| Tests | Vitest + React Testing Library + `@testing-library/user-event` + jsdom | |
| Lint/format | ESLint (flat config) + Prettier | |
| CI | GitHub Actions | lint, typecheck, test, build |
| Deploy | Vercel (o GitHub Pages con `HashRouter`) | Decidir en Fase 5 |

## Comandos

```bash
pnpm install
pnpm dev            # servidor de desarrollo
pnpm build          # build de producción
pnpm preview        # previsualizar el build
pnpm test           # Vitest en modo watch
pnpm test:run       # Vitest una vez (CI)
pnpm lint
pnpm typecheck      # tsc --noEmit
pnpm validate:content   # verifica patrones y challenges (ver Testing)
```

## Estructura

```
src/
  app/                 # router, providers, layout raíz
  components/ui/       # shadcn/ui adaptados al tema
  components/          # componentes compartidos (DepthGauge, CodeBlock, Helm…)
  features/
    catalog/           # lista, filtros, búsqueda, detalle de patrón
    playground/        # editor, panel de resultados, rueda, runner
    progress/          # progreso del usuario (localStorage)
  content/
    categories.ts
    tiers.ts
    patterns/<id>.ts   # un archivo por patrón
    challenges/<patternId>/<challengeId>.ts
    index.ts           # registro: patterns, patternsById, challengesByPattern
  lib/
    runner/            # worker, asserts, chequeos AST, tipos de resultado
    search.ts
    random.ts          # rng inyectable para la rueda
  styles/theme.css
  test/                # setup de Vitest y helpers
scripts/
  validate-content.ts
```

Regla: cada feature exporta su API pública desde `features/<x>/index.ts`. No importar archivos
internos de otra feature.

## Modelo de contenido

```ts
type CategoryId = 'creacional' | 'estructural' | 'comportamiento'
  | 'arquitectura' | 'resiliencia' | 'frontend';
type Tier = 1 | 2 | 3 | 4; // 1 Esencial … 4 Poco común

interface Pattern {
  id: string;            // kebab-case, estable: se usa en URLs
  rank: number;          // orden global 1..N, sin huecos
  name: string;          // nombre canónico en inglés (Strategy)
  nameEs: string;        // nombre en español (Estrategia)
  category: CategoryId;
  tier: Tier;
  gof: boolean;
  summary: string;       // 1 oración
  when: string;          // cuándo usarlo
  pros: string[];        // 2-4
  cons: string[];        // 2-4
  realWorld: string;     // dónde aparece en el ecosistema JS
  example: { title: string; scenario: string; code: string }; // JS, temática oceánica
  related: string[];     // ids existentes
}

interface Challenge {
  id: string;            // `${patternId}-${n}`
  patternId: string;
  title: string;
  difficulty: 'facil' | 'media' | 'dificil';
  story: string;         // contexto narrativo oceánico
  instructions: string;  // qué debe implementar, con nombres exactos de API
  starterCode: string;   // JS
  tests: { name: string; code: string }[];   // usan expect() del runner
  checks?: AstCheck[];   // reglas estáticas opcionales
  hints: string[];
  solution: string;      // JS, debe pasar todos los tests
}
```

Los 52 patrones y su orden vienen del listado original (Esencial → Poco común). Si se agrega uno,
recalcular `rank` y correr `pnpm validate:content`.

`challengesByPattern` es un `Map<string, Challenge[]>` construido en `content/index.ts`. La rueda
nunca accede a challenges por otra vía.

## Runner (ejecución de código del usuario)

- Corre en un **Web Worker** creado con
  `new Worker(new URL('./runner.worker.ts', import.meta.url), { type: 'module' })`.
- Entrada: `{ code, tests, timeoutMs }`. El worker arma un único script con el código del
  usuario seguido de cada test, lo ejecuta con `new Function` y devuelve
  `{ results: { name, passed, error? }[], logs: { level, args }[], durationMs }`.
- `console.*` se intercepta dentro del worker y se reenvía al panel Consola.
- Timeout por defecto 2000 ms: el hilo principal hace `worker.terminate()` y reporta
  “Tiempo agotado: ¿hay un bucle infinito?”. Se crea un worker nuevo por ejecución.
- `lib/runner/expect.ts`: `toBe`, `toEqual` (deep), `toBeTruthy`, `toThrow`,
  `toHaveBeenCalled`/`toHaveBeenCalledTimes` con un `fn()` espía propio. Nada más sin necesidad.
- Chequeos AST (acorn) corren en el worker antes de los tests. Reglas soportadas:
  `forbidNode` (p. ej. `SwitchStatement`), `requireClass`, `requireMethod`,
  `maxIfStatements`. Un chequeo fallido se muestra como resultado más, con su mensaje.
- Los tests deben verificar **comportamiento que solo se logra aplicando el patrón**
  (p. ej. Singleton: dos llamadas devuelven la misma instancia; Observer: un suscriptor
  desuscripto no recibe notificaciones), no la forma exacta del código.

## Rueda (timón)

- `pickChallenge(pool, completedIds, rng)` en `features/playground/pick.ts` es una función pura.
  `rng` se inyecta (por defecto `Math.random`) para poder testearla.
- Pool = challenges de los patrones que pasan los filtros activos. Prioriza los no completados;
  si están todos completos, elige entre todos.
- La animación del timón es solo visual: el resultado se calcula **antes** de animar y la
  animación termina en el sector elegido.
- Progreso y borradores en `localStorage` con claves `reef-patterns:progress` y
  `reef-patterns:draft:<challengeId>`, siempre envueltos en try/catch.

## Diseño

Dirección: minimalista, oscuro por defecto, con modo claro. La metáfora central es la
**profundidad**: los niveles de uso son zonas de buceo.

| Tier | Nombre | Zona | Profundidad mostrada |
|---|---|---|---|
| 1 | Esencial | Superficie | 0–10 m |
| 2 | Muy usado | Arrecife | 10–30 m |
| 3 | Situacional | Drop-off | 30–60 m |
| 4 | Poco común | Abismo | 60 m+ |

- Un profundímetro (`DepthGauge`) fijo en el lateral indica la zona mientras se scrollea el
  catálogo; el fondo se oscurece levemente con la profundidad. Es el único elemento “wow”:
  todo lo demás es sobrio.
- Tokens en `src/styles/theme.css` (definir en `@theme`, valores oscuros por defecto):
  - `--color-abyss` fondo, `--color-trench` superficies, `--color-current` bordes,
    `--color-foam` texto, `--color-kelp` texto secundario,
    `--color-lagoon` acento interactivo (turquesa), `--color-biolum` foco y estados activos,
    `--color-coral` errores y tests fallidos, `--color-anemone` tests aprobados.
  - Colores por categoría: `--cat-<id>`; nunca transmitir información solo por color.
- Tipografía: Geist (UI) y Geist Mono (código). Escala modular 1.25.
- Radios: 6 px controles, 12 px paneles. Sin sombras genéricas: la profundidad se marca con
  luminosidad de superficie, no con `box-shadow`.
- Motion: transiciones de 150–250 ms, solo como respuesta a acciones; View Transitions al
  navegar entre catálogo y detalle cuando el navegador lo soporte.
- Iconografía y copy náuticos con moderación: el texto debe seguir siendo claro para alguien
  que no bucea (“Ejecutar tests”, no “Sumergirse”).
- Monaco y Shiki comparten el tema “Abyss Reef” definido en `src/lib/editor-theme.ts`.

## Accesibilidad (obligatorio)

WCAG 2.2 AA. Navegación completa por teclado (incluida la rueda: Enter/Espacio la gira), foco
visible con `--color-biolum`, `aria-live` en el panel de resultados, contraste verificado en
ambos temas, `prefers-reduced-motion` desactiva el giro animado (muestra el resultado directo).

## Convenciones

- **Código de ejemplos y challenges: JavaScript moderno (ES2023), sin TypeScript, sin
  dependencias, sin APIs del DOM** (corre en un worker). Identificadores en inglés;
  comentarios y textos en español.
- Dominio de los ejemplos: acuario de arrecife (sensores de temperatura, salinidad, pH,
  dosificadoras de kalkwasser o métodos tipo Triton, skimmer, ATO, iluminación, corales SPS/LPS/
  blandos, fragging) y buceo (computadora de buceo, paradas de seguridad, plan de inmersión,
  equipo, log de inmersiones). Cada ejemplo cuenta una situación concreta, no clases `Foo`/`Bar`.
- UI en español rioplatense neutro (“buscá”, “probá”), sentence case.
- Componentes: un componente por archivo, nombre en PascalCase, props tipadas, sin `default
  export` salvo rutas lazy.
- Estado: local con hooks; estado compartido con Context + `useReducer`. No agregar librerías de
  estado sin discutirlo.
- No agregar dependencias nuevas sin justificar en el PR por qué no alcanza con lo existente.

## Testing

- Componentes: React Testing Library, consultas por rol y texto accesible
  (`getByRole`, `getByLabelText`); nada de selectores por clase.
- Lógica pura (`search`, `pickChallenge`, `expect`, chequeos AST): tests unitarios.
- Runner: tests con un worker simulado; cubrir éxito, fallo, excepción y timeout.
- **Contenido** (`pnpm validate:content`, también corre en CI):
  - ids únicos, `rank` contiguo, `related` apunta a ids existentes;
  - el `example.code` de cada patrón parsea con acorn;
  - para cada challenge, la `solution` pasa todos los tests y chequeos, y el `starterCode`
    falla al menos uno.
- Un PR no se mergea con tests en rojo.

## Cómo agregar…

**Un patrón**: crear `src/content/patterns/<id>.ts`, registrarlo en `content/index.ts`, ajustar
`rank` y correr `pnpm validate:content`.

**Un challenge**: crear `src/content/challenges/<patternId>/<patternId>-<n>.ts` con
`starterCode`, `tests`, `hints` y `solution`; registrarlo; correr `pnpm validate:content`.

## Git

- Rama principal `main`. Ramas `feat/…`, `fix/…`, `content/…`.
- Commits convencionales: `feat:`, `fix:`, `content:`, `test:`, `chore:`, `docs:`.
- Actualizar la sección “Estado” de este archivo al cerrar cada fase.

## Estado

- [ ] Fase 0 — Setup
- [ ] Fase 1 — Contenido
- [ ] Fase 2 — Catálogo
- [ ] Fase 3 — Playground y runner
- [ ] Fase 4 — Challenges y rueda
- [ ] Fase 5 — Pulido y deploy

Ver `docs/PLAN.md` para el detalle de cada fase.
