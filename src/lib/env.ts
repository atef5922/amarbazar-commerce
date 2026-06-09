import { z } from "zod";

const publicEnvSchema = z.object({
  SUPABASE_STORAGE_BUCKET: z.string().default("amarbazar-media"),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3020"),
  NEXT_PUBLIC_STORE_NAME: z.string().default("AmarBazar"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1)
});

export const env = publicEnvSchema.parse({
  SUPABASE_STORAGE_BUCKET: process.env.SUPABASE_STORAGE_BUCKET,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_STORE_NAME: process.env.NEXT_PUBLIC_STORE_NAME,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
});
