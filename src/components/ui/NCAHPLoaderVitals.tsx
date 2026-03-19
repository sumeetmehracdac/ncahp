import { cn } from '@/lib/utils';

/**
 * NCAHPLoaderVitals — Runner-up #2: Clinical vital-signs monitor.
 * Dark panel with animated HR and SpO2 waveforms, blinking numeric readouts.
 */

interface NCAHPLoaderVitalsProps {
  variant?: 'fullPage' | 'inline' | 'overlay';
  message?: string;
  className?: string;
}

const NCAHPLoaderVitals = ({
  variant = 'fullPage',
  message,
  className,
}: NCAHPLoaderVitalsProps) => {
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

  const monitorW = isInline ? 260 : 340;
  const monitorH = isInline ? 140 : 180;

  return (
    <div className={wrapperClass} role="status" aria-label="Loading">
      {/* Monitor bezel */}
      <div
        className="rounded-xl border-2 border-border/60 overflow-hidden shadow-2xl"
        style={{ width: monitorW, height: monitorH, background: 'hsl(220 20% 8%)' }}
      >
        <svg
          viewBox="0 0 340 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          aria-hidden="true"
        >
          <defs>
            <filter id="vitGlow">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Faint grid */}
          {[30, 60, 90, 120, 150].map(y => (
            <line key={y} x1="0" y1={y} x2="340" y2={y} stroke="#1a3a3a" strokeWidth="0.5" />
          ))}
          {[50, 100, 150, 200, 250, 300].map(x => (
            <line key={x} x1={x} y1="0" x2={x} y2="180" stroke="#1a3a3a" strokeWidth="0.5" />
          ))}

          {/* ─── HR Waveform (teal/green) ─── */}
          <g>
            {/* Label */}
            <text x="10" y="20" fill="hsl(170 70% 55%)" fontSize="10" fontFamily="monospace" opacity="0.9">HR</text>
            <text x="280" y="20" fill="hsl(170 70% 55%)" fontSize="14" fontFamily="monospace" fontWeight="bold" className="ncahp-vitals-blink">72</text>
            <text x="310" y="20" fill="hsl(170 70% 55%)" fontSize="8" fontFamily="monospace" opacity="0.6">bpm</text>

            {/* ECG-style trace */}
            <path
              d="M0,60 L30,60 L45,60 L55,58 L60,60 L70,60 L80,52 L86,68 L92,25 L98,90 L104,45 L110,65 L116,60 L140,60 L170,60 L185,58 L190,60 L200,60 L210,52 L216,68 L222,25 L228,90 L234,45 L240,65 L246,60 L270,60 L300,60 L340,60"
              stroke="hsl(170 70% 55%)"
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
              filter="url(#vitGlow)"
              className="ncahp-vitals-trace-hr"
            />
          </g>

          {/* ─── SpO2 Waveform (orange) ─── */}
          <g>
            <text x="10" y="105" fill="hsl(var(--accent))" fontSize="10" fontFamily="monospace" opacity="0.9">SpO₂</text>
            <text x="280" y="105" fill="hsl(var(--accent))" fontSize="14" fontFamily="monospace" fontWeight="bold" className="ncahp-vitals-blink" style={{ animationDelay: '0.5s' }}>98</text>
            <text x="310" y="105" fill="hsl(var(--accent))" fontSize="8" fontFamily="monospace" opacity="0.6">%</text>

            {/* Pleth wave */}
            <path
              d="M0,140 Q20,140 30,120 Q40,140 60,140 Q80,140 90,118 Q100,140 120,140 Q140,140 150,120 Q160,140 180,140 Q200,140 210,118 Q220,140 240,140 Q260,140 270,120 Q280,140 300,140 L340,140"
              stroke="hsl(var(--accent))"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
              filter="url(#vitGlow)"
              className="ncahp-vitals-trace-spo2"
            />
          </g>

          {/* Divider line */}
          <line x1="0" y1="85" x2="340" y2="85" stroke="#1a3a3a" strokeWidth="1" />

          {/* Scanning sweep line */}
          <rect width="3" height="180" fill="url(#sweepGrad)" className="ncahp-vitals-sweep">
          </rect>
          <defs>
            <linearGradient id="sweepGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="50%" stopColor="white" stopOpacity="0.15" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
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

export default NCAHPLoaderVitals;
