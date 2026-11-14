import type * as RunModule from '@/lib/runner/run';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { challengesById } from '@/content';
import { renderRoute } from '@/test/renderRoute';
import { draftKey } from './useDraft';

vi.mock('./CodeEditor', async () => ({ CodeEditor: (await import('@/test/mocks')).FakeEditor }));
// Same-thread worker: jsdom has no Web Workers
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
  await screen.findByRole('heading', { level: 1, name: challenge.title.en }, { timeout: 5000 });
  const editor = screen.getByRole('textbox', { name: /Code editor/ });
  return { ...utils, editor };
}

describe('playground', () => {
  it('shows the brief and the starter code', async () => {
    const { editor } = await openChallenge();
    expect(editor).toHaveValue(challenge.starterCode);
    expect(
      screen.getByText(
        `${challenge.tests.length} tests not run yet. Try Run tests or ⌘/Ctrl + Enter.`,
      ),
    ).toBeInTheDocument();
  });

  it('runs the tests and reports starter failures', async () => {
    const { user } = await openChallenge();
    await user.click(screen.getByRole('button', { name: /Run tests/ }));
    expect(await screen.findByText(/of 5 passed/)).toBeInTheDocument();
    expect(screen.getAllByText(/Failed:/).length).toBeGreaterThan(0);
  });

  it('is solved end to end with the solution', async () => {
    const { user, editor } = await openChallenge();
    fireEvent.change(editor, { target: { value: challenge.solution } });
    await user.keyboard('{Control>}{Enter}{/Control}');
    expect(await screen.findByText('All green! 5 of 5 passed.')).toBeInTheDocument();
  });

  it('autosaves the draft and Reset discards it', async () => {
    const { user, editor } = await openChallenge();
    fireEvent.change(editor, { target: { value: '// my attempt' } });
    await waitFor(() => expect(localStorage.getItem(draftKey('observer-1'))).toBe('// my attempt'));
    await user.click(screen.getByRole('button', { name: /Reset/ }));
    expect(screen.getByRole('textbox', { name: /Code editor/ })).toHaveValue(challenge.starterCode);
    expect(localStorage.getItem(draftKey('observer-1'))).toBeNull();
  });

  it('restores the saved draft', async () => {
    localStorage.setItem(draftKey('observer-1'), '// saved earlier');
    const { editor } = await openChallenge();
    expect(editor).toHaveValue('// saved earlier');
  });

  it('shows hints one at a time', async () => {
    const { user } = await openChallenge();
    await user.click(screen.getByRole('button', { name: 'Show hint (1 of 3)' }));
    expect(screen.getByText(/Hint 1:/)).toBeInTheDocument();
    expect(screen.queryByText(/Hint 2:/)).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Show hint (2 of 3)' }));
    expect(screen.getByText(/Hint 2:/)).toBeInTheDocument();
  });

  it('asks for confirmation before showing the solution', async () => {
    const { user, editor } = await openChallenge();
    await user.click(screen.getByRole('button', { name: 'Show solution' }));
    const dialog = await screen.findByRole('alertdialog', { name: 'Show the solution?' });
    expect(dialog).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Show solution' }));
    await user.click(await screen.findByRole('button', { name: 'Copy to editor' }));
    expect(editor).toHaveValue(challenge.solution);
  });

  it('resolves the challenge from the pattern', async () => {
    renderRoute('/playground?pattern=observer');
    expect(
      await screen.findByRole('heading', { level: 1, name: challenge.title.en }),
    ).toBeInTheDocument();
  });

  it('localizes runner messages', async () => {
    const { user } = renderRoute('/playground?challenge=observer-1', 'es');
    await screen.findByRole('heading', { level: 1, name: challenge.title.es }, { timeout: 5000 });
    await user.click(screen.getByRole('button', { name: /Ejecutar tests/ }));
    expect(await screen.findByText(/de 5 pasaron/)).toBeInTheDocument();
    expect(screen.getAllByText(/Se esperaba/).length).toBeGreaterThan(0);
    // test names come from the localized content too
    expect(screen.getByText(challenge.tests[0]!.name.es)).toBeInTheDocument();
  });

  it('shows the challenge content in Portuguese', async () => {
    renderRoute('/playground?challenge=observer-1', 'pt-BR');
    expect(
      await screen.findByRole(
        'heading',
        { level: 1, name: challenge.title['pt-BR'] },
        { timeout: 5000 },
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(challenge.story['pt-BR'])).toBeInTheDocument();
  });

  it('says when a pattern has no challenges yet', async () => {
    renderRoute('/playground?pattern=visitor');
    expect(await screen.findByText(/There are no challenges for Visitor yet/)).toBeInTheDocument();
  });
});

describe('helm', () => {
  const realMatchMedia = window.matchMedia;
  beforeEach(() => {
    // Reduced motion: the helm shows the result without animating
    window.matchMedia = ((query: string) => ({
      ...realMatchMedia(query),
      matches: query.includes('prefers-reduced-motion'),
    })) as typeof window.matchMedia;
  });
  afterEach(() => {
    window.matchMedia = realMatchMedia;
  });

  it('without params shows the helm and opens the chosen challenge', async () => {
    const { user, router } = renderRoute('/playground');
    expect(
      await screen.findByRole('heading', { name: 'Spin the helm' }, { timeout: 5000 }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Spin the helm' }));
    expect(await screen.findByText(/You got/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Start challenge/ }));
    expect(router.state.location.search).toMatch(/^\?challenge=[a-z-]+-\d+$/);
  });

  it('spins with the keyboard and respects the filters', async () => {
    const { user } = renderRoute('/playground');
    await screen.findByRole('heading', { name: 'Spin the helm' }, { timeout: 5000 });
    await user.click(screen.getByRole('button', { name: 'Reef' }));
    expect(screen.getByText(/2 patterns · 2 challenges in play/)).toBeInTheDocument();
    screen.getByRole('button', { name: 'Spin the helm' }).focus();
    await user.keyboard('{Enter}');
    const result = await screen.findByText(/You got/);
    expect(result.textContent).toMatch(/State|Command/);
  });

  it('marks the challenge as solved and saves it', async () => {
    const { user, editor } = await openChallenge();
    expect(screen.getByText('Unsolved')).toBeInTheDocument();
    fireEvent.change(editor, { target: { value: challenge.solution } });
    await user.click(screen.getByRole('button', { name: /Run tests/ }));
    expect(await screen.findByText('Solved')).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('reef-patterns:progress')!)).toEqual({
      completed: ['observer-1'],
    });
  });

  it('opens the helm from a challenge', async () => {
    const { user } = await openChallenge();
    await user.click(screen.getByRole('button', { name: /Spin the helm/ }));
    expect(await screen.findByRole('dialog', { name: 'Spin the helm' })).toBeInTheDocument();
  });
});
