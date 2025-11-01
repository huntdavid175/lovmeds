import React from "react";
import PoliciesTemplate from "../components/template/PoliciesTemplate";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Revive Botanicals",
};

const page = () => {
  return (
    <PoliciesTemplate title="Terms of Service">
      <p>
        By using our website, you agree to the following terms and conditions.
      </p>
    </PoliciesTemplate>
  );
};

export default page;
