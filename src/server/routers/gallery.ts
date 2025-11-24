
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DB = any;
import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';

export const galleryRouter = createTRPCRouter({
  // Get all published galleries with images
  getAll: publicProcedure
    .input(z.object({
      published: z.boolean().optional().default(true),
    }))
    .query(async ({ input, ctx }) => {
      if (!ctx.db) return [];
      const galleries = await (ctx.db as DB).gallery.findMany({
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
    .query(async ({ input, ctx }) => {
      if (!ctx.db) return null;
      const gallery = await (ctx.db as DB).gallery.findUnique({
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
      if (!ctx.db) return [];
      if (ctx.user?.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }
      const galleries = await (ctx.db as DB).gallery.findMany({
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
      if (!ctx.db) return null;
      if (ctx.user?.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }
      const { images, ...galleryData } = input;
      const gallery = await (ctx.db as DB).gallery.create({
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
      if (!ctx.db) return null;
      if (ctx.user?.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }
      const { id, ...updateData } = input;
      const gallery = await (ctx.db as DB).gallery.update({
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
      if (!ctx.db) return { success: false };
      if (ctx.user?.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }
      await (ctx.db as DB).gallery.delete({
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
      if (!ctx.db) return null;
      if (ctx.user?.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }
      const image = await (ctx.db as DB).galleryImage.create({
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
      if (!ctx.db) return { success: false };
      if (ctx.user?.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }
      await (ctx.db as DB).galleryImage.delete({
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
      if (!ctx.db) return { success: false };
      if (ctx.user?.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }
      await (ctx.db as DB).$transaction(
        input.galleries.map(gallery =>
          (ctx.db as DB).gallery.update({
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
      if (!ctx.db) return { success: false };
      if (ctx.user?.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }
      await (ctx.db as DB).$transaction(
        input.images.map(image =>
          (ctx.db as DB).galleryImage.update({
            where: { id: image.id },
            data: { order: image.order },
          })
        )
      );
      return { success: true };
    }),
});