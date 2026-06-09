"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Edit3, Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/common/Button";
import { useCommerceStore } from "@/store/useCommerceStore";
import { formatPrice, slugify } from "@/utils/format";

const shipping = 0;
const taxes = 0;

export function CartDrawer() {
  const router = useRouter();
  const {
    cart,
    isCartDrawerOpen,
    closeCartDrawer,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart
  } = useCommerceStore();
  const subtotal = cart.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const total = subtotal + shipping + taxes;

  const navigate = (href: string) => {
    closeCartDrawer();
    router.push(href);
  };

  return (
    <AnimatePresence>
      {isCartDrawerOpen ? (
        <>
          <motion.button
            type="button"
            aria-label="Close cart overlay"
            className="fixed inset-0 z-[80] bg-black/55"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCartDrawer}
          />
          <motion.aside
            className="fixed right-0 top-0 z-[90] flex h-dvh w-full flex-col bg-white shadow-2xl sm:w-[420px]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.32, ease: "easeOut" }}
            aria-label="My Cart"
          >
            <div className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-primary/10 bg-soft px-5">
              <h2 className="text-lg font-black uppercase text-primary">My Cart</h2>
              <button
                type="button"
                className="grid h-9 w-9 place-items-center text-primary transition-all duration-300 hover:rotate-90 hover:bg-primary hover:text-white"
                onClick={closeCartDrawer}
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {cart.length ? (
              <>
                <div className="flex-1 overflow-y-auto p-5">
                  <div className="grid gap-3">
                    {cart.map((line) => {
                      const href = `/products/${slugify(line.product.name)}`;
                      return (
                        <div key={line.product.id} className="grid grid-cols-[86px_1fr] gap-4 border border-zinc-200 p-3 transition-all duration-300 hover:border-primary/30 hover:shadow-md">
                          <Link href={href} onClick={closeCartDrawer} className="relative h-24 overflow-hidden bg-[#fafafa]">
                            <Image src={line.product.image} alt={line.product.name} fill sizes="86px" className="object-contain p-2" />
                          </Link>
                          <div className="min-w-0">
                            <Link href={href} onClick={closeCartDrawer} className="line-clamp-2 font-bold leading-5 transition-colors hover:text-primary">
                              {line.product.name}
                            </Link>
                            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                              <span className="font-black text-primary">{formatPrice(line.product.price)}</span>
                              {line.product.oldPrice ? <span className="text-xs text-zinc-400 line-through">{formatPrice(line.product.oldPrice)}</span> : null}
                            </div>
                            <div className="mt-3 flex items-center justify-between gap-3">
                              <div className="flex border border-zinc-200">
                                <button type="button" className="grid h-8 w-8 place-items-center hover:bg-soft" onClick={() => decreaseQuantity(line.product.id)} aria-label="Decrease quantity">
                                  <Minus className="h-3.5 w-3.5" />
                                </button>
                                <span className="grid h-8 w-9 place-items-center text-sm font-bold">{line.quantity}</span>
                                <button type="button" className="grid h-8 w-8 place-items-center hover:bg-soft" onClick={() => increaseQuantity(line.product.id)} aria-label="Increase quantity">
                                  <Plus className="h-3.5 w-3.5" />
                                </button>
                              </div>
                              <div className="flex gap-1">
                                <button type="button" className="grid h-8 w-8 place-items-center text-zinc-500 transition-colors hover:text-primary" onClick={() => navigate(href)} aria-label="View product">
                                  <Edit3 className="h-4 w-4" />
                                </button>
                                <button type="button" className="grid h-8 w-8 place-items-center text-zinc-500 transition-colors hover:text-primary" onClick={() => removeFromCart(line.product.id)} aria-label="Remove product">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="sticky bottom-0 border-t border-zinc-100 bg-white p-5 shadow-[0_-12px_30px_rgba(34,34,34,0.08)]">
                  <div className="grid gap-3 text-sm">
                    <SummaryRow label="Subtotal" value={formatPrice(subtotal)} />
                    <SummaryRow label="Shipping" value="FREE" />
                    <SummaryRow label="Taxes" value={formatPrice(taxes)} />
                    <div className="mt-2 flex items-center justify-between border-t border-zinc-200 pt-4 text-base font-black">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <Button className="w-full" onClick={() => navigate("/cart")}>View Cart</Button>
                    <Button className="w-full" variant="secondary" onClick={() => navigate("/checkout")}>Checkout</Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="grid flex-1 place-items-center p-8 text-center">
                <div>
                  <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-soft text-primary">
                    <ShoppingCart className="h-9 w-9" />
                  </div>
                  <h3 className="mt-5 text-xl font-black">Your cart is empty</h3>
                  <p className="mt-2 text-sm text-zinc-500">Browse premium electronics and add your favorite gadgets.</p>
                  <Button className="mt-6" onClick={() => navigate("/products")}>Continue Shopping</Button>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-zinc-600">
      <span>{label}</span>
      <span className="font-bold text-ink">{value}</span>
    </div>
  );
}
