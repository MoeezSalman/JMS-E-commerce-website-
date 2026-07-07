import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ProfileClient } from "@/components/profile-client";

export const dynamic = "force-dynamic";
export const metadata = { title: "My account" };

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirect=/profile");

  const sp = await searchParams;

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  const orderViews = orders.map((o) => ({
    id: o.id,
    status: o.status,
    total: o.total,
    createdAt: o.createdAt.toISOString(),
    customerName: o.customerName,
    phone: o.phone,
    address: o.address,
    city: o.city,
    items: o.items.map((i) => ({
      id: i.id,
      productName: i.productName,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
    })),
  }));

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
          My <span className="gradient-text">account</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Manage your profile, security, appearance and orders.
        </p>
      </header>

      <ProfileClient
        user={{
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          theme: user.theme,
          phone: user.phone,
          address: user.address,
          city: user.city,
        }}
        orders={orderViews}
        initialTab={sp.tab}
      />
    </div>
  );
}
