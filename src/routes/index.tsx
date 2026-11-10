import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { Hero } from "@/components/home/Hero";
import { Estimator } from "@/components/home/Estimator";
import {
  FeaturedProducts,
  FinalCta,
  LatestPosts,
  MarqueeBand,
  RooftopSpotlight,
  SectorsSection,
  SubcategoryRail,
  UmareqBand,
  UniversesSection,
  WhyMichigan,
} from "@/components/home/Sections";

export const Route = createFileRoute("/")({
  head: () =>
    seo({
      title: "Climatisation & ventilation au Maroc",
      description:
        "Climatisation et ventilation pour l'habitat, le tertiaire et l'industrie au Maroc : rooftops de 7.5 à 30 RT, split systèmes, caissons et accessoires. Distribué par UMAREQ.",
      path: "/",
    }),
  component: Index,
});

function Index() {
  return (
    <div className="overflow-x-clip">
      <Hero />
      <MarqueeBand />
      <UniversesSection />
      <SubcategoryRail />
      <FeaturedProducts />
      <Estimator />
      <WhyMichigan />
      <SectorsSection />
      <UmareqBand />
      <RooftopSpotlight />
      <LatestPosts />
      <FinalCta />
    </div>
  );
}