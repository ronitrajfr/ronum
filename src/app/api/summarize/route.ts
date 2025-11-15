import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { pageContent, pageNumber } = await req.json();

  if (!pageContent) {
    return new Response("No page content provided", { status: 400 });
  }

  const result = streamText({
    model: openai("gpt-5-nano"),
    system:
      "You are a helpful assistant that summarizes PDF page content. Provide clear, concise summaries highlighting the key points.",
    prompt: `Please summarize the following content from page ${pageNumber}:\n\n${pageContent}`,
    maxOutputTokens: 1000,
  });

  return result.toTextStreamResponse();
}
