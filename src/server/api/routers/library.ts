import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const libraryRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        colorScheme: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { name, colorScheme } = input;

      const newLibrary = await ctx.db.library.create({
        data: {
          name,
          colorScheme,
          user: { connect: { id: ctx.session.user.id } },
        },
      });

      return newLibrary;
    }),

  getAllLibraries: protectedProcedure.query(async ({ ctx }) => {
    const allLibraries = await ctx.db.library.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });

    return allLibraries;
  }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      const existingLibrary = await ctx.db.library.findFirst({
        where: {
          id,
          userId: ctx.session.user.id,
        },
      });

      if (!existingLibrary) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This library doesn't exist",
        });
      }

      const deletedPost = await ctx.db.library.deleteMany({
        where: {
          id,
          userId: ctx.session.user.id,
        },
      });

      return deletedPost;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        colorScheme: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, name, colorScheme } = input;

      const existingLibrary = await ctx.db.library.findFirst({
        where: {
          id,
          userId: ctx.session.user.id,
        },
      });

      if (!existingLibrary) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This library doesn't exist",
        });
      }

      const updatedLibrary = await ctx.db.library.updateMany({
        where: { id, userId: ctx.session.user.id },
        data: {
          ...(name && { name }),
          ...(colorScheme && { colorScheme }),
        },
      });

      return updatedLibrary;
    }),
});
