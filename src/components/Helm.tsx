import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { polar, sectorCenter, targetRotation } from './helm-geometry';

export interface HelmSector {
  id: string;
  label: string;
}

export interface HelmSpin {
  /** Identifica cada giro; cambiarlo dispara la animación. */
  key: number;
  index: number;
}

interface HelmProps {
  sectors: HelmSector[];
  spin: HelmSpin | null;
  onSpin: () => void;
  onSettled: (key: number) => void;
  disabled?: boolean;
  spinning?: boolean;
  className?: string;
}

const C = 100;
const SPIN_SECONDS = 2.6;

/**
 * Timón de barco con un sector por patrón. El resultado se calcula antes de animar: la animación
 * solo lleva el sector elegido hasta el puntero. Con movimiento reducido, salta directo.
 */
export function Helm({
  sectors,
  spin,
  onSpin,
  onSettled,
  disabled,
  spinning,
  className,
}: HelmProps) {
  const reduceMotion = useReducedMotion();
  const [rotation, setRotation] = useState(0);
  const [appliedKey, setAppliedKey] = useState<number | null>(null);
  const count = Math.max(sectors.length, 1);

  // Nuevo giro: calcular la rotación final durante el render (estado derivado)
  if (spin && spin.key !== appliedKey) {
    setAppliedKey(spin.key);
    setRotation((r) =>
      targetRotation(reduceMotion ? 0 : r, spin.index, count, reduceMotion ? 0 : 4),
    );
  }

  useEffect(() => {
    if (spin && reduceMotion) onSettled(spin.key);
  }, [spin, reduceMotion, onSettled]);

  const showLabels = sectors.length <= 16;
  const size = 360 / count;

  return (
    <div className={cn('relative mx-auto aspect-square w-full max-w-[320px]', className)}>
      <button
        type="button"
        onClick={onSpin}
        disabled={disabled || spinning}
        aria-label={spinning ? 'Girando el timón' : 'Girar el timón'}
        className="group absolute inset-0 rounded-full disabled:cursor-not-allowed"
      >
        <motion.div
          className="size-full"
          animate={{ rotate: rotation }}
          transition={
            reduceMotion ? { duration: 0 } : { duration: SPIN_SECONDS, ease: [0.12, 0.8, 0.2, 1] }
          }
          onAnimationComplete={() => {
            if (spin && !reduceMotion) onSettled(spin.key);
          }}
        >
          <svg viewBox="-6 -6 212 212" className="size-full" aria-hidden>
            {/* Manijas */}
            {Array.from({ length: 8 }, (_, i) => {
              const a = i * 45;
              const inner = polar(C, C, 70, a);
              const outer = polar(C, C, 97, a);
              return (
                <g key={i}>
                  <line
                    x1={inner.x}
                    y1={inner.y}
                    x2={outer.x}
                    y2={outer.y}
                    stroke="var(--color-kelp)"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                  <circle cx={outer.x} cy={outer.y} r="4.5" fill="var(--color-kelp)" />
                </g>
              );
            })}
            {/* Aro */}
            <circle cx={C} cy={C} r="80" fill="none" stroke="var(--color-kelp)" strokeWidth="6" />
            {/* Sectores */}
            {sectors.map((s, i) => {
              const start = polar(C, C, 74, i * size);
              const end = polar(C, C, 74, (i + 1) * size);
              const large = size > 180 ? 1 : 0;
              const d =
                sectors.length === 1
                  ? `M ${C} ${C - 74} A 74 74 0 1 1 ${C - 0.01} ${C - 74} Z`
                  : `M ${C} ${C} L ${start.x} ${start.y} A 74 74 0 ${large} 1 ${end.x} ${end.y} Z`;
              const angle = sectorCenter(i, count);
              const labelPos = polar(C, C, 47, angle);
              // Texto radial; en la mitad izquierda se da vuelta para que se lea derecho
              const labelRotation = angle > 180 ? angle + 90 : angle - 90;
              return (
                <g key={s.id}>
                  <path
                    d={d}
                    fill={i % 2 === 0 ? 'var(--color-reef)' : 'var(--color-trench)'}
                    stroke="var(--color-line)"
                    strokeWidth="0.75"
                  />
                  {showLabels && (
                    <text
                      x={labelPos.x}
                      y={labelPos.y}
                      fill="var(--color-foam)"
                      fontSize={sectors.length > 10 ? 5.6 : 7}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${labelRotation} ${labelPos.x} ${labelPos.y})`}
                      style={{ fontFamily: 'var(--font-sans)' }}
                    >
                      {s.label.length > 14 ? `${s.label.slice(0, 13)}…` : s.label}
                    </text>
                  )}
                </g>
              );
            })}
            {/* Cubo central */}
            <circle
              cx={C}
              cy={C}
              r="17"
              fill="var(--color-abyss)"
              stroke="var(--color-lagoon)"
              strokeWidth="3"
            />
          </svg>
        </motion.div>
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-[0.7rem] font-semibold text-lagoon">
          {spinning ? '…' : 'Girar'}
        </span>
      </button>
      {/* Puntero fijo */}
      <svg
        viewBox="0 0 20 16"
        aria-hidden
        className="pointer-events-none absolute top-[1%] left-1/2 w-5 -translate-x-1/2"
      >
        <path d="M0 0 H20 L10 16 Z" fill="var(--color-biolum)" />
      </svg>
    </div>
  );
}
