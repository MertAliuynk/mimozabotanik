import { createTRPCRouter, publicProcedure } from '@/server/trpc';
import { z } from 'zod';
import { db } from '@/lib/db';

export const orderRouter = createTRPCRouter({
  // Sipariş oluştur (ürün seçildiğinde)
  create: publicProcedure
    .input(
      z.object({
        customerName: z.string().optional(),
        customerSurname: z.string().optional(),
        address: z.string().optional(),
        note: z.string().optional(),
        items: z.array(
          z.object({
            productId: z.string(),
            name: z.string(),
            price: z.number(),
            quantity: z.number(),
          })
        ),
        totalPrice: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const order = await db.order.create({
        data: {
          customerName: input.customerName || '',
          customerSurname: input.customerSurname || '',
          address: input.address || '',
          note: input.note || '',
          totalPrice: input.totalPrice,
          items: {
            create: input.items.map((item) => ({
              productId: item.productId,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
            })),
          },
        },
        include: {
          items: true,
        },
      });
      return order;
    }),

  // Sipariş ID ile getir (odeme sayfası için)
  getById: publicProcedure.input(z.string()).query(({ input }) => {
    return db.order.findUnique({
      where: { id: input },
      include: {
        items: {
          include: {
            product: true, // iyzicoLink için
          },
        },
      },
    });
  }),

  // Sipariş durumu güncelle
  updateStatus: publicProcedure
    .input(z.object({ id: z.string(), status: z.string() }))
    .mutation(({ input }) => {
      return db.order.update({
        where: { id: input.id },
        data: { status: input.status },
      });
    }),
});