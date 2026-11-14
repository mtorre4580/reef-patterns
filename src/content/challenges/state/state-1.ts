import type { Challenge } from '../../types';

export const state1: Challenge = {
  id: 'state-1',
  patternId: 'state',
  title: {
    en: 'Dive computer phases',
    es: 'Fases de la computadora de buceo',
    'pt-BR': 'Fases do computador de mergulho',
  },
  difficulty: 'media',
  story: {
    en: 'The dive computer goes through surface, descent, bottom, ascent and safety stop. The current firmware has one if per phase in every method and allowed surfacing without a stop.',
    es: 'La computadora de buceo pasa por superficie, descenso, fondo, ascenso y parada de seguridad. El firmware actual tiene un if por fase en cada método y dejó salir a la superficie sin parada.',
    'pt-BR':
      'O computador de mergulho passa por superfície, descida, fundo, subida e parada de segurança. O firmware atual tem um if por fase em cada método e deixou subir à superfície sem parada.',
  },
  instructions: {
    en: 'Implement `DiveComputer` with `phase` (starting at `"surface"`), a `log` array of `"<from> → <to>"` transitions and the methods `descend()`, `level()`, `ascend()`, `reachStop()` and `complete()`.\nValid transitions:\n- surface → descend → descending\n- descending → level → bottom; descending → ascend → ascending\n- bottom → ascend → ascending\n- ascending → reachStop → safetyStop\n- safetyStop → complete → surface\nAny other one throws `Error("Cannot <action> from <phase>")` and does not change the phase.',
    es: 'Implementá `DiveComputer` con `phase` (empieza en `"surface"`), un array `log` de transiciones `"<de> → <a>"` y los métodos `descend()`, `level()`, `ascend()`, `reachStop()` y `complete()`.\nTransiciones válidas:\n- surface → descend → descending\n- descending → level → bottom; descending → ascend → ascending\n- bottom → ascend → ascending\n- ascending → reachStop → safetyStop\n- safetyStop → complete → surface\nCualquier otra lanza `Error("Cannot <acción> from <fase>")` y no cambia la fase.',
    'pt-BR':
      'Implemente `DiveComputer` com `phase` (começa em `"surface"`), um array `log` de transições `"<de> → <para>"` e os métodos `descend()`, `level()`, `ascend()`, `reachStop()` e `complete()`.\nTransições válidas:\n- surface → descend → descending\n- descending → level → bottom; descending → ascend → ascending\n- bottom → ascend → ascending\n- ascending → reachStop → safetyStop\n- safetyStop → complete → surface\nQualquer outra lança `Error("Cannot <ação> from <fase>")` e não muda a fase.',
  },
  starterCode: `class DiveComputer {
  phase = 'surface';
  log = [];

  descend() {
    this.phase = 'descending';
  }
  level() {
    this.phase = 'bottom';
  }
  ascend() {
    this.phase = 'ascending';
  }
  reachStop() {
    this.phase = 'safetyStop';
  }
  complete() {
    this.phase = 'surface';
  }
}
`,
  tests: [
    {
      name: {
        en: 'a complete dive',
        es: 'una inmersión completa',
        'pt-BR': 'um mergulho completo',
      },
      code: `const c = new DiveComputer();
c.descend();
c.level();
c.ascend();
c.reachStop();
c.complete();
expect(c.phase).toBe('surface');
expect(c.log).toEqual([
  'surface → descending',
  'descending → bottom',
  'bottom → ascending',
  'ascending → safetyStop',
  'safetyStop → surface',
]);`,
    },
    {
      name: {
        en: 'cannot surface without a safety stop',
        es: 'no se puede salir sin parada de seguridad',
        'pt-BR': 'não dá para subir sem parada de segurança',
      },
      code: `const c = new DiveComputer();
c.descend();
c.ascend();
expect(() => c.complete()).toThrow('Cannot complete from ascending');
expect(c.phase).toBe('ascending');`,
    },
    {
      name: {
        en: 'cannot ascend from the surface',
        es: 'no se puede ascender desde la superficie',
        'pt-BR': 'não dá para subir a partir da superfície',
      },
      code: `const c = new DiveComputer();
expect(() => c.ascend()).toThrow('Cannot ascend from surface');
expect(c.log).toEqual([]);`,
    },
    {
      name: {
        en: 'cannot descend again during the stop',
        es: 'no se puede volver a descender durante la parada',
        'pt-BR': 'não dá para voltar a descer durante a parada',
      },
      code: `const c = new DiveComputer();
c.descend();
c.ascend();
c.reachStop();
expect(() => c.descend()).toThrow('Cannot descend from safetyStop');`,
    },
  ],
  checks: [
    {
      rule: 'forbidNode',
      node: 'SwitchStatement',
      message: {
        en: 'No switch per phase',
        es: 'Sin switch por fase',
        'pt-BR': 'Sem switch por fase',
      },
    },
    {
      rule: 'maxIfStatements',
      max: 1,
      message: {
        en: 'At most one if: transitions are data',
        es: 'Como mucho un if: las transiciones son datos',
        'pt-BR': 'No máximo um if: as transições são dados',
      },
    },
  ],
  hints: {
    en: [
      'Model the transitions as data: `{ surface: { descend: "descending" }, … }`.',
      'A private `#go(action)` method looks up the next phase in that table and throws if it does not exist.',
      'Each public method just calls `this.#go("name")`.',
    ],
    es: [
      'Modelá las transiciones como datos: `{ surface: { descend: "descending" }, … }`.',
      'Un método privado `#go(action)` busca la próxima fase en esa tabla y lanza si no existe.',
      'Cada método público solo llama a `this.#go("nombre")`.',
    ],
    'pt-BR': [
      'Modele as transições como dados: `{ surface: { descend: "descending" }, … }`.',
      'Um método privado `#go(action)` busca a próxima fase nessa tabela e lança se não existir.',
      'Cada método público só chama `this.#go("nome")`.',
    ],
  },
  solution: `const transitions = {
  surface: { descend: 'descending' },
  descending: { level: 'bottom', ascend: 'ascending' },
  bottom: { ascend: 'ascending' },
  ascending: { reachStop: 'safetyStop' },
  safetyStop: { complete: 'surface' },
};

class DiveComputer {
  phase = 'surface';
  log = [];

  #go(action) {
    const next = transitions[this.phase][action];
    if (!next) throw new Error('Cannot ' + action + ' from ' + this.phase);
    this.log.push(this.phase + ' → ' + next);
    this.phase = next;
  }

  descend() { this.#go('descend'); }
  level() { this.#go('level'); }
  ascend() { this.#go('ascend'); }
  reachStop() { this.#go('reachStop'); }
  complete() { this.#go('complete'); }
}
`,
};
