import { ShieldAlert, CheckCircle2, MessageCircle, PackageX } from "lucide-react";
import { STORE_NAME, WHATSAPP_NUMBER } from "@/lib/constants";

export const metadata = { title: "No-Return Policy" };

const POINTS = [
  {
    icon: PackageX,
    title: "All sales are final",
    text: "Once an order is placed and confirmed, it cannot be returned, exchanged, or refunded. Please review your selection carefully before buying.",
  },
  {
    icon: CheckCircle2,
    title: "Check before you buy",
    text: "Read the product details, price, and stock on each product page. If you have any questions, message us on WhatsApp before ordering.",
  },
  {
    icon: MessageCircle,
    title: "Order issues",
    text: "If there is a genuine problem with a delivered order, contact us on WhatsApp and we'll do our best to help — but returns and refunds are not offered.",
  },
];

export default function PolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl border border-danger/30 bg-gradient-to-br from-danger/10 via-card to-card p-8 sm:p-12">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-danger/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-danger/15 text-danger">
            <ShieldAlert className="h-7 w-7" />
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-danger">
              Important
            </p>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              No-Return Policy
            </h1>
          </div>
        </div>
        <p className="relative mt-6 text-muted-foreground">
          At {STORE_NAME}, we operate a strict <strong className="text-foreground">no-return,
          no-refund, no-exchange</strong> policy on all products. By placing an
          order you acknowledge and agree to this policy.
        </p>
      </div>

      <div className="mt-8 space-y-4">
        {POINTS.map((p) => (
          <div
            key={p.title}
            className="flex gap-4 rounded-2xl border border-border bg-card/60 p-6"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 text-primary">
              <p.icon className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-bold">{p.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{p.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card/60 p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Questions before ordering? We&apos;re happy to help.
        </p>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-success to-emerald-500 px-6 py-3 font-semibold text-white shadow-lg shadow-success/25 transition-transform hover:scale-105"
        >
          <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
        </a>
      </div>
    </div>
  );
}
