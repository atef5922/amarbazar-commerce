import { AdminResourcePage } from "@/components/admin/AdminResourcePage";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminMedia } from "@/data/admin";

export default function AdminMediaPage() {
  return (
    <AdminShell title="Media Library" description="Upload, preview, copy, delete, and search media. Supabase Storage-ready UI.">
      <AdminResourcePage title="Media Assets" description="Remote product images are shown as seed media until storage is connected." rows={adminMedia} columns={["Name", "Type", "Size"]} imageKey="url" primaryAction={{ label: "Upload Media" }} />
    </AdminShell>
  );
}
