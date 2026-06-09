import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminEditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <AdminShell title="Edit Category" description={`Update category ${id} settings and frontend visibility.`}>
      <div className="rounded-2xl bg-white p-5 shadow-sm"><p className="font-bold">Category edit form scaffold is ready for backend data binding.</p></div>
    </AdminShell>
  );
}
