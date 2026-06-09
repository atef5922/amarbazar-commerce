import "server-only";

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export function getCoupons() {
  return prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
}

export function createCoupon(data: Prisma.CouponUncheckedCreateInput) {
  return prisma.coupon.create({ data });
}

export function updateCoupon(id: string, data: Prisma.CouponUncheckedUpdateInput) {
  return prisma.coupon.update({ where: { id }, data });
}

export function deleteCoupon(id: string) {
  return prisma.coupon.update({ where: { id }, data: { status: "ARCHIVED" } });
}
