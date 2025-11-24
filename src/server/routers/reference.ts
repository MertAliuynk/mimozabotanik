import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';
import { db } from '../../lib/db';

export const referenceRouter = createTRPCRouter({
  // Get all published references
  getAll: publicProcedure
    .input(z.object({
      published: z.boolean().optional().default(true),
    }))
    .query(async ({ input }) => {
      const references = await db.reference.findMany({
        where: {
          published: input.published,
        },
        orderBy: {
          order: 'asc',
        },
      });
      return references;
    }),

  // Get reference by ID
  getById: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const reference = await db.reference.findUnique({
        where: {
          id: input,
        },
      });
      return reference;
    }),

  // Admin: Get all references (including unpublished)
  getAllAdmin: protectedProcedure
    .query(async ({ ctx }) => {
      // Check if user is admin
      if (ctx.user?.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }
      
      const references = await db.reference.findMany({
        orderBy: {
          order: 'asc',
        },
      });
      return references;
    }),

  // Admin: Create new reference
  create: protectedProcedure
    .input(z.object({
      companyName: z.string().min(1),
      logo: z.string().optional(),
      description: z.string().optional(),
      website: z.string().optional(),
      order: z.number().optional().default(0),
      published: z.boolean().optional().default(true),
    }))
    .mutation(async ({ input, ctx }) => {
      // Check if user is admin
      if (ctx.user?.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }
      
      const reference = await db.reference.create({
        data: {
          companyName: input.companyName,
          logo: input.logo,
          description: input.description,
          website: input.website,
          order: input.order,
          published: input.published,
        },
      });
      
      return reference;
    }),

  // Admin: Update reference
  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      companyName: z.string().min(1).optional(),
      logo: z.string().optional(),
      description: z.string().optional(),
      website: z.string().optional(),
      order: z.number().optional(),
      published: z.boolean().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Check if user is admin
      if (ctx.user?.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }
      
      const { id, ...updateData } = input;
      
      const reference = await db.reference.update({
        where: {
          id,
        },
        data: updateData,
      });
      
      return reference;
    }),

  // Admin: Delete reference
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      // Check if user is admin
      if (ctx.user?.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }
      
      await db.reference.delete({
        where: {
          id: input,
        },
      });
      
      return { success: true };
    }),

  // Admin: Update reference order
  updateOrder: protectedProcedure
    .input(z.object({
      references: z.array(z.object({
        id: z.string(),
        order: z.number(),
      })),
    }))
    .mutation(async ({ input, ctx }) => {
      // Check if user is admin
      if (ctx.user?.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }
      
      // Update all reference orders in a transaction
      await db.$transaction(
        input.references.map(reference =>
          db.reference.update({
            where: { id: reference.id },
            data: { order: reference.order },
          })
        )
      );
      
      return { success: true };
    }),
});