"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { PencilIcon, CheckIcon, XIcon } from "lucide-react";

interface SubjectHeaderProps {
  name: string;
  description: string | null;
  onEdit?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isEditing?: boolean;
  onSave?: (name: string, description: string) => void;
  onCancel?: () => void;
}

export function SubjectHeader({
  name,
  description,
  onEdit,
  isEditing = false,
  onSave,
  onCancel,
}: SubjectHeaderProps) {
  const [editName, setEditName] = useState(name);
  const [editDescription, setEditDescription] = useState(description || "");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSave?.(editName, editDescription);
    }
    if (e.key === "Escape") {
      onCancel?.();
    }
  };

  useEffect(() => {
    if (isEditing) {
      setEditName(name);
      setEditDescription(description || "");
    }
  }, [isEditing, name, description]);

  return (
    <div className="border-b py-4">
      <div className="max-w-3xl p-6">
        <div className="mb-2 flex items-center gap-2">
          {isEditing ? (
            <div className="flex flex-1 items-center gap-2">
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={handleKeyDown}
                className="fontSpecial w-full border-none bg-transparent text-4xl font-bold tracking-wider text-stone-800 outline-none"
                style={{
                  border: "none",
                  outline: "none",
                  boxShadow: "none",
                  padding: 0,
                  margin: 0,
                  background: "transparent",
                }}
                autoFocus
              />
              <button
                onClick={() => onSave?.(editName, editDescription)}
                className="cursor-pointer rounded-full border p-2 text-green-600 transition-colors hover:bg-green-100"
                aria-label="Save changes"
              >
                <CheckIcon className="h-4 w-4" />
              </button>
              <button
                onClick={onCancel}
                className="cursor-pointer rounded-full border p-2 text-red-600 transition-colors hover:bg-red-100"
                aria-label="Cancel editing"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <h1 className="fontSpecial text-4xl font-bold tracking-wider text-stone-800">
                {name}
              </h1>
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="cursor-pointer rounded-full border p-2 transition-colors hover:bg-stone-100"
                  aria-label="Edit title"
                >
                  <PencilIcon className="h-4 w-4 text-stone-800" />
                </button>
              )}
            </>
          )}
        </div>
        {isEditing ? (
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            className="text-md w-full resize-none border-none bg-transparent leading-relaxed font-medium text-stone-700/80 outline-none"
            style={{
              border: "none",
              outline: "none",
              boxShadow: "none",
              padding: 0,
              margin: 0,
              background: "transparent",
              minHeight: "auto",
            }}
            placeholder="Enter description..."
            rows={2}
          />
        ) : (
          <p className="text-md leading-relaxed font-medium text-stone-700/80">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
