import { screen, within } from '@testing-library/react';
import { renderRoute } from '@/test/renderRoute';

describe('catalog', () => {
  it('lists the 52 patterns grouped by zone', () => {
    renderRoute('/');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Design patterns');
    for (const zone of ['Surface', 'Reef', 'Drop-off', 'Abyss']) {
      expect(screen.getByRole('heading', { level: 2, name: new RegExp(zone) })).toBeInTheDocument();
    }
    expect(screen.getByText('52 patterns')).toBeInTheDocument();
  });

  it('filters with fuzzy search', async () => {
    const { user } = renderRoute('/');
    await user.type(screen.getByRole('searchbox', { name: 'Search patterns' }), 'obsrver');
    expect(screen.getByRole('link', { name: /Observer/ })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /^4\s*Singleton/ })).not.toBeInTheDocument();
  });

  it('filters by category and syncs the URL', async () => {
    const { user, router } = renderRoute('/');
    await user.click(screen.getByRole('button', { name: 'Resilience' }));
    expect(screen.getByRole('button', { name: 'Resilience' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(router.state.location.search).toBe('?cat=resiliencia');
    expect(screen.getByText('4 patterns')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Circuit Breaker/ })).toBeInTheDocument();
  });

  it('reads filters from the URL', () => {
    renderRoute('/?tier=1&gof=1');
    expect(screen.getByRole('button', { name: 'Essential' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: 'GoF only' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.queryByRole('heading', { name: /Reef/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Module/ })).not.toBeInTheDocument();
  });

  it('shows an empty state and can clear filters', async () => {
    const { user } = renderRoute('/?q=zzzzzz');
    expect(screen.getByRole('status')).toHaveTextContent('No pattern matches');
    await user.click(screen.getByRole('button', { name: /Clear filters/ }));
    expect(screen.getByText('52 patterns')).toBeInTheDocument();
  });

  it('navigates to a pattern detail', async () => {
    const { user } = renderRoute('/');
    const zone = screen.getByRole('region', { name: /Surface/ });
    await user.click(within(zone).getByRole('link', { name: /Strategy/ }));
    expect(await screen.findByRole('heading', { level: 1, name: 'Strategy' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'When to use it' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Practice this pattern/ })).toHaveAttribute(
      'href',
      '/playground?pattern=strategy',
    );
  });
});

describe('pattern detail', () => {
  it('shows the example, related patterns and neighbors', async () => {
    const { user } = renderRoute('/patterns/observer');
    expect(screen.getByRole('heading', { name: /^Example:/ })).toBeInTheDocument();
    expect(screen.getByText(/class TemperatureSensor/)).toBeInTheDocument();
    const related = screen.getByRole('heading', { name: 'Related' }).closest('section')!;
    await user.click(within(related).getByRole('link', { name: 'Pub/Sub' }));
    expect(await screen.findByRole('heading', { level: 1, name: 'Pub/Sub' })).toBeInTheDocument();
  });

  it('shows a message when the pattern does not exist', () => {
    renderRoute('/patterns/no-such-pattern');
    expect(
      screen.getByRole('heading', { name: "We couldn't find that pattern" }),
    ).toBeInTheDocument();
  });
});

describe('command palette', () => {
  it('opens with ⌘K and goes to a pattern with Enter (3 keystrokes)', async () => {
    const { user } = renderRoute('/');
    await user.keyboard('{Meta>}k{/Meta}');
    const input = await screen.findByPlaceholderText('Search a pattern…');
    await user.type(input, 'facade');
    await user.keyboard('{Enter}');
    expect(await screen.findByRole('heading', { level: 1, name: 'Facade' })).toBeInTheDocument();
  });

  it('opens from the Search button', async () => {
    const { user } = renderRoute('/');
    await user.click(screen.getByRole('button', { name: /Search/ }));
    expect(await screen.findByPlaceholderText('Search a pattern…')).toBeInTheDocument();
  });
});

describe('theme', () => {
  it('toggles between dark and light', async () => {
    const { user } = renderRoute('/');
    await user.click(screen.getByRole('button', { name: 'Switch to light mode' }));
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(screen.getByRole('button', { name: 'Switch to dark mode' })).toBeInTheDocument();
  });
});

describe('language', () => {
  it('defaults to English', () => {
    renderRoute('/');
    expect(document.documentElement.lang).toBe('en');
    expect(screen.getByRole('combobox', { name: 'Language' })).toHaveValue('en');
  });

  it('switches to Spanish and Portuguese and remembers the choice', async () => {
    const { user } = renderRoute('/');
    await user.selectOptions(screen.getByRole('combobox', { name: 'Language' }), 'es');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Patrones de diseño para frontend',
    );
    expect(screen.getByText('52 patrones')).toBeInTheDocument();
    expect(document.documentElement.lang).toBe('es');

    await user.selectOptions(screen.getByRole('combobox', { name: 'Idioma' }), 'pt-BR');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Padrões de projeto para frontend',
    );
    expect(localStorage.getItem('reef-patterns:locale')).toBe('pt-BR');
  });

  it('shows pattern content in the active language', () => {
    renderRoute('/patterns/strategy', 'es');
    expect(screen.getByText('Estrategia')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Cuándo usarlo' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^Ejemplo: Dosificadora/ })).toBeInTheDocument();
  });

  it('localizes category filters', () => {
    renderRoute('/', 'pt-BR');
    expect(screen.getByRole('button', { name: 'Criacional' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Superfície/ })).toBeInTheDocument();
  });
});
