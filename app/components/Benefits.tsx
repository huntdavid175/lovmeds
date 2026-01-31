import BenefitsClient, { BenefitItem } from "./BenefitsClient";
// import { gqlRequest } from "../lib/wpClient";

// type BenefitsQuery = {
//   posts: {
//     edges: Array<{
//       node: {
//         id: string;
//         benefits?: {
//           benefitsTitle?: string | null;
//           benefitDescription?: string | null;
//           before1?: {
//             node?: {
//               altText?: string | null;
//               sourceUrl?: string | null;
//               link?: string | null;
//             } | null;
//           } | null;
//           after1?: {
//             node?: {
//               altText?: string | null;
//               sourceUrl?: string | null;
//               link?: string | null;
//             } | null;
//           } | null;
//           before2?: {
//             node?: {
//               altText?: string | null;
//               sourceUrl?: string | null;
//               link?: string | null;
//             } | null;
//           } | null;
//           after2?: {
//             node?: {
//               altText?: string | null;
//               sourceUrl?: string | null;
//               link?: string | null;
//             } | null;
//           } | null;
//           before3?: {
//             node?: {
//               altText?: string | null;
//               sourceUrl?: string | null;
//               link?: string | null;
//             } | null;
//           } | null;
//           after3?: {
//             node?: {
//               altText?: string | null;
//               sourceUrl?: string | null;
//               link?: string | null;
//             } | null;
//           } | null;
//         } | null;
//       };
//     }>;
//   };
// };

// const QUERY = `
//   query NewQuery {
//     posts(where: {name: "before and after"}) {
//       edges {
//         node {
//           id
//           benefits {
//             after1 { node { altText sourceUrl link } }
//             after2 { node { altText sourceUrl link } }
//             after3 { node { altText sourceUrl link } }
//             before1 { node { altText sourceUrl link } }
//             before2 { node { altText sourceUrl link } }
//             before3 { node { altText sourceUrl link } }
//             benefitDescription
//             benefitsTitle
//           }
//         }
//       }
//     }
//   }
// `;

// function toSrc(
//   node?: { sourceUrl?: string | null; link?: string | null } | null
// ) {
//   return node?.sourceUrl || node?.link || "";
// }

export default async function BenefitsServer() {
  let items: BenefitItem[] = [];
  let title = "Your Skin\nDeserves the Best";
  let description =
    "Discover clean, effective skincare products designed to nourish and rejuvenate your skin. Made with nature's finest ingredients for a radiant, healthy glow";

  try {
    // const data = await gqlRequest<BenefitsQuery>(QUERY);
    // const node = data?.posts?.edges?.[0]?.node?.benefits;
    // if (node) {
    //   title = node.benefitsTitle || title;
    //   description = node.benefitDescription || description;

    //   const pairs: Array<[any, any]> = [
    //     [node.before1?.node, node.after1?.node],
    //     [node.before2?.node, node.after2?.node],
    //     [node.before3?.node, node.after3?.node],
    //   ];
    //   const sorted: BenefitItem[] = [];
    //   for (const [b, a] of pairs) {
    //     if (b)
    //       sorted.push({
    //         src: toSrc(b),
    //         alt: b.altText,
    //         label: /after/i.test(b.altText || "") ? "After" : "Before",
    //       });
    //     if (a)
    //       sorted.push({
    //         src: toSrc(a),
    //         alt: a.altText,
    //         label: /before/i.test(a.altText || "") ? "Before" : "After",
    //       });
    //   }
    //   items = sorted.filter((i) => i.src);
    // }
  } catch (_) {}

  return (
    <BenefitsClient title={title} description={description} items={items} />
  );
}
