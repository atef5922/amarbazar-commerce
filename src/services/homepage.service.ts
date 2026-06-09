import "server-only";

import { PublishStatus, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export function getHomepageSections() {
  return prisma.homepageSection.findMany({
    where: { status: PublishStatus.PUBLISHED },
    orderBy: { sortOrder: "asc" }
  });
}

export function updateHomepageSection(id: string, data: Prisma.HomepageSectionUncheckedUpdateInput) {
  return prisma.homepageSection.update({ where: { id }, data });
}
