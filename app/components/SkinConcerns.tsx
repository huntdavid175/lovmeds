import SkinConcernsClient, { SkinConcernItem } from "./SkinConcernsClient";
import { gqlRequest } from "../lib/wpClient";

type SkinConcernsProps = { title?: string };

type CategoriesQuery = {
  productCategories?: {
    nodes?: Array<{
      name?: string | null;
      slug?: string | null;
      image?: { sourceUrl?: string | null } | null;
    }> | null;
  } | null;
};

const QUERY = `
  query NewQuery {
    productCategories{
      nodes {
        image { sourceUrl }
          name
          slug
        }
      }
  }
`;

export default async function SkinConcerns({ title }: SkinConcernsProps) {
  let items: SkinConcernItem[] = [];
  try {
    const data = await gqlRequest<CategoriesQuery>(QUERY);
    const nodes = data?.productCategories?.nodes || [];
    items = nodes
      .filter((n) => (n?.name || "").trim())
      .map((n) => ({
        title: n?.name || "",
        imageUrl: n?.image?.sourceUrl || "",
        slug: (n?.slug || n?.name || "")
          .toString()
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
      }))
      .filter((i) => i.title && i.imageUrl && i.slug);
  } catch (_) {}

  return <SkinConcernsClient title={title} items={items} />;
}
