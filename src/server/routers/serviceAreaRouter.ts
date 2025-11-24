// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DB = any;
import { z } from 'zod';
import { createTRPCRouter, publicProcedure, adminProcedure } from '../trpc';

export const serviceAreaRouter = createTRPCRouter({
  // Get all published service areas
  getAll: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.db) return [];
    return (ctx.db as DB).serviceArea.findMany({
      where: { published: true },
      orderBy: { order: 'asc' }
    });
  }),

  // Get all service areas for admin
  getAllAdmin: adminProcedure.query(async ({ ctx }) => {
    if (!ctx.db) return [];
    return (ctx.db as DB).serviceArea.findMany({
      orderBy: { order: 'asc' }
    });
  }),

  // Create new service area
  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1, 'İsim gerekli'),
        image: z.string().min(1, 'Resim gerekli'),
        order: z.number().default(0),
        published: z.boolean().default(true)
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.db) return null;
      return (ctx.db as DB).serviceArea.create({
        data: input
      });
    }),

  // Update service area
  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1, 'İsim gerekli'),
        image: z.string().min(1, 'Resim gerekli'),
        order: z.number().default(0),
        published: z.boolean().default(true)
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      if (!ctx.db) return null;
      return (ctx.db as DB).serviceArea.update({
        where: { id },
        data
      });
    }),

  // Delete service area
  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.db) return null;
      return (ctx.db as DB).serviceArea.delete({
        where: { id: input.id }
      });
    }),

  // Get single service area
  getById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.db) return null;
      return (ctx.db as DB).serviceArea.findUnique({
        where: { id: input.id }
      });
    })
});