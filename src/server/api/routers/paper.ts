import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "@/lib/redis";
import { getIp } from "@/lib/ip";
import { headers } from "next/headers";
import { TRPCError } from "@trpc/server";
import { PDFDocument } from "pdf-lib";

const postRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "30 s"),
  analytics: true,
});

export const paperRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        categoryId: z.string(),
        url: z.string().url(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const headersList = await headers();
        const ip = getIp(headersList);
        const { success } = await postRateLimit.limit(ip);

        if (!success) {
          throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: "Too many requests",
          });
        }

        const { categoryId, url } = input;
        if (!url.startsWith("https://") || url.includes("localhost"))
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Only HTTPS URLs allowed",
          });

        const res = await fetch(url);
        if (!res.ok || !res.headers.get("content-type")?.includes("pdf")) {
          throw new Error("URL does not point to a valid PDF");
        }
        const arrayBuffer = await res.arrayBuffer();
        const maxSize = 8 * 1024 * 1024; // 8 MB
        if (arrayBuffer.byteLength > maxSize) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "PDF too large (max 8MB)",
          });
        }
        const pdfDoc = await PDFDocument.load(arrayBuffer);

        const metadata = {
          name: pdfDoc.getTitle(),
          author: pdfDoc.getAuthor(),
        };

        const newPaper = await ctx.db.paper.create({
          data: {
            url,
            name: metadata.name || "untitled",
            author: metadata.author || null,
            categoryId,
            userId: ctx.session.user.id,
          },
        });

        return newPaper;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred, please try again later.",
        });
      }
    }),
});
