import Link from "next/link";
import { AlertTriangle, ArrowUpRight, Package, ShoppingCart, Users, WalletCards } from "lucide-react";
import { adminCustomers, adminMetrics, adminOrders, adminProducts, orderStatus, salesOverview } from "@/data/admin";

export function AdminDashboard() {
  const topProducts = adminProducts.slice(0, 5);
  const lowStock = adminProducts.filter((product) => product.stock <= 12).slice(0, 5);

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {adminMetrics.map((metric, index) => (
          <article key={metric.label} className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase text-zinc-400">{metric.label}</p>
                <h2 className="mt-2 text-2xl font-black">{metric.value}</h2>
                <p className="mt-2 text-xs font-bold text-primary">{metric.change}</p>
              </div>
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-soft text-primary">
                {index % 4 === 0 ? <WalletCards className="h-5 w-5" /> : index % 4 === 1 ? <ShoppingCart className="h-5 w-5" /> : index % 4 === 2 ? <Package className="h-5 w-5" /> : <Users className="h-5 w-5" />}
              </span>
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <ChartCard title="Sales Overview" />
        <StatusCard />
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <TableCard title="Recent Orders" href="/admin/orders" rows={adminOrders.map((order) => [order.id, order.customer, order.total, order.status])} />
        <TableCard title="Low Stock Products" href="/admin/products" rows={lowStock.map((product) => [product.name, product.brand, String(product.stock), "Restock"])} warning />
        <TableCard title="Recent Customers" href="/admin/customers" rows={adminCustomers.map((customer) => [customer.name, customer.orders.toString(), customer.spent, customer.status])} />
      </section>

      <section className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-black">Top Selling Electronics</h2>
          <Link href="/admin/products" className="text-sm font-black text-primary">Manage Products</Link>
        </div>
        <div className="grid gap-3 md:grid-cols-5">
          {topProducts.map((product) => (
            <div key={product.id} className="rounded-xl border border-zinc-100 p-4">
              <p className="line-clamp-2 min-h-10 text-sm font-black">{product.name}</p>
              <p className="mt-2 text-xs text-zinc-500">{product.category}</p>
              <p className="mt-2 font-black text-primary">{product.price}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ChartCard({ title }: { title: string }) {
  const max = Math.max(...salesOverview.map((item) => item.revenue));
  return (
    <article className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-black">{title}</h2>
        <span className="text-xs font-black uppercase text-zinc-400">BDT revenue</span>
      </div>
      <div className="flex h-72 items-end gap-3">
        {salesOverview.map((item) => (
          <div key={item.month} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-56 w-full items-end rounded-t-xl bg-soft p-1">
              <div className="w-full rounded-t-lg bg-gradient-to-t from-primary to-secondary transition-all hover:opacity-80" style={{ height: `${(item.revenue / max) * 100}%` }} />
            </div>
            <span className="text-xs font-black text-zinc-500">{item.month}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

function StatusCard() {
  const total = orderStatus.reduce((sum, item) => sum + item.value, 0);
  return (
    <article className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-black">Orders By Status</h2>
      <div className="mt-6 grid gap-4">
        {orderStatus.map((item) => (
          <div key={item.label}>
            <div className="mb-2 flex justify-between text-sm font-bold">
              <span>{item.label}</span>
              <span>{item.value}</span>
            </div>
            <div className="h-2 rounded-full bg-soft">
              <div className="h-full rounded-full bg-primary" style={{ width: `${(item.value / total) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

function TableCard({ title, rows, href, warning = false }: { title: string; rows: string[][]; href: string; warning?: boolean }) {
  return (
    <article className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-black">{title}</h2>
        <Link href={href} className="text-primary"><ArrowUpRight className="h-5 w-5" /></Link>
      </div>
      <div className="grid gap-3">
        {rows.map((row) => (
          <div key={row.join("-")} className="rounded-xl border border-zinc-100 p-3 text-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="line-clamp-1 font-black">{row[0]}</p>
                <p className="mt-1 text-xs text-zinc-500">{row[1]}</p>
              </div>
              <span className="shrink-0 text-right text-xs font-black text-primary">{row[2]}</span>
            </div>
            <p className="mt-2 flex items-center gap-1 text-xs font-bold text-zinc-500">
              {warning ? <AlertTriangle className="h-3.5 w-3.5 text-primary" /> : null}
              {row[3]}
            </p>
          </div>
        ))}
      </div>
    </article>
  );
}
