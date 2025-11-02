"use client";

import { motion } from "framer-motion";
import ProductCard from "./ProductCard";

type Item = {
  title: string;
  price: string;
  imageUrl: string;
  rating: number;
};

const FALLBACK_IMAGE =
  "https://framerusercontent.com/images/Mvmwy2meoLookZmy5qqLLsuZ9A.png?width=840&height=1200";

const DEFAULT_ITEMS: Item[] = [
  { title: "Face oil", price: "$15.50", imageUrl: FALLBACK_IMAGE, rating: 5 },
  {
    title: "Green Tea + Aloe Face Cleanser",
    price: "$35.00",
    imageUrl: FALLBACK_IMAGE,
    rating: 4,
  },
  {
    title: "Snail Mucin Radiance Cream",
    price: "$19.99",
    imageUrl: FALLBACK_IMAGE,
    rating: 5,
  },
  {
    title: "10% Niacinamide + NAG Serum",
    price: "$37.50",
    imageUrl: FALLBACK_IMAGE,
    rating: 5,
  },
];

export default function RecommendedProducts({ items }: { items?: Item[] }) {
  const list = items && items.length ? items : DEFAULT_ITEMS;

  return (
    <motion.section
      className="mt-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h3 className="font-heading text-4xl md:text-5xl text-black ls-title mb-8 md:mb-12">
        Other Products You Might Like
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-3 items-stretch">
        {list.map((p) => {
          const slug = p.title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .trim()
            .replace(/\s+/g, "-");
          return (
            <ProductCard
              key={p.title}
              title={p.title}
              price={p.price}
              imageUrl={p.imageUrl}
              rating={p.rating}
              href={`/shop/${slug}`}
            />
          );
        })}
      </div>
    </motion.section>
  );
}
