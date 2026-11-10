import type { ReactNode } from "react";
import { AirBands } from "@/components/brand/AirBands";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  subtitle?: ReactNode;
  image?: string;
  imageAlt?: string;
  crumbs: Crumb[];
  children?: ReactNode;
};

/** Dark hero band used by interior pages. */
export function PageHero({ eyebrow, title, subtitle, image, imageAlt = "", crumbs, children }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-900 text-white">
      {image && (
        <img
          src={image}
          alt={imageAlt}
          width={1920}
          height={800}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
      )}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-900 via-navy-900/85 to-navy-900/30" />
      <AirBands variant="dark" animated className="absolute -bottom-10 left-0 -z-10 h-48 w-full opacity-70" />
      <div className="container-page py-14 md:py-24">
        <Breadcrumbs items={crumbs} tone="dark" />
        <div className="mt-8 max-w-2xl">
          <p className="eyebrow text-sky-300">{eyebrow}</p>
          <h1 className="mt-3 text-4xl font-extrabold leading-tight sm:text-5xl">{title}</h1>
          {subtitle && <p className="mt-5 text-lg leading-relaxed text-white/80">{subtitle}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}
