import { Skeleton } from '@/components/ui/skeleton';

const GallerySkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-card rounded-2xl overflow-hidden shadow-card border border-border animate-pulse"
        >
          <Skeleton className="aspect-[4/3] w-full" />
        </div>
      ))}
    </div>
  );
};

export default GallerySkeleton;
