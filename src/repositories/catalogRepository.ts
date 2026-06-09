import { PublishStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export function listCategories() {
  return prisma.category.findMany({
    where: { status: PublishStatus.PUBLISHED },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { products: true } } }
  });
}

export function listBrands() {
  return prisma.brand.findMany({
    where: { status: PublishStatus.PUBLISHED },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { products: true } } }
  });
}

export function listHomepageSections() {
  return prisma.homepageSection.findMany({
    where: { enabled: true, status: PublishStatus.PUBLISHED },
    orderBy: { sortOrder: "asc" }
  });
}
