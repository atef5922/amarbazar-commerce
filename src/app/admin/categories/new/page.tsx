import { AdminShell } from "@/components/admin/AdminShell";

export default function AdminNewCategoryPage() {
  return (
    <AdminShell title="Add Category" description="Create electronics category with homepage visibility, SEO, and sort settings.">
      <CategoryForm />
    </AdminShell>
  );
}

function CategoryForm() {
  return <div className="rounded-2xl bg-white p-5 shadow-sm"><div className="grid gap-4 md:grid-cols-2">{["Category name", "Slug", "Parent category", "Icon", "Image URL", "Sort order", "SEO title", "SEO description"].map((field) => <label key={field} className="block text-sm font-black">{field}<input className="admin-field mt-2" /></label>)}<label className="flex items-center gap-2 text-sm font-black"><input type="checkbox" className="accent-primary" /> Show in homepage</label><button className="h-11 rounded-lg bg-primary text-sm font-black text-white">Save Category</button></div></div>;
}
