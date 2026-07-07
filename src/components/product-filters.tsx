"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PublicCategory } from "@/lib/types";

const SORTS = [
  { value: "new", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name", label: "Name: A–Z" },
];

export function ProductFilters({
  categories,
  q,
  category,
  sort,
  total,
}: {
  categories: PublicCategory[];
  q: string;
  category: string;
  sort: string;
  total: number;
}) {
  const router = useRouter();
  const [search, setSearch] = useState(q);
  const firstRender = useRef(true);

  // Keep the input in sync if the URL changes elsewhere (e.g. clearing).
  useEffect(() => {
    setSearch(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  // Debounced push of the search term.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const t = setTimeout(() => {
      if (search !== q) update({ q: search });
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  function update(patch: Partial<{ q: string; category: string; sort: string }>) {
    const next = { q, category, sort, ...patch };
    const params = new URLSearchParams();
    if (next.q) params.set("q", next.q);
    if (next.category) params.set("category", next.category);
    if (next.sort && next.sort !== "new") params.set("sort", next.sort);
    const qs = params.toString();
    router.replace(qs ? `/products?${qs}` : "/products", { scroll: false });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2.5 rounded-xl border border-input bg-card/60 px-3.5 py-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-input bg-card/60 px-3.5 py-2.5">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <select
            value={sort}
            onChange={(e) => update({ sort: e.target.value })}
            className="bg-transparent text-sm outline-none [&>option]:bg-card [&>option]:text-foreground"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => update({ category: "" })}
          className={cn(
            "rounded-full border px-4 py-1.5 text-sm font-medium transition-all",
            !category
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-card/60 text-muted-foreground hover:border-primary/50"
          )}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => update({ category: category === c.slug ? "" : c.slug })}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-all",
              category === c.slug
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card/60 text-muted-foreground hover:border-primary/50"
            )}
          >
            {c.name}
          </button>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        {total} {total === 1 ? "product" : "products"}
        {category && (
          <>
            {" "}in{" "}
            <span className="font-medium text-foreground">
              {categories.find((c) => c.slug === category)?.name ?? category}
            </span>
          </>
        )}
        {q && (
          <>
            {" "}for “<span className="font-medium text-foreground">{q}</span>”
          </>
        )}
      </p>
    </div>
  );
}
