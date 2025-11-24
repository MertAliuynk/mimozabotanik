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
    const user = await ctx.db.user.findUnique({
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
      const user = await ctx.db.user.update({
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