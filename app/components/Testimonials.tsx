"use client";

import { useMemo, useState } from "react";
import { Inter } from "next/font/google";
import { motion } from "framer-motion";

const inter = Inter({ subsets: ["latin"] });

type Testimonial = { quote: string; author: string };

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "I was honestly nervous about buying intimate products online, but LovMeds made it so easy. The packaging was completely discreet, and delivery was fast. I’ll definitely order again!",
    author: "Anonymous Buyer",
  },
  {
    quote:
      "LovMeds really came through for me. I got my enhancers right on time, and let’s just say—my confidence went through the roof. No stress, no judgment, just results.",
    author: "Anonymous Buyer",
  },
  {
    quote:
      "My partner and I tried one of their couple’s kits, and it honestly brought a new spark to our nights. Everything felt classy and high quality — not awkward at all.",
    author: "Anonymous Buyer",
  },
  {
    quote:
      "I love that they have products made for women’s intimate care, not just men. I finally found a brand that gets it — discreet, gentle, and super effective.",
    author: "Anonymous Buyer",
  },
];

function chunk<T>(arr: T[], size: number): T[][] {
  const res: T[][] = [];
  for (let i = 0; i < arr.length; i += size) res.push(arr.slice(i, i + size));
  return res;
}

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);

  // Build logical pairs; we will keep the cards static and only change their content with a fade.
  const pairs = useMemo(() => chunk(TESTIMONIALS, 2), []);
  const count = pairs.length;

  const go = (dir: -1 | 1) => {
    setFading(true);
    window.setTimeout(() => {
      setIndex((i) => (i + dir + count) % count);
      setFading(false);
    }, 280);
  };

  const prev = () => go(-1);
  const next = () => go(1);

  return (
    <motion.section
      className="mt-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
    >
      <div className="flex items-center justify-between mb-6 md:mb-10">
        <h3 className="font-heading text-4xl md:text-5xl text-black ls-title">
          What Our Customers Say
        </h3>
        <div className="hidden md:flex items-center gap-3">
          <button
            aria-label="Previous"
            onClick={prev}
            className="h-10 w-10 rounded-full border border-black/10 flex items-center justify-center"
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
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            aria-label="Next"
            onClick={next}
            className="h-10 w-10 rounded-full border border-black/10 flex items-center justify-center"
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
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pairs[index].map((t, tIdx) => (
          <motion.div
            key={`${index}-${tIdx}`}
            className="bg-white rounded-3xl p-6 md:p-12 shadow-sm ring-1 ring-black/5 h-[300px] md:h-[340px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div
              className={`h-full flex flex-col justify-between transition-all duration-300 ease-out ${
                fading ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
              }`}
            >
              <blockquote
                className={`${inter.className} ls-tight text-center text-lg md:text-2xl text-black/80 leading-relaxed`}
              >
                <span
                  style={{ letterSpacing: "-1.5px", display: "inline-block" }}
                >
                  {`"${t.quote}"`}
                </span>
              </blockquote>
              <p className="mt-8 text-center font-heading text-2xl text-black">
                {t.author}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mobile controls duplicate for accessibility */}
      <div className="flex md:hidden items-center justify-center gap-3 mt-6">
        <button
          aria-label="Previous"
          onClick={prev}
          className="h-10 w-10 rounded-full border border-black/10 flex items-center justify-center"
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
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          aria-label="Next"
          onClick={next}
          className="h-10 w-10 rounded-full border border-black/10 flex items-center justify-center"
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
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </motion.section>
  );
}
