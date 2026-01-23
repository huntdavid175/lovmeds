import SkinConcernsClient, { SkinConcernItem } from "./SkinConcernsClient";
import { supabase } from "../lib/database";

type SkinConcernsProps = { title?: string };

export default async function SkinConcerns({ title }: SkinConcernsProps) {
  let items: SkinConcernItem[] = [];

  try {
    const { data, error } = await supabase
      .from("product_categories")
      .select("id, name, slug, image_url")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) throw error;

    items = (data || [])
      .filter((cat) => cat.name && cat.slug)
      .map((cat) => ({
        title: cat.name,
        imageUrl: cat.image_url || "",
        slug: cat.slug,
      }))
      .filter((i) => i.title && i.slug);
  } catch (error) {
    console.error("Error fetching categories:", error);
  }

  return <SkinConcernsClient title={title} items={items} />;
}
