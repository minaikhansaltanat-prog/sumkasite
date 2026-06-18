"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/components/layout/LangProvider";
import { WhatsAppIcon } from "@/components/ui/icons";
import { buildProductWhatsAppLink } from "@/lib/whatsapp";

export interface ProductCardData {
  slug: string;
  sku: string;
  nameKaz: string;
  nameRus: string;
  price: number;
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
        <div className="absolute top-2 left-2 flex gap-1.5">
          {product.isNew && (
            <span className="label-tag bg-ink text-white px-2 py-1 rounded">{t("product", "new")}</span>
          )}
          {product.isHit && (
            <span className="label-tag bg-gold text-ink px-2 py-1 rounded">{t("product", "hit")}</span>
          )}
        </div>
      </Link>

      <div className="flex flex-col gap-1.5 p-4 flex-1">
        <div className="text-xs price-mono text-ink-muted">{product.sku}</div>
        <Link href={`/catalog/${product.slug}`} className="font-medium text-ink-text leading-snug line-clamp-2 hover:text-gold">
          {name}
        </Link>
        <div className="price-mono text-lg text-gold font-medium mt-1">
          {product.price.toLocaleString("ru-RU")} {t("catalog", "perDana")}
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
          <a
            href={buildProductWhatsAppLink(product)}
            target="_blank"
            rel="noopener"
            aria-label="WhatsApp"
            className="flex items-center justify-center h-10 w-10 rounded-card bg-[#25D366] text-white shrink-0"
          >
            <WhatsAppIcon className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
}
