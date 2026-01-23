"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/database";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [hasPendingOrders, setHasPendingOrders] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  // Check for pending orders to show notification dot in sidebar
  useEffect(() => {
    const fetchPendingOrders = async () => {
      try {
        const { count, error } = await supabase
          .from("orders")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending");

        if (error) {
          console.error("Error checking pending orders:", error);
          return;
        }

        setHasPendingOrders((count ?? 0) > 0);
      } catch (e) {
        console.error("Error checking pending orders:", e);
      }
    };

    // Initial check
    fetchPendingOrders();

    // Poll every 60 seconds while in dashboard
    const interval = setInterval(fetchPendingOrders, 60_000);
    return () => clearInterval(interval);
  }, []);

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
    { href: "/dashboard/categories", label: "Categories", icon: "🏷️" },
    { href: "/dashboard/orders", label: "Orders", icon: "📋" },
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-white border-b border-black/10 px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="font-heading text-xl text-black">LovMeds</span>
          <span className="text-xs text-black/60">Admin</span>
        </Link>
        <button
          type="button"
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          className="h-10 w-10 rounded-full border border-black/10 flex items-center justify-center cursor-pointer"
          aria-label="Toggle navigation"
        >
          <span className="block w-4 h-0.5 bg-black mb-1" />
          <span className="block w-4 h-0.5 bg-black mb-1" />
          <span className="block w-4 h-0.5 bg-black" />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`md:fixed md:left-0 md:top-0 md:bottom-0 w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-black/10 z-10 mt-12 md:mt-0 ${
          isSidebarOpen ? "block" : "hidden"
        } md:block`}
      >
        <div className="hidden md:flex items-center gap-2 p-6 border-b border-black/10">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="font-heading text-2xl text-black">LovMeds</span>
            <span className="text-sm text-black/60">Admin</span>
          </Link>
        </div>
        <nav className="p-4 space-y-2 flex flex-col md:block overflow-y-auto md:overflow-visible">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href === "/dashboard" && pathname === "/dashboard");
            const isOrders = item.href === "/dashboard/orders";

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 768) setIsSidebarOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors relative ${
                  isActive
                    ? "bg-[#A33D4A] text-white"
                    : "text-black/70 hover:bg-black/5 hover:text-black"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium flex items-center gap-2">
                  {item.label}
                  {isOrders && hasPendingOrders && (
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
                  )}
                </span>
              </Link>
            );
          })}
        </nav>
        <div className="hidden md:block absolute bottom-0 left-0 right-0 p-4 border-t border-black/10 space-y-2">
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
      <main className="md:ml-64 ml-0 p-4 md:p-8 pt-20 md:pt-8">
        {children}
      </main>
    </div>
  );
}
