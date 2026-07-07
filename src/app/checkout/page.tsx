import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { CheckoutForm } from "@/components/checkout-form";

export const dynamic = "force-dynamic";
export const metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirect=/checkout");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 text-3xl font-black tracking-tight sm:text-4xl">
        <span className="gradient-text">Checkout</span>
      </h1>
      <CheckoutForm
        prefill={{
          name: user.name ?? "",
          phone: user.phone ?? "",
          address: user.address ?? "",
          city: user.city ?? "",
        }}
      />
    </div>
  );
}
