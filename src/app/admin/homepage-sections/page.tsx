import { AdminResourcePage } from "@/components/admin/AdminResourcePage";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminHomepageSections } from "@/data/admin";

export default function AdminHomepageSectionsPage() {
  return (
    <AdminShell title="Homepage Sections" description="Enable, disable, reorder, and configure homepage sections from admin.">
      <AdminResourcePage title="Homepage Section Controls" description="Each section is structured for dynamic frontend rendering from configuration." rows={adminHomepageSections} columns={["Title", "Status", "Sort Order", "Source"]} primaryAction={{ label: "Add Section" }} />
    </AdminShell>
  );
}
