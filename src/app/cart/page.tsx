"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { Button } from "@/components/common/Button";
import { useCommerceStore } from "@/store/useCommerceStore";
import { formatPrice, slugify } from "@/utils/format";

const shipping = 0;
const taxes = 0;

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, increaseQuantity, decreaseQuantity, clearCart } = useCommerceStore();
  const subtotal = cart.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const total = subtotal + shipping + taxes;

  return (
    <main className="bg-soft">
      <section className="bg-white py-10 text-center">
        <div className="container-page">
          <h1 className="text-2xl font-black uppercase">Cart</h1>
          <div className="mt-3 flex items-center justify-center gap-2 text-xs font-black uppercase">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <span className="text-primary">Cart</span>
          </div>
        </div>
      </section>

      <section className="container-page grid gap-6 py-10 lg:grid-cols-[1fr_360px]">
        {cart.length ? (
          <>
            <div className="min-w-0 bg-white p-4 shadow-sm md:p-6">
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[800px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-zinc-200 text-xs font-black uppercase">
                      <th className="py-4">Product</th>
                      <th className="py-4">Price</th>
                      <th className="py-4 text-center">Quantity</th>
                      <th className="py-4 text-center">Action</th>
                      <th className="py-4 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((line) => (
                      <tr key={line.product.id} className="border-b border-zinc-100">
                        <td className="py-5">
                          <Link href={`/products/${slugify(line.product.name)}`} className="flex items-center gap-4">
                            <span className="relative h-24 w-24 shrink-0 bg-[#fafafa]">
                              <Image src={line.product.image} alt={line.product.name} fill sizes="96px" className="object-contain p-2" />
                            </span>
                            <span className="font-bold transition-colors hover:text-primary">{line.product.name}</span>
                          </Link>
                        </td>
                        <td className="py-5 font-bold text-primary">{formatPrice(line.product.price)}</td>
                        <td className="py-5">
                          <QuantityControl
                            quantity={line.quantity}
                            onMinus={() => decreaseQuantity(line.product.id)}
                            onPlus={() => increaseQuantity(line.product.id)}
                            onChange={(quantity) => updateQuantity(line.product.id, quantity)}
                          />
                        </td>
                        <td className="py-5 text-center">
                          <button type="button" className="mx-auto grid h-10 w-10 place-items-center text-zinc-500 transition-all hover:bg-primary hover:text-white" onClick={() => removeFromCart(line.product.id)} aria-label="Remove item">
                            <X className="h-5 w-5" />
                          </button>
                        </td>
                        <td className="py-5 text-right font-black text-secondary">{formatPrice(line.product.price * line.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid gap-4 md:hidden">
                {cart.map((line) => (
                  <div key={line.product.id} className="border border-zinc-200 p-4">
                    <div className="grid grid-cols-[92px_1fr] gap-4">
                      <Link href={`/products/${slugify(line.product.name)}`} className="relative h-24 bg-[#fafafa]">
                        <Image src={line.product.image} alt={line.product.name} fill sizes="92px" className="object-contain p-2" />
                      </Link>
                      <div>
                        <Link href={`/products/${slugify(line.product.name)}`} className="font-black hover:text-primary">{line.product.name}</Link>
                        <p className="mt-1 font-bold text-primary">{formatPrice(line.product.price)}</p>
                        <p className="mt-1 text-sm text-zinc-500">Line total: <span className="font-black text-secondary">{formatPrice(line.product.price * line.quantity)}</span></p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <QuantityControl
                        quantity={line.quantity}
                        onMinus={() => decreaseQuantity(line.product.id)}
                        onPlus={() => increaseQuantity(line.product.id)}
                        onChange={(quantity) => updateQuantity(line.product.id, quantity)}
                      />
                      <button type="button" className="grid h-10 w-10 place-items-center bg-primary text-white" onClick={() => removeFromCart(line.product.id)} aria-label="Remove item">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap justify-between gap-3">
                <Link href="/products" className="inline-flex h-10 items-center justify-center bg-secondary px-5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#4d42a2] hover:shadow-lg">
                  Continue Shopping
                </Link>
                <div className="flex flex-wrap gap-3">
                  <Button variant="light" className="ring-1 ring-zinc-200" onClick={clearCart}>Clear Cart</Button>
                  <Link href="/checkout" className="inline-flex h-10 items-center justify-center bg-primary px-5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent hover:shadow-lg">
                    Checkout
                  </Link>
                </div>
              </div>
            </div>

            <CartSummary subtotal={subtotal} total={total} />
          </>
        ) : (
          <div className="lg:col-span-2 grid min-h-[420px] place-items-center bg-white p-8 text-center shadow-sm">
            <div>
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-soft text-primary">
                <ShoppingCart className="h-9 w-9" />
              </div>
              <h2 className="mt-5 text-2xl font-black">Your cart is empty</h2>
              <p className="mt-2 text-zinc-500">Add smartphones, laptops, audio gear, and accessories to get started.</p>
              <Link href="/products" className="mt-6 inline-flex h-10 items-center justify-center bg-primary px-5 text-sm font-bold text-white transition-all hover:bg-accent">
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function QuantityControl({ quantity, onMinus, onPlus, onChange }: { quantity: number; onMinus: () => void; onPlus: () => void; onChange: (quantity: number) => void }) {
  return (
    <div className="mx-auto flex w-fit border border-zinc-200">
      <button type="button" className="grid h-10 w-10 place-items-center hover:bg-soft" onClick={onMinus}><Minus className="h-4 w-4" /></button>
      <input
        className="h-10 w-12 border-x border-zinc-200 text-center font-bold outline-none"
        value={quantity}
        onChange={(event) => onChange(Number(event.target.value) || 1)}
        aria-label="Quantity"
      />
      <button type="button" className="grid h-10 w-10 place-items-center hover:bg-soft" onClick={onPlus}><Plus className="h-4 w-4" /></button>
    </div>
  );
}

function CartSummary({ subtotal, total }: { subtotal: number; total: number }) {
  return (
    <aside className="h-fit bg-white p-6 shadow-sm">
      <h2 className="text-xl font-black uppercase">Cart Summary</h2>
      <div className="mt-5 grid gap-3 text-sm">
        <div className="flex justify-between"><span className="text-zinc-500">Subtotal</span><strong>{formatPrice(subtotal)}</strong></div>
        <div className="flex justify-between"><span className="text-zinc-500">Shipping</span><strong>FREE</strong></div>
        <div className="flex justify-between"><span className="text-zinc-500">Taxes</span><strong>{formatPrice(taxes)}</strong></div>
        <div className="mt-2 flex justify-between border-t border-zinc-200 pt-4 text-lg font-black"><span>Total</span><span>{formatPrice(total)}</span></div>
      </div>
      <Link href="/checkout" className="mt-6 inline-flex h-11 w-full items-center justify-center bg-primary px-5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent hover:shadow-lg">
        Proceed To Checkout
      </Link>
    </aside>
  );
}
