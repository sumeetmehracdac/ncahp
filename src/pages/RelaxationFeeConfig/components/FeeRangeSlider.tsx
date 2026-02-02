import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { Check, AlertTriangle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

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

  const modeColors = {
    default: { bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-300' },
    min: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
    max: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' },
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Mode Toggle */}
      <div className="flex items-center justify-center gap-6 p-3 rounded-lg bg-muted/50">
        {(['default', 'min', 'max'] as EditMode[]).map((mode) => (
          <div key={mode} className="flex items-center gap-2">
            <Switch
              id={`mode-${mode}`}
              checked={editMode === mode}
              onCheckedChange={(checked) => checked && setEditMode(mode)}
              disabled={disabled}
              className="data-[state=checked]:bg-primary"
            />
            <Label 
              htmlFor={`mode-${mode}`} 
              className={cn(
                'text-sm font-medium cursor-pointer capitalize',
                editMode === mode ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {mode === 'default' ? 'Default Fee' : mode === 'min' ? 'Min Fee' : 'Max Fee'}
            </Label>
          </div>
        ))}
      </div>

      {/* Slider with visual range */}
      <div className="relative pt-8 pb-4">
        {/* National default marker */}
        <div
          className="absolute top-0 transform -translate-x-1/2 text-xs whitespace-nowrap z-10"
          style={{ left: `${positions.nationalDefault}%` }}
        >
          <div className="flex flex-col items-center">
            <span className="text-primary font-medium text-[10px]">National Default</span>
            <div className="w-px h-2 bg-primary" />
          </div>
        </div>

        {/* State range visualization (background bar) */}
        <div className="absolute top-6 left-0 right-0 h-3 rounded-full bg-secondary overflow-hidden">
          {/* State council's configured range */}
          <div
            className="absolute h-full bg-gradient-to-r from-blue-400 via-teal-400 to-amber-400 opacity-40"
            style={{
              left: `${positions.stateMin}%`,
              width: `${positions.stateMax - positions.stateMin}%`,
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
            'relative z-20',
            !validation.valid && '[&_[role=slider]]:bg-destructive [&_[role=slider]]:border-destructive'
          )}
        />

        {/* State range markers */}
        <div className="absolute top-[30px] left-0 right-0 pointer-events-none">
          {/* Min marker */}
          <div
            className="absolute transform -translate-x-1/2"
            style={{ left: `${positions.stateMin}%` }}
          >
            <div className="w-0.5 h-4 bg-blue-500 rounded-full" />
          </div>
          {/* Max marker */}
          <div
            className="absolute transform -translate-x-1/2"
            style={{ left: `${positions.stateMax}%` }}
          >
            <div className="w-0.5 h-4 bg-amber-500 rounded-full" />
          </div>
          {/* Default marker */}
          <div
            className="absolute transform -translate-x-1/2"
            style={{ left: `${positions.stateDefault}%` }}
          >
            <div className="w-1 h-4 bg-teal-500 rounded-full" />
          </div>
        </div>
      </div>

      {/* Bounds display with state range */}
      <div className="flex justify-between items-start text-sm">
        <div className="flex flex-col items-start gap-1">
          <span className="text-muted-foreground text-xs">National Min</span>
          <span className="font-medium">{formatCurrency(nationalMin)}</span>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-xs text-blue-700">Your Min: {formatCurrency(minValue)}</span>
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-1">
          {validation.valid ? (
            <div className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-emerald-600" />
              <span className="text-emerald-600 font-medium text-xs">Valid Config</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="text-destructive font-medium text-xs">Invalid</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-teal-500" />
            <span className="text-xs text-teal-700">Default: {formatCurrency(defaultValue)}</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className="text-muted-foreground text-xs">National Max</span>
          <span className="font-medium">{formatCurrency(nationalMax)}</span>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-xs text-amber-700">Your Max: {formatCurrency(maxValue)}</span>
          </div>
        </div>
      </div>

      {/* Current editing value */}
      <div className="flex items-center justify-center">
        <div className={cn(
          'px-4 py-2 rounded-lg font-semibold text-lg border',
          modeColors[editMode].bg,
          modeColors[editMode].text,
          modeColors[editMode].border
        )}>
          Editing {editMode === 'default' ? 'Default' : editMode === 'min' ? 'Minimum' : 'Maximum'}: {formatCurrency(currentValue)}
        </div>
      </div>
    </div>
  );
}