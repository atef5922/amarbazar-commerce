import { AdminResourcePage } from "@/components/admin/AdminResourcePage";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminBrands } from "@/data/admin";

export default function AdminBrandsPage() {
  return (
    <AdminShell title="Brands" description="Manage brand logos, top-brand visibility, status, and storefront sorting.">
      <AdminResourcePage title="Brand Management" description="Active brands appear in top brand strip and shop filters." rows={adminBrands} columns={["Name", "Slug", "Status", "Top Brand", "Sort Order"]} primaryAction={{ label: "Add Brand" }} />
    </AdminShell>
  );
}
