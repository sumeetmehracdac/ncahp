import { Skeleton } from '@/components/ui/skeleton';

interface CardSkeletonProps {
  variant?: 'default' | 'horizontal' | 'compact';
  showImage?: boolean;
}

const CardSkeleton = ({ variant = 'default', showImage = true }: CardSkeletonProps) => {
  if (variant === 'horizontal') {
    return (
      <div className="flex gap-4 p-4 rounded-xl border border-border bg-card animate-pulse">
        {showImage && <Skeleton className="h-20 w-20 rounded-lg flex-shrink-0" />}
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="p-3 rounded-lg border border-border bg-card animate-pulse">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-2 w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden animate-pulse">
      {showImage && <Skeleton className="h-40 w-full" />}
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-16 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default CardSkeleton;
