"use client";

import type React from "react";

import { Diamond, Trash2, Ellipsis } from "lucide-react";
import { api } from "@/trpc/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Sidebar() {
  const router = useRouter();
  const { data: allLibrary } = api.library.getAllLibraries.useQuery();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const createLibrary = api.library.create.useMutation({
    onSuccess: async (data) => {
      await utils.library.invalidate();
      router.push(`${data.id}`);
    },
  });

  const deleteLibrary = api.library.delete.useMutation({
    onSuccess: async () => {
      await utils.library.invalidate();
      setOpenDropdown(null);
    },
  });

  const utils = api.useUtils();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    createLibrary.mutate({
      name: "undefined",
      colorScheme: "#715A5A",
      description: "Description for this library",
    });
  };

  const handleDelete = (libraryId: string) => {
    deleteLibrary.mutate({ id: libraryId });
  };

  return (
    <div className="flex h-full w-64 flex-col border-r-2 border-stone-300 bg-stone-200 p-4">
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
            className="flex cursor-pointer items-center justify-between gap-2 text-sm text-stone-600 hover:text-stone-800"
          >
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "h-2 w-2 rounded-full",
                  `bg-[${lib.colorScheme}]`,
                )}
              ></div>
              <Link href={`/dashboard/${lib.id}`}>{lib.name}</Link>
            </div>

            <DropdownMenu
              open={openDropdown === lib.id}
              onOpenChange={(open) => setOpenDropdown(open ? lib.id : null)}
            >
              <DropdownMenuTrigger asChild>
                <button className="flex items-center p-1 pt-2">
                  <Ellipsis size={20} className="text-stone-600" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="center"
                className="m-0 w-48 cursor-pointer! border border-stone-300 bg-stone-300 p-0 hover:bg-stone-200"
              >
                <DropdownMenuItem
                  onClick={() => handleDelete(lib.id)}
                  className="curosr-pointer cursor-pointer! bg-stone-200! text-red-600 hover:text-red-600!"
                  disabled={deleteLibrary.isPending}
                >
                  <Trash2 className="mr-2 h-4 w-4 text-stone-600" />
                  {deleteLibrary.isPending ? "Deleting..." : "Delete"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
