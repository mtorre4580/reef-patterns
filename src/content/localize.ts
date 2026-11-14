import type { Locale } from '@/i18n/locales';
import type { AstCheck, Challenge, ChallengeTest } from './types';

/** Tests and checks of a challenge in one language, ready for the runner. */
export const runnableChallenge = (
  challenge: Challenge,
  locale: Locale,
): { tests: ChallengeTest[]; checks: AstCheck[] } => ({
  tests: challenge.tests.map((t) => ({ name: t.name[locale], code: t.code })),
  checks: (challenge.checks ?? []).map((c) => ({ ...c, message: c.message[locale] })),
});
