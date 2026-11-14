import { Eye, Lightbulb } from 'lucide-react';
import { useState } from 'react';
import type { Challenge } from '@/content/types';
import { CodeBlock } from '@/components/CodeBlock';
import { ConfirmDialog } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/i18n';

interface HintsAndSolutionProps {
  challenge: Challenge;
  onUseSolution: (code: string) => void;
}

/** One hint at a time and the solution behind a confirmation. Resets when the challenge changes. */
export const HintsAndSolution = ({ challenge, onUseSolution }: HintsAndSolutionProps) => {
  const [shown, setShown] = useState(0);
  const { t, locale } = useI18n();
  const hints = challenge.hints[locale];
  const [solutionVisible, setSolutionVisible] = useState(false);
  const remaining = hints.length - shown;

  return (
    <section
      aria-label={t('playground.help')}
      className="flex flex-col gap-3 border-t border-line p-4"
    >
      {shown > 0 && (
        <ol className="flex flex-col gap-2">
          {hints.slice(0, shown).map((hint, i) => (
            <li key={i} className="flex gap-2 rounded-control bg-reef/60 px-3 py-2 text-sm">
              <Lightbulb aria-hidden className="mt-0.5 size-4 shrink-0 text-cat-frontend" />
              <span>
                <span className="sr-only">{t('hints.hint', { n: i + 1 })}</span>
                {hint}
              </span>
            </li>
          ))}
        </ol>
      )}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={remaining === 0}
          onClick={() => setShown((n) => n + 1)}
        >
          <Lightbulb aria-hidden />
          {remaining === 0
            ? t('hints.noMore')
            : t('hints.show', { n: shown + 1, total: hints.length })}
        </Button>
        {!solutionVisible && (
          <ConfirmDialog
            title={t('hints.confirmTitle')}
            description={t('hints.confirmBody')}
            confirmLabel={t('hints.confirm')}
            onConfirm={() => setSolutionVisible(true)}
            trigger={
              <Button variant="ghost" size="sm">
                <Eye aria-hidden /> {t('hints.showSolution')}
              </Button>
            }
          />
        )}
      </div>
      {solutionVisible && (
        <div className="flex flex-col gap-2">
          <CodeBlock code={challenge.solution} label={t('code.solution')} />
          <div>
            <Button variant="secondary" size="sm" onClick={() => onUseSolution(challenge.solution)}>
              {t('hints.useSolution')}
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};
