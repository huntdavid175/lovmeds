import React from "react";
import type { Metadata } from "next";
import BrandVideo from "../components/BrandVideo";
import Testimonials from "../components/Testimonials";
// import CollectionHero from "../components/CollectionHero";
import ShopHero from "../components/ShopHero";
import { gqlRequest } from "../lib/wpClient";
import SkinConcerns from "../components/SkinConcerns";

export const metadata: Metadata = {
  title: "Collections | Revive Botanicals",
};

type CollectionHeroQuery = {
  pages: {
    edges: Array<{
      node: {
        title?: string | null;
        featuredImage?: { node?: { sourceUrl?: string | null } | null } | null;
      };
    }>;
  };
};

const COLLECTIONS_HERO_QUERY = `
  query NewQuery {
    pages(where: { title: "collections" }) {
      edges {
        node {
          title
          featuredImage { node { sourceUrl } }
        }
      }
    }
  }
`;

const page = async () => {
  let heroTitle: string | undefined;
  let heroImage: string | undefined;
  try {
    const data = await gqlRequest<CollectionHeroQuery>(COLLECTIONS_HERO_QUERY);
    const node = data?.pages?.edges?.[0]?.node;
    heroTitle = node?.title ?? undefined;
    heroImage = node?.featuredImage?.node?.sourceUrl ?? undefined;
  } catch (e) {
    throw e;
  }

  return (
    <main className="max-w-[1498px]  mx-auto md:px-6 px-4 pb-16">
      <ShopHero
        title={heroTitle || "Shop by Skin Concerns"}
        imageUrl={heroImage}
      />
      <SkinConcerns />
      <BrandVideo />
      <Testimonials />
    </main>
  );
};

export default page;
