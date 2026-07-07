import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ProductForm } from "@/components/product-form";
import { getCategories } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await getCategories();
  return (
    <div>
      <Link
        href="/admin/products"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ChevronLeft className="h-4 w-4" /> Back to products
      </Link>
      <h2 className="mb-6 text-xl font-black tracking-tight">Add a new product</h2>
      <ProductForm categories={categories} />
    </div>
  );
}
