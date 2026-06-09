import { AdminResourcePage } from "@/components/admin/AdminResourcePage";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminCoupons } from "@/data/admin";

export default function AdminCouponsPage() {
  return (
    <AdminShell title="Coupons" description="Create percentage or fixed promo codes for future cart and checkout application.">
      <AdminResourcePage title="Coupon / Promo Codes" description="Coupon configuration is ready for checkout validation and offer box linking." rows={adminCoupons} columns={["Code", "Type", "Value", "Min Order", "Status", "Expiry"]} primaryAction={{ label: "Add Coupon" }} />
    </AdminShell>
  );
}
