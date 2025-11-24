// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DB = any;
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure, adminProcedure } from '../trpc';
import { 
  createPostSchema, 
  updatePostSchema, 
  getPaginatedPostsSchema 
} from '../../lib/validations';
import { generateSlug } from '../../utils/helpers';

export const postRouter = createTRPCRouter({
  // Public endpoints
  getAll: publicProcedure
    .input(getPaginatedPostsSchema)
    .query(async ({ input, ctx }) => {
      const { page, limit, search, categoryId, published } = input;
      const skip = (page - 1) * limit;

      const where: any = {};

      if (published !== undefined) {
        where.published = published;
      }

      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (categoryId) {
        where.categoryId = categoryId;
      }

      if (!ctx.db) {
        // Build sırasında mock veri döndür
        return {
          posts: [],
          pagination: { page, limit, total: 0, totalPages: 0 },
        };
      }
      const [posts, total] = await Promise.all([
        (ctx.db as DB).post.findMany({
          where,
          skip,
          take: limit,
          include: {
            author: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
            category: true,
            tags: true,
            images: true,
            _count: {
              select: {
                images: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        }),
        (ctx.db as DB).post.count({ where }),
      ]);

      return {
        posts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input, ctx }) => {
      if (!ctx.db) return null;
      const post = await (ctx.db as DB).post.findUnique({
        where: { slug: input.slug },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          category: true,
          tags: true,
          images: true,
        },
      });

      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post bulunamadı',
        });
      }

      return post;
    }),

  getFeatured: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(20).default(5) }))
    .query(async ({ input, ctx }) => {
      if (!ctx.db) return [];
      const posts = await (ctx.db as DB).post.findMany({
        where: {
          published: true,
          featured: true,
        },
        take: input.limit,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          category: true,
          images: {
            take: 1,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return posts;
    }),

  // Protected endpoints
  create: protectedProcedure
    .input(createPostSchema)
    .mutation(async ({ input, ctx }) => {
      const slug = generateSlug(input.title);
      
      // Check if slug exists
      if (!ctx.db) return null;
      const existingPost = await (ctx.db as DB).post.findUnique({
        where: { slug },
      });

      let finalSlug = slug;
      if (existingPost) {
        finalSlug = `${slug}-${Date.now()}`;
      }

      const post = await (ctx.db as DB).post.create({
        data: {
          ...input,
          slug: finalSlug,
          authorId: ctx.user.id,
          tags: input.tagIds ? {
            connect: input.tagIds.map((id) => ({ id })),
          } : undefined,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          category: true,
          tags: true,
          images: true,
        },
      });

      return post;
    }),

  update: protectedProcedure
    .input(updatePostSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, tagIds, ...updateData } = input;

      // Check if user owns the post or is admin
      if (!ctx.db) return null;
      const existingPost = await (ctx.db as DB).post.findUnique({
        where: { id },
        select: { authorId: true },
      });

      if (!existingPost) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post bulunamadı',
        });
      }

      if (existingPost.authorId !== ctx.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Bu işlem için yetkiniz yok',
        });
      }

      // Update slug if title changed
      let slug;
      if (updateData.title) {
        slug = generateSlug(updateData.title);
        const existingSlug = await (ctx.db as DB).post.findFirst({
          where: { slug, id: { not: id } },
        });
        if (existingSlug) {
          slug = `${slug}-${Date.now()}`;
        }
      }

      const post = await (ctx.db as DB).post.update({
        where: { id },
        data: {
          ...updateData,
          ...(slug && { slug }),
          ...(tagIds && {
            tags: {
              set: [],
              connect: tagIds.map((tagId) => ({ id: tagId })),
            },
          }),
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          category: true,
          tags: true,
          images: true,
        },
      });

      return post;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { id } = input;

      if (!ctx.db) return { success: false };
      const existingPost = await (ctx.db as DB).post.findUnique({
        where: { id },
        select: { authorId: true },
      });

      if (!existingPost) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post bulunamadı',
        });
      }

      if (existingPost.authorId !== ctx.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Bu işlem için yetkiniz yok',
        });
      }

      await (ctx.db as DB).post.delete({
        where: { id },
      });

      return { success: true };
    }),

  // Admin endpoints
  getAllAdmin: adminProcedure
    .input(getPaginatedPostsSchema)
    .query(async ({ input, ctx }) => {
      const { page, limit, search } = input;
      const skip = (page - 1) * limit;

      const where: any = {};

      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (!ctx.db) {
        // Build sırasında mock veri döndür
        return {
          posts: [],
          pagination: { page, limit, total: 0, totalPages: 0 },
        };
      }
      const [posts, total] = await Promise.all([
        (ctx.db as DB).post.findMany({
          where,
          skip,
          take: limit,
          include: {
            author: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
            category: true,
            tags: true,
            _count: {
              select: {
                images: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        }),
        (ctx.db as DB).post.count({ where }),
      ]);

      return {
        posts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }),
});