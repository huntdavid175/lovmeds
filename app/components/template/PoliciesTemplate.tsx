"use client";

import { ReactNode } from "react";

type PoliciesTemplateProps = {
  title: string;
  children: ReactNode;
};

export default function PoliciesTemplate({
  title,
  children,
}: PoliciesTemplateProps) {
  return (
    <main className="max-w-[1498px]  mx-auto md:px-6 px-4 pb-16">
      <section className="bg-white rounded-3xl mt-4 overflow-hidden">
        <div className="p-6 md:p-12">
          <h1 className="font-heading text-5xl md:text-7xl text-black ls-title mb-6 md:mb-10">
            {title}
          </h1>
          <div className="prose prose-neutral max-w-none text-black/70 leading-relaxed md:leading-8 policy-content">
            {children}
          </div>
        </div>
      </section>
    </main>
  );
}
