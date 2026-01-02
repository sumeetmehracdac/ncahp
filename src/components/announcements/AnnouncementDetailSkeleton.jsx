import { Skeleton } from '@/components/ui/skeleton';

const AnnouncementDetailSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <Skeleton className="h-9 w-40 mb-6" />

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden animate-pulse">
        <div className="p-6 lg:p-8 border-b border-border">
          <div className="flex gap-3 mb-4">
            <Skeleton className="h-5 w-14 rounded-full" />
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>

          <div className="flex gap-4 mb-4">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>

          <Skeleton className="h-8 w-full mb-2" />
          <Skeleton className="h-8 w-3/4 mb-3" />
          <Skeleton className="h-5 w-2/3" />

          <div className="flex gap-2 mt-6">
            <Skeleton className="h-7 w-20" />
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-7 w-16" />
          </div>
        </div>

        <div className="p-6 lg:p-8 space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <div className="py-2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="py-2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        <div className="p-6 lg:p-8 bg-muted/30 border-t border-border">
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-40" />
          </div>
          
          <div className="grid sm:grid-cols-2 gap-3">
            <Skeleton className="h-16 rounded-lg" />
            <Skeleton className="h-16 rounded-lg" />
          </div>
        </div>
      </div>

      <div className="mt-12">
        <Skeleton className="h-6 w-48 mb-6" />
        <div className="grid md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 rounded-lg border border-border bg-card animate-pulse">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementDetailSkeleton;
