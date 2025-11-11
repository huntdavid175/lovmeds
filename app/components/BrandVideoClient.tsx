"use client";

import { motion } from "framer-motion";

export default function BrandVideoClient({
  videoUrl,
  titleHtml,
}: {
  videoUrl?: string;
  titleHtml?: string;
}) {
  return (
    <motion.section
      className="mt-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9 }}
    >
      <div className="relative rounded-3xl overflow-hidden">
        <video
          className="w-full h-[360px] md:h-[520px] object-cover"
          autoPlay
          muted
          loop
          playsInline
          src={videoUrl || "https://www.pexels.com/download/video/5657517/"}
        />
        <div className="pointer-events-none absolute inset-0 bg-black/50" />
        <motion.div
          className="absolute inset-0 flex items-center justify-center px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          <div
            className="font-heading text-white text-4xl md:text-6xl text-center leading-tight drop-shadow ls-title"
            role="heading"
            aria-level={3}
            dangerouslySetInnerHTML={{
              __html:
                titleHtml || "Empowering your most <br/>personal moments.",
            }}
          />
        </motion.div>
      </div>
    </motion.section>
  );
}
