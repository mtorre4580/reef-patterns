import type { Pattern } from '../types';

export const hexagonal: Pattern = {
  id: 'hexagonal',
  rank: 51,
  name: 'Hexagonal Architecture',
  localName: {
    en: 'Hexagonal Architecture',
    es: 'Arquitectura hexagonal (puertos y adaptadores)',
    'pt-BR': 'Arquitetura hexagonal (portas e adaptadores)',
  },
  category: 'arquitectura',
  tier: 4,
  gof: false,
  summary: {
    en: 'The application core defines ports (interfaces) and everything external plugs in through interchangeable adapters.',
    es: 'El núcleo de la aplicación define puertos (interfaces) y todo lo externo se conecta mediante adaptadores intercambiables.',
    'pt-BR':
      'O núcleo da aplicação define portas (interfaces) e tudo o que é externo se conecta por adaptadores intercambiáveis.',
  },
  when: {
    en: 'When business logic must survive changes of framework, database or provider, and you want to test it without infrastructure.',
    es: 'Cuando la lógica de negocio tiene que sobrevivir a cambios de framework, base de datos o proveedor, y querés testearla sin infraestructura.',
    'pt-BR':
      'Quando a lógica de negócio precisa sobreviver a mudanças de framework, banco de dados ou fornecedor e você quer testá-la sem infraestrutura.',
  },
  pros: {
    en: [
      'A domain independent of frameworks and providers.',
      'Fast core tests, with no network or database.',
      'Changing a provider means writing an adapter.',
    ],
    es: [
      'Dominio independiente de frameworks y proveedores.',
      'Tests del núcleo rápidos, sin red ni base de datos.',
      'Cambiar un proveedor es escribir un adaptador.',
    ],
    'pt-BR': [
      'Domínio independente de frameworks e fornecedores.',
      'Testes do núcleo rápidos, sem rede nem banco.',
      'Trocar um fornecedor é escrever um adaptador.',
    ],
  },
  cons: {
    en: [
      'More layers and files from day one.',
      'Risk of premature abstractions if nothing external ever changes.',
    ],
    es: [
      'Más capas y archivos desde el día uno.',
      'Riesgo de abstracciones prematuras si nada externo cambia.',
    ],
    'pt-BR': [
      'Mais camadas e arquivos desde o primeiro dia.',
      'Risco de abstrações prematuras se nada externo mudar.',
    ],
  },
  realWorld: {
    en: 'NestJS and Node projects organized by ports, "clean" frontend architectures with use cases separated from React.',
    es: 'Proyectos NestJS y Node organizados por puertos, las arquitecturas “clean” en frontend con casos de uso separados de React.',
    'pt-BR':
      'Projetos NestJS e Node organizados por portas, as arquiteturas "clean" no frontend com casos de uso separados do React.',
  },
  example: {
    title: {
      en: 'Use case: registering a user',
      es: 'Caso de uso: registrar un usuario',
      'pt-BR': 'Caso de uso: cadastrar um usuário',
    },
    scenario: {
      en: 'The core decides how a user registers: no duplicate emails and a welcome email. Everything external (database, mailer, clock) comes in through ports; tests plug in fake adapters.',
      es: 'El núcleo decide cómo se registra un usuario: sin emails repetidos y con un email de bienvenida. Lo externo (base, mailer, reloj) entra por puertos; los tests conectan adaptadores falsos.',
      'pt-BR':
        'O núcleo decide como um usuário se cadastra: sem emails repetidos e com um email de boas-vindas. O que é externo (banco, mailer, relógio) entra por portas; os testes conectam adaptadores falsos.',
    },
    code: `// Core: imports nothing external, it only receives ports
function createRegisterUser({ users, mailer, clock }) {
  return async ({ email, name }) => {
    const normalized = email.trim().toLowerCase();
    if (await users.findByEmail(normalized)) throw new Error('Email already registered');
    const user = { email: normalized, name, createdAt: clock.now().toISOString() };
    await users.save(user);
    await mailer.send(normalized, 'Welcome, ' + name + '!');
    return user;
  };
}

// Test adapters (in production: Postgres, an email provider and the system clock)
const memoryUsers = {
  rows: [],
  async findByEmail(email) { return this.rows.find((u) => u.email === email) ?? null; },
  async save(user) { this.rows.push(user); },
};
const fakeMailer = { sent: [], async send(to, subject) { this.sent.push(to + ': ' + subject); } };
const fixedClock = { now: () => new Date('2026-03-01T10:00:00Z') };

const registerUser = createRegisterUser({ users: memoryUsers, mailer: fakeMailer, clock: fixedClock });

registerUser({ email: ' Ana@Example.com ', name: 'Ana' })
  .then((user) => console.log(user, fakeMailer.sent))
  .then(() => registerUser({ email: 'ana@example.com', name: 'Ana again' }))
  .catch((e) => console.log(e.message)); // Email already registered`,
  },
  related: ['adapter', 'dependency-injection', 'repository', 'plugin'],
};
