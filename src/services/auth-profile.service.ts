import "server-only";

import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { UserRole } from "@prisma/client";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isEnvConfigError } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { testDatabaseConnection } from "@/lib/db/connection";

const adminRoles = [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF];

function hasAdminRole(role: UserRole) {
  return adminRoles.some((adminRole) => adminRole === role);
}

export async function syncAuthUserToProfile(user: User) {
  if (!user.email) return null;

  const dbStatus = await testDatabaseConnection();
  if (!dbStatus.ok) return null;

  return prisma.userProfile.upsert({
    where: { authUserId: user.id },
    update: {
      email: user.email,
      fullName: user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email.split("@")[0],
      avatarUrl: user.user_metadata?.avatar_url ?? null,
      phone: user.phone ?? null,
      lastLoginAt: new Date()
    },
    create: {
      authUserId: user.id,
      email: user.email,
      fullName: user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email.split("@")[0],
      avatarUrl: user.user_metadata?.avatar_url ?? null,
      phone: user.phone ?? null,
      role: UserRole.USER,
      lastLoginAt: new Date()
    }
  });
}

export async function getCurrentUserProfile() {
  let supabase;
  try {
    supabase = await createSupabaseServerClient();
  } catch (error) {
    if (isEnvConfigError(error)) return null;
    throw error;
  }
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;

  const profile = await syncAuthUserToProfile(data.user);
  return { user: data.user, profile };
}

export async function requireAdminProfile() {
  const session = await getCurrentUserProfile();
  if (!session?.user) redirect("/admin/login");
  if (!session.profile || session.profile.status !== "ACTIVE" || !hasAdminRole(session.profile.role)) redirect("/admin/login?blocked=user-role");
  return session;
}

export async function requireSuperAdminProfile() {
  const session = await requireAdminProfile();
  if (!session.profile) redirect("/admin/login?blocked=user-role");
  if (session.profile.role !== UserRole.SUPER_ADMIN) redirect("/admin/dashboard?blocked=super-admin-required");
  return session;
}

export async function isAdminProfile(userId: string) {
  const profile = await prisma.userProfile.findUnique({ where: { authUserId: userId } });
  return Boolean(profile && hasAdminRole(profile.role));
}
