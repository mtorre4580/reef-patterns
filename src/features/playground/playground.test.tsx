import type * as RunModule from '@/lib/runner/run';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { challengesById } from '@/content';
import { renderRoute } from '@/test/renderRoute';
import { draftKey } from './useDraft';

vi.mock('./CodeEditor', async () => ({ CodeEditor: (await import('@/test/mocks')).FakeEditor }));
// Worker en el mismo hilo: jsdom no tiene Web Workers
vi.mock('@/lib/runner/run', async (importOriginal) => {
  const original = await importOriginal<typeof RunModule>();
  const { createInlineWorker } = await import('@/test/mocks');
  return {
    ...original,
    runInWorker: (request: Parameters<typeof RunModule.runInWorker>[0]) =>
      original.runInWorker(request, createInlineWorker),
  };
});

const challenge = challengesById.get('observer-1')!;

async function openChallenge(path = '/playground?challenge=observer-1') {
  const utils = renderRoute(path);
  await screen.findByRole('heading', { level: 1, name: challenge.title });
  const editor = screen.getByRole('textbox', { name: /Editor de código/ });
  return { ...utils, editor };
}

describe('playground', () => {
  it('muestra el enunciado y el código inicial', async () => {
    const { editor } = await openChallenge();
    expect(editor).toHaveValue(challenge.starterCode);
    expect(
      screen.getByText(
        `${challenge.tests.length} tests sin ejecutar. Probá con Ejecutar o ⌘/Ctrl + Enter.`,
      ),
    ).toBeInTheDocument();
  });

  it('ejecuta los tests y reporta fallos del starter', async () => {
    const { user } = await openChallenge();
    await user.click(screen.getByRole('button', { name: /Ejecutar tests/ }));
    expect(await screen.findByText(/de 5 pasaron/)).toBeInTheDocument();
    expect(screen.getAllByText(/Falló:/).length).toBeGreaterThan(0);
  });

  it('se resuelve de punta a punta con la solución', async () => {
    const { user, editor } = await openChallenge();
    fireEvent.change(editor, { target: { value: challenge.solution } });
    await user.keyboard('{Control>}{Enter}{/Control}');
    expect(await screen.findByText('¡Todo en verde! 5 de 5 pasaron.')).toBeInTheDocument();
  });

  it('autoguarda el borrador y Reiniciar lo descarta', async () => {
    const { user, editor } = await openChallenge();
    fireEvent.change(editor, { target: { value: '// mi intento' } });
    await waitFor(() => expect(localStorage.getItem(draftKey('observer-1'))).toBe('// mi intento'));
    await user.click(screen.getByRole('button', { name: /Reiniciar/ }));
    expect(screen.getByRole('textbox', { name: /Editor de código/ })).toHaveValue(
      challenge.starterCode,
    );
    expect(localStorage.getItem(draftKey('observer-1'))).toBeNull();
  });

  it('recupera el borrador guardado', async () => {
    localStorage.setItem(draftKey('observer-1'), '// guardado antes');
    const { editor } = await openChallenge();
    expect(editor).toHaveValue('// guardado antes');
  });

  it('muestra las pistas de a una', async () => {
    const { user } = await openChallenge();
    await user.click(screen.getByRole('button', { name: 'Ver pista (1 de 3)' }));
    expect(screen.getByText(/Pista 1:/)).toBeInTheDocument();
    expect(screen.queryByText(/Pista 2:/)).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Ver pista (2 de 3)' }));
    expect(screen.getByText(/Pista 2:/)).toBeInTheDocument();
  });

  it('pide confirmación antes de mostrar la solución', async () => {
    const { user, editor } = await openChallenge();
    await user.click(screen.getByRole('button', { name: 'Ver solución' }));
    const dialog = await screen.findByRole('alertdialog', { name: '¿Ver la solución?' });
    expect(dialog).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Ver solución' }));
    await user.click(await screen.findByRole('button', { name: 'Copiar al editor' }));
    expect(editor).toHaveValue(challenge.solution);
  });

  it('resuelve el challenge a partir del patrón', async () => {
    renderRoute('/playground?pattern=observer');
    expect(
      await screen.findByRole('heading', { level: 1, name: challenge.title }),
    ).toBeInTheDocument();
  });

  it('avisa si un patrón todavía no tiene challenges', async () => {
    renderRoute('/playground?pattern=visitor');
    expect(await screen.findByText(/Todavía no hay challenges para Visitor/)).toBeInTheDocument();
  });
});
