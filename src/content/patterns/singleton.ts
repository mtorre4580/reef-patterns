import type { Pattern } from '../types';

export const singleton: Pattern = {
  id: 'singleton',
  rank: 4,
  name: 'Singleton',
  localName: { en: 'Singleton', es: 'Instancia única', 'pt-BR': 'Instância única' },
  category: 'creacional',
  tier: 1,
  gof: true,
  summary: {
    en: 'Guarantees that only one instance of an object exists and provides a global access point to it.',
    es: 'Garantiza que exista una sola instancia de un objeto y ofrece un punto de acceso global a ella.',
    'pt-BR':
      'Garante que exista uma única instância de um objeto e oferece um ponto de acesso global a ela.',
  },
  when: {
    en: 'When a resource is truly unique in the process (a connection, a configuration, a hardware controller) and creating two copies would break the state.',
    es: 'Cuando un recurso es realmente único en el proceso (una conexión, una configuración, un controlador de hardware) y crear dos copias rompería el estado.',
    'pt-BR':
      'Quando um recurso é realmente único no processo (uma conexão, uma configuração, um controlador de hardware) e criar duas cópias quebraria o estado.',
  },
  pros: {
    en: [
      'Consistent shared state across the app.',
      'Lazy initialization: created the first time it is used.',
    ],
    es: [
      'Estado compartido coherente en toda la app.',
      'Inicialización perezosa: se crea cuando se usa por primera vez.',
    ],
    'pt-BR': [
      'Estado compartilhado coerente em todo o app.',
      'Inicialização preguiçosa: é criado na primeira vez que é usado.',
    ],
  },
  cons: {
    en: [
      'It is global state: it hides dependencies and complicates tests.',
      'Hard to replace with a test double unless combined with injection.',
      'Tempting to abuse for things that are not unique.',
    ],
    es: [
      'Es estado global: oculta dependencias y complica los tests.',
      'Difícil de reemplazar por un doble de prueba si no se combina con inyección.',
      'Tentador de abusar para cosas que no son únicas.',
    ],
    'pt-BR': [
      'É estado global: esconde dependências e complica os testes.',
      'Difícil de substituir por um dublê de teste se não for combinado com injeção.',
      'Tentador de abusar para coisas que não são únicas.',
    ],
  },
  realWorld: {
    en: 'ES modules are singletons by default; the Prisma client, an i18next instance or the TanStack Query queryClient are usually exported this way.',
    es: 'Los módulos ES ya son singletons por defecto; el cliente de Prisma, una instancia de i18next o el queryClient de TanStack Query suelen exportarse así.',
    'pt-BR':
      'Os módulos ES já são singletons por padrão; o cliente do Prisma, uma instância do i18next ou o queryClient do TanStack Query costumam ser exportados assim.',
  },
  example: {
    title: {
      en: 'A single tank controller',
      es: 'Un único controlador del acuario',
      'pt-BR': 'Um único controlador do aquário',
    },
    scenario: {
      en: 'Pumps, skimmer and lighting are managed from one controller. If every screen created its own, two of them could switch the same pump on and off at the same time.',
      es: 'Las bombas, el skimmer y la iluminación se manejan desde un controlador. Si cada pantalla creara el suyo, dos podrían prender y apagar la misma bomba a la vez.',
      'pt-BR':
        'As bombas, o skimmer e a iluminação são controlados por um controlador. Se cada tela criasse o seu, duas poderiam ligar e desligar a mesma bomba ao mesmo tempo.',
    },
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

// Two different modules ask for the controller…
const fromDashboard = ReefController.getInstance();
const fromScheduler = ReefController.getInstance();

fromDashboard.setDevice('returnPump', true);
fromScheduler.setDevice('skimmer', false);

console.log(fromDashboard === fromScheduler); // true
console.log(fromScheduler.status()); // { returnPump: true, skimmer: false }`,
  },
  related: ['module', 'dependency-injection', 'provider'],
};
