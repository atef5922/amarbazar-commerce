import { AdminResourcePage } from "@/components/admin/AdminResourcePage";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminProducts } from "@/data/admin";

export default function AdminProductsPage() {
  return (
    <AdminShell title="Products" description="Manage electronics products, stock, pricing, badges, SEO, and frontend visibility.">
      <AdminResourcePage title="Product List" description="Search, filter, bulk update, duplicate, edit, and delete products." rows={adminProducts} columns={["Name", "Brand", "Category", "Price", "Stock", "Status", "Badge"]} imageKey="image" primaryAction={{ label: "Add Product", href: "/admin/products/new" }} />
    </AdminShell>
  );
}
