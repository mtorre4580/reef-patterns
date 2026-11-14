import type { Pattern } from '../types';

export const prototype: Pattern = {
  id: 'prototype',
  rank: 33,
  name: 'Prototype',
  nameEs: 'Prototipo',
  category: 'creacional',
  tier: 3,
  gof: true,
  summary:
    'Crea objetos nuevos copiando uno existente que sirve de modelo, en lugar de construirlos desde cero.',
  when: 'Cuando construir un objeto es costoso o tiene mucha configuración, y la mayoría de las instancias nuevas son variaciones de una base.',
  pros: [
    'Evita repetir configuraciones largas.',
    'Crea variantes sin subclases.',
    'En JavaScript es nativo: la herencia es prototípica.',
  ],
  cons: [
    'Copias superficiales comparten objetos anidados por accidente.',
    'Clonar objetos con referencias circulares o funciones requiere cuidado.',
  ],
  realWorld:
    'Object.create, structuredClone, la cadena de prototipos de JS, las plantillas duplicables de Figma o Notion.',
  example: {
    title: 'Plantilla de frag',
    scenario:
      'Al fraguear una colonia, cada frag hereda especie, requisitos y origen, y solo cambia el tamaño y la ubicación. Se clona el frag madre en vez de cargar todo de nuevo.',
    code: `const motherColony = {
  species: 'Acropora tenuis',
  type: 'sps',
  care: { par: [250, 350], flow: 'alto', temperature: [24.5, 26.5] },
  origin: 'Acuicultura local',
  sizeCm: 20,
  location: 'Roca principal',
};

function fragFrom(prototype, overrides) {
  // structuredClone copia en profundidad: cada frag tiene su propio objeto care
  return { ...structuredClone(prototype), ...overrides, parent: prototype.species };
}

const frag1 = fragFrom(motherColony, { sizeCm: 3, location: 'Rack de frags A1' });
const frag2 = fragFrom(motherColony, { sizeCm: 2.5, location: 'Rack de frags A2' });

frag2.care.flow = 'medio'; // no afecta a la colonia madre ni a frag1
console.log(motherColony.care.flow, frag1.care.flow, frag2.care.flow); // alto alto medio

// Versión prototípica nativa: hereda en vez de copiar
const lazyFrag = Object.create(motherColony, { sizeCm: { value: 4 } });
console.log(lazyFrag.species, lazyFrag.sizeCm);`,
  },
  related: ['factory-method', 'flyweight', 'memento'],
};
