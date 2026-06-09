import { Prisma, PublishStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { ProductInput, ProductQueryInput } from "@/validators/product";

export async function listProducts(query: ProductQueryInput) {
  const where: Prisma.ProductWhereInput = {
    status: PublishStatus.PUBLISHED,
    deletedAt: null,
    ...(query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: "insensitive" } },
            { sku: { contains: query.search, mode: "insensitive" } },
            { tags: { has: query.search } },
            { shortDescription: { contains: query.search, mode: "insensitive" } },
            { description: { contains: query.search, mode: "insensitive" } }
          ]
        }
      : {}),
    ...(query.category ? { category: { slug: query.category } } : {}),
    ...(query.brand ? { brand: { slug: query.brand } } : {}),
    ...(query.minPrice || query.maxPrice ? { price: { gte: query.minPrice, lte: query.maxPrice } } : {})
  };

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    query.sort === "low"
      ? { price: "asc" }
      : query.sort === "high"
        ? { price: "desc" }
        : query.sort === "newest"
          ? { createdAt: "desc" }
          : { updatedAt: "desc" };

  const [items, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      include: { brand: true, category: true, images: { orderBy: { sortOrder: "asc" } } },
      orderBy,
      skip: (query.page - 1) * query.limit,
      take: query.limit
    }),
    prisma.product.count({ where })
  ]);

  return { items, total, page: query.page, limit: query.limit };
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: { slug, status: PublishStatus.PUBLISHED, deletedAt: null },
    include: { brand: true, category: true, images: { orderBy: { sortOrder: "asc" } }, reviews: { where: { status: "APPROVED" } } }
  });
}

export async function createProduct(input: ProductInput) {
  const data: Prisma.ProductUncheckedCreateInput = {
    ...input,
    brandId: input.brandId ?? null,
    categoryId: input.categoryId ?? null,
    specifications: input.specifications as Prisma.InputJsonValue | undefined,
    price: new Prisma.Decimal(input.price),
    oldPrice: input.oldPrice ? new Prisma.Decimal(input.oldPrice) : undefined,
    discountPercent: input.oldPrice ? Math.max(0, Math.round(((input.oldPrice - input.price) / input.oldPrice) * 100)) : 0
  };

  return prisma.product.create({
    data
  });
}

export async function updateProduct(id: string, input: ProductInput) {
  const data: Prisma.ProductUncheckedUpdateInput = {
    ...input,
    brandId: input.brandId ?? null,
    categoryId: input.categoryId ?? null,
    specifications: input.specifications as Prisma.InputJsonValue | undefined,
    price: new Prisma.Decimal(input.price),
    oldPrice: input.oldPrice ? new Prisma.Decimal(input.oldPrice) : null,
    discountPercent: input.oldPrice ? Math.max(0, Math.round(((input.oldPrice - input.price) / input.oldPrice) * 100)) : 0
  };

  return prisma.product.update({
    where: { id },
    data
  });
}

export async function softDeleteProduct(id: string) {
  return prisma.product.update({ where: { id }, data: { deletedAt: new Date(), status: PublishStatus.ARCHIVED } });
}
