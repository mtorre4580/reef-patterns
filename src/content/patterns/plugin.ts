import type { Pattern } from '../types';

export const plugin: Pattern = {
  id: 'plugin',
  rank: 42,
  name: 'Plugin',
  localName: { en: 'Plugin', es: 'Complemento', 'pt-BR': 'Plugin' },
  category: 'arquitectura',
  tier: 3,
  gof: false,
  summary: {
    en: 'A stable core exposes extension points so external modules can add features without changing it.',
    es: 'Un núcleo estable expone puntos de extensión para que módulos externos agreguen funcionalidad sin modificarlo.',
    'pt-BR':
      'Um núcleo estável expõe pontos de extensão para que módulos externos adicionem funcionalidade sem modificá-lo.',
  },
  when: {
    en: 'When third parties (or your own team) need to extend a tool in ways you cannot anticipate, without forking the core.',
    es: 'Cuando terceros (o tu propio equipo) necesitan extender una herramienta en formas que no podés anticipar, sin forkear el núcleo.',
    'pt-BR':
      'Quando terceiros (ou seu próprio time) precisam estender uma ferramenta de formas que você não consegue prever, sem fazer fork do núcleo.',
  },
  pros: {
    en: [
      'A small, stable core.',
      'Independent extensions that can be turned on or off.',
      'Encourages an ecosystem.',
    ],
    es: [
      'Núcleo pequeño y estable.',
      'Extensiones independientes, que se activan o desactivan.',
      'Fomenta un ecosistema.',
    ],
    'pt-BR': [
      'Núcleo pequeno e estável.',
      'Extensões independentes, que se ativam ou desativam.',
      'Estimula um ecossistema.',
    ],
  },
  cons: {
    en: [
      'The extension API is a contract that is hard to change.',
      'Badly written plugins degrade the whole system.',
    ],
    es: [
      'La API de extensión es un contrato difícil de cambiar.',
      'Plugins mal hechos degradan al sistema entero.',
    ],
    'pt-BR': [
      'A API de extensão é um contrato difícil de mudar.',
      'Plugins mal feitos degradam o sistema inteiro.',
    ],
  },
  realWorld: {
    en: 'Vite, Rollup, Babel, ESLint and Tailwind plugins; VS Code extensions; Tapable hooks in webpack.',
    es: 'Los plugins de Vite, Rollup, Babel, ESLint y Tailwind; las extensiones de VS Code; los hooks de Tapable en webpack.',
    'pt-BR':
      'Os plugins do Vite, Rollup, Babel, ESLint e Tailwind; as extensões do VS Code; os hooks do Tapable no webpack.',
  },
  example: {
    title: {
      en: 'Extensible markdown renderer',
      es: 'Renderizador de markdown extensible',
      'pt-BR': 'Renderizador de markdown extensível',
    },
    scenario: {
      en: 'The docs site ships a small markdown renderer. Teams add plugins: one turns ticket ids into links, another adds an "edited" note when a page is saved.',
      es: 'El sitio de documentación trae un renderizador de markdown chico. Los equipos suman plugins: uno convierte ids de tickets en links, otro agrega una nota de "editado" al guardar.',
      'pt-BR':
        'O site de documentação traz um renderizador de markdown pequeno. Os times adicionam plugins: um transforma ids de tickets em links, outro adiciona uma nota de "editado" ao salvar.',
    },
    code: `function createRenderer() {
  const hooks = { transform: [], beforeSave: [] };
  const api = {
    on(hook, handler) {
      hooks[hook].push(handler);
    },
  };

  return {
    use(plugin) {
      plugin.setup(api); // the plugin only sees the public API
      return this;
    },
    render(markdown) {
      return hooks.transform.reduce((text, fn) => fn(text), markdown);
    },
    save(page) {
      return hooks.beforeSave.reduce((p, fn) => fn(p), page);
    },
  };
}

const ticketLinks = {
  name: 'ticket-links',
  setup(api) {
    api.on('transform', (text) => text.replace(/\\b(ENG-\\d+)\\b/g, '[$1](https://tracker.example.com/$1)'));
  },
};

const editedNote = {
  name: 'edited-note',
  setup(api) {
    api.on('beforeSave', (page) => ({ ...page, footer: 'Edited by ' + page.author }));
  },
};

const renderer = createRenderer().use(ticketLinks).use(editedNote);
console.log(renderer.render('Fixed in ENG-421'));
console.log(renderer.save({ title: 'Deploy guide', author: 'ana' }));`,
  },
  related: ['middleware', 'observer', 'hexagonal'],
};
