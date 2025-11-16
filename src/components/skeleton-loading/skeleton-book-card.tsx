"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonBookCard() {
  return (
    <div className="group relative inline-block">
      <div
        className="relative h-72 w-48 sm:h-80 sm:w-70"
        style={{ perspective: "1200px" }}
      >
        {/* Main card skeleton */}
        <Skeleton className="relative h-full w-full rounded-lg" />

        {/* Drop shadow under the book */}
        <div className="bg-muted absolute right-4 -bottom-3 left-4 h-4 rounded-full blur-md" />
      </div>
    </div>
  );
}

export default SkeletonBookCard;
