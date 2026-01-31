import React from "react";
import PoliciesTemplate from "../components/template/PoliciesTemplate";
import type { Metadata } from "next";
// import { gqlRequest } from "../lib/wpClient";

export const metadata: Metadata = {
  title: "Privacy Policy | LovMeds",
};

// type PrivacyPolicyQuery = {
//   pages?: {
//     edges?: Array<{
//       node?: { id?: string; content?: string | null } | null;
//     }> | null;
//   } | null;
// };

// const PRIVACY_POLICY_QUERY = `
//   query NewQuery {
//     pages(where: {name: "privacy policy"}) {
//       edges { node { id content } }
//     }
//   }
// `;

export const revalidate = 3600;

const page = async () => {
  let contentHtml: string | undefined;
  try {
    // const data = await gqlRequest<PrivacyPolicyQuery>(PRIVACY_POLICY_QUERY);
    // contentHtml = data?.pages?.edges?.[0]?.node?.content || undefined;
  } catch (_) {}

  return (
    <PoliciesTemplate title="Privacy Policy">
      {contentHtml ? (
        <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
      ) : (
        <p>
          We respect your privacy and are committed to protecting your personal
          information.
        </p>
      )}
    </PoliciesTemplate>
  );
};

export default page;
