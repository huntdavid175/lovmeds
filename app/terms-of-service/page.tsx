import React from "react";
import PoliciesTemplate from "../components/template/PoliciesTemplate";
import type { Metadata } from "next";
// import { gqlRequest } from "../lib/wpClient";

export const metadata: Metadata = {
  title: "Terms of Service | LovMeds",
};

// type TermsQuery = {
//   pages?: {
//     edges?: Array<{
//       node?: { id?: string; content?: string | null } | null;
//     }> | null;
//   } | null;
// };

// const TERMS_QUERY = `
//   query NewQuery {
//     pages(where: {name: "terms of service"}) {
//       edges { node { id content } }
//     }
//   }
// `;

export const revalidate = 3600;

const page = async () => {
  let contentHtml: string | undefined;
  try {
    // const data = await gqlRequest<TermsQuery>(TERMS_QUERY);
    // contentHtml = data?.pages?.edges?.[0]?.node?.content || undefined;
  } catch (_) {}

  return (
    <PoliciesTemplate title="Terms of Service">
      {contentHtml ? (
        <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
      ) : (
        <p>
          By using our website, you agree to the following terms and conditions.
        </p>
      )}
    </PoliciesTemplate>
  );
};

export default page;
