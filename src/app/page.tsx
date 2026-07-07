import Link from "next/link";
import { ArrowRight, Zap, ShieldCheck, MessageCircle, Layers } from "lucide-react";
import { Hero } from "@/components/hero";
import { ProductCard } from "@/components/product-card";
import { getCategories, getFeaturedProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

const FEATURES = [
  { icon: MessageCircle, title: "WhatsApp checkout", text: "Your order details go straight to us on WhatsApp — no complicated payment forms." },
  { icon: Zap, title: "Lightning fast", text: "Browse, filter and add to cart with a snappy, animated interface." },
  { icon: ShieldCheck, title: "Secure account", text: "Manage your profile, avatar, theme and order history in one place." },
  { icon: Layers, title: "Curated categories", text: "Hand-picked products across electronics, fashion, home and more." },
];

export default async function HomePage() {
  const [categories, featured] = await Promise.all([
    getCategories(),
    getFeaturedProducts(8),
  ]);

  return (
    <div>
      <Hero />

      {/* Category strip */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-muted-foreground">
              Browse:
            </span>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/products?category=${c.slug}`}
                className="rounded-full border border-border bg-card/60 px-4 py-2 text-sm font-medium transition-all hover:scale-105 hover:border-primary/50 hover:text-primary"
              >
                {c.name}
                <span className="ml-1.5 text-xs text-muted-foreground">
                  {c.productCount ?? 0}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Fresh arrivals
            </h2>
            <p className="mt-2 text-muted-foreground">
              The latest additions to the{" "}
              <span className="font-semibold text-primary">JMS</span> collection.
            </p>
          </div>
          <Link
            href="/products"
            className="group hidden items-center gap-1.5 rounded-full border border-border bg-card/60 px-5 py-2.5 text-sm font-semibold transition-colors hover:border-primary/50 hover:text-primary sm:inline-flex"
          >
            View all
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {featured.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {featured.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            No products yet. Once the admin adds products, they’ll appear here.
          </div>
        )}
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-border bg-card/60 p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
            >
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 text-primary">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-bold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-card to-accent/10 p-10 text-center sm:p-16">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 animate-float rounded-full bg-primary/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 animate-float-slow rounded-full bg-accent/20 blur-3xl" />
          <h2 className="relative text-3xl font-black tracking-tight sm:text-4xl">
            Ready to find something you love?
          </h2>
          <p className="relative mx-auto mt-3 max-w-lg text-muted-foreground">
            Create an account to save your details and check out in seconds.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 font-semibold text-white shadow-xl shadow-primary/30 transition-transform hover:scale-105"
            >
              Shop now <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-6 py-3 font-semibold transition-colors hover:border-primary/50"
            >
              Create account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
