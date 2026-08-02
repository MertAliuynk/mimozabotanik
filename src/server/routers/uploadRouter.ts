// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DB = any;
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { uploadImageSchema } from '../../lib/validations';
import { deleteUploadedFile, UPLOAD_URL_PREFIX } from '../../lib/upload';

export const uploadRouter = createTRPCRouter({
  confirmUpload: protectedProcedure
    .input(uploadImageSchema.extend({
      postId: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const url = `${UPLOAD_URL_PREFIX}/${input.filename}`;

      if (!ctx.db) {
        // Build sırasında mock veri döndür
        return {
          filename: input.filename,
          originalName: input.filename,
          mimeType: input.mimeType,
          size: input.size,
          url,
          alt: input.alt,
          postId: input.postId,
        };
      }
      const image = await (ctx.db as DB).image.create({
        data: {
          filename: input.filename,
          originalName: input.filename,
          mimeType: input.mimeType,
          size: input.size,
          url,
          alt: input.alt,
          postId: input.postId,
        },
      });

      return image;
    }),

  getImages: protectedProcedure
    .input(z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(50).default(20),
      postId: z.string().optional(),
    }))
    .query(async ({ input, ctx }) => {
      const { page, limit, postId } = input;
      const skip = (page - 1) * limit;

      const where: any = {};
      if (postId) {
        where.postId = postId;
      }

      if (!ctx.db) {
        // Build sırasında mock veri döndür
        return {
          images: [],
          pagination: { page, limit, total: 0, totalPages: 0 },
        };
      }
      const [images, total] = await Promise.all([
        (ctx.db as DB).image.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            createdAt: 'desc',
          },
        }),
        (ctx.db as DB).image.count({ where }),
      ]);

      return {
        images,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }),

  deleteImage: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.db) return { success: false };
      const image = await (ctx.db as DB).image.findUnique({
        where: { id: input.id },
      });

      if (!image) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Resim bulunamadı',
        });
      }

      try {
        await deleteUploadedFile(image.filename);
      } catch (error) {
        console.error('Local file delete error:', error);
      }

      // Database'den sil
      await (ctx.db as DB).image.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});
