import { AdminResourcePage } from "@/components/admin/AdminResourcePage";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminProducts } from "@/data/admin";

export default function AdminFeaturedProductsPage() {
  return (
    <AdminShell title="Featured Products" description="Select products for featured homepage and shop placements.">
      <AdminResourcePage title="Featured Electronics" description="Current seed list uses highest quality electronics products." rows={adminProducts.slice(0, 8)} columns={["Name", "Brand", "Category", "Price", "Stock", "Status", "Badge"]} imageKey="image" />
    </AdminShell>
  );
}
