import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { assertDatabaseReady } from "@/lib/db/connection";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.exchangeCodeForSession(code);
    const { data } = await supabase.auth.getUser();

    if (data.user?.email) {
      try {
        await assertDatabaseReady();
        await prisma.userProfile.upsert({
          where: { email: data.user.email },
          update: {
            authUserId: data.user.id,
            fullName: data.user.user_metadata?.full_name ?? data.user.user_metadata?.name ?? null,
            avatarUrl: data.user.user_metadata?.avatar_url ?? null
          },
          create: {
            authUserId: data.user.id,
            email: data.user.email,
            fullName: data.user.user_metadata?.full_name ?? data.user.user_metadata?.name ?? null,
            avatarUrl: data.user.user_metadata?.avatar_url ?? null
          }
        });
      } catch (error) {
        console.error("[auth callback] failed to sync user profile", error);
      }
    }
  }

  return NextResponse.redirect(new URL(next, request.url));
}
