import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from './ThemeProvider';

export const ThemeToggle = () => {
  const { theme, toggle } = useTheme();
  const next = theme === 'dark' ? 'claro' : 'oscuro';
  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label={`Cambiar a modo ${next}`}>
      {theme === 'dark' ? <Sun /> : <Moon />}
    </Button>
  );
};
