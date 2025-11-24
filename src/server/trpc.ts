import { initTRPC, TRPCError } from '@trpc/server';
import { ZodError } from 'zod';

// Only import db at runtime, not during build
let db: any = null;
if (process.env.NODE_ENV !== 'production' || process.env.DATABASE_URL) {
  try {
    db = require('../lib/db').db;
  } catch (error) {
    console.warn('Database not available during build:', error);
  }
}

type CreateContextOptions = {
  user: any | null;
};

const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    user: opts.user,
    db,
  };
};

export const createTRPCContext = async (opts: { req: Request }) => {
  const { req } = opts;
  
  // Admin authentication check
  let user = null;
  
  // Check for admin session in cookies
  const cookies = req.headers.get('cookie');
  if (cookies && cookies.includes('admin-session=true')) {
    user = {
      id: 'admin',
      email: process.env.ADMIN_EMAIL || 'admin@greenparkpeyzaj.com',
      role: 'ADMIN',
      name: 'Admin'
    };
  }
  
  // Also check for Authorization header (for API calls)
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader === `Bearer ${process.env.ADMIN_EMAIL}:${process.env.ADMIN_PASSWORD}`) {
    user = {
      id: 'admin',
      email: process.env.ADMIN_EMAIL || 'admin@greenparkpeyzaj.com',
      role: 'ADMIN',
      name: 'Admin'
    };
  }
  
  return createInnerTRPCContext({
    user,
  });
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: undefined,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      user: ctx.user,
      db: ctx.db,
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);

const enforceUserIsAdmin = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  
  // Admin kontrolü burada yapılacak
  if (ctx.user.role !== 'ADMIN') {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }
  
  return next({
    ctx: {
      user: ctx.user,
      db: ctx.db,
    },
  });
});

export const adminProcedure = t.procedure.use(enforceUserIsAdmin);