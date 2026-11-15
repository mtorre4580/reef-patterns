import type { Challenge } from '../../types';

export const adapter1: Challenge = {
  id: 'adapter-1',
  patternId: 'adapter',
  title: {
    en: 'Unify payment providers',
    es: 'Unificar proveedores de pago',
    'pt-BR': 'Unificar provedores de pagamento',
  },
  difficulty: 'facil',
  story: {
    en: 'Stripe returns amounts in cents and PayPal as decimal strings with different field names. The payments report only understands one shape and blows up with any other.',
    es: 'Stripe devuelve montos en centavos y PayPal como strings decimales con otros nombres de campo. El reporte de pagos solo entiende una forma y explota con cualquier otra.',
    'pt-BR':
      'O Stripe devolve valores em centavos e o PayPal como strings decimais com outros nomes de campo. O relatório de pagamentos só entende um formato e quebra com qualquer outro.',
  },
  instructions: {
    en: 'Implement two adapters that return `{ id, amountCents, paid }`:\n- `fromStripe({ id, amount, status })`: `amountCents = amount`, `paid = status === "succeeded"`.\n- `fromPaypal({ transaction_id, gross, state })`: `amountCents = Math.round(Number(gross) * 100)`, `paid = state === "COMPLETED"`.\nDo not modify `PaymentsReport`.',
    es: 'Implementá dos adaptadores que devuelvan `{ id, amountCents, paid }`:\n- `fromStripe({ id, amount, status })`: `amountCents = amount`, `paid = status === "succeeded"`.\n- `fromPaypal({ transaction_id, gross, state })`: `amountCents = Math.round(Number(gross) * 100)`, `paid = state === "COMPLETED"`.\nNo modifiques `PaymentsReport`.',
    'pt-BR':
      'Implemente dois adaptadores que devolvam `{ id, amountCents, paid }`:\n- `fromStripe({ id, amount, status })`: `amountCents = amount`, `paid = status === "succeeded"`.\n- `fromPaypal({ transaction_id, gross, state })`: `amountCents = Math.round(Number(gross) * 100)`, `paid = state === "COMPLETED"`.\nNão modifique `PaymentsReport`.',
  },
  starterCode: `// Do not modify this class
class PaymentsReport {
  #payments = [];
  add(payment) {
    if (typeof payment.amountCents !== 'number' || typeof payment.paid !== 'boolean') {
      throw new TypeError('Invalid payment');
    }
    this.#payments.push(payment);
  }
  totalPaidCents() {
    return this.#payments.filter((p) => p.paid).reduce((sum, p) => sum + p.amountCents, 0);
  }
}

function fromStripe(charge) {
  return charge;
}

function fromPaypal(capture) {
  return capture;
}
`,
  tests: [
    {
      name: {
        en: 'adapts a Stripe charge',
        es: 'adapta un cobro de Stripe',
        'pt-BR': 'adapta uma cobrança do Stripe',
      },
      code: `expect(fromStripe({ id: 'ch_1', amount: 2599, status: 'succeeded' })).toEqual({ id: 'ch_1', amountCents: 2599, paid: true });`,
    },
    {
      name: {
        en: 'adapts a PayPal capture',
        es: 'adapta una captura de PayPal',
        'pt-BR': 'adapta uma captura do PayPal',
      },
      code: `expect(fromPaypal({ transaction_id: 'PP-9', gross: '12.50', state: 'COMPLETED' })).toEqual({ id: 'PP-9', amountCents: 1250, paid: true });
expect(fromPaypal({ transaction_id: 'PP-10', gross: '3.00', state: 'PENDING' }).paid).toBe(false);`,
    },
    {
      name: {
        en: 'the report accepts both providers',
        es: 'el reporte acepta ambos proveedores',
        'pt-BR': 'o relatório aceita os dois provedores',
      },
      code: `const report = new PaymentsReport();
report.add(fromStripe({ id: 'ch_1', amount: 2599, status: 'succeeded' }));
report.add(fromPaypal({ transaction_id: 'PP-9', gross: '12.50', state: 'COMPLETED' }));
report.add(fromStripe({ id: 'ch_2', amount: 999, status: 'failed' }));
expect(report.totalPaidCents()).toBe(3849);`,
    },
  ],
  hints: {
    en: [
      'Each adapter is a function that translates a provider shape into the one your app uses.',
      '`Math.round(Number("12.50") * 100)` turns the decimal string into cents without floating-point surprises.',
    ],
    es: [
      'Cada adaptador es una función que traduce la forma de un proveedor a la de tu app.',
      '`Math.round(Number("12.50") * 100)` convierte el string decimal en centavos sin sorpresas de punto flotante.',
    ],
    'pt-BR': [
      'Cada adaptador é uma função que traduz o formato de um provedor para o do seu app.',
      '`Math.round(Number("12.50") * 100)` converte a string decimal em centavos sem surpresas de ponto flutuante.',
    ],
  },
  solution: `// Do not modify this class
class PaymentsReport {
  #payments = [];
  add(payment) {
    if (typeof payment.amountCents !== 'number' || typeof payment.paid !== 'boolean') {
      throw new TypeError('Invalid payment');
    }
    this.#payments.push(payment);
  }
  totalPaidCents() {
    return this.#payments.filter((p) => p.paid).reduce((sum, p) => sum + p.amountCents, 0);
  }
}

function fromStripe({ id, amount, status }) {
  return { id, amountCents: amount, paid: status === 'succeeded' };
}

function fromPaypal({ transaction_id, gross, state }) {
  return {
    id: transaction_id,
    amountCents: Math.round(Number(gross) * 100),
    paid: state === 'COMPLETED',
  };
}
`,
};
