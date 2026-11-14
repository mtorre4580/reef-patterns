import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/i18n';
import { useTheme } from './ThemeProvider';

export const ThemeToggle = () => {
  const { theme, toggle } = useTheme();
  const { t } = useI18n();
  const label = theme === 'dark' ? t('nav.toLight') : t('nav.toDark');
  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label={label}>
      {theme === 'dark' ? <Sun /> : <Moon />}
    </Button>
  );
};
