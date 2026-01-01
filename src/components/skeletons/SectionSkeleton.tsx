import { Skeleton } from '@/components/ui/skeleton';
import CardSkeleton from './CardSkeleton';

interface SectionSkeletonProps {
  title?: boolean;
  cardCount?: number;
  cardVariant?: 'default' | 'horizontal' | 'compact';
  columns?: 2 | 3 | 4;
}

const SectionSkeleton = ({ 
  title = true, 
  cardCount = 3, 
  cardVariant = 'default',
  columns = 3 
}: SectionSkeletonProps) => {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <section className="py-12 lg:py-16">
      <div className="container mx-auto px-4">
        {title && (
          <div className="text-center mb-8 space-y-2">
            <Skeleton className="h-8 w-48 mx-auto" />
            <Skeleton className="h-4 w-72 mx-auto" />
          </div>
        )}
        
        <div className={`grid gap-6 ${gridCols[columns]}`}>
          {Array.from({ length: cardCount }).map((_, index) => (
            <CardSkeleton key={index} variant={cardVariant} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SectionSkeleton;
