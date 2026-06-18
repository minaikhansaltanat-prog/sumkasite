import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata = { title: "Сумканы өзгерту | SAMGA Admin" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id }, include: { images: { orderBy: { order: "asc" } } } }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);
  if (!product) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Сумканы өзгерту</h1>
      <ProductForm
        categories={categories}
        initial={{
          id: product.id,
          nameKaz: product.nameKaz,
          nameRus: product.nameRus,
          sku: product.sku,
          descKaz: product.descKaz,
          descRus: product.descRus,
          price: product.price,
          retailPrice: product.retailPrice,
          minOrder: product.minOrder,
          bundleSize: product.bundleSize,
          stock: product.stock,
          material: product.material,
          color: product.color,
          size: product.size,
          categoryId: product.categoryId,
          isPublished: product.isPublished,
          isNew: product.isNew,
          isHit: product.isHit,
          images: product.images.map((img) => ({
            url: img.url,
            thumbUrl: img.thumbUrl,
            order: img.order,
            isMain: img.isMain,
          })),
        }}
      />
    </div>
  );
}
