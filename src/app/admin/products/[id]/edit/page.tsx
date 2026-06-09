import { AdminProductForm } from "@/components/admin/AdminProductForm";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminEditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <AdminShell title="Edit Product" description="Update product content, pricing, stock, images, badges, and SEO fields.">
      <AdminProductForm productId={id} />
    </AdminShell>
  );
}
