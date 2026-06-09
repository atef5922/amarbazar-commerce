import { AdminResourcePage } from "@/components/admin/AdminResourcePage";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminBlogs } from "@/data/admin";

export default function AdminBlogsPage() {
  return (
    <AdminShell title="Blog" description="Create electronics buying guides, SEO posts, and store announcements.">
      <AdminResourcePage title="Blog Management" description="Blog fields support title, slug, image, content, status, and SEO metadata." rows={adminBlogs} columns={["Title", "Category", "Status", "Date"]} primaryAction={{ label: "Add Blog" }} />
    </AdminShell>
  );
}
