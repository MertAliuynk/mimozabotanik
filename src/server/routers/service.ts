
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DB = any;
import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';

export const serviceRouter = createTRPCRouter({
  // Get all published services
  getAll: publicProcedure
    .input(z.object({
      published: z.boolean().optional().default(true),
    }))
    .query(async ({ input, ctx }) => {
      if (!ctx.db) return [];
      const services = await (ctx.db as DB).service.findMany({
        where: {
          published: input.published,
        },
        include: {
          images: true,
        },
        orderBy: {
          order: 'asc',
        },
      });
      return services;
    }),

  // Get service by ID
  getById: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      if (!ctx.db) return null;
      const service = await (ctx.db as DB).service.findUnique({
        where: {
          id: input,
        },
        include: {
          images: true,
        },
      });
      return service;
    }),

  // Admin: Get all services (including unpublished)
  getAllAdmin: protectedProcedure
    .query(async ({ ctx }) => {
      if (!ctx.db) return [];
      if (ctx.user.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }
      const services = await (ctx.db as DB).service.findMany({
        include: {
          images: true,
        },
        orderBy: {
          order: 'asc',
        },
      });
      return services;
    }),

  // Admin: Create new service
  create: protectedProcedure
    .input(z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      image: z.string().optional(),
      category: z.string().optional(),
      order: z.number().optional().default(0),
      published: z.boolean().optional().default(true),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.db) return null;
      if (ctx.user.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }
      const service = await (ctx.db as DB).service.create({
        data: {
          title: input.title,
          description: input.description,
          image: input.image,
          category: input.category,
          order: input.order,
          published: input.published,
        },
        include: {
          images: true,
        },
      });
      return service;
    }),

  // Admin: Update service
  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().min(1).optional(),
      description: z.string().optional(),
      image: z.string().optional(),
      category: z.string().optional(),
      order: z.number().optional(),
      published: z.boolean().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.db) return null;
      if (ctx.user.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }
      const { id, ...updateData } = input;
      const service = await (ctx.db as DB).service.update({
        where: {
          id,
        },
        data: updateData,
        include: {
          images: true,
        },
      });
      return service;
    }),

  // Admin: Delete service
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      if (!ctx.db) return { success: false };
      if (ctx.user.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }
      await (ctx.db as DB).service.delete({
        where: {
          id: input,
        },
      });
      return { success: true };
    }),

  // Admin: Update service order
  updateOrder: protectedProcedure
    .input(z.object({
      services: z.array(z.object({
        id: z.string(),
        order: z.number(),
      })),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.db) return { success: false };
      if (ctx.user.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }
      await (ctx.db as DB).$transaction(
        input.services.map(service =>
          (ctx.db as DB).service.update({
            where: { id: service.id },
            data: { order: service.order },
          })
        )
      );
      return { success: true };
    }),
});