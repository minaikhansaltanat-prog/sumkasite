"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/components/layout/LangProvider";

export interface CategoryTile {
  slug: string;
  nameKaz: string;
  nameRus: string;
  imageUrl: string | null;
  totalCount?: number;
}

export function CategoriesGrid({ categories }: { categories: CategoryTile[] }) {
  const { lang, t } = useLang();
  return (
    <section className="bg-cream py-16">
      <div className="container-page">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-center">{t("home", "categoriesTitle")}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 mt-8">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/catalog?category=${c.slug}`}
              className="group relative aspect-[4/3] rounded-card overflow-hidden bg-ink"
            >
              {c.imageUrl && (
                <Image
                  src={c.imageUrl}
                  alt={lang === "kk" ? c.nameKaz : c.nameRus}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
              {c.totalCount === 0 && (
                <span className="absolute top-3 right-3 bg-gold text-white text-[10px] font-bold uppercase px-2 py-1 rounded-full shadow-ribbon">
                  Жақында
                </span>
              )}
              <span className="absolute bottom-4 left-4 text-white font-display text-lg sm:text-xl font-bold">
                {lang === "kk" ? c.nameKaz : c.nameRus}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
