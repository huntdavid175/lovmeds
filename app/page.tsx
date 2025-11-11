import type { Metadata } from "next";
import Hero from "./components/Hero";
import Benefits from "./components/Benefits";
import BestSellers from "./components/BestSellers";
import SkinConcerns from "./components/SkinConcerns";
import BrandVideo from "./components/BrandVideo";
import Testimonials from "./components/Testimonials";
import { gqlRequest } from "./lib/wpClient";

export const metadata: Metadata = {
  title: "Home | LovMeds",
};

// type HomeQuery = {
//   pages: {
//     edges: Array<{
//       node: {
//         pageId: number;
//         slug: string;
//         featuredImage?: { node?: { sourceUrl?: string | null } | null };
//         homeFields?: { herotitle?: string | null } | null;
//       };
//     }>;
//   };
// };

// type AvatarsQuery = {
//   post?: {
//     id?: string;
//     avatars?: {
//       customerImage1?: { node?: { sourceUrl?: string | null } | null } | null;
//       customerImage2?: { node?: { sourceUrl?: string | null } | null } | null;
//       customerImage3?: { node?: { sourceUrl?: string | null } | null } | null;
//       customerImage4?: { node?: { sourceUrl?: string | null } | null } | null;
//     } | null;
//   } | null;
// };

// const HOME_QUERY = `
//   query NewQuery {
//     pages(where: {title: "home"}) {
//       edges {
//         node {
//           homeFields { herotitle }
//           featuredImage { node { sourceUrl } }
//           pageId
//           slug
//         }
//       }
//     }
//   }
// `;

// const AVATARS_QUERY = `
//   query NewQuery {
//     post(id: "customer-avatars", idType: SLUG) {
//       id
//       avatars {
//         customerImage1 { node { sourceUrl } }
//         customerImage2 { node { sourceUrl } }
//         customerImage3 { node { sourceUrl } }
//         customerImage4 { node { sourceUrl } }
//       }
//     }
//   }
// `;

export default async function Home() {
  let heroTitle: string | undefined;
  let heroImage: string | undefined;
  let avatars: string[] | undefined;
  try {
    // const [home, av] = await Promise.all([
    //   gqlRequest<HomeQuery>(HOME_QUERY),
    //   gqlRequest<AvatarsQuery>(AVATARS_QUERY),
    // ]);
    // const first = home?.pages?.edges?.[0]?.node;
    // heroTitle = first?.homeFields?.herotitle ?? undefined;
    // heroImage = first?.featuredImage?.node?.sourceUrl ?? undefined;
    // const a = av?.post?.avatars;
    // const imgs = [
    //   a?.customerImage1?.node?.sourceUrl,
    //   a?.customerImage2?.node?.sourceUrl,
    //   a?.customerImage3?.node?.sourceUrl,
    //   a?.customerImage4?.node?.sourceUrl,
    // ].filter(Boolean) as string[];
    // avatars = imgs.length ? imgs : undefined;
    return (
      <main className="max-w-[1498px]  mx-auto md:px-6 px-4 pb-16">
        <Hero
        // titleOverride={heroTitle}
        // imageOverride={heroImage}
        // avatars={avatars}
        />
        {/* <Benefits /> */}
        <BestSellers />
        <SkinConcerns title="Shop By Your Needs" />
        <BrandVideo />
        <Testimonials />
      </main>
    );
  } catch (e) {
    throw e;
  }
}
