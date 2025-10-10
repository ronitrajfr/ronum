"use client";
import { api } from "@/trpc/react";
import React from "react";
import LibraryHeader from "./library-header";

const Librarypage = ({ id }: { id: string }) => {
  const { data, isLoading, error } = api.category.getCategoryInfoById.useQuery({
    categoryId: id,
  });

  //console.log(data);

  return (
    <div className="mx-7 mt-7 flex-1">
      <div>
        <LibraryHeader name={data?.name} description={data?.description} />
      </div>
    </div>
  );
};

export default Librarypage;
