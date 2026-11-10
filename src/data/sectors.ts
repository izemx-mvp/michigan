export type Sector = {
  slug: string;
  title: string;
  shortTitle: string;
  image: string;
  imageAlt: string;
  secondaryImage?: string;
  secondaryImageAlt?: string;
  challenge: string;
  benefits: string[];
  recommendedCategories: string[];
};

export const sectors: Sector[] = [
  {
    slug: "hotellerie",
    title: "Hôtellerie",
    shortTitle: "Hôtellerie",
    image: "/images/secteurs/secteur-hotellerie-lobby.webp",
    imageAlt: "Lobby d'hôtel climatisé",
    challenge:
      "Offrir un confort constant aux clients dans les chambres, les halls et les espaces communs, avec des équipements discrets et silencieux.",
    benefits: [
      "Solutions discrètes pour les chambres et les espaces de réception",
      "Climatisation des grands volumes (halls, salles de séminaire)",
      "Renouvellement d'air pour les espaces communs",
      "Accompagnement technique pour le dimensionnement",
    ],
    recommendedCategories: ["gainable", "cassette", "split-mural", "caissons-air-neuf"],
  },
  {
    slug: "sante",
    title: "Santé",
    shortTitle: "Santé",
    image: "/images/secteurs/secteur-sante.webp",
    imageAlt: "Espace de soins climatisé",
    challenge:
      "Maintenir une température maîtrisée et un air renouvelé dans les cliniques, cabinets et laboratoires, où le confort et la qualité de l'air sont prioritaires.",
    benefits: [
      "Apport d'air neuf filtré",
      "Extraction de l'air vicié",
      "Diffusion homogène par cassettes ou gainables",
      "Conseil sur le choix des équipements adaptés",
    ],
    recommendedCategories: ["caissons-air-neuf", "caissons-extraction", "cassette", "gainable"],
  },
  {
    slug: "restauration",
    title: "Restauration & CHR",
    shortTitle: "Restauration & CHR",
    image: "/images/secteurs/secteur-restauration-chr.webp",
    imageAlt: "Salle de restaurant climatisée",
    challenge:
      "Concilier le confort des salles avec l'extraction des cuisines professionnelles, en gérant chaleur, odeurs et renouvellement d'air.",
    benefits: [
      "Extraction pour cuisines professionnelles",
      "Compensation par caissons d'air neuf",
      "Climatisation des salles et terrasses couvertes",
      "Rooftops pour les grandes surfaces de restauration",
    ],
    recommendedCategories: ["caissons-extraction", "caissons-air-neuf", "cassette", "rooftop"],
  },
  {
    slug: "industrie",
    title: "Industrie",
    shortTitle: "Industrie",
    image: "/images/secteurs/secteur-industrie.webp",
    imageAlt: "Bâtiment industriel équipé de climatisation",
    secondaryImage: "/images/secteurs/secteur-industrie-rooftop.webp",
    secondaryImageAlt: "Unités rooftop installées sur un toit industriel",
    challenge:
      "Traiter de grands volumes, évacuer la chaleur des process et assurer la sécurité des bâtiments, avec des équipements robustes.",
    benefits: [
      "Rooftops de 7.5 à 30 RT pour les grands volumes",
      "Extraction et apport d'air neuf pour ateliers et entrepôts",
      "Caissons de désenfumage pour la sécurité incendie",
      "Accompagnement technique de l'étude à la mise en service",
    ],
    recommendedCategories: ["rooftop", "caissons-extraction", "caissons-desenfumage", "armoire"],
  },
  {
    slug: "tertiaire",
    title: "Tertiaire & bureaux",
    shortTitle: "Tertiaire",
    image: "/images/secteurs/secteur-tertiaire-bureaux.webp",
    imageAlt: "Plateau de bureaux climatisé",
    challenge:
      "Garantir le confort et la productivité des équipes dans les open spaces, bureaux individuels et salles de réunion, tout en maîtrisant la consommation énergétique.",
    benefits: [
      "Cassettes et gainables pour les plateaux de bureaux",
      "Splits muraux pour les bureaux individuels",
      "Rooftops pour les immeubles et grands plateaux",
      "Ventilation pour la qualité de l'air intérieur",
    ],
    recommendedCategories: ["cassette", "gainable", "split-mural", "rooftop", "caissons-air-neuf"],
  },
];

export const getSector = (slug: string) => sectors.find((s) => s.slug === slug);
