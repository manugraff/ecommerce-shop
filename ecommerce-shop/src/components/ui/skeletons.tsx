import { Skeleton } from './skeleton';

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {}
      <Skeleton className="aspect-square w-full" />

      {}
      <div className="p-4 space-y-3">
        {}
        <Skeleton className="h-5 w-3/4" />

        {}
        <div className="flex gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>

        {}
        <Skeleton className="h-6 w-28 mt-2" />

        {}
        <Skeleton className="h-10 w-full mt-4" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}