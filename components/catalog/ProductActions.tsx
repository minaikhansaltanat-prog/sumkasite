"use client";

import { useLang } from "@/components/layout/LangProvider";
import { WhatsAppIcon } from "@/components/ui/icons";
import { buildProductWhatsAppLink, getTelegramLink, getPhoneNumber } from "@/lib/whatsapp";
import { AddToCartPanel, type AddToCartProduct } from "@/components/cart/AddToCartButton";

export function ProductActions({
  product,
}: {
  product: {
    id: string;
    slug: string;
    nameKaz: string;
    nameRus: string;
    sku: string;
    price: number;
    minOrder: number;
    bundleSize: number;
    image: string | null;
  };
}) {
  const { t } = useLang();

  function logIntent() {
    fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientName: "WhatsApp арқылы (растамаған)",
        phone: "—",
        productId: product.id,
        productName: product.nameKaz,
        sku: product.sku,
        quantity: product.minOrder,
        message: "Сайттан WhatsApp батоны арқылы келген сұраным",
      }),
    }).catch(() => {});
  }

  const cartProduct: AddToCartProduct = {
    productId: product.id,
    slug: product.slug,
    sku: product.sku,
    nameKaz: product.nameKaz,
    nameRus: product.nameRus,
    price: product.price,
    minOrder: product.minOrder,
    bundleSize: product.bundleSize,
    image: product.image,
  };

  return (
    <div className="flex flex-col gap-4">
      <AddToCartPanel product={cartProduct} />

      <div className="flex items-center gap-2 text-xs text-ink-muted">
        <span className="flex-1 h-px bg-line" />
        немесе тікелей
        <span className="flex-1 h-px bg-line" />
      </div>

      <div className="flex flex-col gap-3">
        <a
          href={buildProductWhatsAppLink(product)}
          target="_blank"
          rel="noopener"
          onClick={logIntent}
          className="btn-secondary gap-2"
        >
          <WhatsAppIcon className="w-5 h-5" />
          {t("product", "orderWhatsapp")}
        </a>
        <a href={getTelegramLink()} target="_blank" rel="noopener" className="btn-ghost !text-ink-text border border-line">
          {t("product", "askTelegram")}
        </a>
        <a href={`tel:${getPhoneNumber()}`} className="btn-ghost !text-ink-text border border-line">
          {t("product", "callManager")}
        </a>
      </div>
    </div>
  );
}
