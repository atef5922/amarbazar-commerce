"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Grid2X2,
  Heart,
  Headphones,
  List,
  PackageCheck,
  PackageSearch,
  RotateCcw,
  Search,
  ShieldCheck,
  ShoppingCart,
  SlidersHorizontal,
  Star,
  Truck,
  X
} from "lucide-react";
import { Button } from "@/components/common/Button";
import { ProductCard } from "@/components/product/ProductCard";
import { Rating } from "@/components/product/Rating";
import { brands } from "@/data/brands";
import { products } from "@/data/products";
import type { Product } from "@/types";
import { useCommerceStore } from "@/store/useCommerceStore";
import { filterProducts, getProductDiscount, matchesCategory } from "@/services/products";
import { cn } from "@/utils/cn";
import { formatPrice, slugify } from "@/utils/format";

type SortOption = "featured" | "newest" | "low" | "high" | "rated" | "selling";
type ViewMode = "grid" | "list";

const pageSize = 15;
const maxProductPrice = Math.max(...products.map((product) => product.price));
const electronicsCategories = ["Smartphones", "Laptops", "Headphones", "Smart Watches", "Speakers", "Cameras", "Accessories", "Routers", "Chargers"];
const discountOptions = [10, 20, 30];
const categoryCounts = Object.fromEntries(
  ["All", ...electronicsCategories].map((category) => [
    category,
    category === "All" ? products.length : products.filter((product) => matchesCategory(product, category)).length
  ])
);
const brandCounts = Object.fromEntries(
  ["All", ...brands].map((brand) => [
    brand,
    brand === "All" ? products.length : products.filter((product) => product.brand === brand).length
  ])
);

const initialFilters = {
  query: "",
  category: "All",
  brand: "All",
  maxPrice: maxProductPrice,
  availability: "All",
  rating: 0,
  discount: 0,
  badge: "All",
  tag: "",
  offer: ""
};

export function ShopClient({ initialCategory }: { initialCategory?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState(() => getInitialFilters(searchParams, initialCategory));
  const [sort, setSort] = useState<SortOption>(() => getSortFromUrl(searchParams.get("sort")));
  const [view, setView] = useState<ViewMode>("grid");
  const [page, setPage] = useState(() => Math.max(1, Number(searchParams.get("page")) || 1));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtered = useMemo(() => {
    const result = filterProducts({
      search: filters.query,
      category: filters.category,
      brand: filters.brand,
      maxPrice: filters.maxPrice,
      rating: filters.rating,
      availability: filters.availability,
      badge: filters.badge,
      tag: filters.tag,
      offer: filters.offer
    }).filter((product) => !filters.discount || getProductDiscount(product) >= filters.discount);

    if (sort === "low") return [...result].sort((a, b) => a.price - b.price);
    if (sort === "high") return [...result].sort((a, b) => b.price - a.price);
    if (sort === "newest") return [...result].sort((a, b) => b.id.localeCompare(a.id));
    if (sort === "rated") return [...result].sort((a, b) => b.rating - a.rating);
    if (sort === "selling") return [...result].sort((a, b) => b.reviews - a.reviews);
    return result;
  }, [filters, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const start = filtered.length ? (page - 1) * pageSize + 1 : 0;
  const end = Math.min(page * pageSize, filtered.length);
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  const recommendedProducts = useMemo(() => getFlexibleRecommendations(filters, new Set(), 8), [filters.brand, filters.category]);
  const relatedProducts = useMemo(() => {
    if (!filtered.length || visible.length >= 8) return [];
    return getFlexibleRecommendations(filters, new Set(visible.map((product) => product.id)), 8);
  }, [filtered.length, filters.brand, filters.category, visible]);
  const activeChips = getActiveChips(filters);
  const pageTitle = filters.brand !== "All" ? `${filters.brand} Electronics` : filters.category !== "All" ? filters.category : "Shop Electronics";
  const breadcrumbLabel = filters.brand !== "All" ? filters.brand : filters.category !== "All" ? filters.category : "Shop";
  const resultLabel = `${filtered.length} ${filtered.length === 1 ? "product" : "products"} found`;

  function updateFilter<K extends keyof typeof filters>(key: K, value: (typeof filters)[K]) {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  }

  function resetFilters() {
    setFilters({ ...initialFilters, category: initialCategory ?? "All" });
    setSort("featured");
    setPage(1);
  }

  function clearChip(key: keyof typeof filters) {
    updateFilter(key, initialFilters[key] as never);
  }

  useEffect(() => {
    if (pathname !== "/shop") return;
    const params = new URLSearchParams();
    if (filters.query) params.set("search", filters.query);
    if (filters.category !== "All") params.set("category", filters.category);
    if (filters.brand !== "All") params.set("brand", filters.brand);
    if (filters.maxPrice !== initialFilters.maxPrice) params.set("maxPrice", String(filters.maxPrice));
    if (filters.rating) params.set("rating", String(filters.rating));
    if (filters.availability !== "All") params.set("availability", filters.availability);
    if (filters.discount) params.set("discount", String(filters.discount));
    if (filters.badge !== "All") params.set("badge", filters.badge);
    if (filters.tag) params.set("tag", filters.tag);
    if (filters.offer) params.set("offer", filters.offer);
    if (sort !== "featured") params.set("sort", sort);
    if (page > 1) params.set("page", String(page));
    const query = params.toString();
    router.replace(query ? `/shop?${query}` : "/shop", { scroll: false });
  }, [filters, page, pathname, router, sort]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return (
    <main className="bg-soft pb-20 lg:pb-0">
      <section className="bg-white py-10 text-center">
        <div className="container-page">
          <h1 className="text-3xl font-black uppercase tracking-wide text-zinc-900">{pageTitle}</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
            Find original electronics, gadgets, and accessories from trusted brands in Bangladesh.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-xs font-black uppercase">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <span className="text-primary">{breadcrumbLabel}</span>
          </div>
          <p className="mt-3 text-sm font-bold text-secondary">{resultLabel}</p>
        </div>
      </section>

      <section className="container-page grid items-start gap-6 py-8 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="hidden self-start lg:block">
          <div className="sticky top-28 grid gap-5">
            <div className="overflow-hidden rounded-lg border border-zinc-100 bg-white p-5 shadow-sm">
              <FilterSidebar filters={filters} updateFilter={updateFilter} resetFilters={resetFilters} />
            </div>
            <NewProductsWidget />
            <ServiceWidget />
            <PromoWidget />
          </div>
        </aside>

        <div className="min-w-0">
          <ShopBanner />
          <section className="mt-5 rounded-lg border border-zinc-100 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black">Premium Electronics Collection</h2>
            <p className="mt-2 max-w-4xl text-sm leading-7 text-zinc-500">
              Shop original smartphones, laptops, headphones, smart watches, cameras, speakers, routers, chargers, and accessories from trusted brands in Bangladesh.
            </p>
          </section>

          <ProductToolbar
            count={filtered.length}
            sort={sort}
            setSort={setSort}
            view={view}
            setView={setView}
            onFilterClick={() => setDrawerOpen(true)}
            activeChips={activeChips}
            clearChip={clearChip}
            resetFilters={resetFilters}
          />

          {visible.length ? (
            <>
              <section className={cn("mt-5", view === "grid" ? "grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5" : "grid gap-4")}>
                {visible.map((product) => (view === "grid" ? <ProductCard key={product.id} product={product} /> : <ShopListCard key={product.id} product={product} />))}
              </section>
              {relatedProducts.length ? <RelatedProductsShelf title="More Electronics For You" products={relatedProducts} /> : null}
            </>
          ) : (
            <section className="mt-5 rounded-lg border border-zinc-100 bg-white p-5 shadow-sm sm:p-8">
              <div className="mx-auto max-w-2xl text-center">
                <PackageSearch className="mx-auto h-12 w-12 text-primary" />
                <h2 className="mt-4 text-2xl font-black">No products found</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-500">Try changing your search, brand, category, or price range. You can also browse the recommended electronics below.</p>
                <Button className="mt-5" onClick={resetFilters}><RotateCcw className="h-4 w-4" /> Clear Filters</Button>
              </div>

              <div className="mt-8 border-t border-zinc-100 pt-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h3 className="text-sm font-black uppercase tracking-wide text-zinc-900">Recommended Electronics</h3>
                  <Link href="/shop" className="text-xs font-black uppercase text-primary transition-colors hover:text-secondary">View All</Link>
                </div>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                  {recommendedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {filtered.length ? <Pagination page={page} totalPages={totalPages} setPage={setPage} start={start} end={end} total={filtered.length} /> : null}
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 border-t border-zinc-100 bg-white p-2 shadow-2xl lg:hidden">
        <button className="flex items-center justify-center gap-2 py-3 text-sm font-black uppercase" onClick={() => setDrawerOpen(true)}>
          <Filter className="h-4 w-4" /> Filter
        </button>
        <button className="flex items-center justify-center gap-2 bg-primary py-3 text-sm font-black uppercase text-white" onClick={() => setSort(sort === "low" ? "high" : "low")}>
          <SlidersHorizontal className="h-4 w-4" /> Sort
        </button>
      </div>

      {drawerOpen ? (
        <div className="fixed inset-0 z-[80] bg-black/50 lg:hidden">
          <button className="absolute inset-0 h-full w-full" aria-label="Close filters" onClick={() => setDrawerOpen(false)} />
          <aside className="absolute right-0 top-0 h-full w-[min(390px,calc(100%-24px))] overflow-y-auto bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-black uppercase">Filters</h2>
              <button className="grid h-9 w-9 place-items-center bg-zinc-100 transition-colors hover:bg-primary hover:text-white" onClick={() => setDrawerOpen(false)} aria-label="Close filters">
                <X className="h-4 w-4" />
              </button>
            </div>
            <FilterSidebar filters={filters} updateFilter={updateFilter} resetFilters={resetFilters} />
            <div className="mt-5 grid gap-5">
              <NewProductsWidget />
              <ServiceWidget />
            </div>
          </aside>
        </div>
      ) : null}
    </main>
  );
}

function ShopBanner() {
  return (
    <Link href="/products" className="group relative block aspect-[16/5] min-h-52 overflow-hidden bg-white shadow-sm">
      <Image
        src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1400&q=80"
        alt="Gadget Mega Sale"
        fill
        sizes="1100px"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-white/10" />
      <div className="absolute inset-y-0 left-0 flex max-w-lg flex-col justify-center p-6 sm:p-8">
        <p className="text-sm font-black uppercase text-primary">Up to 30% Off Electronics</p>
        <h2 className="mt-2 text-3xl font-black uppercase leading-tight text-secondary sm:text-4xl">Gadget Mega Sale</h2>
        <p className="mt-3 text-sm leading-6 text-zinc-600">Smartphone, laptop, audio, and accessories festival for AmarBazar customers.</p>
        <span className="mt-5 inline-flex h-10 w-fit items-center bg-primary px-5 text-sm font-bold text-white transition-all duration-300 group-hover:-translate-y-0.5 group-hover:bg-accent group-hover:shadow-lg">
          Shop Deals
        </span>
      </div>
    </Link>
  );
}

function ProductToolbar({
  count,
  sort,
  setSort,
  view,
  setView,
  onFilterClick,
  activeChips,
  clearChip,
  resetFilters
}: {
  count: number;
  sort: SortOption;
  setSort: (sort: SortOption) => void;
  view: ViewMode;
  setView: (view: ViewMode) => void;
  onFilterClick: () => void;
  activeChips: Array<{ key: keyof typeof initialFilters; label: string }>;
  clearChip: (key: keyof typeof initialFilters) => void;
  resetFilters: () => void;
}) {
  return (
    <section className="mt-5 rounded-lg border border-zinc-100 bg-white p-4 shadow-sm lg:p-5">
      <div className="grid gap-4 xl:grid-cols-[1fr_auto_auto] xl:items-center">
        <p className="text-sm font-black text-zinc-700">{count} {count === 1 ? "product" : "products"} found</p>
        <select value={sort} onChange={(event) => setSort(event.target.value as SortOption)} className="h-11 rounded-md border border-zinc-200 bg-white px-3 text-sm font-semibold outline-none transition-colors focus:border-primary">
          <option value="featured">Featured</option>
          <option value="newest">Newest</option>
          <option value="low">Price Low to High</option>
          <option value="high">Price High to Low</option>
          <option value="rated">Best Rated</option>
          <option value="selling">Best Selling</option>
        </select>
        <div className="flex gap-2">
          <button className="grid h-11 w-11 place-items-center rounded-md border border-zinc-200 transition-colors hover:border-primary hover:text-primary lg:hidden" onClick={onFilterClick} aria-label="Open filters">
            <Filter className="h-4 w-4" />
          </button>
          <button className={cn("grid h-11 w-11 place-items-center rounded-md border border-zinc-200 transition-colors hover:border-primary hover:text-primary", view === "grid" && "border-primary bg-primary text-white hover:text-white")} onClick={() => setView("grid")} aria-label="Grid view">
            <Grid2X2 className="h-4 w-4" />
          </button>
          <button className={cn("grid h-11 w-11 place-items-center rounded-md border border-zinc-200 transition-colors hover:border-primary hover:text-primary", view === "list" && "border-primary bg-primary text-white hover:text-white")} onClick={() => setView("list")} aria-label="List view">
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {activeChips.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {activeChips.map((chip) => (
            <button key={chip.key} onClick={() => clearChip(chip.key)} className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-bold text-primary transition-all hover:border-primary hover:bg-primary hover:text-white">
              {chip.label}
              <X className="h-3 w-3" />
            </button>
          ))}
          <button className="text-xs font-black uppercase text-secondary hover:text-primary" onClick={resetFilters}>Clear All</button>
        </div>
      ) : null}
    </section>
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
      <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
        <h2 className="flex items-center gap-2 text-sm font-black uppercase"><SlidersHorizontal className="h-4 w-4 text-primary" /> Filters</h2>
        <button onClick={resetFilters} className="text-xs font-black uppercase text-primary">Clear</button>
      </div>

      <FilterGroup title="Search Products" defaultOpen>
        <label className="flex h-11 items-center border border-zinc-200 px-3 transition-colors focus-within:border-primary">
          <Search className="mr-2 h-4 w-4 text-zinc-400" />
          <input value={filters.query} onChange={(event) => updateFilter("query", event.target.value)} className="min-w-0 flex-1 text-sm outline-none" placeholder="Search gadgets" />
        </label>
      </FilterGroup>

      <FilterGroup title="Categories" defaultOpen>
        <SelectList value={filters.category} options={["All", ...electronicsCategories]} onChange={(value) => updateFilter("category", value)} counts={categoryCounts} />
      </FilterGroup>

      <FilterGroup title="Brands" defaultOpen>
        <SelectList value={filters.brand} options={["All", ...brands]} onChange={(value) => updateFilter("brand", value)} counts={brandCounts} scroll />
      </FilterGroup>

      <FilterGroup title="Price Range" defaultOpen>
        <p className="mb-3 text-sm font-bold text-zinc-600">Up to {formatPrice(filters.maxPrice)}</p>
        <input type="range" min="1000" max={maxProductPrice} step="500" value={filters.maxPrice} onChange={(event) => updateFilter("maxPrice", Number(event.target.value))} className="w-full accent-primary" />
      </FilterGroup>

      <FilterGroup title="Availability">
        <SelectList value={filters.availability} options={["All", "In Stock", "Out of Stock"]} onChange={(value) => updateFilter("availability", value)} />
      </FilterGroup>

      <FilterGroup title="Rating">
        <SelectList value={String(filters.rating)} options={["0", "3", "4", "5"]} onChange={(value) => updateFilter("rating", Number(value))} labels={{ "0": "Any Rating", "3": "3 Stars & Up", "4": "4 Stars & Up", "5": "5 Stars" }} />
      </FilterGroup>

      <FilterGroup title="Discount">
        <SelectList value={String(filters.discount)} options={["0", ...discountOptions.map(String)]} onChange={(value) => updateFilter("discount", Number(value))} labels={{ "0": "Any Discount", "10": "10% Off", "20": "20% Off", "30": "30% Off" }} />
      </FilterGroup>

      <FilterGroup title="Deals">
        <SelectList value={filters.badge} options={["All", "New", "Hot", "Sale"]} onChange={(value) => updateFilter("badge", value)} labels={{ All: "All Products", New: "New Products", Hot: "Hot Deals", Sale: "On Sale" }} />
      </FilterGroup>
    </div>
  );
}

function FilterGroup({ title, children, defaultOpen = false }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  return (
    <details className="group border-b border-zinc-100 py-4" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-black uppercase tracking-wide text-zinc-900 transition-colors hover:text-primary">
        {title}
        <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  );
}

function SelectList({
  value,
  options,
  onChange,
  labels = {},
  counts,
  scroll = false
}: {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  labels?: Record<string, string>;
  counts?: Record<string, number>;
  scroll?: boolean;
}) {
  return (
    <div className={cn("grid gap-2", scroll && "max-h-72 overflow-y-auto pr-1")}>
      {options.map((option) => (
        <button
          type="button"
          key={option}
          onClick={() => onChange(option)}
          className={cn(
            "group flex min-h-10 w-full items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left text-sm font-bold transition-all duration-300",
            value === option
              ? "border-primary bg-primary/5 text-primary shadow-sm"
              : "border-zinc-100 bg-white text-zinc-600 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-soft hover:text-primary hover:shadow-sm"
          )}
        >
          <span className="flex min-w-0 items-center gap-2">
            <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full border transition-colors", value === option ? "border-primary bg-primary" : "border-zinc-300 group-hover:border-primary")} />
            <span className="truncate">{labels[option] ?? option}</span>
          </span>
          {counts ? (
            <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[11px] font-black", value === option ? "bg-primary text-white" : "bg-zinc-100 text-zinc-500 group-hover:bg-primary/10 group-hover:text-primary")}>
              {counts[option] ?? 0}
            </span>
          ) : null}
        </button>
      ))}
    </div>
  );
}

function NewProductsWidget() {
  return (
    <aside className="rounded-lg border border-zinc-100 bg-white p-5 shadow-sm">
      <h2 className="mb-4 border-b border-zinc-100 pb-3 text-sm font-black uppercase">New Products</h2>
      <div className="grid gap-4">
        {products.filter((product) => product.badge === "New").slice(0, 4).map((product) => (
          <Link key={product.id} href={`/products/${slugify(product.name)}`} className="group grid grid-cols-[76px_1fr] gap-3 rounded-md p-1 transition-all hover:bg-soft">
            <span className="relative h-20 overflow-hidden rounded-md bg-[#fafafa]">
              <Image src={product.image} alt={product.name} fill sizes="76px" className="object-contain p-2 transition-transform duration-300 group-hover:scale-105" />
            </span>
            <span className="min-w-0">
              <Rating value={product.rating} />
              <span className="mt-1 line-clamp-2 text-sm font-bold transition-colors group-hover:text-primary">{product.name}</span>
              <span className="text-sm font-black text-primary">{formatPrice(product.price)}</span>
            </span>
          </Link>
        ))}
      </div>
    </aside>
  );
}

function ServiceWidget() {
  return (
    <aside className="rounded-lg border border-zinc-100 bg-white p-5 shadow-sm">
      {[
        [Truck, "Free Delivery"],
        [Headphones, "24/7 Support"],
        [PackageCheck, "Easy Return"],
        [ShieldCheck, "Original Product"]
      ].map(([Icon, text]) => (
        <div key={String(text)} className="flex items-center gap-3 border-b border-zinc-100 py-4 transition-colors last:border-b-0 hover:text-primary">
          <Icon className="h-6 w-6 text-primary" />
          <span className="text-sm font-black">{String(text)}</span>
        </div>
      ))}
    </aside>
  );
}

function PromoWidget() {
  return (
    <Link href="/products" className="group relative block min-h-64 overflow-hidden rounded-md bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Image src="https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=500&q=80" alt="Power bank offer" fill sizes="320px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-white/80" />
      <div className="relative z-10">
        <p className="text-3xl font-black text-secondary">20000 mAh</p>
        <p className="mt-1 text-sm font-black uppercase text-zinc-500">Power Bank</p>
        <p className="mt-4 text-sm text-zinc-600">From <span className="font-black text-primary">৳4,990</span></p>
        <span className="mt-5 inline-flex h-9 items-center rounded-full border border-secondary px-5 text-xs font-black uppercase text-secondary transition-all group-hover:bg-secondary group-hover:text-white">Buy Now</span>
      </div>
    </Link>
  );
}

function RelatedProductsShelf({ title, products: items }: { title: string; products: Product[] }) {
  return (
    <section className="mt-6 rounded-lg border border-zinc-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-sm font-black uppercase tracking-wide text-zinc-900">{title}</h3>
        <Link href="/shop" className="text-xs font-black uppercase text-primary transition-colors hover:text-secondary">Browse All</Link>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

function ShopListCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, toggleCompare, openQuickView } = useCommerceStore();

  return (
    <article className="grid gap-5 border border-zinc-200 bg-white p-4 shadow-[0_8px_24px_rgba(34,34,34,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl md:grid-cols-[220px_1fr_auto]">
      <Link href={`/products/${slugify(product.name)}`} className="relative h-56 overflow-hidden bg-[#fafafa]">
        <Image src={product.image} alt={product.name} fill sizes="220px" className="object-contain p-6 transition-transform duration-500 hover:scale-105" />
      </Link>
      <div className="min-w-0">
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
          <IconButton label="Add to cart" onClick={() => addToCart(product)}><ShoppingCart className="h-4 w-4" /></IconButton>
          <IconButton label="Wishlist" onClick={() => toggleWishlist(product)}><Heart className="h-4 w-4" /></IconButton>
          <IconButton label="Quick view" onClick={() => openQuickView(product)}><Search className="h-4 w-4" /></IconButton>
          <IconButton label="Compare" onClick={() => toggleCompare(product)}><Star className="h-4 w-4" /></IconButton>
        </div>
      </div>
    </article>
  );
}

function IconButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" aria-label={label} onClick={onClick} className="group relative grid h-10 place-items-center transition-all hover:bg-primary hover:text-white">
      {children}
      <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded bg-zinc-900 px-2 py-1 text-[11px] font-bold text-white opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">{label}</span>
    </button>
  );
}

function Pagination({ page, totalPages, setPage, start, end, total }: { page: number; totalPages: number; setPage: (page: number) => void; start: number; end: number; total: number }) {
  return (
    <div className="mt-7 grid gap-4 rounded-md border border-zinc-100 bg-white p-4 shadow-sm md:grid-cols-[auto_1fr_auto] md:items-center">
      <div className="flex flex-wrap justify-center gap-1">
        <button className="grid h-10 w-10 place-items-center rounded border border-zinc-200 transition-colors hover:border-primary hover:text-primary disabled:opacity-40" disabled={page === 1} onClick={() => setPage(Math.max(1, page - 1))} aria-label="Previous page">
          <ChevronLeft className="h-4 w-4" />
        </button>
        {Array.from({ length: totalPages }).map((_, index) => (
          <button key={index} onClick={() => setPage(index + 1)} className={cn("grid h-10 w-10 place-items-center rounded border border-zinc-200 text-sm font-bold transition-colors hover:border-primary hover:bg-primary hover:text-white", page === index + 1 && "border-primary bg-primary text-white")}>
            {index + 1}
          </button>
        ))}
        <button className="grid h-10 w-10 place-items-center rounded border border-zinc-200 transition-colors hover:border-primary hover:text-primary disabled:opacity-40" disabled={page === totalPages} onClick={() => setPage(Math.min(totalPages, page + 1))} aria-label="Next page">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="hidden md:block" />
      <p className="text-center text-sm font-black text-zinc-700 md:text-right">Showing products {start}-{end} of {total} results</p>
    </div>
  );
}

function getActiveChips(filters: typeof initialFilters) {
  const chips: Array<{ key: keyof typeof initialFilters; label: string }> = [];
  if (filters.query) chips.push({ key: "query", label: `Search: ${filters.query}` });
  if (filters.category !== "All") chips.push({ key: "category", label: filters.category });
  if (filters.brand !== "All") chips.push({ key: "brand", label: filters.brand });
  if (filters.maxPrice !== initialFilters.maxPrice) chips.push({ key: "maxPrice", label: `Under ${formatPrice(filters.maxPrice)}` });
  if (filters.availability !== "All") chips.push({ key: "availability", label: filters.availability });
  if (filters.rating) chips.push({ key: "rating", label: `${filters.rating}+ Stars` });
  if (filters.discount) chips.push({ key: "discount", label: `${filters.discount}% Off` });
  if (filters.badge !== "All") chips.push({ key: "badge", label: filters.badge });
  if (filters.tag) chips.push({ key: "tag", label: filters.tag.replace(/-/g, " ") });
  if (filters.offer) chips.push({ key: "offer", label: filters.offer.replace(/-/g, " ") });
  return chips;
}

function getFlexibleRecommendations(filters: typeof initialFilters, excludedIds: Set<string>, limit: number) {
  const selected: Product[] = [];
  const hasCategory = filters.category !== "All";
  const hasBrand = filters.brand !== "All";

  function add(items: Product[]) {
    for (const product of items) {
      if (selected.length >= limit) return;
      if (excludedIds.has(product.id) || selected.some((item) => item.id === product.id) || product.stock <= 0) continue;
      selected.push(product);
    }
  }

  if (hasCategory && hasBrand) {
    add(products.filter((product) => matchesCategory(product, filters.category) && product.brand === filters.brand));
  }
  if (hasCategory) add(products.filter((product) => matchesCategory(product, filters.category)));
  if (hasBrand) add(products.filter((product) => product.brand === filters.brand));
  add(products.filter((product) => product.badge === "Hot" || product.badge === "New" || product.badge === "Sale"));
  add(products);

  return selected;
}

function getInitialFilters(searchParams: ReturnType<typeof useSearchParams>, initialCategory?: string) {
  return {
    ...initialFilters,
    query: searchParams.get("search") ?? "",
    category: searchParams.get("category") ?? initialCategory ?? "All",
    brand: searchParams.get("brand") ?? "All",
    maxPrice: Number(searchParams.get("maxPrice")) || initialFilters.maxPrice,
    availability: searchParams.get("availability") ?? "All",
    rating: Number(searchParams.get("rating")) || 0,
    discount: Number(searchParams.get("discount")) || 0,
    badge: searchParams.get("badge") ?? "All",
    tag: searchParams.get("tag") ?? "",
    offer: searchParams.get("offer") ?? ""
  };
}

function getSortFromUrl(sort: string | null): SortOption {
  if (sort === "price-low") return "low";
  if (sort === "price-high") return "high";
  if (sort === "best-rated") return "rated";
  if (sort === "best-selling") return "selling";
  if (sort === "newest" || sort === "low" || sort === "high" || sort === "rated" || sort === "selling") return sort;
  return "featured";
}
