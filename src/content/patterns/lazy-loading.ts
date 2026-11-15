import type { Pattern } from '../types';

export const lazyLoading: Pattern = {
  id: 'lazy-loading',
  rank: 39,
  name: 'Lazy Loading',
  localName: { en: 'Lazy Loading', es: 'Carga diferida', 'pt-BR': 'Carregamento tardio' },
  category: 'frontend',
  tier: 3,
  gof: false,
  summary: {
    en: 'Defers loading or creating something expensive until the moment it is actually needed.',
    es: 'Posterga la carga o creación de algo costoso hasta el momento en que realmente se necesita.',
    'pt-BR':
      'Adia o carregamento ou a criação de algo custoso até o momento em que realmente é necessário.',
  },
  when: {
    en: 'When part of the app (a route, an editor, a heavy library, an image) is not always used and loading it upfront slows down startup.',
    es: 'Cuando una parte de la app (una ruta, un editor, una librería pesada, una imagen) no se usa siempre y cargarla de entrada demora el arranque.',
    'pt-BR':
      'Quando uma parte do app (uma rota, um editor, uma biblioteca pesada, uma imagem) não é sempre usada e carregá-la de saída atrasa a inicialização.',
  },
  pros: {
    en: ['Faster startup and fewer initial bytes.', 'You do not pay for what you do not use.'],
    es: ['Arranque más rápido y menos bytes iniciales.', 'No se paga por lo que no se usa.'],
    'pt-BR': [
      'Inicialização mais rápida e menos bytes iniciais.',
      'Não se paga pelo que não se usa.',
    ],
  },
  cons: {
    en: [
      'Latency on first use: a loading state is needed.',
      'Too many tiny chunks make total loading worse.',
    ],
    es: [
      'Latencia en el primer uso: hay que mostrar un estado de carga.',
      'Demasiados fragmentos pequeños empeoran la carga total.',
    ],
    'pt-BR': [
      'Latência no primeiro uso: é preciso mostrar um estado de carregamento.',
      'Fragmentos pequenos demais pioram o carregamento total.',
    ],
  },
  realWorld: {
    en: 'React.lazy with Suspense, dynamic import(), loading="lazy" on images, route-level code splitting in Vite and Next.js.',
    es: 'React.lazy con Suspense, import() dinámico, loading="lazy" en imágenes, el code splitting por ruta de Vite y Next.js.',
    'pt-BR':
      'React.lazy com Suspense, import() dinâmico, loading="lazy" em imagens, o code splitting por rota do Vite e do Next.js.',
  },
  example: {
    title: {
      en: 'PDF export loaded on demand',
      es: 'Exportar a PDF cargado a demanda',
      'pt-BR': 'Exportar para PDF carregado sob demanda',
    },
    scenario: {
      en: 'The PDF library is heavy and only used by people who click "Export". It is loaded the first time and reused afterwards.',
      es: 'La librería de PDF es pesada y solo la usa quien hace clic en "Exportar". Se carga la primera vez y se reutiliza después.',
      'pt-BR':
        'A biblioteca de PDF é pesada e só é usada por quem clica em "Exportar". Ela é carregada na primeira vez e reutilizada depois.',
    },
    code: `function lazy(loader) {
  let promise = null;
  // Memoize the promise: even if requested many times, it loads once
  return () => (promise ??= loader());
}

let loads = 0;
const loadPdfKit = lazy(async () => {
  loads++;
  // In the real app: return import('./pdf-export.js');
  return { render: (invoice) => '%PDF-1.7 invoice ' + invoice.id + ' total ' + invoice.total };
});

async function exportInvoice(invoice) {
  const pdf = await loadPdfKit();
  return pdf.render(invoice);
}

console.log('App ready without the PDF library. Loads:', loads); // 0
exportInvoice({ id: 'inv_1', total: 120 })
  .then(() => exportInvoice({ id: 'inv_2', total: 80 }))
  .then((file) => console.log(file, '· loads:', loads)); // 1`,
  },
  related: ['proxy', 'singleton', 'flyweight'],
};
