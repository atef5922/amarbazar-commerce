import "server-only";

import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export function getAdminUsers() {
  return prisma.userProfile.findMany({
    where: { role: { in: [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF] } },
    orderBy: [{ role: "desc" }, { createdAt: "desc" }]
  });
}

export async function createAdminAccount(input: { email: string; password: string; fullName?: string | null }) {
  const supabase = createSupabaseAdminClient();
  const existing = await findAuthUserByEmail(input.email);

  const authUser = existing
    ? existing
    : await createAuthUser({
        email: input.email,
        password: input.password,
        fullName: input.fullName ?? input.email.split("@")[0],
        role: UserRole.ADMIN
      });

  return upsertAdminByEmail({
    email: input.email,
    fullName: input.fullName ?? authUser.user_metadata?.full_name ?? authUser.user_metadata?.name ?? input.email.split("@")[0],
    authUserId: authUser.id,
    role: UserRole.ADMIN,
    status: "ACTIVE"
  });

  async function createAuthUser(data: { email: string; password: string; fullName: string; role: UserRole }) {
    const { data: created, error } = await supabase.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: {
        full_name: data.fullName,
        role: data.role
      }
    });
    if (error || !created.user) throw new Error(error?.message ?? "Could not create Supabase Auth user.");
    return created.user;
  }
}

async function findAuthUserByEmail(email: string) {
  const supabase = createSupabaseAdminClient();
  for (let page = 1; page <= 20; page += 1) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 100 });
    if (error) throw new Error(error.message);
    const found = data.users.find((user) => user.email?.toLowerCase() === email.toLowerCase());
    if (found) return found;
    if (data.users.length < 100) break;
  }
  return null;
}

export async function upsertAdminByEmail(input: { email: string; fullName?: string | null; authUserId?: string | null; role?: UserRole; status?: string }) {
  const role = input.role === UserRole.SUPER_ADMIN ? UserRole.SUPER_ADMIN : UserRole.ADMIN;
  return prisma.userProfile.upsert({
    where: { email: input.email },
    update: {
      authUserId: input.authUserId || undefined,
      fullName: input.fullName || undefined,
      role,
      status: input.status ?? "ACTIVE"
    },
    create: {
      authUserId: input.authUserId ?? null,
      email: input.email,
      fullName: input.fullName ?? input.email.split("@")[0],
      role,
      status: input.status ?? "ACTIVE"
    }
  });
}

export function approveAdmin(id: string) {
  return prisma.userProfile.update({ where: { id }, data: { role: UserRole.ADMIN, status: "ACTIVE" } });
}

export function changeAdminRole(id: string, role: "ADMIN" | "STAFF") {
  return prisma.userProfile.update({ where: { id }, data: { role } });
}

export async function setAdminBlocked(id: string, blocked: boolean) {
  const profile = await prisma.userProfile.findUniqueOrThrow({ where: { id } });
  if (profile.role === UserRole.SUPER_ADMIN) throw new Error("SUPER_ADMIN cannot be blocked.");
  return prisma.userProfile.update({ where: { id }, data: { status: blocked ? "BLOCKED" : "ACTIVE" } });
}

export async function deleteAdmin(id: string) {
  const profile = await prisma.userProfile.findUniqueOrThrow({ where: { id } });
  if (profile.role === UserRole.SUPER_ADMIN) throw new Error("SUPER_ADMIN cannot be deleted.");
  return prisma.userProfile.delete({ where: { id } });
}
