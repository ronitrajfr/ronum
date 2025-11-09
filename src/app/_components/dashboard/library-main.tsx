"use client";

import type React from "react";
import type { Paper } from "@/utils/types";
import BookCard from "../book-card";
import Link from "next/link";
import { useState } from "react";

interface LibraryMainProps {
  data: Paper[];
  onColorChange?: (itemId: string, color: string) => void;
}

const LibraryMain: React.FC<LibraryMainProps> = ({
  data = [],
  onColorChange,
}) => {
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
              <Link href={`/reader/${item.id}`}>
                <BookCard
                  paperColor={(item.colorScheme as string) || "#2563eb"}
                  author={item.author}
                  title={item.name}
                  editable={true}
                />
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
};

export default LibraryMain;
