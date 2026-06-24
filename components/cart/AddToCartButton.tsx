"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { useCartStore, type CartItem } from "@/lib/cart-store";
import { CartIcon, CheckIcon } from "@/components/ui/icons";
import { useLang } from "@/components/layout/LangProvider";
import { QuantityStepper } from "./QuantityStepper";

export type AddToCartProduct = Omit<CartItem, "quantity">;

export function AddToCartIconButton({ product }: { product: AddToCartProduct }) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      onClick={handleClick}
      aria-label="Себетке қосу"
      className={clsx(
        "flex items-center justify-center h-10 w-10 rounded-card shrink-0 transition-colors cursor-pointer",
        added ? "bg-green-600 text-white" : "bg-gold text-white hover:bg-gold-light"
      )}
    >
      {added ? <CheckIcon className="w-5 h-5" /> : <CartIcon className="w-5 h-5" />}
    </button>
  );
}

export function AddToCartPanel({ product }: { product: AddToCartProduct }) {
  const { t } = useLang();
  const addItem = useCartStore((s) => s.addItem);
  const [qty, setQty] = useState(product.minOrder);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="label-tag">{t("cart", "quantity")}</span>
        <QuantityStepper value={qty} min={product.minOrder} onChange={setQty} />
      </div>
      <button onClick={handleAdd} className={clsx("btn-primary gap-2", added && "!bg-green-600")}>
        {added ? <CheckIcon className="w-5 h-5" /> : <CartIcon className="w-5 h-5" />}
        {added ? t("cart", "added") : t("cart", "addToCart")}
      </button>
    </div>
  );
}
