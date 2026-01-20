import BestSellersClient, { BestSellerItem } from "./BestSellersClient";
import { gqlRequest } from "../lib/wpClient";

type ProductsQuery = {
  products?: {
    edges?: Array<{
      node: {
        featured?: boolean | null;
        name?: string | null;
        __typename?: string;
        id?: string | null;
        slug?: string | null;
        databaseId?: number | null;
        featuredImage?: { node?: { sourceUrl?: string | null } | null } | null;
        price?: string | null;
        regularPrice?: string | null;
      };
    }> | null;
  } | null;
};

const QUERY = `
  query NewQuery {
    products (where: {featured: true}, first: 5) {
      edges {
        node {
          featured
          slug
          databaseId
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

function toSrc(
  img?: { sourceUrl?: string | null; link?: string | null } | null
) {
  return img?.sourceUrl || img?.link || "";
}

export default async function BestSellersServer() {
  let items: BestSellerItem[] = [];

  // GraphQL fetch commented out
  // try {
  //   const data = await gqlRequest<ProductsQuery>(QUERY);
  //   const edges = data?.products?.edges || [];
  //   const featured = edges.filter((e) => e?.node?.featured);
  //   items = featured.map((e) => {
  //     const n = e.node as any;
  //     const title: string = n?.name || "Product";
  //     const imageUrl: string = n?.featuredImage?.node?.sourceUrl || "";
  //     const priceRaw: unknown = n?.price ?? n?.regularPrice ?? "$0.00";
  //     const price: string =
  //       typeof priceRaw === "string" ? priceRaw : `$${priceRaw}`;
  //     const productId: number | undefined =
  //       typeof n?.databaseId === "number" ? n.databaseId : undefined;
  //     const slug: string | undefined =
  //       typeof n?.slug === "string" ? n.slug : undefined;
  //     return { title, price, imageUrl, rating: 5, productId, slug };
  //   });
  // } catch (_) {}

  return <BestSellersClient items={items} />;
}
