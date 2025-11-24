import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';
import { uploadImageSchema } from '../../lib/validations';
import { minioClient, ensureBucketExists } from '../../lib/minio';
import { generateRandomString } from '../../utils/helpers';

export const uploadRouter = createTRPCRouter({
  getUploadUrl: protectedProcedure
    .input(z.object({
      filename: z.string(),
      mimeType: z.string(),
      size: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { filename, mimeType, size } = input;
      
      // Dosya boyutu kontrolü (max 10MB)
      const maxSize = 10 * 1024 * 1024;
      if (size > maxSize) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Dosya boyutu çok büyük (max 10MB)',
        });
      }

      // Desteklenen dosya tiplerini kontrol et
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif'
      ];

      if (!allowedTypes.includes(mimeType)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Desteklenmeyen dosya formatı',
        });
      }

      const bucketName = process.env.MINIO_BUCKET_NAME!;
      await ensureBucketExists(bucketName);

      // Unique filename oluştur
      const extension = filename.split('.').pop();
      const uniqueFilename = `${Date.now()}-${generateRandomString(8)}.${extension}`;

      try {
        // Presigned URL oluştur
        const presignedUrl = await minioClient.presignedPutObject(
          bucketName,
          uniqueFilename,
          24 * 60 * 60 // 24 saat
        );

        // Dosya URL'sini oluştur
        const fileUrl = `${process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http'}://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${bucketName}/${uniqueFilename}`;

        return {
          uploadUrl: presignedUrl,
          fileUrl,
          filename: uniqueFilename,
        };
      } catch (error) {
        console.error('Minio upload URL error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Upload URL oluşturulamadı',
        });
      }
    }),

  confirmUpload: protectedProcedure
    .input(uploadImageSchema.extend({
      postId: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const image = await ctx.db.image.create({
        data: {
          filename: input.filename,
          originalName: input.filename,
          mimeType: input.mimeType,
          size: input.size,
          url: `${process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http'}://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${process.env.MINIO_BUCKET_NAME}/${input.filename}`,
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

      const [images, total] = await Promise.all([
        ctx.db.image.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            createdAt: 'desc',
          },
        }),
        ctx.db.image.count({ where }),
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
      const image = await ctx.db.image.findUnique({
        where: { id: input.id },
      });

      if (!image) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Resim bulunamadı',
        });
      }

      try {
        // Minio'dan sil
        await minioClient.removeObject(
          process.env.MINIO_BUCKET_NAME!,
          image.filename
        );
      } catch (error) {
        console.error('Minio delete error:', error);
      }

      // Database'den sil
      await ctx.db.image.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});