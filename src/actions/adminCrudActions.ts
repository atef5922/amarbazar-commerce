"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { PublishStatus, ReviewStatus } from "@prisma/client";
import { requireAdminProfile } from "@/services/auth-profile.service";
import { createBrand, deleteBrand, updateBrand } from "@/services/brand.service";
import { createCategory, deleteCategory, updateCategory } from "@/services/category.service";
import { createBanner, deleteBanner, updateBanner } from "@/services/banner.service";
import { updateHomepageSection } from "@/services/homepage.service";
import { createCoupon, deleteCoupon, updateCoupon } from "@/services/coupon.service";
import { updateReviewStatus } from "@/services/review.service";
import { upsertSetting } from "@/services/settings.service";

const slugNameSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  status: z.nativeEnum(PublishStatus).default(PublishStatus.PUBLISHED),
  sortOrder: z.coerce.number().int().default(0)
});

const bannerSchema = z.object({
  title: z.string().min(2),
  subtitle: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  buttonText: z.string().optional().nullable(),
  buttonLink: z.string().optional().nullable(),
  type: z.string().min(2),
  position: z.string().optional().nullable(),
  status: z.nativeEnum(PublishStatus).default(PublishStatus.PUBLISHED),
  sortOrder: z.coerce.number().int().default(0)
});

export async function createCategoryAction(_: unknown, formData: FormData) {
  await requireAdminProfile();
  const parsed = slugNameSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid category data" };
  await createCategory({ ...parsed.data, showHome: formData.get("showHome") === "on" });
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/categories");
  return { ok: true, message: "Category saved" };
}

export async function updateCategoryAction(id: string, _: unknown, formData: FormData) {
  await requireAdminProfile();
  const parsed = slugNameSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid category data" };
  await updateCategory(id, { ...parsed.data, showHome: formData.get("showHome") === "on" });
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/categories");
  return { ok: true, message: "Category updated" };
}

export async function deleteCategoryAction(id: string) {
  await requireAdminProfile();
  await deleteCategory(id);
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/categories");
  return { ok: true, message: "Category archived" };
}

export async function createBrandAction(_: unknown, formData: FormData) {
  await requireAdminProfile();
  const parsed = slugNameSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid brand data" };
  await createBrand({ ...parsed.data, showTop: formData.get("showTop") === "on" });
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/brands");
  return { ok: true, message: "Brand saved" };
}

export async function updateBrandAction(id: string, _: unknown, formData: FormData) {
  await requireAdminProfile();
  const parsed = slugNameSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid brand data" };
  await updateBrand(id, { ...parsed.data, showTop: formData.get("showTop") === "on" });
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/brands");
  return { ok: true, message: "Brand updated" };
}

export async function deleteBrandAction(id: string) {
  await requireAdminProfile();
  await deleteBrand(id);
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/brands");
  return { ok: true, message: "Brand archived" };
}

export async function createBannerAction(_: unknown, formData: FormData) {
  await requireAdminProfile();
  const parsed = bannerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid banner data" };
  await createBanner(parsed.data);
  revalidatePath("/");
  revalidatePath("/admin/banners");
  return { ok: true, message: "Banner saved" };
}

export async function updateBannerAction(id: string, _: unknown, formData: FormData) {
  await requireAdminProfile();
  const parsed = bannerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid banner data" };
  await updateBanner(id, parsed.data);
  revalidatePath("/");
  revalidatePath("/admin/banners");
  return { ok: true, message: "Banner updated" };
}

export async function deleteBannerAction(id: string) {
  await requireAdminProfile();
  await deleteBanner(id);
  revalidatePath("/");
  revalidatePath("/admin/banners");
  return { ok: true, message: "Banner archived" };
}

export async function updateHomepageSectionAction(id: string, _: unknown, formData: FormData) {
  await requireAdminProfile();
  await updateHomepageSection(id, {
    title: String(formData.get("title") ?? ""),
    subtitle: formData.get("subtitle") ? String(formData.get("subtitle")) : null,
    enabled: formData.get("enabled") === "on",
    sortOrder: Number(formData.get("sortOrder") ?? 0)
  });
  revalidatePath("/");
  revalidatePath("/admin/homepage-sections");
  return { ok: true, message: "Homepage section updated" };
}

export async function createCouponAction(_: unknown, formData: FormData) {
  await requireAdminProfile();
  await createCoupon({
    code: String(formData.get("code") ?? "").toUpperCase(),
    discountType: formData.get("discountType") === "FIXED" ? "FIXED" : "PERCENTAGE",
    discountValue: String(formData.get("discountValue") ?? "0"),
    minOrderAmount: formData.get("minOrderAmount") ? String(formData.get("minOrderAmount")) : null,
    status: String(formData.get("status") ?? "ACTIVE")
  });
  revalidatePath("/admin/coupons");
  return { ok: true, message: "Coupon saved" };
}

export async function updateCouponAction(id: string, _: unknown, formData: FormData) {
  await requireAdminProfile();
  await updateCoupon(id, {
    code: String(formData.get("code") ?? "").toUpperCase(),
    discountType: formData.get("discountType") === "FIXED" ? "FIXED" : "PERCENTAGE",
    discountValue: String(formData.get("discountValue") ?? "0"),
    minOrderAmount: formData.get("minOrderAmount") ? String(formData.get("minOrderAmount")) : null,
    status: String(formData.get("status") ?? "ACTIVE")
  });
  revalidatePath("/admin/coupons");
  return { ok: true, message: "Coupon updated" };
}

export async function deleteCouponAction(id: string) {
  await requireAdminProfile();
  await deleteCoupon(id);
  revalidatePath("/admin/coupons");
  return { ok: true, message: "Coupon archived" };
}

export async function updateReviewStatusAction(id: string, status: ReviewStatus) {
  await requireAdminProfile();
  await updateReviewStatus(id, status);
  revalidatePath("/admin/reviews");
  return { ok: true, message: "Review updated" };
}

export async function updateSettingAction(_: unknown, formData: FormData) {
  await requireAdminProfile();
  const key = String(formData.get("key") ?? "");
  const group = String(formData.get("group") ?? "general");
  const value = String(formData.get("value") ?? "");
  if (!key) return { ok: false, message: "Setting key is required" };
  await upsertSetting(key, value, group);
  revalidatePath("/");
  revalidatePath("/admin/settings");
  return { ok: true, message: "Setting saved" };
}
