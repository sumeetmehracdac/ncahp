import { cn } from '@/lib/utils';

/**
 * NCAHPLoaderDNA — Runner-up #1: DNA Double Helix loader.
 * Two intertwined strands with connecting rungs, rotating continuously.
 */

interface NCAHPLoaderDNAProps {
  variant?: 'fullPage' | 'inline' | 'overlay';
  message?: string;
  className?: string;
}

const NCAHPLoaderDNA = ({
  variant = 'fullPage',
  message,
  className,
}: NCAHPLoaderDNAProps) => {
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

  const helixHeight = isInline ? 120 : 180;
  const nodeCount = 10;

  return (
    <div className={wrapperClass} role="status" aria-label="Loading">
      <div className="relative" style={{ width: 80, height: helixHeight }}>
        <svg
          viewBox="0 0 80 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          aria-hidden="true"
        >
          <defs>
            <filter id="dnaGlow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Generate helix rungs and nodes */}
          {Array.from({ length: nodeCount }).map((_, i) => {
            const y = 10 + (i * 180) / (nodeCount - 1);
            const phase = (i / nodeCount) * Math.PI * 2;
            return (
              <g key={i} className="ncahp-dna-rung" style={{ animationDelay: `${i * 0.15}s` }}>
                {/* Connecting rung */}
                <line
                  x1="15" y1={y} x2="65" y2={y}
                  stroke="hsl(var(--border))"
                  strokeWidth="1.5"
                  strokeDasharray="2 3"
                  opacity="0.5"
                />
                {/* Left strand node (teal/primary) */}
                <circle
                  cx="15" cy={y} r="4.5"
                  fill="hsl(var(--primary))"
                  filter="url(#dnaGlow)"
                  className="ncahp-dna-node-left"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
                {/* Right strand node (orange/accent) */}
                <circle
                  cx="65" cy={y} r="4.5"
                  fill="hsl(var(--accent))"
                  filter="url(#dnaGlow)"
                  className="ncahp-dna-node-right"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              </g>
            );
          })}
        </svg>
      </div>

      <div className="text-center space-y-1.5">
        <p className="text-xs font-semibold tracking-[0.25em] uppercase text-primary font-display ncahp-text-fade">
          NCAHP
        </p>
        {message && (
          <p className="text-[0.8rem] text-muted-foreground animate-pulse">
            {message}
          </p>
        )}
      </div>
      <span className="sr-only">Loading, please wait…</span>
    </div>
  );
};

export default NCAHPLoaderDNA;
