import { screen, within } from '@testing-library/react';
import { renderRoute } from '@/test/renderRoute';

describe('catálogo', () => {
  it('lista los 52 patrones agrupados por zona', () => {
    renderRoute('/');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Patrones de diseño');
    for (const zone of ['Superficie', 'Arrecife', 'Drop-off', 'Abismo']) {
      expect(screen.getByRole('heading', { level: 2, name: new RegExp(zone) })).toBeInTheDocument();
    }
    expect(screen.getByText('52 patrones')).toBeInTheDocument();
  });

  it('filtra con la búsqueda difusa', async () => {
    const { user } = renderRoute('/');
    await user.type(screen.getByRole('searchbox', { name: 'Buscar patrones' }), 'obsrver');
    expect(screen.getByRole('link', { name: /Observer/ })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /^4\s*Singleton/ })).not.toBeInTheDocument();
  });

  it('filtra por categoría y sincroniza la URL', async () => {
    const { user, router } = renderRoute('/');
    await user.click(screen.getByRole('button', { name: 'Resiliencia' }));
    expect(screen.getByRole('button', { name: 'Resiliencia' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(router.state.location.search).toBe('?cat=resiliencia');
    expect(screen.getByText('4 patrones')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Circuit Breaker/ })).toBeInTheDocument();
  });

  it('lee los filtros desde la URL', () => {
    renderRoute('/?tier=1&gof=1');
    expect(screen.getByRole('button', { name: 'Esencial' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Solo GoF' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.queryByRole('heading', { name: /Arrecife/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Module/ })).not.toBeInTheDocument();
  });

  it('muestra un estado vacío y permite limpiar filtros', async () => {
    const { user } = renderRoute('/?q=zzzzzz');
    expect(screen.getByRole('status')).toHaveTextContent('Ningún patrón coincide');
    await user.click(screen.getByRole('button', { name: /Limpiar filtros/ }));
    expect(screen.getByText('52 patrones')).toBeInTheDocument();
  });

  it('navega al detalle de un patrón', async () => {
    const { user } = renderRoute('/');
    const zone = screen.getByRole('region', { name: /Superficie/ });
    await user.click(within(zone).getByRole('link', { name: /Strategy/ }));
    expect(await screen.findByRole('heading', { level: 1, name: 'Strategy' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Cuándo usarlo' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Practicar este patrón/ })).toHaveAttribute(
      'href',
      '/playground?pattern=strategy',
    );
  });
});

describe('detalle de patrón', () => {
  it('muestra ejemplo, relacionados y vecinos', async () => {
    const { user } = renderRoute('/patterns/observer');
    expect(
      screen.getByRole('heading', { name: /Ejemplo: Sensor de temperatura/ }),
    ).toBeInTheDocument();
    expect(screen.getByText(/class TemperatureSensor/)).toBeInTheDocument();
    const related = screen.getByRole('heading', { name: 'Relacionados' }).parentElement!;
    await user.click(within(related).getByRole('link', { name: 'Pub/Sub' }));
    expect(await screen.findByRole('heading', { level: 1, name: 'Pub/Sub' })).toBeInTheDocument();
  });

  it('muestra un mensaje si el patrón no existe', () => {
    renderRoute('/patterns/no-existe');
    expect(screen.getByRole('heading', { name: 'No encontramos ese patrón' })).toBeInTheDocument();
  });
});

describe('paleta de comandos', () => {
  it('abre con ⌘K y lleva a un patrón con Enter (3 pulsaciones)', async () => {
    const { user } = renderRoute('/');
    await user.keyboard('{Meta>}k{/Meta}');
    const input = await screen.findByPlaceholderText('Buscá un patrón…');
    await user.type(input, 'facade');
    await user.keyboard('{Enter}');
    expect(await screen.findByRole('heading', { level: 1, name: 'Facade' })).toBeInTheDocument();
  });

  it('abre desde el botón Buscar', async () => {
    const { user } = renderRoute('/');
    await user.click(screen.getByRole('button', { name: /Buscar/ }));
    expect(await screen.findByPlaceholderText('Buscá un patrón…')).toBeInTheDocument();
  });
});

describe('tema', () => {
  it('alterna entre oscuro y claro', async () => {
    const { user } = renderRoute('/');
    await user.click(screen.getByRole('button', { name: 'Cambiar a modo claro' }));
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(screen.getByRole('button', { name: 'Cambiar a modo oscuro' })).toBeInTheDocument();
  });
});
