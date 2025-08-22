import React from "react";
import { SubjectHeader } from "@/components/subject-header";

interface libraryDetailType {
  id: string;
  name: string;
  colorScheme: string | null;
  createdAt: Date;
  updatedAt: Date;
  description: string | null;
  userId: string;
}

const LibraryHeader = ({
  libraryDetail,
}: {
  libraryDetail: libraryDetailType;
}) => {
  return (
    <main className="w-full">
      <SubjectHeader
        name="Computer science"
        description="A description or notes about Computer science"
        onEdit={() => console.log("Edit clicked")}
      />
      <div className="p-6">
        <p className="text-muted-foreground">Your content goes here...</p>
      </div>
    </main>
  );
};

export default LibraryHeader;
