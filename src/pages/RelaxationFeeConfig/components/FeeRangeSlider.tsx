import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { Check, AlertTriangle } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

type EditMode = 'default' | 'min' | 'max';

interface FeeRangeSliderProps {
  defaultValue: number;
  minValue: number;
  maxValue: number;
  onDefaultChange: (value: number) => void;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
  nationalMin: number;
  nationalMax: number;
  nationalDefault: number;
  disabled?: boolean;
  className?: string;
}

export function FeeRangeSlider({
  defaultValue,
  minValue,
  maxValue,
  onDefaultChange,
  onMinChange,
  onMaxChange,
  nationalMin,
  nationalMax,
  nationalDefault,
  disabled = false,
  className,
}: FeeRangeSliderProps) {
  const [editMode, setEditMode] = useState<EditMode>('default');

  const range = nationalMax - nationalMin;

  const positions = useMemo(() => ({
    nationalDefault: ((nationalDefault - nationalMin) / range) * 100,
    stateMin: ((minValue - nationalMin) / range) * 100,
    stateMax: ((maxValue - nationalMin) / range) * 100,
    stateDefault: ((defaultValue - nationalMin) / range) * 100,
  }), [nationalDefault, nationalMin, range, minValue, maxValue, defaultValue]);

  const validation = useMemo(() => {
    const errors: string[] = [];
    if (minValue < nationalMin) errors.push('Min below national minimum');
    if (maxValue > nationalMax) errors.push('Max exceeds national maximum');
    if (defaultValue < minValue) errors.push('Default below your minimum');
    if (defaultValue > maxValue) errors.push('Default exceeds your maximum');
    if (minValue > maxValue) errors.push('Min cannot exceed max');
    return { valid: errors.length === 0, errors };
  }, [minValue, maxValue, defaultValue, nationalMin, nationalMax]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const currentValue = editMode === 'default' ? defaultValue : editMode === 'min' ? minValue : maxValue;
  const currentHandler = editMode === 'default' ? onDefaultChange : editMode === 'min' ? onMinChange : onMaxChange;

  const handleSliderChange = (values: number[]) => {
    currentHandler(values[0]);
  };

  // Marker data sorted by position for rendering
  const markers = [
    { id: 'min' as EditMode, pos: positions.stateMin, value: minValue, label: 'Min' },
    { id: 'default' as EditMode, pos: positions.stateDefault, value: defaultValue, label: 'Default' },
    { id: 'max' as EditMode, pos: positions.stateMax, value: maxValue, label: 'Max' },
  ].sort((a, b) => a.pos - b.pos);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Slider area */}
      <div className="relative pt-8 pb-12">
        {/* National default indicator */}
        <div
          className="absolute top-0 transform -translate-x-1/2 text-xs whitespace-nowrap pointer-events-none"
          style={{ left: `${positions.nationalDefault}%` }}
        >
          <div className="flex flex-col items-center">
            <span className="text-primary font-medium text-[10px]">National Default</span>
            <div className="w-px h-2 bg-primary/60" />
          </div>
        </div>

        {/* Slider - single solid teal bar */}
        <Slider
          value={[currentValue]}
          onValueChange={handleSliderChange}
          min={nationalMin}
          max={nationalMax}
          step={100}
          disabled={disabled}
          className={cn(
            "w-full",
            !validation.valid && "[&_[data-slot=thumb]]:border-destructive"
          )}
        />

        {/* Clickable markers below slider */}
        <div className="absolute top-12 left-0 right-0">
          {markers.map((marker) => (
            <button
              key={marker.id}
              type="button"
              onClick={() => setEditMode(marker.id)}
              disabled={disabled}
              className={cn(
                'absolute transform -translate-x-1/2 flex flex-col items-center transition-all',
                'cursor-pointer hover:scale-105',
                disabled && 'cursor-not-allowed opacity-50'
              )}
              style={{ left: `${marker.pos}%` }}
            >
              <div className={cn(
                'w-2 h-2 rounded-full bg-primary transition-all',
                editMode === marker.id && 'w-3 h-3 ring-2 ring-primary/40 ring-offset-1'
              )} />
              <span className={cn(
                'text-[10px] mt-1 font-medium transition-opacity',
                editMode === marker.id ? 'text-primary' : 'text-muted-foreground'
              )}>
                {marker.label}
              </span>
              <span className={cn(
                'text-[10px]',
                editMode === marker.id ? 'text-foreground font-medium' : 'text-muted-foreground'
              )}>
                {formatCurrency(marker.value)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer: bounds + validation */}
      <div className="flex justify-between items-center text-sm pt-4">
        <div>
          <span className="text-muted-foreground text-xs">National Min</span>
          <div className="font-medium">{formatCurrency(nationalMin)}</div>
        </div>
        
        <div className="flex items-center gap-2">
          {validation.valid ? (
            <div className="flex items-center gap-1">
              <Check className="h-4 w-4 text-emerald-600" />
              <span className="text-emerald-600 text-xs font-medium">Valid</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="text-destructive text-xs font-medium">Invalid</span>
            </div>
          )}
        </div>

        <div className="text-right">
          <span className="text-muted-foreground text-xs">National Max</span>
          <div className="font-medium">{formatCurrency(nationalMax)}</div>
        </div>
      </div>
    </div>
  );
}