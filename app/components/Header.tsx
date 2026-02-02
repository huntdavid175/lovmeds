"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { useCart } from "./CartProvider";

export default function Header() {
  const { open, items } = useCart();
  const count = items.reduce((sum, i) => sum + i.qty, 0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header>
      {/* Top shipping bar */}
      <motion.div
        className="bg-[#A33D4A] text-white text-center text-sm py-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        Free Shipping on orders $100 or More within Canada and US
      </motion.div>

      {/* Main nav */}
      <motion.div
        className="max-w-[1360px] mx-auto md:px-4 py-6 px-4 flex items-center justify-between gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Brand */}
        <Link
          href="/"
          className="tracking-[0.2em] text-sm font-semibold flex-shrink-0"
          onClick={closeMobileMenu}
        >
          LOVMEDS
        </Link>

        {/* Center menu (desktop) */}
        <nav className="hidden md:flex items-center gap-10 text-sm">
          <Link href="/shop" className="hover:opacity-80 transition-opacity">
            Shop
          </Link>
          <Link
            href="/collection"
            className="hover:opacity-80 transition-opacity"
          >
            Collection
          </Link>
          {/* <Link href="/about" className="hover:opacity-80 transition-opacity">
            About
          </Link> */}
        </nav>

        {/* Right icons + mobile menu toggle */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Mobile menu button */}
          <button
            type="button"
            aria-label="Toggle menu"
            className="h-10 w-10 rounded-full border border-black/10 flex items-center justify-center md:hidden"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            {/* Hamburger / close icon */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {isMobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>

          {/* Search */}
          <button
            aria-label="Search"
            className="h-10 w-10 rounded-full border border-black/10 flex items-center justify-center"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>

          {/* Cart */}
          <button
            aria-label="Cart"
            onClick={() => {
              if (count > 0) open();
            }}
            className="relative h-10 w-10 rounded-full border border-black/10 flex items-center justify-center"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 12.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {count > 0 && (
              <span className="absolute -top-2 -right-2 h-5 min-w-5 px-1 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                {count}
              </span>
            )}
          </button>
        </div>
      </motion.div>

      {/* Mobile menu dropdown */}
      {isMobileMenuOpen && (
        <motion.nav
          className="md:hidden border-t border-black/10 bg-white/95 backdrop-blur-sm"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          <div className="max-w-[1360px] mx-auto px-4 py-4 flex flex-col gap-2 text-sm">
            <Link
              href="/shop"
              className="py-2 flex items-center justify-between hover:opacity-80 transition-opacity"
              onClick={closeMobileMenu}
            >
              <span>Shop</span>
            </Link>
            <Link
              href="/collection"
              className="py-2 flex items-center justify-between hover:opacity-80 transition-opacity"
              onClick={closeMobileMenu}
            >
              <span>Collection</span>
            </Link>
            {/* <Link
              href="/about"
              className="py-2 flex items-center justify-between hover:opacity-80 transition-opacity"
              onClick={closeMobileMenu}
            >
              <span>About</span>
            </Link> */}
          </div>
        </motion.nav>
      )}
    </header>
  );
}
