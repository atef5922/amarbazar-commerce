import "server-only";

export { createProduct, getProductBySlug, listProducts, softDeleteProduct as deleteProduct, updateProduct } from "@/repositories/productRepository";
