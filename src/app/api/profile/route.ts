import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const data: Record<string, string | null> = {};
  if (typeof body.name === "string") data.name = body.name.trim() || null;
  if (typeof body.phone === "string") data.phone = body.phone.trim() || null;
  if (typeof body.city === "string") data.city = body.city.trim() || null;
  if (typeof body.address === "string") data.address = body.address.trim() || null;
  if (
    typeof body.theme === "string" &&
    ["light", "dark", "system"].includes(body.theme)
  ) {
    data.theme = body.theme;
  }
  if (typeof body.avatar === "string" && body.avatar) {
    data.avatar = body.avatar;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  await prisma.user.update({ where: { id: session.userId }, data });
  return NextResponse.json({ ok: true });
}
