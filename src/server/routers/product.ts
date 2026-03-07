import { z } from 'zod';
import { createTRPCRouter, publicProcedure, adminProcedure } from '../trpc';
import { generateSlug } from '../../utils/helpers';
import { TRPCError } from '@trpc/server';
import { PrismaClient } from '@prisma/client';

type Prisma = PrismaClient;

export const productRouter = createTRPCRouter({
  // ------------------ PUBLIC ------------------
  getAll: publicProcedure
    .input(
      z.object({
        search: z.string().optional(),
        take: z.number().min(1).max(50).default(12),
        skip: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.db) return { items: [], total: 0 };

      const where: any = { published: true };
      if (input.search) {
        where.OR = [
          { name: { contains: input.search, mode: 'insensitive' } },
          { description: { contains: input.search, mode: 'insensitive' } },
        ];
      }

      const [items, total] = await Promise.all([
        (ctx.db as Prisma).product.findMany({
          where,
          include: { images: { orderBy: { order: 'asc' } } },
          take: input.take,
          skip: input.skip,
          orderBy: { createdAt: 'desc' },
        }),
        (ctx.db as Prisma).product.count({ where }),
      ]);

      return { items, total };
    }),

  getBySlug: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input: slug }) => {
      if (!ctx.db) return null;
      return (ctx.db as Prisma).product.findUnique({
        where: { slug },
        include: { images: { orderBy: { order: 'asc' } } },
      });
    }),

  // ------------------ ADMIN ------------------
  getAllAdmin: adminProcedure.query(async ({ ctx }) => {
    if (!ctx.db) return [];
    return (ctx.db as Prisma).product.findMany({
      include: { images: { orderBy: { order: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });
  }),

  getByIdAdmin: adminProcedure
    .input(z.string())
    .query(async ({ ctx, input: id }) => {
      if (!ctx.db) return null;
      return (ctx.db as Prisma).product.findUnique({
        where: { id },
        include: { images: true },
      });
    }),

  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(3),
        description: z.string().optional(),
        price: z.number().positive(),
        stock: z.number().int().min(0),
        iyzicoLink: z.string().url().optional(), // ✅ iyzico/link alanı
        images: z
          .array(
            z.object({
              filename: z.string(),
              url: z.string(),
              alt: z.string().optional(),
              order: z.number().default(0),
            })
          )
          .min(1, 'En az 1 resim zorunlu'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

      // Slug oluştur
      const slugBase = generateSlug(input.name);
      let finalSlug = slugBase;
      let counter = 1;
      while (await (ctx.db as Prisma).product.findFirst({ where: { slug: finalSlug } })) {
        finalSlug = `${slugBase}-${counter++}`;
      }

      // Ürün oluştur
      return (ctx.db as Prisma).product.create({
        data: {
          name: input.name,
          slug: finalSlug,
          description: input.description,
          price: input.price,
          stock: input.stock,
          iyzicoLink: input.iyzicoLink, // ✅ kaydediliyor
          images: {
            create: input.images.map((img) => ({
              filename: img.filename,
              url: img.url,
              alt: img.alt,
              order: img.order,
            })),
          },
        },
        include: { images: true },
      });
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(3).optional(),
        description: z.string().optional(),
        price: z.number().positive().optional(),
        stock: z.number().int().min(0).optional(),
        iyzicoLink: z.string().url().optional(), // ✅ güncellenebilir
        images: z
          .array(
            z.object({
              filename: z.string(),
              url: z.string(),
              alt: z.string().optional(),
              order: z.number(),
            })
          )
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

      const { id, images, ...data } = input;
      const updateData: any = { ...data };

      if (data.name) {
        const slugBase = generateSlug(data.name);
        updateData.slug = slugBase;
      }

      if (images) {
        await (ctx.db as Prisma).productImage.deleteMany({ where: { productId: id } });
        updateData.images = {
          create: images.map((img) => ({
            filename: img.filename,
            url: img.url,
            alt: img.alt,
            order: img.order,
          })),
        };
      }

      return (ctx.db as Prisma).product.update({
        where: { id },
        data: updateData,
        include: { images: true },
      });
    }),

  delete: adminProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: id }) => {
      if (!ctx.db) return { success: false };

      const product = await (ctx.db as Prisma).product.findUnique({
        where: { id },
        include: { images: true },
      });

      if (!product) throw new TRPCError({ code: 'NOT_FOUND' });

      await (ctx.db as Prisma).$transaction([
        (ctx.db as Prisma).productImage.deleteMany({ where: { productId: id } }),
        (ctx.db as Prisma).product.delete({ where: { id } }),
      ]);

      return { success: true };
    }),
});