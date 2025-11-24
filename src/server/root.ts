import { createTRPCRouter } from './trpc';
import { authRouter } from './routers/authRouter';
import { postRouter } from './routers/postRouter';
import { categoryRouter } from './routers/categoryRouter';
import { uploadRouter } from './routers/uploadRouter';
import { serviceRouter } from './routers/service';
import { referenceRouter } from './routers/reference';
import { galleryRouter } from './routers/gallery';
import { serviceAreaRouter } from './routers/serviceAreaRouter';
import { contactInfoRouter } from './routers/contactInfoRouter';

export const appRouter = createTRPCRouter({
  auth: authRouter,
  post: postRouter,
  category: categoryRouter,
  upload: uploadRouter,
  service: serviceRouter,
  reference: referenceRouter,
  gallery: galleryRouter,
  serviceArea: serviceAreaRouter,
  contactInfo: contactInfoRouter,
});

export type AppRouter = typeof appRouter;