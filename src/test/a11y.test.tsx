import axe from 'axe-core';
import { screen } from '@testing-library/react';
import { renderRoute } from '@/test/renderRoute';

vi.mock('@/features/playground/CodeEditor', async () => ({
  CodeEditor: (await import('@/test/mocks')).FakeEditor,
}));

async function audit(container: Element) {
  const results = await axe.run(container, {
    // jsdom no calcula estilos reales: el contraste se verifica aparte, en ambos temas
    rules: { 'color-contrast': { enabled: false } },
  });
  return results.violations.map(
    (v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`,
  );
}

describe('accesibilidad (axe)', () => {
  it('catálogo sin violaciones', async () => {
    const { container } = renderRoute('/');
    await screen.findByRole('heading', { level: 1 });
    expect(await audit(container)).toEqual([]);
  });

  it('detalle de patrón sin violaciones', async () => {
    const { container } = renderRoute('/patterns/strategy');
    await screen.findByRole('heading', { level: 1, name: 'Strategy' });
    expect(await audit(container)).toEqual([]);
  });

  it('playground sin violaciones', async () => {
    const { container } = renderRoute('/playground?challenge=observer-1');
    await screen.findByRole('heading', { level: 1 }, { timeout: 5000 });
    expect(await audit(container)).toEqual([]);
  });

  it('timón sin violaciones', async () => {
    const { container } = renderRoute('/playground');
    await screen.findByRole('heading', { name: 'Girá el timón' }, { timeout: 5000 });
    expect(await audit(container)).toEqual([]);
  });

  it('404 sin violaciones', async () => {
    const { container } = renderRoute('/no-existe');
    await screen.findByRole('heading', { level: 1 });
    expect(await audit(container)).toEqual([]);
  });
});
