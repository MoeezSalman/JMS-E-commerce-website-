"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart, Zap } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart-store";
import { useAuth } from "@/components/auth-context";
import type { PublicProduct } from "@/lib/types";

export function ProductBuyPanel({ product }: { product: PublicProduct }) {
  const router = useRouter();
  const add = useCart((s) => s.add);
  const { requireAuth } = useAuth();
  const [qty, setQty] = useState(1);
  const soldOut = product.stock <= 0;
  const image = product.images[0] ?? null;

  const base = {
    productId: product.id,
    name: product.name,
    price: product.price,
    image,
    stock: product.stock,
  };

  function addToCart() {
    if (soldOut) return;
    if (!requireAuth()) return;
    add(base, qty);
    toast.success(`${qty} × ${product.name} added to cart`);
  }

  function buyNow() {
    if (soldOut) return;
    if (!requireAuth()) return;
    add(base, qty);
    router.push("/checkout");
  }

  return (
    <div className="space-y-4">
      {!soldOut && (
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-muted-foreground">Quantity</span>
          <div className="flex items-center gap-1 rounded-full border border-border bg-card/60 p-1">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="grid h-8 w-8 place-items-center rounded-full hover:bg-muted"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-8 text-center font-semibold">{qty}</span>
            <button
              onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
              className="grid h-8 w-8 place-items-center rounded-full hover:bg-muted"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <span className="text-xs text-muted-foreground">
            {product.stock} available
          </span>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={addToCart}
          disabled={soldOut}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary/10 py-3.5 font-semibold text-primary transition-colors hover:bg-primary/15 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShoppingCart className="h-5 w-5" />
          Add to cart
        </button>
        <button
          onClick={buyNow}
          disabled={soldOut}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent py-3.5 font-semibold text-white shadow-lg shadow-primary/25 transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Zap className="h-5 w-5" />
          {soldOut ? "Out of stock" : "Buy now"}
        </button>
      </div>
    </div>
  );
}
