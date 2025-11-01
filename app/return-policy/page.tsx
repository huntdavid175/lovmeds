import React from "react";
import PoliciesTemplate from "../components/template/PoliciesTemplate";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy | Revive Botanicals",
};

const page = () => {
  return (
    <PoliciesTemplate title="Return Policy">
      <p>
        If you are not satisfied with your purchase, you can return it within 30
        days of receipt.
      </p>
    </PoliciesTemplate>
  );
};

export default page;
