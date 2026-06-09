"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Lock, Mail, Phone, User } from "lucide-react";
import { signInWithEmail, registerWithEmail, signInWithGoogle, sendPasswordReset, updatePassword } from "@/actions/authActions";
import { Button } from "@/components/common/Button";

type AuthMode = "login" | "register" | "forgot" | "reset";

const initialState = { ok: false, message: "" };

export function AuthForm({ mode }: { mode: AuthMode }) {
  const action = mode === "login" ? signInWithEmail : mode === "register" ? registerWithEmail : mode === "forgot" ? sendPasswordReset : updatePassword;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <main className="bg-soft py-10">
      <section className="container-page grid min-h-[560px] place-items-center">
        <div className="w-full max-w-lg rounded-2xl border border-zinc-100 bg-white p-8 shadow-soft">
          <h1 className="text-3xl font-black">{getTitle(mode)}</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-500">{getDescription(mode)}</p>

          <form action={formAction} className="mt-6 grid gap-4">
            {mode === "register" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <AuthField name="fullName" label="Full Name" icon={<User className="h-4 w-4" />} />
                <AuthField name="phone" label="Phone" icon={<Phone className="h-4 w-4" />} />
              </div>
            ) : null}
            {mode !== "reset" ? <AuthField name="email" label="Email" type="email" icon={<Mail className="h-4 w-4" />} /> : null}
            {mode !== "forgot" ? <AuthField name="password" label="Password" type="password" icon={<Lock className="h-4 w-4" />} /> : null}
            {state.message ? <p className={state.ok ? "text-sm font-bold text-emerald-600" : "text-sm font-bold text-red-600"}>{state.message}</p> : null}
            <Button disabled={pending} className="w-full">{pending ? "Please wait..." : getButtonLabel(mode)}</Button>
          </form>

          {mode === "login" ? (
            <form action={signInWithGoogle} className="mt-4">
              <button className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-white text-sm font-black transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-sm">
                <GoogleLogo />
                Continue with Google
              </button>
            </form>
          ) : null}

          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-zinc-500">
            {mode === "login" ? <Link href="/forgot-password" className="font-bold text-primary">Forgot password?</Link> : null}
            {mode !== "login" ? <Link href="/login" className="font-bold text-primary">Back to login</Link> : null}
            {mode === "login" ? <span>New here? <Link href="/register" className="font-bold text-primary">Create account</Link></span> : null}
          </div>
        </div>
      </section>
    </main>
  );
}

function AuthField({ name, label, icon, type = "text" }: { name: string; label: string; icon: React.ReactNode; type?: string }) {
  return (
    <label className="block text-sm font-bold text-zinc-800">
      {label}
      <span className="mt-2 flex h-12 items-center gap-3 rounded-xl border border-zinc-200 bg-white px-3 transition-colors focus-within:border-primary">
        <span className="text-zinc-400">{icon}</span>
        <input required name={name} type={type} className="min-w-0 flex-1 text-sm font-semibold outline-none" />
      </span>
    </label>
  );
}

function GoogleLogo() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.3 9.14 5.38 12 5.38z" />
    </svg>
  );
}

function getTitle(mode: AuthMode) {
  if (mode === "register") return "Create Account";
  if (mode === "forgot") return "Forgot Password";
  if (mode === "reset") return "Reset Password";
  return "Login";
}

function getDescription(mode: AuthMode) {
  if (mode === "register") return "Create your AmarBazar customer account with Supabase Auth.";
  if (mode === "forgot") return "Enter your email and we will send a secure reset link.";
  if (mode === "reset") return "Set a new password for your AmarBazar account.";
  return "Access your orders, wishlist, cart, and dashboard.";
}

function getButtonLabel(mode: AuthMode) {
  if (mode === "register") return "Register";
  if (mode === "forgot") return "Send Reset Link";
  if (mode === "reset") return "Update Password";
  return "Login";
}
