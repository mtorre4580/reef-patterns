import type { Pattern } from '../types';

export const composite: Pattern = {
  id: 'composite',
  rank: 12,
  name: 'Composite',
  localName: { en: 'Composite', es: 'Compuesto', 'pt-BR': 'Composto' },
  category: 'estructural',
  tier: 2,
  gof: true,
  summary: {
    en: 'Treats a single element and a group of elements arranged as a tree in the same way.',
    es: 'Trata de la misma forma a un elemento individual y a un grupo de elementos organizados en árbol.',
    'pt-BR':
      'Trata da mesma forma um elemento individual e um grupo de elementos organizados em árvore.',
  },
  when: {
    en: 'When your data forms a hierarchy (folders, menus, components, colonies) and you want to operate on a leaf or a branch with the same call.',
    es: 'Cuando tus datos forman una jerarquía (carpetas, menús, componentes, colonias) y querés operar sobre una hoja o una rama con la misma llamada.',
    'pt-BR':
      'Quando seus dados formam uma hierarquia (pastas, menus, componentes, colônias) e você quer operar sobre uma folha ou um galho com a mesma chamada.',
  },
  pros: {
    en: [
      "The client doesn't tell leaves from containers.",
      'Recursive operations stay simple and uniform.',
      'Adding node types does not break the traversal.',
    ],
    es: [
      'El cliente no distingue hojas de contenedores.',
      'Las operaciones recursivas quedan simples y uniformes.',
      'Agregar tipos de nodo no rompe el recorrido.',
    ],
    'pt-BR': [
      'O cliente não distingue folhas de contêineres.',
      'As operações recursivas ficam simples e uniformes.',
      'Adicionar tipos de nó não quebra o percurso.',
    ],
  },
  cons: {
    en: [
      'A shared interface can force methods that make no sense on leaves.',
      'Very deep trees can be expensive to traverse.',
    ],
    es: [
      'Una interfaz común puede forzar métodos que no tienen sentido en las hojas.',
      'Árboles muy profundos pueden costar caro de recorrer.',
    ],
    'pt-BR': [
      'Uma interface comum pode forçar métodos que não fazem sentido nas folhas.',
      'Árvores muito profundas podem ser caras de percorrer.',
    ],
  },
  realWorld: {
    en: "The DOM tree, React's component tree, Babel and acorn ASTs, file systems.",
    es: 'El árbol del DOM, el árbol de componentes de React, los ASTs de Babel y acorn, los sistemas de archivos.',
    'pt-BR':
      'A árvore do DOM, a árvore de componentes do React, as ASTs do Babel e do acorn, os sistemas de arquivos.',
  },
  example: {
    title: {
      en: 'Counting polyps on a reef',
      es: 'Contar pólipos en un arrecife',
      'pt-BR': 'Contar pólipos em um recife',
    },
    scenario: {
      en: 'A reef has sections, sections have colonies and colonies have frags. The report needs the total number of polyps at any level.',
      es: 'Un arrecife tiene secciones, las secciones tienen colonias y las colonias tienen frags. El reporte necesita el total de pólipos de cualquier nivel.',
      'pt-BR':
        'Um recife tem seções, as seções têm colônias e as colônias têm frags. O relatório precisa do total de pólipos de qualquer nível.',
    },
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
    // A group adds up its children, whether frags or other groups
    return this.#children.reduce((total, child) => total + child.countPolyps(), 0);
  }
}

const zoaColony = new Group('Zoa colony').add(new Frag('Rasta', 40), new Frag('Utter Chaos', 25));
const leftRock = new Group('Left rock').add(zoaColony, new Frag('Acropora', 300));
const reef = new Group('Reef').add(leftRock, new Frag('Euphyllia', 6));

console.log(zoaColony.countPolyps()); // 65
console.log(reef.countPolyps()); // 371`,
  },
  related: ['iterator', 'visitor', 'decorator', 'compound-components'],
};
