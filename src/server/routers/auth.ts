// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DB = any;
import { TRPCError } from '@trpc/server';
import { hash } from 'bcryptjs';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';
import { signUpSchema, signInSchema } from '../../lib/validations';

export const authRouter = createTRPCRouter({
  signUp: publicProcedure
    .input(signUpSchema)
    .mutation(async ({ ctx, input }) => {
      const { name, email, password } = input;

      const exists = await ctx.db.user.findUnique({
        where: { email },
      });

      if (exists) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Bu email adresi zaten kullanılıyor',
        });
      }

      const hashedPassword = await hash(password, 12);

      const user = await ctx.db.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

      return {
        status: 201,
        message: 'Hesap başarıyla oluşturuldu',
        result: user,
      };
    }),

  getMe: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.db) {
      // Return mock data during build
      return {
        id: ctx.user.id,
        name: ctx.user.name || 'Admin',
        email: ctx.user.email || 'admin@example.com',
        avatar: null,
        role: ctx.user.role || 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
    
    const user = await (ctx.db as DB).user.findUnique({
      where: { id: ctx.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Kullanıcı bulunamadı',
      });
    }

    return user;
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2, 'İsim en az 2 karakter olmalıdır').optional(),
        avatar: z.string().url('Geçerli bir URL giriniz').optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // @ts-ignore
      // ctx.db build sırasında null olabiliyor, bu yüzden any olarak işaretliyoruz
      if (!ctx.db) {
        // Build sırasında mock veri döndür
        return {
          status: 200,
          message: 'Profil başarıyla güncellendi (mock)',
          result: {
            id: ctx.user.id,
            name: input.name || ctx.user.name || 'Admin',
            email: ctx.user.email || 'admin@example.com',
            avatar: input.avatar || null,
            role: ctx.user.role || 'ADMIN',
            updatedAt: new Date(),
          },
        };
      }

      const user = await (ctx.db as DB).user.update({
        where: { id: ctx.user.id },
        data: input,
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          role: true,
          updatedAt: true,
        },
      });

      return {
        status: 200,
        message: 'Profil başarıyla güncellendi',
        result: user,
      };
    }),
});