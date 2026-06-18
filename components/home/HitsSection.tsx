"use client";

import Link from "next/link";
import { useLang } from "@/components/layout/LangProvider";
import { ProductCard, type ProductCardData } from "@/components/catalog/ProductCard";

export function HitsSection({ products }: { products: ProductCardData[] }) {
  const { t } = useLang();
  return (
    <section className="container-page py-16">
      <h2 className="font-display text-2xl sm:text-3xl font-bold text-center">{t("home", "hitsTitle")}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 mt-8">
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
      <div className="text-center mt-10">
        <Link href="/catalog" className="btn-secondary">
          {t("home", "viewAll")}
        </Link>
      </div>
    </section>
  );
}
