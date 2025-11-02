"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const HERO_IMAGE_URL =
  "https://framerusercontent.com/images/Mvmwy2meoLookZmy5qqLLsuZ9A.png?width=840&height=1200";

export default function AboutStory({
  text,
  imageUrl,
}: {
  text?: string;
  imageUrl?: string;
}) {
  return (
    <motion.section
      className="mt-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="font-heading text-5xl md:text-7xl text-black ls-title mb-6">
        Our Story
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-stretch">
        <motion.div
          className="relative w-full h-full min-h-[420px] md:min-h-[520px] rounded-3xl overflow-hidden"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <Image
            src={imageUrl || HERO_IMAGE_URL}
            alt="Founder portrait"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </motion.div>
        <motion.div
          className="text-black/60 text-base md:text-lg leading-relaxed md:leading-8"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          {text ? (
            <div dangerouslySetInnerHTML={{ __html: text }} />
          ) : (
            <>
              <p>
                Our journey started with a simple yet powerful mission: to
                provide high-quality skincare solutions for people of color. As
                a brand, we understand that melanin-rich skin requires unique
                care. Inspired by the challenge of finding effective products,
                we created a brand that blends nature and science to meet these
                needs head‑on.
              </p>
              <p className="mt-6">
                Born out of the desire to address concerns like
                hyperpigmentation, dryness, and acne, Revive Botanicals is a
                celebration of the power of botanicals. We carefully select
                ingredients that nourish, heal, and protect, ensuring every
                product is backed by research to deliver real, visible results.
              </p>
              <p className="mt-6">
                Our commitment goes beyond skincare—we empower our community
                with knowledge so everyone feels confident and informed in their
                routine. We believe skincare should be simple, effective, and
                sustainable.
              </p>
              <p className="mt-6">
                Every product we create is designed with care for both the skin
                and the planet, using eco‑friendly practices and striving for
                continuous improvement.
              </p>
            </>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
}
