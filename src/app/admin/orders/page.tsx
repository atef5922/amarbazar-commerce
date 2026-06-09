import { AdminResourcePage } from "@/components/admin/AdminResourcePage";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminOrders } from "@/data/admin";

export default function AdminOrdersPage() {
  return (
    <AdminShell title="Orders" description="View orders, update statuses, payment states, customer details, and invoice flows.">
      <AdminResourcePage title="Order Management" description="Order data is mocked now and structured for backend checkout integration." rows={adminOrders} columns={["Id", "Customer", "Total", "Status", "Payment", "Items"]} primaryAction={{ label: "Create Order" }} />
    </AdminShell>
  );
}
