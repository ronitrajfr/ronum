import React from "react";
import { type Paper } from "@/utils/types";
import BookCard from "../book-card";

interface LibraryMainProps {
  data: Paper[];
}

const LibraryMain: React.FC<LibraryMainProps> = ({ data }) => {
  return (
    <div>
      <div className="flex items-center gap-2">
        <p className="my-4 border text-xl font-semibold">
          Items ({data.length})
        </p>
        <div className="flex-1 border-b border-stone-500"></div>
      </div>
      <div className="space justify-left mb-6 flex flex-wrap space-x-6">
        {data &&
          data.map((item) => (
            <div key={item.id}>
              <BookCard tone="accent" author={item.author} title={item.name} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default LibraryMain;
