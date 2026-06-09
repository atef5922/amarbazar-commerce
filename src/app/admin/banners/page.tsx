import { AdminResourcePage } from "@/components/admin/AdminResourcePage";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminBanners } from "@/data/admin";

export default function AdminBannersPage() {
  return (
    <AdminShell title="Banners" description="Manage hero, promo, CTA, shop, product, and footer banners.">
      <AdminResourcePage title="Banner Management" description="Published banners are frontend-ready with image, button, link, date, and position fields." rows={adminBanners} columns={["Title", "Type", "Position", "Status", "Link"]} primaryAction={{ label: "Add Banner" }} />
    </AdminShell>
  );
}
