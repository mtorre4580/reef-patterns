import type { Pattern } from '../types';

export const plugin: Pattern = {
  id: 'plugin',
  rank: 42,
  name: 'Plugin',
  nameEs: 'Complemento',
  category: 'arquitectura',
  tier: 3,
  gof: false,
  summary:
    'Un núcleo estable expone puntos de extensión para que módulos externos agreguen funcionalidad sin modificarlo.',
  when: 'Cuando terceros (o tu propio equipo) necesitan extender una herramienta en formas que no podés anticipar, sin forkear el núcleo.',
  pros: [
    'Núcleo pequeño y estable.',
    'Extensiones independientes, que se activan o desactivan.',
    'Fomenta un ecosistema.',
  ],
  cons: [
    'La API de extensión es un contrato difícil de cambiar.',
    'Plugins mal hechos degradan al sistema entero.',
  ],
  realWorld:
    'Los plugins de Vite, Rollup, Babel, ESLint y Tailwind; las extensiones de VS Code; los hooks de Tapable en webpack.',
  example: {
    title: 'Controlador extensible',
    scenario:
      'El controlador del acuario trae lo básico. La comunidad publica plugins: uno registra lecturas de pH en un log, otro ajusta la luz según la fase lunar.',
    code: `function createReefCore() {
  const hooks = { reading: [], hourTick: [] };
  const api = {
    on(hook, handler) {
      hooks[hook].push(handler);
    },
  };

  return {
    use(plugin) {
      plugin.setup(api); // el plugin solo ve la API pública
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
