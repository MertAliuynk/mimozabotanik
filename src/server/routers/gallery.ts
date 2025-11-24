import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';
import { db } from '../../lib/db';

export const galleryRouter = createTRPCRouter({
  // Get all published galleries with images
  getAll: publicProcedure
    .input(z.object({
      published: z.boolean().optional().default(true),
    }))
    .query(async ({ input }) => {
      const galleries = await db.gallery.findMany({
        where: {
          published: input.published,
        },
        include: {
          images: {
            orderBy: {
              order: 'asc',
            },
          },
        },
        orderBy: {
          order: 'asc',
        },
      });
      return galleries;
    }),

  // Get gallery by ID with images
  getById: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const gallery = await db.gallery.findUnique({
        where: {
          id: input,
        },
        include: {
          images: {
            orderBy: {
              order: 'asc',
            },
          },
        },
      });
      return gallery;
    }),

  // Admin: Get all galleries (including unpublished)
  getAllAdmin: protectedProcedure
    .query(async ({ ctx }) => {
      // Check if user is admin
      if (ctx.user?.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }
      
      const galleries = await db.gallery.findMany({
        include: {
          images: {
            orderBy: {
              order: 'asc',
            },
          },
        },
        orderBy: {
          order: 'asc',
        },
      });
      return galleries;
    }),

  // Admin: Create new gallery
  create: protectedProcedure
    .input(z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      order: z.number().optional().default(0),
      published: z.boolean().optional().default(true),
      images: z.array(z.object({
        url: z.string(),
        alt: z.string().optional(),
        order: z.number().optional().default(0),
      })).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Check if user is admin
      if (ctx.user?.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }
      
      const { images, ...galleryData } = input;
      
      const gallery = await db.gallery.create({
        data: {
          ...galleryData,
          images: images ? {
            create: images.map((image, index) => ({
              url: image.url,
              alt: image.alt,
              order: image.order ?? index,
            }))
          } : undefined,
        },
        include: {
          images: {
            orderBy: {
              order: 'asc',
            },
          },
        },
      });
      
      return gallery;
    }),

  // Admin: Update gallery
  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().min(1).optional(),
      description: z.string().optional(),
      order: z.number().optional(),
      published: z.boolean().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Check if user is admin
      if (ctx.user?.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }
      
      const { id, ...updateData } = input;
      
      const gallery = await db.gallery.update({
        where: {
          id,
        },
        data: updateData,
        include: {
          images: {
            orderBy: {
              order: 'asc',
            },
          },
        },
      });
      
      return gallery;
    }),

  // Admin: Delete gallery
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      // Check if user is admin
      if (ctx.user?.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }
      
      await db.gallery.delete({
        where: {
          id: input,
        },
      });
      
      return { success: true };
    }),

  // Admin: Add image to gallery
  addImage: protectedProcedure
    .input(z.object({
      galleryId: z.string(),
      url: z.string(),
      alt: z.string().optional(),
      order: z.number().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Check if user is admin
      if (ctx.user?.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }
      
      const image = await db.galleryImage.create({
        data: {
          galleryId: input.galleryId,
          url: input.url,
          alt: input.alt,
          order: input.order ?? 0,
        },
      });
      
      return image;
    }),

  // Admin: Remove image from gallery
  removeImage: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      // Check if user is admin
      if (ctx.user?.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }
      
      await db.galleryImage.delete({
        where: {
          id: input,
        },
      });
      
      return { success: true };
    }),

  // Admin: Update gallery order
  updateOrder: protectedProcedure
    .input(z.object({
      galleries: z.array(z.object({
        id: z.string(),
        order: z.number(),
      })),
    }))
    .mutation(async ({ input, ctx }) => {
      // Check if user is admin
      if (ctx.user?.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }
      
      // Update all gallery orders in a transaction
      await db.$transaction(
        input.galleries.map(gallery =>
          db.gallery.update({
            where: { id: gallery.id },
            data: { order: gallery.order },
          })
        )
      );
      
      return { success: true };
    }),

  // Admin: Update image order within gallery
  updateImageOrder: protectedProcedure
    .input(z.object({
      images: z.array(z.object({
        id: z.string(),
        order: z.number(),
      })),
    }))
    .mutation(async ({ input, ctx }) => {
      // Check if user is admin
      if (ctx.user?.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }
      
      // Update all image orders in a transaction
      await db.$transaction(
        input.images.map(image =>
          db.galleryImage.update({
            where: { id: image.id },
            data: { order: image.order },
          })
        )
      );
      
      return { success: true };
    }),
});