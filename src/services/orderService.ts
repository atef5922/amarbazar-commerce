import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { CheckoutInput } from "@/validators/checkout";

export async function createOrderFromCart(input: CheckoutInput) {
  return prisma.$transaction(async (tx) => {
    const cart = await tx.cart.findFirst({
      where: input.userId ? { userId: input.userId, status: "ACTIVE" } : { guestId: input.guestId, status: "ACTIVE" }
    });

    if (!cart) throw new Error("Cart is empty");

    const items = await tx.cartItem.findMany({
      where: { cartId: cart.id },
      include: { product: true }
    });

    if (!items.length) throw new Error("Cart is empty");

    for (const item of items) {
      if (item.product.stock < item.quantity) {
        throw new Error(`${item.product.name} does not have enough stock`);
      }
    }

    const subtotal = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
    const shipping = subtotal >= 5000 ? 0 : 120;
    const taxes = 0;
    const discount = 0;
    const total = subtotal + shipping + taxes - discount;
    const orderNumber = await generateOrderNumber();

    const order = await tx.order.create({
      data: {
        orderNumber,
        userId: input.userId,
        paymentMethod: input.paymentMethod,
        subtotal: new Prisma.Decimal(subtotal),
        shipping: new Prisma.Decimal(shipping),
        taxes: new Prisma.Decimal(taxes),
        discount: new Prisma.Decimal(discount),
        total: new Prisma.Decimal(total),
        billingAddress: input.billingAddress,
        shippingAddress: input.shippingAddress,
        note: input.note,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            sku: item.product.sku,
            name: item.product.name,
            quantity: item.quantity,
            price: item.price,
            total: new Prisma.Decimal(Number(item.price) * item.quantity)
          }))
        }
      }
    });

    await Promise.all(
      items.map((item) =>
        tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        })
      )
    );

    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
    await tx.cart.update({ where: { id: cart.id }, data: { status: "CONVERTED" } });
    return order;
  });
}

async function generateOrderNumber() {
  const year = new Date().getFullYear();
  const count = await prisma.order.count({
    where: {
      createdAt: {
        gte: new Date(`${year}-01-01T00:00:00.000Z`),
        lt: new Date(`${year + 1}-01-01T00:00:00.000Z`)
      }
    }
  });
  return `AMB-${year}-${String(count + 1).padStart(6, "0")}`;
}
