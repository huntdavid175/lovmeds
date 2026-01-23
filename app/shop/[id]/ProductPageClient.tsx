"use client";
import ProductCard from "@/app/components/ProductCard";
import RecommendedProducts from "@/app/components/RecommendedProducts";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { motion } from "framer-motion";
import { useCart } from "@/app/components/CartProvider";
import { checkoutStoreFromForm } from "@/app/actions/woocommerce";

type Media = { type: "image" | "video"; src: string };

type Variant = {
  name: string;
  price: number;
  salePrice?: number;
};

type Product = {
  id: string;
  title: string;
  price: number;
  normalPrice?: number;
  salePrice?: number;
  category: string;
  description: string;
  media: Media[];
  numericId?: number;
  stock?: number;
  variants?: Variant[];
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
  }).format(amount);
};

export default function ProductPageClient({
  id,
  product: productProp,
}: {
  id: string;
  product?: Product;
}) {
  const product = useMemo(() => {
    if (!productProp) {
      return null;
    }
    return productProp;
  }, [productProp]);

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-black/60">Product not found</p>
      </div>
    );
  }

  const displayPrice = product.salePrice ?? product.price;
  const hasSale = product.salePrice !== undefined;

  const [mainIndex, setMainIndex] = useState(0);
  const [qty, setQty] = useState(1);
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
    <>
      <motion.section
        className="mt-4"
        initial="hidden"
        animate="visible"
        variants={container}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-start">
          {/* Left: Gallery (no card) */}
          <motion.div variants={item}>
            {product.media && product.media.length > 0 ? (
              <>
                {/* Mobile: thumbnails below main image */}
                <div className="md:hidden flex flex-col gap-4 items-stretch">
                  <motion.div
                    key={mainIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.35 }}
                    className="relative w-full h-[520px] rounded-3xl overflow-hidden bg-black/5"
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
                      <div className="w-full h-full flex items-center justify-center text-black/40">
                        No image
                      </div>
                    )}
                  </motion.div>
                  {product.media.length > 1 && (
                    <div className="flex gap-4 overflow-x-auto pt-1">
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
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="h-8 w-8 rounded-full bg-black/60 text-white flex items-center justify-center">
                          ▶
                        </span>
                      </span>
                    )}
                      </button>
                      ))}
                    </div>
                  )}
                </div>
                {/* Desktop: thumbnails on the left of the main image */}
                <div className="hidden md:grid md:grid-cols-[72px_1fr] gap-4 items-start">
                  {product.media.length > 1 && (
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
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="h-8 w-8 rounded-full bg-black/60 text-white flex items-center justify-center">
                          ▶
                        </span>
                      </span>
                        )}
                      </button>
                      ))}
                    </div>
                  )}
                  <motion.div
                    key={mainIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.35 }}
                    className={`relative w-full h-[640px] rounded-3xl overflow-hidden bg-black/5 ${
                      product.media.length > 1 ? "" : "md:col-span-2"
                    }`}
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
                      <div className="w-full h-full flex items-center justify-center text-black/40">
                        No image
                      </div>
                    )}
                  </motion.div>
                </div>
              </>
            ) : (
              <div className="relative w-full h-[520px] md:h-[640px] rounded-3xl overflow-hidden bg-black/5 flex items-center justify-center">
                <span className="text-black/40">No image available</span>
              </div>
            )}
          </motion.div>

          {/* Right: Details card */}
          <motion.div
            className="bg-white rounded-3xl p-6 md:p-10"
            variants={item}
          >
            {product.category && (
              <p className="text-black/50 text-base mb-2">{product.category}</p>
            )}
            <h1 className="font-heading text-4xl md:text-6xl text-black ls-title">
              {product.title}
            </h1>
            <div className="mt-4 flex items-center gap-3">
              <p className="text-2xl md:text-3xl font-medium text-black">
                {formatCurrency(displayPrice)}
              </p>
              {hasSale && product.normalPrice && (
                <p className="text-lg text-black/40 line-through">
                  {formatCurrency(product.normalPrice)}
                </p>
              )}
            </div>
            {product.stock !== undefined && (
              <p className="mt-2 text-sm text-black/60">
                {product.stock > 0 ? (
                  <span className="text-green-600">In Stock ({product.stock} available)</span>
                ) : (
                  <span className="text-red-600">Out of Stock</span>
                )}
              </p>
            )}
            {product.description && (
              <p className="mt-6 text-black/60 md:text-lg">
                {product.description}
              </p>
            )}

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="mt-8">
                <label className="block text-sm font-medium text-black mb-3">
                  Select Variant
                </label>
                <div className="space-y-2">
                  {product.variants.map((variant, index) => {
                    const variantPrice = variant.salePrice ?? variant.price;
                    return (
                      <button
                        key={index}
                        className="w-full text-left p-4 rounded-xl border border-black/10 hover:border-[#A33D4A] transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-black">{variant.name}</span>
                          <span className="text-black/70">{formatCurrency(variantPrice)}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mt-8 flex items-center gap-4">
              <label className="text-sm font-medium text-black">Quantity:</label>
              <div className="flex items-center gap-3">
                <button
                  aria-label="Decrease quantity"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="h-10 w-10 rounded-full border border-black/10 flex items-center justify-center hover:bg-black/5 transition-colors cursor-pointer"
                >
                  –
                </button>
                <span className="text-lg w-8 text-center">{qty}</span>
                <button
                  aria-label="Increase quantity"
                  onClick={() => setQty((q) => Math.min(product.stock || 999, q + 1))}
                  disabled={product.stock !== undefined && qty >= product.stock}
                  className="h-10 w-10 rounded-full border border-black/10 flex items-center justify-center hover:bg-black/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
                    id: String(product.numericId ?? product.id),
                    title: product.title,
                    imageUrl: product.media[0]?.src ?? "",
                    price: displayPrice,
                    qty,
                  })
                }
                disabled={product.stock !== undefined && product.stock === 0}
                className="h-14 rounded-full bg-[#A33D4A] hover:bg-[#8E3540] disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer text-white text-lg transition-colors"
              >
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
              <form action={checkoutStoreFromForm} className="contents">
                <input
                  type="hidden"
                  name="items"
                  value={JSON.stringify([
                    { id: String(product.numericId ?? product.id), qty },
                  ])}
                />
                <CheckoutSubmitButton disabled={product.stock !== undefined && product.stock === 0} />
              </form>
            </div>

            {/* Ingredients accordion – omitted to keep client file focused */}
          </motion.div>
        </div>
      </motion.section>
    </>
  );
}

function CheckoutSubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();
  const isDisabled = pending || disabled;
  return (
    <button
      type="submit"
      aria-busy={pending}
      disabled={isDisabled}
      className={`h-14 rounded-full text-white text-lg transition-colors ${
        isDisabled
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
      <span>{pending ? "Processing..." : "Buy Now"}</span>
    </button>
  );
}
