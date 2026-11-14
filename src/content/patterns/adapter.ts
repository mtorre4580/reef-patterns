import type { Pattern } from '../types';

export const adapter: Pattern = {
  id: 'adapter',
  rank: 6,
  name: 'Adapter',
  nameEs: 'Adaptador',
  category: 'estructural',
  tier: 1,
  gof: true,
  summary:
    'Traduce la interfaz de un objeto a la que espera el cliente, para que piezas incompatibles trabajen juntas.',
  when: 'Cuando integrás una librería, API o dispositivo cuya forma de datos no coincide con la de tu dominio y no querés que esa forma se filtre por toda la app.',
  pros: [
    'Aísla el código de terceros detrás de una frontera clara.',
    'Cambiar de proveedor afecta un solo archivo.',
    'Permite testear el dominio sin el sistema externo.',
  ],
  cons: [
    'Una capa más para mantener cuando la API externa cambia.',
    'Si se adapta de más, se pierden capacidades del sistema original.',
  ],
  realWorld:
    'Los adapters de axios (XHR vs. http de Node), los de Auth.js para cada base de datos, los mappers de DTO a modelo de dominio.',
  example: {
    title: 'Unificar lecturas de test kits',
    scenario:
      'Un test kit reporta alcalinidad en dKH y otro, en ppm de CaCO₃, con nombres de campo distintos. El historial de parámetros solo debería ver dKH.',
    code: `// Lecturas tal como las devuelven los dispositivos
const hannaReading = { alk_ppm: 143, ts: '2026-03-01T09:00:00Z' };
const kitReading = { result: 8.1, unit: 'dKH', date: '2026-03-02' };

// La interfaz que espera nuestra app: { dkh, takenAt }
const fromHanna = (r) => ({ dkh: +(r.alk_ppm / 17.86).toFixed(2), takenAt: new Date(r.ts) });
const fromKit = (r) => ({ dkh: r.result, takenAt: new Date(r.date) });

class AlkalinityLog {
  #entries = [];
  add(reading) {
    this.#entries.push(reading);
  }
  average() {
    const total = this.#entries.reduce((sum, e) => sum + e.dkh, 0);
    return +(total / this.#entries.length).toFixed(2);
  }
}

const log = new AlkalinityLog();
log.add(fromHanna(hannaReading));
log.add(fromKit(kitReading));
console.log(log.average()); // ~8.05 dKH`,
  },
  related: ['facade', 'decorator', 'hexagonal', 'bridge'],
};
