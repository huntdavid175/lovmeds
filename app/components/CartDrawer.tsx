"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "./CartProvider";

export default function CartDrawer() {
  const { isOpen, close, items, updateQty, removeItem, subtotal } = useCart();
  const totalQty = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-[520px] bg-white shadow-xl flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35 }}
            role="dialog"
            aria-modal
          >
            <div className="flex items-center justify-between px-6 h-16 border-b">
              <div className="flex items-center gap-2">
                <div className="text-xl font-medium">Your Cart</div>
                <span className="inline-flex items-center justify-center h-7 min-w-7 px-2 rounded-full bg-black/5 text-black text-sm">
                  {totalQty}
                </span>
              </div>
              <button
                aria-label="Close"
                onClick={close}
                className="h-10 w-10 rounded-full border border-black/10 flex items-center justify-center"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-auto px-6">
              {items.map((it) => (
                <div key={it.id} className="py-6 border-t border-gray-200">
                  <div className="flex items-start gap-4">
                    <div className="relative h-28 w-28 rounded-2xl overflow-hidden shrink-0">
                      <Image
                        src={it.imageUrl}
                        alt={it.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <p className="font-heading text-xl text-black tracking-[-1px] font-medium">
                          {it.title}
                        </p>
                        <p className="text-black text-lg">
                          {new Intl.NumberFormat("en-GH", {
                            style: "currency",
                            currency: "GHS",
                          }).format(it.price * it.qty)}
                        </p>
                      </div>
                      <div className="mt-4 flex items-center gap-4">
                        <button
                          aria-label="Decrease"
                          onClick={() =>
                            updateQty(it.id, Math.max(1, it.qty - 1))
                          }
                          className="h-10 w-10 rounded-full border border-black/10 flex items-center justify-center"
                        >
                          –
                        </button>
                        <span className="text-lg">{it.qty}</span>
                        <button
                          aria-label="Increase"
                          onClick={() => updateQty(it.id, it.qty + 1)}
                          className="h-10 w-10 rounded-full border border-black/10 flex items-center justify-center"
                        >
                          +
                        </button>
                        <button
                          aria-label="Remove"
                          onClick={() => removeItem(it.id)}
                          className="ml-auto h-10 w-10 rounded-full border border-black/10 flex items-center justify-center"
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-lg">
                <span className="font-semibold tracking-[-1px]">Subtotal</span>
                <span className="font-semibold tracking-[-1px]">
                  {new Intl.NumberFormat("en-GH", {
                    style: "currency",
                    currency: "GHS",
                  }).format(subtotal)}
                </span>
              </div>
              <Link
                href="/checkout"
                onClick={close}
                className="mt-4 block w-full h-14 rounded-full bg-black hover:bg-[#111] text-white text-lg font-medium transition-colors flex items-center justify-center cursor-pointer"
              >
                Checkout
              </Link>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

