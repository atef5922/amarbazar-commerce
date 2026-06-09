import "server-only";

import { PublishStatus, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export function getCategories() {
  return prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { products: true } } }
  });
}

export function createCategory(data: Prisma.CategoryUncheckedCreateInput) {
  return prisma.category.create({ data });
}

export function updateCategory(id: string, data: Prisma.CategoryUncheckedUpdateInput) {
  return prisma.category.update({ where: { id }, data });
}

export function deleteCategory(id: string) {
  return prisma.category.update({ where: { id }, data: { status: PublishStatus.ARCHIVED } });
}
