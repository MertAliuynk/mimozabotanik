'use client';

import { createTRPCReact } from '@trpc/react-query';
import { type AppRouter } from '../server/root';

export const trpc = createTRPCReact<AppRouter>();

// Re-export the api from providers for compatibility
export { api as trpcClient } from './providers';