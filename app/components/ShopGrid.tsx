import ShopGridClient, { ClientProduct } from "./ShopGridClient";
import { supabase } from "../lib/database";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
  }).format(amount);
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-/]/g, "")
    .trim()
    .replace(/\s+/g, "-");

export default async function ShopGrid() {
  const filterMap = new Map<string, string>(); // key -> label
  filterMap.set("all", "All");

  let products: ClientProduct[] = [];

  try {
    // Fetch products with their categories
    const { data: productsData, error: productsError } = await supabase
      .from("products")
      .select(`
        *,
        product_category_relations (
          category_id,
          product_categories (id, name, slug)
        )
      `)
      .order("created_at", { ascending: false });

    if (productsError) throw productsError;

    // Fetch all active categories for filters
    const { data: categoriesData } = await supabase
      .from("product_categories")
      .select("id, name, slug")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .order("name", { ascending: true });

    // Build filter map from categories
    if (categoriesData) {
      categoriesData.forEach((cat) => {
        const key = slugify(cat.name);
        filterMap.set(key, cat.name);
      });
    }

    // Transform products with category keys
    products = (productsData || []).map((product: any) => {
      const sellingPrice = product.sale_price ?? product.normal_price;
      const categoryKeys: string[] = [];
      
      if (product.product_category_relations) {
        product.product_category_relations.forEach((rel: any) => {
          if (rel.product_categories) {
            const catSlug = slugify(rel.product_categories.name);
            if (catSlug && !categoryKeys.includes(catSlug)) {
              categoryKeys.push(catSlug);
            }
          }
        });
      }

      return {
        title: product.title,
        price: formatCurrency(parseFloat(sellingPrice.toString())),
        imageUrl: product.image_url || "",
        rating: 5,
        categoryKeys,
        slug: product.slug || undefined,
      };
    });
  } catch (error) {
    console.error("Error fetching products:", error);
  }

  const filters = Array.from(filterMap, ([key, label]) => ({ key, label }));

  return <ShopGridClient products={products} filters={filters} />;
}
