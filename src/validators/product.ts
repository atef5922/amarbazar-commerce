import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  sku: z.string().min(2),
  brandId: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  price: z.coerce.number().positive(),
  oldPrice: z.coerce.number().positive().optional().nullable(),
  stock: z.coerce.number().int().min(0),
  warranty: z.string().optional().nullable(),
  tags: z.array(z.string()).default([]),
  shortDescription: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  specifications: z.record(z.string(), z.unknown()).optional(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable()
});

export const productQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  rating: z.coerce.number().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(60).default(24),
  sort: z.enum(["featured", "newest", "low", "high", "rated", "selling"]).default("featured")
});

export type ProductInput = z.infer<typeof productSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
