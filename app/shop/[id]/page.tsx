import type { Metadata } from "next";
import ProductPageClient from "./ProductPageClient";
import Benefits from "@/app/components/Benefits";
import { gqlRequest } from "@/app/lib/wpClient";
import RecommendedProducts from "@/app/components/RecommendedProducts";

export const revalidate = 60; // ISR window (seconds)

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
  return { title: `${pretty} | Revive Botanicals` };
}

type ProductBySlugQuery = {
  product?: {
    id?: string | null;
    slug?: string | null;
    featuredImage?: { node?: { sourceUrl?: string | null } | null } | null;
    galleryImages?: {
      nodes?: Array<{ sourceUrl?: string | null } | null>;
    } | null;
    __typename?: string;
    name?: string | null;
    price?: string | null;
    regularPrice?: string | null;
    description?: string | null;
    productCategories?: {
      edges?: Array<{
        node?: {
          id?: string | null;
          name?: string | null;
          slug?: string | null;
        } | null;
      }> | null;
    } | null;
  } | null;
};

const PRODUCT_QUERY = `
  query NewQuery($slug: ID!) {
    product(id: $slug, idType: SLUG) {
      id
      featuredImage { node { sourceUrl } }
      galleryImages { nodes { sourceUrl } }
      slug
      ... on SimpleProduct {
        id
        name
        price
        regularPrice
        description
      }
      productCategories { edges { node { id name slug } } }
    }
  }
`;

type ProductsByCategoryQuery = {
  products?: {
    edges?: Array<{
      node?: {
        __typename?: string;
        id?: string | null;
        slug?: string | null;
        name?: string | null;
        price?: string | null;
        regularPrice?: string | null;
        featuredImage?: { node?: { sourceUrl?: string | null } | null } | null;
      } | null;
    }> | null;
  } | null;
};

const PRODUCTS_BY_CATEGORY_QUERY = `
  query ProductsByCat($category: String!) {
    products(where: { category: $category }) {
      edges {
        node {
          ... on SimpleProduct {
            id
            slug
            name
            price
            regularPrice
            featuredImage { node { sourceUrl } }
          }
        }
      }
    }
  }
`;

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
  }[] = [];
  try {
    const data = await gqlRequest<ProductBySlugQuery>(PRODUCT_QUERY, { slug });
    const p = data?.product;
    if (p) {
      const images: string[] = [];
      const fi = p.featuredImage?.node?.sourceUrl || "";
      if (fi) images.push(fi);
      const gallery = p.galleryImages?.nodes || [];
      for (const n of gallery) {
        const u = n?.sourceUrl || "";
        if (u) images.push(u);
      }
      productData = {
        id: p.slug || slug,
        title: p.name || p.slug || slug,
        price:
          parseFloat(
            (p.price || p.regularPrice || "0")
              .toString()
              .replace(/[^0-9.]/g, "")
          ) || 0,
        category: (p.productCategories?.edges || [])
          .map((e) => (e?.node?.name || "").trim())
          .filter(Boolean)
          .map((n) =>
            n
              .split(" ")
              .filter(Boolean)
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" ")
          )
          .join(", "),
        description: (p.description || "").replace(/<[^>]+>/g, ""),
        media: images.map((src) => ({ type: "image" as const, src })),
      };

      // Build recommended from same categories (max 5, dedup, exclude current)
      const catSlugs = (p.productCategories?.edges || [])
        .map((e) => e?.node?.slug || "")
        .filter(Boolean);
      const seen = new Set<string>();
      const out: {
        title: string;
        price: string;
        imageUrl: string;
        rating: number;
        slug?: string;
      }[] = [];
      for (const c of catSlugs) {
        const rec = await gqlRequest<ProductsByCategoryQuery>(
          PRODUCTS_BY_CATEGORY_QUERY,
          { category: c }
        );
        const edges = rec?.products?.edges || [];
        for (const edge of edges) {
          const n = edge?.node;
          const pid = (n?.id || "").toString();
          const pslug = (n?.slug || "").toString();
          if (!n || !pid || pslug === slug) continue; // exclude current
          if (seen.has(pid)) continue;
          seen.add(pid);
          out.push({
            title: n?.name || pslug,
            price: (n?.price || n?.regularPrice || "$0.00") as string,
            imageUrl: n?.featuredImage?.node?.sourceUrl || "",
            rating: 5,
            slug: pslug,
          });
          if (out.length >= 4) break;
        }
        if (out.length >= 4) break;
      }
      recommendedItems = out.map(({ slug: _s, ...rest }) => rest);
    }
  } catch (e) {
    // keep ISR cache; let page render with client fallback
    throw e;
  }

  return (
    <main className="max-w-[1498px]  mx-auto md:px-6 px-4 pb-16">
      <ProductPageClient id={slug} product={productData} />
      <Benefits />
      <RecommendedProducts items={recommendedItems} />
    </main>
  );
}
