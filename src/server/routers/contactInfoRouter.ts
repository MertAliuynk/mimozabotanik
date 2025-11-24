import { z } from 'zod';
import { createTRPCRouter, publicProcedure, adminProcedure } from '../trpc';

export const contactInfoRouter = createTRPCRouter({
  // Get contact info (public)
  get: publicProcedure.query(async ({ ctx }) => {
    const contactInfo = await ctx.db.contactInfo.findFirst();
    
    // If no contact info exists, return default values
    if (!contactInfo) {
      return {
        id: '',
        companyName: 'GreenPark Peyzaj',
        address: 'Kızılırmak Mah. Dumlupınar Blv. Next Level Plaza 3A/11 Çankaya/Ankara',
        phone: '(+90) 552 355 75 06',
        email: 'o.yesiltas@greenparkpeyzaj.com',
        latitude: 39.9334,
        longitude: 32.8157,
        workingHours: {
          monday: { open: '09:00', close: '18:00', isOpen: true },
          tuesday: { open: '09:00', close: '18:00', isOpen: true },
          wednesday: { open: '09:00', close: '18:00', isOpen: true },
          thursday: { open: '09:00', close: '18:00', isOpen: true },
          friday: { open: '09:00', close: '18:00', isOpen: true },
          saturday: { open: '09:00', close: '16:00', isOpen: true },
          sunday: { open: '00:00', close: '00:00', isOpen: false }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }
    
    return contactInfo;
  }),

  // Update or create contact info (admin only)
  update: adminProcedure
    .input(
      z.object({
        companyName: z.string().min(1, 'Şirket ismi gerekli'),
        address: z.string().min(1, 'Adres gerekli'),
        phone: z.string().min(1, 'Telefon gerekli'),
        email: z.string().email('Geçerli email adresi gerekli'),
        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180),
        workingHours: z.object({
          monday: z.object({ open: z.string(), close: z.string(), isOpen: z.boolean() }),
          tuesday: z.object({ open: z.string(), close: z.string(), isOpen: z.boolean() }),
          wednesday: z.object({ open: z.string(), close: z.string(), isOpen: z.boolean() }),
          thursday: z.object({ open: z.string(), close: z.string(), isOpen: z.boolean() }),
          friday: z.object({ open: z.string(), close: z.string(), isOpen: z.boolean() }),
          saturday: z.object({ open: z.string(), close: z.string(), isOpen: z.boolean() }),
          sunday: z.object({ open: z.string(), close: z.string(), isOpen: z.boolean() })
        })
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if contact info exists
      const existing = await ctx.db.contactInfo.findFirst();
      
      if (existing) {
        return ctx.db.contactInfo.update({
          where: { id: existing.id },
          data: input
        });
      } else {
        return ctx.db.contactInfo.create({
          data: input
        });
      }
    }),

  // Get Google Maps embed URL
  getMapUrl: publicProcedure.query(async ({ ctx }) => {
    const contactInfo = await ctx.db.contactInfo.findFirst();
    
    if (!contactInfo) {
      // Default Ankara location
      return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3059.123!2d32.8157!3d39.9334!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z!5e0!3m2!1str!2str!4v1700000000000!5m2!1str!2str`;
    }
    
    const { latitude, longitude } = contactInfo;
    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3057.5!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z!5e0!3m2!1str!2str!4v1700000000000!5m2!1str!2str`;
  })
});