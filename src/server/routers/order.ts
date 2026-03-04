import { z } from 'zod';
import { createTRPCRouter, publicProcedure, adminProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { PrismaClient } from '@prisma/client';

type Prisma = PrismaClient;

export const orderRouter = createTRPCRouter({
  // Müşteri: Sipariş oluştur
  create: publicProcedure
    .input(z.object({
      customerName: z.string().min(1, 'İsim zorunlu'),
      customerSurname: z.string().optional(),
      address: z.string().min(10, 'Adres zorunlu'),
      note: z.string().optional(),
      items: z.array(z.object({
        productId: z.string(),
        name: z.string(),
        price: z.number(),
        quantity: z.number().min(1),
      })),
      totalPrice: z.number().positive(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

      const db = ctx.db as Prisma;

      // Stok kontrolü
      for (const item of input.items) {
        const product = await db.product.findUnique({
          where: { id: item.productId },
        });

        if (!product || product.stock < item.quantity) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `${item.name} için stok yetersiz (mevcut: ${product?.stock ?? 0})`,
          });
        }
      }

      // Sipariş oluştur
      const order = await db.order.create({
        data: {
          customerName: input.customerName,
          customerSurname: input.customerSurname,
          address: input.address,
          note: input.note,
          totalPrice: input.totalPrice,
          items: {
            create: input.items.map(item => ({
              productId: item.productId,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
            })),
          },
        },
      });

      // Stok düşür
      for (const item of input.items) {
        await db.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return order;
    }),

  // Admin: Tüm siparişleri getir
  getAllAdmin: adminProcedure.query(async ({ ctx }) => {
    if (!ctx.db) return [];
    return (ctx.db as Prisma).order.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }),

  // Admin: Tek sipariş getir
  getByIdAdmin: adminProcedure
    .input(z.string())
    .query(async ({ ctx, input: id }) => {
      if (!ctx.db) return null;
      return (ctx.db as Prisma).order.findUnique({
        where: { id },
        include: { items: true },
      });
    }),

  // Admin: Status güncelle
  updateStatus: adminProcedure
    .input(z.object({
      id: z.string(),
      status: z.enum(['Bekliyor', 'Gönderildi', 'İptal Edildi']),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.db) return null;
      return (ctx.db as Prisma).order.update({
        where: { id: input.id },
        data: { status: input.status },
      });
    }),
});