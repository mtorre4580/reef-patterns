import type { Challenge } from '../../types';

export const state1: Challenge = {
  id: 'state-1',
  patternId: 'state',
  title: 'Fases de la computadora de buceo',
  difficulty: 'media',
  story:
    'La computadora de buceo pasa por superficie, descenso, fondo, ascenso y parada de seguridad. El firmware actual tiene un if por fase en cada método y dejó salir a la superficie sin parada.',
  instructions:
    'Implementá `DiveComputer` con `phase` (empieza en `"surface"`), un array `log` de transiciones `"<de> → <a>"` y los métodos `descend()`, `level()`, `ascend()`, `reachStop()` y `complete()`.\n' +
    'Transiciones válidas:\n' +
    '- surface → descend → descending\n' +
    '- descending → level → bottom; descending → ascend → ascending\n' +
    '- bottom → ascend → ascending\n' +
    '- ascending → reachStop → safetyStop\n' +
    '- safetyStop → complete → surface\n' +
    'Cualquier otra lanza `Error("No se puede <acción> desde <fase>")` y no cambia la fase.',
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
      name: 'una inmersión completa',
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
      name: 'no se puede salir sin parada de seguridad',
      code: `const c = new DiveComputer();
c.descend();
c.ascend();
expect(() => c.complete()).toThrow('No se puede complete desde ascending');
expect(c.phase).toBe('ascending');`,
    },
    {
      name: 'no se puede ascender desde la superficie',
      code: `const c = new DiveComputer();
expect(() => c.ascend()).toThrow('No se puede ascend desde surface');
expect(c.log).toEqual([]);`,
    },
    {
      name: 'no se puede volver a descender durante la parada',
      code: `const c = new DiveComputer();
c.descend();
c.ascend();
c.reachStop();
expect(() => c.descend()).toThrow('No se puede descend desde safetyStop');`,
    },
  ],
  checks: [
    { rule: 'forbidNode', node: 'SwitchStatement', message: 'Sin switch por fase' },
    { rule: 'maxIfStatements', max: 1, message: 'Como mucho un if: las transiciones son datos' },
  ],
  hints: [
    'Modelá las transiciones como datos: `{ surface: { descend: "descending" }, … }`.',
    'Un método privado `#go(action)` busca la próxima fase en esa tabla y lanza si no existe.',
    'Cada método público solo llama a `this.#go("nombre")`.',
  ],
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
    if (!next) throw new Error('No se puede ' + action + ' desde ' + this.phase);
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
