"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  User as UserIcon,
  Lock,
  Palette,
  Package,
  Camera,
  Loader2,
  Sun,
  Moon,
  Monitor,
  Check,
  MessageCircle,
  XCircle,
  ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar } from "./avatar";
import { useMounted } from "@/lib/use-mounted";
import { AVATAR_PRESETS } from "@/lib/constants";
import { formatPrice } from "@/lib/format";
import { buildCancelMessage, waUrl, orderRef } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export type ProfileUser = {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  theme: string;
  phone: string | null;
  address: string | null;
  city: string | null;
};

export type OrderView = {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  items: { id: string; productName: string; quantity: number; unitPrice: number }[];
};

const TABS = [
  { id: "account", label: "Account", icon: UserIcon },
  { id: "security", label: "Security", icon: Lock },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "orders", label: "Orders", icon: Package },
] as const;

export function ProfileClient({
  user,
  orders,
  initialTab,
}: {
  user: ProfileUser;
  orders: OrderView[];
  initialTab?: string;
}) {
  const [tab, setTab] = useState<string>(
    TABS.some((t) => t.id === initialTab) ? (initialTab as string) : "account"
  );

  return (
    <div className="grid gap-8 md:grid-cols-[220px_1fr]">
      <aside className="h-fit md:sticky md:top-24">
        <nav className="flex gap-2 overflow-x-auto md:flex-col">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-2.5 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                tab === t.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <t.icon className="h-4 w-4" /> {t.label}
              {t.id === "orders" && orders.length > 0 && (
                <span className="ml-auto rounded-full bg-primary/15 px-2 text-xs">
                  {orders.length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </aside>

      <div>
        {tab === "account" && <AccountTab user={user} />}
        {tab === "security" && <SecurityTab />}
        {tab === "appearance" && <AppearanceTab user={user} />}
        {tab === "orders" && <OrdersTab orders={orders} />}
      </div>
    </div>
  );
}

/* ------------------------- Account ------------------------- */

function AccountTab({ user }: { user: ProfileUser }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState(user.avatar);
  const [name, setName] = useState(user.name ?? "");
  const [phone, setPhone] = useState(user.phone ?? "");
  const [city, setCity] = useState(user.city ?? "");
  const [address, setAddress] = useState(user.address ?? "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  async function uploadAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/profile/avatar", { method: "POST", body: form });
    const data = await res.json();
    setUploading(false);
    if (!res.ok) {
      toast.error(data.error ?? "Upload failed");
      return;
    }
    setAvatar(data.path);
    toast.success("Avatar updated");
    router.refresh();
  }

  async function selectPreset(id: string) {
    setAvatar(id);
    await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ avatar: id }),
    });
    toast.success("Avatar updated");
    router.refresh();
  }

  async function save() {
    setSaving(true);
    const res = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, city, address }),
    });
    setSaving(false);
    if (!res.ok) {
      toast.error("Could not save");
      return;
    }
    toast.success("Profile saved");
    router.refresh();
  }

  return (
    <Panel title="Your account" desc="Update your photo and contact details.">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <div className="relative">
          <Avatar src={avatar} name={name || user.email} size={88} />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg"
            aria-label="Upload avatar"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Camera className="h-4 w-4" />
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={uploadAvatar}
            className="hidden"
          />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold">Pick a preset</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {AVATAR_PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => selectPreset(p.id)}
                className={cn(
                  "relative h-10 w-10 rounded-full bg-gradient-to-br ring-2 ring-transparent transition-all hover:scale-110",
                  p.gradient,
                  avatar === p.id && "ring-primary"
                )}
                aria-label={p.label}
              >
                {avatar === p.id && (
                  <Check className="absolute inset-0 m-auto h-4 w-4 text-white" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <TextField label="Full name" value={name} onChange={setName} placeholder="Your name" />
        <TextField label="Email" value={user.email} onChange={() => {}} disabled />
        <TextField label="Phone" value={phone} onChange={setPhone} placeholder="03xx-xxxxxxx" />
        <TextField label="City" value={city} onChange={setCity} placeholder="e.g. Lahore" />
        <div className="sm:col-span-2">
          <TextField label="Address" value={address} onChange={setAddress} placeholder="Delivery address" />
        </div>
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-3 font-semibold text-white shadow-lg shadow-primary/25 transition-transform hover:scale-[1.02] disabled:opacity-60"
      >
        {saving && <Loader2 className="h-4 w-4 animate-spin" />}
        Save changes
      </button>
    </Panel>
  );
}

/* ------------------------- Security ------------------------- */

function SecurityTab() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (next !== confirm) {
      setError("New passwords do not match");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/profile/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: current, newPassword: next }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error ?? "Could not change password");
      return;
    }
    setCurrent("");
    setNext("");
    setConfirm("");
    toast.success("Password changed");
  }

  return (
    <Panel title="Security" desc="Change your account password.">
      <form onSubmit={submit} className="max-w-md space-y-4">
        <TextField label="Current password" type="password" value={current} onChange={setCurrent} />
        <TextField label="New password" type="password" value={next} onChange={setNext} placeholder="At least 6 characters" />
        <TextField label="Confirm new password" type="password" value={confirm} onChange={setConfirm} />
        {error && (
          <p className="rounded-xl bg-danger/10 px-4 py-2.5 text-sm font-medium text-danger">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={saving}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-3 font-semibold text-white shadow-lg shadow-primary/25 transition-transform hover:scale-[1.02] disabled:opacity-60"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Update password
        </button>
      </form>
    </Panel>
  );
}

/* ------------------------- Appearance ------------------------- */

function AppearanceTab({ user }: { user: ProfileUser }) {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();
  const active = mounted ? theme ?? user.theme : user.theme;

  const options = [
    { id: "light", label: "Light", icon: Sun },
    { id: "dark", label: "Dark", icon: Moon },
    { id: "system", label: "System", icon: Monitor },
  ];

  async function choose(id: string) {
    setTheme(id);
    await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme: id }),
    });
    toast.success(`Theme set to ${id}`);
  }

  return (
    <Panel title="Appearance" desc="Choose how JMS looks for you.">
      <div className="grid grid-cols-3 gap-3">
        {options.map((o) => (
          <button
            key={o.id}
            onClick={() => choose(o.id)}
            className={cn(
              "flex flex-col items-center gap-2 rounded-2xl border-2 p-6 transition-all",
              active === o.id
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/40"
            )}
          >
            <o.icon className={cn("h-6 w-6", active === o.id ? "text-primary" : "text-muted-foreground")} />
            <span className="text-sm font-semibold">{o.label}</span>
          </button>
        ))}
      </div>
    </Panel>
  );
}

/* ------------------------- Orders ------------------------- */

function OrdersTab({ orders }: { orders: OrderView[] }) {
  const router = useRouter();
  const [cancelling, setCancelling] = useState<string | null>(null);

  async function cancelOrder(order: OrderView) {
    if (!window.confirm("Cancel this order? This cannot be undone.")) return;
    setCancelling(order.id);
    const res = await fetch(`/api/orders/${order.id}/cancel`, { method: "POST" });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error ?? "Could not cancel");
      setCancelling(null);
      return;
    }
    const msg = buildCancelMessage({
      id: order.id,
      customerName: order.customerName,
      phone: order.phone,
      address: order.address,
      city: order.city,
      total: order.total,
      items: order.items,
    });
    window.open(waUrl(msg), "_blank");
    toast.success("Order cancelled");
    setCancelling(null);
    router.refresh();
  }

  if (orders.length === 0) {
    return (
      <Panel title="Your orders" desc="Track and manage your orders.">
        <div className="grid place-items-center rounded-2xl border border-dashed border-border py-16 text-center">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          <p className="mt-3 font-semibold">No orders yet</p>
          <Link href="/products" className="mt-4 text-sm font-semibold text-primary hover:underline">
            Start shopping →
          </Link>
        </div>
      </Panel>
    );
  }

  return (
    <Panel title="Your orders" desc="Track and manage your orders.">
      <div className="space-y-4">
        {orders.map((order) => {
          const cancelled = order.status === "CANCELLED";
          return (
            <div
              key={order.id}
              className="rounded-2xl border border-border bg-card/60 p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-bold">Order #{orderRef(order.id)}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleString("en-PK", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold",
                    cancelled
                      ? "bg-danger/15 text-danger"
                      : "bg-success/15 text-success"
                  )}
                >
                  {cancelled ? "Cancelled" : "Placed"}
                </span>
              </div>

              <div className="mt-4 space-y-1.5 border-t border-border pt-4 text-sm">
                {order.items.map((it) => (
                  <div key={it.id} className="flex justify-between">
                    <span className="text-muted-foreground">
                      {it.productName} × {it.quantity}
                    </span>
                    <span className="font-medium">
                      {formatPrice(it.unitPrice * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                <span className="font-black text-primary">
                  {formatPrice(order.total)}
                </span>
                {cancelled ? (
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <XCircle className="h-4 w-4" /> Order cancelled
                  </span>
                ) : (
                  <button
                    onClick={() => cancelOrder(order)}
                    disabled={cancelling === order.id}
                    className="inline-flex items-center gap-1.5 rounded-full border border-danger/40 px-4 py-2 text-sm font-semibold text-danger transition-colors hover:bg-danger/10 disabled:opacity-60"
                  >
                    {cancelling === order.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <MessageCircle className="h-4 w-4" />
                    )}
                    Cancel order
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

/* ------------------------- Shared bits ------------------------- */

function Panel({
  title,
  desc,
  children,
}: {
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/40 p-6 sm:p-8">
      <h2 className="text-xl font-black tracking-tight">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-input bg-background/60 px-3.5 py-3 text-sm outline-none transition-colors focus:border-primary disabled:opacity-60 placeholder:text-muted-foreground/60"
      />
    </label>
  );
}
