"use client";

import { Diamond, Trash2 } from "lucide-react";
import { api } from "@/trpc/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const router = useRouter();
  const { data: allLibrary } = api.library.getAllLibraries.useQuery();

  const createLibrary = api.library.create.useMutation({
    onSuccess: async (data) => {
      await utils.library.invalidate();
      router.push(`${data.id}`);
    },
  });
  const utils = api.useUtils();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    createLibrary.mutate({
      name: "undefined",
      colorScheme: "#715A5A",
    });
  };

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
            <div
              className={cn("h-2 w-2 rounded-full", `bg-[${lib.colorScheme}]`)}
            ></div>
            <Link href={`${lib.id}`}>{lib.name}</Link>
          </div>
        ))}

        <button
          onClick={(e) => {
            handleClick(e);
          }}
          className="ml-2 cursor-pointer text-sm text-stone-600 hover:text-stone-800"
        >
          New category +
        </button>
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
