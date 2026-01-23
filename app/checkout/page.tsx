"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { useCart } from "@/app/components/CartProvider";
import { createOrderAndOpenWhatsApp } from "@/app/actions/checkout";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
  }).format(amount);
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
    shippingCity: "",
    shippingRegion: "",
    notes: "",
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push("/shop");
    }
  }, [items, router]);

  if (items.length === 0) {
    return null;
  }

  const shipping = 0; // Free shipping for now
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderData = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        shippingAddress: {
          street: formData.shippingAddress,
          city: formData.shippingCity,
          region: formData.shippingRegion,
        },
        notes: formData.notes,
        items: items.map((item) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          qty: item.qty,
        })),
        subtotal,
        shipping,
        total,
      };

      await createOrderAndOpenWhatsApp(orderData);
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Error processing order. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Summary */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-black/5 p-6 md:p-8"
            >
              <h1 className="text-3xl md:text-4xl font-heading text-black mb-8">
                Checkout
              </h1>

              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
                {/* Contact Information */}
                <section>
                  <h2 className="text-xl font-semibold text-black mb-4">
                    Contact Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.customerName}
                        onChange={(e) =>
                          setFormData({ ...formData, customerName: e.target.value })
                        }
                        className="w-full h-12 px-4 rounded-xl border border-black/10 bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#A33D4A] focus:border-transparent"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.customerEmail}
                          onChange={(e) =>
                            setFormData({ ...formData, customerEmail: e.target.value })
                          }
                          className="w-full h-12 px-4 rounded-xl border border-black/10 bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#A33D4A] focus:border-transparent"
                          placeholder="john@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.customerPhone}
                          onChange={(e) =>
                            setFormData({ ...formData, customerPhone: e.target.value })
                          }
                          className="w-full h-12 px-4 rounded-xl border border-black/10 bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#A33D4A] focus:border-transparent"
                          placeholder="+233 XX XXX XXXX"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Shipping Address */}
                <section>
                  <h2 className="text-xl font-semibold text-black mb-4">
                    Shipping Address
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.shippingAddress}
                        onChange={(e) =>
                          setFormData({ ...formData, shippingAddress: e.target.value })
                        }
                        className="w-full h-12 px-4 rounded-xl border border-black/10 bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#A33D4A] focus:border-transparent"
                        placeholder="123 Main Street"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.shippingCity}
                          onChange={(e) =>
                            setFormData({ ...formData, shippingCity: e.target.value })
                          }
                          className="w-full h-12 px-4 rounded-xl border border-black/10 bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#A33D4A] focus:border-transparent"
                          placeholder="Accra"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-black mb-2">
                          Region *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.shippingRegion}
                          onChange={(e) =>
                            setFormData({ ...formData, shippingRegion: e.target.value })
                          }
                          className="w-full h-12 px-4 rounded-xl border border-black/10 bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#A33D4A] focus:border-transparent"
                          placeholder="Greater Accra"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Order Notes */}
                <section>
                  <label className="block text-sm font-medium text-black mb-2">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-black/10 bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#A33D4A] focus:border-transparent resize-none"
                    placeholder="Special delivery instructions, gift message, etc."
                  />
                </section>
              </form>
            </motion.div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-black/5 p-6 md:p-8 sticky top-8"
            >
              <h2 className="text-xl font-semibold text-black mb-6">
                Order Summary
              </h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-black/5 flex-shrink-0">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-black/40 text-xs">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-black text-sm line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-black/60 mt-1">
                        Qty: {item.qty}
                      </p>
                      <p className="text-sm font-semibold text-black mt-1">
                        {formatCurrency(item.price * item.qty)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="border-t border-black/10 pt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-black/70">Subtotal</span>
                  <span className="text-black font-medium">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-black/70">Shipping</span>
                  <span className="text-black font-medium">
                    {shipping === 0 ? "Free" : formatCurrency(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-3 border-t border-black/10">
                  <span className="text-black">Total</span>
                  <span className="text-black">{formatCurrency(total)}</span>
                </div>
              </div>

              {/* WhatsApp Checkout Button (desktop) */}
              <button
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                className="hidden md:flex w-full mt-6 h-14 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold text-lg transition-colors items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    <span>Checkout with WhatsApp</span>
                  </>
                )}
              </button>

              <p className="hidden md:block text-xs text-black/50 text-center mt-4">
                You will be redirected to WhatsApp to complete your order
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile fixed checkout bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-black/10 bg-white/95 backdrop-blur px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-black/60">Total</p>
            <p className="text-lg font-semibold text-black">
              {formatCurrency(total)}
            </p>
          </div>
          <button
            type="submit"
            form="checkout-form"
            disabled={isSubmitting}
            className="flex-1 h-12 rounded-full bg-[#25D366] hover:bg-[#20BA5A] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>Checkout with WhatsApp</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
