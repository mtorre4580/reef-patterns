import type { Pattern } from '../types';

export const strategy: Pattern = {
  id: 'strategy',
  rank: 1,
  name: 'Strategy',
  localName: { en: 'Strategy', es: 'Estrategia', 'pt-BR': 'Estratégia' },
  category: 'comportamiento',
  tier: 1,
  gof: true,
  summary: {
    en: 'Wraps interchangeable algorithms behind the same interface so one can be picked at runtime.',
    es: 'Encapsula algoritmos intercambiables detrás de una misma interfaz para elegir uno en tiempo de ejecución.',
    'pt-BR':
      'Encapsula algoritmos intercambiáveis atrás de uma mesma interface para escolher um em tempo de execução.',
  },
  when: {
    en: 'When you have several ways of doing the same thing (computing, sorting, validating) and today you choose between them with a switch or an if chain that grows with every new case.',
    es: 'Cuando tenés varias formas de hacer lo mismo (calcular, ordenar, validar) y hoy las elegís con un switch o una cadena de if que crece con cada caso nuevo.',
    'pt-BR':
      'Quando você tem várias formas de fazer a mesma coisa (calcular, ordenar, validar) e hoje escolhe entre elas com um switch ou uma cadeia de if que cresce a cada caso novo.',
  },
  pros: {
    en: [
      'Adding a new variant does not touch the code that uses it (open/closed).',
      'Each algorithm is tested in isolation.',
      'Removes long, repeated conditionals.',
    ],
    es: [
      'Agregar una variante nueva no toca el código que la usa (abierto/cerrado).',
      'Cada algoritmo se testea aislado.',
      'Elimina condicionales largos y repetidos.',
    ],
    'pt-BR': [
      'Adicionar uma variante nova não mexe no código que a usa (aberto/fechado).',
      'Cada algoritmo é testado isoladamente.',
      'Elimina condicionais longos e repetidos.',
    ],
  },
  cons: {
    en: [
      'More moving parts for cases that will never change.',
      'The client has to know the strategies to pick one.',
    ],
    es: [
      'Más piezas sueltas para casos que nunca van a cambiar.',
      'El cliente tiene que conocer las estrategias para elegir una.',
    ],
    'pt-BR': [
      'Mais peças soltas para casos que nunca vão mudar.',
      'O cliente precisa conhecer as estratégias para escolher uma.',
    ],
  },
  realWorld: {
    en: "The comparator in Array.prototype.sort, Passport's authentication strategies, validation resolvers in react-hook-form.",
    es: 'Comparadores de Array.prototype.sort, estrategias de autenticación de Passport, resolvers de validación en react-hook-form.',
    'pt-BR':
      'O comparador de Array.prototype.sort, as estratégias de autenticação do Passport, os resolvers de validação do react-hook-form.',
  },
  example: {
    title: {
      en: 'Doser with interchangeable methods',
      es: 'Dosificadora con métodos intercambiables',
      'pt-BR': 'Dosadora com métodos intercambiáveis',
    },
    scenario: {
      en: 'Calcium consumption in an SPS tank changes over time. The doser must be able to switch from kalkwasser to Balling or a Triton-style method without being rewritten.',
      es: 'El consumo de calcio de un acuario SPS cambia con el tiempo. La dosificadora debe poder pasar de kalkwasser a Balling o a un método tipo Triton sin reescribirse.',
      'pt-BR':
        'O consumo de cálcio de um aquário SPS muda com o tempo. A dosadora precisa poder passar de kalkwasser para Balling ou para um método tipo Triton sem ser reescrita.',
    },
    code: `// Each strategy receives the daily calcium consumption (ppm) and the volume (liters)
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
  name: 'Triton-style',
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
    // Doser does not know which method it uses: it just delegates
    return { method: this.strategy.name, ...this.strategy.dailyDose(ppmPerDay, liters) };
  }
}

const doser = new Doser(kalkwasser);
console.log(doser.plan(10, 300)); // { method: 'Kalkwasser', kalkMl: 1620 }

doser.setStrategy(triton); // consumption went up: switch methods
console.log(doser.plan(10, 300));`,
  },
  related: ['state', 'template-method', 'dependency-injection'],
};
