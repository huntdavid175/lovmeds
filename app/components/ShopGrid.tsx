import ShopGridClient, { ClientProduct } from "./ShopGridClient";
import { gqlRequest } from "../lib/wpClient";

type CategoriesWithProductsQuery = {
  productCategories?: {
    nodes?: Array<{
      name?: string | null;
      products?: {
        edges?: Array<{
          node: {
            name?: string | null;
            productCategories?: {
              nodes?: Array<{ name?: string | null }> | null;
            } | null;
            productId?: number | null;
            __typename?: string;
            id?: string | null;
            featuredImage?: {
              node?: { sourceUrl?: string | null } | null;
            } | null;
            regularPrice?: string | null;
            price?: string | null;
          };
        }> | null;
      } | null;
    }> | null;
  } | null;
};

const QUERY = `
  query NewQuery {
    productCategories {
      nodes {
        name
        products {
          edges {
            node {
              name
              productCategories { nodes { name } }
              productId
              ... on SimpleProduct {
                id
                name
                featuredImage { node { sourceUrl } }
                regularPrice
                price
              }
            }
          }
        }
      }
    }
  }
`;

export default async function ShopGrid() {
  const byId = new Map<string, ClientProduct>();

  const slugify = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-/]/g, "")
      .trim()
      .replace(/\s+/g, "-");

  const filterMap = new Map<string, string>(); // key -> label
  filterMap.set("all", "All");

  try {
    const data = await gqlRequest<CategoriesWithProductsQuery>(QUERY);
    const cats = data?.productCategories?.nodes || [];
    for (const cat of cats) {
      const categoryName = (cat?.name || "").trim();
      const categoryKey = categoryName ? slugify(categoryName) : "";
      // Do not seed products with the parent category; only use product's own categories
      const edges = cat?.products?.edges || [];
      for (const e of edges) {
        const n: any = e?.node || {};
        const id: string = n?.id || String(n?.productId || "");
        if (!id) continue;
        const title: string = n?.name || "Product";
        const imageUrl: string = n?.featuredImage?.node?.sourceUrl || "";
        const priceRaw: unknown = n?.price ?? n?.regularPrice ?? "$0.00";
        const price: string =
          typeof priceRaw === "string" ? priceRaw : `$${priceRaw}`;
        const categoriesRaw: string[] = (n?.productCategories?.nodes || [])
          .map((x: any) => (x?.name || "").trim())
          .filter(Boolean);
        const categoryKeys: string[] = Array.from(
          new Set(categoriesRaw.map((nm: string) => slugify(nm)))
        );
        // Build filters from actual product categories
        for (const nm of categoriesRaw) {
          const k = slugify(nm);
          if (k) filterMap.set(k, nm);
        }
        const existing = byId.get(id);
        if (existing) {
          const merged = Array.from(
            new Set([...existing.categoryKeys, ...categoryKeys])
          );
          byId.set(id, { ...existing, categoryKeys: merged });
        } else {
          byId.set(id, {
            title,
            price,
            imageUrl,
            rating: 5,
            categoryKeys,
          });
        }
      }
    }
  } catch (e) {
    throw e;
  }

  const products = Array.from(byId.values());
  const filters = Array.from(filterMap, ([key, label]) => ({ key, label }));

  return <ShopGridClient products={products} filters={filters} />;
}
