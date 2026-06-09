import { AdminShell } from "@/components/admin/AdminShell";

const settings = [
  "Website logo",
  "Favicon",
  "Store name",
  "Store tagline",
  "Phone",
  "Email",
  "Address",
  "Facebook",
  "Instagram",
  "YouTube",
  "Currency",
  "Footer text",
  "Delivery settings",
  "Tax settings",
  "SEO default title",
  "SEO default description"
];

export default function AdminSettingsPage() {
  return (
    <AdminShell title="Settings" description="Control storefront identity, contact info, payment labels, delivery, tax, and SEO defaults.">
      <form className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black">Store Settings</h2>
          <div className="mt-5 grid gap-4">
            {settings.slice(0, 8).map((field) => (
              <label key={field} className="block text-sm font-black">{field}<input className="admin-field mt-2" placeholder={field} /></label>
            ))}
          </div>
        </section>
        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black">Frontend & SEO</h2>
          <div className="mt-5 grid gap-4">
            {settings.slice(8).map((field) => (
              <label key={field} className="block text-sm font-black">{field}<input className="admin-field mt-2" placeholder={field} /></label>
            ))}
            <button className="h-11 rounded-lg bg-primary text-sm font-black uppercase text-white">Save Settings</button>
          </div>
        </section>
      </form>
    </AdminShell>
  );
}
