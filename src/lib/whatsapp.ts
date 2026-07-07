import { WHATSAPP_NUMBER, STORE_NAME } from "./constants";
import { formatPrice } from "./format";

export type OrderForMessage = {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  total: number;
  items: { productName: string; quantity: number; unitPrice: number }[];
};

/** Short human-friendly order reference from a cuid. */
export function orderRef(id: string): string {
  return id.slice(-6).toUpperCase();
}

const DIVIDER = "--------------------------------";

export function buildOrderMessage(o: OrderForMessage): string {
  const lines = o.items
    .map(
      (it, i) =>
        `${i + 1}. ${it.productName} × ${it.quantity} = ${formatPrice(
          it.unitPrice * it.quantity
        )}`
    )
    .join("\n");

  return [
    `🛍️ *${STORE_NAME} — New Order*`,
    `Order #${orderRef(o.id)}`,
    DIVIDER,
    lines,
    DIVIDER,
    `*Total: ${formatPrice(o.total)}*`,
    ``,
    `👤 Name: ${o.customerName}`,
    `📞 Phone: ${o.phone}`,
    `🏙️ City: ${o.city}`,
    `📍 Address: ${o.address}`,
    ``,
    `✅ I understand all sales are final (no returns / refunds).`,
  ].join("\n");
}

export function buildCancelMessage(o: OrderForMessage): string {
  const lines = o.items
    .map((it, i) => `${i + 1}. ${it.productName} × ${it.quantity}`)
    .join("\n");

  return [
    `❌ *${STORE_NAME} — Order Cancellation*`,
    `Order #${orderRef(o.id)}`,
    DIVIDER,
    lines,
    DIVIDER,
    `Order value: ${formatPrice(o.total)}`,
    ``,
    `👤 Name: ${o.customerName}`,
    `📞 Phone: ${o.phone}`,
    ``,
    `I would like to cancel this order. Thank you.`,
  ].join("\n");
}

export function waUrl(text: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
