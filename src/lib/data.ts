import "server-only";
import { prisma } from "./db";
import type { PublicProduct, PublicCategory, ProductSort } from "./types";

type ProductRow = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string;
  video: string | null;
  createdAt: Date;
  category: { id: string; name: string; slug: string } | null;
};

function parseImages(json: string): string[] {
  try {
    const arr = JSON.parse(json);
    return Array.isArray(arr) ? arr.filter((s) => typeof s === "string") : [];
  } catch {
    return [];
  }
}

function mapProduct(p: ProductRow): PublicProduct {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    stock: p.stock,
    images: parseImages(p.images),
    video: p.video,
    category: p.category
      ? { id: p.category.id, name: p.category.name, slug: p.category.slug }
      : null,
    createdAt: p.createdAt.toISOString(),
  };
}

export async function getCategories(): Promise<PublicCategory[]> {
  const rows = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });
  return rows.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    productCount: c._count.products,
  }));
}

export async function getProducts(opts: {
  q?: string;
  category?: string;
  sort?: ProductSort;
}): Promise<PublicProduct[]> {
  const where: Record<string, unknown> = {};
  if (opts.category) where.category = { slug: opts.category };
  if (opts.q && opts.q.trim()) {
    const q = opts.q.trim();
    where.OR = [
      { name: { contains: q } },
      { description: { contains: q } },
    ];
  }

  const orderBy =
    opts.sort === "price-asc"
      ? { price: "asc" as const }
      : opts.sort === "price-desc"
        ? { price: "desc" as const }
        : opts.sort === "name"
          ? { name: "asc" as const }
          : { createdAt: "desc" as const };

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: { category: true },
  });
  return products.map(mapProduct);
}

export async function getProduct(id: string): Promise<PublicProduct | null> {
  const p = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });
  return p ? mapProduct(p) : null;
}

export async function getFeaturedProducts(limit = 8): Promise<PublicProduct[]> {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { category: true },
  });
  return products.map(mapProduct);
}

export async function getProductCount(): Promise<number> {
  return prisma.product.count();
}
