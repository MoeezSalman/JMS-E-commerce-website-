import "server-only";
import { prisma } from "./db";

export type MonthlyPoint = {
  key: string;
  label: string;
  revenue: number;
  orders: number;
};

export type ProductSummaryRow = {
  productId: string | null;
  name: string;
  quantity: number;
  revenue: number;
};

export type Analytics = {
  totalRevenue: number;
  itemsSold: number;
  totalOrders: number;
  cancelledCount: number;
  cancelledValue: number;
  avgOrderValue: number;
  monthly: MonthlyPoint[];
  productSummary: ProductSummaryRow[];
};

function buildMonthly(
  orders: { total: number; createdAt: Date }[]
): MonthlyPoint[] {
  const now = new Date();
  const order: string[] = [];
  const map = new Map<string, MonthlyPoint>();

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    map.set(key, {
      key,
      label: d.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
      revenue: 0,
      orders: 0,
    });
    order.push(key);
  }

  for (const o of orders) {
    const d = new Date(o.createdAt);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const bucket = map.get(key);
    if (bucket) {
      bucket.revenue += o.total;
      bucket.orders += 1;
    }
  }

  return order.map((k) => map.get(k)!);
}

/** Aggregate sales analytics. Revenue and item counts reflect only PLACED
 *  (non-cancelled) orders, so cancellations correctly reduce the totals. */
export async function getAnalytics(): Promise<Analytics> {
  const orders = await prisma.order.findMany({ include: { items: true } });

  const placed = orders.filter((o) => o.status === "PLACED");
  const cancelled = orders.filter((o) => o.status === "CANCELLED");

  const totalRevenue = placed.reduce((s, o) => s + o.total, 0);
  const itemsSold = placed.reduce(
    (s, o) => s + o.items.reduce((a, i) => a + i.quantity, 0),
    0
  );
  const totalOrders = placed.length;
  const cancelledCount = cancelled.length;
  const cancelledValue = cancelled.reduce((s, o) => s + o.total, 0);
  const avgOrderValue = totalOrders ? Math.round(totalRevenue / totalOrders) : 0;

  const productMap = new Map<string, ProductSummaryRow>();
  for (const o of placed) {
    for (const it of o.items) {
      const key = it.productId ?? `name:${it.productName}`;
      const existing =
        productMap.get(key) ??
        { productId: it.productId, name: it.productName, quantity: 0, revenue: 0 };
      existing.quantity += it.quantity;
      existing.revenue += it.unitPrice * it.quantity;
      productMap.set(key, existing);
    }
  }
  const productSummary = [...productMap.values()].sort(
    (a, b) => b.revenue - a.revenue
  );

  return {
    totalRevenue,
    itemsSold,
    totalOrders,
    cancelledCount,
    cancelledValue,
    avgOrderValue,
    monthly: buildMonthly(placed),
    productSummary,
  };
}
