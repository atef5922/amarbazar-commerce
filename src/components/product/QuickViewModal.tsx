"use client";

import Image from "next/image";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { Heart, Minus, Plus, X } from "lucide-react";
import { useState } from "react";
import { useCommerceStore } from "@/store/useCommerceStore";
import { formatPrice, slugify } from "@/utils/format";
import { Button } from "@/components/common/Button";
import { Rating } from "./Rating";

export function QuickViewModal() {
  const [quantity, setQuantity] = useState(1);
  const { quickView, closeQuickView, addToCart, toggleWishlist } = useCommerceStore();

  return (
    <Dialog.Root open={Boolean(quickView)} onOpenChange={(open) => !open && closeQuickView()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(920px,calc(100%-24px))] -translate-x-1/2 -translate-y-1/2 bg-white p-4 shadow-soft md:p-6">
          {quickView ? (
            <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
              <div className="relative aspect-square bg-soft">
                <Image src={quickView.image} alt={quickView.name} fill sizes="420px" className="object-contain p-8" />
              </div>
              <div>
                <Dialog.Title className="text-2xl font-black">{quickView.name}</Dialog.Title>
                <div className="mt-2 flex items-center gap-3">
                  <Rating value={quickView.rating} />
                  <span className="text-sm text-zinc-500">{quickView.reviews} reviews</span>
                </div>
                <p className="mt-4 text-3xl font-black text-primary">{formatPrice(quickView.price)}</p>
                <p className="mt-4 leading-7 text-zinc-600">{quickView.description}</p>
                <div className="mt-5 flex items-center gap-3">
                  <span className="text-sm font-bold">Quantity</span>
                  <div className="flex border border-zinc-200">
                    <button className="grid h-10 w-10 place-items-center hover:bg-soft" onClick={() => setQuantity((value) => Math.max(1, value - 1))}><Minus className="h-4 w-4" /></button>
                    <span className="grid h-10 w-12 place-items-center font-bold">{quantity}</span>
                    <button className="grid h-10 w-10 place-items-center hover:bg-soft" onClick={() => setQuantity((value) => value + 1)}><Plus className="h-4 w-4" /></button>
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button onClick={() => addToCart(quickView, quantity)}>Add To Cart</Button>
                  <Button variant="secondary" onClick={() => toggleWishlist(quickView)}><Heart className="h-4 w-4" /> Wishlist</Button>
                  <Link href={`/products/${slugify(quickView.name)}`} onClick={closeQuickView}>
                    <Button variant="light" className="ring-1 ring-zinc-200">View Details</Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
          <Dialog.Close className="absolute right-3 top-3 grid h-9 w-9 place-items-center bg-zinc-100 text-zinc-600 hover:bg-primary hover:text-white">
            <X className="h-4 w-4" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
