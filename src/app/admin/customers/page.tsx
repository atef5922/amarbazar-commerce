import { AdminResourcePage } from "@/components/admin/AdminResourcePage";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminCustomers } from "@/data/admin";

export default function AdminCustomersPage() {
  return (
    <AdminShell title="Customers" description="Manage customer profiles, status, order history, wishlist count, and total spent.">
      <AdminResourcePage title="Customer Management" description="Customer records are ready to connect with order and auth data." rows={adminCustomers} columns={["Name", "Phone", "Email", "Orders", "Spent", "Status"]} primaryAction={{ label: "Add Customer" }} />
    </AdminShell>
  );
}
