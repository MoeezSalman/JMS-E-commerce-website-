import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getCurrentUser } from "@/lib/auth";
import { STORE_NAME } from "@/lib/constants";
import type { SessionUser } from "@/lib/types";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${STORE_NAME} — Modern Online Store`,
    template: `%s · ${STORE_NAME}`,
  },
  description:
    "Discover curated products across categories at JMS. Browse, add to cart, and order in seconds.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const dbUser = await getCurrentUser();
  const user: SessionUser | null = dbUser
    ? {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        role: dbUser.role,
        avatar: dbUser.avatar,
        theme: dbUser.theme,
        phone: dbUser.phone,
        address: dbUser.address,
        city: dbUser.city,
      }
    : null;

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Providers isAuthenticated={Boolean(user)}>
          <Navbar user={user} />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
