"use client";
import { api } from "@/trpc/react";
import React from "react";
import LibraryHeader from "./LibraryHeader";

const Librarypage = ({ id }: { id: string }) => {
  const { data, isLoading, error } = api.library.getLibraryById.useQuery({
    id,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error || !data) return <div>Failed to load library</div>;

  return (
    <div>
      <LibraryHeader libraryDetail={data} />
    </div>
  );
};

export default Librarypage;
