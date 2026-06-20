import "server-only";

import { createClient } from "@supabase/supabase-js";
import { EnvConfigError, getSupabasePublicEnv } from "@/lib/env";

export function createSupabaseAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey || serviceRoleKey.includes("YOUR_")) {
    throw new EnvConfigError("SUPABASE_SERVICE_ROLE_KEY is required to manage Supabase admin users. Add it in Vercel Project Settings > Environment Variables.");
  }
  const { url } = getSupabasePublicEnv();

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
