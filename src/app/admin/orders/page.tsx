import Link from "next/link";
import { Inbox, User as UserIcon, MapPin, Phone } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { orderRef } from "@/lib/whatsapp";
import { AdminOrderCancel } from "@/components/admin-order-cancel";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const FILTERS = [
  { key: "", label: "All" },
  { key: "placed", label: "Placed" },
  { key: "cancelled", label: "Cancelled" },
];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const sp = await searchParams;
  const status = sp.status === "cancelled" || sp.status === "placed" ? sp.status : "";

  const where =
    status === "cancelled"
      ? { status: "CANCELLED" }
      : status === "placed"
        ? { status: "PLACED" }
        : {};

  const orders = await prisma.order.findMany({
    where,
    include: { items: true, user: { select: { email: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black tracking-tight">Orders</h2>
          <p className="text-sm text-muted-foreground">
            {orders.length} order{orders.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex gap-1 rounded-full border border-border bg-card/60 p-1">
          {FILTERS.map((f) => (
            <Link
              key={f.key}
              href={f.key ? `/admin/orders?status=${f.key}` : "/admin/orders"}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                status === f.key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {f.label}
            </Link>
          ))}
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="grid place-items-center rounded-2xl border border-dashed border-border py-20 text-center">
          <Inbox className="h-10 w-10 text-muted-foreground" />
          <p className="mt-3 font-semibold">No orders here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const cancelled = order.status === "CANCELLED";
            return (
              <div key={order.id} className="rounded-2xl border border-border bg-card/40 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold">Order #{orderRef(order.id)}</p>
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                          cancelled ? "bg-danger/15 text-danger" : "bg-success/15 text-success"
                        )}
                      >
                        {cancelled ? "Cancelled" : "Placed"}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleString("en-PK", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                  <span className="text-lg font-black text-primary">
                    {formatPrice(order.total)}
                  </span>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5 text-sm">
                    {order.items.map((it) => (
                      <div key={it.id} className="flex justify-between">
                        <span className="text-muted-foreground">
                          {it.productName} × {it.quantity}
                        </span>
                        <span className="font-medium">
                          {formatPrice(it.unitPrice * it.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1 rounded-xl bg-muted/50 p-3 text-sm text-muted-foreground">
                    <p className="flex items-center gap-1.5">
                      <UserIcon className="h-3.5 w-3.5" /> {order.customerName}{" "}
                      <span className="text-xs">({order.user?.email})</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5" /> {order.phone}
                    </p>
                    <p className="flex items-start gap-1.5">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {order.address},{" "}
                      {order.city}
                    </p>
                  </div>
                </div>

                {!cancelled && (
                  <div className="mt-4 flex justify-end border-t border-border pt-4">
                    <AdminOrderCancel
                      order={{
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
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
