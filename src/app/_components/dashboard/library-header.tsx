import React from "react";
import { PlusCircle, Pencil } from "lucide-react";

const LibraryHeader = ({
  name,
  description,
}: {
  name: string | undefined;
  description: string | undefined | null;
}) => {
  return (
    <div className="space-y-3 border border-b-stone-600">
      <h1 className="text-4xl font-bold tracking-wide text-neutral-800">
        {name}
      </h1>
      <p className="text-lg text-neutral-500">{description}</p>
      <div className="mb-6 flex space-x-6">
        <button className="flex items-center gap-2 rounded-xl bg-stone-300 px-4 py-2 font-semibold text-stone-500 hover:cursor-pointer">
          <p>Add book</p>
          <PlusCircle size={15} />
        </button>
        <button className="flex items-center gap-2 rounded-xl bg-stone-300 px-4 py-2 font-semibold text-stone-500 hover:cursor-pointer">
          <p>Edit</p>
          <Pencil size={15} />
        </button>
      </div>
    </div>
  );
};

export default LibraryHeader;
