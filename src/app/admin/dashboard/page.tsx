import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminShell } from "@/components/admin/AdminShell";

export default function AdminDashboardPage() {
  return (
    <AdminShell title="Dashboard" description="Live operational overview for AmarBazar electronics store.">
      <AdminDashboard />
    </AdminShell>
  );
}
