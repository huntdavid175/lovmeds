import React from "react";
import PoliciesTemplate from "../components/template/PoliciesTemplate";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Revive Botanicals",
};

const page = () => {
  return (
    <PoliciesTemplate title="Privacy Policy">
      <p>
        We respect your privacy and are committed to protecting your personal
        information.
      </p>
    </PoliciesTemplate>
  );
};

export default page;
