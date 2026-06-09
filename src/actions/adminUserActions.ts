"use server";

import { revalidatePath } from "next/cache";
import { requireSuperAdminProfile } from "@/services/auth-profile.service";
import { approveAdmin, changeAdminRole, createAdminAccount, deleteAdmin, setAdminBlocked } from "@/services/admin-user.service";

export async function addAdminAction(_: unknown, formData: FormData) {
  await requireSuperAdminProfile();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const fullName = String(formData.get("fullName") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email) return { ok: false, message: "Email is required" };
  if (password.length < 8) return { ok: false, message: "Password must be at least 8 characters" };
  try {
    await createAdminAccount({ email, fullName: fullName || null, password });
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Could not create admin account" };
  }
  revalidatePath("/admin/admins");
  return { ok: true, message: "Admin Auth user and profile created" };
}

export async function approveAdminAction(id: string) {
  await requireSuperAdminProfile();
  await approveAdmin(id);
  revalidatePath("/admin/admins");
}

export async function changeAdminRoleAction(id: string, role: "ADMIN" | "STAFF") {
  await requireSuperAdminProfile();
  await changeAdminRole(id, role);
  revalidatePath("/admin/admins");
}

export async function blockAdminAction(id: string) {
  await requireSuperAdminProfile();
  await setAdminBlocked(id, true);
  revalidatePath("/admin/admins");
}

export async function unblockAdminAction(id: string) {
  await requireSuperAdminProfile();
  await setAdminBlocked(id, false);
  revalidatePath("/admin/admins");
}

export async function deleteAdminAction(id: string) {
  await requireSuperAdminProfile();
  await deleteAdmin(id);
  revalidatePath("/admin/admins");
}
