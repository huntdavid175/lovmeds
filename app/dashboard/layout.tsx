"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check localStorage for authentication
    const authStatus = localStorage.getItem("dashboard_authenticated") === "true";
    setIsAuthenticated(authStatus);

    // Redirect to login if not authenticated and not on login page
    if (!authStatus && pathname !== "/dashboard/login") {
      router.push("/dashboard/login");
    }
    
    // Redirect to dashboard if authenticated and on login page
    if (authStatus && pathname === "/dashboard/login") {
      router.push("/dashboard");
    }
  }, [pathname, router]);

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A33D4A] mx-auto mb-4"></div>
          <p className="text-black/60">Loading...</p>
        </div>
      </div>
    );
  }

  if (pathname === "/dashboard/login") {
    return <>{children}</>;
  }

  const navItems = [
    { href: "/dashboard", label: "Overview", icon: "📊" },
    { href: "/dashboard/products", label: "Products", icon: "📦" },
    { href: "/dashboard/orders", label: "Orders", icon: "📋" },
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-black/10 z-10">
        <div className="p-6 border-b border-black/10">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="font-heading text-2xl text-black">LovMeds</span>
            <span className="text-sm text-black/60">Admin</span>
          </Link>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href === "/dashboard" && pathname === "/dashboard");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive
                    ? "bg-[#A33D4A] text-white"
                    : "text-black/70 hover:bg-black/5 hover:text-black"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-black/10 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-black/70 hover:bg-black/5 hover:text-black transition-colors"
          >
            <span>←</span>
            <span className="font-medium">Back to Store</span>
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem("dashboard_authenticated");
              router.push("/dashboard/login");
              router.refresh();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <span>🚪</span>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
