"use client";

import Benefits from "@/app/components/Benefits";
import ProductCard from "@/app/components/ProductCard";
import Image from "next/image";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/app/components/CartProvider";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { id?: string };
}): Promise<Metadata> {
  const slug = typeof params?.id === "string" ? params.id : "";
  const pretty = slug
    ? slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    : "Product";
  return { title: `${pretty} | Revive Botanicals` };
}

type Media = { type: "image" | "video"; src: string };

type Product = {
  id: string;
  title: string;
  price: number;
  category: string;
  description: string;
  media: Media[];
  ingredients?: string[];
};

const HERO_IMAGE_URL =
  "https://framerusercontent.com/images/Mvmwy2meoLookZmy5qqLLsuZ9A.png?width=840&height=1200";

const MOCK_PRODUCTS: Product[] = [
  {
    id: "blemish-control-bundle",
    title: "Blemish Control Bundle",
    price: 120,
    category: "Blemishes",
    description:
      "Blemish Control Bundle offers a cleansing gel, serum, and cream to target blemishes with natural ingredients for radiant, hydrated skin. Ideal for all skin types.",
    media: [
      { type: "image", src: HERO_IMAGE_URL },
      { type: "image", src: HERO_IMAGE_URL },
      { type: "video", src: "https://www.pexels.com/download/video/8141584/" },
      { type: "image", src: HERO_IMAGE_URL },
    ],
    ingredients: [
      "Green Tea Extract",
      "Aloe Vera",
      "Niacinamide",
      "Hyaluronic Acid",
    ],
  },
];

const RECOMMENDED = [
  { title: "Face oil", price: "$15.50", imageUrl: HERO_IMAGE_URL, rating: 5 },
  {
    title: "Green Tea + Aloe Face Cleanser",
    price: "$35.00",
    imageUrl: HERO_IMAGE_URL,
    rating: 4,
  },
  {
    title: "Snail Mucin Radiance Cream",
    price: "$19.99",
    imageUrl: HERO_IMAGE_URL,
    rating: 5,
  },
  {
    title: "10% Niacinamide + NAG Serum",
    price: "$37.50",
    imageUrl: HERO_IMAGE_URL,
    rating: 5,
  },
];

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = useMemo(() => {
    return MOCK_PRODUCTS.find((p) => p.id === params.id) ?? MOCK_PRODUCTS[0];
  }, [params.id]);

  const [mainIndex, setMainIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [open, setOpen] = useState(false);
  const { addItem } = useCart();

  const container = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, staggerChildren: 0.12 },
    },
  };
  const item = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <main className="max-w-[1498px]  mx-auto md:px-6 px-4 pb-16">
      <motion.section
        className="mt-4"
        initial="hidden"
        animate="visible"
        variants={container}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-start">
          {/* Left: Gallery (no card) */}
          <motion.div variants={item}>
            <div className="grid grid-cols-[72px_1fr] gap-4 items-start">
              {/* Thumbnails */}
              <div className="flex flex-col gap-4">
                {product.media.map((m, i) => (
                  <button
                    key={i}
                    onClick={() => setMainIndex(i)}
                    className={`relative h-[84px] w-[84px] rounded-2xl overflow-hidden ${
                      mainIndex === i
                        ? "border-2 border-black"
                        : "border border-black/10"
                    }`}
                    aria-label={`View image ${i + 1}`}
                  >
                    {m.type === "image" ? (
                      <Image
                        src={m.src}
                        alt="thumbnail"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <>
                        <video
                          src={m.src}
                          className="h-full w-full object-cover"
                          muted
                        />
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="h-8 w-8 rounded-full bg-black/60 text-white flex items-center justify-center">
                            ▶
                          </span>
                        </span>
                      </>
                    )}
                  </button>
                ))}
              </div>
              {/* Main image */}
              <motion.div
                key={mainIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35 }}
                className="relative w-full h-[520px] md:h-[640px] rounded-3xl overflow-hidden"
              >
                {product.media[mainIndex]?.type === "image" ? (
                  <Image
                    src={product.media[mainIndex]?.src}
                    alt={product.title}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <video
                    key={product.media[mainIndex]?.src}
                    src={product.media[mainIndex]?.src}
                    className="h-full w-full object-cover"
                    controls
                    autoPlay
                    muted
                    playsInline
                  />
                )}
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Details card */}
          <motion.div
            className="bg-white rounded-3xl p-6 md:p-10"
            variants={item}
          >
            <p className="text-black/50 text-sm mb-2">{product.category}</p>
            <h1 className="font-heading text-4xl md:text-6xl text-black ls-title">
              {product.title}
            </h1>
            <p className="mt-4 text-2xl md:text-3xl font-medium text-black">
              ${product.price}
            </p>
            <p className="mt-6 text-black/60 md:text-lg">
              {product.description}
            </p>

            {/* Quantity */}
            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center gap-3">
                <button
                  aria-label="Decrease quantity"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="h-10 w-10 rounded-full border border-black/10 flex items-center justify-center"
                >
                  –
                </button>
                <span className="text-lg">{qty}</span>
                <button
                  aria-label="Increase quantity"
                  onClick={() => setQty((q) => q + 1)}
                  className="h-10 w-10 rounded-full border border-black/10 flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() =>
                  addItem({
                    id: product.id,
                    title: product.title,
                    imageUrl: product.media[0]?.src ?? "",
                    price: product.price,
                    qty,
                  })
                }
                className="h-14 rounded-full bg-[#6EA53A] text-white text-lg"
              >
                Add to Cart
              </button>
              <button className="h-14 rounded-full bg-black text-white text-lg">
                Buy Now
              </button>
            </div>

            {/* Ingredients accordion */}
            <div className="mt-10 border-t border-black/10 pt-6">
              <button
                onClick={() => setOpen((v) => !v)}
                className="w-full flex items-center justify-between text-left"
                aria-expanded={open}
              >
                <span className="text-black text-lg font-medium">
                  Ingredients
                </span>
                <span className="h-8 w-8 rounded-full border border-black/10 flex items-center justify-center">
                  {open ? "–" : "+"}
                </span>
              </button>
              {open && product.ingredients && (
                <ul className="mt-4 list-disc pl-6 text-black/70">
                  {product.ingredients.map((ing) => (
                    <li key={ing}>{ing}</li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </div>
      </motion.section>

      <Benefits />

      {/* Other products you might like */}
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
          {RECOMMENDED.map((p) => {
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
    </main>
  );
}
