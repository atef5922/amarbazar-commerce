import { z } from "zod";

const rawPublicEnvSchema = z.object({
  SUPABASE_STORAGE_BUCKET: z.string().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().optional(),
  NEXT_PUBLIC_STORE_NAME: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional()
});

type RawPublicEnv = z.infer<typeof rawPublicEnvSchema>;

let cachedRawPublicEnv: RawPublicEnv | undefined;

export class EnvConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EnvConfigError";
  }
}

function readRawPublicEnv() {
  cachedRawPublicEnv ??= rawPublicEnvSchema.parse({
    SUPABASE_STORAGE_BUCKET: process.env.SUPABASE_STORAGE_BUCKET,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_STORE_NAME: process.env.NEXT_PUBLIC_STORE_NAME,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  });

  return cachedRawPublicEnv;
}

function parseOrThrow<T>(schema: z.ZodType<T>, value: unknown, message: string) {
  const parsed = schema.safeParse(value);
  if (!parsed.success) throw new EnvConfigError(message);
  return parsed.data;
}

export function isEnvConfigError(error: unknown): error is EnvConfigError {
  return error instanceof EnvConfigError;
}

export function getStorageBucket() {
  return readRawPublicEnv().SUPABASE_STORAGE_BUCKET || "amarbazar-media";
}

export function getStoreName() {
  return readRawPublicEnv().NEXT_PUBLIC_STORE_NAME || "AmarBazar";
}

export function getSiteUrl() {
  return parseOrThrow(
    z.string().url(),
    readRawPublicEnv().NEXT_PUBLIC_SITE_URL || "http://localhost:3020",
    "NEXT_PUBLIC_SITE_URL is missing or invalid. Set it to your public app URL in Vercel Project Settings > Environment Variables."
  );
}

export function hasSupabasePublicEnv() {
  const env = readRawPublicEnv();
  return Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function getSupabasePublicEnv() {
  const env = readRawPublicEnv();

  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new EnvConfigError(
      "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required to enable AmarBazar authentication. Add them in Vercel Project Settings > Environment Variables."
    );
  }

  return {
    url: parseOrThrow(
      z.string().url(),
      env.NEXT_PUBLIC_SUPABASE_URL,
      "NEXT_PUBLIC_SUPABASE_URL is invalid. Set it to your Supabase project URL in Vercel Project Settings > Environment Variables."
    ),
    anonKey: parseOrThrow(
      z.string().min(1),
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      "NEXT_PUBLIC_SUPABASE_ANON_KEY is missing or invalid. Update it in Vercel Project Settings > Environment Variables."
    )
  };
}
