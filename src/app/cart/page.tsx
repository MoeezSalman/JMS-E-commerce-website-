import { CartView } from "@/components/cart-view";

export const metadata = { title: "Cart" };

export default function CartPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 text-3xl font-black tracking-tight sm:text-4xl">
        Your <span className="gradient-text">cart</span>
      </h1>
      <CartView />
    </div>
  );
}
