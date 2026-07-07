"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ImagePlus, Film, X, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { PublicCategory } from "@/lib/types";

type InitialProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  video: string | null;
  categoryId: string | null;
};

type NewImage = { file: File; url: string };

export function ProductForm({
  categories,
  initial,
}: {
  categories: PublicCategory[];
  initial?: InitialProduct | null;
}) {
  const router = useRouter();
  const editing = Boolean(initial);

  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(initial ? String(initial.price) : "");
  const [stock, setStock] = useState(initial ? String(initial.stock) : "0");
  const [categoryId, setCategoryId] = useState(
    initial?.categoryId ?? (categories[0]?.id ?? "__new__")
  );
  const [newCategory, setNewCategory] = useState("");

  const [existingImages, setExistingImages] = useState<string[]>(
    initial?.images ?? []
  );
  const [newImages, setNewImages] = useState<NewImage[]>([]);

  const [existingVideo, setExistingVideo] = useState<string | null>(
    initial?.video ?? null
  );
  const [removeVideo, setRemoveVideo] = useState(false);
  const [newVideo, setNewVideo] = useState<{ file: File; url: string } | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addImages(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const mapped = files.map((file) => ({ file, url: URL.createObjectURL(file) }));
    setNewImages((prev) => [...prev, ...mapped]);
    e.target.value = "";
  }

  function removeNewImage(url: string) {
    URL.revokeObjectURL(url);
    setNewImages((prev) => prev.filter((i) => i.url !== url));
  }

  function pickVideo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (newVideo) URL.revokeObjectURL(newVideo.url);
    setNewVideo({ file, url: URL.createObjectURL(file) });
    setRemoveVideo(false);
    e.target.value = "";
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("Product name is required");
      return;
    }
    if (categoryId === "__new__" && !newCategory.trim()) {
      setError("Enter a name for the new category");
      return;
    }
    setLoading(true);

    const form = new FormData();
    form.set("name", name);
    form.set("description", description);
    form.set("price", price || "0");
    form.set("stock", stock || "0");
    if (categoryId === "__new__") {
      form.set("newCategory", newCategory);
    } else {
      form.set("categoryId", categoryId);
    }
    if (editing) {
      form.set("existingImages", JSON.stringify(existingImages));
      if (removeVideo) form.set("removeVideo", "1");
    }
    newImages.forEach((i) => form.append("images", i.file));
    if (newVideo) form.set("video", newVideo.file);

    try {
      const res = await fetch(
        editing ? `/api/admin/products/${initial!.id}` : "/api/admin/products",
        { method: editing ? "PATCH" : "POST", body: form }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not save product");
        setLoading(false);
        return;
      }
      toast.success(editing ? "Product updated" : "Product created");
      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  const showVideo = newVideo ?? (!removeVideo && existingVideo ? { url: existingVideo } : null);

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_360px]">
      {/* Details */}
      <div className="space-y-4 rounded-2xl border border-border bg-card/60 p-6">
        <h2 className="font-bold">Product details</h2>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Name
          </span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Aurora Wireless Headphones"
            className="w-full rounded-xl border border-input bg-background/60 px-3.5 py-3 text-sm outline-none focus:border-primary"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Description
          </span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="Describe the product…"
            className="w-full resize-none rounded-xl border border-input bg-background/60 px-3.5 py-3 text-sm outline-none focus:border-primary"
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Price (Rs)
            </span>
            <input
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0"
              className="w-full rounded-xl border border-input bg-background/60 px-3.5 py-3 text-sm outline-none focus:border-primary"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Stock
            </span>
            <input
              type="number"
              min={0}
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="0"
              className="w-full rounded-xl border border-input bg-background/60 px-3.5 py-3 text-sm outline-none focus:border-primary"
            />
          </label>
        </div>

        <div>
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Category
          </span>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded-xl border border-input bg-background/60 px-3.5 py-3 text-sm outline-none focus:border-primary [&>option]:bg-card"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
            <option value="__new__">➕ New category…</option>
          </select>
          {categoryId === "__new__" && (
            <input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New category name"
              className="mt-2 w-full rounded-xl border border-input bg-background/60 px-3.5 py-3 text-sm outline-none focus:border-primary"
            />
          )}
        </div>
      </div>

      {/* Media */}
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-card/60 p-6">
          <h2 className="font-bold">Images</h2>
          <p className="mb-3 text-xs text-muted-foreground">
            The first image is used as the cover.
          </p>
          <div className="grid grid-cols-3 gap-2">
            {existingImages.map((src) => (
              <div key={src} className="group relative aspect-square overflow-hidden rounded-xl border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setExistingImages((p) => p.filter((s) => s !== src))}
                  className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="Remove image"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            {newImages.map((img) => (
              <div key={img.url} className="group relative aspect-square overflow-hidden rounded-xl border border-primary/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeNewImage(img.url)}
                  className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/60 text-white"
                  aria-label="Remove image"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            <label className="grid aspect-square cursor-pointer place-items-center rounded-xl border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary">
              <div className="text-center">
                <ImagePlus className="mx-auto h-6 w-6" />
                <span className="mt-1 block text-[11px] font-medium">Add</span>
              </div>
              <input type="file" accept="image/*" multiple onChange={addImages} className="hidden" />
            </label>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-6">
          <h2 className="font-bold">Video</h2>
          <p className="mb-3 text-xs text-muted-foreground">Optional product video.</p>
          {showVideo ? (
            <div className="relative overflow-hidden rounded-xl border border-border">
              <video src={showVideo.url} controls className="h-40 w-full object-cover" />
              <button
                type="button"
                onClick={() => {
                  if (newVideo) {
                    URL.revokeObjectURL(newVideo.url);
                    setNewVideo(null);
                  }
                  if (existingVideo) setRemoveVideo(true);
                  setExistingVideo(existingVideo);
                }}
                className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs text-white"
              >
                <Trash2 className="h-3.5 w-3.5" /> Remove
              </button>
            </div>
          ) : (
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-8 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary">
              <Film className="h-5 w-5" /> Upload video
              <input type="file" accept="video/*" onChange={pickVideo} className="hidden" />
            </label>
          )}
        </div>

        {error && (
          <p className="rounded-xl bg-danger/10 px-4 py-2.5 text-sm font-medium text-danger">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent py-3.5 font-semibold text-white shadow-lg shadow-primary/25 transition-transform hover:scale-[1.02] disabled:opacity-60"
          )}
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {editing ? "Save changes" : "Create product"}
        </button>
      </div>
    </form>
  );
}
