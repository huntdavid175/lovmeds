import type { Metadata } from "next";
import BrandVideo from "../components/BrandVideo";
import Testimonials from "../components/Testimonials";
import AboutMission from "../components/AboutMission";
import AboutVision from "../components/AboutVision";
import AboutStory from "../components/AboutStory";
import { gqlRequest } from "../lib/wpClient";

export const metadata: Metadata = {
  title: "About | Revive Botanicals",
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

export const revalidate = 60;

export default async function AboutPage() {
  let missionText: string | undefined;
  let visionText: string | undefined;
  let storyText: string | undefined;
  let missionImage: string | undefined;
  let visionImage: string | undefined;
  let storyImage: string | undefined;

  try {
    const data = await gqlRequest<AboutQuery>(ABOUT_QUERY);
    const about = data?.pages?.edges?.[0]?.node?.about;
    missionText = about?.missionText || undefined;
    visionText = about?.visionText || undefined;
    storyText = about?.ourStoryText || undefined;
    missionImage = about?.missionImage?.node?.sourceUrl || undefined;
    visionImage = about?.visionImage?.node?.sourceUrl || undefined;
    storyImage = about?.ourStoryImage?.node?.sourceUrl || undefined;
  } catch (_) {}

  return (
    <main className="max-w-[1498px]  mx-auto md:px-6 px-4 pb-16">
      <AboutMission text={missionText} imageUrl={missionImage} />
      <AboutVision text={visionText} imageUrl={visionImage} />
      <AboutStory text={storyText} imageUrl={storyImage} />
      <BrandVideo />
      <Testimonials />
    </main>
  );
}
