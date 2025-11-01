import type { Metadata } from "next";
import ShopGrid from "../components/ShopGrid";
import BrandVideo from "../components/BrandVideo";
import Testimonials from "../components/Testimonials";
import ShopHero from "../components/ShopHero";
export const metadata: Metadata = {
  title: "Shop | Revive Botanicals",
};

const HERO_IMAGE_URL =
  "https://framerusercontent.com/images/Mvmwy2meoLookZmy5qqLLsuZ9A.png?width=840&height=1200";

export default function ShopPage() {
  return (
    <main className="max-w-[1498px]  mx-auto md:px-6 px-4 pb-16">
      <ShopHero
        title="Shop Revive"
        description="Browse our collection of skincare essentials crafted for every skin type and concern."
      />
      <ShopGrid />
      <BrandVideo />
      <Testimonials />
    </main>
  );
}
