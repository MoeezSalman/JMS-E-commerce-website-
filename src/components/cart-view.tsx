"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ShieldAlert } from "lucide-react";
import { useCart, cartCount, cartTotal } from "@/lib/cart-store";
import { useMounted } from "@/lib/use-mounted";
import { formatPrice } from "@/lib/format";

export function CartView() {
  const { items, remove, setQty } = useCart();
  const mounted = useMounted();

  if (!mounted) {
    return <div className="h-64 animate-pulse rounded-2xl bg-muted" />;
  }

  if (items.length === 0) {
    return (
      <div className="grid place-items-center rounded-3xl border border-dashed border-border py-24 text-center">
        <ShoppingBag className="h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-bold">Your cart is empty</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Looks like you haven&apos;t added anything yet.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 font-semibold text-white shadow-lg shadow-primary/25 transition-transform hover:scale-105"
        >
          Start shopping <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const total = cartTotal(items);
  const count = cartCount(items);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <motion.div
              key={item.productId}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="flex gap-4 rounded-2xl border border-border bg-card/60 p-3 sm:p-4"
            >
              <Link
                href={`/products/${item.productId}`}
                className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted"
              >
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-gradient-to-br from-primary/20 to-accent/20 text-2xl font-black text-primary/50">
                    {item.name[0]}
                  </div>
                )}
              </Link>

              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/products/${item.productId}`}
                    className="line-clamp-2 font-semibold hover:text-primary"
                  >
                    {item.name}
                  </Link>
                  <button
                    onClick={() => remove(item.productId)}
                    aria-label="Remove"
                    className="text-muted-foreground transition-colors hover:text-danger"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 rounded-full border border-border p-1">
                    <button
                      onClick={() => setQty(item.productId, item.quantity - 1)}
                      className="grid h-7 w-7 place-items-center rounded-full hover:bg-muted"
                      aria-label="Decrease"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-7 text-center text-sm font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => setQty(item.productId, item.quantity + 1)}
                      className="grid h-7 w-7 place-items-center rounded-full hover:bg-muted"
                      aria-label="Increase"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <span className="font-black text-primary">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Summary */}
      <div className="h-fit space-y-4 rounded-2xl border border-border bg-card/60 p-6 lg:sticky lg:top-24">
        <h2 className="text-lg font-bold">Order summary</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Items</span>
            <span className="font-medium">{count}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">{formatPrice(total)}</span>
          </div>
          <div className="my-2 h-px bg-border" />
          <div className="flex justify-between text-base">
            <span className="font-bold">Total</span>
            <span className="font-black text-primary">{formatPrice(total)}</span>
          </div>
        </div>

        <Link
          href="/checkout"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent py-3.5 font-semibold text-white shadow-lg shadow-primary/25 transition-transform hover:scale-[1.02]"
        >
          Proceed to checkout <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/products"
          className="block text-center text-sm font-medium text-muted-foreground hover:text-primary"
        >
          Continue shopping
        </Link>

        <div className="flex items-start gap-2 rounded-xl bg-danger/5 p-3 text-xs text-muted-foreground">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
          All sales are final. No returns or refunds — please review before checkout.
        </div>
      </div>
    </div>
  );
}
