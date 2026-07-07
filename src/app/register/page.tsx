import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { getSession } from "@/lib/auth";

export const metadata = { title: "Create account" };
export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  if (await getSession()) redirect("/");
  return (
    <Suspense>
      <AuthForm mode="register" />
    </Suspense>
  );
}
