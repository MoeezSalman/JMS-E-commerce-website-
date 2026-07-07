import Link from "next/link";
import { Pencil, PackagePlus } from "lucide-react";
import { getProducts } from "@/lib/data";
import { DeleteProductButton } from "@/components/delete-product-button";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getProducts({ sort: "new" });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black tracking-tight">Products</h2>
          <p className="text-sm text-muted-foreground">
            {products.length} product{products.length === 1 ? "" : "s"} in the catalog
          </p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="grid place-items-center rounded-2xl border border-dashed border-border py-20 text-center">
          <PackagePlus className="h-10 w-10 text-muted-foreground" />
          <p className="mt-3 font-semibold">No products yet</p>
          <Link
            href="/admin/products/new"
            className="mt-4 rounded-full bg-gradient-to-r from-primary to-accent px-5 py-2.5 text-sm font-semibold text-white"
          >
            Add your first product
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border">
          {products.map((p, i) => (
            <div
              key={p.id}
              className={`flex items-center gap-4 bg-card/40 p-3 sm:p-4 ${
                i > 0 ? "border-t border-border" : ""
              }`}
            >
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                {p.images[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full w-full place-items-center text-primary/50">
                    {p.name[0]}
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{p.name}</p>
                <p className="text-xs text-muted-foreground">
                  {p.category?.name ?? "Uncategorised"}
                </p>
              </div>

              <div className="hidden text-right sm:block">
                <p className="font-bold text-primary">{formatPrice(p.price)}</p>
                <p
                  className={`text-xs ${
                    p.stock <= 0
                      ? "text-danger"
                      : p.stock <= 5
                        ? "text-amber-500"
                        : "text-muted-foreground"
                  }`}
                >
                  {p.stock} in stock
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/products/${p.id}/edit`}
                  aria-label="Edit"
                  className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                >
                  <Pencil className="h-4 w-4" />
                </Link>
                <DeleteProductButton id={p.id} name={p.name} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
