"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Ban, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { buildCancelMessage, waUrl } from "@/lib/whatsapp";

type CancelOrder = {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  total: number;
  items: { productName: string; quantity: number; unitPrice: number }[];
};

export function AdminOrderCancel({ order }: { order: CancelOrder }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function cancel() {
    if (!window.confirm("Cancel this order?")) return;
    setLoading(true);
    const res = await fetch(`/api/orders/${order.id}/cancel`, { method: "POST" });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error ?? "Could not cancel");
      setLoading(false);
      return;
    }
    window.open(waUrl(buildCancelMessage(order)), "_blank");
    toast.success("Order cancelled");
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={cancel}
      disabled={loading}
      className="inline-flex items-center gap-1.5 rounded-full border border-danger/40 px-4 py-2 text-sm font-semibold text-danger transition-colors hover:bg-danger/10 disabled:opacity-60"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ban className="h-4 w-4" />}
      Cancel order
    </button>
  );
}
