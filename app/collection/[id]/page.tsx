import Testimonials from "@/app/components/Testimonials";
import BrandVideo from "@/app/components/BrandVideo";
import CollectionGrid from "@/app/components/CollectionGrid";
import CollectionHero from "@/app/components/CollectionHero";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id?: string }>;
}): Promise<Metadata> {
  const awaited = await params;
  const slug = typeof awaited?.id === "string" ? awaited.id : "";
  const pretty = slug
    ? slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    : "Collections";
  return { title: `Collections/${pretty} | Revive Botanicals` };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ id?: string }>;
}) {
  const awaited = await params;
  const slug = typeof awaited?.id === "string" ? awaited.id : "";

  return (
    <main className="max-w-[1498px]  mx-auto md:px-6 px-4 pb-16">
      <CollectionHero />
      <CollectionGrid categoryParam={slug} />
      <BrandVideo />
      <Testimonials />
    </main>
  );
}
