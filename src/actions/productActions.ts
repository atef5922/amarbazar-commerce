"use server";

import { revalidatePath } from "next/cache";
import { productSchema } from "@/validators/product";
import { createProduct, softDeleteProduct, updateProduct } from "@/repositories/productRepository";

export async function createProductAction(_: unknown, formData: FormData) {
  const parsed = productSchema.safeParse(parseProductForm(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid product data" };
  await createProduct(parsed.data);
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/products");
  return { ok: true, message: "Product created" };
}

export async function updateProductAction(id: string, _: unknown, formData: FormData) {
  const parsed = productSchema.safeParse(parseProductForm(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid product data" };
  await updateProduct(id, parsed.data);
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/products");
  return { ok: true, message: "Product updated" };
}

export async function deleteProductAction(id: string) {
  await softDeleteProduct(id);
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/products");
  return { ok: true, message: "Product archived" };
}

function parseProductForm(formData: FormData) {
  return {
    name: formData.get("name"),
    slug: formData.get("slug"),
    sku: formData.get("sku"),
    brandId: formData.get("brandId") || null,
    categoryId: formData.get("categoryId") || null,
    price: formData.get("price"),
    oldPrice: formData.get("oldPrice") || null,
    stock: formData.get("stock"),
    warranty: formData.get("warranty") || null,
    tags: String(formData.get("tags") ?? "").split(",").map((tag) => tag.trim()).filter(Boolean),
    shortDescription: formData.get("shortDescription") || null,
    description: formData.get("description") || null,
    seoTitle: formData.get("seoTitle") || null,
    seoDescription: formData.get("seoDescription") || null
  };
}
