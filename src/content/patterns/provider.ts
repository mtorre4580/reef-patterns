import type { Pattern } from '../types';

export const provider: Pattern = {
  id: 'provider',
  rank: 24,
  name: 'Provider',
  localName: { en: 'Provider', es: 'Proveedor', 'pt-BR': 'Provedor' },
  category: 'frontend',
  tier: 2,
  gof: false,
  summary: {
    en: 'A component high in the tree makes data or services available to all its descendants without passing them through props.',
    es: 'Un componente en lo alto del árbol pone datos o servicios a disposición de todos sus descendientes sin pasarlos por props.',
    'pt-BR':
      'Um componente no alto da árvore disponibiliza dados ou serviços para todos os seus descendentes sem passá-los por props.',
  },
  when: {
    en: 'When a value (theme, user, units, API client) is needed by components at many levels and passing it through props causes prop drilling.',
    es: 'Cuando un valor (tema, usuario, unidades, cliente de API) lo necesitan componentes en muchos niveles y pasarlo por props genera prop drilling.',
    'pt-BR':
      'Quando um valor (tema, usuário, unidades, cliente de API) é necessário em componentes de muitos níveis e passá-lo por props gera prop drilling.',
  },
  pros: {
    en: [
      'Removes prop drilling.',
      'Works as dependency injection: swap the value in tests.',
      'Nested providers let you override values per section.',
    ],
    es: [
      'Elimina el prop drilling.',
      'Funciona como inyección de dependencias: se cambia el valor en tests.',
      'Varios providers anidados permiten sobrescribir valores por sección.',
    ],
    'pt-BR': [
      'Elimina o prop drilling.',
      'Funciona como injeção de dependências: troca-se o valor nos testes.',
      'Vários providers aninhados permitem sobrescrever valores por seção.',
    ],
  },
  cons: {
    en: [
      'Every change to the value re-renders all consumers.',
      "Dependencies become implicit: they don't show up in props.",
    ],
    es: [
      'Cada cambio del valor re-renderiza a todos los consumidores.',
      'Las dependencias se vuelven implícitas: no se ven en las props.',
    ],
    'pt-BR': [
      'Cada mudança do valor re-renderiza todos os consumidores.',
      'As dependências ficam implícitas: não aparecem nas props.',
    ],
  },
  realWorld: {
    en: "React Context, styled-components' ThemeProvider, QueryClientProvider, Vue's provide/inject.",
    es: 'React Context, ThemeProvider de styled-components, QueryClientProvider, el provide/inject de Vue.',
    'pt-BR':
      'React Context, o ThemeProvider do styled-components, o QueryClientProvider, o provide/inject do Vue.',
  },
  example: {
    title: {
      en: 'AuthProvider with the current user',
      es: 'AuthProvider con el usuario actual',
      'pt-BR': 'AuthProvider com o usuário atual',
    },
    scenario: {
      en: 'The header, the settings page and dozens of buttons need the current user and a logout function. Passing them through ten levels of props was unmanageable.',
      es: 'El header, la página de configuración y decenas de botones necesitan el usuario actual y una función de logout. Pasarlos por diez niveles de props era inmanejable.',
      'pt-BR':
        'O header, a página de configurações e dezenas de botões precisam do usuário atual e de uma função de logout. Passá-los por dez níveis de props era impossível de manter.',
    },
    code: `import { createContext, createElement as h, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children, initialUser = null }) => {
  const [user, setUser] = useState(initialUser);
  const value = useMemo(
    () => ({ user, login: setUser, logout: () => setUser(null) }),
    [user],
  );
  return h(AuthContext.Provider, { value }, children);
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};

// A component deep in the tree reads the user without extra props
export const UserMenu = () => {
  const { user, logout } = useAuth();
  if (!user) return h('a', { href: '/login' }, 'Sign in');
  return h('button', { onClick: logout }, 'Sign out ' + user.name);
};

// <AuthProvider initialUser={{ name: 'Ana' }}><App /></AuthProvider>`,
  },
  related: ['dependency-injection', 'custom-hooks', 'singleton', 'compound-components'],
};
