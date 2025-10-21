import React from "react";
import { type Paper } from "@/utils/types";
import BookCard from "../book-card";
import { openTabletViewWithData } from "@/utils/openTabletView";

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
            <button
              onClick={() => {
                openTabletViewWithData(
                  `${window.location.origin}/id?id=${item.id}`,
                  item,
                );
              }}
              key={item.id}
            >
              <BookCard tone="accent" author={item.author} title={item.name} />
            </button>
          ))}
      </div>
    </div>
  );
};

export default LibraryMain;
