import { absoluteUrl, site } from "@/config/site";

type SeoInput = {
  title: string;
  description: string;
  path: string;
  image?: string | undefined;
  type?: "website" | "article" | "product";
  noindex?: boolean;
  /** JSON-LD objects to embed. */
  jsonLd?: Record<string, unknown>[];
};

const SUFFIX = ` | ${site.name}`;

/** Builds the head() object for a route: title, description, canonical, OG, Twitter, JSON-LD. */
export function seo({ title, description, path, image, type = "website", noindex, jsonLd }: SeoInput) {
  const fullTitle = title.endsWith(site.name) ? title : `${title}${SUFFIX}`;
  const url = absoluteUrl(path);
  const img = absoluteUrl(image ?? site.ogImage);
  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      ...(noindex ? [{ name: "robots", content: "noindex, follow" }] : []),
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:type", content: type === "product" ? "website" : type },
      { property: "og:url", content: url },
      { property: "og:image", content: img },
      { property: "og:locale", content: "fr_MA" },
      { property: "og:site_name", content: site.name },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: fullTitle },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: img },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: (jsonLd ?? []).map((data) => ({
      type: "application/ld+json",
      children: JSON.stringify(data),
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function organizationJsonLd() {
  const sameAs = Object.values(site.socials).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    logo: site.logo ? absoluteUrl(site.logo) : undefined,
    email: site.email,
    telephone: site.phone,
    ...(sameAs.length ? { sameAs } : {}),
  };
}
