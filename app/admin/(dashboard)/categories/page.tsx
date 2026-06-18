import { prisma } from "@/lib/db";
import { CategoryManager } from "@/components/admin/CategoryManager";

export const metadata = { title: "Категориялар | SAMGA Admin" };

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { products: true } } },
  });
  return <CategoryManager categories={categories} />;
}
