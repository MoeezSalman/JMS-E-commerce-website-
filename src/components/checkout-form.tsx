"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Loader2,
  MapPin,
  Phone,
  User as UserIcon,
  Building2,
  ShoppingBag,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import { useCart, cartTotal } from "@/lib/cart-store";
import { useMounted } from "@/lib/use-mounted";
import { formatPrice } from "@/lib/format";

type Prefill = {
  name: string;
  phone: string;
  address: string;
  city: string;
};

export function CheckoutForm({ prefill }: { prefill: Prefill }) {
  const router = useRouter();
  const { items, clear } = useCart();
  const mounted = useMounted();

  const [name, setName] = useState(prefill.name);
  const [phone, setPhone] = useState(prefill.phone);
  const [address, setAddress] = useState(prefill.address);
  const [city, setCity] = useState(prefill.city);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!mounted) {
    return <div className="h-96 animate-pulse rounded-2xl bg-muted" />;
  }

  if (items.length === 0) {
    return (
      <div className="grid place-items-center rounded-3xl border border-dashed border-border py-24 text-center">
        <ShoppingBag className="h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-bold">Nothing to check out</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Add some products to your cart first.
        </p>
        <Link
          href="/products"
          className="mt-6 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 font-semibold text-white shadow-lg shadow-primary/25"
        >
          Browse products
        </Link>
      </div>
    );
  }

  const total = cartTotal(items);

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!agree) {
      setError("Please accept the no-return policy to continue.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          phone,
          address,
          city,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not place your order");
        setLoading(false);
        return;
      }
      clear();
      toast.success("Order placed! Send it to us on WhatsApp.");
      router.push(`/order/success?id=${data.orderId}`);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={placeOrder} className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        <h2 className="text-lg font-bold">Delivery details</h2>

        <Field icon={<UserIcon className="h-4 w-4" />} label="Full name">
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full bg-transparent outline-none placeholder:text-muted-foreground/60"
          />
        </Field>

        <Field icon={<Phone className="h-4 w-4" />} label="Phone number">
          <input
            required
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="03xx-xxxxxxx"
            className="w-full bg-transparent outline-none placeholder:text-muted-foreground/60"
          />
        </Field>

        <Field icon={<Building2 className="h-4 w-4" />} label="City">
          <input
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. Karachi"
            className="w-full bg-transparent outline-none placeholder:text-muted-foreground/60"
          />
        </Field>

        <Field icon={<MapPin className="h-4 w-4" />} label="Full address" align="start">
          <textarea
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="House / street / area, landmarks…"
            rows={3}
            className="w-full resize-none bg-transparent outline-none placeholder:text-muted-foreground/60"
          />
        </Field>
      </div>

      {/* Summary */}
      <div className="h-fit space-y-4 rounded-2xl border border-border bg-card/60 p-6 lg:sticky lg:top-24">
        <h2 className="text-lg font-bold">Your order</h2>
        <div className="max-h-52 space-y-3 overflow-y-auto pr-1">
          {items.map((i) => (
            <div key={i.productId} className="flex items-center gap-3 text-sm">
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                {i.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={i.image} alt={i.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full w-full place-items-center text-primary/50">
                    {i.name[0]}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="line-clamp-1 font-medium">{i.name}</p>
                <p className="text-xs text-muted-foreground">Qty {i.quantity}</p>
              </div>
              <span className="font-semibold">
                {formatPrice(i.price * i.quantity)}
              </span>
            </div>
          ))}
        </div>

        <div className="h-px bg-border" />
        <div className="flex justify-between text-base">
          <span className="font-bold">Total</span>
          <span className="font-black text-primary">{formatPrice(total)}</span>
        </div>

        <label className="flex cursor-pointer items-start gap-2.5 rounded-xl bg-danger/5 p-3 text-xs text-muted-foreground">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-[var(--primary)]"
          />
          <span className="flex items-start gap-1.5">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
            I understand all sales are final — no returns or refunds.
          </span>
        </label>

        {error && (
          <p className="rounded-xl bg-danger/10 px-4 py-2.5 text-sm font-medium text-danger">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent py-3.5 font-semibold text-white shadow-lg shadow-primary/25 transition-transform hover:scale-[1.02] disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Place order
        </button>
        <p className="text-center text-xs text-muted-foreground">
          Your order details are sent to us on WhatsApp to confirm.
        </p>
      </div>
    </form>
  );
}

function Field({
  icon,
  label,
  children,
  align = "center",
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  align?: "center" | "start";
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <div
        className={`flex gap-2.5 rounded-xl border border-input bg-background/60 px-3.5 py-3 text-sm transition-colors focus-within:border-primary ${
          align === "start" ? "items-start" : "items-center"
        }`}
      >
        <span className="text-muted-foreground">{icon}</span>
        {children}
      </div>
    </label>
  );
}
