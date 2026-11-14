import { messages } from './messages';
import { translate } from './translate';

describe('translate', () => {
  it('resolves nested keys and placeholders', () => {
    expect(translate(messages.en, 'en', 'detail.example', { title: 'Doser' })).toBe(
      'Example: Doser',
    );
  });

  it('picks the plural form for the locale', () => {
    expect(translate(messages.en, 'en', 'catalog.count', { count: 1 })).toBe('1 pattern');
    expect(translate(messages.en, 'en', 'catalog.count', { count: 52 })).toBe('52 patterns');
    expect(translate(messages['pt-BR'], 'pt-BR', 'catalog.count', { count: 2 })).toBe('2 padrões');
  });

  it('returns the key when it is missing', () => {
    expect(translate(messages.en, 'en', 'nope.missing')).toBe('nope.missing');
  });

  it('keeps unknown placeholders untouched', () => {
    expect(translate(messages.es, 'es', 'detail.example')).toBe('Ejemplo: {title}');
  });

  it('every locale has a non-empty value for every English key', () => {
    const walk = (node: unknown, path: string[] = []): string[] =>
      typeof node === 'string'
        ? [path.join('.')]
        : Object.entries(node as object).flatMap(([k, v]) => walk(v, [...path, k]));
    for (const locale of ['es', 'pt-BR'] as const) {
      for (const key of walk(messages.en)) {
        expect(
          translate(messages[locale], locale, key.replace(/\.(one|other)$/, ''), { count: 2 }),
          key,
        ).not.toBe(key.replace(/\.(one|other)$/, ''));
      }
    }
  });
});
