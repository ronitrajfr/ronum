"use client";

import type React from "react";
import type { Paper } from "@/utils/types";
import BookCard from "../book-card";
import Link from "next/link";
import { api } from "@/trpc/react"; // Import TRPC API client

interface LibraryMainProps {
  data: Paper[];
}

const LibraryMain: React.FC<LibraryMainProps> = ({ data = [] }) => {
  const updateColorMutation = api.paper.updatePaper.useMutation({
    onSuccess: () => {
      // Color updated successfully, no need to manually refetch
      // The cache invalidation happens on the server side
    },
  });

  const handleColorChange = (paperId: string, color: string) => {
    updateColorMutation.mutate({
      paperId,
      colorScheme: color,
    });
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        <p className="my-4 text-xl font-semibold">Items ({data.length})</p>
        <div className="flex-1 border-b border-stone-500"></div>
      </div>
      <div className="space justify-left mb-6 flex flex-wrap space-x-6">
        {data &&
          data.map((item) => (
            <div key={item.id} className="group relative">
              <BookCard
                paperColor={(item.colorScheme as string) || "#2563eb"}
                author={item.author}
                title={item.name}
                editable={true}
                onColorChange={(color) => handleColorChange(item.id, color)}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default LibraryMain;
