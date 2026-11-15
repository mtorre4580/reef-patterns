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
      en: 'Folder sizes in a file browser',
      es: 'Tamaño de carpetas en un explorador de archivos',
      'pt-BR': 'Tamanho de pastas em um explorador de arquivos',
    },
    scenario: {
      en: 'The storage page shows the size of any folder, and folders can contain files or other folders. The total must be computed the same way at any level.',
      es: 'La página de almacenamiento muestra el tamaño de cualquier carpeta, y las carpetas pueden tener archivos u otras carpetas. El total se calcula igual en cualquier nivel.',
      'pt-BR':
        'A página de armazenamento mostra o tamanho de qualquer pasta, e as pastas podem ter arquivos ou outras pastas. O total é calculado do mesmo jeito em qualquer nível.',
    },
    code: `class File {
  constructor(name, bytes) {
    this.name = name;
    this.bytes = bytes;
  }
  size() {
    return this.bytes;
  }
}

class Folder {
  #children = [];
  constructor(name) {
    this.name = name;
  }
  add(...children) {
    this.#children.push(...children);
    return this;
  }
  size() {
    // A folder adds up its children, whether files or other folders
    return this.#children.reduce((total, child) => total + child.size(), 0);
  }
}

const invoices = new Folder('invoices').add(new File('jan.pdf', 120_000), new File('feb.pdf', 98_000));
const docs = new Folder('docs').add(invoices, new File('contract.pdf', 450_000));
const root = new Folder('/').add(docs, new File('avatar.png', 32_000));

console.log(invoices.size()); // 218000
console.log(root.size()); // 700000`,
  },
  related: ['iterator', 'visitor', 'decorator', 'compound-components'],
};
