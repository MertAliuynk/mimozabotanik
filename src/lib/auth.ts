import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/config';

export const getServerAuthSession = () => {
  return getServerSession(authOptions);
};

export const requireAuth = async () => {
  const session = await getServerAuthSession();
  
  if (!session || !session.user) {
    throw new Error('Unauthorized');
  }
  
  return session;
};

export const requireAdmin = async () => {
  const session = await requireAuth();
  
  if (session.user.role !== 'ADMIN') {
    throw new Error('Admin access required');
  }
  
  return session;
};