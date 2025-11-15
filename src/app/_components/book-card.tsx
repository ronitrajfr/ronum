"use client";

import type * as React from "react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Edit2 } from "lucide-react";
import ColorPickerModal from "./color-scheme-selector";

type BookCardProps = {
  paperId: string;
  title: string;
  author?: string;
  paperColor?: string;
  ribbon?: boolean;
  className?: string;
  onColorChange?: (color: string) => void;
  editable?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

const getSoftGradient = (color: string) => {
  if (color.startsWith("#")) {
    return `linear-gradient(135deg, ${color}40 0%, ${color}20 50%, rgba(255,255,255,0.9) 100%)`;
  }
  return `linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0.1) 50%, rgba(255,255,255,0.9) 100%)`;
};

export function BookCard({
  title,
  author,
  paperId,
  paperColor = "#f3f4f6",
  ribbon = true,
  className,
  onColorChange,
  editable = false,
  ...props
}: BookCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const gradient = getSoftGradient(paperColor);

  return (
    <>
      <article
        role="article"
        aria-label={`Book: ${title} by ${author}`}
        className={cn(
          "group relative inline-block cursor-pointer outline-none",
          "focus-visible:ring-ring focus-visible:ring-offset-background rounded-lg focus-visible:ring-2 focus-visible:ring-offset-2",
          className,
        )}
        onClick={(e) => {
          window.location.href = `/reader/${paperId}`;
        }}
        style={{ perspective: "1200px" }}
        tabIndex={0}
        {...props}
      >
        <div
          className={cn(
            "relative h-72 w-48 sm:h-80 sm:w-70",
            "origin-left transition-transform duration-500 ease-out",
            "[transform:rotateY(0deg)] group-hover:[transform:rotateY(-8deg)]",
          )}
        >
          {/* Cover with soft gradient */}
          <div
            className={cn(
              "border-border relative h-full w-full overflow-hidden rounded-lg border shadow-lg",
              "text-slate-800",
            )}
            style={{
              background: gradient,
            }}
          >
            {/* Spine on the left */}
            <div
              aria-hidden="true"
              className={cn(
                "border-border absolute top-0 left-0 h-full w-3 rounded-l-lg border-r",
                "shadow-inner",
              )}
              style={{
                backgroundColor: "rgba(0,0,0,0.1)",
              }}
            >
              {/* Decorative spine bands */}
              <span className="bg-foreground/10 absolute top-10 right-0 left-0 h-px" />
              <span className="bg-foreground/10 absolute top-24 right-0 left-0 h-px" />
              <span className="bg-foreground/10 absolute right-0 bottom-10 left-0 h-px" />
            </div>

            {/* Page block on the right */}
            <div
              aria-hidden="true"
              className={cn(
                "border-border absolute top-2 right-0 bottom-2 w-5 rounded-r-md border-l",
                "bg-card",
              )}
            >
              {/* Subtle "page lines" */}
              <div className="relative h-full w-full">
                <span className="bg-border/60 absolute inset-y-0 left-1 w-px" />
                <span className="bg-border/50 absolute inset-y-0 left-2.5 w-px" />
                <span className="bg-border/60 absolute inset-y-0 left-4 w-px" />
              </div>
            </div>

            {/* Top/Bottom edges */}
            <span
              aria-hidden="true"
              className="bg-foreground/5 absolute top-1 right-6 left-3 h-px"
            />
            <span
              aria-hidden="true"
              className="bg-foreground/5 absolute right-6 bottom-1 left-3 h-px"
            />

            {/* Optional ribbon bookmark */}
            {ribbon && (
              <span
                aria-hidden="true"
                className="absolute top-0 right-7 h-12 w-3 rounded-b-sm bg-white opacity-60 mix-blend-normal"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%)",
                }}
              />
            )}

            {/* Content area */}
            <div className="relative z-10 flex h-full flex-col justify-center gap-2 px-6 pr-10">
              <h3 className="text-lg leading-snug font-semibold text-balance sm:text-xl">
                {title}
              </h3>
              {author && (
                <p className="text-sm opacity-80 sm:text-base">by {author}</p>
              )}
            </div>

            {editable && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setIsModalOpen(true);
                }}
                className="absolute bottom-3 left-1/2 z-20 -translate-x-1/2 transform cursor-pointer rounded-full border border-slate-200 bg-white/95 px-4 py-2 text-sm font-medium text-slate-800 shadow-lg transition-all hover:border-slate-300 hover:bg-white"
                aria-label="Edit book color"
              >
                <Edit2 className="mr-1 inline h-4 w-4" />
                Edit Color
              </button>
            )}
          </div>

          {/* Drop shadow under the book */}
          <div
            aria-hidden="true"
            className={cn(
              "absolute right-4 -bottom-3 left-4 h-4 rounded-full",
              "bg-foreground/10 blur-md transition-all duration-500",
              "group-hover:translate-x-1 group-hover:translate-y-0.5 group-hover:blur-lg",
            )}
          />
        </div>
      </article>

      <ColorPickerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentColor={paperColor}
        onColorSelect={(color: string) => {
          onColorChange?.(color);
          setIsModalOpen(false);
        }}
      />
    </>
  );
}

export default BookCard;
