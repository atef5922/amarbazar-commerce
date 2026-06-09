"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Filter,
  Grid2X2,
  Heart,
  List,
  PackageSearch,
  RotateCcw,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Star,
  X
} from "lucide-react";
import { useMemo, useState } from "react";
import { PageHero } from "@/components/common/PageHero";
import { Button } from "@/components/common/Button";
import { ProductCard } from "@/components/product/ProductCard";
import { Rating } from "@/components/product/Rating";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { brands } from "@/data/brands";
import type { Product } from "@/types";
import { formatPrice, slugify } from "@/utils/format";
import { cn } from "@/utils/cn";
import { useCommerceStore } from "@/store/useCommerceStore";

type SortOption = "default" | "low" | "high" | "newest" | "rated" | "selling";
type ViewMode = "grid" | "list";

const pageSize = 10;
const collections = ["Smartphone Deals", "Laptop Deals", "Audio Zone", "Power Essentials", "Gadget Offers"];

const initialFilters = {
  category: "All",
  brand: "All",
  maxPrice: 50000,
  rating: 0,
  availability: "All",
  discount: false,
  newArrival: false,
  onSale: false,
  hotDeal: false
};

export function ProductsPageClient() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("default");
  const [view, setView] = useState<ViewMode>("grid");
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtered = useMemo(() => {
    const result = products
      .filter((product) => product.name.toLowerCase().includes(query.toLowerCase()))
      .filter((product) => filters.category === "All" || product.category === filters.category)
      .filter((product) => filters.brand === "All" || product.brand === filters.brand)
      .filter((product) => product.price <= filters.maxPrice)
      .filter((product) => product.rating >= filters.rating)
      .filter((product) => filters.availability === "All" || (filters.availability === "In Stock" ? product.stock > 0 : product.stock === 0))
      .filter((product) => !filters.discount || Boolean(product.oldPrice))
      .filter((product) => !filters.newArrival || product.badge === "New")
      .filter((product) => !filters.onSale || product.badge === "Sale")
      .filter((product) => !filters.hotDeal || product.badge === "Hot");

    if (sort === "low") return [...result].sort((a, b) => a.price - b.price);
    if (sort === "high") return [...result].sort((a, b) => b.price - a.price);
    if (sort === "newest") return [...result].sort((a, b) => b.id.localeCompare(a.id));
    if (sort === "rated") return [...result].sort((a, b) => b.rating - a.rating);
    if (sort === "selling") return [...result].sort((a, b) => b.reviews - a.reviews);
    return result;
  }, [filters, query, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  function updateFilter<K extends keyof typeof filters>(key: K, value: (typeof filters)[K]) {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  }

  function applyCollection(collection: string) {
    const categoryMap: Record<string, string> = {
      "Smartphone Deals": "Smartphones",
      "Laptop Deals": "Laptops",
      "Audio Zone": "Headphones",
      "Power Essentials": "Accessories",
      "Gadget Offers": "All"
    };
    setFilters({ ...initialFilters, category: categoryMap[collection], discount: collection === "Gadget Offers" });
    setPage(1);
  }

  function resetFilters() {
    setQuery("");
    setSort("default");
    setFilters(initialFilters);
    setPage(1);
  }

  return (
    <main className="bg-soft">
      <PageHero title="Products" subtitle="Discover quality products from AmarBazar" />

      <section className="bg-white py-5">
        <div className="container-page flex gap-3 overflow-x-auto no-scrollbar">
          {collections.map((collection) => (
            <button
              key={collection}
              onClick={() => applyCollection(collection)}
              className="shrink-0 border border-zinc-100 bg-white px-5 py-3 text-sm font-bold shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:text-primary hover:shadow-xl"
            >
              {collection}
            </button>
          ))}
        </div>
      </section>

      <section className="py-8 lg:py-10">
        <div className="container-page grid gap-6 lg:grid-cols-[300px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-36 bg-white p-6 shadow-sm">
              <FilterSidebar filters={filters} updateFilter={updateFilter} resetFilters={resetFilters} />
            </div>
          </aside>

          <div>
            <ProductToolbar
              query={query}
              setQuery={(value) => {
                setQuery(value);
                setPage(1);
              }}
              sort={sort}
              setSort={setSort}
              view={view}
              setView={setView}
              count={filtered.length}
              onFilterClick={() => setDrawerOpen(true)}
            />

            {visible.length ? (
              <div className={cn("mt-6", view === "grid" ? "grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5" : "grid gap-4")}>
                {visible.map((product) => view === "grid" ? <ProductCard key={product.id} product={product} /> : <ProductListCard key={product.id} product={product} />)}
              </div>
            ) : (
              <div className="mt-6 grid min-h-80 place-items-center bg-white p-8 text-center shadow-sm">
                <div>
                  <PackageSearch className="mx-auto h-12 w-12 text-primary" />
                  <h2 className="mt-4 text-2xl font-black">No products found</h2>
                  <p className="mt-2 text-zinc-500">Try changing your search or filters.</p>
                  <Button className="mt-5" onClick={resetFilters}><RotateCcw className="h-4 w-4" /> Reset Filters</Button>
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setPage(index + 1)}
                  className={cn(
                    "grid h-10 w-10 place-items-center border border-zinc-100 bg-white text-sm font-bold transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white",
                    page === index + 1 && "border-primary bg-primary text-white"
                  )}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-3 border-t border-zinc-100 bg-white p-2 shadow-2xl lg:hidden">
        <button className="flex items-center justify-center gap-2 py-3 text-sm font-bold" onClick={() => setDrawerOpen(true)}>
          <Filter className="h-4 w-4" /> Filter
        </button>
        <button className="flex items-center justify-center gap-2 py-3 text-sm font-bold" onClick={() => setSort(sort === "low" ? "high" : "low")}>
          <SlidersHorizontal className="h-4 w-4" /> Sort
        </button>
        <Link href="/cart" className="flex items-center justify-center gap-2 bg-primary py-3 text-sm font-bold text-white">
          <ShoppingCart className="h-4 w-4" /> Cart
        </Link>
      </div>

      {drawerOpen ? (
        <div className="fixed inset-0 z-50 bg-black/40 lg:hidden">
          <div className="ml-auto h-full w-[min(360px,calc(100%-32px))] overflow-y-auto bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-black">Filters</h2>
              <button className="grid h-9 w-9 place-items-center bg-zinc-100" onClick={() => setDrawerOpen(false)}><X className="h-4 w-4" /></button>
            </div>
            <FilterSidebar filters={filters} updateFilter={updateFilter} resetFilters={resetFilters} />
          </div>
        </div>
      ) : null}
    </main>
  );
}

function ProductToolbar({
  query,
  setQuery,
  sort,
  setSort,
  view,
  setView,
  count,
  onFilterClick
}: {
  query: string;
  setQuery: (value: string) => void;
  sort: SortOption;
  setSort: (value: SortOption) => void;
  view: ViewMode;
  setView: (value: ViewMode) => void;
  count: number;
  onFilterClick: () => void;
}) {
  return (
    <div className="bg-white p-4 shadow-sm lg:p-5">
      <div className="grid gap-4 xl:grid-cols-[1fr_auto_auto_auto] xl:items-center">
        <label className="flex h-12 min-w-0 items-center border border-zinc-200 px-3 transition-colors focus-within:border-primary">
          <Search className="mr-2 h-4 w-4 shrink-0 text-zinc-400" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 outline-none" placeholder="Search AmarBazar products" />
        </label>
        <p className="text-sm font-semibold text-zinc-500">{count} products found</p>
        <select value={sort} onChange={(event) => setSort(event.target.value as SortOption)} className="h-12 border border-zinc-200 px-3 text-sm outline-none focus:border-primary">
          <option value="default">Default</option>
          <option value="low">Price Low to High</option>
          <option value="high">Price High to Low</option>
          <option value="newest">Newest</option>
          <option value="rated">Best Rated</option>
          <option value="selling">Best Selling</option>
        </select>
        <div className="flex gap-2">
          <button className="grid h-12 w-12 place-items-center border border-zinc-200 transition-colors hover:border-primary hover:text-primary lg:hidden" onClick={onFilterClick}><Filter className="h-4 w-4" /></button>
          <button className={cn("grid h-12 w-12 place-items-center border border-zinc-200 transition-colors hover:border-primary hover:text-primary", view === "grid" && "border-primary text-primary")} onClick={() => setView("grid")}><Grid2X2 className="h-4 w-4" /></button>
          <button className={cn("grid h-12 w-12 place-items-center border border-zinc-200 transition-colors hover:border-primary hover:text-primary", view === "list" && "border-primary text-primary")} onClick={() => setView("list")}><List className="h-4 w-4" /></button>
        </div>
      </div>
    </div>
  );
}

function FilterSidebar({
  filters,
  updateFilter,
  resetFilters
}: {
  filters: typeof initialFilters;
  updateFilter: <K extends keyof typeof initialFilters>(key: K, value: (typeof initialFilters)[K]) => void;
  resetFilters: () => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-black uppercase"><SlidersHorizontal className="h-4 w-4 text-primary" /> Advanced Filters</h2>
        <button onClick={resetFilters} className="text-xs font-bold text-primary">Reset</button>
      </div>
      <FilterSelect label="Category" value={filters.category} onChange={(value) => updateFilter("category", value)} options={["All", ...categories.map((item) => String(item.name))]} />
      <FilterSelect label="Brand" value={filters.brand} onChange={(value) => updateFilter("brand", value)} options={["All", ...brands]} />
      <label className="mt-5 block text-sm font-bold">
        Price up to {formatPrice(filters.maxPrice)}
        <input type="range" min="500" max="50000" step="500" value={filters.maxPrice} onChange={(event) => updateFilter("maxPrice", Number(event.target.value))} className="mt-3 w-full accent-primary" />
      </label>
      <FilterSelect label="Rating" value={String(filters.rating)} onChange={(value) => updateFilter("rating", Number(value))} options={["0", "3", "4", "4.5"]} />
      <FilterSelect label="Availability" value={filters.availability} onChange={(value) => updateFilter("availability", value)} options={["All", "In Stock", "Out of Stock"]} />
      <div className="mt-5 grid gap-3 text-sm">
        {[
          ["discount", "Discount"],
          ["newArrival", "New arrival"],
          ["onSale", "On sale"],
          ["hotDeal", "Hot deal"]
        ].map(([key, label]) => (
          <label key={key} className="flex items-center gap-2 font-semibold text-zinc-600">
            <input type="checkbox" checked={Boolean(filters[key as keyof typeof filters])} onChange={(event) => updateFilter(key as keyof typeof filters, event.target.checked as never)} className="accent-primary" />
            {label}
          </label>
        ))}
      </div>
    </div>
  );
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="mt-5 block text-sm font-bold">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 h-11 w-full border border-zinc-200 px-3 text-sm outline-none focus:border-primary">
        {options.map((option) => <option key={option} value={option}>{label === "Rating" && option !== "0" ? `${option}+ stars` : option === "0" ? "Any" : option}</option>)}
      </select>
    </label>
  );
}

function ProductListCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, toggleCompare, openQuickView } = useCommerceStore();

  return (
    <article className="grid gap-5 border border-zinc-200 bg-white p-4 shadow-[0_8px_24px_rgba(34,34,34,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl md:grid-cols-[220px_1fr_auto]">
      <Link href={`/products/${slugify(product.name)}`} className="relative h-56 overflow-hidden bg-[#fafafa]">
        <Image src={product.image} alt={product.name} fill sizes="220px" className="object-contain p-6 transition-transform duration-500 hover:scale-105" />
      </Link>
      <div>
        <p className="text-xs font-black uppercase text-primary">{product.badge ?? "New"} {product.discount ? `· ${product.discount}` : ""}</p>
        <Link href={`/products/${slugify(product.name)}`} className="mt-2 block text-2xl font-black transition-colors hover:text-primary">{product.name}</Link>
        <div className="mt-2 flex items-center gap-3"><Rating value={product.rating} /><span className="text-sm text-zinc-500">{product.reviews} reviews</span></div>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600">{product.description}</p>
        <p className="mt-3 text-sm font-bold text-emerald-600">{product.stock > 0 ? "In Stock" : "Out of Stock"}</p>
      </div>
      <div className="flex flex-col justify-center gap-3 md:min-w-44">
        <p className="text-2xl font-black text-secondary">{formatPrice(product.price)}</p>
        {product.oldPrice ? <p className="text-sm text-zinc-400 line-through">{formatPrice(product.oldPrice)}</p> : null}
        <div className="grid grid-cols-4 border border-zinc-100">
          <button className="grid h-10 place-items-center hover:bg-primary hover:text-white" onClick={() => addToCart(product)}><ShoppingCart className="h-4 w-4" /></button>
          <button className="grid h-10 place-items-center hover:bg-primary hover:text-white" onClick={() => toggleWishlist(product)}><Heart className="h-4 w-4" /></button>
          <button className="grid h-10 place-items-center hover:bg-primary hover:text-white" onClick={() => openQuickView(product)}><Search className="h-4 w-4" /></button>
          <button className="grid h-10 place-items-center hover:bg-primary hover:text-white" onClick={() => toggleCompare(product)}><Star className="h-4 w-4" /></button>
        </div>
      </div>
    </article>
  );
}
