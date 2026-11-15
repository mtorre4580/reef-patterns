/** Old sailing ship that bobs on the waves (hero illustration; motion stops with reduced motion). */
export const SailingShip = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 150" aria-hidden className={className}>
    <g className="origin-[100px_120px] motion-safe:animate-sway">
      <g className="motion-safe:animate-bob">
        {/* Masts */}
        <rect x="97" y="12" width="4" height="100" rx="1" fill="var(--color-wood-dark)" />
        <rect x="57" y="34" width="3.4" height="78" rx="1" fill="var(--color-wood-dark)" />
        <rect x="137" y="40" width="3.2" height="72" rx="1" fill="var(--color-wood-dark)" />
        {/* Rigging */}
        <path
          d="M99 14 L20 104 M99 14 L182 104 M58 36 L20 104 M139 42 L182 104"
          stroke="var(--color-rope-dark)"
          strokeWidth="0.8"
          fill="none"
        />
        {/* Sails */}
        <path d="M101 18 Q128 38 101 60 Z" fill="var(--color-sail)" />
        <path
          d="M78 22 Q99 24 120 22 Q126 44 120 62 Q99 58 78 62 Q72 44 78 22 Z"
          fill="var(--color-sail)"
        />
        <path
          d="M80 66 Q99 64 118 66 Q124 84 118 100 Q99 96 80 100 Q74 84 80 66 Z"
          fill="var(--color-sail)"
        />
        <path d="M44 44 Q58 46 72 44 Q76 62 72 78 Q58 75 44 78 Q40 62 44 44 Z" fill="#efe2c6" />
        <path
          d="M126 50 Q138 52 150 50 Q153 66 150 80 Q138 77 126 80 Q123 66 126 50 Z"
          fill="#efe2c6"
        />
        {/* Flag */}
        <path d="M101 12 L116 15 L101 19 Z" fill="var(--color-lagoon)" />
        {/* Hull */}
        <path
          d="M14 104 L186 104 Q178 126 150 130 L52 130 Q24 126 14 104 Z"
          fill="var(--color-wood)"
          stroke="var(--color-wood-deep)"
          strokeWidth="1.5"
        />
        <path d="M18 112 L182 112" stroke="var(--color-wood-deep)" strokeWidth="1" />
        <path d="M24 120 L176 120" stroke="var(--color-wood-deep)" strokeWidth="1" />
        <rect x="14" y="101" width="172" height="4" rx="1.5" fill="var(--color-brass)" />
        {[50, 75, 100, 125, 150].map((x) => (
          <circle
            key={x}
            cx={x}
            cy="116"
            r="2.6"
            fill="var(--color-wood-deep)"
            stroke="var(--color-brass)"
          />
        ))}
      </g>
    </g>
  </svg>
);
