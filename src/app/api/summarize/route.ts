import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export const maxDuration = 60;

function sanitizeContent(content: string): string {
  return content
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "") // Remove control characters
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim();
}

function truncateContent(content: string, maxChars: number = 4000): string {
  if (content.length <= maxChars) return content;
  return content.substring(0, maxChars) + "...[content truncated]";
}

export async function POST(req: Request) {
  try {
    const { pageContent, pageNumber } = await req.json();

    if (!pageContent || typeof pageContent !== "string") {
      return new Response(
        JSON.stringify({ error: "No valid page content provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const sanitized = sanitizeContent(pageContent);
    const truncated = truncateContent(sanitized);

    console.log(
      `ERROR: Summarizing page ${pageNumber}: ${sanitized.length} chars (truncated to ${truncated.length})`,
    );

    const result = streamText({
      model: openai("gpt-5-nano-2025-08-07"),
      system:
        "You are a helpful assistant that summarizes PDF page content. Provide clear, concise summaries highlighting the key points.",
      prompt: `Please summarize the following content from page ${pageNumber}:\n\n${truncated}`,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("ERROR: Summarize API error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return new Response(
      JSON.stringify({
        error: "Failed to generate summary",
        details: errorMessage,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
