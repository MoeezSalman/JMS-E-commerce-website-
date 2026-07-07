import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, ShieldAlert, MessageCircle } from "lucide-react";
import { getProduct, getProducts } from "@/lib/data";
import { ProductGallery } from "@/components/product-gallery";
import { ProductBuyPanel } from "@/components/product-buy-panel";
import { ProductCard } from "@/components/product-card";
import { formatPrice } from "@/lib/format";
import { WHATSAPP_NUMBER } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);
  return { title: product?.name ?? "Product" };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const related = product.category
    ? (await getProducts({ category: product.category.slug }))
        .filter((p) => p.id !== product.id)
        .slice(0, 4)
    : [];

  const soldOut = product.stock <= 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/products" className="hover:text-primary">Shop</Link>
        {product.category && (
          <>
            <ChevronRight className="h-4 w-4" />
            <Link
              href={`/products?category=${product.category.slug}`}
              className="hover:text-primary"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="h-4 w-4" />
        <span className="truncate font-medium text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery
          images={product.images}
          video={product.video}
          name={product.name}
        />

        <div>
          {product.category && (
            <Link
              href={`/products?category=${product.category.slug}`}
              className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
            >
              {product.category.name}
            </Link>
          )}
          <h1 className="mt-3 break-words text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
            {product.name}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="text-2xl font-black text-primary sm:text-3xl">
              {formatPrice(product.price)}
            </span>
            {soldOut ? (
              <span className="rounded-full bg-danger/15 px-3 py-1 text-xs font-semibold text-danger">
                Out of stock
              </span>
            ) : lowStock ? (
              <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-500">
                Only {product.stock} left
              </span>
            ) : (
              <span className="rounded-full bg-success/15 px-3 py-1 text-xs font-semibold text-success">
                In stock
              </span>
            )}
          </div>

          <p className="mt-6 whitespace-pre-line break-words leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <div className="mt-8 border-t border-border pt-6">
            <ProductBuyPanel product={product} />
          </div>

          {/* No-return note */}
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-danger/25 bg-danger/5 p-4">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-danger" />
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">No returns or refunds.</span>{" "}
              All sales are final — please review your order before buying. See our{" "}
              <Link href="/policy" className="font-medium text-primary hover:underline">
                policy
              </Link>
              .
            </p>
          </div>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
              `Hi JMS, I have a question about "${product.name}".`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-success hover:underline"
          >
            <MessageCircle className="h-4 w-4" /> Ask about this product on WhatsApp
          </a>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-6 text-2xl font-black tracking-tight">You may also like</h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
