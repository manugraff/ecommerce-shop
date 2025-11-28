export function ProductDetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto animate-pulse">
      {}
      <div className="flex items-center gap-2 mb-6">
        <div className="h-4 bg-gray-200 rounded w-16" />
        <div className="h-4 bg-gray-200 rounded w-4" />
        <div className="h-4 bg-gray-200 rounded w-24" />
        <div className="h-4 bg-gray-200 rounded w-4" />
        <div className="h-4 bg-gray-200 rounded w-32" />
      </div>

      {}
      <div className="h-6 bg-gray-200 rounded w-24 mb-6" />

      {}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {}
        <div className="aspect-square bg-gray-200 rounded-lg" />

        {}
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="flex gap-2">
            <div className="h-5 bg-gray-200 rounded w-24" />
            <div className="h-5 bg-gray-200 rounded w-28" />
          </div>
          <div className="h-10 bg-gray-200 rounded w-40" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
          </div>
          <div className="h-12 bg-gray-200 rounded w-full mt-6" />
        </div>
      </div>
    </div>
  );
}