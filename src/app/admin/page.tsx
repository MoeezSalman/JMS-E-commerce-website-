import Link from "next/link";
import {
  Wallet,
  Boxes,
  Receipt,
  Ban,
  TrendingUp,
  Package,
  Users,
  BarChart3,
} from "lucide-react";
import { getAnalytics } from "@/lib/analytics";
import { prisma } from "@/lib/db";
import { RevenueAreaChart, OrdersBarChart } from "@/components/revenue-chart";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [a, productCount, customerCount] = await Promise.all([
    getAnalytics(),
    prisma.product.count(),
    prisma.user.count({ where: { role: "customer" } }),
  ]);

  const stats = [
    { icon: Wallet, label: "Revenue", value: formatPrice(a.totalRevenue), sub: "from placed orders", accent: "text-success" },
    { icon: Boxes, label: "Items sold", value: a.itemsSold.toLocaleString(), sub: "units", accent: "text-primary" },
    { icon: Receipt, label: "Orders", value: a.totalOrders.toLocaleString(), sub: "placed", accent: "text-accent" },
    { icon: TrendingUp, label: "Avg. order", value: formatPrice(a.avgOrderValue), sub: "per order", accent: "text-primary" },
    { icon: Ban, label: "Cancelled", value: a.cancelledCount.toLocaleString(), sub: `${formatPrice(a.cancelledValue)} value`, accent: "text-danger" },
    { icon: Package, label: "Products", value: productCount.toLocaleString(), sub: "in catalog", accent: "text-accent" },
    { icon: Users, label: "Customers", value: customerCount.toLocaleString(), sub: "registered", accent: "text-primary" },
  ];

  const maxRevenue = Math.max(1, ...a.productSummary.map((p) => p.revenue));

  return (
    <div className="space-y-8">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-border bg-card/60 p-5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {s.label}
              </span>
              <s.icon className={`h-5 w-5 ${s.accent}`} />
            </div>
            <p className="mt-3 text-2xl font-black tracking-tight">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card/60 p-6 lg:col-span-2">
          <h2 className="flex items-center gap-2 font-bold">
            <BarChart3 className="h-5 w-5 text-primary" /> Revenue — last 12 months
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Monthly revenue from placed orders (cancellations excluded).
          </p>
          <RevenueAreaChart data={a.monthly} />
        </div>
        <div className="rounded-2xl border border-border bg-card/60 p-6">
          <h2 className="font-bold">Orders / month</h2>
          <p className="mb-4 text-sm text-muted-foreground">Placed order count.</p>
          <OrdersBarChart data={a.monthly} />
        </div>
      </div>

      {/* Product summary + cancellations */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card/60 p-6 lg:col-span-2">
          <h2 className="font-bold">Sales by product</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Units sold and revenue per product, best sellers first.
          </p>
          {a.productSummary.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              No sales yet. Once customers place orders, they’ll show up here.
            </p>
          ) : (
            <div className="space-y-3">
              {a.productSummary.slice(0, 8).map((p, i) => (
                <div key={p.productId ?? p.name} className="flex items-center gap-3">
                  <span className="w-5 text-sm font-bold text-muted-foreground">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium">{p.name}</span>
                      <span className="shrink-0 text-sm font-bold text-primary">
                        {formatPrice(p.revenue)}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                          style={{ width: `${(p.revenue / maxRevenue) * 100}%` }}
                        />
                      </div>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {p.quantity} sold
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-danger/30 bg-danger/5 p-6">
            <div className="flex items-center gap-2">
              <Ban className="h-5 w-5 text-danger" />
              <h2 className="font-bold">Cancellations</h2>
            </div>
            <p className="mt-3 text-3xl font-black">{a.cancelledCount}</p>
            <p className="text-sm text-muted-foreground">
              cancelled orders worth {formatPrice(a.cancelledValue)}
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              Cancelled orders are removed from revenue and items-sold totals
              automatically.
            </p>
            <Link
              href="/admin/orders?status=cancelled"
              className="mt-4 inline-block text-sm font-semibold text-danger hover:underline"
            >
              View cancellations →
            </Link>
          </div>
          <div className="rounded-2xl border border-border bg-card/60 p-6">
            <h2 className="font-bold">Net revenue</h2>
            <p className="mt-2 text-3xl font-black text-success">
              {formatPrice(a.totalRevenue)}
            </p>
            <p className="text-xs text-muted-foreground">
              after {a.cancelledCount} cancellation(s)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
