import { CheckCircle2, Play, RotateCcw, ShipWheel } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import type { Challenge, Pattern } from '@/content/types';
import { useTheme } from '@/app/ThemeProvider';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { useProgress } from '@/features/progress';
import { allPassed } from '@/lib/runner';
import { Kbd } from '@/components/ui/kbd';
import { useI18n } from '@/i18n';
import { useDocumentTitle } from '@/lib/useDocumentTitle';
import { cn } from '@/lib/utils';
import { ChallengeBrief } from './ChallengeBrief';
import { CodeEditor } from './CodeEditor';
import { HelmPanel } from './HelmPanel';
import { HintsAndSolution } from './HintsAndSolution';
import { resolveChallenge } from './resolveChallenge';
import { ResultsPanel } from './ResultsPanel';
import { useDraft } from './useDraft';
import { useRunner } from './useRunner';

type MobileTab = 'brief' | 'code' | 'results';

const mobileTabs: MobileTab[] = ['brief', 'code', 'results'];

export const PlaygroundPage = () => {
  const [params] = useSearchParams();
  const { t } = useI18n();
  const navigate = useNavigate();
  const resolution = resolveChallenge(params);
  const choose = useCallback(
    (c: Challenge) => navigate(`/playground?challenge=${c.id}`),
    [navigate],
  );
  useDocumentTitle(
    resolution.kind === 'challenge'
      ? `${resolution.challenge.title} · ${t('playground.title')}`
      : t('playground.title'),
  );

  if (resolution.kind === 'landing') {
    return (
      <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-10 sm:py-14">
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight">{t('playground.landingTitle')}</h1>
          <p className="mt-2 text-kelp">{t('playground.landingBody')}</p>
        </div>
        <HelmPanel onChoose={choose} />
      </div>
    );
  }

  if (resolution.kind === 'no-challenges') {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">{t('playground.title')}</h1>
        <p className="mt-3 text-kelp">
          {resolution.pattern
            ? t('playground.noChallengesFor', { pattern: resolution.pattern.name })
            : t('playground.noChallenges')}
        </p>
        <Button asChild variant="primary" className="mt-8">
          <Link to="/playground">{t('playground.spinHelm')}</Link>
        </Button>
      </div>
    );
  }

  return (
    <Workspace
      key={resolution.challenge.id}
      challenge={resolution.challenge}
      pattern={resolution.pattern}
      onChoose={choose}
    />
  );
};

interface WorkspaceProps {
  challenge: Challenge;
  pattern: Pattern;
  onChoose: (challenge: Challenge) => void;
}

const Workspace = ({ challenge, pattern, onChoose }: WorkspaceProps) => {
  const { theme } = useTheme();
  const { completed, markCompleted } = useProgress();
  const [helmOpen, setHelmOpen] = useState(false);
  const solved = completed.has(challenge.id);
  const { code, setCode, reset } = useDraft(challenge);
  const runner = useRunner();
  const { t, locale } = useI18n();
  const [mobileTab, setMobileTab] = useState<MobileTab>('brief');

  const run = useCallback(() => {
    setMobileTab((t) => (t === 'code' ? 'results' : t));
    void runner.run(challenge, code, locale).then((result) => {
      if (result && allPassed(result)) markCompleted(challenge.id);
    });
  }, [runner, challenge, code, locale, markCompleted]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && !e.defaultPrevented) {
        e.preventDefault();
        run();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [run]);

  const panel = (tab: MobileTab) => cn(mobileTab !== tab && 'max-lg:hidden');

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] flex-col">
      <div
        role="tablist"
        aria-label={t('playground.sections')}
        className="flex border-b border-line px-2 lg:hidden"
      >
        {mobileTabs.map((tab) => (
          <button
            key={tab}
            role="tab"
            id={`tab-${tab}`}
            aria-selected={mobileTab === tab}
            aria-controls={`panel-${tab}`}
            onClick={() => setMobileTab(tab)}
            className={cn(
              '-mb-px h-11 flex-1 border-b-2 text-sm',
              mobileTab === tab ? 'border-biolum text-foam' : 'border-transparent text-kelp',
            )}
          >
            {t(`playground.${tab}`)}
          </button>
        ))}
      </div>

      <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="flex min-h-0 flex-col lg:border-r lg:border-line">
          <section
            id="panel-brief"
            aria-label={t('playground.brief')}
            className={cn(
              'overflow-y-auto p-4 sm:p-6 lg:max-h-[38%] lg:border-b lg:border-line',
              panel('brief'),
            )}
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              {solved ? (
                <span className="inline-flex items-center gap-1.5 text-xs text-anemone">
                  <CheckCircle2 aria-hidden className="size-4" /> {t('playground.solved')}
                </span>
              ) : (
                <span className="text-xs text-kelp">{t('playground.pending')}</span>
              )}
              <Button variant="secondary" size="sm" onClick={() => setHelmOpen(true)}>
                <ShipWheel aria-hidden /> {t('playground.spinHelm')}
              </Button>
            </div>
            <ChallengeBrief challenge={challenge} pattern={pattern} />
          </section>

          <section
            id="panel-code"
            aria-label={t('playground.code')}
            className={cn('flex min-h-0 flex-1 flex-col', panel('code'))}
          >
            <div className="min-h-[240px] flex-1 bg-trench">
              <CodeEditor
                value={code}
                onChange={setCode}
                onRun={run}
                theme={theme}
                label={t('playground.editorLabel', { title: challenge.title })}
              />
            </div>
            <div className="flex items-center justify-between gap-2 border-t border-line p-3">
              <Button variant="ghost" size="sm" onClick={() => (reset(), runner.clear())}>
                <RotateCcw aria-hidden /> {t('playground.reset')}
              </Button>
              <span className="ml-auto hidden text-xs text-kelp sm:inline">
                <Kbd>⌘/Ctrl</Kbd> + <Kbd>↵</Kbd>
              </span>
              <Button
                variant="primary"
                size="sm"
                onClick={run}
                disabled={runner.status === 'running'}
              >
                <Play aria-hidden /> {t('playground.run')}
              </Button>
            </div>
          </section>
        </div>

        <section
          id="panel-results"
          aria-label={t('playground.results')}
          className={cn('flex min-h-0 flex-col overflow-y-auto bg-trench/40', panel('results'))}
        >
          <ResultsPanel
            status={runner.status}
            result={runner.result}
            testNames={challenge.tests.map((t) => t.name)}
          />
          <HintsAndSolution challenge={challenge} onUseSolution={setCode} />
        </section>
      </div>

      <Dialog
        open={helmOpen}
        onOpenChange={setHelmOpen}
        title={t('playground.landingTitle')}
        description={t('playground.helmDescription')}
      >
        <HelmPanel
          onChoose={(c) => {
            setHelmOpen(false);
            onChoose(c);
          }}
        />
      </Dialog>
    </div>
  );
};
