import "server-only";

import { OrderStatus, PaymentStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
export { createOrderFromCart as createOrder } from "@/services/orderService";

export function getOrders() {
  return prisma.order.findMany({
    include: { user: true, items: true },
    orderBy: { createdAt: "desc" }
  });
}

export function updateOrderStatus(id: string, status: OrderStatus, paymentStatus?: PaymentStatus) {
  return prisma.order.update({
    where: { id },
    data: { status, ...(paymentStatus ? { paymentStatus } : {}) }
  });
}
