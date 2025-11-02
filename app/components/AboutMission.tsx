"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const HERO_IMAGE_URL =
  "https://framerusercontent.com/images/Mvmwy2meoLookZmy5qqLLsuZ9A.png?width=840&height=1200";

export default function AboutMission({
  text,
  imageUrl,
}: {
  text?: string;
  imageUrl?: string;
}) {
  const item = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };
  return (
    <motion.section
      className="mt-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">
        <motion.div
          className="bg-white rounded-3xl overflow-hidden p-6 md:p-10"
          initial={false}
          whileInView="visible"
          viewport={{ once: false, amount: 0.1, margin: "-80px 0px -80px 0px" }}
          variants={item}
        >
          <h1 className="font-heading text-5xl md:text-7xl leading-tight tracking-tight text-black ls-title">
            Our Mission
          </h1>
          {text ? (
            <div
              className="mt-6 text-base md:text-lg text-black/60 max-w-3xl"
              dangerouslySetInnerHTML={{ __html: text }}
            />
          ) : (
            <p className="mt-6 text-base md:text-lg text-black/60 max-w-3xl">
              To create effective, nourishing products that address real skin
              concerns by blending nature and science. We are committed to
              crafting solutions that cater to people of color, empowering our
              customers with the knowledge to make skincare simple and
              effective. We strive for continuous improvement, ensuring
              sustainability in everything we do to support both our customers
              and the planet.
            </p>
          )}
        </motion.div>

        <motion.div
          className="bg-white rounded-3xl overflow-hidden"
          initial={false}
          whileInView="visible"
          viewport={{ once: false, amount: 0.1, margin: "-80px 0px -80px 0px" }}
          variants={item}
        >
          <div className="relative w-full h-full min-h-[420px] md:min-h-[520px]">
            <Image
              src={imageUrl || HERO_IMAGE_URL}
              alt="Smiling person with healthy, glowing skin"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
