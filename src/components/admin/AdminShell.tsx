"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  BadgePercent,
  Bell,
  BookOpenText,
  Boxes,
  ChartNoAxesCombined,
  ChevronRight,
  Home,
  ImageIcon,
  Layers3,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Moon,
  Package,
  PanelLeftClose,
  Search,
  Settings,
  ShoppingCart,
  Star,
  Tags,
  Users,
  X
} from "lucide-react";
import { cn } from "@/utils/cn";

const nav = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Layers3 },
  { label: "Brands", href: "/admin/brands", icon: Tags },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Banners", href: "/admin/banners", icon: ImageIcon },
  { label: "Homepage Sections", href: "/admin/homepage-sections", icon: Home },
  { label: "Coupons", href: "/admin/coupons", icon: BadgePercent },
  { label: "New Arrivals", href: "/admin/new-arrivals", icon: Star },
  { label: "Hot Deals", href: "/admin/hot-deals", icon: ChartNoAxesCombined },
  { label: "Featured Products", href: "/admin/featured-products", icon: Boxes },
  { label: "Best Sellers", href: "/admin/best-sellers", icon: Star },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Blog", href: "/admin/blogs", icon: BookOpenText },
  { label: "Newsletter", href: "/admin/newsletter", icon: Mail },
  { label: "Media Library", href: "/admin/media", icon: ImageIcon },
  { label: "Settings", href: "/admin/settings", icon: Settings },
  { label: "Admins", href: "/admin/admins", icon: Users }
];

export function AdminShell({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  function logout() {
    document.cookie = "amarbazar-admin-session=; path=/; max-age=0";
    document.cookie = "amarbazar-admin-role=; path=/; max-age=0";
    router.push("/admin/login");
  }

  return (
    <main className="min-h-screen bg-[#f7f7fb] text-ink">
      <aside className={cn("fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-zinc-100 bg-white transition-all duration-300 lg:translate-x-0", collapsed && "lg:w-20", open ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex h-20 items-center justify-between border-b border-zinc-100 px-5">
          <Link href="/admin/dashboard" className={cn("font-black", collapsed && "lg:hidden")}>
            <span className="text-2xl text-primary">Amar</span><span className="text-2xl">Bazar</span>
            <span className="block text-[10px] uppercase tracking-[0.3em] text-zinc-400">Admin</span>
          </Link>
          <button className="grid h-10 w-10 place-items-center rounded-md bg-soft lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
          <button className="hidden h-10 w-10 place-items-center rounded-md bg-soft text-zinc-500 transition-colors hover:text-primary lg:grid" onClick={() => setCollapsed((value) => !value)} aria-label="Collapse sidebar">
            <PanelLeftClose className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-3">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold text-zinc-600 transition-all hover:bg-soft hover:text-primary",
                  active && "bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary hover:text-white"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className={cn(collapsed && "lg:hidden")}>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {open ? <button className="fixed inset-0 z-40 bg-black/40 lg:hidden" aria-label="Close overlay" onClick={() => setOpen(false)} /> : null}

      <section className={cn("min-h-screen transition-all duration-300 lg:pl-72", collapsed && "lg:pl-20")}>
        <header className="sticky top-0 z-30 border-b border-zinc-100 bg-white/90 backdrop-blur">
          <div className="flex h-20 items-center gap-4 px-4 sm:px-6 lg:px-8">
            <button className="grid h-10 w-10 place-items-center rounded-md bg-soft lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>
            <label className="hidden h-11 min-w-0 flex-1 max-w-xl items-center rounded-lg border border-zinc-200 bg-white px-3 transition-colors focus-within:border-primary md:flex">
              <Search className="mr-2 h-4 w-4 text-zinc-400" />
              <input className="min-w-0 flex-1 text-sm outline-none" placeholder="Search admin data, orders, products..." />
            </label>
            <button className="ml-auto grid h-10 w-10 place-items-center rounded-lg border border-zinc-200 bg-white text-zinc-500 transition-colors hover:text-primary" aria-label="Notifications">
              <Bell className="h-5 w-5" />
            </button>
            <button className="grid h-10 w-10 place-items-center rounded-lg border border-zinc-200 bg-white text-zinc-500 transition-colors hover:text-primary" aria-label="Dark mode">
              <Moon className="h-5 w-5" />
            </button>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-black">Admin User</p>
              <p className="text-xs text-zinc-500">SUPER_ADMIN</p>
            </div>
            <button className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-white transition-all hover:-translate-y-0.5 hover:shadow-lg" onClick={logout} aria-label="Logout">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-2 text-xs font-black uppercase text-zinc-400">
              <Link href="/admin/dashboard" className="hover:text-primary">Admin</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-primary">{title}</span>
            </div>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black tracking-tight">{title}</h1>
                {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">{description}</p> : null}
              </div>
            </div>
          </div>
          {children}
        </div>
      </section>
    </main>
  );
}
