import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

/** Ensures the fixed admin account exists. Safe to call repeatedly.
 *  (Demo products/categories are intentionally NOT seeded — add your own
 *  from the admin console.) */
async function ensureAdmin() {
  const email = process.env.ADMIN_EMAIL ?? "admin@jms.com";
  const password = process.env.ADMIN_PASSWORD ?? "JMS@Admin2026";
  const name = process.env.ADMIN_NAME ?? "JMS Admin";

  const admin = await prisma.user.upsert({
    where: { email },
    update: { role: "admin" },
    create: {
      email,
      name,
      role: "admin",
      passwordHash: await hashPassword(password),
    },
  });

  return NextResponse.json({
    ok: true,
    admin: admin.email,
    totalProducts: await prisma.product.count(),
  });
}

export async function GET() {
  return ensureAdmin();
}

export async function POST() {
  return ensureAdmin();
}
