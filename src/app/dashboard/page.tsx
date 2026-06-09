import { Package, ShoppingBag, UserRound, WalletCards } from "lucide-react";

export default function DashboardPage() {
  return (
    <main className="bg-soft py-8">
      <div className="container-page">
        <h1 className="text-3xl font-black">User Dashboard</h1>
        <p className="mt-2 text-sm text-zinc-500">Customer-facing UI shell only. No backend data is connected.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [ShoppingBag, "Orders", "12"],
            [Package, "Processing", "03"],
            [WalletCards, "Saved Cards", "02"],
            [UserRound, "Profile", "Complete"]
          ].map(([Icon, label, value]) => (
            <article key={String(label)} className="bg-white p-5 shadow-sm">
              <Icon className="h-7 w-7 text-primary" />
              <p className="mt-4 text-sm uppercase text-zinc-500">{String(label)}</p>
              <h2 className="text-2xl font-black">{String(value)}</h2>
            </article>
          ))}
        </div>
        <section className="mt-6 bg-white p-5">
          <h2 className="text-xl font-black">Recent Orders</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="bg-soft text-xs uppercase text-zinc-500"><tr><th className="p-3">Order</th><th className="p-3">Date</th><th className="p-3">Status</th><th className="p-3">Total</th></tr></thead>
              <tbody>
                {["#AB-1205", "#AB-1198", "#AB-1187"].map((order, index) => (
                  <tr key={order} className="border-b border-zinc-100"><td className="p-3 font-bold">{order}</td><td className="p-3">June {index + 2}, 2026</td><td className="p-3 text-primary">Delivered</td><td className="p-3">৳ {(index + 2) * 1250}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
