/**
 * Tema “Abyss Reef”, compartido por Shiki (resaltado de solo lectura) y Monaco (editor).
 * Se define una paleta por modo y de ella se derivan ambos formatos.
 */

export interface CodePalette {
  background: string;
  foreground: string;
  comment: string;
  keyword: string;
  string: string;
  number: string;
  fn: string;
  type: string;
  property: string;
  operator: string;
  lineHighlight: string;
  selection: string;
  cursor: string;
  lineNumber: string;
}

export const abyssReefDark: CodePalette = {
  background: '#081a24',
  foreground: '#d7e7ea',
  comment: '#7f9ea8',
  keyword: '#c79bff',
  string: '#5ee39a',
  number: '#f5b971',
  fn: '#7df9ff',
  type: '#8ab4ff',
  property: '#b9d7dd',
  operator: '#9ab3bb',
  lineHighlight: '#0e2532',
  selection: '#1d4a5a',
  cursor: '#7df9ff',
  lineNumber: '#4d6b75',
};

export const abyssReefLight: CodePalette = {
  background: '#fffdf8',
  foreground: '#14303b',
  comment: '#5f7177',
  keyword: '#7a3fd0',
  string: '#157a3b',
  number: '#a35a05',
  fn: '#0369a1',
  type: '#2457c5',
  property: '#2c4a55',
  operator: '#46595f',
  lineHighlight: '#f4efe4',
  selection: '#cfe8e4',
  cursor: '#0f766e',
  lineNumber: '#8a9a9e',
};

type Scope = { scope: string[]; key: keyof CodePalette; fontStyle?: string };

const scopes: Scope[] = [
  { scope: ['comment', 'punctuation.definition.comment'], key: 'comment', fontStyle: 'italic' },
  {
    scope: ['keyword', 'storage', 'storage.type', 'storage.modifier', 'keyword.control'],
    key: 'keyword',
  },
  { scope: ['string', 'string.template', 'punctuation.definition.string'], key: 'string' },
  { scope: ['constant.numeric', 'constant.language', 'constant.character'], key: 'number' },
  { scope: ['entity.name.function', 'support.function', 'meta.function-call'], key: 'fn' },
  {
    scope: [
      'entity.name.type',
      'entity.name.class',
      'support.class',
      'entity.other.inherited-class',
    ],
    key: 'type',
  },
  {
    scope: ['variable.other.property', 'meta.object-literal.key', 'support.variable.property'],
    key: 'property',
  },
  { scope: ['keyword.operator', 'punctuation'], key: 'operator' },
  { scope: ['variable', 'variable.other.readwrite'], key: 'foreground' },
];

export function toShikiTheme(name: string, palette: CodePalette, type: 'dark' | 'light') {
  return {
    name,
    type,
    colors: {
      'editor.background': palette.background,
      'editor.foreground': palette.foreground,
    },
    tokenColors: scopes.map(({ scope, key, fontStyle }) => ({
      scope,
      settings: { foreground: palette[key], ...(fontStyle ? { fontStyle } : {}) },
    })),
  };
}

export const shikiThemes = {
  dark: toShikiTheme('abyss-reef-dark', abyssReefDark, 'dark'),
  light: toShikiTheme('abyss-reef-light', abyssReefLight, 'light'),
};

/** Tokens de Monarch (lenguaje JS de Monaco) → clave de la paleta */
const monacoTokens: [string, keyof CodePalette, string?][] = [
  ['comment', 'comment', 'italic'],
  ['keyword', 'keyword'],
  ['string', 'string'],
  ['string.escape', 'number'],
  ['regexp', 'string'],
  ['number', 'number'],
  ['type', 'type'],
  ['type.identifier', 'type'],
  ['identifier', 'foreground'],
  ['delimiter', 'operator'],
  ['operator', 'operator'],
];

const hex = (color: string) => color.replace('#', '');

export function toMonacoTheme(palette: CodePalette, base: 'vs-dark' | 'vs') {
  return {
    base,
    inherit: true,
    rules: monacoTokens.map(([token, key, fontStyle]) => ({
      token,
      foreground: hex(palette[key]),
      ...(fontStyle ? { fontStyle } : {}),
    })),
    colors: {
      'editor.background': palette.background,
      'editor.foreground': palette.foreground,
      'editor.lineHighlightBackground': palette.lineHighlight,
      'editor.selectionBackground': palette.selection,
      'editorCursor.foreground': palette.cursor,
      'editorLineNumber.foreground': palette.lineNumber,
      'editorLineNumber.activeForeground': palette.foreground,
      'editorIndentGuide.background1': palette.lineHighlight,
      focusBorder: palette.cursor,
    },
  };
}

export const monacoThemes = {
  dark: toMonacoTheme(abyssReefDark, 'vs-dark'),
  light: toMonacoTheme(abyssReefLight, 'vs'),
};
