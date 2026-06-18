"use client";

import { useLang } from "@/components/layout/LangProvider";
import { WhatsAppIcon } from "@/components/ui/icons";
import { buildProductWhatsAppLink, getTelegramLink, getPhoneNumber } from "@/lib/whatsapp";

export function ProductActions({
  product,
}: {
  product: { id: string; nameKaz: string; sku: string; price: number; minOrder: number };
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

  return (
    <div className="flex flex-col gap-3">
      <a
        href={buildProductWhatsAppLink(product)}
        target="_blank"
        rel="noopener"
        onClick={logIntent}
        className="btn-primary gap-2"
      >
        <WhatsAppIcon className="w-5 h-5" />
        {t("product", "orderWhatsapp")}
      </a>
      <a href={getTelegramLink()} target="_blank" rel="noopener" className="btn-secondary">
        {t("product", "askTelegram")}
      </a>
      <a href={`tel:${getPhoneNumber()}`} className="btn-ghost !text-ink-text border border-line">
        {t("product", "callManager")}
      </a>
    </div>
  );
}
