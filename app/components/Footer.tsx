"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-24 bg-[#151515] text-white">
      <div className="max-w-[1498px] mx-auto px-6 py-16">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Left: Brand and signup */}
          <div className="lg:col-span-2">
            <p className="font-heading text-lg tracking-wider">LOVMEDS</p>
            <p className="mt-6 text-base text-white/80">
              Join our VIP list to receive exclusive discounts and product
              updates.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-stretch gap-4">
              <div className="w-full sm:w-[520px]">
                <div className="h-14 w-full rounded-full border border-white/25 bg-transparent px-6 flex items-center text-white/80">
                  <input
                    type="email"
                    placeholder="name@email.com"
                    className="w-full bg-transparent outline-none placeholder-white/50"
                  />
                </div>
              </div>
              <button className="h-14 px-8 rounded-full bg-white text-black text-lg cursor-pointer">
                Subscribe
              </button>
            </div>

            {/* Socials */}
            <div className="mt-8 flex items-center gap-4">
              {/* Instagram */}
              <a
                href="#"
                aria-label="Instagram"
                className="h-12 w-12 rounded-full border border-white/25 flex items-center justify-center"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.5" y2="6.5"></line>
                </svg>
              </a>
              {/* Facebook */}
              <a
                href="#"
                aria-label="Facebook"
                className="h-12 w-12 rounded-full border border-white/25 flex items-center justify-center"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.8V12h2.6V9.7c0-2.6 1.5-4 3.8-4 1.1 0 2.3.2 2.3.2v2.6h-1.3c-1.3 0-1.7.8-1.7 1.6V12h2.9l-.5 2.9h-2.4v7A10 10 0 0 0 22 12" />
                </svg>
              </a>
              {/* TikTok */}
              <a
                href="#"
                aria-label="TikTok"
                className="h-12 w-12 rounded-full border border-white/25 flex items-center justify-center"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 48 48"
                  fill="currentColor"
                >
                  <path d="M41 17.4c-3.5-.3-6.7-2-8.8-4.6V32c0 5.8-4.7 10.6-10.6 10.6-5.8 0-10.6-4.7-10.6-10.6S15.8 21.4 21.6 21.4c.7 0 1.5.1 2.1.3v4.8c-.7-.3-1.4-.4-2.1-.4-3.1 0-5.6 2.5-5.6 5.6 0 3.1 2.5 5.6 5.6 5.6 3.1 0 5.6-2.5 5.6-5.6V5h5.1c1 4.1 4.5 7.3 8.7 7.7v4.7z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right: Links */}
          <div className="grid grid-cols-2 gap-12">
            <div>
              <p className="text-white/80 mb-4">Company</p>
              <ul className="space-y-3 text-white">
                <li>
                  <Link
                    href="/shop"
                    className="transition-colors hover:text-[#A33D4A]"
                  >
                    Shop
                  </Link>
                </li>
                <li>
                  <Link
                    href="/collection"
                    className="transition-colors hover:text-[#A33D4A]"
                  >
                    Collection
                  </Link>
                </li>
                {/* <li>
                  <Link
                    href="/about"
                    className="transition-colors hover:text-[#A33D4A]"
                  >
                    About
                  </Link>
                </li> */}
              </ul>
            </div>
            <div>
              <p className="text-white/80 mb-4">Policy</p>
              <ul className="space-y-3 text-white">
                <li>
                  <Link
                    href="/shipping-policy"
                    className="transition-colors hover:text-[#A33D4A]"
                  >
                    Shipping Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/return-policy"
                    className="transition-colors hover:text-[#A33D4A]"
                  >
                    Return policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="transition-colors hover:text-[#A33D4A]"
                  >
                    Privacy policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="transition-colors hover:text-[#A33D4A]"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
