import { Skeleton } from '@/components/ui/skeleton';

const AnnouncementCardSkeleton = ({ count = 6 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="relative overflow-hidden rounded-xl border border-border bg-card shadow-sm h-full flex flex-col animate-pulse"
        >
          <div className="p-4 lg:p-5 flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-3 w-16" />
            </div>

            <div className="absolute top-3 right-3">
              <Skeleton className="h-5 w-12 rounded-full" />
            </div>

            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-3 w-2/3 mb-3" />

            <div className="space-y-2 mb-4">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5" />
            </div>

            <div className="border-t border-border pt-3 mt-auto">
              <div className="flex gap-2">
                <Skeleton className="h-8 w-28 rounded-md" />
                <Skeleton className="h-8 w-24 rounded-md" />
                <Skeleton className="h-8 w-20 rounded-md" />
              </div>
            </div>
          </div>

          <Skeleton className="h-0.5 w-full" />
        </div>
      ))}
    </>
  );
};

export default AnnouncementCardSkeleton;
