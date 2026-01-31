import React from "react";
import PoliciesTemplate from "../components/template/PoliciesTemplate";
import type { Metadata } from "next";
// import { gqlRequest } from "../lib/wpClient";

export const metadata: Metadata = {
  title: "Shipping Policy | LovMeds",
};

// type ShippingPolicyQuery = {
//   pages?: {
//     edges?: Array<{
//       node?: { id?: string; content?: string | null } | null;
//     }> | null;
//   } | null;
// };

// const SHIPPING_POLICY_QUERY = `
//   query NewQuery {
//     pages(where: {name: "shipping policy"}) {
//       edges { node { id content } }
//     }
//   }
// `;

export const revalidate = 3600;

const page = async () => {
  let contentHtml: string | undefined;
  try {
    // const data = await gqlRequest<ShippingPolicyQuery>(SHIPPING_POLICY_QUERY);
    // contentHtml = data?.pages?.edges?.[0]?.node?.content || undefined;
  } catch (_) {}

  return (
    <PoliciesTemplate title="Shipping Policy">
      {contentHtml ? (
        <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
      ) : (
        <p>
          We offer free shipping on all orders over $100 within Canada and US.
        </p>
      )}
    </PoliciesTemplate>
  );
};

export default page;
