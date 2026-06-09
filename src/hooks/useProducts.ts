import { filterProducts, getBrands, getCategories, getProductBySlug, getProducts, searchProducts, type ProductFilters } from "@/services/products";

export function useProducts(filters?: ProductFilters) {
  return filters ? filterProducts(filters) : getProducts();
}

export function useProductSearch(query: string, limit?: number) {
  return searchProducts(query, limit);
}

export function useProductBySlug(slug: string) {
  return getProductBySlug(slug);
}

export function useProductMeta() {
  return {
    brands: getBrands(),
    categories: getCategories()
  };
}
