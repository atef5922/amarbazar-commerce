import { ShopClient } from "@/components/shop/ShopClient";
import { categories } from "@/data/categories";
import { slugify } from "@/utils/format";
import { Suspense } from "react";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categories.find((item) => slugify(String(item.name)) === slug);
  return (
    <Suspense fallback={<div className="bg-soft py-20 text-center font-black">Loading category...</div>}>
      <ShopClient initialCategory={String(category?.name ?? "All")} />
    </Suspense>
  );
}
