"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Check } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart-store";
import { useAuth } from "@/components/auth-context";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { PublicProduct } from "@/lib/types";

function StockBadge({ stock }: { stock: number }) {
  if (stock <= 0)
    return (
      <span className="rounded-full bg-danger/15 px-2.5 py-1 text-[11px] font-semibold text-danger">
        Out of stock
      </span>
    );
  if (stock <= 5)
    return (
      <span className="rounded-full bg-amber-500/15 px-2.5 py-1 text-[11px] font-semibold text-amber-500">
        Only {stock} left
      </span>
    );
  return (
    <span className="rounded-full bg-success/15 px-2.5 py-1 text-[11px] font-semibold text-success">
      In stock
    </span>
  );
}

export function ProductCard({
  product,
  index = 0,
}: {
  product: PublicProduct;
  index?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [added, setAdded] = useState(false);
  const add = useCart((s) => s.add);
  const { requireAuth } = useAuth();
  const image = product.images[0] ?? null;
  const soldOut = product.stock <= 0;

  function handleMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -8, y: px * 10 });
  }

  function quickAdd(e: React.MouseEvent) {
    e.preventDefault();
    if (soldOut) return;
    if (!requireAuth()) return;
    add(
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        image,
        stock: product.stock,
      },
      1
    );
    setAdded(true);
    toast.success(`${product.name} added to cart`);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.4) }}
    >
      <Link href={`/products/${product.id}`} className="block [perspective:1000px]">
        <div
          ref={ref}
          onMouseMove={handleMove}
          onMouseLeave={() => setTilt({ x: 0, y: 0 })}
          className="card-3d group relative overflow-hidden rounded-2xl border border-border bg-card/70 shadow-sm hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10"
          style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
        >
          {/* Media */}
          <div className="relative aspect-square overflow-hidden bg-muted">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt={product.name}
                className={cn(
                  "h-full w-full object-cover transition-transform duration-500 group-hover:scale-110",
                  soldOut && "opacity-60 grayscale"
                )}
              />
            ) : (
              <div className="grid h-full w-full place-items-center bg-gradient-to-br from-primary/20 to-accent/20 text-4xl font-black text-primary/50">
                {product.name[0]}
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

            {product.category && (
              <span className="absolute left-3 top-3 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
                {product.category.name}
              </span>
            )}

            {/* Quick add */}
            <button
              onClick={quickAdd}
              disabled={soldOut}
              aria-label="Add to cart"
              className={cn(
                "absolute bottom-3 right-3 grid h-11 w-11 translate-y-2 place-items-center rounded-full text-white opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100",
                soldOut
                  ? "cursor-not-allowed bg-muted-foreground/60"
                  : "bg-gradient-to-br from-primary to-accent hover:scale-110"
              )}
            >
              {added ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            </button>
          </div>

          {/* Body */}
          <div className="space-y-2 p-4">
            <div className="flex items-start justify-between gap-2">
              <h3 className="line-clamp-1 font-semibold text-card-foreground">
                {product.name}
              </h3>
            </div>
            <p className="line-clamp-2 text-xs text-muted-foreground">
              {product.description}
            </p>
            <div className="flex items-center justify-between pt-1">
              <span className="text-lg font-black text-primary">
                {formatPrice(product.price)}
              </span>
              <StockBadge stock={product.stock} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
