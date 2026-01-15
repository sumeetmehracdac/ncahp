import { Skeleton } from '@/components/ui/skeleton';

const CommitteeMappingSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section Skeleton */}
      <div className="relative overflow-hidden bg-gradient-to-r from-teal-700 via-teal-600 to-teal-700">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-5" />
        <div className="container mx-auto px-4 py-12 relative">
          <div className="text-center mb-8">
            <Skeleton className="h-10 w-96 mx-auto mb-4 bg-white/20" />
            <Skeleton className="h-5 w-[500px] mx-auto bg-white/15" />
          </div>
          <div className="flex justify-center gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <Skeleton className="h-12 w-20 mx-auto mb-2 bg-white/20 rounded-lg" />
                <Skeleton className="h-4 w-24 mx-auto bg-white/15" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel - Committees */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between mb-3">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-9 w-36 rounded-lg" />
                </div>
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
              <div className="p-3 space-y-2 max-h-[500px]">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl border border-slate-100 flex items-center gap-3"
                  >
                    <Skeleton className="h-10 w-10 rounded-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <Skeleton className="h-4 w-3/4 mb-1.5" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-6 w-6 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Professions */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-9 w-9 rounded-lg" />
                    <Skeleton className="h-9 w-9 rounded-lg" />
                    <Skeleton className="h-9 w-9 rounded-lg" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-10 flex-1 rounded-lg" />
                  <Skeleton className="h-10 w-32 rounded-lg" />
                </div>
              </div>
              <div className="p-4 space-y-4 max-h-[600px]">
                {Array.from({ length: 4 }).map((_, catIndex) => (
                  <div key={catIndex} className="rounded-xl border border-slate-200 overflow-hidden">
                    <div className="p-3 bg-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-5 w-12 rounded-full" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-20 rounded-md" />
                        <Skeleton className="h-5 w-5 rounded" />
                      </div>
                    </div>
                    <div className="p-3 grid grid-cols-2 md:grid-cols-3 gap-2">
                      {Array.from({ length: 6 }).map((_, profIndex) => (
                        <div
                          key={profIndex}
                          className="p-2.5 rounded-lg border border-slate-100 flex items-center gap-2"
                        >
                          <Skeleton className="h-7 w-7 rounded-md flex-shrink-0" />
                          <Skeleton className="h-3 w-full" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommitteeMappingSkeleton;
