import type { Challenge } from '../../types';

export const factoryMethod2: Challenge = {
  id: 'factory-method-2',
  patternId: 'factory-method',
  title: {
    en: 'Card brands from the card number',
    es: 'Marca de tarjeta a partir del número',
    'pt-BR': 'Bandeira do cartão a partir do número',
  },
  difficulty: 'media',
  story: {
    en: 'The payment form receives a card number and must show the brand logo and a masked number. Each screen guessed the brand its own way and one showed Amex cards as Visa.',
    es: 'El formulario de pago recibe un número de tarjeta y tiene que mostrar el logo de la marca y el número enmascarado. Cada pantalla adivinaba la marca a su manera y una mostraba las Amex como Visa.',
    'pt-BR':
      'O formulário de pagamento recebe um número de cartão e precisa mostrar o logo da bandeira e o número mascarado. Cada tela adivinhava a bandeira do seu jeito e uma mostrava cartões Amex como Visa.',
  },
  instructions: {
    en: 'Implement `createCard(number)`, which ignores spaces and returns `{ brand, last4, mask() }`:\n- Starts with `4`: brand `"visa"`.\n- Starts with `51`–`55`: brand `"mastercard"`.\n- Starts with `34` or `37`: brand `"amex"`.\n- `last4` holds the last 4 digits and `mask()` returns `"•••• <last4>"`.\n- Anything else throws `Error("Unknown card brand")`.',
    es: 'Implementá `createCard(number)`, que ignora espacios y devuelve `{ brand, last4, mask() }`:\n- Empieza con `4`: marca `"visa"`.\n- Empieza con `51`–`55`: marca `"mastercard"`.\n- Empieza con `34` o `37`: marca `"amex"`.\n- `last4` tiene los últimos 4 dígitos y `mask()` devuelve `"•••• <last4>"`.\n- Cualquier otra cosa lanza `Error("Unknown card brand")`.',
    'pt-BR':
      'Implemente `createCard(number)`, que ignora espaços e devolve `{ brand, last4, mask() }`:\n- Começa com `4`: bandeira `"visa"`.\n- Começa com `51`–`55`: bandeira `"mastercard"`.\n- Começa com `34` ou `37`: bandeira `"amex"`.\n- `last4` tem os últimos 4 dígitos e `mask()` devolve `"•••• <last4>"`.\n- Qualquer outra coisa lança `Error("Unknown card brand")`.',
  },
  starterCode: `function createCard(number) {
  return { brand: 'visa', last4: number.slice(-4), mask: () => '•••• ' + number.slice(-4) };
}
`,
  tests: [
    {
      name: {
        en: 'detects Visa and ignores spaces',
        es: 'detecta Visa e ignora espacios',
        'pt-BR': 'detecta Visa e ignora espaços',
      },
      code: `const card = createCard('4111 1111 1111 1234');
expect(card.brand).toBe('visa');
expect(card.last4).toBe('1234');
expect(card.mask()).toBe('•••• 1234');`,
    },
    {
      name: { en: 'detects Mastercard', es: 'detecta Mastercard', 'pt-BR': 'detecta Mastercard' },
      code: `expect(createCard('5500000000000004').brand).toBe('mastercard');
expect(createCard('5105105105105100').brand).toBe('mastercard');`,
    },
    {
      name: { en: 'detects Amex', es: 'detecta Amex', 'pt-BR': 'detecta Amex' },
      code: `expect(createCard('3782 822463 10005').brand).toBe('amex');
expect(createCard('341111111111111').mask()).toBe('•••• 1111');`,
    },
    {
      name: {
        en: 'an unknown number throws an error',
        es: 'un número desconocido lanza un error',
        'pt-BR': 'um número desconhecido lança um erro',
      },
      code: `expect(() => createCard('6011000990139424')).toThrow('Unknown card brand');`,
    },
  ],
  hints: {
    en: [
      'Normalize first: `number.replace(/\\s+/g, "")`.',
      'A list of "recognizers" `{ brand, match: /^4/ }` avoids one if per brand.',
      'Mastercard is `/^5[1-5]/` and Amex is `/^3[47]/`.',
    ],
    es: [
      'Normalizá primero: `number.replace(/\\s+/g, "")`.',
      'Una lista de "reconocedores" `{ brand, match: /^4/ }` evita un if por marca.',
      'Mastercard es `/^5[1-5]/` y Amex es `/^3[47]/`.',
    ],
    'pt-BR': [
      'Normalize primeiro: `number.replace(/\\s+/g, "")`.',
      'Uma lista de "reconhecedores" `{ brand, match: /^4/ }` evita um if por bandeira.',
      'Mastercard é `/^5[1-5]/` e Amex é `/^3[47]/`.',
    ],
  },
  solution: `const brands = [
  { brand: 'visa', match: /^4/ },
  { brand: 'mastercard', match: /^5[1-5]/ },
  { brand: 'amex', match: /^3[47]/ },
];

function createCard(number) {
  const digits = number.replace(/\\s+/g, '');
  const found = brands.find(({ match }) => match.test(digits));
  if (!found) throw new Error('Unknown card brand');
  const last4 = digits.slice(-4);
  return { brand: found.brand, last4, mask: () => '•••• ' + last4 };
}
`,
};
