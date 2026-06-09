import { AdminShell } from "@/components/admin/AdminShell";
import { adminOrders } from "@/data/admin";

export default async function AdminOrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = adminOrders.find((item) => item.id === id) ?? adminOrders[0];
  return (
    <AdminShell title={`Order ${order.id}`} description="Update order status, payment status, shipping address, and invoice details.">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black">Ordered Products</h2>
          <div className="mt-5 rounded-xl border border-zinc-100 p-4">
            <p className="font-black">{order.items}</p>
            <p className="mt-2 text-sm text-zinc-500">Customer: {order.customer}</p>
            <p className="mt-2 text-sm text-zinc-500">Payment: {order.payment}</p>
            <p className="mt-2 text-sm text-zinc-500">Current status: {order.status}</p>
          </div>
        </section>
        <aside className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black">Order Summary</h2>
          <div className="mt-5 grid gap-3 text-sm">
            <div className="flex justify-between"><span>Total</span><strong>{order.total}</strong></div>
            <select className="admin-field"><option>Pending</option><option>Confirmed</option><option>Processing</option><option>Shipped</option><option>Delivered</option><option>Cancelled</option><option>Returned</option></select>
            <button className="h-10 rounded-lg bg-primary text-sm font-black text-white">Print Invoice</button>
          </div>
        </aside>
      </div>
    </AdminShell>
  );
}
