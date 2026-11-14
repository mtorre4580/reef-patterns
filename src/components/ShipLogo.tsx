/** Small brass ship's wheel used as the site logo. */
export const ShipLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 32 32" aria-hidden className={className}>
    {Array.from({ length: 8 }, (_, i) => (
      <g key={i} transform={`rotate(${i * 45} 16 16)`}>
        <rect x="15" y="1" width="2" height="7" rx="1" fill="var(--color-brass)" />
        <circle cx="16" cy="1.8" r="1.6" fill="var(--color-brass)" />
      </g>
    ))}
    <circle cx="16" cy="16" r="9.5" fill="none" stroke="var(--color-brass)" strokeWidth="2.6" />
    <circle cx="16" cy="16" r="3.4" fill="var(--color-brass)" />
    <circle cx="16" cy="16" r="1.4" fill="var(--color-wood-deep)" />
  </svg>
);
