import { z } from "zod";

export const addressSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(8),
  division: z.string().optional(),
  district: z.string().optional(),
  area: z.string().optional(),
  addressLine: z.string().min(5)
});

export const checkoutSchema = z.object({
  userId: z.string().optional(),
  guestId: z.string().optional(),
  billingAddress: addressSchema,
  shippingAddress: addressSchema,
  couponCode: z.string().optional(),
  paymentMethod: z.string().min(2),
  note: z.string().optional()
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
