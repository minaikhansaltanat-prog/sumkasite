import { prisma } from "@/lib/db";
import { ProductsTable } from "@/components/admin/ProductsTable";
import { Pagination } from "@/components/catalog/Pagination";

export const metadata = { title: "Сумкалар | SAMGA Admin" };

const PAGE_SIZE = 50;

interface PageProps {
  searchParams: Promise<{ search?: string; page?: string }>;
}

export default async function AdminProductsPage({ searchParams }: PageProps) {
  const { search, page: pageStr } = await searchParams;
  const page = Number(pageStr) || 1;
  const where = search
    ? { OR: [{ nameKaz: { contains: search } }, { sku: { contains: search } }] }
    : undefined;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { category: true, images: { orderBy: { order: "asc" }, take: 1 } },
    }),
    prisma.product.count({ where }),
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Сумкалар ({total})</h1>
      <ProductsTable products={products} />
      <Pagination page={page} totalPages={Math.max(1, Math.ceil(total / PAGE_SIZE))} />
    </div>
  );
}
