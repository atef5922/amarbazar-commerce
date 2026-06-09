import { AdminShell } from "@/components/admin/AdminShell";
import { AdminUsersManager } from "@/components/admin/AdminUsersManager";
import { getAdminUsers } from "@/services/admin-user.service";
import { requireSuperAdminProfile } from "@/services/auth-profile.service";

export default async function AdminsPage() {
  await requireSuperAdminProfile();
  const admins = await getAdminUsers();

  return (
    <AdminShell title="Admins" description="SUPER_ADMIN can create, approve, block, unblock, and remove admin users. Public admin registration is disabled.">
      <AdminUsersManager admins={admins} />
    </AdminShell>
  );
}
