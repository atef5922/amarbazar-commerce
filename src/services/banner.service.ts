import "server-only";

import { PublishStatus, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export function getBanners(type?: string) {
  return prisma.banner.findMany({
    where: type ? { type } : undefined,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }]
  });
}

export function createBanner(data: Prisma.BannerUncheckedCreateInput) {
  return prisma.banner.create({ data });
}

export function updateBanner(id: string, data: Prisma.BannerUncheckedUpdateInput) {
  return prisma.banner.update({ where: { id }, data });
}

export function deleteBanner(id: string) {
  return prisma.banner.update({ where: { id }, data: { status: PublishStatus.ARCHIVED } });
}
