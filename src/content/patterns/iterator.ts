import type { Pattern } from '../types';

export const iterator: Pattern = {
  id: 'iterator',
  rank: 11,
  name: 'Iterator',
  nameEs: 'Iterador',
  category: 'comportamiento',
  tier: 1,
  gof: true,
  summary: 'Recorre una colección elemento por elemento sin exponer cómo está almacenada.',
  when: 'Cuando querés recorrer datos con for…of sin importar si vienen de un array, un árbol o una API paginada, o cuando conviene producirlos de forma perezosa.',
  pros: [
    'Interfaz uniforme (for…of, spread, destructuring).',
    'Evaluación perezosa: se calcula solo lo que se consume.',
    'Oculta la estructura interna de la colección.',
  ],
  cons: [
    'Los iteradores son de un solo uso y con estado.',
    'Para colecciones chicas, un array es más simple.',
  ],
  realWorld:
    'El protocolo Symbol.iterator, los generadores function*, los Iterator helpers de ES2025, for await…of sobre streams.',
  example: {
    title: 'Log de inmersiones paginado',
    scenario:
      'El log tiene cientos de inmersiones guardadas por página. La pantalla de estadísticas quiere recorrerlas una por una y cortar al encontrar la primera de más de 30 m.',
    code: `const pages = [
  [{ site: 'Bajo Rojo', depth: 18 }, { site: 'La Pared', depth: 27 }],
  [{ site: 'El Naufragio', depth: 33 }, { site: 'Jardín de Corales', depth: 12 }],
  [{ site: 'Cueva Azul', depth: 40 }],
];

class DiveLog {
  constructor(fetchPage) {
    this.fetchPage = fetchPage;
  }

  // Generador: trae una página solo cuando hace falta
  *[Symbol.iterator]() {
    for (let page = 0; ; page++) {
      const dives = this.fetchPage(page);
      if (!dives) return;
      console.log('Cargando página ' + page);
      yield* dives;
    }
  }
}

const log = new DiveLog((n) => pages[n]);

for (const dive of log) {
  if (dive.depth > 30) {
    console.log('Primera inmersión profunda:', dive.site);
    break; // la página 2 nunca se carga
  }
}`,
  },
  related: ['composite', 'visitor'],
};
