import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters').max(50, 'Full name cannot exceed 50 characters').optional(),
    theme: z.enum(['light', 'dark', 'system']).optional(),
    preferences: z
      .object({
        cuisines: z.array(z.string()).optional(),
        notifications: z.boolean().optional(),
      })
      .catchall(z.any())
      .optional(),
  }),
});

export const adminUpdateUserSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters').max(50, 'Full name cannot exceed 50 characters').optional(),
    role: z.enum(['admin', 'user']).optional(),
    status: z.enum(['active', 'suspended']).optional(),
  }),
});
