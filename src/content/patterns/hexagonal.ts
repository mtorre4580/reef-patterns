import type { Pattern } from '../types';

export const hexagonal: Pattern = {
  id: 'hexagonal',
  rank: 51,
  name: 'Hexagonal Architecture',
  nameEs: 'Arquitectura hexagonal (puertos y adaptadores)',
  category: 'arquitectura',
  tier: 4,
  gof: false,
  summary:
    'El núcleo de la aplicación define puertos (interfaces) y todo lo externo se conecta mediante adaptadores intercambiables.',
  when: 'Cuando la lógica de negocio tiene que sobrevivir a cambios de framework, base de datos o proveedor, y querés testearla sin infraestructura.',
  pros: [
    'Dominio independiente de frameworks y proveedores.',
    'Tests del núcleo rápidos, sin red ni base de datos.',
    'Cambiar un proveedor es escribir un adaptador.',
  ],
  cons: [
    'Más capas y archivos desde el día uno.',
    'Riesgo de abstracciones prematuras si nada externo cambia.',
  ],
  realWorld:
    'Proyectos NestJS y Node organizados por puertos, las arquitecturas “clean” en frontend con casos de uso separados de React.',
  example: {
    title: 'Caso de uso: programar alimentación',
    scenario:
      'El núcleo decide cuándo alimentar según la luz. Lo externo (el reloj, el alimentador, la persistencia) entra por puertos; en tests se conectan adaptadores falsos.',
    code: `// Núcleo: no importa nada externo, solo recibe puertos
function createFeedingService({ clock, feeder, schedules }) {
  return {
    async tick() {
      const hour = clock.now().getHours();
      const plan = await schedules.forHour(hour);
      if (!plan) return 'sin alimentación';
      if (hour < 9 || hour > 20) return 'luces apagadas: se omite';
      await feeder.dispense(plan.grams);
      return 'alimentado ' + plan.grams + ' g';
    },
  };
}

// Adaptadores para tests (en producción serían el RTC, el hardware y la base)
const fixedClock = (h) => ({ now: () => new Date(2026, 0, 1, h) });
const memorySchedules = { forHour: async (h) => ({ 10: { grams: 0.4 }, 18: { grams: 0.6 } })[h] };
const fakeFeeder = { dispensed: [], async dispense(g) { this.dispensed.push(g); } };

const service = createFeedingService({
  clock: fixedClock(18),
  feeder: fakeFeeder,
  schedules: memorySchedules,
});

service.tick().then((result) => console.log(result, fakeFeeder.dispensed)); // alimentado 0.6 g`,
  },
  related: ['adapter', 'dependency-injection', 'repository', 'plugin'],
};
