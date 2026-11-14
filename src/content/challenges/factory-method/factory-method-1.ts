import type { Challenge } from '../../types';

export const factoryMethod1: Challenge = {
  id: 'factory-method-1',
  patternId: 'factory-method',
  title: { en: 'Coral factory', es: 'Fábrica de corales', 'pt-BR': 'Fábrica de corais' },
  difficulty: 'facil',
  story: {
    en: 'When adding a new frag, the inventory screen picks the type from a dropdown. Today every screen builds the coral by hand and the light requirements end up inconsistent.',
    es: 'Al cargar un frag nuevo, la pantalla de inventario elige el tipo en un selector. Hoy cada pantalla arma el coral a mano y los requisitos de luz quedan inconsistentes.',
    'pt-BR':
      'Ao cadastrar um frag novo, a tela de inventário escolhe o tipo em um seletor. Hoje cada tela monta o coral à mão e os requisitos de luz ficam inconsistentes.',
  },
  instructions: {
    en: 'Implement:\n- Classes `SpsCoral` (par `[250, 400]`, flow `"high"`), `LpsCoral` (`[100, 200]`, `"medium"`) and `SoftCoral` (`[50, 150]`, `"low"`), all with `name`, `type` and `describe()`, which returns `"<name> · PAR <min>-<max>"`.\n- `createCoral(type, name)` for `"sps"`, `"lps"` and `"soft"`. An unknown type throws `Error("Unknown coral type: <type>")`.\n- `registerCoral(type, CoralClass)` to add new types without touching `createCoral`. No `switch`.',
    es: 'Implementá:\n- Clases `SpsCoral` (par `[250, 400]`, flow `"high"`), `LpsCoral` (`[100, 200]`, `"medium"`) y `SoftCoral` (`[50, 150]`, `"low"`), todas con `name`, `type` y `describe()` que devuelve `"<name> · PAR <min>-<max>"`.\n- `createCoral(type, name)` para `"sps"`, `"lps"` y `"soft"`. Un tipo desconocido lanza `Error("Unknown coral type: <type>")`.\n- `registerCoral(type, CoralClass)` para sumar tipos nuevos sin tocar `createCoral`. Sin `switch`.',
    'pt-BR':
      'Implemente:\n- As classes `SpsCoral` (par `[250, 400]`, flow `"high"`), `LpsCoral` (`[100, 200]`, `"medium"`) e `SoftCoral` (`[50, 150]`, `"low"`), todas com `name`, `type` e `describe()`, que devolve `"<name> · PAR <min>-<max>"`.\n- `createCoral(type, name)` para `"sps"`, `"lps"` e `"soft"`. Um tipo desconhecido lança `Error("Unknown coral type: <type>")`.\n- `registerCoral(type, CoralClass)` para adicionar tipos novos sem mexer em `createCoral`. Sem `switch`.',
  },
  starterCode: `function createCoral(type, name) {
  switch (type) {
    case 'sps':
      return { name, type, par: [250, 400], flow: 'high' };
    case 'lps':
      return { name, type, par: [100, 200], flow: 'medium' };
    default:
      return { name, type, par: [50, 150], flow: 'low' };
  }
}
`,
  tests: [
    {
      name: {
        en: 'creates an SPS with its requirements',
        es: 'crea un SPS con sus requisitos',
        'pt-BR': 'cria um SPS com seus requisitos',
      },
      code: `const coral = createCoral('sps', 'Acropora');
expect(coral instanceof SpsCoral).toBe(true);
expect(coral.par).toEqual([250, 400]);
expect(coral.describe()).toBe('Acropora · PAR 250-400');`,
    },
    {
      name: {
        en: 'creates LPS and soft corals',
        es: 'crea LPS y blandos',
        'pt-BR': 'cria LPS e moles',
      },
      code: `expect(createCoral('lps', 'Hammer').flow).toBe('medium');
expect(createCoral('soft', 'Zoanthus') instanceof SoftCoral).toBe(true);`,
    },
    {
      name: {
        en: 'an unknown type throws an error',
        es: 'un tipo desconocido lanza un error',
        'pt-BR': 'um tipo desconhecido lança um erro',
      },
      code: `expect(() => createCoral('algae', 'Caulerpa')).toThrow('Unknown coral type: algae');`,
    },
    {
      name: {
        en: 'registerCoral adds types without touching the factory',
        es: 'registerCoral suma tipos sin tocar la fábrica',
        'pt-BR': 'registerCoral adiciona tipos sem mexer na fábrica',
      },
      code: `class ZoaCoral {
  constructor(name) { this.name = name; this.type = 'zoa'; }
}
registerCoral('zoa', ZoaCoral);
const coral = createCoral('zoa', 'Rasta');
expect(coral instanceof ZoaCoral).toBe(true);
expect(coral.name).toBe('Rasta');`,
    },
  ],
  checks: [
    {
      rule: 'forbidNode',
      node: 'SwitchStatement',
      message: {
        en: 'No switch: use a type registry',
        es: 'Sin switch: usá un registro de tipos',
        'pt-BR': 'Sem switch: use um registro de tipos',
      },
    },
  ],
  hints: {
    en: [
      'A base `Coral` class with `describe()` avoids repeating code in the three classes.',
      'Keep the types in an object or a `Map`: `{ sps: SpsCoral, lps: LpsCoral, soft: SoftCoral }`.',
      '`createCoral` looks up the class in the registry and does `new CoralClass(name)`; `registerCoral` only adds an entry.',
    ],
    es: [
      'Una clase base `Coral` con `describe()` evita repetir código en las tres clases.',
      'Guardá los tipos en un objeto o `Map`: `{ sps: SpsCoral, lps: LpsCoral, soft: SoftCoral }`.',
      '`createCoral` busca la clase en el registro y hace `new CoralClass(name)`; `registerCoral` solo agrega una entrada.',
    ],
    'pt-BR': [
      'Uma classe base `Coral` com `describe()` evita repetir código nas três classes.',
      'Guarde os tipos em um objeto ou `Map`: `{ sps: SpsCoral, lps: LpsCoral, soft: SoftCoral }`.',
      '`createCoral` busca a classe no registro e faz `new CoralClass(name)`; `registerCoral` só adiciona uma entrada.',
    ],
  },
  solution: `class Coral {
  constructor(name, type) {
    this.name = name;
    this.type = type;
  }
  describe() {
    return this.name + ' · PAR ' + this.par[0] + '-' + this.par[1];
  }
}

class SpsCoral extends Coral {
  par = [250, 400];
  flow = 'high';
}
class LpsCoral extends Coral {
  par = [100, 200];
  flow = 'medium';
}
class SoftCoral extends Coral {
  par = [50, 150];
  flow = 'low';
}

const registry = new Map([
  ['sps', SpsCoral],
  ['lps', LpsCoral],
  ['soft', SoftCoral],
]);

function registerCoral(type, CoralClass) {
  registry.set(type, CoralClass);
}

function createCoral(type, name) {
  const CoralClass = registry.get(type);
  if (!CoralClass) throw new Error('Unknown coral type: ' + type);
  return new CoralClass(name, type);
}
`,
};
