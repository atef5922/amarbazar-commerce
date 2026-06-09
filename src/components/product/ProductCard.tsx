"use client";

import Link from "next/link";
import { CheckCircle2, Eye, GitCompare, Heart, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/types";
import { useCommerceStore } from "@/store/useCommerceStore";
import { formatPrice } from "@/utils/format";
import { getProductSlug } from "@/services/products";
import { ProductImageBox } from "./ProductImageBox";
import { Rating } from "./Rating";

export function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const { addToCart, toggleWishlist, toggleCompare, openQuickView } = useCommerceStore();
  const hoverImage = getHoverImage(product);
  const href = `/products/${getProductSlug(product)}`;

  if (compact) {
    return (
      <div className="group flex min-h-[118px] gap-4 border-b border-zinc-200 py-4 transition-all duration-300 last:border-b-0 hover:border-primary/25">
        <Link href={href} className="h-24 w-24 shrink-0 overflow-hidden border border-zinc-200 bg-[#fafafa]">
          <ProductImageBox src={product.image} alt={product.name} sizes="96px" className="h-full rounded-none" imageClassName="p-2 group-hover:scale-105" />
        </Link>
        <div className="relative flex min-w-0 flex-1 flex-col justify-center overflow-visible">
          <div className="transition-all duration-300 group-hover:translate-y-2 group-hover:opacity-0">
            <Rating value={product.rating} />
            <Link href={href} className="mt-1.5 line-clamp-2 text-sm font-bold leading-5 transition-colors duration-300 hover:text-primary">
              {product.name}
            </Link>
            <p className="mt-1 text-sm font-black text-primary">{formatPrice(product.price)}</p>
          </div>
          <div className="absolute left-0 top-1/2 flex -translate-y-1/2 translate-x-2 items-center gap-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
            <CompactActionButton label="Add to cart" onClick={() => addToCart(product)}>
              <ShoppingCart className="h-4 w-4" />
            </CompactActionButton>
            <CompactActionButton label="Wishlist" onClick={() => toggleWishlist(product)}>
              <Heart className="h-4 w-4" />
            </CompactActionButton>
            <CompactActionButton label="Quick view" onClick={() => openQuickView(product)}>
              <Eye className="h-4 w-4" />
            </CompactActionButton>
            <CompactActionButton label="Compare" onClick={() => toggleCompare(product)}>
              <GitCompare className="h-4 w-4" />
            </CompactActionButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.article
      whileHover={{ y: -4 }}
      className="group relative flex h-full min-h-[410px] flex-col overflow-hidden rounded-md border border-zinc-200 bg-white p-3 shadow-[0_8px_24px_rgba(34,34,34,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl"
    >
      <div className="absolute left-3 top-3 z-10 bg-secondary px-2 py-1 text-[10px] font-bold uppercase text-white">
        {product.badge ?? "New"}
      </div>
      {product.discount ? (
        <div className="absolute right-3 top-3 z-10 text-[10px] font-bold uppercase text-primary">{product.discount}</div>
      ) : null}
      <Link href={href} className="relative block aspect-square overflow-hidden rounded bg-[#fafafa]">
        <ProductImageBox
          src={product.image}
          alt={product.name}
          sizes="(max-width: 768px) 50vw, 260px"
          className="absolute inset-0 rounded-none"
          imageClassName="p-5 group-hover:scale-110 group-hover:opacity-0"
        />
        <ProductImageBox
          src={hoverImage}
          alt={`${product.name} alternate view`}
          sizes="(max-width: 768px) 50vw, 260px"
          className="absolute inset-0 rounded-none bg-transparent"
          imageClassName="p-5 opacity-0 group-hover:scale-110 group-hover:opacity-100"
        />
      </Link>
      <div className="mt-3 flex flex-1 flex-col transition-all duration-300 group-hover:translate-y-3 group-hover:opacity-0">
        <Rating value={product.rating} />
        <span className="mt-1 text-xs text-zinc-400">{product.reviews} reviews</span>
        <Link href={href} className="mt-1 line-clamp-2 min-h-10 text-sm font-semibold leading-5 transition-colors duration-300 hover:text-primary">
          {product.name}
        </Link>
        <div className="mt-auto flex min-h-6 items-center gap-2 pt-2 text-sm">
          <span className="font-bold text-secondary">{formatPrice(product.price)}</span>
          {product.oldPrice ? <span className="text-xs text-zinc-400 line-through">{formatPrice(product.oldPrice)}</span> : null}
        </div>
        <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-emerald-600">
          <CheckCircle2 className="h-3.5 w-3.5" />
          {product.stock > 0 ? "In Stock" : "Out of Stock"}
        </p>
      </div>
      <div className="absolute inset-x-8 bottom-9 z-20 grid translate-y-3 grid-cols-4 border border-zinc-200 bg-white opacity-0 shadow-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <FullActionButton label="Add to cart" onClick={() => addToCart(product)}>
          <ShoppingCart className="h-4 w-4" />
        </FullActionButton>
        <FullActionButton label="Wishlist" onClick={() => toggleWishlist(product)}>
          <Heart className="h-4 w-4" />
        </FullActionButton>
        <FullActionButton label="Quick view" onClick={() => openQuickView(product)}>
          <Eye className="h-4 w-4" />
        </FullActionButton>
        <FullActionButton label="Compare" onClick={() => toggleCompare(product)}>
          <GitCompare className="h-4 w-4" />
        </FullActionButton>
      </div>
    </motion.article>
  );
}

function getHoverImage(product: Product) {
  if (product.hoverImage) return product.hoverImage;

  const byCategory: Record<Product["category"], string> = {
    Smartphones: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=700&q=80",
    Laptops: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=700&q=80",
    Headphones: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=700&q=80",
    "Smart Watches": "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=700&q=80",
    Speakers: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=700&q=80",
    Accessories: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=700&q=80",
    Cameras: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=700&q=80",
    "Home Appliances": "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=700&q=80",
    "Smart TVs": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=700&q=80",
    Gaming: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=700&q=80"
  };

  return byCategory[product.category];
}

function FullActionButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="group/action relative grid h-11 place-items-center text-zinc-600 transition-all duration-300 hover:bg-primary hover:text-white"
    >
      {children}
      <span className="pointer-events-none absolute -top-10 left-1/2 z-20 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded bg-zinc-900 px-2.5 py-1.5 text-[11px] font-bold text-white opacity-0 shadow-lg transition-all duration-200 group-hover/action:translate-y-0 group-hover/action:opacity-100">
        {label}
      </span>
    </button>
  );
}

function CompactActionButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="group/action relative grid h-9 w-9 place-items-center rounded-full text-zinc-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary hover:text-white hover:shadow-lg"
    >
      {children}
      <span className="pointer-events-none absolute -top-9 left-1/2 z-20 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded bg-zinc-900 px-2.5 py-1.5 text-[11px] font-bold text-white opacity-0 shadow-lg transition-all duration-200 group-hover/action:translate-y-0 group-hover/action:opacity-100">
        {label}
      </span>
    </button>
  );
}
