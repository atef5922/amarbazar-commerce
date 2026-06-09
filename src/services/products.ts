import { brands } from "@/data/brands";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import type { Product } from "@/types";
import { slugify } from "@/utils/format";

export type ProductFilters = {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  tag?: string;
  offer?: string;
  badge?: string;
  availability?: string;
};

export function getProducts() {
  return products;
}

export function getProductSlug(product: Product) {
  return product.slug ?? slugify(product.name);
}

export function getProductBySlug(slug: string) {
  return products.find((product) => getProductSlug(product) === slug);
}

export function getCategories() {
  return categories;
}

export function getBrands() {
  return brands;
}

export function getProductSearchText(product: Product) {
  return [
    product.name,
    product.brand,
    product.category,
    product.description,
    product.shortDescription,
    product.tags?.join(" "),
    product.specifications ? Object.values(product.specifications).join(" ") : ""
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function searchProducts(query: string, limit = 6) {
  const value = query.trim().toLowerCase();
  if (!value) return [];
  return products.filter((product) => getProductSearchText(product).includes(value)).slice(0, limit);
}

export function filterProducts(filters: ProductFilters) {
  const search = filters.search?.trim().toLowerCase() ?? "";
  return products
    .filter((product) => !search || getProductSearchText(product).includes(search))
    .filter((product) => !filters.category || filters.category === "All" || matchesCategory(product, filters.category))
    .filter((product) => !filters.brand || filters.brand === "All" || product.brand === filters.brand)
    .filter((product) => !filters.minPrice || product.price >= filters.minPrice)
    .filter((product) => !filters.maxPrice || product.price <= filters.maxPrice)
    .filter((product) => !filters.rating || product.rating >= filters.rating)
    .filter((product) => !filters.badge || filters.badge === "All" || product.badge === filters.badge)
    .filter((product) => !filters.availability || filters.availability === "All" || (filters.availability === "In Stock" ? product.stock > 0 : product.stock === 0))
    .filter((product) => !filters.tag || hasTag(product, filters.tag))
    .filter((product) => !filters.offer || matchesOffer(product, filters.offer));
}

export function getProductImages(product: Product) {
  return product.images?.length ? product.images : [product.image, product.hoverImage].filter(Boolean) as string[];
}

export function getProductThumbnail(product: Product) {
  return product.thumbnail ?? product.image;
}

export function getProductDiscount(product: Product) {
  if (typeof product.discount === "number") return product.discount;
  if (!product.oldPrice) return 0;
  return Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
}

export function matchesCategory(product: Product, category: string) {
  if (category === "All") return true;
  if (category === product.category) return true;
  const value = category.toLowerCase();
  if (value === "routers") return product.name.toLowerCase().includes("router");
  if (value === "chargers") return product.name.toLowerCase().includes("charger");
  return false;
}

function hasTag(product: Product, tag: string) {
  const value = tag.toLowerCase();
  return Boolean(product.tags?.some((item) => slugify(item) === value || item.toLowerCase() === value)) || getProductSearchText(product).includes(value.replace(/-/g, " "));
}

function matchesOffer(product: Product, offer: string) {
  if (offer === "phone-deals") return product.category === "Smartphones";
  if (offer === "gadget-sale") return Boolean(product.oldPrice || product.badge === "Sale" || product.badge === "Hot");
  if (offer === "laptop-offer") return product.category === "Laptops";
  if (offer === "accessories-sale") return product.category === "Accessories";
  if (offer === "free-delivery") return true;
  return true;
}
