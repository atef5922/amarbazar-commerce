"use client";

import { Heart, ShoppingCart } from "lucide-react";
import type { Product } from "@/types";
import { useCommerceStore } from "@/store/useCommerceStore";
import { Button } from "@/components/common/Button";

export function ProductActions({ product }: { product: Product }) {
  const { addToCart, toggleWishlist } = useCommerceStore();

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <Button onClick={() => addToCart(product)}>
        <ShoppingCart className="h-4 w-4" />
        Add To Cart
      </Button>
      <Button variant="secondary" onClick={() => toggleWishlist(product)}>
        <Heart className="h-4 w-4" />
        Wishlist
      </Button>
    </div>
  );
}
