import { prisma } from "./db";
import type { Prisma } from "@prisma/client";

export interface ProductFilter {
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  material?: string;
  color?: string;
  size?: string;
  sort?: "new" | "price_asc" | "price_desc" | "hit";
  page?: number;
  pageSize?: number;
  search?: string;
  onlyPublished?: boolean;
}

const PRODUCT_INCLUDE = {
  images: { orderBy: { order: "asc" as const } },
  category: true,
};

export async function getProducts(filter: ProductFilter = {}) {
  const {
    categorySlug,
    minPrice,
    maxPrice,
    material,
    color,
    size,
    sort = "new",
    page = 1,
    pageSize = 20,
    search,
    onlyPublished = true,
  } = filter;

  const where: Prisma.ProductWhereInput = {
    ...(onlyPublished ? { isPublished: true } : {}),
    ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    ...(minPrice ? { price: { gte: minPrice } } : {}),
    ...(maxPrice ? { price: { lte: maxPrice } } : {}),
    ...(material ? { material: { contains: material } } : {}),
    ...(color ? { color: { contains: color } } : {}),
    ...(size ? { size: { contains: size } } : {}),
    ...(search
      ? {
          OR: [
            { nameKaz: { contains: search } },
            { nameRus: { contains: search } },
            { sku: { contains: search } },
          ],
        }
      : {}),
  };

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "price_asc"
      ? { price: "asc" }
      : sort === "price_desc"
        ? { price: "desc" }
        : sort === "hit"
          ? { isHit: "desc" }
          : { createdAt: "desc" };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: PRODUCT_INCLUDE,
    }),
    prisma.product.count({ where }),
  ]);

  return { products, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: PRODUCT_INCLUDE,
  });
}

export async function getRelatedProducts(categoryId: string, excludeId: string, take = 4) {
  return prisma.product.findMany({
    where: { categoryId, isPublished: true, id: { not: excludeId } },
    take,
    orderBy: { createdAt: "desc" },
    include: PRODUCT_INCLUDE,
  });
}

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { order: "asc" } });
}

export async function getHitProducts(take = 6) {
  const hits = await prisma.product.findMany({
    where: { isPublished: true, isHit: true },
    take,
    orderBy: { createdAt: "desc" },
    include: PRODUCT_INCLUDE,
  });
  if (hits.length >= take) return hits;
  const fallback = await prisma.product.findMany({
    where: { isPublished: true, id: { notIn: hits.map((h) => h.id) } },
    take: take - hits.length,
    orderBy: { createdAt: "desc" },
    include: PRODUCT_INCLUDE,
  });
  return [...hits, ...fallback];
}

export async function getCatalogStats() {
  const [productCount] = await Promise.all([prisma.product.count({ where: { isPublished: true } })]);
  return { productCount };
}

export async function getDistinctMaterials() {
  const rows = await prisma.product.findMany({
    where: { isPublished: true, material: { not: "" } },
    select: { material: true },
    distinct: ["material"],
  });
  return rows.map((r) => r.material);
}
