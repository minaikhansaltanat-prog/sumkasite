"use client";

import Link from "next/link";
import { useLang } from "@/components/layout/LangProvider";
import { ProductActions } from "./ProductActions";

export interface ProductInfoData {
  id: string;
  nameKaz: string;
  nameRus: string;
  descKaz: string;
  descRus: string;
  sku: string;
  price: number;
  retailPrice: number | null;
  minOrder: number;
  bundleSize: number;
  material: string;
  color: string;
  size: string;
  isNew: boolean;
  isHit: boolean;
  category: { slug: string; nameKaz: string; nameRus: string };
}

export function ProductInfo({ product }: { product: ProductInfoData }) {
  const { lang, t } = useLang();
  const name = lang === "kk" ? product.nameKaz : product.nameRus;
  const desc = lang === "kk" ? product.descKaz : product.descRus;
  const categoryName = lang === "kk" ? product.category.nameKaz : product.category.nameRus;

  return (
    <div>
      <nav className="text-xs text-ink-muted mb-3 flex gap-1.5 items-center flex-wrap">
        <Link href="/catalog" className="hover:text-gold">
          {t("nav", "catalog")}
        </Link>
        <span>/</span>
        <Link href={`/catalog?category=${product.category.slug}`} className="hover:text-gold">
          {categoryName}
        </Link>
      </nav>

      <div className="flex gap-2 mb-2">
        {product.isNew && <span className="label-tag bg-ink text-white px-2 py-1 rounded">{t("product", "new")}</span>}
        {product.isHit && <span className="label-tag bg-gold text-white px-2 py-1 rounded">{t("product", "hit")}</span>}
      </div>

      <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink-text">{name}</h1>
      <div className="text-sm price-mono text-ink-muted mt-2">
        {t("product", "article")}: {product.sku}
      </div>

      <div className="flex items-baseline gap-3 mt-4">
        <span className="price-mono text-3xl text-gold font-semibold">
          {product.price.toLocaleString("ru-RU")} {t("catalog", "perDana")}
        </span>
        {product.retailPrice && (
          <span className="text-ink-muted line-through text-sm">
            {product.retailPrice.toLocaleString("ru-RU")} {t("common", "tenge")}
          </span>
        )}
      </div>

      <dl className="grid grid-cols-2 gap-3 mt-6 text-sm border-y border-line py-5">
        <Row label={t("product", "bundleSize")} value={`${product.bundleSize} ${t("catalog", "dana")}`} />
        <Row label={t("product", "minOrder")} value={`${product.minOrder} ${t("catalog", "dana")}`} />
        {product.material && <Row label={t("product", "material")} value={product.material} />}
        {product.color && <Row label={t("product", "color")} value={product.color} />}
        {product.size && <Row label={t("product", "size")} value={product.size} />}
      </dl>

      {desc && <p className="text-ink-muted leading-relaxed mt-5">{desc}</p>}

      <div className="mt-6">
        <ProductActions
          product={{
            id: product.id,
            nameKaz: product.nameKaz,
            sku: product.sku,
            price: product.price,
            minOrder: product.minOrder,
          }}
        />
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="label-tag">{label}</dt>
      <dd className="text-ink-text font-medium mt-0.5">{value}</dd>
    </div>
  );
}
