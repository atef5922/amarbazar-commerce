"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { Camera, CheckCircle2, CreditCard, Facebook, GitCompare, Heart, Minus, Plus, ShieldCheck, Truck, Wifi } from "lucide-react";
import type { Product } from "@/types";
import { products } from "@/data/products";
import { brands } from "@/data/brands";
import { categories } from "@/data/categories";
import { ProductCard } from "@/components/product/ProductCard";
import { Rating } from "@/components/product/Rating";
import { Button } from "@/components/common/Button";
import { useCommerceStore } from "@/store/useCommerceStore";
import { formatPrice, slugify } from "@/utils/format";
import { cn } from "@/utils/cn";

const tabs = ["Description", "Specifications", "Reviews", "Shipping & Return"];

export function ProductDetailsClient({ product, notFound = false }: { product: Product; notFound?: boolean }) {
  if (notFound) {
    return (
      <main className="bg-soft">
        <section className="bg-white py-10 text-center">
          <div className="container-page">
            <h1 className="text-2xl font-black uppercase">Product Not Found</h1>
            <div className="mt-3 flex items-center justify-center gap-2 text-xs font-black uppercase">
              <Link href="/" className="hover:text-primary">Home</Link>
              <span>/</span>
              <Link href="/products" className="hover:text-primary">Products</Link>
              <span>/</span>
              <span className="text-primary">Not Found</span>
            </div>
          </div>
        </section>
        <section className="container-page grid min-h-[420px] place-items-center py-10">
          <div className="bg-white p-8 text-center shadow-sm">
            <h2 className="text-2xl font-black">This product is unavailable</h2>
            <p className="mt-2 text-zinc-500">Browse our electronics catalog to find current AmarBazar products.</p>
            <Link href="/products" className="mt-6 inline-flex h-10 items-center justify-center bg-primary px-5 text-sm font-bold text-white transition-all hover:bg-accent">
              Browse Products
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.image);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const { addToCart, toggleWishlist, toggleCompare } = useCommerceStore();
  const gallery = useMemo(() => [product.image, product.hoverImage, ...products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 2).map((item) => item.image)].filter(Boolean) as string[], [product]);
  const related = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 5);
  const bestSellers = [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 3);
  const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;

  const addSelected = () => addToCart(product, quantity);

  return (
    <main className="bg-soft pb-28 lg:pb-16">
      <section className="bg-white py-10 text-center">
        <div className="container-page">
          <h1 className="text-2xl font-black uppercase">{notFound ? "Product Not Found" : product.name}</h1>
          <div className="mt-3 flex items-center justify-center gap-2 text-xs font-black uppercase">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-primary">Products</Link>
            <span>/</span>
            <span className="text-primary">{notFound ? "Not Found" : product.name}</span>
          </div>
        </div>
      </section>

      <section className="container-page grid gap-8 py-10 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="hidden space-y-5 lg:block">
          <SidebarBlock title="Brand">
            {brands.slice(0, 10).map((brand) => (
              <Link key={brand} href="/products" className={cn("block py-1.5 text-sm font-semibold text-zinc-500 hover:text-primary", brand === product.brand && "text-primary")}>{brand}</Link>
            ))}
          </SidebarBlock>
          <SidebarBlock title="Category">
            {categories.slice(0, 9).map((category) => (
              <Link key={category.id} href={`/category/${slugify(String(category.name))}`} className={cn("block py-1.5 text-sm font-semibold text-zinc-500 hover:text-primary", category.name === product.category && "text-primary")}>{category.name}</Link>
            ))}
          </SidebarBlock>
          <div className="bg-white p-5 shadow-sm">
            {[
              [Truck, "Free Shipping", "Fast delivery across Bangladesh"],
              [ShieldCheck, "Warranty Support", "Official warranty available"],
              [CreditCard, "Flexible Payment", "COD, bKash, Nagad and card"]
            ].map(([Icon, title, text]) => (
              <div key={String(title)} className="flex gap-3 border-b border-zinc-100 py-4 last:border-b-0">
                <Icon className="h-7 w-7 shrink-0 text-primary" />
                <div>
                  <h3 className="font-black">{String(title)}</h3>
                  <p className="text-xs leading-5 text-zinc-500">{String(text)}</p>
                </div>
              </div>
            ))}
          </div>
          <SidebarBlock title="Best Selling Electronics">
            <div className="grid gap-4">
              {bestSellers.map((item) => (
                <Link key={item.id} href={`/products/${slugify(item.name)}`} className="grid grid-cols-[72px_1fr] gap-3">
                  <span className="relative h-20 bg-[#fafafa]"><Image src={item.image} alt={item.name} fill sizes="72px" className="object-contain p-2" /></span>
                  <span>
                    <Rating value={item.rating} />
                    <span className="mt-1 line-clamp-2 text-sm font-bold hover:text-primary">{item.name}</span>
                    <span className="text-sm font-black text-primary">{formatPrice(item.price)}</span>
                  </span>
                </Link>
              ))}
            </div>
          </SidebarBlock>
        </aside>

        <div className="min-w-0">
          <div className="grid gap-8 bg-white p-5 shadow-sm md:p-7 xl:grid-cols-[minmax(320px,560px)_1fr]">
            <div>
              <div className="relative aspect-square overflow-hidden bg-[#f8fafc]">
                <Image src={activeImage} alt={product.name} fill sizes="560px" className="object-contain p-8 md:p-12" priority />
              </div>
              <div className="mt-4 grid grid-cols-4 gap-3">
                {gallery.map((image) => (
                  <button key={image} type="button" className={cn("relative aspect-square border bg-white transition-all duration-300 hover:border-primary", activeImage === image ? "border-primary shadow-md" : "border-zinc-200")} onClick={() => setActiveImage(image)}>
                    <Image src={image} alt={product.name} fill sizes="120px" className="object-contain p-3" />
                  </button>
                ))}
              </div>
            </div>

            <div className="min-w-0">
              <p className="text-xs font-black uppercase text-primary">{product.brand}</p>
              <h2 className="mt-2 text-3xl font-black leading-tight lg:text-4xl">{product.name}</h2>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Rating value={product.rating} />
                <span className="text-sm text-zinc-500">({product.reviews} reviews)</span>
                <span className="rounded bg-soft px-2 py-1 text-xs font-bold text-secondary">Best Seller</span>
              </div>
              <div className="mt-5 flex flex-wrap items-end gap-3">
                <span className="text-3xl font-black text-primary">{formatPrice(product.price)}</span>
                {product.oldPrice ? <span className="text-lg text-zinc-400 line-through">{formatPrice(product.oldPrice)}</span> : null}
                {discount ? <span className="pb-1 text-sm font-black uppercase text-secondary">{discount}% OFF</span> : null}
              </div>
              <p className="mt-3 flex items-center gap-2 text-sm font-bold text-emerald-600"><CheckCircle2 className="h-4 w-4" /> {product.stock > 0 ? "In Stock" : "Out of Stock"}</p>
              <p className="mt-5 max-w-2xl leading-7 text-zinc-600">{product.description}</p>

              <div className="mt-5 rounded border border-dashed border-primary/40 bg-soft p-4 text-sm">
                <span className="font-black text-primary">GADGET10</span>
                <span className="ml-2 text-zinc-600">Get extra 10% off on selected accessories with this product.</span>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <span className="text-sm font-black uppercase">Quantity</span>
                <div className="flex border border-zinc-200">
                  <button type="button" className="grid h-11 w-11 place-items-center hover:bg-soft" onClick={() => setQuantity((value) => Math.max(1, value - 1))}><Minus className="h-4 w-4" /></button>
                  <span className="grid h-11 w-12 place-items-center font-black">{quantity}</span>
                  <button type="button" className="grid h-11 w-11 place-items-center hover:bg-soft" onClick={() => setQuantity((value) => value + 1)}><Plus className="h-4 w-4" /></button>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button onClick={addSelected}>Add To Cart</Button>
                <Button variant="secondary" onClick={() => toggleWishlist(product)}><Heart className="h-4 w-4" /> Wishlist</Button>
                <Button variant="light" className="ring-1 ring-zinc-200" onClick={() => toggleCompare(product)}><GitCompare className="h-4 w-4" /> Compare</Button>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {[
                  [Truck, "Free Shipping"],
                  [ShieldCheck, "1 Year Warranty"],
                  [Wifi, "Original Product"]
                ].map(([Icon, text]) => (
                  <div key={String(text)} className="grid place-items-center gap-2 border border-zinc-200 p-4 text-center text-xs font-black uppercase transition-all duration-300 hover:border-primary hover:text-primary">
                    <Icon className="h-6 w-6" />
                    {String(text)}
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-3 text-zinc-400">
                <span className="text-sm font-black uppercase text-ink">Share</span>
                {[Facebook, Camera, Wifi].map((Icon, index) => <Icon key={index} className="h-4 w-4 transition-colors hover:text-primary" />)}
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white p-5 shadow-sm md:p-8">
            <div className="flex gap-5 overflow-x-auto border-b border-zinc-100 text-xs font-black uppercase no-scrollbar">
              {tabs.map((tab) => (
                <button key={tab} type="button" className={cn("shrink-0 border-b-2 px-1 pb-4 transition-colors", activeTab === tab ? "border-primary text-primary" : "border-transparent text-zinc-500 hover:text-primary")} onClick={() => setActiveTab(tab)}>
                  {tab}
                </button>
              ))}
            </div>
            <div className="mt-6 text-sm leading-7 text-zinc-600">
              {activeTab === "Description" ? <p>{product.description} AmarBazar sources original electronics for Bangladesh shoppers with clear warranty support, reliable delivery, and responsive after-sales service.</p> : null}
              {activeTab === "Specifications" ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ["Brand", product.brand],
                    ["Model", product.name],
                    ["Warranty", "Official service warranty"],
                    ["Connectivity", product.category === "Headphones" ? "Bluetooth / USB-C" : "Wi-Fi / Bluetooth"],
                    ["Battery", product.category === "Laptops" ? "All-day battery" : "Fast charging supported"],
                    ["Display", product.category === "Smartphones" ? "AMOLED display" : "Premium panel"],
                    ["Storage", "Variant based"],
                    ["Origin", "Official / authorized import"]
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between border border-zinc-100 px-4 py-3"><span className="font-bold text-ink">{label}</span><span>{value}</span></div>
                  ))}
                </div>
              ) : null}
              {activeTab === "Reviews" ? <p>Customers rate this item {product.rating}/5 from {product.reviews} verified reviews. Review submission UI can be connected later.</p> : null}
              {activeTab === "Shipping & Return" ? <p>Free shipping is available for eligible Dhaka orders. Returns and exchanges follow AmarBazar electronics inspection and warranty policy.</p> : null}
            </div>
          </div>
        </div>
      </section>

      <section className="container-page pb-12">
        <h2 className="text-2xl font-black uppercase">Related Products</h2>
        <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {(related.length ? related : products.slice(0, 5)).map((item) => <ProductCard key={item.id} product={item} />)}
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-100 bg-white/95 shadow-[0_-10px_30px_rgba(34,34,34,0.08)] backdrop-blur">
        <div className="container-page flex items-center gap-3 py-3">
          <div className="relative hidden h-14 w-14 shrink-0 bg-[#fafafa] sm:block">
            <Image src={product.image} alt={product.name} fill sizes="56px" className="object-contain p-1.5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-black">{product.name}</p>
            <p className="font-black text-primary">{formatPrice(product.price)}</p>
          </div>
          <div className="hidden border border-zinc-200 sm:flex">
            <button type="button" className="grid h-10 w-10 place-items-center hover:bg-soft" onClick={() => setQuantity((value) => Math.max(1, value - 1))}><Minus className="h-4 w-4" /></button>
            <span className="grid h-10 w-10 place-items-center font-black">{quantity}</span>
            <button type="button" className="grid h-10 w-10 place-items-center hover:bg-soft" onClick={() => setQuantity((value) => value + 1)}><Plus className="h-4 w-4" /></button>
          </div>
          <Button onClick={addSelected}>Add To Cart</Button>
        </div>
      </div>
    </main>
  );
}

function SidebarBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="bg-white p-5 shadow-sm">
      <h2 className="mb-4 border-b border-zinc-100 pb-3 text-sm font-black uppercase">{title}</h2>
      {children}
    </div>
  );
}
