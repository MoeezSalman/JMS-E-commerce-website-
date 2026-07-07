import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { saveUpload } from "@/lib/upload";
import { slugify } from "@/lib/utils";

async function resolveCategoryId(
  categoryId: string | null,
  newCategory: string | null
): Promise<string | null> {
  if (newCategory && newCategory.trim()) {
    const name = newCategory.trim();
    const slug = slugify(name);
    const c = await prisma.category.upsert({
      where: { slug },
      update: {},
      create: { name, slug },
    });
    return c.id;
  }
  if (categoryId) {
    const c = await prisma.category.findUnique({ where: { id: categoryId } });
    return c?.id ?? null;
  }
  return null;
}

function parseArray(json: string): string[] {
  try {
    const arr = JSON.parse(json);
    return Array.isArray(arr) ? arr.filter((s) => typeof s === "string") : [];
  } catch {
    return [];
  }
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (session?.role !== "admin") {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const { id } = await ctx.params;
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const form = await req.formData();
  const name = String(form.get("name") ?? existing.name).trim();
  const description = String(form.get("description") ?? existing.description).trim();
  const price = parseInt(String(form.get("price") ?? existing.price), 10);
  const stock = parseInt(String(form.get("stock") ?? existing.stock), 10);
  const categoryId = form.get("categoryId") ? String(form.get("categoryId")) : null;
  const newCategory = form.get("newCategory") ? String(form.get("newCategory")) : null;

  if (!name) {
    return NextResponse.json({ error: "Product name is required" }, { status: 400 });
  }
  if (!Number.isFinite(price) || price < 0) {
    return NextResponse.json({ error: "Enter a valid price" }, { status: 400 });
  }

  const catId =
    (await resolveCategoryId(categoryId, newCategory)) ?? existing.categoryId;

  // Images: keep the ones the admin retained, then append new uploads.
  const kept = parseArray(String(form.get("existingImages") ?? "[]"));
  const newFiles = form
    .getAll("images")
    .filter((f): f is File => f instanceof File && f.size > 0);
  for (const f of newFiles) {
    if (f.type.startsWith("image/")) {
      kept.push(await saveUpload(f, "products"));
    }
  }

  // Video: remove, replace, or keep.
  let video: string | null = existing.video;
  if (String(form.get("removeVideo")) === "1") {
    video = null;
  }
  const videoFile = form.get("video");
  if (
    videoFile instanceof File &&
    videoFile.size > 0 &&
    videoFile.type.startsWith("video/")
  ) {
    video = await saveUpload(videoFile, "products");
  }

  await prisma.product.update({
    where: { id },
    data: {
      name,
      description,
      price: Math.max(0, price),
      stock: Math.max(0, Number.isFinite(stock) ? stock : 0),
      images: JSON.stringify(kept),
      video,
      categoryId: catId,
    },
  });

  return NextResponse.json({ ok: true, id });
}

export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (session?.role !== "admin") {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }
  const { id } = await ctx.params;
  await prisma.product.delete({ where: { id } }).catch(() => {});
  return NextResponse.json({ ok: true });
}
