import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const researchPaperRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const existingLibrary = await ctx.db.library.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      });

      if (!existingLibrary) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This library doesn't exist",
        });
      }

      const allPapers = await ctx.db.researchPaper.findMany({
        where: {
          libraryId: existingLibrary.id,
        },
      });

      return allPapers;
    }),

  getSinglePaper: protectedProcedure
    .input(
      z.object({
        researchPaperId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { researchPaperId } = input;

      const paper = await ctx.db.researchPaper.findFirst({
        where: {
          id: researchPaperId,
          library: {
            userId: ctx.session.user.id,
          },
        },
      });

      if (!paper) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This Paper doesn't exist",
        });
      }

      return paper;
    }),

  createResearchPaper: protectedProcedure
    .input(
      z.object({
        libraryId: z.string(),
        url: z.string().url(),
        name: z.string().optional(),
        author: z.string().optional(),
        colorScheme: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { url, name, author, colorScheme, libraryId } = input;

      const existingLibrary = await ctx.db.library.findFirst({
        where: {
          id: libraryId,
          userId: ctx.session.user.id,
        },
      });

      if (!existingLibrary) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This Library doesn't exist",
        });
      }

      const newPaper = await ctx.db.researchPaper.create({
        data: {
          libraryId: existingLibrary.id,
          url,
          ...(name && { name }),
          ...(colorScheme && { colorScheme }),
          ...(author && { author }),
        },
      });

      return newPaper;
    }),

  update: protectedProcedure
    .input(
      z.object({
        researchPaperId: z.string(),
        name: z.string().optional(),
        author: z.string().optional(),
        colorScheme: z.string().optional(),
        url: z.string().url().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { researchPaperId, name, author, colorScheme, url } = input;

      // Check if paper exists and belongs to the logged-in user
      const existingPaper = await ctx.db.researchPaper.findFirst({
        where: {
          id: researchPaperId,
          library: {
            userId: ctx.session.user.id,
          },
        },
      });

      if (!existingPaper) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This Research Paper doesn't exist",
        });
      }

      // Update paper
      const updatedPaper = await ctx.db.researchPaper.update({
        where: { id: researchPaperId },
        data: {
          ...(name !== undefined && { name }),
          ...(author !== undefined && { author }),
          ...(colorScheme !== undefined && { colorScheme }),
          ...(url !== undefined && { url }),
        },
      });

      return updatedPaper;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        researchPaperId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { researchPaperId } = input;

      const existingPaper = await ctx.db.researchPaper.findFirst({
        where: {
          id: researchPaperId,
          library: {
            userId: ctx.session.user.id,
          },
        },
      });

      if (!existingPaper) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This Research Paper doesn't exist",
        });
      }

      await ctx.db.researchPaper.delete({
        where: { id: researchPaperId },
      });

      return { success: true, message: "Research Paper deleted successfully" };
    }),
});
