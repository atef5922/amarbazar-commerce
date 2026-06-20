import { getStorageBucket, hasSupabasePublicEnv } from "@/lib/env";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export const storageFolders = ["products", "categories", "brands", "banners", "blogs", "settings"] as const;
export type StorageFolder = (typeof storageFolders)[number];

export function buildStoragePath(folder: StorageFolder, fileName: string) {
  const safeName = fileName.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/-+/g, "-");
  return `${folder}/${Date.now()}-${safeName}`;
}

export function getPublicStorageUrl(path: string) {
  if (!hasSupabasePublicEnv()) return path;
  const supabase = createSupabaseBrowserClient();
  return supabase.storage.from(getStorageBucket()).getPublicUrl(path).data.publicUrl;
}
