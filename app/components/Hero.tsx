"use client";
import Image from "next/image";
import { motion } from "framer-motion";

const HERO_IMAGE_URL =
  "https://framerusercontent.com/images/20QD5xeVLKBmv7ucQrtU5RfOUU.png?width=1024&height=1536";

type HeroProps = {
  titleOverride?: string;
  imageOverride?: string;
  avatars?: string[];
};

export default function Hero({
  titleOverride,
  imageOverride,
  avatars,
}: HeroProps) {
  console.log(imageOverride);
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
      transition: { duration: 1.3 },
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
        {/* Left: Copy */}
        <motion.div
          className="flex flex-col justify-center p-6 md:p-10 items-center md:items-start"
          variants={item}
        >
          <motion.h1
            className="font-heading text-5xl md:text-7xl leading-tight tracking-tight text-black text-center md:text-left ls-title"
            variants={text}
          >
            {titleOverride ? (
              <span dangerouslySetInnerHTML={{ __html: titleOverride }} />
            ) : null}
          </motion.h1>

          <div className="mt-8 flex justify-center md:justify-start">
            <a
              href="#shop"
              className="inline-flex items-center justify-center rounded-full bg-[#6EA53A] text-white px-8 py-4 text-base font-medium transition-colors hover:bg-black"
            >
              Shop Now
            </a>
          </div>

          <div className="mt-8 flex items-center gap-4 justify-center md:justify-start">
            {/* Overlapping avatars */}
            <div className="flex -space-x-3">
              {(avatars && avatars.length ? avatars.slice(0, 4) : []).map(
                (src, i) => (
                  <div
                    key={i}
                    className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-white"
                  >
                    <Image
                      src={src}
                      alt="customer avatar"
                      fill
                      className="object-cover"
                    />
                  </div>
                )
              )}
              {!avatars?.length && (
                <>
                  <div className="h-10 w-10 rounded-full bg-[#0b0b0b] border-2 border-white"></div>
                  <div className="h-10 w-10 rounded-full bg-[#9f704d] border-2 border-white"></div>
                  <div className="h-10 w-10 rounded-full bg-[#caa189] border-2 border-white"></div>
                  <div className="h-10 w-10 rounded-full bg-[#6e3d2b] border-2 border-white"></div>
                </>
              )}
            </div>
            <span className="text-sm text-black/80">200+ happy customers</span>
          </div>
        </motion.div>

        {/* Right: Image */}
        <motion.div
          className="relative w-full h-full min-h-[440px] md:min-h-[640px] rounded-3xl overflow-hidden"
          variants={item}
        >
          <Image
            src={imageOverride || ""}
            alt="Smiling woman applying skincare cream"
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
