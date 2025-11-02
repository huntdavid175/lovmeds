import React from "react";
import PoliciesTemplate from "../components/template/PoliciesTemplate";
import type { Metadata } from "next";
import { gqlRequest } from "../lib/wpClient";

export const metadata: Metadata = {
  title: "Refund Policy | Revive Botanicals",
};

type RefundPolicyQuery = {
  pages?: {
    edges?: Array<{
      node?: { id?: string; content?: string | null } | null;
    }> | null;
  } | null;
};

const REFUND_POLICY_QUERY = `
  query NewQuery {
    pages(where: {name: "refund policy"}) {
      edges { node { id content } }
    }
  }
`;

export const revalidate = 3600;

const page = async () => {
  let contentHtml: string | undefined;
  try {
    const data = await gqlRequest<RefundPolicyQuery>(REFUND_POLICY_QUERY);
    contentHtml = data?.pages?.edges?.[0]?.node?.content || undefined;
  } catch (_) {}

  return (
    <PoliciesTemplate title="Return Policy">
      {contentHtml ? (
        <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
      ) : (
        <p>
          If you are not satisfied with your purchase, you can return it within
          30 days of receipt.
        </p>
      )}
    </PoliciesTemplate>
  );
};

export default page;
