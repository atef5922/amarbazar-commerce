import { ProductDetailsClient } from "@/components/product/ProductDetailsClient";
import { products } from "@/data/products";
import { getProductBySlug } from "@/services/products";

export default async function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  return <ProductDetailsClient product={product ?? products[0]} notFound={!product} />;
}
