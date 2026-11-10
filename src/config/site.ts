/**
 * Public business configuration for Michigan Air Technology.
 * Every value marked PLACEHOLDER must be replaced before going live.
 */

export type SiteFigure = { value: number; prefix?: string; suffix?: string; label: string };

export type SpaceType = "chambre" | "salon" | "bureau" | "commerce";

export type SiteConfig = {
  name: string;
  tagline: string;
  /** Public base URL, used for canonical links, sitemap and JSON-LD. */
  url: string;
  distributor: { name: string; url: string; shopUrl: string };
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  mapsEmbedUrl: string;
  hours: string;
  socials: { facebook: string; instagram: string; linkedin: string; youtube: string };
  showPrices: boolean;
  paymentNote: string;
  delivery: string;
  warranty: string;
  figures: SiteFigure[];
  estimator: { wattsPerM2: Record<SpaceType, number> };
  logo: string;
  logoWhite: string;
  ogImage: string;
};

export const site: SiteConfig = {
  name: "Michigan Air Technology",
  tagline: "Le confort climatique nouvelle génération",
  url: "https://www.michigan.ma", // PLACEHOLDER — domaine définitif du site
  distributor: { name: "UMAREQ", url: "https://umareq.com", shopUrl: "https://hvac.umareq.com" },
  phone: "+212 5XX XX XX XX", // PLACEHOLDER
  whatsapp: "2126XXXXXXXX", // PLACEHOLDER (chiffres uniquement, pour wa.me)
  email: "contact@michigan.ma", // PLACEHOLDER
  address: "Adresse à compléter, Maroc", // PLACEHOLDER
  mapsEmbedUrl: "", // PLACEHOLDER — la carte est masquée si vide
  hours: "Lun – Ven : 8h30 – 18h00 · Sam : 9h00 – 13h00", // PLACEHOLDER
  socials: { facebook: "", instagram: "", linkedin: "", youtube: "" }, // icône masquée si vide
  showPrices: false,
  paymentNote: "Paiement à la livraison ou sur facture", // PLACEHOLDER
  delivery: "Livraison partout au Maroc",
  warranty: "Garantie constructeur — conditions à préciser", // PLACEHOLDER
  // PLACEHOLDER — ajoutez vos chiffres réels ; le bloc est masqué tant que la liste est vide.
  // Exemple : { value: 120, suffix: "+", label: "Références" }
  figures: [],
  // Valeurs indicatives (W/m²), modifiables.
  estimator: { wattsPerM2: { chambre: 100, salon: 120, bureau: 130, commerce: 150 } },
  logo: "", // PLACEHOLDER — ex. "/images/logo/michigan-logo.png"
  logoWhite: "", // PLACEHOLDER — ex. "/images/logo/michigan-logo-white.png"
  ogImage: "/images/divers/og-image.webp",
};

export const absoluteUrl = (path = "/") => `${site.url.replace(/\/$/, "")}${path}`;

export const telHref = `tel:${site.phone.replace(/[^\d+]/g, "")}`;
export const mailHref = `mailto:${site.email}`;
