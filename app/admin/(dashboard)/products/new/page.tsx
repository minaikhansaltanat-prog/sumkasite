import { prisma } from "@/lib/db";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata = { title: "Жаңа сумка | SAMGA Admin" };

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });
  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Жаңа сумка қосу</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
