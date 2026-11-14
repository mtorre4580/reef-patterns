import { animate, motion, useMotionValue, useReducedMotion } from 'motion/react';
import { useEffect, useId, useRef, type PointerEvent } from 'react';
import { useI18n } from '@/i18n';
import { cn } from '@/lib/utils';
import { angleOf, polar, sectorAt, sectorCenter, targetRotation } from './helm-geometry';

export interface HelmSector {
  id: string;
  label: string;
}

export interface HelmSpin {
  /** Identifies each spin; changing it triggers the animation. */
  key: number;
  index: number;
  /** 1 clockwise (default), -1 counter-clockwise (when the user flicks it that way) */
  direction?: 1 | -1;
}

interface HelmProps {
  sectors: HelmSector[];
  spin: HelmSpin | null;
  /** Called on click, Enter/Space or a fast enough drag, with the spin direction */
  onSpin: (direction: 1 | -1) => void;
  onSettled: (key: number) => void;
  /** Called every time a sector passes under the pointer (for the ratchet sound) */
  onTick?: (strength: number) => void;
  /** Called when a spin starts (for the creak sound) */
  onSpinStart?: () => void;
  disabled?: boolean;
  spinning?: boolean;
  className?: string;
}

const C = 100;
const DISC_R = 63;
const RIM_IN = 63;
const RIM_OUT = 80;
const SPIN_SECONDS = 3;
/** deg/ms needed for a drag to count as a flick that spins the helm */
const FLICK_SPEED = 0.35;

/** One turned wooden handle, drawn pointing up from the rim. */
const Handle = ({ king, gradient }: { king: boolean; gradient: string }) => (
  <g>
    <rect x="96.2" y="4" width="7.6" height="18" rx="2" fill={`url(#${gradient})`} />
    <ellipse cx="100" cy="11" rx="5.6" ry="3.4" fill={`url(#${gradient})`} />
    <rect x="97.6" y="-3" width="4.8" height="8" rx="1.5" fill={`url(#${gradient})`} />
    <ellipse cx="100" cy="-2" rx="4.2" ry="2.2" fill={`url(#${gradient})`} />
    <circle cx="100" cy="-8" r="5.4" fill={`url(#${gradient})`} />
    <circle cx="98.4" cy="-9.6" r="1.6" fill="#fff" opacity="0.18" />
    {/* Brass band where the spoke goes through the rim */}
    <rect x="95" y="18.5" width="10" height="3" rx="0.8" fill="var(--color-brass)" />
    {king && (
      // Turk's head knot marking the king spoke (wheel centered)
      <g>
        <rect x="95.2" y="6.6" width="9.6" height="9" rx="2.6" fill="var(--color-rope)" />
        {[0, 1, 2, 3].map((i) => (
          <path
            key={i}
            d={`M ${95.6 + i * 2.4} 6.8 l 2.6 8.6`}
            stroke="var(--color-rope-dark)"
            strokeWidth="0.9"
          />
        ))}
      </g>
    )}
  </g>
);

/**
 * Wooden ship's helm with one sector per pattern. The result is computed before animating: the
 * animation only brings the chosen sector under the brass pointer. It can be clicked, spun with
 * Enter/Space or flicked with the pointer. With reduced motion it jumps straight to the result.
 */
export const Helm = ({
  sectors,
  spin,
  onSpin,
  onSettled,
  onTick,
  onSpinStart,
  disabled,
  spinning,
  className,
}: HelmProps) => {
  const reduceMotion = useReducedMotion();
  const { t } = useI18n();
  const uid = useId().replace(/:/g, '');
  const rotation = useMotionValue(0);
  const pointerRef = useRef<SVGSVGElement>(null);
  const wheelRef = useRef<HTMLButtonElement>(null);
  const lastSector = useRef(0);
  const lastTickAt = useRef(0);
  const count = Math.max(sectors.length, 1);

  // Keep callbacks fresh without restarting animations
  const handlers = useRef({ onTick, onSettled, onSpinStart });
  useEffect(() => {
    handlers.current = { onTick, onSettled, onSpinStart };
  }, [onTick, onSettled, onSpinStart]);

  const flickPointer = () => {
    if (!pointerRef.current || reduceMotion) return;
    animate(pointerRef.current, { rotate: [-18, 0] }, { duration: 0.18, ease: 'easeOut' });
  };

  /** Ticks (sound + pointer flick) whenever a new sector reaches the pointer. */
  const trackSector = (value: number, speed: number) => {
    const current = sectorAt(value, count);
    if (current === lastSector.current) return;
    lastSector.current = current;
    const now = performance.now();
    if (now - lastTickAt.current < 28) return;
    lastTickAt.current = now;
    handlers.current.onTick?.(Math.min(1, speed));
    flickPointer();
  };

  // A new spin: animate from wherever the wheel is to the predetermined sector
  useEffect(() => {
    if (!spin) return;
    const from = rotation.get();
    const direction = spin.direction ?? 1;
    if (reduceMotion) {
      rotation.set(targetRotation(from, spin.index, count, 0, direction));
      handlers.current.onSettled(spin.key);
      return;
    }
    handlers.current.onSpinStart?.();
    const to = targetRotation(from, spin.index, count, 4, direction);
    let previous = from;
    let previousAt = performance.now();
    const controls = animate(rotation, to, {
      duration: SPIN_SECONDS,
      ease: [0.12, 0.8, 0.2, 1],
      onUpdate: (value) => {
        const now = performance.now();
        const speed = Math.abs(value - previous) / Math.max(1, now - previousAt) / 1.2;
        previous = value;
        previousAt = now;
        trackSector(value, speed);
      },
      onComplete: () => handlers.current.onSettled(spin.key),
    });
    return () => controls.stop();
    // Only a new spin key restarts the animation
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spin?.key]);

  // ---- Drag to turn, flick to spin ----
  const drag = useRef<{
    startAngle: number;
    startRotation: number;
    lastAngle: number;
    lastAt: number;
    velocity: number;
    moved: boolean;
  } | null>(null);
  const suppressClick = useRef(false);

  const pointerAngle = (e: PointerEvent) => {
    const rect = wheelRef.current!.getBoundingClientRect();
    return angleOf(e.clientX, e.clientY, rect.left + rect.width / 2, rect.top + rect.height / 2);
  };

  const onPointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    if (disabled || spinning || e.button !== 0) return;
    const angle = pointerAngle(e);
    drag.current = {
      startAngle: angle,
      startRotation: rotation.get(),
      lastAngle: angle,
      lastAt: performance.now(),
      velocity: 0,
      moved: false,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d) return;
    const angle = pointerAngle(e);
    // Shortest signed difference, so crossing the top does not jump by 360°
    const step = ((angle - d.lastAngle + 540) % 360) - 180;
    const now = performance.now();
    d.velocity = step / Math.max(1, now - d.lastAt);
    d.lastAngle = angle;
    d.lastAt = now;
    const total = ((angle - d.startAngle + 540) % 360) - 180;
    if (Math.abs(total) > 3) d.moved = true;
    if (!d.moved) return;
    const next = rotation.get() + step;
    rotation.set(next);
    trackSector(next, Math.abs(d.velocity));
  };

  const onPointerUp = () => {
    const d = drag.current;
    drag.current = null;
    if (!d?.moved) return;
    suppressClick.current = true;
    if (Math.abs(d.velocity) >= FLICK_SPEED) onSpin(d.velocity > 0 ? 1 : -1);
  };

  const showLabels = sectors.length <= 16;
  const size = 360 / count;
  const g = (name: string) => `${name}-${uid}`;

  return (
    <div
      className={cn('relative mx-auto aspect-square w-full max-w-[360px] select-none', className)}
    >
      <div className={cn('size-full', !spinning && 'motion-safe:animate-sway')}>
        <button
          ref={wheelRef}
          type="button"
          onClick={() => {
            if (suppressClick.current) {
              suppressClick.current = false;
              return;
            }
            onSpin(1);
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          disabled={disabled || spinning}
          aria-label={spinning ? t('helm.spinning') : t('helm.spin')}
          className="group absolute inset-0 cursor-grab touch-none rounded-full transition-transform duration-200 hover:scale-[1.015] active:cursor-grabbing disabled:cursor-wait"
        >
          <motion.div className="size-full" style={{ rotate: rotation }}>
            <svg
              viewBox="-16 -16 232 232"
              className="size-full drop-shadow-[0_10px_14px_rgba(0,0,0,0.45)]"
              aria-hidden
            >
              <defs>
                <radialGradient id={g('rim')} cx="50%" cy="45%" r="55%">
                  <stop offset="0%" stopColor="var(--color-wood-light)" />
                  <stop offset="70%" stopColor="var(--color-wood)" />
                  <stop offset="100%" stopColor="var(--color-wood-dark)" />
                </radialGradient>
                <linearGradient id={g('spoke')} x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="var(--color-wood-deep)" />
                  <stop offset="35%" stopColor="var(--color-wood-light)" />
                  <stop offset="65%" stopColor="var(--color-wood)" />
                  <stop offset="100%" stopColor="var(--color-wood-deep)" />
                </linearGradient>
                <radialGradient id={g('brass')} cx="40%" cy="35%" r="70%">
                  <stop offset="0%" stopColor="#f6dc8c" />
                  <stop offset="55%" stopColor="var(--color-brass)" />
                  <stop offset="100%" stopColor="var(--color-brass-dark)" />
                </radialGradient>
              </defs>

              {/* Handles go behind the rim */}
              {Array.from({ length: 8 }, (_, i) => (
                <g key={i} transform={`rotate(${i * 45 + 22.5} ${C} ${C})`}>
                  <Handle king={i === 0} gradient={g('spoke')} />
                </g>
              ))}

              {/* Rim: a wooden ring with grain and brass edges */}
              <path
                d={`M ${C} ${C - RIM_OUT} a ${RIM_OUT} ${RIM_OUT} 0 1 0 0.01 0 Z M ${C} ${C - RIM_IN} a ${RIM_IN} ${RIM_IN} 0 1 1 -0.01 0 Z`}
                fill={`url(#${g('rim')})`}
                fillRule="evenodd"
              />
              {[66, 70.5, 74, 77.5].map((r, i) => (
                <circle
                  key={r}
                  cx={C}
                  cy={C}
                  r={r}
                  fill="none"
                  stroke="#000"
                  strokeOpacity={0.14 + (i % 2) * 0.06}
                  strokeWidth="0.6"
                  strokeDasharray={`${18 + i * 7} ${9 + i * 3} ${5 + i} ${12}`}
                />
              ))}
              <circle
                cx={C}
                cy={C}
                r={RIM_OUT}
                fill="none"
                stroke="var(--color-brass)"
                strokeWidth="1.6"
              />
              <circle
                cx={C}
                cy={C}
                r={RIM_IN}
                fill="none"
                stroke="var(--color-brass-dark)"
                strokeWidth="1.4"
              />

              {/* Chart disc with one sector per pattern */}
              {sectors.map((s, i) => {
                const start = polar(C, C, DISC_R - 1, i * size);
                const end = polar(C, C, DISC_R - 1, (i + 1) * size);
                const large = size > 180 ? 1 : 0;
                const d =
                  sectors.length === 1
                    ? `M ${C} ${C - DISC_R + 1} a ${DISC_R - 1} ${DISC_R - 1} 0 1 1 -0.01 0 Z`
                    : `M ${C} ${C} L ${start.x} ${start.y} A ${DISC_R - 1} ${DISC_R - 1} 0 ${large} 1 ${end.x} ${end.y} Z`;
                const angle = sectorCenter(i, count);
                const labelPos = polar(C, C, 44, angle);
                // Radial text; flipped on the left half so it reads upright
                const labelRotation = angle > 180 ? angle + 90 : angle - 90;
                return (
                  <g key={s.id}>
                    <path
                      d={d}
                      fill={i % 2 === 0 ? '#f5ecd9' : '#e7d6b4'}
                      stroke="var(--color-wood-dark)"
                      strokeWidth="0.7"
                    />
                    {showLabels && (
                      <text
                        x={labelPos.x}
                        y={labelPos.y}
                        fill="#2e1b0e"
                        fontSize={sectors.length > 10 ? 4.9 : 6.4}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        transform={`rotate(${labelRotation} ${labelPos.x} ${labelPos.y})`}
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {s.label.length > 14 ? `${s.label.slice(0, 13)}…` : s.label}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Inner spokes from the hub, under the brass hub */}
              {Array.from({ length: 8 }, (_, i) => (
                <rect
                  key={i}
                  x={C - 2.2}
                  y={C - 27}
                  width="4.4"
                  height="9"
                  rx="1"
                  fill={`url(#${g('spoke')})`}
                  transform={`rotate(${i * 45} ${C} ${C})`}
                />
              ))}

              {/* Brass hub with rivets and a wooden cap */}
              <circle
                cx={C}
                cy={C}
                r="21"
                fill={`url(#${g('brass')})`}
                stroke="var(--color-brass-dark)"
              />
              {Array.from({ length: 8 }, (_, i) => {
                const p = polar(C, C, 17.5, i * 45 + 22.5);
                return <circle key={i} cx={p.x} cy={p.y} r="1.3" fill="var(--color-brass-dark)" />;
              })}
              <circle
                cx={C}
                cy={C}
                r="13.5"
                fill="var(--color-wood-deep)"
                stroke="var(--color-brass-dark)"
              />
            </svg>
          </motion.div>
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center font-display text-[0.8rem] text-brass">
            {spinning ? '…' : t('helm.hub')}
          </span>
        </button>
      </div>

      {/* Fixed brass pointer, tied to the top; it flicks as each sector passes */}
      <svg
        ref={pointerRef}
        viewBox="0 0 28 34"
        aria-hidden
        className="pointer-events-none absolute -top-1 left-1/2 w-7 -translate-x-1/2 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]"
        style={{ transformOrigin: '50% 10%' }}
      >
        <circle cx="14" cy="4" r="3.4" fill="var(--color-rope)" stroke="var(--color-rope-dark)" />
        <path d="M5 8 H23 L14 33 Z" fill="var(--color-brass)" stroke="var(--color-brass-dark)" />
        <path d="M9 9 L14 26" stroke="#fff3c4" strokeOpacity="0.6" strokeWidth="1.2" />
      </svg>
    </div>
  );
};
