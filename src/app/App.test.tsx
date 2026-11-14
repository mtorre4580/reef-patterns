import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
  it('muestra el título del sitio', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Reef Patterns' })).toBeInTheDocument();
  });
});
