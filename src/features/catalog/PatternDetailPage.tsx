import { ArrowLeft, ArrowRight, Check, Minus, Waves } from 'lucide-react';
import { Link, useParams } from 'react-router';
import { challengesByPattern, patterns, patternsById } from '@/content';
import { tierInfo } from '@/content/tiers';
import { CategoryBadge } from '@/components/CategoryBadge';
import { CodeBlock } from '@/components/CodeBlock';
import { GofBadge } from '@/components/GofBadge';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/i18n';
import { useDocumentTitle } from '@/lib/useDocumentTitle';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => {
  return (
    <section className="parchment flex flex-col gap-3 rounded-panel p-5 sm:p-6">
      <div>
        <h2 className="text-xl leading-tight">{title}</h2>
        <div aria-hidden className="rope mt-1.5 h-[4px] w-16" />
      </div>
      {children}
    </section>
  );
};

export const PatternDetailPage = () => {
  const { id = '' } = useParams();
  const pattern = patternsById.get(id);
  const { t, locale } = useI18n();
  useDocumentTitle(pattern?.name ?? t('detail.notFoundDocTitle'));

  if (!pattern) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl">{t('detail.notFoundTitle')}</h1>
        <p className="mt-2 text-kelp">{t('detail.notFoundBody')}</p>
        <Button asChild variant="primary" className="mt-6">
          <Link to="/">{t('detail.backToCatalog')}</Link>
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
      <nav aria-label={t('detail.breadcrumb')} className="text-sm text-kelp">
        <Link
          to="/"
          // eslint-disable-next-line @typescript-eslint/no-deprecated -- TODO: migrate to React <ViewTransition>
          viewTransition
          className="inline-flex items-center gap-1 hover:text-foam"
        >
          <ArrowLeft className="size-4" aria-hidden /> {t('detail.catalog')}
        </Link>
      </nav>

      <header className="parchment nailed mt-6 flex flex-col gap-3 rounded-panel p-6 pt-7 sm:p-8">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="brass flex size-8 items-center justify-center rounded-full font-mono text-xs">
            {pattern.rank}
          </span>
          <CategoryBadge category={pattern.category} />
          <span className="text-kelp">
            {t(`tiers.${pattern.tier}.label`)} · {t(`tiers.${pattern.tier}.zone`)} {zone.depth}
          </span>
          {pattern.gof && <GofBadge />}
        </div>
        <h1 className="text-3xl leading-tight sm:text-4xl">{pattern.name}</h1>
        {pattern.localName[locale] !== pattern.name && (
          <p className="text-kelp">{pattern.localName[locale]}</p>
        )}
        <p className="text-lg text-foam">{pattern.summary[locale]}</p>
        <div className="mt-2 flex items-center gap-3">
          {challengeCount > 0 ? (
            <>
              <Button asChild variant="primary">
                <Link to={`/playground?pattern=${pattern.id}`}>
                  <Waves aria-hidden /> {t('detail.practice')}
                </Link>
              </Button>
              <span className="text-sm text-kelp">
                {t('detail.challenges', { count: challengeCount })}
              </span>
            </>
          ) : (
            <span className="text-sm text-kelp">{t('detail.challengesSoon')}</span>
          )}
        </div>
      </header>

      <div className="mt-8 flex flex-col gap-6">
        <Section title={t('detail.when')}>
          <p className="leading-relaxed text-foam/90">{pattern.when[locale]}</p>
        </Section>

        <div className="grid gap-6 sm:grid-cols-2">
          <Section title={t('detail.pros')}>
            <ul className="flex flex-col gap-2">
              {pattern.pros[locale].map((pro) => (
                <li key={pro} className="flex gap-2 text-foam/90">
                  <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-anemone" />
                  {pro}
                </li>
              ))}
            </ul>
          </Section>
          <Section title={t('detail.cons')}>
            <ul className="flex flex-col gap-2">
              {pattern.cons[locale].map((con) => (
                <li key={con} className="flex gap-2 text-foam/90">
                  <Minus aria-hidden className="mt-0.5 size-4 shrink-0 text-coral" />
                  {con}
                </li>
              ))}
            </ul>
          </Section>
        </div>

        <Section title={t('detail.realWorld')}>
          <p className="leading-relaxed text-foam/90">{pattern.realWorld[locale]}</p>
        </Section>

        <Section title={t('detail.example', { title: pattern.example.title[locale] })}>
          <p className="leading-relaxed text-kelp">{pattern.example.scenario[locale]}</p>
          <CodeBlock code={pattern.example.code} label={pattern.example.title[locale]} />
        </Section>

        {pattern.related.length > 0 && (
          <Section title={t('detail.related')}>
            <ul className="flex flex-wrap gap-2">
              {pattern.related.map((rid) => {
                const rel = patternsById.get(rid);
                if (!rel) return null;
                return (
                  <li key={rid}>
                    <Link
                      to={`/patterns/${rid}`}
                      // eslint-disable-next-line @typescript-eslint/no-deprecated -- TODO: migrate to React <ViewTransition>
                      viewTransition
                      className="inline-flex h-8 items-center rounded-full border border-dashed border-line px-3.5 text-sm text-kelp transition-colors hover:border-solid hover:border-brass hover:bg-reef hover:text-foam"
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
        aria-label={t('detail.neighbors')}
        className="mt-16 flex justify-between gap-4 border-t border-line pt-6 text-sm"
      >
        {prev ? (
          <Link
            to={`/patterns/${prev.id}`}
            // eslint-disable-next-line @typescript-eslint/no-deprecated -- TODO: migrate to React <ViewTransition>
            viewTransition
            className="flex flex-col gap-1 text-kelp hover:text-foam"
          >
            <span className="inline-flex items-center gap-1">
              <ArrowLeft className="size-4" aria-hidden /> {t('detail.previous')}
            </span>
            <span className="font-medium text-foam">{prev.name}</span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            to={`/patterns/${next.id}`}
            // eslint-disable-next-line @typescript-eslint/no-deprecated -- TODO: migrate to React <ViewTransition>
            viewTransition
            className="flex flex-col items-end gap-1 text-kelp hover:text-foam"
          >
            <span className="inline-flex items-center gap-1">
              {t('detail.next')} <ArrowRight className="size-4" aria-hidden />
            </span>
            <span className="font-medium text-foam">{next.name}</span>
          </Link>
        )}
      </nav>
    </article>
  );
};
