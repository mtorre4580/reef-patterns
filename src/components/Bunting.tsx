import { motion } from 'motion/react';
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion';

const COLORS = [
  'var(--color-lagoon)',
  'var(--color-sail)',
  'var(--color-brass)',
  'var(--color-coral)',
];

/** Signal flags strung on a rope; they drop in one by one when all tests pass. */
export const Bunting = ({ flags = 9 }: { flags?: number }) => {
  const reduceMotion = usePrefersReducedMotion();
  const width = 300;
  const step = width / flags;
  return (
    <svg viewBox={`0 0 ${width} 44`} aria-hidden className="h-11 w-full">
      <path
        d={`M0 6 Q ${width / 2} 22 ${width} 6`}
        fill="none"
        stroke="var(--color-rope-dark)"
        strokeWidth="2"
      />
      {Array.from({ length: flags }, (_, i) => {
        const x = step * i + step / 2;
        // y of the rope's curve at x (quadratic Bézier with the middle control point at y=22)
        const t = x / width;
        const y = (1 - t) * (1 - t) * 6 + 2 * (1 - t) * t * 22 + t * t * 6;
        return (
          <motion.path
            key={i}
            d={`M ${x - 9} ${y} L ${x + 9} ${y} L ${x} ${y + 20} Z`}
            fill={COLORS[i % COLORS.length]}
            stroke="rgb(0 0 0 / 0.25)"
            strokeWidth="0.6"
            style={{ originX: `${x}px`, originY: `${y}px` }}
            initial={reduceMotion ? false : { scaleY: 0, rotate: -25 }}
            animate={{ scaleY: 1, rotate: 0 }}
            transition={{ delay: i * 0.06, type: 'spring', stiffness: 320, damping: 12 }}
          />
        );
      })}
    </svg>
  );
};
