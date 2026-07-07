import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (order.userId !== session.userId && session.role !== "admin") {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }
  if (order.status === "CANCELLED") {
    return NextResponse.json({ error: "Order is already cancelled" }, { status: 400 });
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id },
      data: { status: "CANCELLED", cancelledAt: new Date() },
    });
    // Restore stock (updateMany is a no-op if the product was deleted).
    for (const it of order.items) {
      if (it.productId) {
        await tx.product.updateMany({
          where: { id: it.productId },
          data: { stock: { increment: it.quantity } },
        });
      }
    }
  });

  return NextResponse.json({ ok: true });
}
