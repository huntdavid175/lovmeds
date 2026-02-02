"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type PromoBannerClientProps = {
  message: string;
  linkUrl?: string;
  linkText?: string;
  backgroundColor: string;
  textColor: string;
};

export default function PromoBannerClient({
  message,
  linkUrl,
  linkText,
  backgroundColor,
  textColor,
}: PromoBannerClientProps) {
  const content = (
    <div className="flex items-center justify-center gap-2">
      <span>{message}</span>
      {linkUrl && linkText && (
        <Link
          href={linkUrl}
          className="underline font-medium hover:opacity-80 transition-opacity"
          style={{ color: textColor }}
        >
          {linkText}
        </Link>
      )}
    </div>
  );

  return (
    <motion.div
      className="text-center text-sm py-2 px-4"
      style={{
        backgroundColor,
        color: textColor,
      }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {content}
    </motion.div>
  );
}
