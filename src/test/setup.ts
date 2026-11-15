import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
  try {
    localStorage.clear();
  } catch {
    // jsdom without storage: ignore
  }
});

// jsdom does not implement matchMedia
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      // The MediaQueryList type still requires the legacy listener API
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      addListener: () => {},
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}

// cmdk uses ResizeObserver and scrollIntoView, which jsdom does not implement
if (!('ResizeObserver' in window)) {
  (window as unknown as { ResizeObserver: unknown }).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}

// jsdom does not implement scrollTo (used by ScrollRestoration)
window.scrollTo = (() => {}) as typeof window.scrollTo;

// axe tries to use canvas; jsdom does not implement it
HTMLCanvasElement.prototype.getContext = (() =>
  null) as typeof HTMLCanvasElement.prototype.getContext;
