import { Skeleton } from '@/components/ui/skeleton';

const NewsCardSkeleton = () => {
  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-card border border-border animate-pulse">
      {/* Image placeholder */}
      <Skeleton className="aspect-video w-full" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-4 w-24 mt-2" />
      </div>
    </div>
  );
};

const NotificationSkeleton = () => {
  return (
    <div className="flex items-center gap-4 p-5 border-b border-border last:border-0 animate-pulse">
      <Skeleton className="w-10 h-10 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <Skeleton className="h-5 w-5" />
    </div>
  );
};

const EventCardSkeleton = () => {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-card border border-border animate-pulse">
      <div className="flex items-start gap-4">
        <Skeleton className="w-14 h-14 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    </div>
  );
};

interface NewsSectionSkeletonProps {
  variant?: 'news' | 'notifications' | 'events';
}

const NewsSectionSkeleton = ({ variant = 'news' }: NewsSectionSkeletonProps) => {
  if (variant === 'notifications') {
    return (
      <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
        {[1, 2, 3, 4].map((i) => (
          <NotificationSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (variant === 'events') {
    return (
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <EventCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <NewsCardSkeleton key={i} />
      ))}
    </div>
  );
};

export default NewsSectionSkeleton;
