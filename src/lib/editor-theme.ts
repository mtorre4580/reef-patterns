/**
 * “Abyss Reef” theme, shared by Shiki (read-only highlighting) and Monaco (editor).
 * One palette per mode; both formats are derived from it.
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
  background: '#101d2b',
  foreground: '#f1e7d2',
  comment: '#9fb0bf',
  keyword: '#f2b866',
  string: '#9fe0b4',
  number: '#f29a7a',
  fn: '#8cc8f5',
  type: '#e8c86a',
  property: '#d9cbb0',
  operator: '#c2b294',
  lineHighlight: '#17283a',
  selection: '#2b4766',
  cursor: '#f2c14e',
  lineNumber: '#5d7286',
};

export const abyssReefLight: CodePalette = {
  background: '#fffaf0',
  foreground: '#13263a',
  comment: '#6a5a46',
  keyword: '#8a3d0b',
  string: '#2c6b3a',
  number: '#a12a1b',
  fn: '#1d5b94',
  type: '#6b4a00',
  property: '#3b2a1a',
  operator: '#5b4530',
  lineHighlight: '#f6ecda',
  selection: '#d6e4f2',
  cursor: '#1d5b94',
  lineNumber: '#a08c72',
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

/** Monarch tokens (Monaco JS language) → palette key */
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
