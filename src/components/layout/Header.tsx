"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  CircleChevronDown,
  Download,
  Facebook,
  GitCompare,
  Heart,
  Instagram,
  Menu,
  Phone,
  Search,
  Settings,
  ShoppingBag,
  ShoppingCart,
  User,
  X,
  Youtube
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useCommerceStore } from "@/store/useCommerceStore";
import { useUiStore } from "@/store/useUiStore";
import { searchProducts, getProductSlug } from "@/services/products";
import { cn } from "@/utils/cn";
import { formatPrice } from "@/utils/format";

const navItems = ["Home", "Shop", "Products", "Features", "Blog", "Contact"];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { cart, wishlist, compare } = useCommerceStore();
  const { categoryMenuOpen, toggleCategoryMenu } = useUiStore();
  const pathname = usePathname();
  const cartCount = cart.reduce((total, line) => total + line.quantity, 0);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 120);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className="relative z-40 w-full bg-white shadow-sm">
        <div className={cn("transition-all duration-300", isScrolled && "pointer-events-none -translate-y-2 opacity-0")}>
          <TopBar />
          <div className="container-page flex h-20 items-center justify-between gap-5 bg-white">
            <div className="hidden items-center gap-2 text-sm md:flex">
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <p className="text-[11px] uppercase text-zinc-500">Call Us</p>
                <p className="font-bold">123-456-789</p>
              </div>
            </div>
            <button
              className="grid h-10 w-10 place-items-center bg-zinc-100 transition-all duration-300 hover:bg-primary hover:text-white md:hidden"
              onClick={() => setMobileOpen((value) => !value)}
              aria-label="Toggle navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
            <BrandLogo centered />
            <HeaderIcons cartCount={cartCount} wishlistCount={wishlist.length} compareCount={compare.length} expanded />
          </div>

          <div className="bg-secondary">
            <div className="container-page flex min-h-14 items-center gap-0">
              <button
                className="hidden h-14 w-[260px] items-center gap-3 bg-[#5145a4] px-7 text-xs font-black uppercase text-white transition-all duration-300 hover:bg-[#473a98] lg:flex"
                onClick={toggleCategoryMenu}
                aria-expanded={categoryMenuOpen}
                aria-controls="homepage-category-menu"
              >
                <CircleChevronDown className={cn("h-5 w-5 transition-transform duration-300", !categoryMenuOpen && "-rotate-90")} />
                Shop By Category
              </button>
              <NavLinks pathname={pathname} mobileOpen={mobileOpen} variant="expanded" />
              <div className="ml-auto hidden min-w-0 flex-1 md:block md:max-w-md lg:max-w-xl xl:max-w-2xl">
                <SearchBox variant="bar" />
              </div>
              <button className="ml-auto grid h-11 w-11 place-items-center bg-white text-zinc-500 md:hidden" onClick={() => setSearchOpen(true)} aria-label="Open search">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b border-zinc-100 bg-white shadow-lg transition-all duration-300",
          isScrolled ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-full opacity-0"
        )}
      >
        <div className="container-page flex h-[76px] items-center gap-4">
          <BrandLogo />
          <NavLinks pathname={pathname} mobileOpen={mobileOpen} variant="compact" />
          <div className="ml-auto flex items-center gap-2">
            <button className="grid h-10 w-10 place-items-center text-ink transition-colors duration-300 hover:text-primary" onClick={() => setSearchOpen(true)} aria-label="Search">
              <Search className="h-5 w-5" />
            </button>
            <div className="relative hidden md:block">
              <button className="grid h-10 w-10 place-items-center text-ink transition-colors duration-300 hover:text-primary" onClick={() => setSettingsOpen((value) => !value)} aria-label="Settings">
                <Settings className="h-5 w-5" />
              </button>
              {settingsOpen ? <SettingsMenu onClose={() => setSettingsOpen(false)} /> : null}
            </div>
            <Link href="/login" className="hidden h-10 w-10 place-items-center text-ink transition-colors duration-300 hover:text-primary md:grid" aria-label="User">
              <User className="h-5 w-5" />
            </Link>
            <HeaderIcons cartCount={cartCount} wishlistCount={wishlist.length} compareCount={compare.length} compact />
            <button
              className="grid h-10 w-10 place-items-center bg-zinc-100 transition-all duration-300 hover:bg-primary hover:text-white md:hidden"
              onClick={() => setMobileOpen((value) => !value)}
              aria-label="Toggle navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className={cn("container-page overflow-hidden transition-all duration-300 md:hidden", mobileOpen ? "max-h-80 pb-4" : "max-h-0")}>
          <NavLinks pathname={pathname} mobileOpen variant="mobilePanel" />
        </div>
      </header>

      {searchOpen ? <MobileSearchOverlay onClose={() => setSearchOpen(false)} /> : null}
    </>
  );
}

function TopBar() {
  return (
    <div className="bg-primary text-white">
      <div className="container-page flex h-8 items-center justify-between text-[11px] font-semibold">
        <div className="flex items-center gap-3">
          <span>Free Shipping On Order Over ৳999</span>
          <span className="hidden items-center gap-1 transition-colors hover:text-white/80 sm:flex">
            <Download className="h-3 w-3" /> Download App
          </span>
          <Facebook className="hidden h-3 w-3 transition-transform duration-300 hover:-translate-y-0.5 sm:block" />
          <Instagram className="hidden h-3 w-3 transition-transform duration-300 hover:-translate-y-0.5 sm:block" />
          <Youtube className="hidden h-3 w-3 transition-transform duration-300 hover:-translate-y-0.5 sm:block" />
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">English <ChevronDown className="h-3 w-3" /></span>
          <span className="flex items-center gap-1">BDT <ChevronDown className="h-3 w-3" /></span>
        </div>
      </div>
    </div>
  );
}

function BrandLogo({ centered = false }: { centered?: boolean }) {
  return (
    <Link href="/" className={cn("group relative inline-flex items-center gap-2 transition-all duration-300 hover:scale-[1.03]", centered && "text-center")} aria-label="AmarBazar home">
      <span className="leading-none">
        <span className="text-2xl font-black tracking-tight text-primary md:text-3xl">Amar</span>
        <span className="text-2xl font-black tracking-tight text-ink md:text-3xl">Bazar</span>
        <span className="block text-[9px] font-bold uppercase tracking-[0.28em] text-zinc-400">The Store</span>
      </span>
      <span className="grid h-10 w-10 place-items-center border-2 border-primary text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary/20">
        <ShoppingBag className="h-5 w-5" />
      </span>
      <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-secondary transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}

function SearchBox({ variant = "panel", onDone }: { variant?: "bar" | "panel"; onDone?: () => void }) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const results = useMemo(() => searchProducts(query, 6), [query]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    if (!value) return;
    onDone?.();
    router.push(`/shop?search=${encodeURIComponent(value)}`);
  }

  function openProduct(slug: string) {
    onDone?.();
    router.push(`/products/${slug}`);
  }

  return (
    <div className="relative">
      <form onSubmit={submit} className={cn("flex h-11 min-w-0 border-primary bg-white transition-shadow duration-300 focus-within:shadow-lg", variant === "bar" ? "border-4" : "border")}>
        <button className="grid w-12 shrink-0 place-items-center text-zinc-400 transition-colors hover:text-primary" aria-label="Search products">
          <Search className="h-4 w-4" />
        </button>
        <input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 px-2 text-sm outline-none" placeholder="Search products, brands, categories" autoFocus={variant === "panel"} />
        {query ? (
          <button type="button" className="grid w-10 place-items-center text-zinc-400 hover:text-primary" onClick={() => setQuery("")} aria-label="Clear search">
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </form>
      {query.trim() ? (
        <div className="absolute inset-x-0 top-[calc(100%+8px)] z-[70] overflow-hidden rounded-md border border-zinc-100 bg-white shadow-2xl">
          {results.length ? (
            <div className="max-h-96 overflow-y-auto p-2">
              {results.map((product) => (
                <button key={product.id} type="button" className="grid w-full grid-cols-[54px_1fr] gap-3 rounded p-2 text-left transition-colors hover:bg-soft" onClick={() => openProduct(getProductSlug(product))}>
                  <span className="relative h-14 bg-[#fafafa]"><Image src={product.image} alt={product.name} fill sizes="54px" className="object-contain p-1.5" /></span>
                  <span className="min-w-0">
                    <span className="line-clamp-1 text-sm font-black">{product.name}</span>
                    <span className="text-xs text-zinc-500">{product.category}</span>
                    <span className="block text-sm font-black text-primary">{formatPrice(product.price)}</span>
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-sm font-semibold text-zinc-500">No products found</div>
          )}
        </div>
      ) : null}
    </div>
  );
}

function MobileSearchOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[95] bg-black/50 p-4">
      <button className="absolute inset-0 h-full w-full" onClick={onClose} aria-label="Close search" />
      <div className="relative mx-auto mt-16 max-w-2xl rounded-md bg-white p-4 shadow-2xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-black uppercase">Search AmarBazar</h2>
          <button className="grid h-9 w-9 place-items-center bg-zinc-100 hover:bg-primary hover:text-white" onClick={onClose} aria-label="Close search"><X className="h-4 w-4" /></button>
        </div>
        <SearchBox onDone={onClose} />
      </div>
    </div>
  );
}

function SettingsMenu({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute right-0 top-12 z-[70] w-56 rounded-md border border-zinc-100 bg-white p-3 text-sm shadow-2xl">
      <div className="grid gap-1">
        <Link href="/compare" onClick={onClose} className="flex items-center gap-2 rounded px-3 py-2 font-bold hover:bg-soft hover:text-primary"><GitCompare className="h-4 w-4" /> Compare Products</Link>
        <button className="rounded px-3 py-2 text-left font-bold hover:bg-soft hover:text-primary">Language: English</button>
        <button className="rounded px-3 py-2 text-left font-bold hover:bg-soft hover:text-primary">Currency: BDT</button>
      </div>
    </div>
  );
}

function NavLinks({ pathname, mobileOpen, variant }: { pathname: string; mobileOpen: boolean; variant: "expanded" | "compact" | "mobilePanel" }) {
  const isMobilePanel = variant === "mobilePanel";
  const isCompact = variant === "compact";

  return (
    <nav
      className={cn(
        isMobilePanel ? "grid gap-1 border-t border-zinc-100 py-3 text-sm font-black uppercase text-ink" : "items-center gap-1 text-xs font-black uppercase md:flex",
        variant === "expanded" && "px-4 text-white",
        isCompact && "ml-8 hidden flex-1 justify-center text-ink lg:flex",
        variant === "expanded" && (mobileOpen ? "flex flex-wrap py-2" : "hidden md:flex")
      )}
    >
      {navItems.map((item) => {
        const href = item === "Home" ? "/" : `/${item.toLowerCase()}`;
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={item}
            href={href}
            className={cn(
              "hover-underline px-3 py-2 transition-colors duration-300 lg:px-4",
              variant === "expanded" && "hover:text-white/85",
              isCompact && "hover:text-primary",
              isMobilePanel && "hover:text-primary",
              active && "active",
              active && (variant === "expanded" ? "text-white" : "text-primary")
            )}
          >
            {item}
          </Link>
        );
      })}
    </nav>
  );
}

function HeaderIcons({ cartCount, wishlistCount, compareCount, compact = false, expanded = false }: { cartCount: number; wishlistCount: number; compareCount: number; compact?: boolean; expanded?: boolean }) {
  const openCartDrawer = useCommerceStore((state) => state.openCartDrawer);

  return (
    <div className={cn("flex items-center", compact ? "gap-2" : "gap-4")}>
      {expanded ? (
        <Link aria-label="Login" href="/login" className="hidden transition-colors duration-300 hover:text-primary md:block">
          <User className="h-5 w-5" />
        </Link>
      ) : null}
      <Link aria-label="Compare" href="/compare" className="relative hidden h-10 w-10 place-items-center transition-colors duration-300 hover:text-primary sm:grid">
        <GitCompare className="h-5 w-5" />
        {compareCount ? <Badge count={compareCount} /> : null}
      </Link>
      <Link aria-label="Wishlist" href="/wishlist" className="relative grid h-10 w-10 place-items-center transition-colors duration-300 hover:text-primary">
        <Heart className="h-5 w-5" />
        {wishlistCount ? <Badge count={wishlistCount} /> : null}
      </Link>
      <button
        type="button"
        aria-label="Cart"
        onClick={openCartDrawer}
        className={cn("relative transition-colors duration-300 hover:text-primary", expanded ? "flex items-center gap-2 text-xs font-black uppercase" : "grid h-10 w-10 place-items-center")}
      >
        <ShoppingCart className="h-6 w-6 text-primary" />
        {expanded ? <span className="hidden sm:block">Shopping<br />Cart</span> : null}
        {cartCount ? <Badge count={cartCount} /> : null}
      </button>
    </div>
  );
}

function Badge({ count }: { count: number }) {
  return <span className="absolute right-0 top-0 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">{count}</span>;
}
