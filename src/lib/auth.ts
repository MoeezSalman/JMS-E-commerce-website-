import "server-only";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./db";
import type { User } from "@/generated/prisma/client";

const SESSION_COOKIE = "jms_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export type SessionData = {
  userId: string;
  role: string;
  email: string;
};

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

async function signToken(data: SessionData): Promise<string> {
  return new SignJWT({ role: data.role, email: data.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(data.userId)
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getSecret());
}

/** Create the session cookie for a user (call inside a Route Handler or Server Action). */
export async function createSession(user: {
  id: string;
  role: string;
  email: string;
}): Promise<void> {
  const token = await signToken({
    userId: user.id,
    role: user.role,
    email: user.email,
  });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionData | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return {
      userId: payload.sub as string,
      role: (payload.role as string) ?? "customer",
      email: (payload.email as string) ?? "",
    };
  } catch {
    return null;
  }
}

/** Full user record for the current session, or null. */
export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();
  if (!session) return null;
  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  return user;
}

export async function isAdmin(): Promise<boolean> {
  const session = await getSession();
  return session?.role === "admin";
}
