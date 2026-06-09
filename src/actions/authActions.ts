"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { UserRole } from "@prisma/client";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import { assertDatabaseReady, getDatabaseErrorMessage, testDatabaseConnection } from "@/lib/db/connection";
import { loginSchema, registerSchema } from "@/validators/auth";

const adminRoles = [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF] as const;

function getMetadataAdminRole(role: unknown) {
  return adminRoles.find((adminRole) => adminRole === role) ?? null;
}

async function setAdminCookies(userId: string, role: UserRole) {
  const cookieStore = await cookies();
  cookieStore.set("amarbazar-admin-session", userId, { path: "/", maxAge: 86400, sameSite: "lax" });
  cookieStore.set("amarbazar-admin-role", role, { path: "/", maxAge: 86400, sameSite: "lax" });
}

async function syncUserProfile(input: {
  email: string;
  authUserId: string;
  fullName: string;
  phone: string | null;
  role?: UserRole;
  avatarUrl?: string | null;
}) {
  await prisma.userProfile.upsert({
    where: { email: input.email },
    update: {
      authUserId: input.authUserId,
      fullName: input.fullName,
      phone: input.phone,
      ...(input.avatarUrl !== undefined ? { avatarUrl: input.avatarUrl } : {}),
      ...(input.role ? { role: input.role } : {})
    },
    create: {
      authUserId: input.authUserId,
      email: input.email,
      fullName: input.fullName,
      phone: input.phone,
      role: input.role ?? UserRole.USER,
      ...(input.avatarUrl !== undefined ? { avatarUrl: input.avatarUrl } : {})
    }
  });
}

export async function signInWithEmail(_: unknown, formData: FormData) {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid login input" };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { ok: false, message: error.message };

  redirect("/dashboard");
}

export async function registerWithEmail(_: unknown, formData: FormData) {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid registration input" };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.fullName, phone: parsed.data.phone },
      emailRedirectTo: `${env.NEXT_PUBLIC_SITE_URL}/auth/callback`
    }
  });

  if (error) return { ok: false, message: error.message };

  if (data.user) {
    try {
      await assertDatabaseReady();
      await syncUserProfile({
        email: parsed.data.email,
        authUserId: data.user.id,
        fullName: parsed.data.fullName,
        phone: parsed.data.phone || null
      });
    } catch (err) {
      console.error("[registerWithEmail] failed to sync user profile", err);
      await supabase.auth.signOut();
      return { ok: false, message: getDatabaseErrorMessage(err) };
    }
  }

  redirect("/dashboard");
}

export async function signInWithGoogle() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${env.NEXT_PUBLIC_SITE_URL}/auth/callback` }
  });
  if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`);
  if (data.url) redirect(data.url);
  redirect("/login?error=google-oauth-url-missing");
}

export async function sendPasswordReset(_: unknown, formData: FormData) {
  const email = String(formData.get("email") ?? "");
  if (!email) return { ok: false, message: "Email is required" };
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${env.NEXT_PUBLIC_SITE_URL}/reset-password`
  });
  if (error) return { ok: false, message: error.message };
  return { ok: true, message: "Password reset link sent" };
}

export async function updatePassword(_: unknown, formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (password.length < 8) return { ok: false, message: "Password must be at least 8 characters" };
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { ok: false, message: error.message };
  redirect("/login");
}

export async function adminSignInWithEmail(_: unknown, formData: FormData) {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid login input" };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error || !data.user?.email) return { ok: false, message: error?.message ?? "Admin login failed" };

  const dbStatus = await testDatabaseConnection();
  if (!dbStatus.ok) {
    const metadataRole = getMetadataAdminRole(data.user.user_metadata?.role);
    if (!metadataRole) {
      await supabase.auth.signOut();
      return { ok: false, message: "This account does not have admin access. Ask a SUPER_ADMIN to approve your account from Admin Users." };
    }

    await setAdminCookies(data.user.id, metadataRole);
    redirect("/admin/dashboard");
  }

  let profile;
  try {
    profile = await prisma.userProfile.findUnique({ where: { email: data.user.email } });
    if (!profile) {
      profile = await prisma.userProfile.create({
        data: {
          authUserId: data.user.id,
          email: data.user.email,
          fullName: data.user.user_metadata?.full_name ?? data.user.user_metadata?.name ?? null,
          avatarUrl: data.user.user_metadata?.avatar_url ?? null,
          role: getMetadataAdminRole(data.user.user_metadata?.role) ?? UserRole.USER
        }
      });
    }
  } catch (err) {
    console.error("[adminSignInWithEmail] failed to read user profile", err);
    return { ok: false, message: getDatabaseErrorMessage(err) };
  }

  if (!profile || profile.status !== "ACTIVE" || !adminRoles.includes(profile.role as (typeof adminRoles)[number])) {
    await supabase.auth.signOut();
    return { ok: false, message: "This account does not have admin access" };
  }

  await setAdminCookies(data.user.id, profile.role);
  redirect("/admin/dashboard");
}

export async function adminRegisterWithEmail(_: unknown, formData: FormData) {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid registration input" };

  const roleValue = String(formData.get("role") ?? "ADMIN");
  const role = roleValue in UserRole && roleValue !== UserRole.USER ? (roleValue as UserRole) : UserRole.ADMIN;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.fullName, phone: parsed.data.phone, role },
      emailRedirectTo: `${env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/admin/dashboard`
    }
  });

  if (error) return { ok: false, message: error.message };
  if (data.user) {
    const dbStatus = await testDatabaseConnection();
    if (dbStatus.ok) {
      try {
        await syncUserProfile({
          email: parsed.data.email,
          authUserId: data.user.id,
          fullName: parsed.data.fullName,
          phone: parsed.data.phone || null,
          role
        });
      } catch (err) {
        console.error("[adminRegisterWithEmail] failed to sync user profile", err);
        await supabase.auth.signOut();
        return { ok: false, message: getDatabaseErrorMessage(err) };
      }
    }
    await setAdminCookies(data.user.id, role);
  }

  redirect("/admin/dashboard");
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
