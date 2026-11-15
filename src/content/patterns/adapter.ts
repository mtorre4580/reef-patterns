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
      en: 'Unifying payment providers',
      es: 'Unificar proveedores de pago',
      'pt-BR': 'Unificar provedores de pagamento',
    },
    scenario: {
      en: 'One payment provider returns amounts in cents and another as decimal strings with different field names. The orders screen should only see one shape.',
      es: 'Un proveedor de pagos devuelve montos en centavos y otro como strings decimales con otros nombres de campo. La pantalla de órdenes solo debería ver una forma.',
      'pt-BR':
        'Um provedor de pagamento devolve valores em centavos e outro como strings decimais com outros nomes de campo. A tela de pedidos só deveria ver um formato.',
    },
    code: `// Responses exactly as each provider returns them
const stripeCharge = { id: 'ch_1', amount: 2599, currency: 'usd', status: 'succeeded' };
const paypalCapture = { transaction_id: 'PP-9', gross: '12.50', state: 'COMPLETED' };

// The shape our app expects: { id, amountCents, paid }
const fromStripe = (c) => ({ id: c.id, amountCents: c.amount, paid: c.status === 'succeeded' });
const fromPaypal = (p) => ({
  id: p.transaction_id,
  amountCents: Math.round(Number(p.gross) * 100),
  paid: p.state === 'COMPLETED',
});

class PaymentsReport {
  #payments = [];
  add(payment) {
    this.#payments.push(payment);
  }
  totalPaidCents() {
    return this.#payments.filter((p) => p.paid).reduce((sum, p) => sum + p.amountCents, 0);
  }
}

const report = new PaymentsReport();
report.add(fromStripe(stripeCharge));
report.add(fromPaypal(paypalCapture));
console.log(report.totalPaidCents()); // 3849`,
  },
  related: ['facade', 'decorator', 'hexagonal', 'bridge'],
};
