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

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (session?.role !== "admin") {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const form = await req.formData();
  const name = String(form.get("name") ?? "").trim();
  const description = String(form.get("description") ?? "").trim();
  const price = parseInt(String(form.get("price") ?? "0"), 10);
  const stock = parseInt(String(form.get("stock") ?? "0"), 10);
  const categoryId = form.get("categoryId") ? String(form.get("categoryId")) : null;
  const newCategory = form.get("newCategory") ? String(form.get("newCategory")) : null;

  if (!name) {
    return NextResponse.json({ error: "Product name is required" }, { status: 400 });
  }
  if (!Number.isFinite(price) || price < 0) {
    return NextResponse.json({ error: "Enter a valid price" }, { status: 400 });
  }

  const catId = await resolveCategoryId(categoryId, newCategory);
  if (!catId) {
    return NextResponse.json({ error: "Please choose a category" }, { status: 400 });
  }

  const imageFiles = form
    .getAll("images")
    .filter((f): f is File => f instanceof File && f.size > 0);
  const imagePaths: string[] = [];
  for (const f of imageFiles) {
    if (f.type.startsWith("image/")) {
      imagePaths.push(await saveUpload(f, "products"));
    }
  }

  let videoPath: string | null = null;
  const videoFile = form.get("video");
  if (
    videoFile instanceof File &&
    videoFile.size > 0 &&
    videoFile.type.startsWith("video/")
  ) {
    videoPath = await saveUpload(videoFile, "products");
  }

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price: Math.max(0, price),
      stock: Math.max(0, Number.isFinite(stock) ? stock : 0),
      images: JSON.stringify(imagePaths),
      video: videoPath,
      categoryId: catId,
    },
  });

  return NextResponse.json({ ok: true, id: product.id });
}
