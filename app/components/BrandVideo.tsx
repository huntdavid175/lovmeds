import BrandVideoClient from "./BrandVideoClient";
// import { gqlRequest } from "../lib/wpClient";

// type BrandVideoQuery = {
//   posts: {
//     edges: Array<{
//       node: {
//         id: string;
//         video?: {
//           videoUrl?: string | null;
//           videoCardTitle?: string | null;
//         } | null;
//       };
//     }>;
//   };
// };

// const QUERY = `
//   query NewQuery {
//     posts(where: {name: "video"}) {
//       edges {
//         node {
//           id
//           video {
//             videoUrl
//             videoCardTitle
//           }
//         }
//       }
//     }
//   }
// `;

export default async function BrandVideoServer() {
  let videoUrl: string | undefined;
  let titleHtml: string | undefined;

  try {
    // const data = await gqlRequest<BrandVideoQuery>(QUERY);
    // const node = data?.posts?.edges?.[0]?.node?.video;
    // if (node) {
    //   videoUrl = node.videoUrl || undefined;
    //   titleHtml = node.videoCardTitle || undefined;
    // }
  } catch (_) {}

  return <BrandVideoClient videoUrl={videoUrl} titleHtml={titleHtml} />;
}
