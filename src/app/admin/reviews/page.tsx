import { AdminResourcePage } from "@/components/admin/AdminResourcePage";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminReviews } from "@/data/admin";

export default function AdminReviewsPage() {
  return (
    <AdminShell title="Reviews" description="Approve, reject, delete, and filter product reviews.">
      <AdminResourcePage title="Review Moderation" description="Only approved reviews should be exposed to the storefront later." rows={adminReviews} columns={["Product", "Customer", "Rating", "Status", "Text"]} />
    </AdminShell>
  );
}
