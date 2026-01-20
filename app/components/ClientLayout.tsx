"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import { CartProvider } from "./CartProvider";
import CartDrawer from "./CartDrawer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  // Don't render client layout components for dashboard routes
  if (isDashboard) {
    return <>{children}</>;
  }

  // Render full client layout with header, footer, and cart
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </div>
      <CartDrawer />
    </CartProvider>
  );
}
