"use client";

import Link from "next/link";
import { useActionState, type ReactNode } from "react";
import { Lock, Mail, ShieldCheck } from "lucide-react";
import { adminSignInWithEmail, signInWithGoogle } from "@/actions/authActions";

export function AdminAuth({ mode: _mode }: { mode?: "login" }) {
  const [state, formAction, loading] = useActionState(adminSignInWithEmail, { ok: false, message: "" });

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#f7f7fb] px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(245,114,36,0.13),transparent_34%),radial-gradient(circle_at_70%_70%,rgba(91,77,184,0.14),transparent_32%)]" />
      <section className="relative z-10 w-full max-w-[440px]">
        <div className="mb-6 text-center">
          <Link href="/" className="inline-flex items-center justify-center gap-2">
            <span className="text-3xl font-black text-primary">Amar</span>
            <span className="text-3xl font-black text-ink">Bazar</span>
          </Link>
          <p className="mt-2 text-xs font-black uppercase tracking-[0.3em] text-zinc-400">Admin Panel</p>
        </div>

        <div className="rounded-2xl border border-white bg-white/95 p-6 shadow-[0_24px_80px_rgba(34,34,34,0.12)] backdrop-blur sm:p-8">
          <div className="mb-6 flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-2xl font-black">Admin Login</h1>
              <p className="mt-1 text-sm leading-6 text-zinc-500">
                Access the AmarBazar store management dashboard.
              </p>
            </div>
          </div>

          <form action={formAction} className="grid gap-4">
            <AuthField name="email" icon={<Mail className="h-4 w-4" />} placeholder="Email address" type="email" />
            <AuthField name="password" icon={<Lock className="h-4 w-4" />} placeholder="Password" type="password" />
            <Link href="/forgot-password" className="text-right text-sm font-bold text-primary">Forgot password?</Link>
            {state.message ? <p className="text-sm font-bold text-red-600">{state.message}</p> : null}
            <button disabled={loading} className="h-12 rounded-xl bg-primary text-sm font-black uppercase text-white transition-all hover:-translate-y-0.5 hover:bg-accent hover:shadow-lg disabled:opacity-60">
              {loading ? "Please wait..." : "Login"}
            </button>
          </form>
          <form action={signInWithGoogle} className="mt-4">
            <button type="submit" className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-white text-sm font-black transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-sm">
              <span className="text-base font-black text-[#4285F4]">G</span>
              Continue with Google
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            Need admin access? Ask a SUPER_ADMIN to approve your account from Admin Users.
          </p>
        </div>
      </section>
    </main>
  );
}

function AuthField({ name, icon, placeholder, type = "text" }: { name: string; icon: ReactNode; placeholder: string; type?: string }) {
  return (
    <label className="flex h-12 items-center gap-3 rounded-xl border border-zinc-200 bg-white px-3 transition-colors focus-within:border-primary">
      <span className="text-zinc-400">{icon}</span>
      <input required name={name} type={type} placeholder={placeholder} className="min-w-0 flex-1 text-sm font-semibold outline-none" />
    </label>
  );
}
