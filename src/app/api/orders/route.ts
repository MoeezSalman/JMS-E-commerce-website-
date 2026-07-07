import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

type IncomingItem = { productId: string; quantity: number };

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Please sign in to place an order" }, { status: 401 });
  }

  let body: {
    customerName?: string;
    phone?: string;
    address?: string;
    city?: string;
    items?: IncomingItem[];
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const customerName = body.customerName?.trim();
  const phone = body.phone?.trim();
  const address = body.address?.trim();
  const city = body.city?.trim();
  const items = body.items ?? [];

  if (!customerName || !phone || !address || !city) {
    return NextResponse.json(
      { error: "Name, phone, address and city are required" },
      { status: 400 }
    );
  }
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Your cart is empty" }, { status: 400 });
  }

  const ids = [...new Set(items.map((i) => i.productId))];
  const products = await prisma.product.findMany({ where: { id: { in: ids } } });
  const byId = new Map(products.map((p) => [p.id, p]));

  const orderItems: {
    productId: string;
    productName: string;
    unitPrice: number;
    quantity: number;
  }[] = [];
  let total = 0;

  for (const it of items) {
    const p = byId.get(it.productId);
    if (!p) continue;
    const qty = Math.max(1, Math.floor(Number(it.quantity) || 1));
    if (qty > p.stock) {
      return NextResponse.json(
        { error: `${p.name} — only ${p.stock} left in stock` },
        { status: 400 }
      );
    }
    orderItems.push({
      productId: p.id,
      productName: p.name,
      unitPrice: p.price,
      quantity: qty,
    });
    total += p.price * qty;
  }

  if (orderItems.length === 0) {
    return NextResponse.json(
      { error: "None of these products are available" },
      { status: 400 }
    );
  }

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        userId: session.userId,
        customerName,
        phone,
        address,
        city,
        total,
        status: "PLACED",
        items: { create: orderItems },
      },
    });
    for (const oi of orderItems) {
      await tx.product.update({
        where: { id: oi.productId },
        data: { stock: { decrement: oi.quantity } },
      });
    }
    // Remember contact details for next time.
    await tx.user.update({
      where: { id: session.userId },
      data: { phone, address, city },
    });
    return created;
  });

  return NextResponse.json({ ok: true, orderId: order.id });
}
