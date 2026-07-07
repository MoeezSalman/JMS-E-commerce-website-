import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, MessageCircle, Package } from "lucide-react";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import { buildOrderMessage, waUrl, orderRef } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";
export const metadata = { title: "Order placed" };

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const session = await getSession();
  if (!session) redirect("/login");
  if (!id) redirect("/products");

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!order || (order.userId !== session.userId && session.role !== "admin")) {
    redirect("/products");
  }

  const message = buildOrderMessage({
    id: order.id,
    customerName: order.customerName,
    phone: order.phone,
    address: order.address,
    city: order.city,
    total: order.total,
    items: order.items.map((i) => ({
      productName: i.productName,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
    })),
  });
  const url = waUrl(message);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card/70 p-8 text-center sm:p-12">
        <div className="pointer-events-none absolute -top-10 left-1/2 h-40 w-40 -translate-x-1/2 animate-glow rounded-full bg-success/20 blur-3xl" />
        <span className="relative mx-auto grid h-16 w-16 place-items-center rounded-full bg-success/15 text-success">
          <CheckCircle2 className="h-9 w-9" />
        </span>
        <h1 className="relative mt-5 text-3xl font-black tracking-tight">
          Order placed!
        </h1>
        <p className="relative mt-2 text-muted-foreground">
          Order <span className="font-semibold text-foreground">#{orderRef(order.id)}</span> is
          ready. Send it to us on WhatsApp to confirm and finish.
        </p>

        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="relative mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-success to-emerald-500 px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-success/25 transition-transform hover:scale-105"
        >
          <MessageCircle className="h-5 w-5" /> Send order on WhatsApp
        </a>
        <p className="relative mt-3 text-xs text-muted-foreground">
          This opens WhatsApp with your order details pre-filled — just hit send.
        </p>
      </div>

      {/* Order summary */}
      <div className="mt-6 rounded-2xl border border-border bg-card/60 p-6">
        <h2 className="flex items-center gap-2 font-bold">
          <Package className="h-5 w-5 text-primary" /> Order summary
        </h2>
        <div className="mt-4 space-y-2">
          {order.items.map((i) => (
            <div key={i.id} className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {i.productName} × {i.quantity}
              </span>
              <span className="font-medium">
                {formatPrice(i.unitPrice * i.quantity)}
              </span>
            </div>
          ))}
          <div className="my-2 h-px bg-border" />
          <div className="flex justify-between">
            <span className="font-bold">Total</span>
            <span className="font-black text-primary">{formatPrice(order.total)}</span>
          </div>
        </div>
        <div className="mt-4 space-y-1 border-t border-border pt-4 text-sm text-muted-foreground">
          <p><span className="text-foreground">Deliver to:</span> {order.customerName}</p>
          <p>{order.phone}</p>
          <p>{order.address}, {order.city}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/profile?tab=orders"
          className="rounded-full border border-border bg-card/60 px-6 py-3 font-semibold transition-colors hover:border-primary/50"
        >
          View my orders
        </Link>
        <Link
          href="/products"
          className="rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 font-semibold text-white shadow-lg shadow-primary/25 transition-transform hover:scale-105"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
