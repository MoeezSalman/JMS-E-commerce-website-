"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingCart,
  Menu,
  X,
  LogOut,
  User as UserIcon,
  Package,
} from "lucide-react";
import { toast } from "sonner";
import { ThemeToggle } from "./theme-toggle";
import { Avatar } from "./avatar";
import { useCart, cartCount } from "@/lib/cart-store";
import { useMounted } from "@/lib/use-mounted";
import { STORE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { SessionUser } from "@/lib/types";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/policy", label: "Policy" },
];

export function Navbar({ user }: { user: SessionUser | null }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const items = useCart((s) => s.items);
  const mounted = useMounted();
  const count = mounted ? cartCount(items) : 0;

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    toast.success("Signed out");
    router.refresh();
    router.push("/");
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 glass">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent font-black text-white shadow-lg shadow-primary/30 transition-transform group-hover:rotate-6">
            J
          </span>
          <span className="text-xl font-black tracking-tight gradient-text">
            {STORE_NAME}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "relative rounded-full px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
                isActive(l.href) ? "text-primary" : "text-muted-foreground"
              )}
            >
              {isActive(l.href) && (
                <span className="absolute inset-0 -z-10 rounded-full bg-primary/10" />
              )}
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {!isLanding && (
            <Link
              href="/cart"
              aria-label="Cart"
              className="relative grid h-10 w-10 place-items-center rounded-full border border-border bg-card/60 transition-all hover:scale-105 hover:border-primary/60"
            >
              <ShoppingCart className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">
                  {count}
                </span>
              )}
            </Link>
          )}

          {/* Desktop auth */}
          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 rounded-full border border-border bg-card/60 py-1 pl-1 pr-3 transition-all hover:border-primary/60"
                >
                  <Avatar src={user.avatar} name={user.name ?? user.email} size={30} />
                  <span className="max-w-24 truncate text-sm font-medium">
                    {user.name ?? "Profile"}
                  </span>
                </Link>
                <Link
                  href="/profile?tab=orders"
                  aria-label="My orders"
                  className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card/60 text-muted-foreground transition-all hover:border-primary/60 hover:text-primary"
                >
                  <Package className="h-4 w-4" />
                </Link>
                <button
                  onClick={logout}
                  aria-label="Sign out"
                  className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card/60 text-muted-foreground transition-all hover:border-danger/60 hover:text-danger"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-full bg-gradient-to-r from-primary to-accent px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-transform hover:scale-105"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card/60 md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      <div
        className={cn(
          "overflow-hidden border-t border-border/70 md:hidden",
          open ? "max-h-96" : "max-h-0"
        )}
        style={{ transition: "max-height 0.3s ease" }}
      >
        <div className="space-y-1 px-4 py-3">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={cn(
                "block rounded-xl px-4 py-2.5 text-sm font-medium",
                isActive(l.href) ? "bg-primary/10 text-primary" : "text-muted-foreground"
              )}
            >
              {l.label}
            </Link>
          ))}
          <div className="my-2 h-px bg-border" />
          {user ? (
            <>
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium"
              >
                <UserIcon className="h-4 w-4" /> Profile
              </Link>
              <Link
                href="/profile?tab=orders"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium"
              >
                <Package className="h-4 w-4" /> My orders
              </Link>
              <button
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
                className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-danger"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </>
          ) : (
            <div className="flex gap-2 px-1 pt-1">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-xl border border-border py-2.5 text-center text-sm font-medium"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-xl bg-gradient-to-r from-primary to-accent py-2.5 text-center text-sm font-semibold text-white"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
