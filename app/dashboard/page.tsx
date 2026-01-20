"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: "pending" | "processing" | "completed" | "cancelled";
  total: number;
  items: Array<{ id: string; productName: string; quantity: number; price: number }>;
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

// Mock data - in real app, this would come from API
const MOCK_ORDERS: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-001",
    customerName: "John Doe",
    customerEmail: "john@example.com",
    status: "pending",
    total: 89.97,
    items: [
      { id: "1", productName: "Product A", quantity: 2, price: 29.99 },
      { id: "2", productName: "Product B", quantity: 1, price: 29.99 },
    ],
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    orderNumber: "ORD-002",
    customerName: "Jane Smith",
    customerEmail: "jane@example.com",
    status: "processing",
    total: 149.95,
    items: [
      { id: "3", productName: "Product C", quantity: 3, price: 49.98 },
    ],
    createdAt: "2024-01-14T14:20:00Z",
  },
  {
    id: "3",
    orderNumber: "ORD-003",
    customerName: "Bob Johnson",
    customerEmail: "bob@example.com",
    status: "completed",
    total: 59.98,
    items: [
      { id: "4", productName: "Product D", quantity: 2, price: 29.99 },
    ],
    createdAt: "2024-01-13T09:15:00Z",
  },
  {
    id: "4",
    orderNumber: "ORD-004",
    customerName: "Alice Williams",
    customerEmail: "alice@example.com",
    status: "completed",
    total: 199.96,
    items: [
      { id: "5", productName: "Product E", quantity: 4, price: 49.99 },
    ],
    createdAt: "2024-01-12T16:45:00Z",
  },
];

const MOCK_PRODUCTS: Product[] = [
  { id: "1", title: "Sample Product", normalPrice: 29.99, salePrice: 24.99, costPrice: 15.00, stock: 50 },
];

export default function DashboardOverview() {
  const [orders] = useState<Order[]>(MOCK_ORDERS);
  const [products] = useState<Product[]>(MOCK_PRODUCTS);

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalRevenue = orders
      .filter((o) => o.status === "completed")
      .reduce((sum, order) => sum + order.total, 0);

    const totalSales = orders.filter((o) => o.status === "completed").length;

    const pendingOrders = orders.filter((o) => o.status === "pending").length;

    const totalProducts = products.length;

    const averageOrderValue =
      totalSales > 0 ? totalRevenue / totalSales : 0;

    // Calculate revenue for last 30 days (mock - using all completed orders)
    const last30DaysRevenue = totalRevenue;

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
      <div className="mb-8">
        <h1 className="font-heading text-4xl md:text-5xl text-black mb-2 ls-title">
          Dashboard Overview
        </h1>
        <p className="text-black/60">Key metrics and recent activity</p>
      </div>

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
          <p className="text-xs text-black/40 mt-2">All time</p>
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
