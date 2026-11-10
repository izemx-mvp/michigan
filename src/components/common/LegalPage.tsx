import type { ReactNode } from "react";
import { Breadcrumbs } from "./Breadcrumbs";

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="container-page py-10 md:py-14">
      <Breadcrumbs items={[{ label: title }]} />
      <div className="mx-auto mt-8 max-w-3xl">
        <h1 className="text-3xl font-extrabold text-navy-900 sm:text-4xl">{title}</h1>
        <p className="mt-4 inline-block rounded-lg bg-[#E8A33D]/15 px-3 py-1.5 text-sm font-semibold text-[#8a5a12]">
          À compléter — texte provisoire à faire valider par un conseil juridique.
        </p>
        <div className="prose-michigan mt-8">{children}</div>
      </div>
    </section>
  );
}
