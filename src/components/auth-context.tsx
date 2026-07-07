"use client";

import { createContext, useContext, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, LogIn, UserPlus, ShoppingBag } from "lucide-react";

type AuthContextValue = {
  isAuthenticated: boolean;
  /** Returns true if signed in. Otherwise opens the login popup and returns false. */
  requireAuth: () => boolean;
};

const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  requireAuth: () => true,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({
  isAuthenticated,
  children,
}: {
  isAuthenticated: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const redirect = encodeURIComponent(pathname || "/");

  function requireAuth() {
    if (isAuthenticated) return true;
    setOpen(true);
    return false;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, requireAuth }}>
      {children}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[100] grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", damping: 22, stiffness: 260 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-border bg-card p-8 text-center shadow-2xl"
            >
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="pointer-events-none absolute -top-10 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-primary/25 blur-3xl" />

              <span className="relative mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/30">
                <ShoppingBag className="h-7 w-7" />
              </span>
              <h2 className="relative mt-4 text-xl font-black tracking-tight">
                Sign in to continue
              </h2>
              <p className="relative mt-2 text-sm text-muted-foreground">
                Please sign in or create an account to add items to your cart and
                place an order.
              </p>

              <div className="relative mt-6 flex flex-col gap-2.5">
                <Link
                  href={`/login?redirect=${redirect}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent py-3 font-semibold text-white shadow-lg shadow-primary/25 transition-transform hover:scale-[1.02]"
                >
                  <LogIn className="h-4 w-4" /> Sign in
                </Link>
                <Link
                  href={`/register?redirect=${redirect}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-border py-3 font-semibold transition-colors hover:border-primary/50"
                >
                  <UserPlus className="h-4 w-4" /> Create an account
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthContext.Provider>
  );
}
