import { cn } from '@/lib/utils';
import { CATEGORY_CONFIG, type CriterionCategory } from '../types';

interface CriterionBadgeProps {
  category: CriterionCategory;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export function CriterionBadge({
  category,
  name,
  size = 'md',
  showIcon = true,
  className,
}: CriterionBadgeProps) {
  const config = CATEGORY_CONFIG[category];
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-base px-3 py-1.5 gap-2',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium transition-colors',
        config.bgColor,
        config.color,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <span className="flex-shrink-0">{config.icon}</span>}
      <span className="truncate">{name}</span>
    </span>
  );
}

interface CategoryBadgeProps {
  category: CriterionCategory;
  size?: 'sm' | 'md';
  className?: string;
}

export function CategoryBadge({ category, size = 'sm', className }: CategoryBadgeProps) {
  const config = CATEGORY_CONFIG[category];
  
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md font-medium',
        config.bgColor,
        config.color,
        size === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-sm px-2 py-1',
        className
      )}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}
