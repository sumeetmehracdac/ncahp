import { cn } from '@/lib/utils';

/**
 * NCAHPLoader — A branded healthcare pulse-line loader for the NCAHP platform.
 *
 * Features an animated ECG/heartbeat trace with a medical cross icon,
 * teal + orange color scheme, and multiple size/layout variants.
 *
 * Variants:
 *  - fullPage: centered overlay for route transitions
 *  - inline:   compact for within cards / sections
 *  - overlay:  translucent backdrop overlay
 */

interface NCAHPLoaderProps {
  variant?: 'fullPage' | 'inline' | 'overlay';
  message?: string;
  className?: string;
}

const NCAHPLoader = ({
  variant = 'fullPage',
  message,
  className,
}: NCAHPLoaderProps) => {
  const isFullPage = variant === 'fullPage';
  const isOverlay = variant === 'overlay';
  const isInline = variant === 'inline';

  const wrapperClass = cn(
    'flex flex-col items-center justify-center gap-5 select-none',
    isFullPage && 'fixed inset-0 z-[9999] bg-background',
    isOverlay && 'fixed inset-0 z-[9999] bg-background/80 backdrop-blur-sm',
    isInline && 'py-12',
    className,
  );

  const svgSize = isInline ? 180 : 260;
  const crossSize = isInline ? 18 : 26;

  return (
    <div className={wrapperClass} role="status" aria-label="Loading">
      <div className="relative" style={{ width: svgSize, height: svgSize * 0.5 }}>
        {/* ── ECG Pulse SVG ── */}
        <svg
          viewBox="0 0 260 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          aria-hidden="true"
        >
          {/* Faint grid lines — clinical aesthetic */}
          <line x1="0" y1="50" x2="260" y2="50" stroke="hsl(var(--border))" strokeWidth="0.5" strokeDasharray="4 4" />
          <line x1="0" y1="25" x2="260" y2="25" stroke="hsl(var(--border))" strokeWidth="0.3" strokeDasharray="2 6" />
          <line x1="0" y1="75" x2="260" y2="75" stroke="hsl(var(--border))" strokeWidth="0.3" strokeDasharray="2 6" />

          {/* Glow filter for the trace */}
          <defs>
            <linearGradient id="pulseGrad" x1="0" y1="0" x2="260" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.15" />
              <stop offset="35%" stopColor="hsl(var(--primary))" stopOpacity="1" />
              <stop offset="50%" stopColor="hsl(var(--accent))" stopOpacity="1" />
              <stop offset="65%" stopColor="hsl(var(--primary))" stopOpacity="1" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.15" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ECG heartbeat path — flat → spike → flat */}
          <path
            d="M0,50 L40,50 L55,50 L65,50 L75,48 L82,50 L90,50 L100,50 L108,42 L114,58 L120,20 L126,80 L132,35 L138,55 L144,50 L155,50 L165,50 L175,48 L180,50 L195,50 L220,50 L260,50"
            stroke="url(#pulseGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
            className="ncahp-ecg-trace"
          />

          {/* Scanning dot that follows the trace */}
          <circle r="4" fill="hsl(var(--accent))" className="ncahp-scan-dot" filter="url(#glow)">
            <animateMotion
              dur="2.4s"
              repeatCount="indefinite"
              path="M0,50 L40,50 L55,50 L65,50 L75,48 L82,50 L90,50 L100,50 L108,42 L114,58 L120,20 L126,80 L132,35 L138,55 L144,50 L155,50 L165,50 L175,48 L180,50 L195,50 L220,50 L260,50"
            />
          </circle>
        </svg>

        {/* ── Medical Cross ── */}
        <div
          className="absolute left-1/2 -translate-x-1/2 ncahp-cross-pulse"
          style={{ bottom: -crossSize * 1.2 }}
        >
          <svg
            width={crossSize}
            height={crossSize}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect x="8" y="2" width="8" height="20" rx="2" fill="hsl(var(--primary))" />
            <rect x="2" y="8" width="20" height="8" rx="2" fill="hsl(var(--primary))" />
          </svg>
        </div>
      </div>

      {/* ── Text ── */}
      <div className="text-center space-y-1.5 mt-2">
        <p className="text-xs font-semibold tracking-[0.25em] uppercase text-primary font-display ncahp-text-fade">
          NCAHP
        </p>
        {message && (
          <p className="text-[0.8rem] text-muted-foreground animate-pulse">
            {message}
          </p>
        )}
      </div>

      {/* Screen-reader text */}
      <span className="sr-only">Loading, please wait…</span>
    </div>
  );
};

export default NCAHPLoader;
