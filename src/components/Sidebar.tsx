"use client";

import { Diamond, Trash2 } from "lucide-react";
import { api } from "@/trpc/react";

export function Sidebar() {
  const { data: allLibrary } = api.library.getAllLibraries.useQuery();

  return (
    <div className="flex h-full w-64 flex-col bg-stone-200 p-4">
      {/* Static menu */}
      <div className="space-y-3">
        <div className="cursor-pointer text-sm font-medium text-stone-600 hover:text-stone-800">
          Recent
        </div>
        <div className="cursor-pointer text-sm font-medium text-stone-600 hover:text-stone-800">
          Reading list
        </div>
        <div className="cursor-pointer text-sm font-medium text-stone-600 hover:text-stone-800">
          Discover
        </div>
      </div>

      {/* My library */}
      <div className="mt-6 space-y-3">
        <div className="text-sm font-bold text-stone-600">My library</div>

        {allLibrary?.map((lib) => (
          <div
            key={lib.id}
            className="flex cursor-pointer items-center gap-2 text-sm text-stone-600 hover:text-stone-800"
          >
            <div className="h-1.5 w-1.5 rounded-full bg-stone-500"></div>
            <span>{lib.name}</span>
          </div>
        ))}

        <div className="ml-2 cursor-pointer text-sm text-stone-600 hover:text-stone-800">
          New category +
        </div>
      </div>

      {/* Bottom section */}
      <div className="mt-auto space-y-3">
        <div className="flex cursor-pointer items-center gap-2 text-sm text-stone-600 hover:text-stone-800">
          <Diamond className="h-3 w-3 fill-purple-500 text-purple-500" />
          <span>Pro</span>
        </div>
        <div className="flex cursor-pointer items-center gap-2 text-sm text-stone-600 hover:text-stone-800">
          <Trash2 className="h-3 w-3" />
          <span>Trash</span>
        </div>
      </div>
    </div>
  );
}
