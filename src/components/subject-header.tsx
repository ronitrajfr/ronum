"use client";

import { PencilIcon } from "lucide-react";

interface SubjectHeaderProps {
  name: string;
  description: string | null;
  onEdit?: () => void;
}

export function SubjectHeader({
  name,
  description,
  onEdit,
}: SubjectHeaderProps) {
  return (
    <div className="w-full border-b border-amber-100 bg-amber-50 px-6 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-2 flex items-center gap-2">
          <h1 className="text-2xl font-semibold text-amber-900">{name}</h1>
          {onEdit && (
            <button
              onClick={onEdit}
              className="rounded p-1 transition-colors hover:bg-amber-100"
              aria-label="Edit title"
            >
              <PencilIcon className="h-4 w-4 text-amber-700" />
            </button>
          )}
        </div>
        <p className="text-sm leading-relaxed text-amber-700/80">
          {description}
        </p>
      </div>
    </div>
  );
}
