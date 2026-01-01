import { Skeleton } from '@/components/ui/skeleton';

const HeroSkeleton = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-accent py-8 lg:py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-3">
            {/* Badge skeleton */}
            <Skeleton className="h-6 w-24 rounded-full bg-white/20" />
            
            {/* Title skeleton */}
            <Skeleton className="h-8 w-64 md:w-80 bg-white/20" />
            
            {/* Subtitle skeleton */}
            <Skeleton className="h-4 w-48 md:w-64 bg-white/20" />
          </div>

          {/* Button skeleton */}
          <Skeleton className="h-10 w-44 rounded-lg bg-white/20" />
        </div>
      </div>
    </section>
  );
};

export default HeroSkeleton;
