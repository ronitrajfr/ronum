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
});
