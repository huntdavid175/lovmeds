"use client";

import { createContext, useContext, useMemo, useState, ReactNode } from "react";

export type CartItem = {
  id: string;
  title: string;
  imageUrl: string;
  price: number; // per unit
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  addItem: (item: Omit<CartItem, "qty"> & { qty?: number }) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const addItem: CartContextValue["addItem"] = (item) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, qty: p.qty + (item.qty ?? 1) } : p
        );
      }
      return [
        ...prev,
        {
          id: item.id,
          title: item.title,
          imageUrl: item.imageUrl,
          price: item.price,
          qty: item.qty ?? 1,
        },
      ];
    });
    setIsOpen(true);
  };

  const removeItem = (id: string) =>
    setItems((prev) => {
      const next = prev.filter((p) => p.id !== id);
      if (next.length === 0) setIsOpen(false);
      return next;
    });

  const updateQty = (id: string, qty: number) =>
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, qty } : p)));

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [items]
  );

  const value: CartContextValue = {
    items,
    isOpen,
    open,
    close,
    addItem,
    removeItem,
    updateQty,
    subtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
