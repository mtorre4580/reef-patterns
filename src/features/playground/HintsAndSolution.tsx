import { Eye, Lightbulb } from 'lucide-react';
import { useState } from 'react';
import type { Challenge } from '@/content/types';
import { CodeBlock } from '@/components/CodeBlock';
import { ConfirmDialog } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface HintsAndSolutionProps {
  challenge: Challenge;
  onUseSolution: (code: string) => void;
}

/** Pistas de a una y solución detrás de una confirmación. Se reinicia al cambiar de challenge. */
export function HintsAndSolution({ challenge, onUseSolution }: HintsAndSolutionProps) {
  const [shown, setShown] = useState(0);
  const [solutionVisible, setSolutionVisible] = useState(false);
  const remaining = challenge.hints.length - shown;

  return (
    <section aria-label="Ayuda" className="flex flex-col gap-3 border-t border-line p-4">
      {shown > 0 && (
        <ol className="flex flex-col gap-2">
          {challenge.hints.slice(0, shown).map((hint, i) => (
            <li key={i} className="flex gap-2 rounded-control bg-reef/60 px-3 py-2 text-sm">
              <Lightbulb aria-hidden className="mt-0.5 size-4 shrink-0 text-cat-frontend" />
              <span>
                <span className="sr-only">Pista {i + 1}: </span>
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
            ? 'No hay más pistas'
            : `Ver pista (${shown + 1} de ${challenge.hints.length})`}
        </Button>
        {!solutionVisible && (
          <ConfirmDialog
            title="¿Ver la solución?"
            description="Vale la pena intentarlo un rato más. Si la ves ahora, el challenge igual se puede marcar como resuelto cuando pasen los tests."
            confirmLabel="Ver solución"
            onConfirm={() => setSolutionVisible(true)}
            trigger={
              <Button variant="ghost" size="sm">
                <Eye aria-hidden /> Ver solución
              </Button>
            }
          />
        )}
      </div>
      {solutionVisible && (
        <div className="flex flex-col gap-2">
          <CodeBlock code={challenge.solution} label="Solución" />
          <div>
            <Button variant="secondary" size="sm" onClick={() => onUseSolution(challenge.solution)}>
              Copiar al editor
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
