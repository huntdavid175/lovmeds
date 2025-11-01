import type { Metadata } from "next";
import BrandVideo from "../components/BrandVideo";
import Testimonials from "../components/Testimonials";
import AboutMission from "../components/AboutMission";
import AboutVision from "../components/AboutVision";
import AboutStory from "../components/AboutStory";

export const metadata: Metadata = {
  title: "About | Revive Botanicals",
};

export default function AboutPage() {
  return (
    <main className="max-w-[1498px]  mx-auto md:px-6 px-4 pb-16">
      <AboutMission />
      <AboutVision />
      <AboutStory />
      <BrandVideo />
      <Testimonials />
    </main>
  );
}
