"use client";

import { useMemo, useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { motion } from "framer-motion";

export type ClientProduct = {
  title: string;
  price: string;
  imageUrl: string;
  rating: number;
  categoryKeys: string[];
  productId?: number;
  slug?: string;
};

export type FilterOption = { key: string; label: string };

export default function ShopGridClient({
  products,
  filters,
}: {
  products: ClientProduct[];
  filters: FilterOption[]; // includes { key: 'all', label: 'All' }
}) {
  const [filterKey, setFilterKey] = useState<string>(filters[0]?.key || "all");
  // Show at least 3 rows: 12 items (3 rows × 4 cols on xl screens)
  const [visible, setVisible] = useState(12);

  const items = useMemo(() => {
    if (filterKey === "all") return products;
    const key = filterKey.toLowerCase();
    return products.filter((p) =>
      (p.categoryKeys || []).some((k) => (k || "").toLowerCase() === key)
    );
  }, [filterKey, products]);

  useEffect(() => {
    setVisible(12); // Reset to 12 items (3 rows) when filter changes
  }, [filterKey]);

  return (
    <motion.section
      className="mt-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9 }}
    >
      {/* Filter pills */}
      <motion.div
        className="flex flex-wrap gap-4 justify-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        {filters.map((f) => {
          const active = f.key === filterKey;
          return (
            <button
              key={f.key}
              onClick={() => setFilterKey(f.key)}
              className={
                active
                  ? "px-8 h-12 rounded-full bg-[#A33D4A] text-white"
                  : "px-8 h-12 rounded-full bg-white border border-black/10 text-black"
              }
            >
              <span className="capitalize">{f.label}</span>
            </button>
          );
        })}
      </motion.div>

      {/* Grid */}
      <motion.div
        className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.12 } },
        }}
      >
        {items.slice(0, visible).map((p) => {
          const slug =
            p.slug ||
            p.title
              .toLowerCase()
              .replace(/[^a-z0-9\s-]/g, "")
              .trim()
              .replace(/\s+/g, "-");
          return (
            <motion.div
              key={`${p.title}-${p.price}`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <ProductCard
                title={p.title}
                price={p.price}
                imageUrl={p.imageUrl}
                rating={p.rating}
                productId={p.productId}
                hoverCart={true}
                href={`/shop/${slug}`}
              />
            </motion.div>
          );
        })}
      </motion.div>

      {visible < items.length && items.length > 0 && (
        <div className="mt-10 flex justify-center">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setVisible((v) => Math.min(v + 12, items.length))}
            className="inline-flex items-center justify-center rounded-full bg-[#A33D4A] text-white px-8 py-4 text-base font-medium transition-colors hover:bg-black"
          >
            Load More
          </motion.button>
        </div>
      )}
    </motion.section>
  );
}
