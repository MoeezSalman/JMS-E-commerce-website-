import Link from "next/link";
import {
  ArrowRight,
  Zap,
  ShieldCheck,
  MessageCircle,
  Layers,
  Search,
  LogIn,
} from "lucide-react";
import { Hero } from "@/components/hero";
import { STORE_NAME } from "@/lib/constants";

export const metadata = { title: `${STORE_NAME} — Modern Online Store` };

const STEPS = [
  {
    icon: Search,
    title: "Browse the collection",
    text: "Explore curated products across electronics, fashion, home, beauty and more.",
  },
  {
    icon: LogIn,
    title: "Sign in to your account",
    text: "Create a free account or log in to add items to your cart securely.",
  },
  {
    icon: MessageCircle,
    title: "Order on WhatsApp",
    text: "Tap buy and your order details are sent straight to us on WhatsApp to confirm.",
  },
];

const FEATURES = [
  { icon: MessageCircle, title: "WhatsApp checkout", text: "Your order details go straight to us on WhatsApp — no complicated payment forms." },
  { icon: Zap, title: "Fast & modern", text: "A smooth, animated interface that works beautifully on any device." },
  { icon: ShieldCheck, title: "Secure account", text: "Manage your profile, avatar, theme and order history in one place." },
  { icon: Layers, title: "Curated categories", text: "Hand-picked products across electronics, fashion, home and more." },
];

export default function HomePage() {
  return (
    <div>
      <Hero />

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs font-semibold text-muted-foreground">
            How it works
          </span>
          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
            Shopping made <span className="gradient-text">simple</span>
          </h2>
          <p className="mt-3 text-muted-foreground">
            Three easy steps from browsing to your order reaching us.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <div
              key={s.title}
              className="relative overflow-hidden rounded-2xl border border-border bg-card/60 p-6 transition-all hover:-translate-y-1 hover:border-primary/40"
            >
              <span className="pointer-events-none absolute right-4 top-2 text-5xl font-black text-primary/10">
                {i + 1}
              </span>
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 text-primary">
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why JMS */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-border bg-card/60 p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
            >
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 text-primary">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-bold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-card to-accent/10 p-8 text-center sm:p-16">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 animate-float rounded-full bg-primary/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 animate-float-slow rounded-full bg-accent/20 blur-3xl" />
          <h2 className="relative text-3xl font-black tracking-tight sm:text-4xl">
            Ready to explore the collection?
          </h2>
          <p className="relative mx-auto mt-3 max-w-lg text-muted-foreground">
            Browse our products and sign in to add them to your cart and order in
            seconds.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 font-semibold text-white shadow-xl shadow-primary/30 transition-transform hover:scale-105"
            >
              Browse the shop <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-6 py-3 font-semibold transition-colors hover:border-primary/50"
            >
              Create account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
