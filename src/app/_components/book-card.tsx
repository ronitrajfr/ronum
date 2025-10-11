import type * as React from "react";
import { cn } from "@/lib/utils";

type BookCardProps = {
  title: string;
  author?: string;
  tone?: "primary" | "accent" | "secondary";
  ribbon?: boolean;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const toneMap: Record<
  NonNullable<BookCardProps["tone"]>,
  { cover: string; spine: string }
> = {
  primary: {
    cover: "bg-primary text-primary-foreground",
    spine: "bg-primary/80",
  },
  accent: {
    cover: "bg-stone-200 text-accent-foreground",
    spine: "bg-stone-300",
  },
  secondary: {
    cover: "bg-secondary text-secondary-foreground",
    spine: "bg-secondary/80",
  },
};

export function BookCard({
  title,
  author,
  tone = "primary",
  ribbon = true,
  className,
  ...props
}: BookCardProps) {
  const colors = toneMap[tone];

  return (
    <article
      role="article"
      aria-label={`Book: ${title} by ${author}`}
      className={cn(
        "group relative inline-block outline-none",
        "focus-visible:ring-ring focus-visible:ring-offset-background rounded-lg focus-visible:ring-2 focus-visible:ring-offset-2",
        className,
      )}
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
        {/* Cover */}
        <div
          className={cn(
            "border-border relative h-full w-full overflow-hidden rounded-lg border shadow-lg",
            colors.cover,
          )}
        >
          {/* Spine on the left */}
          <div
            aria-hidden="true"
            className={cn(
              "border-border absolute top-0 left-0 h-full w-3 rounded-l-lg border-r",
              colors.spine,
              "shadow-inner",
            )}
          >
            {/* Decorative spine bands */}
            <span className="bg-foreground/20 absolute top-10 right-0 left-0 h-px" />
            <span className="bg-foreground/20 absolute top-24 right-0 left-0 h-px" />
            <span className="bg-foreground/20 absolute right-0 bottom-10 left-0 h-px" />
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
            className="bg-border/50 absolute top-1 right-6 left-3 h-px"
          />
          <span
            aria-hidden="true"
            className="bg-foreground/10 absolute right-6 bottom-1 left-3 h-px"
          />

          {/* Optional ribbon bookmark */}
          {ribbon && (
            <span
              aria-hidden="true"
              className={cn(
                "absolute top-0 right-7 h-12 w-3 rounded-b-sm",
                // use a strong contrasting accent derived from the cover's foreground
                "bg-primary-foreground/90 mix-blend-normal",
              )}
              style={{
                // keep it consistent across tones by anchoring to cover's foreground
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
  );
}

export default BookCard;
