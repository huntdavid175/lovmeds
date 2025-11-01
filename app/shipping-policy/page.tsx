import React from "react";
import PoliciesTemplate from "../components/template/PoliciesTemplate";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy | Revive Botanicals",
};

const page = () => {
  return (
    <PoliciesTemplate title="Shipping Policy">
      <p>
        We offer free shipping on all orders over $100 within Canada and US.
      </p>
    </PoliciesTemplate>
  );
};

export default page;
