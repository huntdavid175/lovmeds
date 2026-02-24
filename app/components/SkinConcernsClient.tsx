"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export type SkinConcernItem = { title: string; imageUrl: string; slug: string };

export default function SkinConcernsClient({
  title,
  items,
}: {
  title?: string;
  items: SkinConcernItem[];
}) {
  const container = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };
  const list = {
    hidden: {},
    visible: { transition: { delayChildren: 0.2, staggerChildren: 0.22 } },
  };
  const item = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.65 } },
  };

  return (
    <motion.section
      className="mt-24"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={container}
    >
      <h3 className="font-heading text-4xl md:text-5xl text-black mb-8 md:mb-12 ls-title">
        {title}
      </h3>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6"
        variants={list}
      >
        {items.map((c) => {
          // const slug = c.slug;
          const titleTransformed = c.title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .trim()
            .replace(/\s+/g, "-");

          return (
            <motion.div
              key={c.title}
              className="group relative rounded-3xl overflow-hidden"
              variants={item}
            >
              <Link
                href={`/collection/${titleTransformed}`}
                className="block relative rounded-3xl overflow-hidden"
              >
                <div className="relative h-[300px] md:h-[360px]">
                  <img
                    src={c.imageUrl}
                    alt={c.title}
                    className="w-full h-full object-cover blur-[2px] group-hover:blur-none transition-all duration-300 ease-out group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                </div>
                <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
                  <p className="text-white font-heading text-3xl md:text-4xl leading-none drop-shadow ls-title capitalize wrap-break-word">
                    {c.title}
                  </p>
                  <span className="h-10 w-10 rounded-full bg-[#A33D4A] text-white flex items-center justify-center">
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
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.section>
  );
}
