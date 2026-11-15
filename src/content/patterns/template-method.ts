import type { Pattern } from '../types';

export const templateMethod: Pattern = {
  id: 'template-method',
  rank: 20,
  name: 'Template Method',
  localName: { en: 'Template Method', es: 'Método plantilla', 'pt-BR': 'Método template' },
  category: 'comportamiento',
  tier: 2,
  gof: true,
  summary: {
    en: 'Defines the skeleton of an algorithm in a base class and lets subclasses fill in some steps.',
    es: 'Define el esqueleto de un algoritmo en una clase base y deja que las subclases completen ciertos pasos.',
    'pt-BR':
      'Define o esqueleto de um algoritmo em uma classe base e deixa as subclasses completarem certos passos.',
  },
  when: {
    en: 'When several processes share the same sequence and only some steps change, and you want the sequence to be impossible to break by mistake.',
    es: 'Cuando varios procesos comparten la misma secuencia y solo cambian algunos pasos, y querés que la secuencia no se pueda alterar por error.',
    'pt-BR':
      'Quando vários processos compartilham a mesma sequência e só mudam alguns passos, e você quer que a sequência não possa ser alterada por engano.',
  },
  pros: {
    en: [
      'The order of steps is fixed in one place.',
      'Reuses the common code across variants.',
      'Optional hooks allow extension without breaking.',
    ],
    es: [
      'El orden de los pasos queda fijo en un solo lugar.',
      'Reutiliza el código común entre variantes.',
      'Los hooks opcionales permiten extender sin romper.',
    ],
    'pt-BR': [
      'A ordem dos passos fica fixa em um único lugar.',
      'Reutiliza o código comum entre variantes.',
      'Os hooks opcionais permitem estender sem quebrar.',
    ],
  },
  cons: {
    en: [
      'Tied to inheritance: less flexible than composing strategies.',
      'Subclasses depend on details of the base class.',
    ],
    es: [
      'Atado a la herencia: menos flexible que componer estrategias.',
      'Las subclases dependen de detalles de la clase base.',
    ],
    'pt-BR': [
      'Preso à herança: menos flexível que compor estratégias.',
      'As subclasses dependem de detalhes da classe base.',
    ],
  },
  realWorld: {
    en: "Lifecycle methods of React class components, test frameworks' beforeEach/afterEach hooks, Rollup plugins.",
    es: 'Los métodos de ciclo de vida de los componentes de clase de React, los hooks beforeEach/afterEach de los frameworks de tests, los plugins de Rollup.',
    'pt-BR':
      'Os métodos de ciclo de vida dos componentes de classe do React, os hooks beforeEach/afterEach dos frameworks de teste, os plugins do Rollup.',
  },
  example: {
    title: {
      en: 'Report exporters',
      es: 'Exportadores de reportes',
      'pt-BR': 'Exportadores de relatórios',
    },
    scenario: {
      en: 'Every export follows the same steps: load rows, filter them, format them and add a header. CSV and JSON exports only differ in formatting.',
      es: 'Toda exportación sigue los mismos pasos: cargar filas, filtrarlas, formatearlas y agregar un encabezado. CSV y JSON solo cambian en el formato.',
      'pt-BR':
        'Toda exportação segue os mesmos passos: carregar linhas, filtrá-las, formatá-las e adicionar um cabeçalho. CSV e JSON só mudam na formatação.',
    },
    code: `class ReportExporter {
  // Template method: the sequence never changes
  export(rows) {
    const visible = rows.filter((row) => this.include(row));
    const body = this.format(visible);
    return this.header(visible.length) + body;
  }

  // Step with a default value (hook)
  include(row) {
    return !row.deleted;
  }
  header(count) {
    return '';
  }
  format() {
    throw new Error('Each exporter defines its format');
  }
}

class CsvExporter extends ReportExporter {
  header() {
    return 'id,total\\n';
  }
  format(rows) {
    return rows.map((r) => r.id + ',' + r.total).join('\\n');
  }
}

class JsonExporter extends ReportExporter {
  format(rows) {
    return JSON.stringify({ count: rows.length, rows });
  }
}

const rows = [{ id: 1, total: 30 }, { id: 2, total: 12, deleted: true }, { id: 3, total: 8 }];
console.log(new CsvExporter().export(rows));
console.log(new JsonExporter().export(rows));`,
  },
  related: ['strategy', 'hoc'],
};
