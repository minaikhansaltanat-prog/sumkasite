"use client";

import Image from "next/image";
import Link from "next/link";
import { clsx } from "clsx";
import { useLang } from "@/components/layout/LangProvider";
import { AddToCartIconButton } from "@/components/cart/AddToCartButton";

export interface ProductCardData {
  id: string;
  slug: string;
  sku: string;
  nameKaz: string;
  nameRus: string;
  price: number;
  retailPrice?: number | null;
  minOrder: number;
  bundleSize: number;
  isNew: boolean;
  isHit: boolean;
  images: { url: string; thumbUrl: string | null }[];
}

export function ProductCard({ product }: { product: ProductCardData }) {
  const { lang, t } = useLang();
  const name = lang === "kk" ? product.nameKaz : product.nameRus;
  const image = product.images[0];

  return (
    <div className="card group flex flex-col overflow-hidden">
      <Link href={`/catalog/${product.slug}`} className="relative block aspect-square bg-cream overflow-hidden">
        {image ? (
          <Image
            src={image.thumbUrl || image.url}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink-muted text-sm">Сурет жоқ</div>
        )}
        {product.isNew && <span className="ribbon bg-ink">{t("product", "new")}</span>}
        {product.isHit && (
          <span className={clsx("ribbon bg-gold", product.isNew && "top-10")}>{t("product", "hit")}</span>
        )}
      </Link>

      <div className="flex flex-col gap-1.5 p-4 flex-1">
        <div className="text-xs price-mono text-ink-muted">{product.sku}</div>
        <Link href={`/catalog/${product.slug}`} className="font-medium text-ink-text leading-snug line-clamp-2 hover:text-gold">
          {name}
        </Link>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="price-mono text-lg text-gold font-bold">
            {product.price.toLocaleString("ru-RU")} {t("catalog", "perDana")}
          </span>
          {!!product.retailPrice && (
            <span className="price-mono text-xs text-ink-muted line-through">
              {product.retailPrice.toLocaleString("ru-RU")} {t("common", "tenge")}
            </span>
          )}
        </div>
        <div className="text-xs text-ink-muted">
          {t("catalog", "bundle")}: {product.bundleSize} {t("catalog", "dana")}
        </div>

        <div className="flex gap-2 mt-3">
          <Link
            href={`/catalog/${product.slug}`}
            className="flex-1 btn-secondary h-10 text-xs px-2"
          >
            {t("catalog", "viewProduct")}
          </Link>
          <AddToCartIconButton
            product={{
              productId: product.id,
              slug: product.slug,
              sku: product.sku,
              nameKaz: product.nameKaz,
              nameRus: product.nameRus,
              price: product.price,
              minOrder: product.minOrder,
              bundleSize: product.bundleSize,
              image: image?.thumbUrl || image?.url || null,
            }}
          />
        </div>
      </div>
    </div>
  );
}
