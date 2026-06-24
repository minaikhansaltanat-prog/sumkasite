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

// costPrice, brand, supplierId/supplier бұл жерде ӓдейі жоқ — бұлар тек
// admin панелінде көрінуі керек ішкі ақпарат (зауыт бағасы, бренд, жеткізуші
// классификациясы). Бұл select клиентке жіберілетін объектіге қандай
// өрістер кіретінін толық бақылайды (include барлық scalar өрісті
// автоматты қосады, сол себепті select қолданамыз).
const PRODUCT_SELECT = {
  id: true,
  slug: true,
  sku: true,
  nameKaz: true,
  nameRus: true,
  descKaz: true,
  descRus: true,
  price: true,
  retailPrice: true,
  minOrder: true,
  bundleSize: true,
  stock: true,
  material: true,
  color: true,
  size: true,
  categoryId: true,
  isPublished: true,
  isNew: true,
  isHit: true,
  createdAt: true,
  updatedAt: true,
  images: { orderBy: { order: "asc" as const } },
  category: true,
} satisfies Prisma.ProductSelect;

async function resolveCategoryFilterIds(categorySlug: string) {
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
    include: { children: { select: { id: true } } },
  });
  if (!category) return [];
  return category.children.length > 0 ? [category.id, ...category.children.map((c) => c.id)] : [category.id];
}

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

  const categoryIds = categorySlug ? await resolveCategoryFilterIds(categorySlug) : null;

  const where: Prisma.ProductWhereInput = {
    ...(onlyPublished ? { isPublished: true } : {}),
    ...(categoryIds ? { categoryId: { in: categoryIds } } : {}),
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
      select: PRODUCT_SELECT,
    }),
    prisma.product.count({ where }),
  ]);

  return { products, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    select: PRODUCT_SELECT,
  });
}

export async function getRelatedProducts(categoryId: string, excludeId: string, take = 4) {
  return prisma.product.findMany({
    where: { categoryId, isPublished: true, id: { not: excludeId } },
    take,
    orderBy: { createdAt: "desc" },
    select: PRODUCT_SELECT,
  });
}

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { order: "asc" } });
}

export interface CategoryTreeNode {
  id: string;
  slug: string;
  nameKaz: string;
  nameRus: string;
  imageUrl: string | null;
  productCount: number;
  totalCount: number;
  children: CategoryTreeNode[];
}

export async function getCategoryTree(): Promise<CategoryTreeNode[]> {
  const all = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { products: true } } },
  });

  const childrenByParent = new Map<string, typeof all>();
  for (const c of all) {
    if (!c.parentId) continue;
    const list = childrenByParent.get(c.parentId) ?? [];
    list.push(c);
    childrenByParent.set(c.parentId, list);
  }

  return all
    .filter((c) => !c.parentId)
    .map((main) => {
      const children = (childrenByParent.get(main.id) ?? []).map((child) => ({
        id: child.id,
        slug: child.slug,
        nameKaz: child.nameKaz,
        nameRus: child.nameRus,
        imageUrl: child.imageUrl,
        productCount: child._count.products,
        totalCount: child._count.products,
        children: [],
      }));
      const childTotal = children.reduce((sum, c) => sum + c.totalCount, 0);
      return {
        id: main.id,
        slug: main.slug,
        nameKaz: main.nameKaz,
        nameRus: main.nameRus,
        imageUrl: main.imageUrl,
        productCount: main._count.products,
        totalCount: main._count.products + childTotal,
        children,
      };
    });
}

export async function getHitProducts(take = 6) {
  const hits = await prisma.product.findMany({
    where: { isPublished: true, isHit: true },
    take,
    orderBy: { createdAt: "desc" },
    select: PRODUCT_SELECT,
  });
  if (hits.length >= take) return hits;
  const fallback = await prisma.product.findMany({
    where: { isPublished: true, id: { notIn: hits.map((h) => h.id) } },
    take: take - hits.length,
    orderBy: { createdAt: "desc" },
    select: PRODUCT_SELECT,
  });
  return [...hits, ...fallback];
}

export async function getCatalogStats() {
  const [productCount] = await Promise.all([prisma.product.count({ where: { isPublished: true } })]);
  return { productCount };
}

export async function getSuppliers() {
  const suppliers = await prisma.supplier.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });
  return suppliers.map((s) => ({
    id: s.id,
    name: s.name,
    contact: s.contact,
    note: s.note,
    productCount: s._count.products,
  }));
}

export async function getDistinctMaterials() {
  const rows = await prisma.product.findMany({
    where: { isPublished: true, material: { not: "" } },
    select: { material: true },
    distinct: ["material"],
  });
  return rows.map((r) => r.material);
}
