"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonLibraryHeader() {
  return (
    <div>
      <div className="space-y-3">
        {/* Title skeleton */}
        <Skeleton className="h-10 w-48 rounded-lg" />

        {/* Description skeleton */}
        <Skeleton className="h-6 w-full max-w-md rounded-lg" />

        {/* Button skeletons */}
        <div className="flex space-x-3">
          <Skeleton className="h-10 w-28 rounded-xl" />
          <Skeleton className="h-10 w-20 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default SkeletonLibraryHeader;
