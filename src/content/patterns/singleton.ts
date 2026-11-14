import type { Pattern } from '../types';

export const singleton: Pattern = {
  id: 'singleton',
  rank: 4,
  name: 'Singleton',
  nameEs: 'Instancia única',
  category: 'creacional',
  tier: 1,
  gof: true,
  summary:
    'Garantiza que exista una sola instancia de un objeto y ofrece un punto de acceso global a ella.',
  when: 'Cuando un recurso es realmente único en el proceso (una conexión, una configuración, un controlador de hardware) y crear dos copias rompería el estado.',
  pros: [
    'Estado compartido coherente en toda la app.',
    'Inicialización perezosa: se crea cuando se usa por primera vez.',
  ],
  cons: [
    'Es estado global: oculta dependencias y complica los tests.',
    'Difícil de reemplazar por un doble de prueba si no se combina con inyección.',
    'Tentador de abusar para cosas que no son únicas.',
  ],
  realWorld:
    'Los módulos ES ya son singletons por defecto; el cliente de Prisma, una instancia de i18next o el queryClient de TanStack Query suelen exportarse así.',
  example: {
    title: 'Un único controlador del acuario',
    scenario:
      'Las bombas, el skimmer y la iluminación se manejan desde un controlador. Si cada pantalla creara el suyo, dos podrían prender y apagar la misma bomba a la vez.',
    code: `class ReefController {
  static #instance = null;
  #devices = new Map();

  static getInstance() {
    if (!ReefController.#instance) ReefController.#instance = new ReefController();
    return ReefController.#instance;
  }

  setDevice(name, on) {
    this.#devices.set(name, on);
  }

  status() {
    return Object.fromEntries(this.#devices);
  }
}

// Dos módulos distintos piden el controlador…
const fromDashboard = ReefController.getInstance();
const fromScheduler = ReefController.getInstance();

fromDashboard.setDevice('returnPump', true);
fromScheduler.setDevice('skimmer', false);

console.log(fromDashboard === fromScheduler); // true
console.log(fromScheduler.status()); // { returnPump: true, skimmer: false }`,
  },
  related: ['module', 'dependency-injection', 'provider'],
};
