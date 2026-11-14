import type { Challenge } from '../../types';

export const factoryMethod1: Challenge = {
  id: 'factory-method-1',
  patternId: 'factory-method',
  title: 'Fábrica de corales',
  difficulty: 'facil',
  story:
    'Al cargar un frag nuevo, la pantalla de inventario elige el tipo en un selector. Hoy cada pantalla arma el coral a mano y los requisitos de luz quedan inconsistentes.',
  instructions:
    'Implementá:\n' +
    '- Clases `SpsCoral` (par `[250, 400]`, flow `"alto"`), `LpsCoral` (`[100, 200]`, `"medio"`) y `SoftCoral` (`[50, 150]`, `"bajo"`), todas con `name`, `type` y `describe()` que devuelve `"<name> · PAR <min>-<max>"`.\n' +
    '- `createCoral(type, name)` para `"sps"`, `"lps"` y `"soft"`. Un tipo desconocido lanza `Error("Tipo de coral desconocido: <type>")`.\n' +
    '- `registerCoral(type, CoralClass)` para sumar tipos nuevos sin tocar `createCoral`. Sin `switch`.',
  starterCode: `function createCoral(type, name) {
  switch (type) {
    case 'sps':
      return { name, type, par: [250, 400], flow: 'alto' };
    case 'lps':
      return { name, type, par: [100, 200], flow: 'medio' };
    default:
      return { name, type, par: [50, 150], flow: 'bajo' };
  }
}
`,
  tests: [
    {
      name: 'crea un SPS con sus requisitos',
      code: `const coral = createCoral('sps', 'Acropora');
expect(coral instanceof SpsCoral).toBe(true);
expect(coral.par).toEqual([250, 400]);
expect(coral.describe()).toBe('Acropora · PAR 250-400');`,
    },
    {
      name: 'crea LPS y blandos',
      code: `expect(createCoral('lps', 'Hammer').flow).toBe('medio');
expect(createCoral('soft', 'Zoanthus') instanceof SoftCoral).toBe(true);`,
    },
    {
      name: 'un tipo desconocido lanza un error',
      code: `expect(() => createCoral('alga', 'Caulerpa')).toThrow('Tipo de coral desconocido: alga');`,
    },
    {
      name: 'registerCoral suma tipos sin tocar la fábrica',
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
      message: 'Sin switch: usá un registro de tipos',
    },
  ],
  hints: [
    'Una clase base `Coral` con `describe()` evita repetir código en las tres clases.',
    'Guardá los tipos en un objeto o `Map`: `{ sps: SpsCoral, lps: LpsCoral, soft: SoftCoral }`.',
    '`createCoral` busca la clase en el registro y hace `new CoralClass(name)`; `registerCoral` solo agrega una entrada.',
  ],
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
  flow = 'alto';
}
class LpsCoral extends Coral {
  par = [100, 200];
  flow = 'medio';
}
class SoftCoral extends Coral {
  par = [50, 150];
  flow = 'bajo';
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
  if (!CoralClass) throw new Error('Tipo de coral desconocido: ' + type);
  return new CoralClass(name, type);
}
`,
};
