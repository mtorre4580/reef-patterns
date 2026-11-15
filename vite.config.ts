/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ command, isPreview }) => ({
  // GitHub Pages serves the project at /reef-patterns/
  base: command === 'build' || isPreview ? '/reef-patterns/' : '/',
  plugins: [react(), tailwindcss()],
  // Open the browser on `pnpm dev`; skipped in CI and when BROWSER=none
  server: { open: !process.env.CI },
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  worker: { format: 'es' },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    include: ['src/**/*.test.{ts,tsx}', 'scripts/**/*.test.ts'],
  },
}));
