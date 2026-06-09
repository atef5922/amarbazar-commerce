import { AdminProductForm } from "@/components/admin/AdminProductForm";
import { AdminShell } from "@/components/admin/AdminShell";

export default function AdminNewProductPage() {
  return (
    <AdminShell title="Add Product" description="Create a backend-ready electronics product for AmarBazar storefront sections.">
      <AdminProductForm />
    </AdminShell>
  );
}
