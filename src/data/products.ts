import type { Universe } from "./categories";

export type ProductSpec = { label: string; value: string };

export type Product = {
  id: string;
  slug: string;
  name: string;
  sku: string;
  universe: Universe;
  /** Sub-category slug. */
  category: string;
  shortDescription: string;
  description: string;
  specs: ProductSpec[];
  /** Used by the catalogue filters. */
  attributes: { puissance?: string; type?: string; [k: string]: string | undefined };
  price: number | null;
  availability: "disponible" | "sur-commande";
  images: string[];
  datasheetUrl?: string;
  featured?: boolean;
  variants?: { sku: string; label: string; slug: string }[];
};

const TBD = "À compléter";

/* ------------------------------------------------------------------ */
/* Rooftops — real Michigan models (capacities known, other specs TBD) */
/* ------------------------------------------------------------------ */

const ROOFTOP_CAPACITIES = ["7.5", "10", "12.5", "15", "17.5", "20", "25", "30"] as const;

const rooftopSlug = (rt: string) => `rooftop-michigan-${rt.replace(".", "-")}-rt`;

const rooftopVariants = ROOFTOP_CAPACITIES.map((rt) => ({
  sku: "RMIC-À-COMPLÉTER",
  label: `Rooftop Michigan ${rt} RT`,
  slug: rooftopSlug(rt),
}));

const rooftops: Product[] = ROOFTOP_CAPACITIES.map((rt) => {
  const extraLarge = rt === "25" || rt === "30";
  return {
    id: `rooftop-${rt.replace(".", "-")}`,
    slug: rooftopSlug(rt),
    name: `Rooftop Michigan ${rt} RT`,
    sku: "RMIC-À-COMPLÉTER", // PLACEHOLDER — référence exacte RMIC-XX à compléter
    universe: "climatisation",
    category: "rooftop",
    shortDescription: `Unité de climatisation de toiture monobloc d'une capacité de ${rt} RT, pensée pour les grands volumes.`,
    description: `Le Rooftop Michigan ${rt} RT est une unité de climatisation monobloc installée en toiture. Ce type d'équipement regroupe l'ensemble des composants frigorifiques dans un seul caisson et se raccorde au réseau de gaines du bâtiment. Il convient aux surfaces commerciales, bâtiments tertiaires, salles polyvalentes et locaux industriels. Les caractéristiques techniques détaillées de ce modèle sont communiquées sur demande par nos équipes.`,
    specs: [
      { label: "Capacité frigorifique", value: `${rt} RT` },
      { label: "Puissance frigorifique (kW)", value: TBD },
      { label: "Puissance calorifique (kW)", value: TBD },
      { label: "Fluide frigorigène", value: TBD },
      { label: "Alimentation électrique", value: TBD },
      { label: "Débit d'air", value: TBD },
      { label: "Dimensions (L × l × H)", value: TBD },
      { label: "Poids", value: TBD },
    ],
    attributes: { puissance: `${rt} RT`, type: "Monobloc toiture" },
    price: null,
    availability: "sur-commande", // À confirmer
    images: extraLarge
      ? ["/images/produits/rooftop-extra-large.webp"]
      : ["/images/produits/rooftop-large.webp", "/images/produits/rooftop-large-v2.webp"],
    featured: rt === "10" || rt === "20" || rt === "30",
    variants: rooftopVariants,
  };
});

/* ------------------------------------------------------------------ */
/* Sample products                                                    */
/* ------------------------------------------------------------------ */

type SampleInput = {
  id: string;
  name: string;
  universe: Universe;
  category: string;
  image: string;
  shortDescription: string;
  description: string;
  attributes: Product["attributes"];
  specs?: ProductSpec[];
  availability?: Product["availability"];
  featured?: boolean;
};

const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const sample = (p: SampleInput): Product => ({
  id: p.id,
  slug: slugify(p.name),
  name: p.name,
  sku: "À-COMPLÉTER",
  universe: p.universe,
  category: p.category,
  shortDescription: p.shortDescription,
  description: p.description,
  specs: p.specs ?? [
    ...(p.attributes.puissance ? [{ label: "Puissance", value: p.attributes.puissance }] : []),
    ...(p.attributes.type ? [{ label: "Type", value: p.attributes.type }] : []),
    { label: "Alimentation électrique", value: TBD },
    { label: "Dimensions", value: TBD },
    { label: "Poids", value: TBD },
  ],
  attributes: p.attributes,
  price: null,
  availability: p.availability ?? "disponible",
  images: [p.image],
  ...(p.featured ? { featured: true } : {}),
});

const IMG = {
  split: "/images/produits/climatiseur-split-mural.webp",
  gainable: "/images/produits/climatiseur-gainable.webp",
  cassette: "/images/produits/climatiseur-cassette.webp",
  armoire: "/images/produits/climatiseur-armoire.webp",
  mobile: "/images/produits/climatiseur-mobile.webp",
  cuivre: "/images/produits/tube-cuivre.webp",
  gaine: "/images/produits/gaines-flexibles.webp",
  extraction: "/images/produits/caisson-extraction.webp",
  airNeuf: "/images/produits/caisson-air-neuf.webp",
  desenfumage: "/images/produits/caisson-desenfumage.webp",
};

// CONTENU EXEMPLE À REMPLACER — produits d'exemple, à remplacer par le catalogue réel.
const samples: Product[] = [
  // CONTENU EXEMPLE À REMPLACER
  sample({
    id: "split-9000",
    name: "Split mural Michigan 9 000 BTU",
    universe: "climatisation",
    category: "split-mural",
    image: IMG.split,
    shortDescription: "Climatiseur split mural pour chambres et petites pièces.",
    description:
      "Climatiseur split mural composé d'une unité intérieure murale et d'une unité extérieure. Adapté aux chambres et petites pièces. Caractéristiques détaillées à compléter.",
    attributes: { puissance: "9 000 BTU", type: "Inverter" },
  }),
  // CONTENU EXEMPLE À REMPLACER
  sample({
    id: "split-12000",
    name: "Split mural Michigan 12 000 BTU",
    universe: "climatisation",
    category: "split-mural",
    image: IMG.split,
    shortDescription: "Climatiseur split mural pour chambres et séjours.",
    description:
      "Climatiseur split mural adapté aux chambres et séjours de taille moyenne. Caractéristiques détaillées à compléter.",
    attributes: { puissance: "12 000 BTU", type: "Inverter" },
    featured: true,
  }),
  // CONTENU EXEMPLE À REMPLACER
  sample({
    id: "split-18000",
    name: "Split mural Michigan 18 000 BTU",
    universe: "climatisation",
    category: "split-mural",
    image: IMG.split,
    shortDescription: "Climatiseur split mural pour salons et bureaux.",
    description:
      "Climatiseur split mural pour salons, bureaux et pièces de vie plus grandes. Caractéristiques détaillées à compléter.",
    attributes: { puissance: "18 000 BTU", type: "Inverter" },
    availability: "sur-commande",
  }),
  // CONTENU EXEMPLE À REMPLACER
  sample({
    id: "gainable-24000",
    name: "Gainable Michigan 24 000 BTU",
    universe: "climatisation",
    category: "gainable",
    image: IMG.gainable,
    shortDescription: "Climatisation gainable discrète pour plusieurs pièces.",
    description:
      "Unité gainable installée en faux plafond, distribuant l'air via un réseau de gaines. Caractéristiques détaillées à compléter.",
    attributes: { puissance: "24 000 BTU", type: "Inverter" },
    featured: true,
  }),
  // CONTENU EXEMPLE À REMPLACER
  sample({
    id: "gainable-36000",
    name: "Gainable Michigan 36 000 BTU",
    universe: "climatisation",
    category: "gainable",
    image: IMG.gainable,
    shortDescription: "Gainable pour grands appartements et plateaux de bureaux.",
    description:
      "Unité gainable pour les grandes surfaces résidentielles ou tertiaires. Caractéristiques détaillées à compléter.",
    attributes: { puissance: "36 000 BTU", type: "Inverter" },
    availability: "sur-commande",
  }),
  // CONTENU EXEMPLE À REMPLACER
  sample({
    id: "cassette-18000",
    name: "Cassette 4 voies Michigan 18 000 BTU",
    universe: "climatisation",
    category: "cassette",
    image: IMG.cassette,
    shortDescription: "Cassette de plafond à diffusion 4 voies.",
    description:
      "Cassette encastrée en faux plafond, diffusant l'air dans quatre directions. Caractéristiques détaillées à compléter.",
    attributes: { puissance: "18 000 BTU", type: "4 voies" },
  }),
  // CONTENU EXEMPLE À REMPLACER
  sample({
    id: "cassette-24000",
    name: "Cassette 4 voies Michigan 24 000 BTU",
    universe: "climatisation",
    category: "cassette",
    image: IMG.cassette,
    shortDescription: "Cassette 4 voies pour commerces et salles de réunion.",
    description:
      "Cassette 4 voies pour les commerces, bureaux et salles de réunion. Caractéristiques détaillées à compléter.",
    attributes: { puissance: "24 000 BTU", type: "4 voies" },
    featured: true,
  }),
  // CONTENU EXEMPLE À REMPLACER
  sample({
    id: "armoire-48000",
    name: "Armoire Michigan 48 000 BTU",
    universe: "climatisation",
    category: "armoire",
    image: IMG.armoire,
    shortDescription: "Climatiseur armoire pour grands espaces ouverts.",
    description:
      "Unité verticale posée au sol pour salles de réception, showrooms et espaces ouverts. Caractéristiques détaillées à compléter.",
    attributes: { puissance: "48 000 BTU", type: "Armoire" },
    featured: true,
  }),
  // CONTENU EXEMPLE À REMPLACER
  sample({
    id: "armoire-60000",
    name: "Armoire Michigan 60 000 BTU",
    universe: "climatisation",
    category: "armoire",
    image: IMG.armoire,
    shortDescription: "Armoire haute capacité pour salles et ateliers.",
    description:
      "Climatiseur armoire pour les grands volumes. Caractéristiques détaillées à compléter.",
    attributes: { puissance: "60 000 BTU", type: "Armoire" },
    availability: "sur-commande",
  }),
  // CONTENU EXEMPLE À REMPLACER
  sample({
    id: "mobile-9000",
    name: "Climatiseur mobile Michigan 9 000 BTU",
    universe: "climatisation",
    category: "mobile",
    image: IMG.mobile,
    shortDescription: "Climatiseur d'appoint, sans installation fixe.",
    description:
      "Climatiseur mobile sur roulettes pour un rafraîchissement d'appoint. Caractéristiques détaillées à compléter.",
    attributes: { puissance: "9 000 BTU", type: "Mobile" },
  }),
  // CONTENU EXEMPLE À REMPLACER
  sample({
    id: "mobile-12000",
    name: "Climatiseur mobile Michigan 12 000 BTU",
    universe: "climatisation",
    category: "mobile",
    image: IMG.mobile,
    shortDescription: "Climatiseur mobile pour pièces de taille moyenne.",
    description:
      "Climatiseur mobile pour les pièces de taille moyenne. Caractéristiques détaillées à compléter.",
    attributes: { puissance: "12 000 BTU", type: "Mobile" },
    featured: true,
  }),
  // CONTENU EXEMPLE À REMPLACER
  sample({
    id: "tube-cuivre-1-4",
    name: "Tube cuivre Michigan 1/4\"",
    universe: "climatisation",
    category: "tube-cuivre",
    image: IMG.cuivre,
    shortDescription: "Tube cuivre pour liaisons frigorifiques.",
    description:
      "Tube cuivre destiné aux liaisons frigorifiques des systèmes split. Longueur, épaisseur et conditionnement à compléter.",
    attributes: { type: "Tube cuivre", diametre: "1/4\"" },
    specs: [
      { label: "Diamètre", value: "1/4\"" },
      { label: "Épaisseur", value: TBD },
      { label: "Longueur / conditionnement", value: TBD },
    ],
  }),
  // CONTENU EXEMPLE À REMPLACER
  sample({
    id: "tube-cuivre-3-8",
    name: "Tube cuivre Michigan 3/8\"",
    universe: "climatisation",
    category: "tube-cuivre",
    image: IMG.cuivre,
    shortDescription: "Tube cuivre pour liaisons frigorifiques.",
    description:
      "Tube cuivre destiné aux liaisons frigorifiques des systèmes split. Longueur, épaisseur et conditionnement à compléter.",
    attributes: { type: "Tube cuivre", diametre: "3/8\"" },
    specs: [
      { label: "Diamètre", value: "3/8\"" },
      { label: "Épaisseur", value: TBD },
      { label: "Longueur / conditionnement", value: TBD },
    ],
  }),
  // CONTENU EXEMPLE À REMPLACER
  sample({
    id: "gaine-160",
    name: "Gaine flexible Michigan Ø 160",
    universe: "climatisation",
    category: "gaines-flexibles",
    image: IMG.gaine,
    shortDescription: "Gaine flexible pour raccordement de bouches.",
    description:
      "Gaine flexible pour le raccordement des bouches de soufflage et de reprise. Matériau, isolation et longueur à compléter.",
    attributes: { type: "Gaine flexible", diametre: "Ø 160" },
    specs: [
      { label: "Diamètre", value: "Ø 160" },
      { label: "Matériau", value: TBD },
      { label: "Isolation", value: TBD },
      { label: "Longueur", value: TBD },
    ],
  }),
  // CONTENU EXEMPLE À REMPLACER
  sample({
    id: "gaine-200",
    name: "Gaine flexible Michigan Ø 200",
    universe: "climatisation",
    category: "gaines-flexibles",
    image: IMG.gaine,
    shortDescription: "Gaine flexible pour réseaux de distribution d'air.",
    description:
      "Gaine flexible pour réseaux de distribution d'air. Matériau, isolation et longueur à compléter.",
    attributes: { type: "Gaine flexible", diametre: "Ø 200" },
    specs: [
      { label: "Diamètre", value: "Ø 200" },
      { label: "Matériau", value: TBD },
      { label: "Isolation", value: TBD },
      { label: "Longueur", value: TBD },
    ],
  }),
  // CONTENU EXEMPLE À REMPLACER
  sample({
    id: "ce-400",
    name: "Caisson d'extraction Michigan CE-400",
    universe: "ventilation",
    category: "caissons-extraction",
    image: IMG.extraction,
    shortDescription: "Caisson d'extraction pour locaux tertiaires et commerciaux.",
    description:
      "Caisson d'extraction destiné à l'évacuation de l'air vicié. Débit, pression et niveau sonore à compléter.",
    attributes: { type: "Extraction" },
    specs: [
      { label: "Type", value: "Extraction" },
      { label: "Débit d'air", value: TBD },
      { label: "Pression disponible", value: TBD },
      { label: "Alimentation électrique", value: TBD },
      { label: "Niveau sonore", value: TBD },
    ],
    featured: true,
  }),
  // CONTENU EXEMPLE À REMPLACER
  sample({
    id: "ce-800",
    name: "Caisson d'extraction Michigan CE-800",
    universe: "ventilation",
    category: "caissons-extraction",
    image: IMG.extraction,
    shortDescription: "Caisson d'extraction pour cuisines professionnelles et parkings.",
    description:
      "Caisson d'extraction pour les applications à débit plus important. Caractéristiques à compléter.",
    attributes: { type: "Extraction" },
    specs: [
      { label: "Type", value: "Extraction" },
      { label: "Débit d'air", value: TBD },
      { label: "Pression disponible", value: TBD },
      { label: "Alimentation électrique", value: TBD },
      { label: "Niveau sonore", value: TBD },
    ],
    availability: "sur-commande",
    featured: true,
  }),
  // CONTENU EXEMPLE À REMPLACER
  sample({
    id: "can-400",
    name: "Caisson d'air neuf Michigan CAN-400",
    universe: "ventilation",
    category: "caissons-air-neuf",
    image: IMG.airNeuf,
    shortDescription: "Apport d'air neuf filtré pour bureaux et commerces.",
    description:
      "Caisson d'insufflation d'air neuf avec filtration. Débit, classe de filtration et caractéristiques à compléter.",
    attributes: { type: "Air neuf" },
    specs: [
      { label: "Type", value: "Air neuf" },
      { label: "Débit d'air", value: TBD },
      { label: "Filtration", value: TBD },
      { label: "Alimentation électrique", value: TBD },
    ],
    featured: true,
  }),
  // CONTENU EXEMPLE À REMPLACER
  sample({
    id: "can-800",
    name: "Caisson d'air neuf Michigan CAN-800",
    universe: "ventilation",
    category: "caissons-air-neuf",
    image: IMG.airNeuf,
    shortDescription: "Caisson d'air neuf pour bâtiments tertiaires.",
    description: "Caisson d'air neuf pour bâtiments tertiaires. Caractéristiques à compléter.",
    attributes: { type: "Air neuf" },
    specs: [
      { label: "Type", value: "Air neuf" },
      { label: "Débit d'air", value: TBD },
      { label: "Filtration", value: TBD },
      { label: "Alimentation électrique", value: TBD },
    ],
    featured: true,
  }),
  // CONTENU EXEMPLE À REMPLACER
  sample({
    id: "cd-400",
    name: "Caisson de désenfumage Michigan CD-400",
    universe: "ventilation",
    category: "caissons-desenfumage",
    image: IMG.desenfumage,
    shortDescription: "Caisson d'extraction des fumées pour bâtiments recevant du public.",
    description:
      "Caisson de désenfumage destiné à l'extraction des fumées en cas d'incendie. Classement de résistance au feu et caractéristiques à compléter et à valider selon la réglementation applicable.",
    attributes: { type: "Désenfumage" },
    specs: [
      { label: "Type", value: "Désenfumage" },
      { label: "Débit d'air", value: TBD },
      { label: "Résistance au feu", value: TBD },
      { label: "Alimentation électrique", value: TBD },
    ],
    availability: "sur-commande",
    featured: true,
  }),
  // CONTENU EXEMPLE À REMPLACER
  sample({
    id: "cd-800",
    name: "Caisson de désenfumage Michigan CD-800",
    universe: "ventilation",
    category: "caissons-desenfumage",
    image: IMG.desenfumage,
    shortDescription: "Caisson de désenfumage pour parkings et grands volumes.",
    description:
      "Caisson de désenfumage pour les grands volumes. Caractéristiques à compléter et à valider selon la réglementation applicable.",
    attributes: { type: "Désenfumage" },
    specs: [
      { label: "Type", value: "Désenfumage" },
      { label: "Débit d'air", value: TBD },
      { label: "Résistance au feu", value: TBD },
      { label: "Alimentation électrique", value: TBD },
    ],
    availability: "sur-commande",
    featured: true,
  }),
];

export const products: Product[] = [...rooftops, ...samples];

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

export const getProductBySlug = (slug: string) => products.find((p) => p.slug === slug);

export const getProductById = (id: string) => products.find((p) => p.id === id);

/** Accepts a sub-category slug or a universe slug. */
export const getProductsByCategory = (slug: string) =>
  products.filter((p) => p.category === slug || p.universe === slug);

export const getFeatured = (universe?: Universe, limit = 8) =>
  products.filter((p) => p.featured && (!universe || p.universe === universe)).slice(0, limit);

export const getRooftops = () => rooftops;

const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

export function searchProducts(q: string, limit?: number) {
  const terms = normalize(q).trim().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];
  const results = products.filter((p) => {
    const haystack = normalize(
      [p.name, p.sku, p.category, p.universe, p.shortDescription, ...Object.values(p.attributes)]
        .filter(Boolean)
        .join(" "),
    );
    return terms.every((t) => haystack.includes(t));
  });
  return limit ? results.slice(0, limit) : results;
}

/** Converts a "puissance" attribute to a comparable BTU number (1 RT = 12 000 BTU). */
export function powerToBtu(puissance?: string): number {
  if (!puissance) return 0;
  const n = parseFloat(puissance.replace(/\s/g, "").replace(",", "."));
  if (Number.isNaN(n)) return 0;
  return /RT/i.test(puissance) ? n * 12000 : n;
}
