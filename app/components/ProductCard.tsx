"use client";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartProvider";

type ProductCardProps = {
  title: string;
  price: string; // formatted with $ for now
  imageUrl: string;
  rating: number; // 0-5
  hoverCart?: boolean; // when true, stars swap to Add to Cart on hover
  href?: string; // link to product detail for arrow button
  productId?: number; // numeric Woo product id for checkout
};

export default function ProductCard({
  title,
  price,
  imageUrl,
  rating,
  hoverCart = true,
  href,
  productId,
}: ProductCardProps) {
  const { addItem } = useCart();
  const priceNum = Number((price || "").replace(/[^0-9.]/g, ""));
  return (
    <div className="group bg-white rounded-3xl shadow-sm  overflow-hidden p-4 flex flex-col h-full">
      <div className="relative w-full h-[260px] md:h-[280px] rounded-2xl overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
        />
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-black text-xl md:text-2xl font-heading font-medium leading-tight ls-tight">
            {title}
          </p>
        </div>
        <p className="text-black/80 text-lg md:text-xl font-medium shrink-0">
          {price}
        </p>
      </div>
      <div className="flex-1" />
      <div
        className={`mt-16 relative ${
          hoverCart ? "h-14" : "h-10"
        } overflow-hidden`}
      >
        <div
          className={`absolute left-0 right-14 bottom-0 h-10 flex items-center gap-1 text-[#F0B429] ${
            hoverCart
              ? "transition-all duration-500 ease-out will-change-transform group-hover:-translate-y-8 group-hover:opacity-0"
              : ""
          }`}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill={i < rating ? "currentColor" : "#E2E8F0"}
              aria-hidden
            >
              <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.786 1.402 8.168L12 18.896l-7.336 3.869 1.402-8.168L.132 9.211l8.2-1.193z" />
            </svg>
          ))}
        </div>
        {hoverCart && (
          <button
            onClick={() =>
              addItem({
                id: productId
                  ? String(productId)
                  : title
                      .toLowerCase()
                      .replace(/[^a-z0-9\s-]/g, "")
                      .trim()
                      .replace(/\s+/g, "-"),
                title,
                imageUrl,
                price: priceNum,
                qty: 1,
              })
            }
            className="absolute left-0 right-14 bottom-0 h-10 px-6 translate-y-14 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out rounded-full border border-black/10 text-black hover:bg-black hover:text-white cursor-pointer"
          >
            Add to Cart
          </button>
        )}
        {href ? (
          <Link
            href={href}
            aria-label="Open product"
            className="absolute right-0 bottom-0 h-10 w-10 rounded-full bg-[#A33D4A] text-white flex items-center justify-center"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14"></path>
              <path d="M12 5l7 7-7 7"></path>
            </svg>
          </Link>
        ) : (
          <button
            aria-label="Open product"
            className="absolute right-0 bottom-0 h-10 w-10 rounded-full bg-[#A33D4A] text-white flex items-center justify-center"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14"></path>
              <path d="M12 5l7 7-7 7"></path>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
