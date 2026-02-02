interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`bg-gray-200 animate-pulse rounded ${className}`}
    />
  );
}

export function FormCardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* Title */}
      <Skeleton className="h-6 w-3/4 mb-3" />
      
      {/* Description */}
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3 mb-4" />
      
      {/* Status and Version */}
      <div className="flex gap-2 mb-4">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      
      {/* Submissions count */}
      <Skeleton className="h-4 w-24 mb-4" />
      
      {/* Action buttons */}
      <div className="flex gap-2">
        <Skeleton className="h-9 w-16" />
        <Skeleton className="h-9 w-16" />
      </div>
    </div>
  );
}