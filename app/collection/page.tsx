import React from "react";
import type { Metadata } from "next";
import BrandVideo from "../components/BrandVideo";
import Testimonials from "../components/Testimonials";
// import CollectionHero from "../components/CollectionHero";
import ShopHero from "../components/ShopHero";
import SkinConcerns from "../components/SkinConcerns";

export const metadata: Metadata = {
  title: "Collections | Revive Botanicals",
};

const page = () => {
  return (
    <main className="max-w-[1498px]  mx-auto md:px-6 px-4 pb-16">
      <ShopHero title="Shop by Skin Concerns" />
      <SkinConcerns />
      <BrandVideo />
      <Testimonials />
    </main>
  );
};

export default page;
