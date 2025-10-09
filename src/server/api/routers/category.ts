import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "@/lib/redis";
import { getIp } from "@/lib/ip";
import { headers } from "next/headers";
import { TRPCError } from "@trpc/server";

// allow 10 requests per 30 sec
const postRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "30 s"),
  analytics: true,
});

export const categoryRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        colorScheme: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const headersList = await headers();
      const ip = getIp(headersList);
      const { success } = await postRateLimit.limit(ip);

      if (!success) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many requests",
        });
      }
      const { name, description, colorScheme } = input;

      try {
        const newCategory = await ctx.db.category.create({
          data: {
            name,
            description,
            colorScheme,
            userId: ctx.session.user.id,
          },
        });

        return newCategory;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred, please try again later.",
        });
      }
    }),

  deleteCategory: protectedProcedure
    .input(
      z.object({
        categoryId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const headersList = await headers();
      const ip = getIp(headersList);
      const { success } = await postRateLimit.limit(ip);

      if (!success) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many requests",
        });
      }
      const { categoryId } = input;

      try {
        const deletedCategory = await ctx.db.category.delete({
          where: {
            id: categoryId,
            userId: ctx.session.user.id,
          },
        });

        return "successfully deleted";
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred, please try again later.",
        });
      }
    }),
});
