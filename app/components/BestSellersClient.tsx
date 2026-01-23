"use client";

import Link from "next/link";
import ProductCard from "./ProductCard";
import { motion } from "framer-motion";

export type BestSellerItem = {
  title: string;
  price: string; // formatted
  imageUrl: string;
  rating: number;
  productId?: number;
  slug?: string;
};

export default function BestSellersClient({
  items,
}: {
  items: BestSellerItem[];
}) {
  const container = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };
  const list = {
    hidden: {},
    visible: { transition: { delayChildren: 0.2, staggerChildren: 0.22 } },
  };
  const item = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65 },
    },
  };

  return (
    <motion.section
      className="mt-24 px-4 md:px-0"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={container}
    >
      <h3 className="font-heading text-3xl sm:text-4xl md:text-5xl text-black mb-6 md:mb-12 ls-title">
        Explore Our Best Sellers
      </h3>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-3 items-stretch"
        variants={list}
      >
        {items.map((p) => {
          const slug =
            p.slug ||
            p.title
              .toLowerCase()
              .replace(/[^a-z0-9\s-]/g, "")
              .trim()
              .replace(/\s+/g, "-");
          return (
            <motion.div key={`${p.title}-${p.price}`} variants={item}>
              <ProductCard
                title={p.title}
                price={p.price}
                imageUrl={p.imageUrl}
                rating={p.rating}
                productId={p.productId}
                href={`/shop/${slug}`}
              />
            </motion.div>
          );
        })}
      </motion.div>

      <div className="mt-10 flex justify-center">
        <Link
          href="/shop"
          className="inline-flex items-center justify-center rounded-full bg-[#A33D4A] text-white px-8 py-4 text-base font-medium transition-colors hover:bg-black"
        >
          See all product
        </Link>
      </div>
    </motion.section>
  );
}
