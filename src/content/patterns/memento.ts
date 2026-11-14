import type { Pattern } from '../types';

export const memento: Pattern = {
  id: 'memento',
  rank: 32,
  name: 'Memento',
  nameEs: 'Recuerdo',
  category: 'comportamiento',
  tier: 3,
  gof: true,
  summary:
    'Captura una instantánea del estado interno de un objeto para poder restaurarlo después, sin exponer sus detalles.',
  when: 'Cuando necesitás volver a un estado anterior completo (deshacer, borradores, checkpoints) y recalcularlo con comandos inversos sería complejo.',
  pros: [
    'Deshacer simple: se restaura la foto completa.',
    'Respeta el encapsulamiento del objeto original.',
  ],
  cons: [
    'Guardar muchas instantáneas grandes consume memoria.',
    'Hay que decidir cuántas conservar y cuándo descartarlas.',
  ],
  realWorld:
    'El historial de estados de Redux DevTools, structuredClone para checkpoints, los borradores autoguardados, el historial de Excalidraw.',
  example: {
    title: 'Perfiles de iluminación',
    scenario:
      'Mientras ajustás los canales de la lámpara probás combinaciones. Antes de experimentar guardás una foto, y si los corales se ven mal, volvés al perfil anterior.',
    code: `class LightProfile {
  #channels = { blue: 80, white: 40, uv: 20 };

  set(channel, percent) {
    this.#channels[channel] = percent;
  }
  describe() {
    return JSON.stringify(this.#channels);
  }

  // Crear y restaurar mementos: nadie más toca #channels
  save() {
    return Object.freeze({ channels: structuredClone(this.#channels), at: Date.now() });
  }
  restore(memento) {
    this.#channels = structuredClone(memento.channels);
  }
}

const profile = new LightProfile();
const history = [];

history.push(profile.save());
profile.set('white', 90);
profile.set('uv', 0);
console.log(profile.describe()); // demasiado blanco: el SPS se aclara

profile.restore(history.pop());
console.log(profile.describe()); // vuelve a { blue: 80, white: 40, uv: 20 }`,
  },
  related: ['command', 'state', 'event-sourcing'],
};
