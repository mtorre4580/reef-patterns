import type { Pattern } from '../types';

export const plugin: Pattern = {
  id: 'plugin',
  rank: 42,
  name: 'Plugin',
  localName: { en: 'Plugin', es: 'Complemento', 'pt-BR': 'Plugin' },
  category: 'arquitectura',
  tier: 3,
  gof: false,
  summary: {
    en: 'A stable core exposes extension points so external modules can add features without changing it.',
    es: 'Un núcleo estable expone puntos de extensión para que módulos externos agreguen funcionalidad sin modificarlo.',
    'pt-BR':
      'Um núcleo estável expõe pontos de extensão para que módulos externos adicionem funcionalidade sem modificá-lo.',
  },
  when: {
    en: 'When third parties (or your own team) need to extend a tool in ways you cannot anticipate, without forking the core.',
    es: 'Cuando terceros (o tu propio equipo) necesitan extender una herramienta en formas que no podés anticipar, sin forkear el núcleo.',
    'pt-BR':
      'Quando terceiros (ou seu próprio time) precisam estender uma ferramenta de formas que você não consegue prever, sem fazer fork do núcleo.',
  },
  pros: {
    en: [
      'A small, stable core.',
      'Independent extensions that can be turned on or off.',
      'Encourages an ecosystem.',
    ],
    es: [
      'Núcleo pequeño y estable.',
      'Extensiones independientes, que se activan o desactivan.',
      'Fomenta un ecosistema.',
    ],
    'pt-BR': [
      'Núcleo pequeno e estável.',
      'Extensões independentes, que se ativam ou desativam.',
      'Estimula um ecossistema.',
    ],
  },
  cons: {
    en: [
      'The extension API is a contract that is hard to change.',
      'Badly written plugins degrade the whole system.',
    ],
    es: [
      'La API de extensión es un contrato difícil de cambiar.',
      'Plugins mal hechos degradan al sistema entero.',
    ],
    'pt-BR': [
      'A API de extensão é um contrato difícil de mudar.',
      'Plugins mal feitos degradam o sistema inteiro.',
    ],
  },
  realWorld: {
    en: 'Vite, Rollup, Babel, ESLint and Tailwind plugins; VS Code extensions; Tapable hooks in webpack.',
    es: 'Los plugins de Vite, Rollup, Babel, ESLint y Tailwind; las extensiones de VS Code; los hooks de Tapable en webpack.',
    'pt-BR':
      'Os plugins do Vite, Rollup, Babel, ESLint e Tailwind; as extensões do VS Code; os hooks do Tapable no webpack.',
  },
  example: {
    title: {
      en: 'Extensible controller',
      es: 'Controlador extensible',
      'pt-BR': 'Controlador extensível',
    },
    scenario: {
      en: 'The tank controller ships with the basics. The community publishes plugins: one logs pH readings, another dims the light following the lunar phase.',
      es: 'El controlador del acuario trae lo básico. La comunidad publica plugins: uno registra lecturas de pH en un log, otro ajusta la luz según la fase lunar.',
      'pt-BR':
        'O controlador do aquário traz o básico. A comunidade publica plugins: um registra leituras de pH em um log, outro ajusta a luz conforme a fase da lua.',
    },
    code: `function createReefCore() {
  const hooks = { reading: [], hourTick: [] };
  const api = {
    on(hook, handler) {
      hooks[hook].push(handler);
    },
  };

  return {
    use(plugin) {
      plugin.setup(api); // the plugin only sees the public API
      return this;
    },
    emitReading(reading) {
      hooks.reading.forEach((fn) => fn(reading));
    },
    tick(hour) {
      return hooks.hourTick.reduce((light, fn) => fn(hour, light), 100);
    },
  };
}

const phLogger = {
  name: 'ph-logger',
  log: [],
  setup(api) {
    api.on('reading', (r) => r.param === 'ph' && this.log.push(r.value));
  },
};

const moonlight = {
  name: 'moonlight',
  setup(api) {
    api.on('hourTick', (hour, light) => (hour >= 22 || hour < 6 ? 3 : light));
  },
};

const core = createReefCore().use(phLogger).use(moonlight);
core.emitReading({ param: 'ph', value: 8.1 });
console.log(phLogger.log, core.tick(23), core.tick(12)); // [8.1] 3 100`,
  },
  related: ['middleware', 'observer', 'hexagonal'],
};
