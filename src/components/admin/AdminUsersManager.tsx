"use client";

import { useActionState } from "react";
import { Check, ShieldCheck, Trash2, UserCheck, UserMinus, UserPlus } from "lucide-react";
import { addAdminAction, approveAdminAction, blockAdminAction, changeAdminRoleAction, deleteAdminAction, unblockAdminAction } from "@/actions/adminUserActions";

type AdminRow = {
  id: string;
  email: string;
  fullName: string | null;
  role: string;
  status: string;
  phone: string | null;
  createdAt: Date;
};

export function AdminUsersManager({ admins }: { admins: AdminRow[] }) {
  const [state, action, pending] = useActionState(addAdminAction, { ok: false, message: "" });

  return (
    <div className="grid gap-5">
      <section className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-start gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary"><ShieldCheck className="h-5 w-5" /></span>
          <div>
            <h2 className="text-xl font-black">Add or Approve Admin</h2>
            <p className="mt-1 text-sm text-zinc-500">Only SUPER_ADMIN can add admins. Public role selection is disabled.</p>
          </div>
        </div>
        <form action={action} className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
          <input name="fullName" placeholder="Full name" className="admin-field" />
          <input required name="email" type="email" placeholder="admin@example.com" className="admin-field" />
          <input required name="password" type="password" minLength={8} placeholder="Temporary password" className="admin-field" />
          <button disabled={pending} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-accent disabled:opacity-60">
            <UserPlus className="h-4 w-4" /> {pending ? "Saving..." : "Add Admin"}
          </button>
        </form>
        {state.message ? <p className={`mt-3 text-sm font-bold ${state.ok ? "text-emerald-600" : "text-red-600"}`}>{state.message}</p> : null}
      </section>

      <section className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-soft text-xs font-black uppercase text-zinc-500">
              <tr>
                <th className="px-5 py-4">Admin</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Phone</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => {
                const isSuper = admin.role === "SUPER_ADMIN";
                const blocked = admin.status === "BLOCKED";
                return (
                  <tr key={admin.id} className="border-t border-zinc-100">
                    <td className="px-5 py-4">
                      <p className="font-black">{admin.fullName ?? admin.email.split("@")[0]}</p>
                      <p className="text-xs font-semibold text-zinc-500">{admin.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-soft px-3 py-1 text-xs font-black text-primary">{admin.role}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={blocked ? "rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-600" : "rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-600"}>{admin.status}</span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-zinc-600">{admin.phone ?? "-"}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap justify-end gap-2">
                        <form action={approveAdminAction.bind(null, admin.id)}>
                          <IconButton label="Approve"><Check className="h-4 w-4" /></IconButton>
                        </form>
                        <form action={changeAdminRoleAction.bind(null, admin.id, "ADMIN")}>
                          <IconButton label="Set ADMIN" disabled={isSuper}><UserCheck className="h-4 w-4" /></IconButton>
                        </form>
                        {blocked ? (
                          <form action={unblockAdminAction.bind(null, admin.id)}>
                            <IconButton label="Unblock" disabled={isSuper}><ShieldCheck className="h-4 w-4" /></IconButton>
                          </form>
                        ) : (
                          <form action={blockAdminAction.bind(null, admin.id)}>
                            <IconButton label="Block" disabled={isSuper}><UserMinus className="h-4 w-4" /></IconButton>
                          </form>
                        )}
                        <form action={deleteAdminAction.bind(null, admin.id)}>
                          <IconButton label="Delete" disabled={isSuper} danger><Trash2 className="h-4 w-4" /></IconButton>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function IconButton({ children, label, disabled, danger }: { children: React.ReactNode; label: string; disabled?: boolean; danger?: boolean }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      title={label}
      aria-label={label}
      className={`grid h-9 w-9 place-items-center rounded-lg border border-zinc-200 transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 ${danger ? "hover:border-red-500 hover:text-red-600" : "hover:border-primary hover:text-primary"}`}
    >
      {children}
    </button>
  );
}
