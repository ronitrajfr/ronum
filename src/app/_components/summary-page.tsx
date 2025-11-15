"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { toast } from "sonner";

export interface SummaryPageProps {
  pageContent?: string;
  pageNumber?: number;
  paperId?: string;
  currentNotes?: any;
  onSummaryComplete?: () => void;
  onNotesUpdated?: () => void;
}

export default function SummaryPage({
  pageContent,
  pageNumber,
  paperId,
  currentNotes,
  onSummaryComplete,
  onNotesUpdated,
}: SummaryPageProps) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [summary, setSummary] = useState("");
  const [hasCompleted, setHasCompleted] = useState(false);
  const streamRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(
    null,
  );
  const upsertNoteMutation = api.paper.upsertNote.useMutation();

  const handleStreamSummary = async () => {
    if (!pageContent || !paperId) {
      toast.error("Missing page content or paper ID");
      return;
    }

    setIsStreaming(true);
    setSummary("");
    setHasCompleted(false);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 55000); // 55 second timeout

      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageContent,
          pageNumber: pageNumber || 1,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.details || `HTTP ${response.status}: Failed to summarize`,
        );
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response body");
      }

      streamRef.current = reader;
      const decoder = new TextDecoder();
      let buffer = "";
      let chunkCount = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;
        chunkCount++;

        console.log(`[v0] Stream chunk ${chunkCount}: ${chunk.length} chars`);

        setSummary((prev) => prev + chunk);
      }

      // Final flush
      const final = decoder.decode();
      if (final) {
        setSummary((prev) => prev + final);
      }

      console.log(
        `[v0] Streaming complete: ${chunkCount} chunks, total length: ${summary.length}`,
      );

      setHasCompleted(true);
      onSummaryComplete?.();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      console.error("[v0] Error streaming summary:", errorMsg);

      if (errorMsg.includes("abort")) {
        toast.error("Request timed out. Try a different page.");
      } else {
        toast.error(`Failed to generate summary: ${errorMsg}`);
      }

      setHasCompleted(true);
    } finally {
      setIsStreaming(false);
      streamRef.current = null;
    }
  };

  const handleAddToNotes = async () => {
    if (!summary || !paperId) {
      toast.error("No summary to save");
      return;
    }

    try {
      let existingContent = currentNotes;
      if (typeof existingContent === "string") {
        try {
          existingContent = JSON.parse(existingContent);
        } catch {
          existingContent = null;
        }
      }

      // Create the new summary content
      const summaryContent = [
        {
          type: "heading",
          attrs: { level: 2 },
          content: [
            {
              type: "text",
              text: `Page ${pageNumber} Summary`,
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: summary,
            },
          ],
        },
      ];

      // Merge with existing content or create new document
      const newContent = existingContent?.content
        ? {
            type: "doc",
            content: [...(existingContent.content || []), ...summaryContent],
          }
        : {
            type: "doc",
            content: summaryContent,
          };

      await upsertNoteMutation.mutateAsync({
        paperId,
        content: newContent,
      });

      toast.success("Summary added to notes");
      setSummary("");
      setHasCompleted(false);
      onNotesUpdated?.();
    } catch (error) {
      console.error(" Error adding summary to notes:", error);
      toast.error("Failed to add summary to notes");
    }
  };

  return (
    <div className="flex flex-col gap-4 border-t p-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Summary</h2>

        {/* Show query when streaming or has content */}
        {(isStreaming || summary) && (
          <p className="text-muted-foreground text-sm">
            Summarize page {pageNumber || "N/A"}
          </p>
        )}

        {/* Streaming response display */}
        {(isStreaming || summary) && (
          <div className="bg-muted/30 rounded-lg border p-4 text-sm leading-relaxed">
            {summary || (
              <span className="text-muted-foreground animate-pulse">
                Generating summary...
              </span>
            )}
          </div>
        )}

        {/* Empty state */}
        {!isStreaming && !summary && (
          <p className="text-muted-foreground text-sm">
            Click "Ask AI" from the PDF viewer to generate a summary
          </p>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleStreamSummary}
            disabled={isStreaming || !pageContent}
            className="flex-1"
            variant="default"
          >
            {isStreaming ? "Generating..." : "Generate Summary"}
          </Button>

          {hasCompleted && summary && (
            <Button
              onClick={handleAddToNotes}
              disabled={upsertNoteMutation.isPending}
              className="flex-1"
              variant="outline"
            >
              {upsertNoteMutation.isPending ? "Adding..." : "Add to Notes"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
