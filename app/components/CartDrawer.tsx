"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "./CartProvider";
import { checkoutStoreFromForm } from "@/app/actions/woocommerce";
import { useFormStatus } from "react-dom";

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
                          ${(it.price * it.qty).toFixed(2)}
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
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <form
                action={checkoutStoreFromForm}
                className="mt-4"
                onSubmit={(e) => {
                  if (totalQty === 0) e.preventDefault();
                }}
              >
                <input
                  type="hidden"
                  name="items"
                  value={JSON.stringify(
                    items.map((i) => ({ id: i.id, qty: i.qty }))
                  )}
                />
                <DrawerCheckoutButton />
              </form>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function DrawerCheckoutButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      aria-busy={pending}
      disabled={pending}
      className={`w-full h-14 rounded-full text-white text-lg transition-colors ${
        pending
          ? "bg-black/70 cursor-not-allowed"
          : "bg-black hover:bg-[#111] cursor-pointer"
      } flex items-center justify-center gap-2`}
    >
      {pending && (
        <svg
          className="animate-spin h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      )}
      <span>{pending ? "Processing..." : "Checkout"}</span>
    </button>
  );
}
