import type { Pattern } from '../types';

export const hexagonal: Pattern = {
  id: 'hexagonal',
  rank: 51,
  name: 'Hexagonal Architecture',
  localName: {
    en: 'Hexagonal Architecture',
    es: 'Arquitectura hexagonal (puertos y adaptadores)',
    'pt-BR': 'Arquitetura hexagonal (portas e adaptadores)',
  },
  category: 'arquitectura',
  tier: 4,
  gof: false,
  summary: {
    en: 'The application core defines ports (interfaces) and everything external plugs in through interchangeable adapters.',
    es: 'El núcleo de la aplicación define puertos (interfaces) y todo lo externo se conecta mediante adaptadores intercambiables.',
    'pt-BR':
      'O núcleo da aplicação define portas (interfaces) e tudo o que é externo se conecta por adaptadores intercambiáveis.',
  },
  when: {
    en: 'When business logic must survive changes of framework, database or provider, and you want to test it without infrastructure.',
    es: 'Cuando la lógica de negocio tiene que sobrevivir a cambios de framework, base de datos o proveedor, y querés testearla sin infraestructura.',
    'pt-BR':
      'Quando a lógica de negócio precisa sobreviver a mudanças de framework, banco de dados ou fornecedor e você quer testá-la sem infraestrutura.',
  },
  pros: {
    en: [
      'A domain independent of frameworks and providers.',
      'Fast core tests, with no network or database.',
      'Changing a provider means writing an adapter.',
    ],
    es: [
      'Dominio independiente de frameworks y proveedores.',
      'Tests del núcleo rápidos, sin red ni base de datos.',
      'Cambiar un proveedor es escribir un adaptador.',
    ],
    'pt-BR': [
      'Domínio independente de frameworks e fornecedores.',
      'Testes do núcleo rápidos, sem rede nem banco.',
      'Trocar um fornecedor é escrever um adaptador.',
    ],
  },
  cons: {
    en: [
      'More layers and files from day one.',
      'Risk of premature abstractions if nothing external ever changes.',
    ],
    es: [
      'Más capas y archivos desde el día uno.',
      'Riesgo de abstracciones prematuras si nada externo cambia.',
    ],
    'pt-BR': [
      'Mais camadas e arquivos desde o primeiro dia.',
      'Risco de abstrações prematuras se nada externo mudar.',
    ],
  },
  realWorld: {
    en: 'NestJS and Node projects organized by ports, "clean" frontend architectures with use cases separated from React.',
    es: 'Proyectos NestJS y Node organizados por puertos, las arquitecturas “clean” en frontend con casos de uso separados de React.',
    'pt-BR':
      'Projetos NestJS e Node organizados por portas, as arquiteturas "clean" no frontend com casos de uso separados do React.',
  },
  example: {
    title: {
      en: 'Use case: scheduling feeding',
      es: 'Caso de uso: programar alimentación',
      'pt-BR': 'Caso de uso: programar a alimentação',
    },
    scenario: {
      en: 'The core decides when to feed based on the lights. Everything external (the clock, the feeder, persistence) comes in through ports; tests plug in fake adapters.',
      es: 'El núcleo decide cuándo alimentar según la luz. Lo externo (el reloj, el alimentador, la persistencia) entra por puertos; en tests se conectan adaptadores falsos.',
      'pt-BR':
        'O núcleo decide quando alimentar conforme a luz. O que é externo (o relógio, o alimentador, a persistência) entra por portas; nos testes conectam-se adaptadores falsos.',
    },
    code: `// Core: imports nothing external, it only receives ports
function createFeedingService({ clock, feeder, schedules }) {
  return {
    async tick() {
      const hour = clock.now().getHours();
      const plan = await schedules.forHour(hour);
      if (!plan) return 'no feeding';
      if (hour < 9 || hour > 20) return 'lights off: skipped';
      await feeder.dispense(plan.grams);
      return 'fed ' + plan.grams + ' g';
    },
  };
}

// Test adapters (in production: the RTC, the hardware and the database)
const fixedClock = (h) => ({ now: () => new Date(2026, 0, 1, h) });
const memorySchedules = { forHour: async (h) => ({ 10: { grams: 0.4 }, 18: { grams: 0.6 } })[h] };
const fakeFeeder = { dispensed: [], async dispense(g) { this.dispensed.push(g); } };

const service = createFeedingService({
  clock: fixedClock(18),
  feeder: fakeFeeder,
  schedules: memorySchedules,
});

service.tick().then((result) => console.log(result, fakeFeeder.dispensed)); // fed 0.6 g`,
  },
  related: ['adapter', 'dependency-injection', 'repository', 'plugin'],
};
