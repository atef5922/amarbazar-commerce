"use server";

import { redirect } from "next/navigation";
import { checkoutSchema } from "@/validators/checkout";
import { createOrderFromCart } from "@/services/orderService";

export async function createOrderAction(_: unknown, formData: FormData) {
  const payload = {
    userId: formData.get("userId") || undefined,
    guestId: formData.get("guestId") || undefined,
    paymentMethod: formData.get("paymentMethod"),
    note: formData.get("note") || undefined,
    billingAddress: parseAddress(formData, "billing"),
    shippingAddress: parseAddress(formData, "shipping")
  };

  const parsed = checkoutSchema.safeParse(payload);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid checkout data" };
  const order = await createOrderFromCart(parsed.data);
  redirect(`/checkout/success?order=${order.orderNumber}`);
}

function parseAddress(formData: FormData, prefix: "billing" | "shipping") {
  return {
    fullName: formData.get(`${prefix}FullName`),
    phone: formData.get(`${prefix}Phone`),
    division: formData.get(`${prefix}Division`) || undefined,
    district: formData.get(`${prefix}District`) || undefined,
    area: formData.get(`${prefix}Area`) || undefined,
    addressLine: formData.get(`${prefix}AddressLine`)
  };
}
