import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { Check, AlertTriangle } from 'lucide-react';

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

  const markerConfig = {
    min: { color: 'bg-blue-500', ring: 'ring-blue-400', label: 'Min', textColor: 'text-blue-700' },
    default: { color: 'bg-teal-500', ring: 'ring-teal-400', label: 'Default', textColor: 'text-teal-700' },
    max: { color: 'bg-amber-500', ring: 'ring-amber-400', label: 'Max', textColor: 'text-amber-700' },
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Slider with clickable markers */}
      <div className="relative pt-10 pb-8">
        {/* National default marker */}
        <div
          className="absolute top-0 transform -translate-x-1/2 text-xs whitespace-nowrap z-10"
          style={{ left: `${positions.nationalDefault}%` }}
        >
          <div className="flex flex-col items-center">
            <span className="text-primary font-medium text-[10px]">National Default</span>
            <div className="w-px h-3 bg-primary/50" />
          </div>
        </div>

        {/* Track background with state range highlight */}
        <div className="absolute top-8 left-0 right-0 h-2 rounded-full bg-secondary">
          <div
            className="absolute h-full bg-gradient-to-r from-blue-200 via-teal-200 to-amber-200 rounded-full"
            style={{
              left: `${positions.stateMin}%`,
              width: `${Math.max(0, positions.stateMax - positions.stateMin)}%`,
            }}
          />
        </div>

        {/* Main slider */}
        <Slider
          value={[currentValue]}
          onValueChange={([v]) => currentHandler(v)}
          min={nationalMin}
          max={nationalMax}
          step={100}
          disabled={disabled}
          className={cn(
            'relative z-10 mt-1',
            !validation.valid && '[&_[role=slider]]:bg-destructive [&_[role=slider]]:border-destructive'
          )}
        />

        {/* Clickable state markers */}
        <div className="absolute top-[26px] left-0 right-0 z-20">
          {/* Min marker */}
          <button
            type="button"
            onClick={() => setEditMode('min')}
            disabled={disabled}
            className={cn(
              'absolute transform -translate-x-1/2 flex flex-col items-center cursor-pointer transition-all group',
              editMode === 'min' ? 'scale-110' : 'hover:scale-105'
            )}
            style={{ left: `${positions.stateMin}%` }}
          >
            <div className={cn(
              'w-3 h-3 rounded-full transition-all shadow-sm',
              markerConfig.min.color,
              editMode === 'min' && `ring-2 ${markerConfig.min.ring} ring-offset-1`
            )} />
            <span className={cn(
              'text-[10px] font-medium mt-1 transition-opacity',
              markerConfig.min.textColor,
              editMode !== 'min' && 'opacity-60 group-hover:opacity-100'
            )}>
              {formatCurrency(minValue)}
            </span>
          </button>

          {/* Default marker */}
          <button
            type="button"
            onClick={() => setEditMode('default')}
            disabled={disabled}
            className={cn(
              'absolute transform -translate-x-1/2 flex flex-col items-center cursor-pointer transition-all group',
              editMode === 'default' ? 'scale-110' : 'hover:scale-105'
            )}
            style={{ left: `${positions.stateDefault}%` }}
          >
            <div className={cn(
              'w-3.5 h-3.5 rounded-full transition-all shadow-sm',
              markerConfig.default.color,
              editMode === 'default' && `ring-2 ${markerConfig.default.ring} ring-offset-1`
            )} />
            <span className={cn(
              'text-[10px] font-medium mt-1 transition-opacity',
              markerConfig.default.textColor,
              editMode !== 'default' && 'opacity-60 group-hover:opacity-100'
            )}>
              {formatCurrency(defaultValue)}
            </span>
          </button>

          {/* Max marker */}
          <button
            type="button"
            onClick={() => setEditMode('max')}
            disabled={disabled}
            className={cn(
              'absolute transform -translate-x-1/2 flex flex-col items-center cursor-pointer transition-all group',
              editMode === 'max' ? 'scale-110' : 'hover:scale-105'
            )}
            style={{ left: `${positions.stateMax}%` }}
          >
            <div className={cn(
              'w-3 h-3 rounded-full transition-all shadow-sm',
              markerConfig.max.color,
              editMode === 'max' && `ring-2 ${markerConfig.max.ring} ring-offset-1`
            )} />
            <span className={cn(
              'text-[10px] font-medium mt-1 transition-opacity',
              markerConfig.max.textColor,
              editMode !== 'max' && 'opacity-60 group-hover:opacity-100'
            )}>
              {formatCurrency(maxValue)}
            </span>
          </button>
        </div>
      </div>

      {/* Bounds and status display */}
      <div className="flex justify-between items-center text-sm">
        <div className="text-left">
          <span className="text-muted-foreground text-xs">National Min</span>
          <div className="font-medium">{formatCurrency(nationalMin)}</div>
        </div>
        
        <div className="flex flex-col items-center gap-1">
          {validation.valid ? (
            <div className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-emerald-600" />
              <span className="text-emerald-600 font-medium text-xs">Valid</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="text-destructive font-medium text-xs">Invalid</span>
            </div>
          )}
          <span className={cn(
            'text-xs font-medium px-2 py-0.5 rounded-full',
            editMode === 'min' && 'bg-blue-100 text-blue-700',
            editMode === 'default' && 'bg-teal-100 text-teal-700',
            editMode === 'max' && 'bg-amber-100 text-amber-700'
          )}>
            Editing: {markerConfig[editMode].label}
          </span>
        </div>

        <div className="text-right">
          <span className="text-muted-foreground text-xs">National Max</span>
          <div className="font-medium">{formatCurrency(nationalMax)}</div>
        </div>
      </div>
    </div>
  );
}