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
        if (!url.startsWith("https://"))
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Only HTTPS URLs allowed",
          });

        const res = await fetch(url);
        if (
          !res.ok ||
          !res.headers.get("content-type")?.includes("application/pdf")
        ) {
          throw new Error("URL does not point to a valid PDF");
        }
        const arrayBuffer = await res.arrayBuffer();
        const maxSize = 8 * 1024 * 1024;
        if (arrayBuffer.byteLength > maxSize) {
          throw new TRPCError({
            code: "PAYLOAD_TOO_LARGE",
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

        await redis.del(`user:${ctx.session.user.id}:category:${categoryId}`);

        return newPaper;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred, please try again later.",
        });
      }
    }),

  getPaper: protectedProcedure
    .input(
      z.object({
        paperId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const getPaper = await ctx.db.paper.findFirst({
          where: {
            id: input.paperId,
            userId: ctx.session.user.id,
          },
          include: {
            notes: true,
          },
        });

        return getPaper;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred, please try again later.",
        });
      }
    }),

  upsertNote: protectedProcedure
    .input(
      z.object({
        paperId: z.string(),
        content: z.any(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const existing = await ctx.db.notes.findFirst({
          where: { paperId: input.paperId },
        });

        const result = existing
          ? await ctx.db.notes.update({
              where: { id: existing.id },
              data: { content: input.content },
            })
          : await ctx.db.notes.create({
              data: { paperId: input.paperId, content: input.content },
            });

        const paper = await ctx.db.paper.findUnique({
          where: { id: input.paperId },
          select: { categoryId: true },
        });

        if (paper) {
          await redis.del(
            `user:${ctx.session.user.id}:category:${paper.categoryId}`,
          );
        }

        return result;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not save note",
        });
      }
    }),

  updatePaper: protectedProcedure
    .input(
      z.object({
        paperId: z.string(),
        name: z.string().optional(),
        author: z.string().optional(),
        colorScheme: z.string().optional(),
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

        const { paperId, ...data } = input;

        const filteredData = Object.fromEntries(
          Object.entries(data).filter(([_, value]) => value !== undefined),
        );

        const updatedData = await ctx.db.paper.update({
          where: {
            id: paperId,
            userId: ctx.session.user.id,
          },
          data: filteredData,
        });

        const paper = await ctx.db.paper.findUnique({
          where: { id: paperId },
          select: { categoryId: true },
        });

        if (paper) {
          await redis.del(
            `user:${ctx.session.user.id}:category:${paper.categoryId}`,
          );
        }

        return updatedData;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred, please try again later.",
        });
      }
    }),

  deletePaper: protectedProcedure
    .input(
      z.object({
        paperId: z.string(),
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

        try {
          const paper = await ctx.db.paper.findUnique({
            where: { id: input.paperId },
            select: { categoryId: true },
          });

          const deletedPaper = await ctx.db.paper.delete({
            where: {
              id: input.paperId,
              userId: ctx.session.user.id,
            },
          });

          if (paper) {
            await redis.del(
              `user:${ctx.session.user.id}:category:${paper.categoryId}`,
            );
          }

          return true;
        } catch (error) {
          console.error(error);
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Record not found.",
          });
        }
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred, please try again later.",
        });
      }
    }),
});
