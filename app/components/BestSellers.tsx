import BestSellersClient, { BestSellerItem } from "./BestSellersClient";
import { supabase } from "../lib/database";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
  }).format(amount);
};

export default async function BestSellersServer() {
  let items: BestSellerItem[] = [];

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("featured", true)
      .limit(8)
      .order("created_at", { ascending: false });

    if (error) throw error;

    items = (data || []).map((product) => {
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
    console.error("Error fetching best sellers:", error);
  }

  return <BestSellersClient items={items} />;
}
