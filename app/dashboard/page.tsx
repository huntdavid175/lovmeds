"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/app/lib/database";

type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: "pending" | "processing" | "completed" | "cancelled";
  total: number;
  paid: boolean;
  createdAt: string;
};

type Product = {
  id: string;
  title: string;
  normalPrice: number;
  salePrice?: number;
  costPrice: number;
  stock: number;
};

export default function DashboardOverview() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (ordersError) throw ordersError;

      const transformedOrders: Order[] = (ordersData || []).map((order: any) => ({
        id: order.id,
        orderNumber: order.order_number,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        status: order.status as Order["status"],
        total: parseFloat(order.total?.toString() ?? "0"),
        paid: order.paid || false,
        createdAt: order.created_at,
      }));

      setOrders(transformedOrders);

      // Fetch products
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("*");

      if (productsError) throw productsError;

      const transformedProducts: Product[] = (productsData || []).map(
        (p: any) => ({
          id: p.id,
          title: p.title,
          normalPrice: parseFloat(p.normal_price?.toString() ?? "0"),
          salePrice: p.sale_price
            ? parseFloat(p.sale_price.toString())
            : undefined,
          costPrice: parseFloat(p.cost_price?.toString() ?? "0"),
          stock: p.stock ?? 0,
        })
      );

      setProducts(transformedProducts);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate metrics
  const metrics = useMemo(() => {
    if (orders.length === 0 && products.length === 0) {
      return {
        totalRevenue: 0,
        totalSales: 0,
        pendingOrders: 0,
        totalProducts: 0,
        averageOrderValue: 0,
        last30DaysRevenue: 0,
        stockValue: 0,
      };
    }

    const completedOrders = orders.filter((o) => o.status === "completed");
    const totalRevenue = completedOrders.reduce(
      (sum, order) => sum + order.total,
      0
    );

    const totalSales = completedOrders.length;

    const pendingOrders = orders.filter((o) => o.status === "pending").length;

    const totalProducts = products.length;

    const averageOrderValue =
      totalSales > 0 ? totalRevenue / totalSales : 0;

    // Calculate revenue for last 30 days
    const now = new Date();
    const thirtyDaysAgo = new Date(
      now.getTime() - 30 * 24 * 60 * 60 * 1000
    );
    const last30DaysRevenue = completedOrders
      .filter((o) => new Date(o.createdAt) >= thirtyDaysAgo)
      .reduce((sum, order) => sum + order.total, 0);

    // Calculate stock value (cost price of all stock)
    const stockValue = products.reduce(
      (sum, product) => sum + product.costPrice * product.stock,
      0
    );

    return {
      totalRevenue,
      totalSales,
      pendingOrders,
      totalProducts,
      averageOrderValue,
      last30DaysRevenue,
      stockValue,
    };
  }, [orders, products]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const recentOrders = orders.slice(0, 5);

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl md:text-4xl text-black mb-1 ls-title">
            Dashboard Overview
          </h1>
          <p className="text-black/60 text-sm md:text-base">
            Key metrics and recent activity
          </p>
        </div>
        <div className="flex flex-wrap gap-3 md:justify-end">
          <button
            onClick={fetchData}
            className="h-10 px-4 rounded-xl bg-white border border-black/10 text-black text-sm font-medium hover:bg-black/5 transition-colors cursor-pointer"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A33D4A] mx-auto mb-4"></div>
          <p className="text-black/60">Loading dashboard data...</p>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-black/5"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">💰</span>
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
              +12%
            </span>
          </div>
          <p className="text-sm text-black/60 mb-1">Total Revenue</p>
          <p className="font-heading text-2xl text-black">
            {formatCurrency(metrics.totalRevenue)}
          </p>
          <p className="text-xs text-black/40 mt-2">Completed orders</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-black/5"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">📦</span>
            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
              {metrics.totalSales}
            </span>
          </div>
          <p className="text-sm text-black/60 mb-1">Total Sales</p>
          <p className="font-heading text-2xl text-black">{metrics.totalSales}</p>
          <p className="text-xs text-black/40 mt-2">Completed orders</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-black/5"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">⏳</span>
            <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
              {metrics.pendingOrders}
            </span>
          </div>
          <p className="text-sm text-black/60 mb-1">Pending Orders</p>
          <p className="font-heading text-2xl text-black">
            {metrics.pendingOrders}
          </p>
          <p className="text-xs text-black/40 mt-2">Requires attention</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-black/5"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">📦</span>
            <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded">
              {metrics.totalProducts}
            </span>
          </div>
          <p className="text-sm text-black/60 mb-1">Stock Value</p>
          <p className="font-heading text-2xl text-black">
            {formatCurrency(metrics.stockValue)}
          </p>
          <p className="text-xs text-black/40 mt-2">Cost of all inventory</p>
        </motion.div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-black/5"
        >
          <p className="text-sm text-black/60 mb-1">Average Order Value</p>
          <p className="font-heading text-3xl text-black">
            {formatCurrency(metrics.averageOrderValue)}
          </p>
          <p className="text-xs text-black/40 mt-2">Per completed order</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-black/5"
        >
          <p className="text-sm text-black/60 mb-1">Last 30 Days Revenue</p>
          <p className="font-heading text-3xl text-black">
            {formatCurrency(metrics.last30DaysRevenue)}
          </p>
          <p className="text-xs text-black/40 mt-2">Recent period</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-black/5"
        >
          <p className="text-sm text-black/60 mb-1">Total Products</p>
          <p className="font-heading text-3xl text-black">
            {metrics.totalProducts}
          </p>
          <p className="text-xs text-black/40 mt-2">Active products</p>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-black/5"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-2xl text-black">Recent Orders</h2>
          <Link
            href="/dashboard/orders"
            className="text-sm text-[#A33D4A] font-medium hover:underline cursor-pointer"
          >
            View all →
          </Link>
        </div>
        <div className="space-y-4">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-4 bg-black/5 rounded-xl"
            >
              <div>
                <p className="font-medium text-black">{order.orderNumber}</p>
                <p className="text-sm text-black/60">
                  {order.customerName} • {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-black">
                  {formatCurrency(order.total)}
                </p>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    order.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : order.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : order.status === "processing"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
