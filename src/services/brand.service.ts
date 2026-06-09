import "server-only";

import { PublishStatus, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export function getBrands() {
  return prisma.brand.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { products: true } } }
  });
}

export function createBrand(data: Prisma.BrandUncheckedCreateInput) {
  return prisma.brand.create({ data });
}

export function updateBrand(id: string, data: Prisma.BrandUncheckedUpdateInput) {
  return prisma.brand.update({ where: { id }, data });
}

export function deleteBrand(id: string) {
  return prisma.brand.update({ where: { id }, data: { status: PublishStatus.ARCHIVED } });
}
