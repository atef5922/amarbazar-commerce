"use client";

import Image from "next/image";
import Link from "next/link";
import { CreditCard, Headphones, RefreshCw, Truck } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/common/Button";
import { ProductCard } from "@/components/product/ProductCard";
import { Rating } from "@/components/product/Rating";
import { brands } from "@/data/brands";
import { circularCategories, menuCategories } from "@/data/categories";
import { heroBanners, promoBanners, tripleBanners } from "@/data/banners";
import { instagram } from "@/data/instagram";
import { offers } from "@/data/offers";
import { products, hotDeal } from "@/data/products";
import { testimonials } from "@/data/testimonials";
import { formatPrice } from "@/utils/format";
import { useCommerceStore } from "@/store/useCommerceStore";
import { useUiStore } from "@/store/useUiStore";
import { cn } from "@/utils/cn";

const tabCategories = ["All", "Smartphones", "Laptops", "Headphones", "Smart Watches", "Speakers", "Accessories"] as const;
const productTabs = ["New Products", "Featured Products", "Best Sellers", "On Sale"];

export function HomePage() {
  const [categoryTab, setCategoryTab] = useState<(typeof tabCategories)[number]>("All");
  const [productTab, setProductTab] = useState("New Products");
  const { addToCart } = useCommerceStore();
  const categoryMenuOpen = useUiStore((state) => state.categoryMenuOpen);
  const hero = heroBanners[0];
  const categoryProducts = (categoryTab === "All" ? products : products.filter((product) => product.category === categoryTab)).slice(0, 5);
  const tabProducts = useMemo(() => {
    if (productTab === "On Sale") return products.filter((product) => product.badge === "Sale").slice(0, 8);
    if (productTab === "Best Sellers") return [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 8);
    if (productTab === "Featured Products") return products.filter((product) => product.rating >= 4.6).slice(0, 8);
    return products.slice(2, 10);
  }, [productTab]);

  return (
    <main>
      <section className="bg-soft py-5 lg:py-6">
        <div className={cn("container-page grid gap-4 transition-all duration-300", categoryMenuOpen ? "lg:grid-cols-[260px_1fr]" : "lg:grid-cols-1")}>
          {categoryMenuOpen ? (
          <aside id="homepage-category-menu" className="hidden bg-white p-6 text-sm text-zinc-600 shadow-sm lg:block">
            <div className="grid gap-3.5">
              {menuCategories.map((item) => (
                <Link key={item} href={`/shop?category=${encodeURIComponent(mapMenuCategory(item))}`} className="transition-all duration-300 hover:translate-x-1 hover:text-primary">{item}</Link>
              ))}
            </div>
          </aside>
          ) : null}
          <div className="grid gap-4">
            <div className="relative grid min-h-[420px] overflow-hidden rounded-md border border-white bg-white shadow-[0_18px_50px_rgba(34,34,34,0.07)] lg:min-h-[500px] lg:grid-cols-[0.9fr_1.1fr]">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(245,114,36,0.12),transparent_32%),radial-gradient(circle_at_85%_25%,rgba(91,77,184,0.14),transparent_34%)]" />
              <div className="relative z-10 flex flex-col justify-center px-6 py-10 md:px-12 lg:px-16">
                <p className="w-fit rounded-full bg-primary/10 px-4 py-1.5 text-xs font-black uppercase text-primary">{hero.eyebrow}</p>
                <h1 className="mt-2 text-4xl font-black uppercase leading-tight text-secondary md:text-6xl">{hero.title}</h1>
                <p className="mt-4 text-lg text-zinc-600">{hero.subtitle}</p>
                <Link href="/shop?offer=gadget-sale" className="mt-6 inline-flex h-10 items-center justify-center gap-2 bg-primary px-5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent hover:shadow-lg hover:shadow-primary/20">Shop Now</Link>
              </div>
              <div className="relative min-h-72 overflow-hidden bg-gradient-to-br from-white via-[#fff7f4] to-[#f2f0ff] lg:min-h-full">
                <div className="absolute bottom-8 right-8 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
                <Image src={hero.image} alt={hero.title} fill priority sizes="720px" className="object-contain p-6 transition-transform duration-700 hover:scale-[1.04] md:p-10" />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {promoBanners.map((banner) => (
                <Link key={banner.id} href={getBannerLink(banner.title)} className="group relative grid min-h-44 grid-cols-[1fr_45%] items-center overflow-hidden rounded-md border border-white bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white via-white to-primary/5" />
                  <div className="relative z-10">
                    <p className="text-sm font-black uppercase text-primary">{banner.label}</p>
                    <h2 className="text-2xl font-black uppercase text-secondary">{banner.title}</h2>
                    <span className="mt-3 inline-block text-xs font-bold transition-colors duration-300 group-hover:text-primary">Shop Now</span>
                  </div>
                  <div className="relative z-10 h-full min-h-32">
                    <Image src={banner.image} alt={banner.title} fill sizes="360px" className="object-contain object-right transition-transform duration-500 group-hover:scale-105" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-100 bg-white py-5">
        <div className="container-page flex items-center gap-6 overflow-x-auto text-xs uppercase no-scrollbar">
          <span className="shrink-0 font-black text-primary">Top Brand</span>
          {brands.map((brand) => (
            <Link key={brand} href={`/shop?brand=${encodeURIComponent(brand)}`} className="hover-underline shrink-0 font-semibold text-zinc-500 transition-colors duration-300 hover:text-primary">{brand}</Link>
          ))}
        </div>
      </section>

      <section className="bg-soft py-10 lg:py-12">
        <div className="container-page grid min-w-0 gap-5 xl:grid-cols-[300px_minmax(0,1fr)_300px] 2xl:grid-cols-[320px_minmax(0,1fr)_320px]">
          <SaleRail title="On Sale" items={products.slice(5, 9)} />
          <div className="min-w-0 rounded-md bg-white p-6 shadow-sm lg:p-8">
            <h2 className="text-center text-sm font-black uppercase">Today's Hot Deal</h2>
            <div className="mt-6 grid min-w-0 gap-7 lg:grid-cols-[minmax(240px,320px)_minmax(0,1fr)] 2xl:grid-cols-[320px_minmax(0,1fr)_88px]">
              <div className="relative aspect-square rounded border border-zinc-200 bg-[#fafafa]">
                <Image src={hotDeal.image} alt={hotDeal.name} fill sizes="260px" className="object-contain p-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-2xl font-black">{hotDeal.name}</h3>
                <Rating value={hotDeal.rating} />
                <p className="mt-3 max-w-md text-sm leading-6 text-zinc-500">{hotDeal.description}</p>
                <div className="mt-3 flex gap-3">
                  <span className="font-black text-primary">{formatPrice(hotDeal.price)}</span>
                  <span className="text-zinc-400 line-through">{formatPrice(hotDeal.oldPrice ?? hotDeal.price)}</span>
                </div>
                <p className="mt-3 text-xs uppercase text-zinc-400">Expired</p>
                <Button className="mt-5" onClick={() => addToCart(hotDeal)}>Shop Now</Button>
              </div>
              <div className="hidden gap-3 2xl:grid">
                {products.slice(0, 3).map((item) => (
                  <div key={item.id} className="relative h-20 rounded border border-zinc-200 bg-[#fafafa] transition-all duration-300 hover:border-primary/30 hover:shadow-md">
                    <Image src={item.image} alt={item.name} fill sizes="80px" className="object-contain p-2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <SaleRail title="On Sale" items={products.slice(6, 10)} />
        </div>
      </section>

      <section className="bg-white py-10 lg:py-12">
        <TabBar tabs={tabCategories} active={categoryTab} onChange={(tab) => setCategoryTab(tab as (typeof tabCategories)[number])} />
        <div className="container-page mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {categoryProducts.length ? categoryProducts.map((product) => <ProductCard key={product.id} product={product} />) : products.slice(0, 5).map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section className="bg-secondary py-6 text-white">
        <div className="container-page grid gap-5 text-sm font-black uppercase sm:grid-cols-2 lg:grid-cols-4">
          {[
            [Truck, "Free Shipping"],
            [Headphones, "24x7 Service"],
            [RefreshCw, "Easy Return"],
            [CreditCard, "Online Payment"]
          ].map(([Icon, text]) => (
            <div key={String(text)} className="flex items-center justify-center gap-3 transition-transform duration-300 hover:-translate-y-1">
              <Icon className="h-6 w-6" />
              <span>{String(text)}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-soft py-6">
        <div className="container-page grid gap-4 md:grid-cols-3">
          {tripleBanners.map((banner) => (
            <Link key={banner.id} href={getBannerLink(banner.title)} className="group relative grid min-h-52 grid-cols-[1fr_48%] items-center overflow-hidden rounded-md border border-white bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white via-white to-secondary/5" />
              <div className="relative z-10">
                <p className="text-lg text-primary">{banner.label}</p>
                <h2 className="text-2xl font-black text-secondary">{banner.title}</h2>
                <span className="mt-4 inline-block text-xs font-bold transition-colors duration-300 group-hover:text-primary">Shop Now</span>
              </div>
              <div className="relative z-10 h-full min-h-36">
                <Image src={banner.image} alt={banner.title} fill sizes="300px" className="object-contain object-right transition-transform duration-500 group-hover:scale-105" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white py-10 lg:py-12">
        <TabBar tabs={productTabs} active={productTab} onChange={setProductTab} />
        <div className="container-page mt-8 grid gap-6 xl:grid-cols-2">
          {[0, 1].map((column) => (
            <div key={column} className="grid grid-cols-1 gap-x-8 gap-y-2 bg-white p-5 shadow-sm sm:grid-cols-2">
              {tabProducts.slice(column * 4, column * 4 + 4).map((product) => <ProductCard key={product.id} product={product} compact />)}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-soft py-5">
        <div className="container-page grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {offers.map((offer, index) => (
            <Link
              key={offer}
              href={getOfferLink(offer)}
              className={cn(
                "grid h-16 place-items-center border border-zinc-100 text-center text-sm font-black uppercase shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-primary hover:text-white hover:shadow-xl",
                index === 4 ? "bg-primary text-white" : "bg-white text-zinc-600"
              )}
            >
              {offer}
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-secondary py-10 text-white lg:py-12">
        <div className="container-page flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="text-sm font-bold uppercase">Save up to 30% to 40% off</p>
            <h2 className="text-3xl font-black uppercase">OMG! Just Look At The Great Deals!</h2>
          </div>
          <Button variant="light">View More</Button>
        </div>
      </section>

      <section className="bg-primary py-10 text-white lg:py-12">
        <div className="container-page grid grid-cols-2 gap-7 sm:grid-cols-3 md:grid-cols-5">
          {circularCategories.map((category) => (
            <Link key={category.name} href={`/shop?category=${encodeURIComponent(mapCircleCategory(category.name))}`} className="group text-center text-xs font-black uppercase transition-colors duration-300 hover:text-secondary">
              <span className="relative mx-auto mb-3 grid h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-white shadow-soft ring-0 ring-white/40 transition-all duration-300 group-hover:ring-8">
                <Image src={category.image} alt={category.name} fill sizes="112px" className="rounded-full object-cover p-1 transition-transform duration-500 group-hover:scale-110" />
              </span>
              {category.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white py-12 lg:py-14">
        <h2 className="text-center text-sm font-black uppercase tracking-wide">Special Products</h2>
        <div className="container-page mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.slice(0, 5).map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section className="bg-secondary py-12 text-white lg:py-14">
        <div className="container-page flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
          <Image src={testimonials[0].image} alt={testimonials[0].name} width={96} height={96} className="rounded-full border-4 border-white" />
          <div>
            <h3 className="font-black uppercase">{testimonials[0].name}</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/85">{testimonials[0].quote}</p>
          </div>
        </div>
      </section>

      <section className="bg-soft py-12 lg:py-14">
        <div className="container-page grid grid-cols-2 overflow-hidden border-8 border-white shadow-sm sm:grid-cols-3 md:grid-cols-6">
          {instagram.map((image, index) => (
            <div key={image} className="group relative aspect-square overflow-hidden">
              <Image src={image} alt={`Instagram ${index + 1}`} fill sizes="240px" className="object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 grid place-items-center bg-primary/0 text-sm font-black uppercase text-white transition-all duration-300 group-hover:bg-primary/70">
                <span className={cn("translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100", index === 3 && "translate-y-0 opacity-100")}>Instagram</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function SaleRail({ title, items }: { title: string; items: typeof products }) {
  return (
    <aside className="rounded-md bg-white p-5 shadow-sm">
      <h2 className="border-b border-zinc-100 pb-4 text-sm font-black uppercase">{title}</h2>
      <div>{items.map((product) => <ProductCard key={product.id} product={product} compact />)}</div>
    </aside>
  );
}

function TabBar({ tabs, active, onChange }: { tabs: readonly string[]; active: string; onChange: (tab: string) => void }) {
  return (
    <div className="container-page flex justify-center overflow-x-auto no-scrollbar">
      <div className="flex min-w-max items-center gap-8 text-sm font-black uppercase tracking-wide">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`relative px-1 pb-3 pt-2 transition-colors duration-300 ${active === tab ? "text-primary" : "text-zinc-600 hover:text-primary"}`}
            onClick={() => onChange(tab)}
          >
            {tab.toUpperCase()}
            {active === tab ? <span className="absolute inset-x-0 bottom-0 mx-auto h-1 w-full rounded-full bg-primary" /> : null}
          </button>
        ))}
      </div>
    </div>
  );
}

function mapMenuCategory(category: string) {
  if (category.includes("Router")) return "Routers";
  if (category.includes("Charger")) return "Chargers";
  if (category.includes("Speaker")) return "Speakers";
  if (category.includes("Camera")) return "Cameras";
  if (category.includes("Laptop")) return "Laptops";
  if (category.includes("Watch")) return "Smart Watches";
  if (category.includes("Headphone") || category.includes("Earbuds")) return "Headphones";
  if (category.includes("Accessory") || category.includes("Power Bank") || category.includes("Gaming") || category.includes("Computer")) return "Accessories";
  return "Smartphones";
}

function mapCircleCategory(category: string) {
  if (category === "Phones") return "Smartphones";
  if (category === "Audio") return "Headphones";
  if (category === "Camera") return "Cameras";
  return category;
}

function getOfferLink(offer: string) {
  const map: Record<string, string> = {
    "Phone Deals": "/shop?offer=phone-deals",
    "Under à§³999": "/shop?maxPrice=999",
    "Free Delivery": "/shop?offer=free-delivery",
    "Gadget Sale": "/shop?offer=gadget-sale",
    "Laptop Offer": "/shop?offer=laptop-offer",
    "Accessories Sale": "/shop?offer=accessories-sale"
  };
  return map[offer] ?? "/shop";
}

function getBannerLink(title: string) {
  if (title.includes("Laptop")) return "/shop?category=Laptops";
  if (title.includes("Camera")) return "/shop?category=Cameras";
  if (title.includes("Watch")) return "/shop?category=Smart%20Watches";
  if (title.includes("Headphone")) return "/shop?category=Headphones";
  return "/shop?category=Smartphones";
}
