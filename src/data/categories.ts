export type Universe = "climatisation" | "ventilation";

export type Category = {
  slug: string;
  name: string;
  /** Universe this category belongs to. For universe entries, equals slug. */
  universe: Universe;
  kind: "universe" | "subcategory";
  /** Menu grouping label (e.g. "Split système"). */
  group?: string;
  shortDescription: string;
  image: string;
  seoTitle: string;
  seoText: string[];
};

export const universes: Category[] = [
  {
    slug: "climatisation",
    name: "Climatisation",
    universe: "climatisation",
    kind: "universe",
    shortDescription:
      "Rooftops, split systèmes et accessoires frigorifiques pour l'habitat, le tertiaire et l'industrie.",
    image: "/images/accueil/univers-climatisation.webp",
    seoTitle: "Climatisation : rooftops, split systèmes et accessoires",
    seoText: [
      "La gamme climatisation Michigan Air Technology couvre les besoins du résidentiel, du tertiaire et de l'industrie : unités rooftop pour les grands volumes, split systèmes muraux, gainables, cassettes, armoires et climatiseurs mobiles.",
      "Les accessoires d'installation — tube cuivre et gaines flexibles — complètent l'offre pour réaliser un chantier complet. Nos équipes vous accompagnent dans le choix et le dimensionnement de votre installation partout au Maroc.",
    ],
  },
  {
    slug: "ventilation",
    name: "Ventilation",
    universe: "ventilation",
    kind: "universe",
    shortDescription:
      "Caissons d'extraction, d'air neuf et de désenfumage pour un air sain et des bâtiments conformes.",
    image: "/images/accueil/univers-ventilation.webp",
    seoTitle: "Ventilation : caissons d'extraction, d'air neuf et de désenfumage",
    seoText: [
      "La ventilation est essentielle à la qualité de l'air intérieur et au confort des occupants. Michigan Air Technology propose des caissons d'extraction, des caissons d'air neuf et des caissons de désenfumage adaptés aux bâtiments tertiaires, commerciaux et industriels.",
      "Chaque projet de ventilation est spécifique : nos conseillers techniques vous aident à sélectionner l'équipement adapté au débit et à l'usage de votre bâtiment.",
    ],
  },
];

export const subcategories: Category[] = [
  {
    slug: "rooftop",
    name: "Rooftop",
    universe: "climatisation",
    kind: "subcategory",
    shortDescription: "Unités de toiture monobloc pour les grands volumes et les bâtiments tertiaires.",
    image: "/images/produits/rooftop-large.webp",
    seoTitle: "Rooftop Michigan : climatisation de toiture de 7.5 à 30 RT",
    seoText: [
      "Les unités rooftop Michigan sont des climatiseurs monoblocs installés en toiture, conçus pour traiter de grands volumes : surfaces commerciales, entrepôts, salles polyvalentes ou bâtiments tertiaires.",
      "La gamme se décline de 7.5 à 30 RT afin de s'adapter à la taille et à l'usage de chaque bâtiment. Contactez-nous pour une étude de dimensionnement.",
    ],
  },
  {
    slug: "split-mural",
    name: "Split mural",
    universe: "climatisation",
    kind: "subcategory",
    group: "Split système",
    shortDescription: "La solution de référence pour les chambres, salons et petits bureaux.",
    image: "/images/produits/climatiseur-split-mural.webp",
    seoTitle: "Climatiseur split mural",
    seoText: [
      "Le split mural est la solution la plus répandue pour climatiser une pièce : chambre, salon ou bureau. Il associe une unité intérieure murale à une unité extérieure.",
    ],
  },
  {
    slug: "gainable",
    name: "Gainable",
    universe: "climatisation",
    kind: "subcategory",
    group: "Split système",
    shortDescription: "Climatisation discrète par réseau de gaines, idéale pour plusieurs pièces.",
    image: "/images/produits/climatiseur-gainable.webp",
    seoTitle: "Climatiseur gainable",
    seoText: [
      "Le climatiseur gainable se dissimule dans un faux plafond et distribue l'air par un réseau de gaines et de bouches. Il permet de traiter plusieurs pièces en toute discrétion.",
    ],
  },
  {
    slug: "cassette",
    name: "Cassette",
    universe: "climatisation",
    kind: "subcategory",
    group: "Split système",
    shortDescription: "Diffusion homogène depuis le plafond pour commerces et bureaux.",
    image: "/images/produits/climatiseur-cassette.webp",
    seoTitle: "Climatiseur cassette",
    seoText: [
      "Encastrée dans le faux plafond, la cassette diffuse l'air dans plusieurs directions pour un confort homogène dans les commerces, bureaux et salles de réunion.",
    ],
  },
  {
    slug: "armoire",
    name: "Armoire",
    universe: "climatisation",
    kind: "subcategory",
    group: "Split système",
    shortDescription: "Unités verticales puissantes pour salles et grands espaces ouverts.",
    image: "/images/produits/climatiseur-armoire.webp",
    seoTitle: "Climatiseur armoire",
    seoText: [
      "Le climatiseur armoire est une unité verticale posée au sol, adaptée aux grands espaces ouverts comme les salles de réception, showrooms ou ateliers.",
    ],
  },
  {
    slug: "mobile",
    name: "Mobile",
    universe: "climatisation",
    kind: "subcategory",
    group: "Split système",
    shortDescription: "Rafraîchissement d'appoint, sans installation fixe.",
    image: "/images/produits/climatiseur-mobile.webp",
    seoTitle: "Climatiseur mobile",
    seoText: [
      "Le climatiseur mobile offre un rafraîchissement d'appoint sans travaux d'installation. Il se déplace facilement d'une pièce à l'autre.",
    ],
  },
  {
    slug: "tube-cuivre",
    name: "Tube cuivre",
    universe: "climatisation",
    kind: "subcategory",
    shortDescription: "Liaisons frigorifiques pour l'installation des systèmes split.",
    image: "/images/produits/tube-cuivre.webp",
    seoTitle: "Tube cuivre pour climatisation",
    seoText: [
      "Le tube cuivre assure la liaison frigorifique entre l'unité intérieure et l'unité extérieure d'un système split. Le choix du diamètre dépend de l'équipement installé.",
    ],
  },
  {
    slug: "gaines-flexibles",
    name: "Gaines flexibles",
    universe: "climatisation",
    kind: "subcategory",
    shortDescription: "Gaines pour réseaux de distribution d'air et raccordements.",
    image: "/images/produits/gaines-flexibles.webp",
    seoTitle: "Gaines flexibles",
    seoText: [
      "Les gaines flexibles permettent de raccorder les bouches de soufflage et de reprise aux équipements de climatisation ou de ventilation.",
    ],
  },
  {
    slug: "caissons-extraction",
    name: "Caissons d'extraction",
    universe: "ventilation",
    kind: "subcategory",
    shortDescription: "Évacuation de l'air vicié des locaux tertiaires, commerciaux et industriels.",
    image: "/images/produits/caisson-extraction.webp",
    seoTitle: "Caissons d'extraction",
    seoText: [
      "Le caisson d'extraction évacue l'air vicié, l'humidité et les odeurs. Il est utilisé dans les cuisines professionnelles, sanitaires collectifs, parkings et locaux techniques.",
    ],
  },
  {
    slug: "caissons-air-neuf",
    name: "Caissons d'air neuf",
    universe: "ventilation",
    kind: "subcategory",
    shortDescription: "Apport d'air extérieur filtré pour un air intérieur sain.",
    image: "/images/produits/caisson-air-neuf.webp",
    seoTitle: "Caissons d'air neuf",
    seoText: [
      "Le caisson d'air neuf insuffle de l'air extérieur filtré dans le bâtiment afin de renouveler l'air intérieur et d'équilibrer les débits avec l'extraction.",
    ],
  },
  {
    slug: "caissons-desenfumage",
    name: "Caissons de désenfumage",
    universe: "ventilation",
    kind: "subcategory",
    shortDescription: "Extraction des fumées en cas d'incendie pour protéger les occupants.",
    image: "/images/produits/caisson-desenfumage.webp",
    seoTitle: "Caissons de désenfumage",
    seoText: [
      "Le caisson de désenfumage extrait les fumées en cas d'incendie afin de faciliter l'évacuation des occupants et l'intervention des secours. Son choix doit être validé par un professionnel selon la réglementation applicable au bâtiment.",
    ],
  },
];

export const allCategories: Category[] = [...universes, ...subcategories];

export const getCategoryBySlug = (slug: string) => allCategories.find((c) => c.slug === slug);

export const getSubcategories = (universe: Universe) =>
  subcategories.filter((c) => c.universe === universe);

export const getUniverse = (universe: Universe) =>
  universes.find((u) => u.slug === universe) as Category;

/** Menu structure: groups sub-categories (e.g. "Split système"). */
export function getMenuGroups(universe: Universe) {
  const subs = getSubcategories(universe);
  const groups: { label: string | null; items: Category[] }[] = [];
  for (const sub of subs) {
    const label = sub.group ?? null;
    const existing = groups.find((g) => g.label === label && label !== null);
    if (existing) existing.items.push(sub);
    else groups.push({ label, items: [sub] });
  }
  return groups;
}
