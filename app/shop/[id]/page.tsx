import type { Metadata } from "next";
import ProductPageClient from "./ProductPageClient";
import Benefits from "@/app/components/Benefits";
import { supabase } from "@/app/lib/database";
import RecommendedProducts from "@/app/components/RecommendedProducts";

export const revalidate = 3600; // ISR window (1 hour)

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
    : "Product";
  return { title: `${pretty} | LovMeds` };
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
  }).format(amount);
};

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const awaited = await params;
  const slug = typeof awaited?.id === "string" ? awaited.id : "";
  let productData: any | undefined;
  let recommendedItems: {
    title: string;
    price: string;
    imageUrl: string;
    rating: number;
    slug?: string;
  }[] = [];

  try {
    // Fetch product by slug
    const { data: product, error } = await supabase
      .from("products")
      .select(`
        *,
        product_variants (*)
      `)
      .eq("slug", slug)
      .single();

    if (error || !product) {
      return (
        <main className="max-w-[1498px] mx-auto md:px-6 px-4 pb-16">
          <div className="text-center py-12">
            <p className="text-black/60">Product not found</p>
          </div>
        </main>
      );
    }

    // Build images array
    const images: string[] = [];
    if (product.image_url) {
      images.push(product.image_url);
    }

    const sellingPrice = product.sale_price ?? product.normal_price;

    // Fetch categories for this product
    const { data: categoryRelations } = await supabase
      .from("product_category_relations")
      .select(`
        category_id,
        product_categories (id, name, slug)
      `)
      .eq("product_id", product.id);

    const categories = (categoryRelations || [])
      .map((rel: any) => rel.product_categories)
      .filter(Boolean)
      .map((cat: any) => cat.name)
      .join(", ");

    productData = {
      id: product.slug || slug,
      numericId: product.id,
      title: product.title,
      price: parseFloat(sellingPrice.toString()),
      normalPrice: parseFloat(product.normal_price.toString()),
      salePrice: product.sale_price ? parseFloat(product.sale_price.toString()) : undefined,
      category: categories || "",
      description: product.description || "",
      media: images.map((src) => ({ type: "image" as const, src })),
      stock: product.stock,
      variants: (product.product_variants || []).map((v: any) => ({
        name: v.name,
        price: parseFloat(v.price.toString()),
        salePrice: v.sale_price ? parseFloat(v.sale_price.toString()) : undefined,
      })),
    };

    // Fetch recommended products (exclude current, limit to 4)
    const { data: recommended } = await supabase
      .from("products")
      .select("*")
      .neq("id", product.id)
      .limit(4)
      .order("created_at", { ascending: false });

    recommendedItems = (recommended || []).map((p) => {
      const price = p.sale_price ?? p.normal_price;
      return {
        title: p.title,
        price: formatCurrency(parseFloat(price.toString())),
        imageUrl: p.image_url || "",
        rating: 5,
        slug: p.slug || undefined,
      };
    });
  } catch (e) {
    console.error("Error fetching product:", e);
    return (
      <main className="max-w-[1498px] mx-auto md:px-6 px-4 pb-16">
        <div className="text-center py-12">
          <p className="text-black/60">Error loading product</p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-[1498px]  mx-auto md:px-6 px-4 pb-16">
      <ProductPageClient id={slug} product={productData} />
      {/* <Benefits /> */}
      <RecommendedProducts items={recommendedItems} />
    </main>
  );
}
