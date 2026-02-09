interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`bg-gray-200/70 animate-pulse rounded-lg ${className}`}
    />
  );
}

export function FormCardSkeleton() {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100">
      {/* Title */}
      <Skeleton className="h-5 w-3/4 mb-3" />

      {/* Description */}
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3 mb-4" />

      {/* Status and Version */}
      <div className="flex gap-2 mb-4">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 pt-3 border-t border-gray-100">
        <Skeleton className="h-8 w-16 rounded-lg" />
        <Skeleton className="h-8 w-16 rounded-lg" />
      </div>
    </div>
  );
}
