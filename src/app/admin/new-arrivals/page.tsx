import { AdminResourcePage } from "@/components/admin/AdminResourcePage";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminProducts } from "@/data/admin";

export default function AdminNewArrivalsPage() {
  return (
    <AdminShell title="New Arrivals" description="Products marked New Arrival can feed frontend new product sections.">
      <AdminResourcePage title="New Arrival Products" description="Toggle which electronics appear in New Products and New Arrival sections." rows={adminProducts.filter((item) => item.badge === "New")} columns={["Name", "Brand", "Category", "Price", "Stock", "Status", "Badge"]} imageKey="image" />
    </AdminShell>
  );
}
