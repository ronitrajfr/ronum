"use client";

import React, { useState, type MouseEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Diamond, Trash2, Ellipsis } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ColorDot = ({ color }: { color: string }) => (
  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
);

export function Sidebar() {
  const router = useRouter();
  const utils = api.useUtils();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const {
    data: allCategory,
    isFetching,
    isLoading,
    isError,
  } = api.category.getAllCategory.useQuery();

  console.log("Is fetching:", isFetching);

  const createCategory = api.category.create.useMutation({
    onSuccess: async (data) => {
      await utils.category.invalidate();
      router.push(`/dashboard/${data.id}`);
    },
  });

  const deleteCategory = api.category.deleteCategory.useMutation({
    onSuccess: async () => {
      await utils.category.invalidate();
      setOpenDropdown(null);
    },
  });

  const handleCreate = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    createCategory.mutate({
      name: "Untitled",
      colorScheme: "#FFC29B",
      description: "Description for this library",
    });
  };

  const handleDelete = (categoryId: string) => {
    deleteCategory.mutate({ categoryId });
  };

  return (
    <aside className="flex h-full w-64 flex-col border-r-2 border-stone-300 bg-stone-200 p-4">
      {/* ---------- Static menu ---------- */}
      <nav className="space-y-3">
        {["Recent", "Reading list", "Discover"].map((item) => (
          <button
            key={item}
            className="block w-full text-left text-sm font-medium text-stone-600 hover:text-stone-800"
          >
            {item}
          </button>
        ))}
      </nav>

      {/* ---------- My Library ---------- */}
      <section className="mt-6 space-y-3">
        <div className="text-sm font-bold text-stone-600">My Library</div>

        {/* Loading/Error States */}
        {isLoading && <div className="text-xs text-stone-500">Loading...</div>}
        {isError && (
          <div className="text-xs text-red-500">Failed to load categories.</div>
        )}

        {allCategory?.map(
          (category: NonNullable<typeof allCategory>[number]) => (
            <div
              key={category.id}
              className="flex items-center justify-between gap-2 text-sm text-stone-600 hover:text-stone-800"
            >
              <Link
                href={`/dashboard/${category.id}`}
                className="flex flex-1 items-center gap-2 truncate"
              >
                <ColorDot color={category.colorScheme} />
                <span className="truncate">{category.name}</span>
              </Link>

              {/*---------- Dropdown Menu ---------- */}
              <DropdownMenu
                open={openDropdown === category.id}
                onOpenChange={(open) =>
                  setOpenDropdown(open ? category.id : null)
                }
              >
                <DropdownMenuTrigger asChild>
                  <button
                    aria-label="More options"
                    className="p-1 text-stone-600 hover:cursor-pointer hover:text-stone-800"
                  >
                    <Ellipsis size={18} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="center"
                  className="w-40 hover:cursor-pointer"
                >
                  <DropdownMenuItem
                    onClick={() => handleDelete(category.id)}
                    disabled={deleteCategory.isPending}
                    className="text-red-600 hover:cursor-pointer focus:text-red-700"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {deleteCategory.isPending ? "Deleting..." : "Delete"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ),
        )}

        <button
          onClick={handleCreate}
          disabled={createCategory.isPending}
          className={cn(
            "cursor-pointer text-sm text-stone-600 hover:text-stone-800",
            createCategory.isPending && "cursor-not-allowed opacity-50",
          )}
        >
          {createCategory.isPending ? "Creating..." : "New Category +"}
        </button>
      </section>

      {/* ---------- Bottom section ---------- */}
      <div className="mt-auto space-y-3">
        <button className="flex items-center gap-2 text-sm text-stone-600 hover:text-stone-800">
          <Diamond className="h-3 w-3 fill-purple-500 text-purple-500" />
          <span>Pro</span>
        </button>
        <button className="flex items-center gap-2 text-sm text-stone-600 hover:text-stone-800">
          <Trash2 className="h-3 w-3" />
          <span>Trash</span>
        </button>
      </div>
    </aside>
  );
}
