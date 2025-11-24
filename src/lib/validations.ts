import { z } from 'zod';

// Auth Schemas
export const signInSchema = z.object({
  email: z.string().email('Geçerli bir email adresi giriniz'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
});

export const signUpSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır'),
  email: z.string().email('Geçerli bir email adresi giriniz'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
});

// Post Schemas
export const createPostSchema = z.object({
  title: z.string().min(1, 'Başlık zorunludur'),
  description: z.string().optional(),
  content: z.string().optional(),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  categoryId: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
});

export const updatePostSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Başlık zorunludur').optional(),
  description: z.string().optional(),
  content: z.string().optional(),
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
  categoryId: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
});

// Category Schemas
export const createCategorySchema = z.object({
  name: z.string().min(1, 'Kategori adı zorunludur'),
  description: z.string().optional(),
  color: z.string().default('#10b981'),
});

// Tag Schemas
export const createTagSchema = z.object({
  name: z.string().min(1, 'Tag adı zorunludur'),
  color: z.string().default('#6366f1'),
});

// Image Upload Schema
export const uploadImageSchema = z.object({
  filename: z.string(),
  mimeType: z.string(),
  size: z.number(),
  alt: z.string().optional(),
});

// Query Schemas
export const getPaginatedPostsSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  search: z.string().optional(),
  categoryId: z.string().optional(),
  published: z.boolean().optional(),
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type CreateTagInput = z.infer<typeof createTagSchema>;
export type UploadImageInput = z.infer<typeof uploadImageSchema>;
export type GetPaginatedPostsInput = z.infer<typeof getPaginatedPostsSchema>;