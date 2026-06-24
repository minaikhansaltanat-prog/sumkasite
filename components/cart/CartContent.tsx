"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/components/layout/LangProvider";
import { useCartStore, useHydratedCart, cartTotal } from "@/lib/cart-store";
import { buildCartWhatsAppLink } from "@/lib/whatsapp";
import { CartIcon, TrashIcon, WhatsAppIcon } from "@/components/ui/icons";
import { QuantityStepper } from "./QuantityStepper";

function makeCartRef() {
  return Date.now().toString(36).toUpperCase().slice(-6);
}

export function CartContent() {
  const { lang, t } = useLang();
  const items = useHydratedCart();
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clear = useCartStore((s) => s.clear);
  const [justCheckedOut, setJustCheckedOut] = useState(false);

  const total = cartTotal(items);

  function checkout() {
    if (items.length === 0) return;
    const cartRef = makeCartRef();

    items.forEach((item, i) => {
      fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: "WhatsApp арқылы (себет, растамаған)",
          phone: "—",
          productId: item.productId,
          productName: item.nameKaz,
          sku: item.sku,
          quantity: item.quantity,
          message: `Себет №${cartRef} (${i + 1}/${items.length}) · Жалпы сома: ${total.toLocaleString("ru-RU")} тг`,
        }),
      }).catch(() => {});
    });

    window.open(buildCartWhatsAppLink(items, cartRef), "_blank", "noopener");
    clear();
    setJustCheckedOut(true);
  }

  if (justCheckedOut) {
    return (
      <div className="container-page py-20 text-center max-w-md mx-auto">
        <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-5">
          <WhatsAppIcon className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="font-display text-2xl font-bold text-ink-text">WhatsApp ашылды</h1>
        <p className="text-ink-muted mt-2">
          Тапсырысыңыз дайын — WhatsApp-та хабарды жіберуді растаңыз, менеджер жақын арада хабарласады.
        </p>
        <Link href="/catalog" className="btn-primary mt-6 inline-flex">
          {t("cart", "continueShopping")}
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-page py-20 text-center max-w-md mx-auto">
        <div className="w-16 h-16 mx-auto rounded-full bg-cream flex items-center justify-center mb-5">
          <CartIcon className="w-8 h-8 text-ink-muted" />
        </div>
        <h1 className="font-display text-2xl font-bold text-ink-text">{t("cart", "empty")}</h1>
        <p className="text-ink-muted mt-2">{t("cart", "emptyDesc")}</p>
        <Link href="/catalog" className="btn-primary mt-6 inline-flex">
          {t("cart", "goToCatalog")}
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display text-3xl font-bold text-ink-text">
          {t("cart", "title")} <span className="text-ink-muted text-lg font-normal">({items.length} {t("cart", "itemsCount")})</span>
        </h1>
        <button onClick={clear} className="text-sm text-danger hover:underline cursor-pointer">
          {t("cart", "clear")}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 flex flex-col gap-4">
          {items.map((item) => {
            const name = lang === "kk" ? item.nameKaz : item.nameRus;
            const lineTotal = item.price * item.quantity;
            return (
              <div key={item.productId} className="card flex gap-4 p-4">
                <Link href={`/catalog/${item.slug}`} className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-card overflow-hidden bg-cream">
                  {item.image && <Image src={item.image} alt={name} fill className="object-cover" />}
                </Link>

                <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                  <Link href={`/catalog/${item.slug}`} className="font-medium text-ink-text hover:text-gold line-clamp-2">
                    {name}
                  </Link>
                  <div className="text-xs price-mono text-ink-muted">{item.sku}</div>
                  <div className="price-mono text-sm text-gold font-bold">
                    {item.price.toLocaleString("ru-RU")} {t("catalog", "perDana")}
                  </div>

                  <div className="flex items-center justify-between gap-3 mt-1 flex-wrap">
                    <QuantityStepper
                      size="sm"
                      value={item.quantity}
                      min={item.minOrder}
                      onChange={(q) => updateQuantity(item.productId, q)}
                    />
                    <button
                      onClick={() => removeItem(item.productId)}
                      aria-label={t("cart", "remove")}
                      className="flex items-center gap-1 text-xs text-danger hover:underline cursor-pointer"
                    >
                      <TrashIcon className="w-3.5 h-3.5" />
                      {t("cart", "remove")}
                    </button>
                  </div>
                </div>

                <div className="text-right shrink-0 hidden sm:block">
                  <div className="label-tag">{t("cart", "itemTotal")}</div>
                  <div className="price-mono font-bold text-ink-text mt-1">{lineTotal.toLocaleString("ru-RU")} тг</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="widget self-start sticky top-28">
          <div className="widget-title">{t("cart", "grandTotal")}</div>
          <div className="flex items-baseline justify-between mb-5">
            <span className="text-ink-muted text-sm">{items.length} {t("cart", "itemsCount")}</span>
            <span className="price-mono text-2xl font-bold text-gold">{total.toLocaleString("ru-RU")} тг</span>
          </div>
          <button onClick={checkout} className="btn-primary w-full gap-2">
            <WhatsAppIcon className="w-5 h-5" />
            {t("cart", "checkout")}
          </button>
          <p className="text-xs text-ink-muted mt-3 text-center">{t("cart", "checkoutNote")}</p>
        </div>
      </div>
    </div>
  );
}
