"use client";

import { Skeleton } from "@/components/ui/skeleton";
import SkeletonBookCard from "./skeleton-book-card";

export function SkeletonLibraryMain() {
  return (
    <div>
      <div className="flex items-center gap-2">
        {/* Items count skeleton */}
        <Skeleton className="h-6 w-40 rounded-lg" />
        <div className="flex-1 border-b border-stone-500"></div>
      </div>

      {/* Grid of skeleton book cards */}
      <div className="space justify-left mb-6 flex flex-wrap space-x-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <SkeletonBookCard />
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkeletonLibraryMain;
