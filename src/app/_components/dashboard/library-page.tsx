"use client";
import { api } from "@/trpc/react";
import React from "react";
import LibraryHeader from "./library-header";
import LibraryMain from "./library-main";
import { type LibraryCategory } from "@/utils/types";

const Librarypage = ({ id }: { id: string }) => {
  const { data, isLoading, error } = api.category.getCategoryInfoById.useQuery({
    categoryId: id,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error || !data) return <p>Error loading library</p>;

  const category = data as LibraryCategory;

  return (
    <div className="mx-7 mt-7 flex-1">
      <div>
        <LibraryHeader
          id={id}
          name={category?.name}
          description={category?.description}
        />

        <LibraryMain data={data.paper} />
      </div>
    </div>
  );
};

export default Librarypage;
