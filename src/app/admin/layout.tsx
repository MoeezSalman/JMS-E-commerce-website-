import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { AdminNav } from "@/components/admin-nav";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin" };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAdmin())) {
    redirect("/login?redirect=/admin");
  }
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <AdminNav />
      <div className="mt-8">{children}</div>
    </div>
  );
}
