import type { Pattern } from '../types';

export const strategy: Pattern = {
  id: 'strategy',
  rank: 1,
  name: 'Strategy',
  nameEs: 'Estrategia',
  category: 'comportamiento',
  tier: 1,
  gof: true,
  summary:
    'Encapsula algoritmos intercambiables detrás de una misma interfaz para elegir uno en tiempo de ejecución.',
  when: 'Cuando tenés varias formas de hacer lo mismo (calcular, ordenar, validar) y hoy las elegís con un switch o una cadena de if que crece con cada caso nuevo.',
  pros: [
    'Agregar una variante nueva no toca el código que la usa (abierto/cerrado).',
    'Cada algoritmo se testea aislado.',
    'Elimina condicionales largos y repetidos.',
  ],
  cons: [
    'Más piezas sueltas para casos que nunca van a cambiar.',
    'El cliente tiene que conocer las estrategias para elegir una.',
  ],
  realWorld:
    'Comparadores de Array.prototype.sort, estrategias de autenticación de Passport, resolvers de validación en react-hook-form.',
  example: {
    title: 'Dosificadora con métodos intercambiables',
    scenario:
      'El consumo de calcio de un acuario SPS cambia con el tiempo. La dosificadora debe poder pasar de kalkwasser a Balling o a un método tipo Triton sin reescribirse.',
    code: `// Cada estrategia recibe el consumo diario de calcio (ppm) y el volumen (litros)
const kalkwasser = {
  name: 'Kalkwasser',
  dailyDose: (ppm, liters) => ({ kalkMl: Math.round(ppm * liters * 0.54) }),
};

const balling = {
  name: 'Balling',
  dailyDose: (ppm, liters) => ({
    calciumMl: Math.round(ppm * liters * 0.012),
    alkalinityMl: Math.round(ppm * liters * 0.012),
  }),
};

const triton = {
  name: 'Tipo Triton',
  dailyDose: (ppm, liters) => {
    const ml = Math.round(ppm * liters * 0.009);
    return { a: ml, b: ml, c: ml, d: ml };
  },
};

class Doser {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  plan(ppmPerDay, liters) {
    // Doser no sabe qué método usa: solo delega
    return { method: this.strategy.name, ...this.strategy.dailyDose(ppmPerDay, liters) };
  }
}

const doser = new Doser(kalkwasser);
console.log(doser.plan(10, 300)); // { method: 'Kalkwasser', kalkMl: 1620 }

doser.setStrategy(triton); // el consumo subió: cambiamos de método
console.log(doser.plan(10, 300));`,
  },
  related: ['state', 'template-method', 'dependency-injection'],
};
