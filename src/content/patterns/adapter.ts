import type { Pattern } from '../types';

export const adapter: Pattern = {
  id: 'adapter',
  rank: 6,
  name: 'Adapter',
  localName: { en: 'Adapter', es: 'Adaptador', 'pt-BR': 'Adaptador' },
  category: 'estructural',
  tier: 1,
  gof: true,
  summary: {
    en: "Translates an object's interface into the one the client expects, so incompatible pieces can work together.",
    es: 'Traduce la interfaz de un objeto a la que espera el cliente, para que piezas incompatibles trabajen juntas.',
    'pt-BR':
      'Traduz a interface de um objeto para a que o cliente espera, para que peças incompatíveis trabalhem juntas.',
  },
  when: {
    en: "When you integrate a library, API or device whose data shape doesn't match your domain and you don't want that shape to leak across the app.",
    es: 'Cuando integrás una librería, API o dispositivo cuya forma de datos no coincide con la de tu dominio y no querés que esa forma se filtre por toda la app.',
    'pt-BR':
      'Quando você integra uma biblioteca, API ou dispositivo cujo formato de dados não coincide com o do seu domínio e não quer que esse formato vaze pelo app.',
  },
  pros: {
    en: [
      'Isolates third-party code behind a clear boundary.',
      'Switching providers affects a single file.',
      'Lets you test the domain without the external system.',
    ],
    es: [
      'Aísla el código de terceros detrás de una frontera clara.',
      'Cambiar de proveedor afecta un solo archivo.',
      'Permite testear el dominio sin el sistema externo.',
    ],
    'pt-BR': [
      'Isola o código de terceiros atrás de uma fronteira clara.',
      'Trocar de fornecedor afeta um único arquivo.',
      'Permite testar o domínio sem o sistema externo.',
    ],
  },
  cons: {
    en: [
      'One more layer to maintain when the external API changes.',
      'Adapting too much loses capabilities of the original system.',
    ],
    es: [
      'Una capa más para mantener cuando la API externa cambia.',
      'Si se adapta de más, se pierden capacidades del sistema original.',
    ],
    'pt-BR': [
      'Uma camada a mais para manter quando a API externa muda.',
      'Adaptando demais, perdem-se capacidades do sistema original.',
    ],
  },
  realWorld: {
    en: 'Axios adapters (XHR vs. Node http), Auth.js adapters for each database, DTO-to-domain mappers.',
    es: 'Los adapters de axios (XHR vs. http de Node), los de Auth.js para cada base de datos, los mappers de DTO a modelo de dominio.',
    'pt-BR':
      'Os adapters do axios (XHR vs. http do Node), os do Auth.js para cada banco de dados, os mappers de DTO para modelo de domínio.',
  },
  example: {
    title: {
      en: 'Unifying test kit readings',
      es: 'Unificar lecturas de test kits',
      'pt-BR': 'Unificar leituras de kits de teste',
    },
    scenario: {
      en: 'One test kit reports alkalinity in dKH and another in ppm of CaCO₃, with different field names. The parameter history should only see dKH.',
      es: 'Un test kit reporta alcalinidad en dKH y otro, en ppm de CaCO₃, con nombres de campo distintos. El historial de parámetros solo debería ver dKH.',
      'pt-BR':
        'Um kit de teste reporta alcalinidade em dKH e outro em ppm de CaCO₃, com nomes de campo diferentes. O histórico de parâmetros só deveria ver dKH.',
    },
    code: `// Readings exactly as the devices return them
const hannaReading = { alk_ppm: 143, ts: '2026-03-01T09:00:00Z' };
const kitReading = { result: 8.1, unit: 'dKH', date: '2026-03-02' };

// The interface our app expects: { dkh, takenAt }
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
