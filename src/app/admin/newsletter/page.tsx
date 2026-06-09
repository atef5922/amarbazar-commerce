import { AdminResourcePage } from "@/components/admin/AdminResourcePage";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminNewsletter } from "@/data/admin";

export default function AdminNewsletterPage() {
  return (
    <AdminShell title="Newsletter" description="View subscribers, delete records, and export CSV later.">
      <AdminResourcePage title="Newsletter Subscribers" description="Subscriber records are frontend-ready for newsletter integration." rows={adminNewsletter} columns={["Email", "Name", "Date", "Status"]} primaryAction={{ label: "Export CSV" }} />
    </AdminShell>
  );
}
