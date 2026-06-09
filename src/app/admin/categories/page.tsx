import { AdminResourcePage } from "@/components/admin/AdminResourcePage";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminCategories } from "@/data/admin";

export default function AdminCategoriesPage() {
  return (
    <AdminShell title="Categories" description="Control electronics category visibility, sort order, SEO, and homepage menu placement.">
      <AdminResourcePage title="Category Management" description="Active categories appear in shop filters and homepage category menus." rows={adminCategories} columns={["Name", "Slug", "Count", "Status", "Sort Order", "Homepage"]} primaryAction={{ label: "Add Category", href: "/admin/categories/new" }} />
    </AdminShell>
  );
}
