import "server-only";

import { ReviewStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export function getReviews() {
  return prisma.review.findMany({
    include: { product: true, user: true },
    orderBy: { createdAt: "desc" }
  });
}

export function updateReviewStatus(id: string, status: ReviewStatus) {
  return prisma.review.update({ where: { id }, data: { status } });
}
