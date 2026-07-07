import Link from "next/link";
import { MessageCircle, ShieldAlert } from "lucide-react";
import { STORE_NAME, WHATSAPP_NUMBER } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/70">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent font-black text-white">
              J
            </span>
            <span className="text-xl font-black gradient-text">{STORE_NAME}</span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            {STORE_NAME} is a modern store bringing you curated products across
            categories. Order in seconds — checkout details are sent straight to
            us on WhatsApp.
          </p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 text-sm font-medium transition-colors hover:border-success/60 hover:text-success"
          >
            <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
          </a>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Shop
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/products" className="text-foreground/80 hover:text-primary">All products</Link></li>
            <li><Link href="/cart" className="text-foreground/80 hover:text-primary">Cart</Link></li>
            <li><Link href="/profile" className="text-foreground/80 hover:text-primary">My account</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Info
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link
                href="/policy"
                className="inline-flex items-center gap-1.5 text-foreground/80 hover:text-primary"
              >
                <ShieldAlert className="h-4 w-4" /> No-return policy
              </Link>
            </li>
            <li><Link href="/login" className="text-foreground/80 hover:text-primary">Login</Link></li>
            <li><Link href="/register" className="text-foreground/80 hover:text-primary">Create account</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/70 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {STORE_NAME}. All rights reserved. · All sales
        are final.
      </div>
    </footer>
  );
}
