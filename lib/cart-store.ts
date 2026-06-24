"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  slug: string;
  sku: string;
  nameKaz: string;
  nameRus: string;
  price: number;
  minOrder: number;
  bundleSize: number;
  image: string | null;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item, quantity) => {
        const qty = Math.max(1, quantity ?? item.minOrder);
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId ? { ...i, quantity: i.quantity + qty } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: qty }] };
        });
      },
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity: Math.max(i.minOrder, quantity) } : i
          ),
        })),
      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),
      clear: () => set({ items: [] }),
    }),
    { name: "samga-cart" }
  )
);

/**
 * localStorage-тен қалпына келтіру серверде жоқ, сол себепті бірінші client
 * рендерде store әлі бос ("hydrated" емес). Бұл hook server мен client
 * рендерінің сәйкес келмеуін (hydration mismatch) болдырмау үшін қажет —
 * нақты cart деректерін тек mount болғаннан кейін қайтарады.
 */
export function useHydratedCart() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const items = useCartStore((s) => s.items);
  return hydrated ? items : [];
}

export function cartTotal(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

export function cartCount(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}
