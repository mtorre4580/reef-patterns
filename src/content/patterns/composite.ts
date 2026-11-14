import type { Pattern } from '../types';

export const composite: Pattern = {
  id: 'composite',
  rank: 12,
  name: 'Composite',
  nameEs: 'Compuesto',
  category: 'estructural',
  tier: 2,
  gof: true,
  summary:
    'Trata de la misma forma a un elemento individual y a un grupo de elementos organizados en árbol.',
  when: 'Cuando tus datos forman una jerarquía (carpetas, menús, componentes, colonias) y querés operar sobre una hoja o una rama con la misma llamada.',
  pros: [
    'El cliente no distingue hojas de contenedores.',
    'Las operaciones recursivas quedan simples y uniformes.',
    'Agregar tipos de nodo no rompe el recorrido.',
  ],
  cons: [
    'Una interfaz común puede forzar métodos que no tienen sentido en las hojas.',
    'Árboles muy profundos pueden costar caro de recorrer.',
  ],
  realWorld:
    'El árbol del DOM, el árbol de componentes de React, los ASTs de Babel y acorn, los sistemas de archivos.',
  example: {
    title: 'Contar pólipos en un arrecife',
    scenario:
      'Un arrecife tiene secciones, las secciones tienen colonias y las colonias tienen frags. El reporte necesita el total de pólipos de cualquier nivel.',
    code: `class Frag {
  constructor(name, polyps) {
    this.name = name;
    this.polyps = polyps;
  }
  countPolyps() {
    return this.polyps;
  }
}

class Group {
  #children = [];
  constructor(name) {
    this.name = name;
  }
  add(...children) {
    this.#children.push(...children);
    return this;
  }
  countPolyps() {
    // Un grupo suma a sus hijos, sean frags u otros grupos
    return this.#children.reduce((total, child) => total + child.countPolyps(), 0);
  }
}

const zoaColony = new Group('Colonia de zoas').add(new Frag('Rasta', 40), new Frag('Utter Chaos', 25));
const leftRock = new Group('Roca izquierda').add(zoaColony, new Frag('Acropora', 300));
const reef = new Group('Arrecife').add(leftRock, new Frag('Euphyllia', 6));

console.log(zoaColony.countPolyps()); // 65
console.log(reef.countPolyps()); // 371`,
  },
  related: ['iterator', 'visitor', 'decorator', 'compound-components'],
};
