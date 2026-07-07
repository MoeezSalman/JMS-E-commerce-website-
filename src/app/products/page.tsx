import { PackageSearch } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { ProductFilters } from "@/components/product-filters";
import { getCategories, getProducts } from "@/lib/data";
import type { ProductSort } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Shop" };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; sort?: string }>;
}) {
  const sp = await searchParams;
  const q = sp.q ?? "";
  const category = sp.category ?? "";
  const sort = (sp.sort as ProductSort) ?? "new";

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ q, category, sort }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
          Shop <span className="gradient-text">everything</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Search, filter by category, and add your favourites to the cart.
        </p>
      </header>

      <ProductFilters
        categories={categories}
        q={q}
        category={category}
        sort={sort}
        total={products.length}
      />

      <div className="mt-8">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        ) : (
          <div className="grid place-items-center rounded-2xl border border-dashed border-border py-20 text-center">
            <PackageSearch className="h-10 w-10 text-muted-foreground" />
            <p className="mt-4 font-semibold">No products found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a different search or category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
