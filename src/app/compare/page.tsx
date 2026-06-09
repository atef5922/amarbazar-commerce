"use client";

import Image from "next/image";
import { useCommerceStore } from "@/store/useCommerceStore";
import { formatPrice } from "@/utils/format";

export default function ComparePage() {
  const compare = useCommerceStore((state) => state.compare);
  return (
    <main className="bg-soft py-8">
      <div className="container-page">
        <h1 className="mb-5 text-3xl font-black">Compare Products</h1>
        <div className="grid gap-4 md:grid-cols-3">
          {compare.map((product) => (
            <article key={product.id} className="bg-white p-5">
              <div className="relative aspect-square bg-soft"><Image src={product.image} alt={product.name} fill sizes="300px" className="object-contain p-6" /></div>
              <h2 className="mt-4 font-black">{product.name}</h2>
              <p className="text-primary">{formatPrice(product.price)}</p>
              <p className="text-sm text-zinc-500">Brand: {product.brand}</p>
              <p className="text-sm text-zinc-500">Rating: {product.rating}/5</p>
            </article>
          ))}
        </div>
        {!compare.length ? <p className="bg-white p-5 text-zinc-500">Add products to compare from product cards.</p> : null}
      </div>
    </main>
  );
}
