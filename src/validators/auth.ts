import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

export const registerSchema = loginSchema.extend({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().min(8).optional().or(z.literal(""))
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters")
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
