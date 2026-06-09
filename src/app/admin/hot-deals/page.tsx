import { AdminResourcePage } from "@/components/admin/AdminResourcePage";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminProducts } from "@/data/admin";

export default function AdminHotDealsPage() {
  return (
    <AdminShell title="Hot Deals" description="Manage today’s hot deal and deal products shown across the storefront.">
      <AdminResourcePage title="Hot Deal Products" description="Hot products can power homepage hot deal, flash sale, and promo sections." rows={adminProducts.filter((item) => item.badge === "Hot")} columns={["Name", "Brand", "Category", "Price", "Stock", "Status", "Badge"]} imageKey="image" />
    </AdminShell>
  );
}
