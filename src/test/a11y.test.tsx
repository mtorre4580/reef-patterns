import axe from 'axe-core';
import { screen } from '@testing-library/react';
import { renderRoute } from '@/test/renderRoute';

vi.mock('@/features/playground/CodeEditor', async () => ({
  CodeEditor: (await import('@/test/mocks')).FakeEditor,
}));

async function audit(container: Element) {
  const results = await axe.run(container, {
    // jsdom does not compute real styles: contrast is checked separately, in both themes
    rules: { 'color-contrast': { enabled: false } },
  });
  return results.violations.map(
    (v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`,
  );
}

describe('accessibility (axe)', () => {
  it('catalog has no violations', async () => {
    const { container } = renderRoute('/');
    await screen.findByRole('heading', { level: 1 });
    expect(await audit(container)).toEqual([]);
  });

  it('pattern detail has no violations', async () => {
    const { container } = renderRoute('/patterns/strategy');
    await screen.findByRole('heading', { level: 1, name: 'Strategy' });
    expect(await audit(container)).toEqual([]);
  });

  it('playground has no violations', async () => {
    const { container } = renderRoute('/playground?challenge=observer-1');
    await screen.findByRole('heading', { level: 1 }, { timeout: 5000 });
    expect(await audit(container)).toEqual([]);
  });

  it('helm has no violations', async () => {
    const { container } = renderRoute('/playground');
    await screen.findByRole('heading', { name: 'Spin the helm' }, { timeout: 5000 });
    expect(await audit(container)).toEqual([]);
  });

  it('404 has no violations', async () => {
    const { container } = renderRoute('/no-such-page');
    await screen.findByRole('heading', { level: 1 });
    expect(await audit(container)).toEqual([]);
  });
});
