"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "./types";

type CartState = {
  items: CartItem[];
  add: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (item, qty = 1) =>
        set((s) => {
          const existing = s.items.find((i) => i.productId === item.productId);
          if (existing) {
            const nextQty = Math.min(existing.quantity + qty, item.stock || 99);
            return {
              items: s.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: nextQty, stock: item.stock, price: item.price }
                  : i
              ),
            };
          }
          return {
            items: [
              ...s.items,
              { ...item, quantity: Math.min(qty, item.stock || 99) },
            ],
          };
        }),
      remove: (productId) =>
        set((s) => ({ items: s.items.filter((i) => i.productId !== productId) })),
      setQty: (productId, qty) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.productId === productId
              ? { ...i, quantity: Math.max(1, Math.min(qty, i.stock || 99)) }
              : i
          ),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: "jms-cart" }
  )
);

export function cartCount(items: CartItem[]): number {
  return items.reduce((n, i) => n + i.quantity, 0);
}

export function cartTotal(items: CartItem[]): number {
  return items.reduce((n, i) => n + i.quantity * i.price, 0);
}
