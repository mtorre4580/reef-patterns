# Plan — Reef Patterns

Ubicación sugerida en el repo: `docs/PLAN.md`. El contexto técnico permanente está en `CLAUDE.md`.

## Objetivos

1. Cualquier dev puede repasar un patrón en menos de un minuto: buscarlo, leer cuándo usarlo y ver
   un ejemplo en JavaScript.
2. Puede practicarlo resolviendo un challenge que solo se resuelve aplicando el patrón, con
   feedback inmediato y sin backend.
3. La experiencia se siente como un producto de big tech: rápida, accesible, minimalista, con una
   identidad oceánica propia.

## Decisiones clave

| Tema | Decisión | Por qué |
|---|---|---|
| Lenguaje de la app | TypeScript | Tipar el modelo de contenido evita errores en 52 patrones y N challenges. Los ejemplos que ve el usuario siguen siendo JS puro. |
| UI kit | Tailwind v4 + shadcn/ui | Estándar de facto; el código queda en el repo y se tematiza sin pelear con la librería. |
| Editor | Monaco | Es el motor de VS Code: atajos, multicursor y autocompletado familiares, como en las plataformas de entrevistas. Se carga lazy porque pesa. |
| Ejecución | Web Worker + `terminate()` por timeout | Aísla el código del usuario del hilo de UI y corta bucles infinitos. |
| Validación del patrón | Tests de comportamiento + reglas AST opcionales | Los tests verifican lo que solo el patrón logra; las reglas AST cubren lo que los tests no pueden (p. ej. “sin switch” en Strategy). |
| Challenges “dinámicos” | `Map<patternId, Challenge[]>` + rueda con rng inyectable | Sin backend; la aleatoriedad es una función pura testeable. |
| Persistencia | localStorage | Progreso y borradores por challenge. |

## Identidad visual

La metáfora es **descender**. Los cuatro niveles de uso son zonas de buceo: Superficie
(Esencial), Arrecife (Muy usado), Drop-off (Situacional) y Abismo (Poco común). Un profundímetro
lateral marca la zona mientras se recorre el catálogo, y el fondo se oscurece apenas con la
profundidad. Ese es el único gesto expresivo; el resto es silencioso: superficies planas, bordes
finos, mucho aire, tipografía Geist, oscuro por defecto.

La rueda del playground es un **timón** de barco con un sector por patrón disponible. En modo
claro la paleta pasa a arena y laguna; en oscuro, abismo y bioluminiscencia.

Pantallas:

```
Catálogo
┌──────────────────────────────────────────────┬────┐
│ Reef Patterns            [⌘K Buscar]   ◐     │    │
│ [Creacional][Estructural][Comport.]…[GoF]    │ 0m │
│                                              │ ┃  │
│ Superficie · 0–10 m                          │ ●  │
│  1  Strategy        Comportamiento   GoF  ›  │ ┃  │
│  2  Observer        Comportamiento   GoF  ›  │ ┃  │
│ …                                            │60m │
└──────────────────────────────────────────────┴────┘

Playground
┌───────────────────────────┬──────────────────────┐
│ Observer · Media     [⎈]  │ Resultados | Consola │
│ ┌───────────────────────┐ │ ✓ notifica a todos   │
│ │ Monaco (JS)           │ │ ✗ unsubscribe…       │
│ │                       │ │                      │
│ └───────────────────────┘ │ Pista · Solución     │
│ [Reiniciar] [Ejecutar ⌘↵] │                      │
└───────────────────────────┴──────────────────────┘
```

En mobile el playground pasa a pestañas (Enunciado / Código / Resultados), porque un editor
dividido no entra en 390 px.

## Fases

### Fase 0 — Setup (½ día)

- Crear el proyecto en `/Users/mtorre4580/Desktop/Roadmap/Claude/Patterns`:
  `pnpm create vite@latest . --template react-ts`, `git init`, `.nvmrc`.
- Tailwind v4, shadcn/ui (`pnpm dlx shadcn@latest init`), ESLint flat + Prettier.
- Vitest + RTL + jsdom con `src/test/setup.ts`.
- Scripts del `CLAUDE.md`; workflow de GitHub Actions (lint, typecheck, test, build).
- Copiar `CLAUDE.md` a la raíz y este archivo a `docs/PLAN.md`.

**Listo cuando**: `pnpm lint && pnpm typecheck && pnpm test:run && pnpm build` pasa en local y en
CI con un test de ejemplo.

### Fase 1 — Contenido (2–3 días)

- Modelo de tipos (`Pattern`, `Challenge`, `CategoryId`, `Tier`) en `src/content/types.ts`.
- Migrar los 52 patrones del listado original, uno por archivo, con su ejemplo JS oceánico.
  Prioridad: tiers 1 y 2 completos primero (29 patrones); tiers 3 y 4 después.
- `scripts/validate-content.ts` y su paso en CI.

**Listo cuando**: los 52 patrones validan y cada ejemplo parsea.

### Fase 2 — Catálogo (2–3 días)

- Layout, tema claro/oscuro, tokens.
- Lista agrupada por zona con `DepthGauge`.
- Filtros por categoría, nivel y GoF, sincronizados con la URL (`?cat=…&tier=…`).
- Búsqueda difusa con Fuse.js y paleta ⌘K con `cmdk`.
- Página de detalle `/patterns/:id` con ejemplo resaltado por Shiki, relacionados y botón
  “Practicar este patrón”.

**Listo cuando**: se puede encontrar cualquier patrón por teclado en menos de 3 pulsaciones
desde ⌘K, y los tests de RTL cubren búsqueda, filtros y navegación.

### Fase 3 — Playground y runner (3–4 días)

- Monaco lazy con tema “Abyss Reef”, `Ctrl/⌘ + Enter` ejecuta.
- Runner: worker, `expect`, espías `fn()`, captura de consola, timeout, chequeos AST.
- Panel derecho con pestañas Resultados y Consola, `aria-live`, contador “3 de 5 tests”.
- Botones Reiniciar, Ver pista (de a una), Ver solución (con confirmación).
- Borrador autoguardado por challenge.

**Listo cuando**: un challenge de prueba se puede resolver de punta a punta y los tests del runner
cubren éxito, fallo, excepción, bucle infinito y regla AST.

### Fase 4 — Challenges y rueda (3–5 días, iterativo)

- `pickChallenge` puro + tests con rng fijo.
- Componente `Helm` (SVG + Motion): calcula el resultado antes de animar, accesible por teclado,
  sin animación con movimiento reducido.
- Primer lote: 2 challenges por cada patrón Esencial (22). Luego tiers 2 y 3.
- Progreso: marcar completado, filtro “pendientes”, insignia por zona (“Zona Arrecife
  completada”).

**Listo cuando**: el timón elige solo entre los filtros activos, prioriza pendientes, y
`validate:content` confirma que cada solución pasa y cada starter falla.

### Fase 5 — Pulido y deploy (2 días)

- Auditoría de accesibilidad (axe + teclado + lector de pantalla) y Lighthouse ≥ 95.
- Code splitting del playground; el catálogo no debe cargar Monaco.
- Página 404 temática, metadatos y Open Graph.
- Deploy en Vercel conectado al repo.

### Después

Visualizaciones por challenge (por ejemplo, peces que reaccionan a cada notificación del
Observer), versión en inglés, PWA offline, compartir solución por URL codificada.

## Ejemplos por patrón (tiers 1 y 2)

| Patrón | Escenario |
|---|---|
| Strategy | Métodos de dosificación intercambiables: kalkwasser, Balling o tipo Triton, según el consumo de calcio. |
| Observer | Sensor de temperatura que notifica al calentador, a la alarma y a la app del celular. |
| Factory Method | `createCoral(type)` devuelve un SPS, LPS o blando con sus requisitos de luz y flujo. |
| Singleton | Un único `ReefController` que maneja el estado de todos los equipos. |
| Decorator | Equipo de buceo: traje base + linterna + cámara, cada uno suma capacidades. |
| Adapter | Unificar lecturas de distintos test kits que reportan dKH o ppm. |
| Facade | `maintenanceMode()` apaga bombas, skimmer y ATO, y los restaura al salir. |
| Dependency Injection | Inyectar un sensor real o uno simulado al monitor de parámetros. |
| Builder | Armar un plan de inmersión: sitio, profundidad máxima, gases, paradas. |
| Module | Módulo `salinity` con estado privado y API pública de lectura. |
| Iterator | Recorrer el log de inmersiones de forma perezosa, por página. |
| Composite | Un arrecife con colonias que contienen frags; calcular el total de pólipos. |
| Command | Dosificadora con historial y deshacer de la última dosis. |
| Proxy | Caché de resultados de un análisis de agua caro (tipo ICP). |
| Repository | `CoralRepository` en memoria o sobre localStorage, misma API. |
| MVC / MVVM | Panel de parámetros: modelo de lecturas, vista y su ViewModel. |
| Pub/Sub | Bus de eventos del sistema: `tide:change`, `light:sunrise`, `feed:start`. |
| Chain of Responsibility | Alarmas en cadena: la temperatura pasa por aviso, alerta y apagado. |
| Template Method | Rutina de cambio de agua con pasos fijos y pasos propios por acuario. |
| State | Computadora de buceo: descenso, fondo, ascenso, parada de seguridad. |
| Abstract Factory | Kit de iluminación por marca: lámpara, controlador y perfil compatibles. |
| Custom Hooks | `useWaterParams()` que encapsula lectura, polling y estado. |
| Provider | `ReefProvider` que expone las unidades preferidas (°C/°F, ppt/SG). |
| Flux | Store del acuario con acciones `DOSE`, `READ_PARAM`, `TOGGLE_PUMP`. |
| Container / Presentational | `CoralListContainer` obtiene datos; `CoralList` solo los muestra. |
| Compound Components | `<Tank>`, `<Tank.Light>`, `<Tank.Pump>` que comparten estado. |
| HOC / Render Props | `withUnits(Component)` y su versión con render prop, para comparar. |

Los patrones de tier 3 y 4 de arquitectura de backend (Saga, CQRS, Unit of Work, Event Sourcing)
se mantienen en el catálogo con un ejemplo simulado en memoria; sus challenges van al final.

## Primer lote de challenges (ejemplos)

- **Observer · Alarma de temperatura**: implementar `TemperatureSensor` con `subscribe` que
  devuelva una función para desuscribirse. Los tests verifican que todos los suscriptores reciben
  la lectura y que uno desuscripto no.
- **Strategy · Dosificadora**: `Doser` recibe una estrategia y calcula la dosis diaria. Regla
  AST: sin `switch` ni más de un `if`. Los tests agregan una estrategia nueva sin tocar `Doser`.
- **Singleton · Controlador**: `getController()` siempre devuelve la misma instancia y su estado
  persiste entre llamadas.
- **State · Computadora de buceo**: transiciones válidas entre fases y error al intentar
  ascender sin pasar por la parada de seguridad.
- **Command · Dosificadora con deshacer**: `execute`, `undo` e historial; los tests deshacen dos
  dosis y verifican el total.

## Riesgos

| Riesgo | Mitigación |
|---|---|
| Tests que se pueden pasar sin aplicar el patrón | Diseñar tests sobre comportamiento exclusivo del patrón y sumar reglas AST; revisar cada challenge con una solución “tramposa”. |
| Monaco pesado en mobile | Lazy load y pestañas en mobile; fallback a CodeMirror si el bundle preocupa. |
| Volumen de contenido (52 patrones + challenges) | Priorizar tiers 1–2, plantilla por archivo y validación automática. |
| Temática que opaque la claridad | Copy funcional primero; lo náutico en ejemplos e ilustración, no en etiquetas de acciones. |
