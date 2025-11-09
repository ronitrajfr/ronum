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
      const cachedKey = `category:${ctx.session.user.id}`;

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

        await redis.del(cachedKey);

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
      const cachedKey = `category:${ctx.session.user.id}`;

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
        const deletedCategory = await ctx.db.category.deleteMany({
          where: {
            id: categoryId,
            userId: ctx.session.user.id,
          },
        });

        await redis.del(cachedKey);

        return "successfully deleted";
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred, please try again later.",
        });
      }
    }),

  getAllCategory: protectedProcedure.query(async ({ ctx }) => {
    try {
      const cachedKey = `category:${ctx.session.user.id}`;

      const cachedData: string | null = await redis.get(cachedKey);

      if (cachedData) {
        try {
          return JSON.parse(cachedData);
        } catch {
          await redis.del(cachedKey);
        }
      }

      const allPosts = await ctx.db.category.findMany({
        where: {
          userId: ctx.session.user.id,
        },
      });

      await redis.set(cachedKey, JSON.stringify(allPosts), { ex: 300 });

      return allPosts;
    } catch (error) {
      console.error(error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred, please try again later.",
      });
    }
  }),

  getCategoryInfoById: protectedProcedure
    .input(
      z.object({
        categoryId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { categoryId } = input;
      const cachedKey = `user:${ctx.session.user.id}:category:${categoryId}`;

      try {
        // 1️⃣ Try loading from Redis
        const cachedData = await redis.get(cachedKey);
        if (cachedData) {
          console.log("✅ Loaded category from cache");
          try {
            return JSON.parse(cachedData as string);
          } catch (err) {
            console.warn("⚠️ Invalid JSON in cache, clearing key:", cachedKey);
            await redis.del(cachedKey);
          }
        }

        console.log("⚡ No cache, fetching from DB");

        // 2️⃣ Fetch from DB
        const categoryInfo = await ctx.db.category.findFirst({
          where: {
            id: categoryId,
            userId: ctx.session.user.id,
          },
          include: {
            paper: true,
          },
        });

        // 3️⃣ Cache result for 5 minutes (300 sec)
        await redis.set(cachedKey, JSON.stringify(categoryInfo), { ex: 300 });

        return categoryInfo;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred, please try again later.",
        });
      }
    }),

  updateCategory: protectedProcedure
    .input(
      z.object({
        categoryId: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        colorScheme: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { categoryId, ...data } = input;

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
        const filteredData = Object.fromEntries(
          Object.entries(data).filter(([_, value]) => value !== undefined),
        );
        const updatedData = await ctx.db.category.update({
          where: {
            id: categoryId,
            userId: ctx.session.user.id,
          },
          data: filteredData,
        });

        await redis.del(`category:${ctx.session.user.id}`);
        await redis.del(`user:${ctx.session.user.id}:category:${categoryId}`);

        return updatedData;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred, please try again later.",
        });
      }
    }),
});
