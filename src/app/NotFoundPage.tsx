import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/i18n';
import { useDocumentTitle } from '@/lib/useDocumentTitle';

/** Sonar with no echo: nothing at this depth. */
const EmptySonar = () => {
  return (
    <svg viewBox="0 0 160 160" aria-hidden className="size-40">
      {[70, 52, 34].map((r, i) => (
        <circle
          key={r}
          cx="80"
          cy="80"
          r={r}
          fill="none"
          stroke="var(--color-line)"
          strokeWidth="1.5"
          strokeDasharray={i === 0 ? '4 6' : undefined}
        />
      ))}
      <line
        x1="80"
        y1="80"
        x2="80"
        y2="10"
        stroke="var(--color-lagoon)"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 80 80"
          to="360 80 80"
          dur="4s"
          repeatCount="indefinite"
        />
      </line>
      <circle cx="80" cy="80" r="4" fill="var(--color-biolum)" />
    </svg>
  );
};

export const NotFoundPage = () => {
  const { t } = useI18n();
  useDocumentTitle(t('notFound.docTitle'));
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center">
      <EmptySonar />
      <p className="mt-6 font-mono text-sm text-kelp">{t('notFound.depth')}</p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight">{t('notFound.title')}</h1>
      <p className="mt-2 text-kelp">{t('notFound.body')}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        <Button asChild variant="primary">
          <Link to="/">{t('notFound.backToCatalog')}</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link to="/playground">{t('notFound.toPlayground')}</Link>
        </Button>
      </div>
    </div>
  );
};
