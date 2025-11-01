import type { Metadata } from "next";
import ProductPageClient from "./ProductPageClient";

export async function generateMetadata({
  params,
}: {
  params: { id?: string };
}): Promise<Metadata> {
  const slug = typeof params?.id === "string" ? params.id : "";
  const pretty = slug
    ? slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    : "Product";
  return { title: `${pretty} | Revive Botanicals` };
}

export default function ProductPage({ params }: { params: { id: string } }) {
  return <ProductPageClient id={params.id} />;
}
