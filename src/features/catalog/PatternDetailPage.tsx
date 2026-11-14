import { ArrowLeft, ArrowRight, Check, Minus, Waves } from 'lucide-react';
import { Link, useParams } from 'react-router';
import { challengesByPattern, patterns, patternsById } from '@/content';
import { tierInfo } from '@/content/tiers';
import { CategoryBadge } from '@/components/CategoryBadge';
import { CodeBlock } from '@/components/CodeBlock';
import { GofBadge } from '@/components/GofBadge';
import { Button } from '@/components/ui/button';
import { useDocumentTitle } from '@/lib/useDocumentTitle';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-base font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

export function PatternDetailPage() {
  const { id = '' } = useParams();
  const pattern = patternsById.get(id);
  useDocumentTitle(pattern?.name ?? 'Patrón no encontrado');

  if (!pattern) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-xl font-semibold">No encontramos ese patrón</h1>
        <p className="mt-2 text-kelp">Puede que el enlace esté mal escrito.</p>
        <Button asChild variant="primary" className="mt-6">
          <Link to="/">Volver al catálogo</Link>
        </Button>
      </div>
    );
  }

  const zone = tierInfo(pattern.tier);
  const challengeCount = challengesByPattern.get(pattern.id)?.length ?? 0;
  const prev = patterns[pattern.rank - 2];
  const next = patterns[pattern.rank];

  return (
    <article className="mx-auto w-full max-w-3xl px-4 pt-8 pb-24 sm:px-6">
      <nav aria-label="Migas de pan" className="text-sm text-kelp">
        <Link to="/" viewTransition className="inline-flex items-center gap-1 hover:text-foam">
          <ArrowLeft className="size-4" aria-hidden /> Catálogo
        </Link>
      </nav>

      <header className="mt-6 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="font-mono text-kelp">#{pattern.rank}</span>
          <CategoryBadge category={pattern.category} />
          <span className="text-kelp">
            {zone.label} · {zone.zone} {zone.depth}
          </span>
          {pattern.gof && <GofBadge />}
        </div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{pattern.name}</h1>
        <p className="text-kelp">{pattern.nameEs}</p>
        <p className="text-lg text-foam">{pattern.summary}</p>
        <div className="mt-2 flex items-center gap-3">
          {challengeCount > 0 ? (
            <>
              <Button asChild variant="primary">
                <Link to={`/playground?pattern=${pattern.id}`}>
                  <Waves aria-hidden /> Practicar este patrón
                </Link>
              </Button>
              <span className="text-sm text-kelp">
                {challengeCount === 1 ? '1 challenge' : `${challengeCount} challenges`}
              </span>
            </>
          ) : (
            <span className="text-sm text-kelp">Challenges de este patrón: próximamente.</span>
          )}
        </div>
      </header>

      <div className="mt-10 flex flex-col gap-10">
        <Section title="Cuándo usarlo">
          <p className="leading-relaxed text-foam/90">{pattern.when}</p>
        </Section>

        <div className="grid gap-8 sm:grid-cols-2">
          <Section title="Beneficios">
            <ul className="flex flex-col gap-2">
              {pattern.pros.map((pro) => (
                <li key={pro} className="flex gap-2 text-foam/90">
                  <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-anemone" />
                  {pro}
                </li>
              ))}
            </ul>
          </Section>
          <Section title="Contras">
            <ul className="flex flex-col gap-2">
              {pattern.cons.map((con) => (
                <li key={con} className="flex gap-2 text-foam/90">
                  <Minus aria-hidden className="mt-0.5 size-4 shrink-0 text-coral" />
                  {con}
                </li>
              ))}
            </ul>
          </Section>
        </div>

        <Section title="Dónde aparece">
          <p className="leading-relaxed text-foam/90">{pattern.realWorld}</p>
        </Section>

        <Section title={`Ejemplo: ${pattern.example.title}`}>
          <p className="leading-relaxed text-kelp">{pattern.example.scenario}</p>
          <CodeBlock code={pattern.example.code} label={pattern.example.title} />
        </Section>

        {pattern.related.length > 0 && (
          <Section title="Relacionados">
            <ul className="flex flex-wrap gap-2">
              {pattern.related.map((rid) => {
                const rel = patternsById.get(rid);
                if (!rel) return null;
                return (
                  <li key={rid}>
                    <Link
                      to={`/patterns/${rid}`}
                      viewTransition
                      className="inline-flex h-8 items-center rounded-control border border-line px-3 text-sm text-kelp hover:border-kelp hover:text-foam"
                    >
                      {rel.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Section>
        )}
      </div>

      <nav
        aria-label="Patrones vecinos"
        className="mt-16 flex justify-between gap-4 border-t border-line pt-6 text-sm"
      >
        {prev ? (
          <Link
            to={`/patterns/${prev.id}`}
            viewTransition
            className="flex flex-col gap-1 text-kelp hover:text-foam"
          >
            <span className="inline-flex items-center gap-1">
              <ArrowLeft className="size-4" aria-hidden /> Anterior
            </span>
            <span className="font-medium text-foam">{prev.name}</span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            to={`/patterns/${next.id}`}
            viewTransition
            className="flex flex-col items-end gap-1 text-kelp hover:text-foam"
          >
            <span className="inline-flex items-center gap-1">
              Siguiente <ArrowRight className="size-4" aria-hidden />
            </span>
            <span className="font-medium text-foam">{next.name}</span>
          </Link>
        )}
      </nav>
    </article>
  );
}
