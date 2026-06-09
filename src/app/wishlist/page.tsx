"use client";

import { ProductCard } from "@/components/product/ProductCard";
import { useCommerceStore } from "@/store/useCommerceStore";

export default function WishlistPage() {
  const wishlist = useCommerceStore((state) => state.wishlist);
  return (
    <main className="bg-soft py-10 lg:py-12">
      <div className="container-page">
        <h1 className="mb-5 text-3xl font-black">Wishlist</h1>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">{wishlist.map((product) => <ProductCard key={product.id} product={product} />)}</div>
        {!wishlist.length ? <p className="bg-white p-5 text-zinc-500">No wishlist products yet.</p> : null}
      </div>
    </main>
  );
}
