"use client";

import type React from "react";
import { useState } from "react";
import { SubjectHeader } from "@/components/subject-header";
import { api } from "@/trpc/react";
import { toast } from "sonner";

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
  const [isEditing, setIsEditing] = useState(false);

  const utils = api.useUtils();

  const updateLibrary = api.library.update.useMutation({
    onSuccess: async () => {
      toast("Updated sucessfully :3", {});
      setIsEditing(false);
      await utils.library.invalidate();
    },
    onError: (error) => {
      toast("Failed to update :(", {
        description: "Please try again or contact support.",
      });
    },
  });

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsEditing(true);
  };

  const handleSave = (name: string, description: string) => {
    updateLibrary.mutate({
      id: libraryDetail.id,
      name,
      description,
      //colorScheme: libraryDetail.colorScheme,
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <main>
      <div>
        <SubjectHeader
          name={libraryDetail.name}
          description={libraryDetail.description}
          onEdit={handleEdit}
          isEditing={isEditing}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
      <div className="px-6 pb-6">
        <p className="text-muted-foreground">Your content goes here...</p>
      </div>
    </main>
  );
};

export default LibraryHeader;
