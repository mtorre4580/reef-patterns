/**
 * Scrolls to an element and moves focus to it without touching `location.hash`, so in-page
 * jumps do not add history entries or trigger a router navigation.
 */
export const scrollToId = (id: string): void => {
  const target = document.getElementById(id);
  if (!target) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
};
