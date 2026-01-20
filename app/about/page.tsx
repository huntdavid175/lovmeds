import type { Metadata } from "next";
import BrandVideo from "../components/BrandVideo";
import Testimonials from "../components/Testimonials";
import AboutMission from "../components/AboutMission";
import AboutVision from "../components/AboutVision";
import AboutStory from "../components/AboutStory";
// import { gqlRequest } from "../lib/wpClient";

export const metadata: Metadata = {
  title: "About | LovMeds",
};

type AboutQuery = {
  pages?: {
    edges?: Array<{
      node?: {
        id?: string;
        about?: {
          visionText?: string | null;
          ourStoryText?: string | null;
          missionText?: string | null;
          ourStoryImage?: {
            node?: { sourceUrl?: string | null } | null;
          } | null;
          missionImage?: { node?: { sourceUrl?: string | null } | null } | null;
          visionImage?: { node?: { sourceUrl?: string | null } | null } | null;
        } | null;
      } | null;
    }> | null;
  } | null;
};

const ABOUT_QUERY = `
  query NewQuery {
    pages(where: {name: "about"}) {
      edges {
        node {
          id
          about {
            visionText
            ourStoryText
            missionText
            ourStoryImage { node { sourceUrl } }
            missionImage { node { sourceUrl } }
            visionImage { node { sourceUrl } }
          }
        }
      }
    }
  }
`;

export const revalidate = 3600;

export default async function AboutPage() {
  // About page commented out
  // let missionText: string | undefined;
  // let visionText: string | undefined;
  // let storyText: string | undefined;
  // let missionImage: string | undefined;
  // let visionImage: string | undefined;
  // let storyImage: string | undefined;

  // try {
  //   const data = await gqlRequest<AboutQuery>(ABOUT_QUERY);
  //   const about = data?.pages?.edges?.[0]?.node?.about;
  //   missionText = about?.missionText || undefined;
  //   visionText = about?.visionText || undefined;
  //   storyText = about?.ourStoryText || undefined;
  //   missionImage = about?.missionImage?.node?.sourceUrl || undefined;
  //   visionImage = about?.visionImage?.node?.sourceUrl || undefined;
  //   storyImage = about?.ourStoryImage?.node?.sourceUrl || undefined;
  // } catch (_) {}

  return (
    <main className="max-w-[1498px]  mx-auto md:px-6 px-4 pb-16">
      {/* About page commented out */}
      {/* <AboutMission text={missionText} imageUrl={missionImage} />
      <AboutVision text={visionText} imageUrl={visionImage} />
      <AboutStory text={storyText} imageUrl={storyImage} />
      <BrandVideo />
      <Testimonials /> */}
      <div className="text-center py-24">
        <h1 className="font-heading text-4xl text-black mb-4">About Page</h1>
        <p className="text-black/60">This page is currently unavailable.</p>
      </div>
    </main>
  );
}
