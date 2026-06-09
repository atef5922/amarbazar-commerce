"use client";

import Image from "next/image";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, CreditCard, MapPin, PackageCheck, Smartphone } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/common/Button";
import { useCommerceStore } from "@/store/useCommerceStore";
import { formatPrice, slugify } from "@/utils/format";
import { cn } from "@/utils/cn";

const checkoutSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  phone: z.string().min(8, "Valid phone is required"),
  email: z.string().email("Valid email is required"),
  division: z.string().min(2, "Division is required"),
  district: z.string().min(2, "District is required"),
  area: z.string().min(2, "Area/Thana is required"),
  address: z.string().min(8, "Full address is required"),
  notes: z.string().optional(),
  shipping: z.enum(["free", "pickup"]),
  payment: z.enum(["cod", "bkash", "nagad", "card"])
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

const shipping = 0;
const taxes = 0;

export default function CheckoutPage() {
  const [success, setSuccess] = useState(false);
  const { cart, clearCart } = useCommerceStore();
  const subtotal = cart.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const total = subtotal + shipping + taxes;
  const form = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      division: "Dhaka",
      district: "",
      area: "",
      address: "",
      notes: "",
      shipping: "free",
      payment: "cod"
    }
  });

  const onSubmit = form.handleSubmit(() => {
    setSuccess(true);
    clearCart();
  });

  return (
    <main className="bg-soft">
      <section className="bg-white py-10 text-center">
        <div className="container-page">
          <h1 className="text-2xl font-black uppercase">Checkout</h1>
          <div className="mt-3 flex items-center justify-center gap-2 text-xs font-black uppercase">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <span className="text-primary">Checkout</span>
          </div>
        </div>
      </section>

      <section className="container-page py-10">
        {success ? (
          <div className="grid min-h-[420px] place-items-center bg-white p-8 text-center shadow-sm">
            <div>
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h2 className="mt-5 text-2xl font-black">Order placed successfully</h2>
              <p className="mt-2 text-zinc-500">This is a frontend-only demo. Payment and order processing can be connected later.</p>
              <Link href="/products" className="mt-6 inline-flex h-10 items-center justify-center bg-primary px-5 text-sm font-bold text-white transition-all hover:bg-accent">
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : cart.length ? (
          <form onSubmit={onSubmit} className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_420px]">
            <section className="bg-white p-5 shadow-sm md:p-7">
              <h2 className="text-2xl font-black">Billing Details</h2>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <Field label="First Name" error={form.formState.errors.firstName?.message}><input {...form.register("firstName")} className="field" /></Field>
                <Field label="Last Name" error={form.formState.errors.lastName?.message}><input {...form.register("lastName")} className="field" /></Field>
                <Field label="Phone" error={form.formState.errors.phone?.message}><input {...form.register("phone")} className="field" /></Field>
                <Field label="Email Address" error={form.formState.errors.email?.message}><input {...form.register("email")} className="field" /></Field>
                <Field label="Division" error={form.formState.errors.division?.message}><input {...form.register("division")} className="field" /></Field>
                <Field label="District" error={form.formState.errors.district?.message}><input {...form.register("district")} className="field" placeholder="Dhaka, Chattogram..." /></Field>
                <Field label="Area / Thana" error={form.formState.errors.area?.message}><input {...form.register("area")} className="field" /></Field>
                <Field label="Full Address" error={form.formState.errors.address?.message} full><input {...form.register("address")} className="field" placeholder="House, road, area details" /></Field>
                <Field label="Order Notes" full><textarea {...form.register("notes")} className="field min-h-28 resize-none" placeholder="Optional notes for delivery" /></Field>
              </div>
            </section>

            <aside className="h-fit bg-white p-5 shadow-sm md:p-7">
              <h2 className="text-2xl font-black">Order Summary</h2>
              <div className="mt-5 grid gap-4">
                {cart.map((line) => (
                  <Link key={line.product.id} href={`/products/${slugify(line.product.name)}`} className="grid grid-cols-[64px_1fr_auto] items-center gap-3 border-b border-zinc-100 pb-4">
                    <span className="relative h-16 bg-[#fafafa]">
                      <Image src={line.product.image} alt={line.product.name} fill sizes="64px" className="object-contain p-1.5" />
                    </span>
                    <span className="min-w-0">
                      <span className="line-clamp-1 text-sm font-bold">{line.product.name}</span>
                      <span className="text-xs text-zinc-500">Qty {line.quantity}</span>
                    </span>
                    <span className="text-sm font-black text-primary">{formatPrice(line.product.price * line.quantity)}</span>
                  </Link>
                ))}
              </div>

              <div className="mt-5 grid gap-3 text-sm">
                <SummaryRow label="Subtotal" value={formatPrice(subtotal)} />
                <SummaryRow label="Shipping" value="FREE" />
                <SummaryRow label="Taxes" value={formatPrice(taxes)} />
                <div className="mt-2 flex justify-between border-t border-zinc-200 pt-4 text-lg font-black"><span>Total</span><span>{formatPrice(total)}</span></div>
              </div>

              <OptionGroup title="Shipping Options">
                <Choice active={form.watch("shipping") === "free"} icon={<PackageCheck className="h-5 w-5" />} label="Free Shipping" onClick={() => form.setValue("shipping", "free")} />
                <Choice active={form.watch("shipping") === "pickup"} icon={<MapPin className="h-5 w-5" />} label="Local Pickup" onClick={() => form.setValue("shipping", "pickup")} />
              </OptionGroup>

              <OptionGroup title="Payment Options">
                <Choice active={form.watch("payment") === "cod"} icon={<PackageCheck className="h-5 w-5" />} label="Cash on Delivery" onClick={() => form.setValue("payment", "cod")} />
                <Choice active={form.watch("payment") === "bkash"} icon={<Smartphone className="h-5 w-5" />} label="bKash" onClick={() => form.setValue("payment", "bkash")} />
                <Choice active={form.watch("payment") === "nagad"} icon={<Smartphone className="h-5 w-5" />} label="Nagad" onClick={() => form.setValue("payment", "nagad")} />
                <Choice active={form.watch("payment") === "card"} icon={<CreditCard className="h-5 w-5" />} label="Card Payment" onClick={() => form.setValue("payment", "card")} />
              </OptionGroup>

              <Button type="submit" className="mt-6 w-full">Place Order</Button>
            </aside>
          </form>
        ) : (
          <div className="grid min-h-[420px] place-items-center bg-white p-8 text-center shadow-sm">
            <div>
              <h2 className="text-2xl font-black">Your checkout is empty</h2>
              <p className="mt-2 text-zinc-500">Add electronics to your cart before checkout.</p>
              <Link href="/products" className="mt-6 inline-flex h-10 items-center justify-center bg-primary px-5 text-sm font-bold text-white transition-all hover:bg-accent">
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function Field({ label, error, full = false, children }: { label: string; error?: string; full?: boolean; children: ReactNode }) {
  return (
    <label className={cn("block text-sm font-black", full && "md:col-span-2")}>
      {label}
      <span className="mt-2 block">{children}</span>
      {error ? <span className="mt-1 block text-xs font-bold text-primary">{error}</span> : null}
    </label>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between"><span className="text-zinc-500">{label}</span><strong>{value}</strong></div>;
}

function OptionGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-6">
      <h3 className="mb-3 text-sm font-black uppercase">{title}</h3>
      <div className="grid gap-2">{children}</div>
    </div>
  );
}

function Choice({ active, icon, label, onClick }: { active: boolean; icon: ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      className={cn("flex items-center gap-3 border px-4 py-3 text-left text-sm font-bold transition-all duration-300 hover:border-primary hover:text-primary", active ? "border-primary bg-soft text-primary" : "border-zinc-200")}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
}
