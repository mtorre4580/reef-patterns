import { Link } from 'react-router';
import type { Challenge, Pattern } from '@/content/types';
import { CategoryBadge } from '@/components/CategoryBadge';
import { difficultyLabel } from './labels';
import { RichText } from './RichText';

interface ChallengeBriefProps {
  challenge: Challenge;
  pattern: Pattern;
  headingLevel?: 1 | 2;
}

export function ChallengeBrief({ challenge, pattern, headingLevel = 1 }: ChallengeBriefProps) {
  const Heading = headingLevel === 1 ? 'h1' : 'h2';
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
        <Link to={`/patterns/${pattern.id}`} className="font-medium text-lagoon hover:underline">
          {pattern.name}
        </Link>
        <CategoryBadge category={pattern.category} />
        <span className="text-kelp">Dificultad: {difficultyLabel[challenge.difficulty]}</span>
      </div>
      <Heading className="text-xl font-semibold tracking-tight">{challenge.title}</Heading>
      <p className="text-sm leading-relaxed text-kelp">{challenge.story}</p>
      <div className="text-sm leading-relaxed text-foam/90">
        <RichText text={challenge.instructions} />
      </div>
    </div>
  );
}
