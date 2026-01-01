import { Skeleton } from '@/components/ui/skeleton';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

const TableSkeleton = ({ rows = 5, columns = 4 }: TableSkeletonProps) => {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      {/* Header */}
      <div className="bg-muted px-4 py-3 border-b border-border">
        <div className="flex gap-4">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1" />
          ))}
        </div>
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="px-4 py-3 border-b border-border last:border-0">
          <div className="flex gap-4 items-center">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton 
                key={colIndex} 
                className={`h-4 flex-1 ${colIndex === 0 ? 'max-w-[200px]' : ''}`} 
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TableSkeleton;
