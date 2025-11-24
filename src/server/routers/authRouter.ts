import { hash } from 'bcryptjs';
import { TRPCError } from '@trpc/server';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { signInSchema, signUpSchema } from '../../lib/validations';

export const authRouter = createTRPCRouter({
  signUp: publicProcedure
    .input(signUpSchema)
    .mutation(async ({ input, ctx }) => {
      const { name, email, password } = input;

      const exists = await ctx.db.user.findUnique({
        where: { email },
      });

      if (exists) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Bu email adresi zaten kullanımda',
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
        },
      });

      return user;
    }),

  signIn: publicProcedure
    .input(signInSchema)
    .mutation(async ({ input }) => {
      // NextAuth ile handle edilecek
      return { success: true };
    }),
});