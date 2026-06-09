import { AdminResourcePage } from "@/components/admin/AdminResourcePage";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminProducts } from "@/data/admin";

export default function AdminBestSellersPage() {
  return (
    <AdminShell title="Best Sellers" description="Manage best seller products for dynamic homepage sections.">
      <AdminResourcePage title="Best Seller Electronics" description="Best sellers can later be derived from order data automatically." rows={adminProducts.slice(0, 10)} columns={["Name", "Brand", "Category", "Price", "Stock", "Status", "Badge"]} imageKey="image" />
    </AdminShell>
  );
}
