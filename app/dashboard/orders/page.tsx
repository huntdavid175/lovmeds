"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type OrderItem = {
  id: string;
  productName: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: "pending" | "processing" | "completed" | "cancelled";
  total: number;
  items: OrderItem[];
  createdAt: string;
};

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
];

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  processing: "bg-blue-100 text-blue-800 border-blue-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((order) => order.status === filter);

  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
    }).format(amount);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-4xl md:text-5xl text-black mb-2 ls-title">
            Orders
          </h1>
          <p className="text-black/60">Manage customer orders</p>
        </div>
      </div>

      {/* Filters and View Toggle */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex gap-3 flex-wrap">
          {["all", "pending", "processing", "completed", "cancelled"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  filter === status
                    ? "bg-[#A33D4A] text-white"
                    : "bg-white border border-black/10 text-black hover:bg-black/5"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            )
          )}
        </div>
        <div className="flex items-center gap-2 bg-white border border-black/10 rounded-xl p-1">
          <button
            onClick={() => setViewMode("cards")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              viewMode === "cards"
                ? "bg-[#A33D4A] text-white"
                : "text-black/60 hover:text-black"
            }`}
          >
            Cards
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              viewMode === "table"
                ? "bg-[#A33D4A] text-white"
                : "text-black/60 hover:text-black"
            }`}
          >
            Table
          </button>
        </div>
      </div>

      {/* Orders List - Cards View */}
      {viewMode === "cards" && (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-black/5"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <h3 className="font-heading text-xl text-black">
                    {order.orderNumber}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-medium border ${STATUS_COLORS[order.status]}`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-black/60 text-sm">
                  {order.customerName} • {order.customerEmail}
                </p>
                <p className="text-black/40 text-xs mt-1">
                  {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-heading text-2xl text-black">
                  {formatCurrency(order.total)}
                </p>
                <p className="text-black/40 text-xs">
                  {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="border-t border-black/10 pt-4 mt-4">
              <div className="mb-4">
                <p className="text-xs text-black/50 mb-2">Order Items:</p>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-black/70">
                        {item.productName} × {item.quantity}
                      </span>
                      <span className="text-black font-medium">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <select
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(order.id, e.target.value as Order["status"])
                  }
                  className="flex-1 h-10 px-4 rounded-lg border border-black/10 bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-[#A33D4A] focus:border-transparent cursor-pointer"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="px-4 h-10 rounded-lg border border-black/10 text-black text-sm font-medium hover:bg-black/5 transition-colors cursor-pointer"
                >
                  View Details
                </button>
              </div>
            </div>
          </motion.div>
          ))}
        </div>
      )}

      {/* Orders Table View */}
      {viewMode === "table" && (
        <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/5">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-black/60 uppercase tracking-wider">
                    Order #
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-black/60 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-black/60 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-black/60 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-black/60 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-black/60 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-black/60 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-black/5 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-black">
                        {order.orderNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-black">
                          {order.customerName}
                        </p>
                        <p className="text-xs text-black/60">
                          {order.customerEmail}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-black/70">
                        {formatDate(order.createdAt)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-black/70">
                        {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-black">
                        {formatCurrency(order.total)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(
                            order.id,
                            e.target.value as Order["status"]
                          )
                        }
                        className={`px-3 py-1 rounded-lg text-xs font-medium border cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#A33D4A] focus:border-transparent ${STATUS_COLORS[order.status]}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-sm text-[#A33D4A] font-medium hover:underline cursor-pointer"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-black/60">No orders found</p>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-3xl text-black">
                Order {selectedOrder.orderNumber}
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="h-10 w-10 rounded-full border border-black/10 flex items-center justify-center hover:bg-black/5 transition-colors cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-black/50 mb-2">
                  Customer Information
                </h3>
                <div className="bg-black/5 rounded-xl p-4">
                  <p className="text-black font-medium">{selectedOrder.customerName}</p>
                  <p className="text-black/60 text-sm">{selectedOrder.customerEmail}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-black/50 mb-2">
                  Order Items
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 bg-black/5 rounded-xl"
                    >
                      <div>
                        <p className="text-black font-medium">{item.productName}</p>
                        <p className="text-black/60 text-sm">
                          Quantity: {item.quantity} × {formatCurrency(item.price)}
                        </p>
                      </div>
                      <p className="text-black font-semibold">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-black/10 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium text-black">Total</span>
                  <span className="font-heading text-2xl text-black">
                    {formatCurrency(selectedOrder.total)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Order Status
                </label>
                <select
                  value={selectedOrder.status}
                  onChange={(e) =>
                    handleStatusChange(
                      selectedOrder.id,
                      e.target.value as Order["status"]
                    )
                  }
                  className="w-full h-12 px-4 rounded-xl border border-black/10 bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#A33D4A] focus:border-transparent cursor-pointer"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
