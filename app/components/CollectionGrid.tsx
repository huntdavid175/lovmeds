import CollectionGridClient, {
  CollectionProduct,
} from "./CollectionGridClient";
import { gqlRequest } from "../lib/wpClient";

type ProductsByCategoryQuery = {
  products?: {
    edges?: Array<{
      node: {
        id?: string | null;
        name?: string | null;
        __typename?: string;
        price?: string | null;
        regularPrice?: string | null;
        featuredImage?: { node?: { sourceUrl?: string | null } | null } | null;
        databaseId?: number | null;
        slug?: string | null;
      };
    }> | null;
  } | null;
};

const QUERY = `
  query NewQuery($category: String!) {
    products(where: { category: $category }) {
      edges {
        node {
          id
          databaseId
          slug
          name
          ... on SimpleProduct {
            id
            name
            featuredImage { node { sourceUrl } }
            price
            regularPrice
          }
        }
      }
    }
  }
`;

const CATEGORY_FALLBACK_QUERY = `
  query CategoryProducts($slug: [String]) {
    productCategories(where: { slug: $slug }) {
      nodes {
        products {
          edges {
            node {
              id
              name
              slug
              databaseId
              ... on SimpleProduct {
                id
                name
                featuredImage { node { sourceUrl } }
                price
                regularPrice
              }
            }
          }
        }
      }
    }
  }
`;

export default async function CollectionGrid({
  categoryParam,
}: {
  categoryParam: string;
}) {
  // Normalize slug: lowercase and remove hyphens for the query; keep original for fallback
  const slugOriginal = decodeURIComponent(
    (categoryParam || "").trim()
  ).toLowerCase();
  const category = slugOriginal.replace(/-/g, "");

  let items: CollectionProduct[] = [];
  try {
    if (!category) {
      return <CollectionGridClient items={[]} />;
    }
    // GraphQL fetch commented out
    // const data = await gqlRequest<ProductsByCategoryQuery>(QUERY, { category });
    const data = null as any;
    let edges: any[] = [];
    // if (edges.length === 0) {
    //   const alt = await gqlRequest<any>(CATEGORY_FALLBACK_QUERY, {
    //     slug: [slugOriginal],
    //   });
    //   edges = alt?.productCategories?.nodes?.[0]?.products?.edges || [];
    // }
    items = edges.map((e: { node?: any }) => {
      const n: any = e?.node ? e.node : {};
      const title: string = n?.name || "Product";
      const imageUrl: string = n?.featuredImage?.node?.sourceUrl || "";
      const priceRaw: unknown = n?.price ?? n?.regularPrice ?? "$0.00";
      const price: string =
        typeof priceRaw === "string" ? priceRaw : `$${priceRaw}`;
      const productId: number | undefined =
        typeof n?.databaseId === "number" ? n.databaseId : undefined;
      const slug: string | undefined =
        typeof n?.slug === "string" ? n.slug : undefined;
      return { title, price, imageUrl, rating: 5, productId, slug };
    });
  } catch (e) {
    throw e;
  }

  return <CollectionGridClient items={items} />;
}
