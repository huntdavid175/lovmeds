import CollectionGridClient, {
  CollectionProduct,
} from "./CollectionGridClient";
import { supabase } from "../lib/database";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
  }).format(amount);
};

export default async function CollectionGrid({
  categoryParam,
}: {
  categoryParam: string;
}) {
  let items: CollectionProduct[] = [];

  try {
    const slugOriginal = decodeURIComponent(
      (categoryParam || "").trim()
    ).toLowerCase();

    if (!slugOriginal) {
      return <CollectionGridClient items={[]} />;
    }

    // First, find the category by slug
    const { data: categoryData, error: categoryError } = await supabase
      .from("product_categories")
      .select("id")
      .eq("slug", slugOriginal)
      .eq("is_active", true)
      .single();

    if (categoryError || !categoryData) {
      return <CollectionGridClient items={[]} />;
    }

    // Fetch products in this category
    const { data: productsData, error: productsError } = await supabase
      .from("product_category_relations")
      .select(`
        product_id,
        products (*)
      `)
      .eq("category_id", categoryData.id);

    if (productsError) throw productsError;

    items = (productsData || [])
      .filter((rel: any) => rel.products)
      .map((rel: any) => {
        const product = rel.products;
        const sellingPrice = product.sale_price ?? product.normal_price;
        return {
          title: product.title,
          price: formatCurrency(parseFloat(sellingPrice.toString())),
          imageUrl: product.image_url || "",
          rating: 5,
          slug: product.slug || undefined,
        };
      });
  } catch (error) {
    console.error("Error fetching products by category:", error);
  }

  return <CollectionGridClient items={items} />;
}
