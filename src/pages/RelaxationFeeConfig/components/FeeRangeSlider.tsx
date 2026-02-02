import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { Check, AlertTriangle } from 'lucide-react';

interface FeeRangeSliderProps {
  value: number;
  onChange: (value: number) => void;
  nationalMin: number;
  nationalMax: number;
  nationalDefault: number;
  stateMin?: number;
  stateMax?: number;
  disabled?: boolean;
  showBounds?: boolean;
  className?: string;
}

export function FeeRangeSlider({
  value,
  onChange,
  nationalMin,
  nationalMax,
  nationalDefault,
  stateMin,
  stateMax,
  disabled = false,
  showBounds = true,
  className,
}: FeeRangeSliderProps) {
  const isWithinBounds = useMemo(() => {
    const min = stateMin ?? nationalMin;
    const max = stateMax ?? nationalMax;
    return value >= min && value <= max;
  }, [value, nationalMin, nationalMax, stateMin, stateMax]);

  const defaultPosition = useMemo(() => {
    return ((nationalDefault - nationalMin) / (nationalMax - nationalMin)) * 100;
  }, [nationalDefault, nationalMin, nationalMax]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* Slider with markers */}
      <div className="relative pt-6 pb-2">
        {/* National default marker */}
        <div
          className="absolute top-0 transform -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap"
          style={{ left: `${defaultPosition}%` }}
        >
          <div className="flex flex-col items-center">
            <span className="text-primary font-medium">National Default</span>
            <div className="w-px h-2 bg-primary" />
          </div>
        </div>

        <Slider
          value={[value]}
          onValueChange={([v]) => onChange(v)}
          min={nationalMin}
          max={nationalMax}
          step={100}
          disabled={disabled}
          className={cn(
            'relative',
            !isWithinBounds && '[&_[role=slider]]:bg-destructive'
          )}
        />
      </div>

      {/* Bounds display */}
      {showBounds && (
        <div className="flex justify-between items-center text-sm">
          <div className="flex flex-col items-start">
            <span className="text-muted-foreground text-xs">Min</span>
            <span className="font-medium">{formatCurrency(nationalMin)}</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            {isWithinBounds ? (
              <>
                <Check className="h-4 w-4 text-emerald-600" />
                <span className="text-emerald-600 font-medium">Within bounds</span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <span className="text-destructive font-medium">Exceeds bounds</span>
              </>
            )}
          </div>

          <div className="flex flex-col items-end">
            <span className="text-muted-foreground text-xs">Max</span>
            <span className="font-medium">{formatCurrency(nationalMax)}</span>
          </div>
        </div>
      )}

      {/* Current value display */}
      <div className="flex items-center justify-center">
        <div className={cn(
          'px-4 py-2 rounded-lg font-semibold text-lg',
          isWithinBounds ? 'bg-emerald-100 text-emerald-800' : 'bg-destructive/10 text-destructive'
        )}>
          {formatCurrency(value)}
        </div>
      </div>
    </div>
  );
}
