import type { HighlighterCore } from 'shiki/core';
import { shikiThemes } from './editor-theme';

let highlighter: Promise<HighlighterCore> | null = null;

/** Loads Shiki once, with only JavaScript and the JS regex engine (no wasm). */
function getHighlighter(): Promise<HighlighterCore> {
  highlighter ??= Promise.all([
    import('shiki/core'),
    import('shiki/engine/javascript'),
    import('shiki/langs/javascript.mjs'),
  ]).then(([{ createHighlighterCore }, { createJavaScriptRegexEngine }, js]) =>
    createHighlighterCore({
      themes: [shikiThemes.dark, shikiThemes.light],
      langs: [js.default],
      engine: createJavaScriptRegexEngine(),
    }),
  );
  return highlighter;
}

export async function highlightJs(code: string): Promise<string> {
  const hl = await getHighlighter();
  return hl.codeToHtml(code, {
    lang: 'javascript',
    themes: { dark: shikiThemes.dark.name, light: shikiThemes.light.name },
    defaultColor: false,
  });
}
