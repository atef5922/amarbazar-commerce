import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function getOrCreateCart(identity: { userId?: string; guestId?: string }) {
  const where = identity.userId ? { userId: identity.userId, status: "ACTIVE" as const } : { guestId: identity.guestId, status: "ACTIVE" as const };
  const cart = await prisma.cart.findFirst({ where, include: { items: { include: { product: { include: { images: true } } } }, coupon: true } });
  if (cart) return cart;
  return prisma.cart.create({ data: identity, include: { items: { include: { product: { include: { images: true } } } }, coupon: true } });
}

export async function addCartItem(cartId: string, productId: string, quantity: number) {
  const product = await prisma.product.findUniqueOrThrow({ where: { id: productId } });
  return prisma.cartItem.upsert({
    where: { cartId_productId: { cartId, productId } },
    update: { quantity: { increment: quantity } },
    create: { cartId, productId, quantity, price: new Prisma.Decimal(product.price) }
  });
}

export async function updateCartItemQuantity(cartItemId: string, quantity: number) {
  if (quantity <= 0) return prisma.cartItem.delete({ where: { id: cartItemId } });
  return prisma.cartItem.update({ where: { id: cartItemId }, data: { quantity } });
}

export function clearCart(cartId: string) {
  return prisma.cartItem.deleteMany({ where: { cartId } });
}
