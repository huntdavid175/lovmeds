"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const HERO_IMAGE_URL = "/assets/images/store_products.png";

type ShopHeroProps = {
  title?: string;
  description?: string;
  imageUrl?: string;
};

export default function ShopHero({
  title = "Shop LovMeds",
  description,
  imageUrl = HERO_IMAGE_URL,
}: ShopHeroProps) {
  const container = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, staggerChildren: 0.15 },
    },
  };
  const item = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };
  const text = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.2 },
    },
  };

  return (
    <motion.section
      className="bg-white rounded-3xl mt-4 overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={container}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-stretch">
        <motion.div
          className="flex flex-col justify-center p-6 md:p-10"
          variants={item}
        >
          <motion.h1
            className="font-heading text-3xl md:text-6xl leading-tight tracking-tight text-black ls-title"
            variants={text}
          >
            {title}
          </motion.h1>
          {description && (
            <p className="mt-6 text-base md:text-lg text-black/60 max-w-2xl">
              {description}
            </p>
          )}
        </motion.div>

        <motion.div
          className="relative w-full h-full min-h-[280px] md:min-h-[320px] rounded-3xl md:rounded-3xl overflow-hidden"
          variants={item}
        >
          <Image
            src={imageUrl}
            alt="Shop LovMeds"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </motion.div>
      </div>
    </motion.section>
  );
}
