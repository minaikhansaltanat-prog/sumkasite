import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";
import { getSuppliers } from "@/lib/queries";
import { ProductsTable } from "@/components/admin/ProductsTable";
import { Pagination } from "@/components/catalog/Pagination";

export const metadata = { title: "Сумкалар | SAMGA Admin" };

const PAGE_SIZE = 50;

interface PageProps {
  searchParams: Promise<{ search?: string; page?: string; supplier?: string }>;
}

export default async function AdminProductsPage({ searchParams }: PageProps) {
  const { search, page: pageStr, supplier } = await searchParams;
  const page = Number(pageStr) || 1;
  const where: Prisma.ProductWhereInput = {
    ...(search ? { OR: [{ nameKaz: { contains: search } }, { sku: { contains: search } }] } : {}),
    ...(supplier ? { supplierId: supplier } : {}),
  };

  const [products, total, suppliers] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { category: true, supplier: true, images: { orderBy: { order: "asc" }, take: 1 } },
    }),
    prisma.product.count({ where }),
    getSuppliers(),
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Сумкалар ({total})</h1>
      <ProductsTable products={products} suppliers={suppliers} />
      <Pagination page={page} totalPages={Math.max(1, Math.ceil(total / PAGE_SIZE))} />
    </div>
  );
}
