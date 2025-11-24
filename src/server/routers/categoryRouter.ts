import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';
import { createCategorySchema } from '../../lib/validations';
import { generateSlug } from '../../utils/helpers';

export const categoryRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const categories = await ctx.db.category.findMany({
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return categories;
  }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input, ctx }) => {
      const category = await ctx.db.category.findUnique({
        where: { slug: input.slug },
        include: {
          posts: {
            where: { published: true },
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  avatar: true,
                },
              },
              images: {
                take: 1,
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
          _count: {
            select: {
              posts: true,
            },
          },
        },
      });

      if (!category) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Kategori bulunamadı',
        });
      }

      return category;
    }),

  create: protectedProcedure
    .input(createCategorySchema)
    .mutation(async ({ input, ctx }) => {
      const slug = generateSlug(input.name);

      const existingCategory = await ctx.db.category.findFirst({
        where: {
          OR: [
            { name: input.name },
            { slug },
          ],
        },
      });

      if (existingCategory) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Bu kategori adı zaten kullanımda',
        });
      }

      const category = await ctx.db.category.create({
        data: {
          ...input,
          slug,
        },
      });

      return category;
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().min(1).optional(),
      description: z.string().optional(),
      color: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { id, ...updateData } = input;

      let slug;
      if (updateData.name) {
        slug = generateSlug(updateData.name);
        
        const existingCategory = await ctx.db.category.findFirst({
          where: {
            OR: [
              { name: updateData.name },
              { slug },
            ],
            id: { not: id },
          },
        });

        if (existingCategory) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Bu kategori adı zaten kullanımda',
          });
        }
      }

      const category = await ctx.db.category.update({
        where: { id },
        data: {
          ...updateData,
          ...(slug && { slug }),
        },
      });

      return category;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { id } = input;

      const category = await ctx.db.category.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              posts: true,
            },
          },
        },
      });

      if (!category) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Kategori bulunamadı',
        });
      }

      if (category._count.posts > 0) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Bu kategoride post bulunduğu için silinemez',
        });
      }

      await ctx.db.category.delete({
        where: { id },
      });

      return { success: true };
    }),
});