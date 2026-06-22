import type { Metadata } from "next";
import { getProducts, getCategories, getDistinctMaterials, getHitProducts, type ProductFilter } from "@/lib/queries";
import { FilterSidebar } from "@/components/catalog/FilterSidebar";
import { ProductCard } from "@/components/catalog/ProductCard";
import { Pagination } from "@/components/catalog/Pagination";
import { CatalogHeading } from "./CatalogHeading";

export const metadata: Metadata = {
  title: "Оптом сумка каталогы | SAMGA",
  description: "200-ден астам модель — Қазақстан бойынша жеткізу. Категория, баға, материал бойынша сүзгілеу.",
};

interface CatalogPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const sp = await searchParams;
  const page = Number(sp.page) || 1;

  const [{ products, total, totalPages }, categories, materials, bestsellers] = await Promise.all([
    getProducts({
      categorySlug: sp.category,
      minPrice: sp.min ? Number(sp.min) : undefined,
      maxPrice: sp.max ? Number(sp.max) : undefined,
      material: sp.material,
      search: sp.search,
      sort: (sp.sort as ProductFilter["sort"]) || "new",
      page,
      pageSize: 24,
    }),
    getCategories(),
    getDistinctMaterials(),
    getHitProducts(4),
  ]);

  return (
    <div className="container-page py-10">
      <CatalogHeading total={total} />

      <div className="flex flex-col lg:flex-row gap-8 mt-8">
        <FilterSidebar categories={categories} materials={materials} bestsellers={bestsellers} />

        <div className="flex-1">
          {products.length === 0 ? (
            <div className="py-20 text-center text-ink-muted">Сумка табылмады</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
          <Pagination page={page} totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
}
